import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;
    let whereClause = {};
    
    if (role !== 'SUPER_ADMIN') {
      const tenantId = req.user?.tenantId;
      if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });
      whereClause = { tenantId };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const currentRole = req.user?.role;
    if (currentRole !== 'SUPER_ADMIN' && currentRole !== 'TENANT') {
      return res.status(403).json({ error: 'No tienes permisos para crear usuarios' });
    }

    const { name, email, password, role, tenantSlug } = req.body;
    
    let targetTenantId = req.user?.tenantId;
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    try {
      newUser = await prisma.$transaction(async (tx) => {
        let currentTargetId = targetTenantId;

        // Si es SUPER_ADMIN creando un TENANT, requiere y procesa el tenantSlug
        if (currentRole === 'SUPER_ADMIN' && role === 'TENANT') {
          if (!tenantSlug) {
            throw new Error('SLUG_REQUIRED');
          }
          
          let tenant = await tx.tenant.findUnique({ where: { slug: tenantSlug } });
          
          if (!tenant) {
            // Se crea el tenant, el embudo por defecto y se asocia
            tenant = await tx.tenant.create({
              data: {
                name: tenantSlug, // o un nombre por defecto
                slug: tenantSlug,
              }
            });
            
            // ISSUE 5: Seeding Default Funnel Stage envuelto en la transaccion
            await tx.funnelStage.create({
              data: {
                tenantId: tenant.id,
                name: 'Mensaje nuevo',
                order: 0
              }
            });
          }
          currentTargetId = tenant.id;
        }

        if (!currentTargetId) {
          throw new Error('TENANT_ID_REQUIRED');
        }

        return await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'TENANT',
            tenantId: currentTargetId
          }
        });
      });
    } catch (txError: any) {
      if (txError.message === 'SLUG_REQUIRED') {
        return res.status(400).json({ error: 'Slug / Brand ID es obligatorio para crear un Tenant' });
      }
      if (txError.message === 'TENANT_ID_REQUIRED') {
        return res.status(400).json({ error: 'No se pudo determinar el tenantId para el nuevo usuario' });
      }
      
      // Manejo de errores de restriccion unica (Unique Constraint)
      if (txError.code === 'P2002') {
        const target = txError.meta?.target;
        const targetStr = Array.isArray(target) ? target.join(',') : String(target);
        if (targetStr.includes('email')) {
          return res.status(400).json({ error: 'El email ya está registrado.' });
        }
        if (targetStr.includes('slug')) {
          return res.status(400).json({ error: 'El slug / Brand ID ya está en uso.' });
        }
        return res.status(400).json({ error: 'Ya existe un registro con esos datos.' });
      }
      
      throw txError; // Propaga otros errores
    }

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const role = req.user?.role;
    const tenantId = req.user?.tenantId;

    if (role !== 'SUPER_ADMIN' && !tenantId) {
      return res.status(403).json({ error: 'No tenant associated' });
    }

    const { name, email, password, role: newRole } = req.body;
    
    const data: any = { name, email, role: newRole };
    
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    let whereClause: any = { id };
    if (role !== 'SUPER_ADMIN') {
      whereClause.tenantId = tenantId;
    }

    const updatedUser = await prisma.user.update({
      where: whereClause,
      data
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const role = req.user?.role;
    const tenantId = req.user?.tenantId;

    if (role !== 'SUPER_ADMIN' && !tenantId) {
      return res.status(403).json({ error: 'No tenant associated' });
    }

    let whereClause: any = { id };
    if (role !== 'SUPER_ADMIN') {
      whereClause.tenantId = tenantId;
    }

    await prisma.user.delete({
      where: whereClause
    });

    res.json({ message: 'Usuario eliminado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
