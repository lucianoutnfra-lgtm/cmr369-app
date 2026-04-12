import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import * as DashboardController from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticateJWT);

router.get('/chats', DashboardController.getDashboardChats);
router.get('/chats/:chatId/messages', DashboardController.getChatMessages);
router.patch('/chats/:chatId/toggle-ai', DashboardController.toggleChatAi);
router.get('/kanban', DashboardController.getKanbanData);

export default router;
