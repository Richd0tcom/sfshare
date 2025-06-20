import { Router, Request, Response } from 'express';
import { auditLog } from '../common/middleware/audit';
import { authorize } from '../common/middleware/auth';
import AuthService from '../services/auth.service';
import { login, register } from '../handlers/auth.handler';
import { getFiles, getSingleFile, updateFileMetadata, uploadFile } from '../handlers/file.handler';
import { upload } from '../services/file.service';
export const router = Router();

router.post('/register', register)
router.post('/login', login)

//files
 // API routes
export const frouter = Router();
// frouter.use('/auth', frouter);
//  app.use('/api/files', fileRoutes);
//  app.use('/api/audit', auditRoutes);
frouter.post('/upload',
    authorize('files', 'create'),
    auditLog('upload', 'file'),
    upload.single('file'), uploadFile)

frouter.get('/',
    authorize('files', 'read'),
    auditLog('list', 'file'), getFiles)


frouter.get('/:id',
    authorize('files', 'read'),
    auditLog('view', 'file'), getSingleFile)

frouter.put('/:id',
    authorize('files', 'update'),
    auditLog('update', 'file'),updateFileMetadata)


// frouter.delete('/:id',
//     authorize('files', 'delete'),
//     auditLog('delete', 'file'),)

export const auditrouter = Router()
auditrouter.get('/',
    authorize('audit', 'read'), (req, res)=> {
        res.status(200).json({})
    })