import prisma from '../config/prisma';

export class N8nService {
  static async handleIncomingMessage(tenantId: string, leadPhone: string, content: string, leadName: string = 'Nuevo Lead') {
    let lead = await prisma.lead.findUnique({
      where: { tenantId_phone: { tenantId, phone: leadPhone } }
    });

    // Buscar la primera etapa del embudo para este tenant
    const firstStage = await prisma.funnelStage.findFirst({
      where: { tenantId },
      orderBy: { order: 'asc' }
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: { 
          tenantId, 
          phone: leadPhone, 
          name: leadName,
          stageId: firstStage?.id // Asignar primera etapa automáticamente
        }
      });
    } else if (!lead.stageId && firstStage) {
      // Si el lead ya existe pero no tiene etapa, asignarlo a la primera
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: { stageId: firstStage.id }
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

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

    return { 
      lead, 
      chat, 
      message,
      stopAi: chat.stopAi || tenant?.globalAiDeactivated || false,
      globalAiDeactivated: tenant?.globalAiDeactivated || false
    };
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
      include: { 
        lead: { include: { stage: true } },
        tenant: true
      }
    });

    if (!chat || chat.tenantId !== tenantId) throw new Error('Chat no encontrado o acceso denegado');

    return {
      stopAi: chat.stopAi || chat.tenant.globalAiDeactivated,
      status: chat.status,
      stage: chat.lead.stage?.name || 'Unassigned',
      globalAiDeactivated: chat.tenant.globalAiDeactivated
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
