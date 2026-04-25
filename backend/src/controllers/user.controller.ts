import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const users = await prisma.user.findMany({
      where: { tenantId },
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
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'TENANT') {
      return res.status(403).json({ error: 'No tienes permisos para crear usuarios' });
    }

    const { name, email, password, role } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'TENANT',
        tenantId
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    const { name, email, password, role } = req.body;
    
    const data: any = { name, email, role };
    
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id, tenantId },
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
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ error: 'No tenant associated' });

    // No permitir que un usuario se borre a sí mismo si es el único admin? (Opcional)

    await prisma.user.delete({
      where: { id, tenantId }
    });

    res.json({ message: 'Usuario eliminado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
