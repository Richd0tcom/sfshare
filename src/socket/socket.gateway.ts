import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserWithAuth } from 'src/auth/dto/responses/auth.response';

interface ConnectedUser {
  userId: string;
  role: string;
  socketId: string;
}

@WebSocketGateway({
  
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private connectedUsers: Map<string, ConnectedUser> = new Map(); //recheck this to aviod mem leaks
  constructor(
  ) { }
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    const user = client.data.user as UserWithAuth

    this.connectedUsers.set(user.id, {
      userId: user.id,
      role: user.roleId,
      socketId: client.id
    });

    // client.join("file-sharing-room");
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
