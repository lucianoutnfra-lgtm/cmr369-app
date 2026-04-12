import { Router, Request, Response } from 'express';
import { login, registerTenant } from '../controllers/auth.controller';
import { authenticateJWT, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', registerTenant);

router.get('/me', authenticateJWT, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
