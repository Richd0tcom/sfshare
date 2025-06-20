import express from 'express';
  import { createServer } from 'http';
  import cors from 'cors';
  import helmet from 'helmet';
  import compression from 'compression';
  import { initCasbin } from './conf/casbin';
  import { initSocketManager } from './services/socket.service';
//   import { generalLimiter } from './middleware/rateLimiter';
 import {router, frouter, auditrouter} from './routes'
  import createTables from './db/migrate';
  import logger from './utils/logger';

  import * as routes from './routes'
  
  const app = express();
  const server = createServer(app);
  const PORT = process.env.PORT || 3000;
  
  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  }));
  app.use(compression());
//   app.use(generalLimiter);
  
  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  

  app.use('/api/auth', router);
  app.use('/api/files', frouter);
  app.use('/api/audit', auditrouter);
  
  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  
  createTables().then(async()=>{
    logger.info('Database initialized successfully');
    await initCasbin();
   logger.info('Casbin initialized successfully');
   initSocketManager(server);
  });

  export default server