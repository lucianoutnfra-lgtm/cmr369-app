import { Router } from 'express';
import { validateApiKey } from '../middlewares/apiKey.middleware';
import { receiveMessage, sendAiResponse, getStatus, updateLeadStage } from '../controllers/n8n.controller';

const router = Router();

// Webhook central (determina tenant via brand_id en el body)
router.post('/webhooks/whatsapp', receiveWhatsappWebhook);

// Middlewares: Comprobación del API KEY del Tenant para el resto de rutas
router.use(validateApiKey);

router.post('/messages/receive', receiveMessage);
router.post('/messages/send', sendAiResponse);
router.get('/chats/:id/status', getStatus);
router.put('/leads/:id/stage', updateLeadStage);

export default router;
