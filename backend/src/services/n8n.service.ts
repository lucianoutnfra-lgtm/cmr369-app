import prisma from '../config/prisma';

export class N8nService {
  static async handleIncomingMessage(tenantId: string, leadPhone: string, content: string, leadName: string = 'Nuevo Lead') {
    let lead = await prisma.lead.findUnique({
      where: { tenantId_phone: { tenantId, phone: leadPhone } }
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: { tenantId, phone: leadPhone, name: leadName }
      });
    }

    let chat = await prisma.chat.findUnique({
      where: { leadId: lead.id }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { tenantId, leadId: lead.id }
      });
    }

    const message = await prisma.message.create({
      data: {
        tenantId,
        leadId: lead.id,
        content,
        source: 'LEAD',
        type: 'TEXT'
      }
    });

    return { lead, chat, message };
  }

  static async handleAiResponse(tenantId: string, leadPhone: string, content: string) {
    const lead = await prisma.lead.findUnique({
      where: { tenantId_phone: { tenantId, phone: leadPhone } }
    });

    if (!lead) throw new Error('Lead no encontrado');

    const message = await prisma.message.create({
      data: {
        tenantId,
        leadId: lead.id,
        content,
        source: 'AI',
        type: 'TEXT'
      }
    });

    return message;
  }

  static async getChatStatus(tenantId: string, chatId: string) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { lead: { include: { stage: true } } }
    });

    if (!chat || chat.tenantId !== tenantId) throw new Error('Chat no encontrado o acceso denegado');

    return {
      stopAi: chat.stopAi,
      status: chat.status,
      stage: chat.lead.stage?.name || 'Unassigned'
    };
  }

  static async updateLeadStage(tenantId: string, leadId: string, stageId: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId }});
    if (!lead || lead.tenantId !== tenantId) throw new Error('Lead no encontrado');

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { stageId }
    });

    return updatedLead;
  }
}
