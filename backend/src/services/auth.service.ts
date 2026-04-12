import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import env from '../config/env';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId } };
  }

  static async registerTenantAdmin(email: string, password: string, name: string, tenantName: string, tenantSlug: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await prisma.$transaction(async (tx) => {
      const newTenant = await tx.tenant.create({
        data: {
          name: tenantName,
          slug: tenantSlug,
        }
      });

      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'TENANT',
          tenantId: newTenant.id
        }
      });

      return { tenant: newTenant, user: newUser };
    });

    return result;
  }
}
