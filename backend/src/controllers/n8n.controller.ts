import { Response } from 'express';
import { ApiKeyRequest } from '../middlewares/apiKey.middleware';
import { N8nService } from '../services/n8n.service';

export const receiveMessage = async (req: ApiKeyRequest, res: Response) => {
  try {
    const tenantId = req.tenant!.id;
    const { leadPhone, content, leadName } = req.body;
    
    const result = await N8nService.handleIncomingMessage(tenantId, leadPhone, content, leadName);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const sendAiResponse = async (req: ApiKeyRequest, res: Response) => {
  try {
    const tenantId = req.tenant!.id;
    const { leadPhone, content } = req.body;
    
    const message = await N8nService.handleAiResponse(tenantId, leadPhone, content);
    res.status(200).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getStatus = async (req: ApiKeyRequest, res: Response) => {
  try {
    const tenantId = req.tenant!.id;
    const id = req.params.id as string; // chatId
    
    const status = await N8nService.getChatStatus(tenantId, id);
    res.status(200).json(status);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateLeadStage = async (req: ApiKeyRequest, res: Response) => {
  try {
    const tenantId = req.tenant!.id;
    const id = req.params.id as string; // leadId
    const { stageId } = req.body;
    
    const updatedLead = await N8nService.updateLeadStage(tenantId, id, stageId);
    res.status(200).json(updatedLead);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
