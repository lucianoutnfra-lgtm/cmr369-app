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
  const rawKey = req.headers['x-api-key'];
  const apiKey = (Array.isArray(rawKey) ? rawKey[0] : rawKey) as string;

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

export const validateMasterApiKey = (req: Request, res: Response, next: NextFunction) => {
  const rawKey = req.headers['x-api-key'];
  const apiKey = (Array.isArray(rawKey) ? rawKey[0] : rawKey) as string;

  import('../config/env').then(({ default: env }) => {
    if (!apiKey || apiKey !== env.MASTER_API_KEY) {
      return res.status(401).json({ error: 'API Key Maestra inválida o faltante' });
    }
    next();
  });
};
