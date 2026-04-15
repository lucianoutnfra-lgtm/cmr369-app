import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';

export const getDashboardChats = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const chats = await prisma.chat.findMany({
      where: { tenantId },
      include: {
        lead: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(chats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const tenantId = req.user?.tenantId;

    const messages = await prisma.message.findMany({
      where: { 
        lead: {
          chat: { id: chatId, tenantId }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getKanbanData = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const stages = await prisma.funnelStage.findMany({
      where: { tenantId },
      include: {
        leads: true
      },
      orderBy: { order: 'asc' }
    });

    res.json(stages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleChatAi = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { stopAi } = req.body;
    const tenantId = req.user?.tenantId;

    const chat = await prisma.chat.update({
      where: { id: chatId, tenantId },
      data: { stopAi }
    });

    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createKanbanStage = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const { name } = req.body;

    // Obtener el último orden para colocar la nueva columna al final
    const lastStage = await prisma.funnelStage.findFirst({
      where: { tenantId },
      orderBy: { order: 'desc' }
    });

    const nextOrder = lastStage ? lastStage.order + 1 : 0;

    const newStage = await prisma.funnelStage.create({
      data: {
        name,
        order: nextOrder,
        tenantId
      }
    });

    res.status(201).json(newStage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
