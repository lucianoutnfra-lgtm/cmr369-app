import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const registerTenant = async (req: Request, res: Response) => {
  try {
    const { email, password, name, tenantName, tenantSlug } = req.body;
    const result = await AuthService.registerTenantAdmin(email, password, name, tenantName, tenantSlug);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Error al crear el tenant o usuario. Verifica correos repetidos.' });
  }
};
