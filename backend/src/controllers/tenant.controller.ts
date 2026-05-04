import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';

// Función auxiliar para obtener el tenantId seguro desde la DB
const getSafeTenantId = async (userId?: string) => {
  if (!userId) throw new Error('Usuario no autenticado');
  
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado en la DB');

  let tenantId = user.tenantId;

  if (!tenantId) {
    // Auto-fix: asignar el primer tenant o crear uno
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: { name: "Tenant Principal", slug: "tenant-principal" }
      });
    }
    user = await prisma.user.update({
      where: { id: userId },
      data: { tenantId: tenant.id }
    });
    tenantId = tenant.id;
  }
  
  return tenantId;
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = await getSafeTenantId(req.user?.userId);

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
    const tenantId = await getSafeTenantId(req.user?.userId);

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
