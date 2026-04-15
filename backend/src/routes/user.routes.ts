import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import * as UserController from '../controllers/user.controller';

const router = Router();

router.use(authenticateJWT);

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
