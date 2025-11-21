import prisma from '../config/database';
import { websocketService } from './websocket.service';

export class MessageService {
  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } }
      }
    });

    // Send real-time message via WebSocket
    websocketService.sendMessageToUser(receiverId, message);

    return message;
  }

  async getConversation(userId1: string, userId2: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getConversations(userId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const conversations = new Map();
    messages.forEach(msg => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partner: msg.senderId === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      if (!msg.read && msg.receiverId === userId) {
        conversations.get(partnerId).unreadCount++;
      }
    });

    return Array.from(conversations.values());
  }

  async markAsRead(messageId: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: { read: true }
    });
  }

  async markConversationAsRead(userId: string, partnerId: string) {
    return prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: userId,
        read: false
      },
      data: { read: true }
    });
  }
}
