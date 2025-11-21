import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, string[]> = new Map();

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
      }
    });

    this.io.use(this.authenticateSocket.bind(this));
    this.io.on('connection', this.handleConnection.bind(this));

    console.log('✅ WebSocket server initialized');
  }

  private authenticateSocket(socket: AuthenticatedSocket, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  }

  private handleConnection(socket: AuthenticatedSocket) {
    const userId = socket.userId!;
    console.log(`🔌 User connected: ${userId}`);

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId)!.push(socket.id);

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${userId}`);
      const sockets = this.userSockets.get(userId) || [];
      const index = sockets.indexOf(socket.id);
      if (index > -1) {
        sockets.splice(index, 1);
      }
      if (sockets.length === 0) {
        this.userSockets.delete(userId);
      }
    });

    socket.emit('connected', { userId });
  }

  sendNotificationToUser(userId: string, notification: any) {
    const socketIds = this.userSockets.get(userId);
    if (socketIds && this.io) {
      socketIds.forEach(socketId => {
        this.io!.to(socketId).emit('notification', notification);
      });
    }
  }

  broadcast(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  sendToRoom(room: string, event: string, data: any) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }

  sendMessageToUser(userId: string, message: any) {
    const socketIds = this.userSockets.get(userId);
    if (socketIds && this.io) {
      socketIds.forEach(socketId => {
        this.io!.to(socketId).emit('new_message', message);
      });
    }
  }
}

export const websocketService = new WebSocketService();
