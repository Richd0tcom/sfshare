import { Request, Response } from "express";
import logger from "../utils/logger";
import { FileService } from "../services/file.service";
import { AuthenticatedRequest } from "../types";
import { getSocketManager } from "../services/socket.service";


export const uploadFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {

     if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { permissionLevel = 'private', tags = [], metadata = {} } = req.body;

      const file = await FileService.saveFile(
        req.file,
        req.user!.id,
        permissionLevel,
        tags,
        metadata
      );

      // If admin uploads a file, notify all connected users
      if (req.user!.role === 'admin') {
        const socketManager = getSocketManager();
        socketManager.notifyAllUsers('file_uploaded', {
          file: {
            id: file.id,
            original_name: file.original_name,
            permission_level: file.permission_level,
            owner_email: req.user!.email,
            created_at: file.created_at
          }
        });
      }

      res.status(201).json({ 
        message: 'File uploaded successfully',
        file: {
          id: file.id,
          original_name: file.original_name,
          file_size: file.file_size,
          mime_type: file.mime_type,
          permission_level: file.permission_level,
          tags: file.tags,
          metadata: file.metadata,
          created_at: file.created_at
        }
      });
    } catch (error: any) {
      logger.error('File upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  }

export const getFiles =     async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const permissionLevel = req.query.permissionLevel as string;
      const tagsParam = req.query.tags as string;
      const tags = tagsParam ? tagsParam.split(',') : undefined;

      const result = await FileService.getFiles(
        req.user!.id,
        req.user!.role,
        page,
        limit,
        search,
        permissionLevel,
        tags
      );

      res.json(result);
    } catch (error: any) {
      logger.error('File listing error:', error);
      res.status(500).json({ error: 'Failed to retrieve files' });
    }
  }

export const getSingleFile =     async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const fileId = req.params.id;
      const file = await FileService.getFileById(fileId, req.user!.id, req.user!.role);

      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      res.json({
        id: file.id,
        original_name: file.original_name,
        file_size: file.file_size,
        mime_type: file.mime_type,
        permission_level: file.permission_level,
        tags: file.tags,
        metadata: file.metadata,
        owner_id: file.owner_id,
        created_at: file.created_at,
        updated_at: file.updated_at
      });
    } catch (error: any) {
      logger.error('File get error:', error);
      res.status(500).json({ error: 'Failed to retrieve file' });
    }
  }

export const updateFileMetadata =  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {

      const fileId = req.params.id;
      const updates = {
        permission_level: req.body.permissionLevel,
        tags: req.body.tags,
        metadata: req.body.metadata
      };

      // Remove undefined values
      Object.keys(updates).forEach(key => 
        updates[key as keyof typeof updates] === undefined && delete updates[key as keyof typeof updates]
      );

      const originalFile = await FileService.getFileById(fileId, req.user!.id, req.user!.role);
      if (!originalFile) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const updatedFile = await FileService.updateFileMetadata(
        fileId,
        req.user!.id,
        req.user!.role,
        updates
      );

      if (!updatedFile) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // If admin updates metadata, notify file owner if they are online
      if (req.user!.role === 'admin' && originalFile.owner_id !== req.user!.id) {
        const socketManager = getSocketManager();
        socketManager.notifyUser(originalFile.owner_id, 'file_metadata_updated', {
          file: {
            id: updatedFile.id,
            original_name: updatedFile.original_name,
            permission_level: updatedFile.permission_level,
            tags: updatedFile.tags,
            metadata: updatedFile.metadata,
            updated_at: updatedFile.updated_at
          }
        });
      }

      res.json({ 
        message: 'File updated successfully',
        file: {
          id: updatedFile.id,
          original_name: updatedFile.original_name,
          permission_level: updatedFile.permission_level,
          tags: updatedFile.tags,
          metadata: updatedFile.metadata,
          updated_at: updatedFile.updated_at
        }
      });
    } catch (error: any) {
      logger.error('File update error:', error);
      if (error.message.includes('Insufficient permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update file' });
      }
    }
  }

