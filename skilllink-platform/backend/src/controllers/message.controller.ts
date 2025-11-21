import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { MessageService } from '../services/message.service';

const messageService = new MessageService();

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const senderId = req.user!.userId;
  const { receiverId, content } = req.body;

  const message = await messageService.sendMessage(senderId, receiverId, content);
  res.status(201).json({ success: true, data: message });
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { partnerId } = req.params;

  const messages = await messageService.getConversation(userId, partnerId);
  res.json({ success: true, data: messages });
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const conversations = await messageService.getConversations(userId);
  res.json({ success: true, data: conversations });
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { partnerId } = req.params;

  await messageService.markConversationAsRead(userId, partnerId);
  res.json({ success: true });
};
