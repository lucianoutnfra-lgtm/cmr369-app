import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export interface ApiKeyRequest extends Request {
  tenant?: {
    id: string;
    name: string;
    slug: string;
    apiKey: string;
  };
}

export const validateApiKey = async (req: ApiKeyRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'Se requiere x-api-key en los headers' });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { apiKey }
    });

    if (!tenant) {
      return res.status(403).json({ error: 'API Key inválida' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    console.error('[API Key Middleware Error]:', error);
    res.status(500).json({ error: 'Error validando credenciales' });
  }
};
