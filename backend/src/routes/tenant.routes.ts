import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import * as TenantController from '../controllers/tenant.controller';

const router = Router();

router.use(authenticateJWT);

router.get('/settings', TenantController.getSettings);
router.put('/settings', TenantController.updateSettings);

export default router;
