import type { Server, Socket } from 'socket.io';
import { RoomManager } from '../room/RoomManager';
import type { GameMode } from '@lexio/game-logic';

export function registerRoomHandlers(io: Server, socket: Socket, rooms: RoomManager): void {
  // socket.handshake.auth.clientId를 안정적인 플레이어 ID로 사용
  const clientId: string = (socket.handshake.auth as { clientId?: string }).clientId ?? socket.id;

  socket.on('room:create', ({ playerName, mode }: { playerName: string; mode?: GameMode }) => {
    const room = rooms.create(mode === 'full' ? 'full' : 'recommended');
    const player = { id: clientId, name: playerName, socketId: socket.id, isReady: false };
    room.addPlayer(player);
    socket.join(room.id);
    socket.emit('room:created', { roomId: room.id, room: room.toJSON() });
  });

  socket.on('room:join', ({ roomId, playerName }: { roomId: string; playerName: string }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('room:error', { reason: '존재하지 않는 방입니다.' });
      return;
    }
    const player = { id: clientId, name: playerName, socketId: socket.id, isReady: false };
    if (!room.addPlayer(player)) {
      socket.emit('room:error', { reason: '입장할 수 없는 방입니다.' });
      return;
    }
    socket.join(roomId);
    socket.emit('room:joined', { roomId, room: room.toJSON() });
    socket.to(roomId).emit('room:updated', { room: room.toJSON() });
  });

  socket.on('room:reconnect', ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('room:error', { reason: '방을 찾을 수 없습니다.' });
      return;
    }

    const player = room.reconnectPlayer(clientId, socket.id);
    if (!player) {
      socket.emit('room:error', { reason: '플레이어 정보를 찾을 수 없습니다.' });
      return;
    }

    socket.join(roomId);

    const engine = room.getEngine();
    if (engine) {
      // 게임 중 재연결
      socket.emit('game:stateSync', engine.getClientState(clientId));
      socket.to(roomId).emit('room:updated', { room: room.toJSON() });
    } else {
      // 대기실 재연결
      socket.emit('room:joined', { roomId, room: room.toJSON() });
      socket.to(roomId).emit('room:updated', { room: room.toJSON() });
    }
  });

  socket.on('disconnecting', () => {
    const room = rooms.findBySocketId(socket.id);
    if (!room) return;
    const removed = room.removePlayer(socket.id);
    if (removed) {
      io.to(room.id).emit('room:updated', { room: room.toJSON() });
      if (room.isEmpty()) rooms.delete(room.id);
    }
  });
}
