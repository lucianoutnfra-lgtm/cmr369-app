import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import env from './config/env';
import setupSockets from './sockets';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Adaptar luego en producción
    methods: ['GET', 'POST'],
  },
});

// Configurar WebSockets
setupSockets(io);

server.listen(env.PORT, () => {
  console.log(`[Server] Listening on port ${env.PORT}`);
});
