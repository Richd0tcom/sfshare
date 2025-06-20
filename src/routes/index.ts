import { Router, Request, Response } from 'express';
import { auditLog } from '../common/middleware/audit';
import { authorize } from '../common/middleware/auth';
import AuthService from '../services/auth.service';
import { register } from '../handlers/auth.handler';
export const router = Router();

router.post('/register', register)
router.post('/login',)

//files
 // API routes
export const frouter = Router();
frouter.use('/auth', frouter);
//  app.use('/api/files', fileRoutes);
//  app.use('/api/audit', auditRoutes);
frouter.post('/upload',
    authorize('files', 'upload'),
    auditLog('upload', 'file'))

frouter.get('/',
    authorize('files', 'read'),
    auditLog('list', 'file'),)


frouter.get('/:id',
    authorize('files', 'read'),
    auditLog('view', 'file'),)

frouter.put('/:id',
    authorize('files', 'update'),
    auditLog('update', 'file'),)


frouter.delete('/:id',
    authorize('files', 'delete'),
    auditLog('delete', 'file'),)

export const auditrouter = Router()
auditrouter.get('/',
    authorize('audit', 'read'),)