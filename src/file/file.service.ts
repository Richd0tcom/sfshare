import { Inject, Injectable, Logger } from '@nestjs/common';
import fs from 'fs/promises';
import { encryptFile, generateEncryptionKey } from '@common/helpers/encryption';
import { CreateFileInput } from './dto/input/file.input';
import { ModelClass } from 'objection';
import { File, User } from '@common/schema';
import { ConfigService } from '@nestjs/config';
import { PermissionLevel, UserRole } from '@common/enums';
import { SocketGateway } from 'src/socket/socket.gateway';



@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(
    @Inject('File') private filemodel: ModelClass<File>,
    @Inject('User') private usermodel: ModelClass<User>,
    private configSevice: ConfigService,
    private readonly socketGateway: SocketGateway,

  ) { }
  async upload(input: CreateFileInput, file: Express.Multer.File, ownerId: string): Promise<File> {
    let encryptionKey: string | undefined;
    let finalFilePath = file.path;

    if (this.configSevice.get<string>('ENCRYPT_FILES') === 'true') {
      encryptionKey = generateEncryptionKey();
      const fileBuffer = await fs.readFile(file.path);
      const { encrypted, iv, tag } = encryptFile(fileBuffer, encryptionKey);

      const encryptedPath = `${file.path}.encrypted`;
      const encryptedData = {
        data: encrypted.toString('base64'),
        iv,
        tag
      };

      await fs.writeFile(encryptedPath, JSON.stringify(encryptedData));
      await fs.unlink(file.path); // Remove original file
      finalFilePath = encryptedPath;
    }

    const [result, user] = await Promise.all([
      this.filemodel.query().insert({
      filename: file.filename,
      originalName: file.originalname,
      filePath: finalFilePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      encryptionKey: encryptionKey,
      ownerId: ownerId,
      permissionLevel: input.permissionLevel || PermissionLevel.Private,
      tags: input.tags || [],
      metadata: JSON.stringify(input.metadata || {})
    }),
      this.usermodel.query().findById(ownerId).withGraphFetched('[role]')
    ]) 

    if(user?.role.name === UserRole.Admin) {
      this.socketGateway.notifyAllUsers('new-admin-file-available', {})
    }

    return result;
  }

  async findAll(
    userId: string,
    userRole: UserRole,
    page: number = 1,
    limit: number = 10,
    search?: string,
    permissionLevel?: string,
    tags?: string[]
  ): Promise<{ files: File[]; total: number; page: number; totalPages: number }> {

    const query = this.filemodel.query()
      .alias('f')
      .joinRelated('owner as u')
      .select('f.*', 'u.email as owner_email');

    if (userRole !== UserRole.Admin) {
      query.where(function (builder) {
        builder.where('f.ownerId', userId)
          .orWhereIn('f.permissionLevel', ['public', 'shared']);
      });
    }

    if (search) {
      query.where(function (builder) {
        builder.where('f.originalName', 'ilike', `%${search}%`)
          .orWhereRaw('tags && ARRAY[?]::varchar[]', [search]);
      });
    }

    if (permissionLevel) {
      query.where('f.permissionLevel', permissionLevel);
    }

    if (tags && tags.length > 0) {
      query.whereRaw('tags && ?', [tags]);
    }

    const total = await query.resultSize();

    const files = await query
      .orderBy('f.createdAt', 'desc')
      .page(page - 1, limit);

    const totalPages = Math.ceil(total / limit);

    return {
      files: files.results,
      total,
      page,
      totalPages
    };
  }

  async findOne(fileId: string, userId: string, userRole: string): Promise<File | null> {
    const query = this.filemodel.query()
      .alias('f')
      .joinRelated('users as u')
      .select('f.*', 'u.email as owner_email')
      .where('f.id', fileId);

    if (userRole !== UserRole.Admin) {
      query.andWhere(function (builder) {
      builder.where('f.ownerId', userId)
        .orWhereIn('f.permissionLevel', ['public', 'shared']);
      });
    }

    const file = await query.first();
    return file || null;
  }

  async update(
    fileId: string,
    userId: string,
    userRole: string,
    updates: Partial<Pick<File, 'permissionLevel' | 'tags' | 'metadata'>>
  ): Promise<File | null> {
    const file = await this.findOne(fileId, userId, userRole);
    if (!file) {
      return null;
    }

    if (file.ownerId !== userId && userRole !== 'admin') {
      throw new Error('Insufficient permissions to update file');
    }


    const updateData: Partial<File> = {};

    if (updates.permissionLevel) {
      updateData.permissionLevel = updates.permissionLevel;
    }

    if (updates.tags) {
      updateData.tags = updates.tags;
    }

    if (updates.metadata) {
      updateData.metadata = JSON.stringify(updates.metadata);
    }

    if (Object.keys(updateData).length === 0) {
      return file;
    }

    updateData.updatedAt = new Date();

    const updated = await this.filemodel
      .query()
      .patchAndFetchById(fileId, updateData);

    this.socketGateway.notifyUser(file.ownerId, 'admin-file-update', `File metadata updated: ${fileId} by user ${userId}`)

    // logger.info(`File metadata updated: ${fileId} by user ${userId}`);
    return updated;
  }

  // async remove(fileId: string, userId: string, userRole: string): Promise<boolean> {
  //   const file = await this.findOne(fileId, userId, userRole);
  //   if (!file) {
  //     return false;
  //   }

  //   if (file.owner_id !== userId && userRole !== 'admin') {
  //     throw new Error('Insufficient permissions to delete file');
  //   }

  //   await pool.query(`DELETE FROM files WHERE id = $1`, [fileId]);
  //   logger.info(`File deleted: ${fileId} by user ${userId}`);
  //   return true;
  // }
}