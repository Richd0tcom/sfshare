import { Server as SocketIOServer } from 'socket.io';
  import { Server as HTTPServer } from 'http';
  import jwt from 'jsonwebtoken';
  import { JWTPayload } from '../types';
  import logger from '../utils/logger';


  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  
  interface ConnectedUser {
    userId: string;
    email: string;
    role: string;
    socketId: string;
  }
  
  class SocketManager {
    private io: SocketIOServer;
    private connectedUsers: Map<string, ConnectedUser> = new Map();
  
    constructor(server: HTTPServer) {
      this.io = new SocketIOServer(server, {
        cors: {
          origin: process.env.CLIENT_URL || "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      });
  
      this.setupSocketHandlers();
    }
  
    private setupSocketHandlers(): void {
      this.io.use((socket, next) => {
        try {
          const token = socket.handshake.auth.token;
          if (!token) {
            throw new Error('No token provided');
          }
  
          const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
          socket.data.user = decoded;
          next();
        } catch (error) {
          logger.error('Socket authentication error:', error);
          next(new Error('Authentication failed'));
        }
      });
  
      this.io.on('connection', (socket) => {
        const user = socket.data.user as JWTPayload;
        
        // Store connected user
        this.connectedUsers.set(user.userId, {
          userId: user.userId,
          email: user.email,
          role: user.role,
          socketId: socket.id
        });
  
        logger.info(`User connected: ${user.email} (${socket.id})`);
  
        socket.on('disconnect', () => {
          this.connectedUsers.delete(user.userId);
          logger.info(`User disconnected: ${user.email} (${socket.id})`);
        });
  
        // Send welcome message
        socket.emit('connected', { 
          message: 'Connected to file sharing service',
          userId: user.userId 
        });
      });
    }
  
    notifyAllUsers(event: string, data: any): void {
      this.io.emit(event, data);
      logger.info(`Broadcast sent: ${event} to ${this.connectedUsers.size} users`);
    }
  
    notifyUser(userId: string, event: string, data: any): void {
      const user = this.connectedUsers.get(userId);
      if (user) {
        this.io.to(user.socketId).emit(event, data);
        logger.info(`Notification sent to user ${userId}: ${event}`);
      } else {
        logger.info(`User ${userId} not connected, notification not sent: ${event}`);
      }
    }
  
    getConnectedUsers(): ConnectedUser[] {
      return Array.from(this.connectedUsers.values());
    }
  
    isUserOnline(userId: string): boolean {
      return this.connectedUsers.has(userId);
    }
  }
  
  let socketManager: SocketManager;
  
  export const initSocketManager = (server: HTTPServer): SocketManager => {
    socketManager = new SocketManager(server);
    return socketManager;
  };
  
  export const getSocketManager = (): SocketManager => {
    if (!socketManager) {
      throw new Error('Socket manager not initialized');
    }
    return socketManager;
  };