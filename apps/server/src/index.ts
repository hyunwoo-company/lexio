import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RoomManager } from './room/RoomManager';
import { registerRoomHandlers } from './socket/roomHandler';
import { registerGameHandlers } from './socket/gameHandler';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
    methods: ['GET', 'POST'],
  },
});

const rooms = new RoomManager();

app.get('/health', (_, res) => res.json({ ok: true }));

io.on('connection', (socket) => {
  console.log(`[연결] ${socket.id}`);
  registerRoomHandlers(io, socket, rooms);
  registerGameHandlers(io, socket, rooms);

  socket.on('disconnect', () => {
    console.log(`[해제] ${socket.id}`);
    rooms.cleanup();
  });
});

const PORT = process.env.PORT ?? 3001;
httpServer.listen(PORT, () => {
  console.log(`FGG 서버 실행 중: http://localhost:${PORT}`);
});
