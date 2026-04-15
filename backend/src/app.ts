import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env';

// Rutas a implementar luego
import authRoutes from './routes/auth.routes';
import n8nRoutes from './routes/n8n.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';
import tenantRoutes from './routes/tenant.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (Volumen local para multer)
app.use('/uploads', express.static('uploads'));

// Rutas básicas
app.get('/', (req, res) => {
  res.send('CMR369 Backend is running');
});

// Aca irán las rutas:
app.use('/api/auth', authRoutes);
app.use('/api/n8n', n8nRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tenant', tenantRoutes);

// Alias para estabilizar el Kanban según requerimiento
app.use('/api/pipelines/columns', (req, res, next) => {
  req.url = '/stages'; // Redirigir internamente a dashboard/kanban/stages
  next();
}, dashboardRoutes);

export default app;
