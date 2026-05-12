import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';

const getDashboardTenantId = async (user: any) => {
  if (user.role === 'SUPER_ADMIN') {
    let unitaryTenant = await prisma.tenant.findUnique({ where: { slug: 'unitary' } });
    if (!unitaryTenant) {
      unitaryTenant = await prisma.tenant.create({ data: { name: 'Unitary', slug: 'unitary' } });
      // seed initial pipeline stage
      await prisma.funnelStage.create({
        data: { tenantId: unitaryTenant.id, name: 'Mensaje nuevo', order: 0 }
      });
    }
    return unitaryTenant.id;
  }
  return user.tenantId;
};

export const getDashboardChats = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const chats = await prisma.chat.findMany({
      where: { tenantId },
      include: {
        lead: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
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
    const chatId = req.params.chatId as string;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

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

export const getChat = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const chat = await prisma.chat.findUnique({
      where: { id: chatId, tenantId },
      include: { lead: true }
    });

    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateChatName = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const { name } = req.body;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    // Actualizar chat
    const chat = await prisma.chat.update({
      where: { id: chatId, tenantId },
      data: { name },
      include: { lead: true }
    });

    // Sincronizar con el Lead
    if (chat.leadId) {
      await prisma.lead.update({
        where: { id: chat.leadId },
        data: { name }
      });
    }

    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    await prisma.chat.delete({
      where: { id: chatId, tenantId }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const chat = await prisma.chat.findUnique({ where: { id: chatId, tenantId } });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    await prisma.message.deleteMany({
      where: { leadId: chat.leadId, tenantId }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleGlobalAi = async (req: AuthRequest, res: Response) => {
  try {
    const { globalAiDeactivated } = req.body;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { globalAiDeactivated }
    });

    res.json({ globalAiDeactivated: tenant.globalAiDeactivated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGlobalAiStatus = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { globalAiDeactivated: true }
    });

    res.json({ globalAiDeactivated: tenant?.globalAiDeactivated || false });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getKanbanData = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const stages = await prisma.funnelStage.findMany({
      where: { tenantId },
      include: {
        leads: {
          include: {
            chat: true
          }
        }
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
    const chatId = req.params.chatId as string;
    const { stopAi } = req.body;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

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
    const tenantId = await getDashboardTenantId(req.user);
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

export const sendChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const { content } = req.body;
    const tenantId = await getDashboardTenantId(req.user);
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const chat = await prisma.chat.findUnique({ where: { id: chatId, tenantId }});
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const message = await prisma.message.create({
      data: {
        tenantId,
        leadId: chat.leadId,
        content,
        source: 'USER',
        type: 'TEXT'
      }
    });

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateKanbanStage = async (req: AuthRequest, res: Response) => {
  try {
    const { stageId } = req.params;
    const { name, order } = req.body;
    const tenantId = await getDashboardTenantId(req.user);
    
    const updatedStage = await prisma.funnelStage.update({
      where: { id: stageId, tenantId },
      data: { name, order }
    });
    
    res.json(updatedStage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteKanbanStage = async (req: AuthRequest, res: Response) => {
  try {
    const { stageId } = req.params;
    const tenantId = await getDashboardTenantId(req.user);

    // Mover leads a otra etapa o borrarlos? 
    // Por simplicidad, si borras la etapa, los leads se quedan sin etapa (null) si no hay restricción
    // Pero el modelo Lead tiene stageId String? so it's fine.
    
    await prisma.funnelStage.delete({
      where: { id: stageId, tenantId }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLeadStage = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId } = req.params;
    const { stageId } = req.body;
    const tenantId = await getDashboardTenantId(req.user);

    const updatedLead = await prisma.lead.update({
      where: { id: leadId, tenantId },
      data: { stageId }
    });

    res.json(updatedLead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
