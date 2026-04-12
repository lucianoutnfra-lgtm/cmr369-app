import { Server, Socket } from 'socket.io';

export default function setupSockets(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] New connection: ${socket.id}`);

    // Autenticar la conexión al socket con el tenantId/userId (Mockup básico)
    socket.on('join_tenant', (tenantId: string) => {
      socket.join(tenantId);
      console.log(`Socket ${socket.id} joined tenant room ${tenantId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
}
