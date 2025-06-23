import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserWithAuth } from 'src/auth/dto/responses/auth.response';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SocketAuthGuard } from 'src/auth/guards/socket.guard';

interface ConnectedUser {
  userId: string;
  role: string;
  socketId: string;
}



@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private connectedUsers: Map<string, ConnectedUser> = new Map(); //recheck this to aviod mem leaks
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }
  @WebSocketServer() server: Server;

  
  handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake?.auth?.token;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.data = client.data || {};
      client.data.user = decoded;
    } catch (err) {
      client.disconnect();
      return;
    }
    const user = client.data.user as UserWithAuth
 
    this.connectedUsers.set(user.id, {
      userId: user.id,
      role: user.roleId,
      socketId: client.id
    });

    client.join("file-sharing-room");
    client.emit('connected', {
      message: 'Connected to file sharing service',
      userId: user.id
    });

  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as UserWithAuth
    this.connectedUsers.delete(user.id);
  }


  notifyAllUsers(event: string, data: any): void {
    this.server.emit(event, data);
    // logger.info(`Broadcast sent: ${event} to ${this.connectedUsers.size} users`);
  }

  notifyUser(userId: string, event: string, data: any): void {
    const user = this.connectedUsers.get(userId);
    if (user) {
      this.server.to(user.socketId).emit(event, data);
      // logger.info(`Notification sent to user ${userId}: ${event}`);
    } else {
      // logger.info(`User ${userId} not connected, notification not sent: ${event}`);
    }
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }


}
