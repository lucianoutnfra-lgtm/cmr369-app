import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import * as DashboardController from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticateJWT);

router.get('/chats', DashboardController.getDashboardChats);
router.get('/chats/:chatId', DashboardController.getChat);
router.patch('/chats/:chatId/name', DashboardController.updateChatName);
router.delete('/chats/:chatId', DashboardController.deleteChat);
router.get('/chats/:chatId/messages', DashboardController.getChatMessages);
router.delete('/chats/:chatId/messages', DashboardController.clearChatMessages);
router.post('/chats/:chatId/messages', DashboardController.sendChatMessage);
router.patch('/chats/:chatId/toggle-ai', DashboardController.toggleChatAi);

router.get('/global-ai', DashboardController.getGlobalAiStatus);
router.patch('/global-ai', DashboardController.toggleGlobalAi);

router.get('/kanban', DashboardController.getKanbanData);
router.post('/kanban/stages', DashboardController.createKanbanStage);
router.patch('/kanban/stages/:stageId', DashboardController.updateKanbanStage);
router.delete('/kanban/stages/:stageId', DashboardController.deleteKanbanStage);
router.patch('/kanban/leads/:leadId/stage', DashboardController.updateLeadStage);

export default router;
