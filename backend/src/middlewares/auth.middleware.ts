import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string | null;
    role: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
      }

      req.user = decoded as any;
      next();
    });
  } else {
    res.status(401).json({ error: 'Autorización requerida' });
  }
};
