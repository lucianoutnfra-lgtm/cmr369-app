import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        apiKey: true,
        customUrl: true,
        integrations: true,
        catalogRef: true
      }
    });

    res.json(tenant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    // Solo SUPER_ADMIN o el dueño del TENANT pueden editar esto
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'TENANT') {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { customUrl, integrations, catalogRef, name } = req.body;

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name,
        customUrl,
        integrations,
        catalogRef
      }
    });

    res.json(updatedTenant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
