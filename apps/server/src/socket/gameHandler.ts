import type { Server, Socket } from 'socket.io';
import { RoomManager } from '../room/RoomManager';

export function registerGameHandlers(io: Server, socket: Socket, rooms: RoomManager): void {
  const clientId: string = (socket.handshake.auth as { clientId?: string }).clientId ?? socket.id;

  socket.on('game:start', ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.getHostId() !== clientId) {
      socket.emit('game:error', { reason: '방장만 게임을 시작할 수 있습니다.' });
      return;
    }
    if (!room.startGame()) {
      socket.emit('game:error', { reason: '게임을 시작할 수 없습니다. (3~5명 필요)' });
      return;
    }
    const engine = room.getEngine()!;
    for (const player of room.getPlayers()) {
      const playerSocket = io.sockets.sockets.get(player.socketId);
      if (playerSocket) {
        playerSocket.emit('game:started', engine.getClientState(player.id));
      }
    }
  });

  socket.on('game:play', ({ roomId, tileIds }: { roomId: string; tileIds: string[] }) => {
    const room = rooms.get(roomId);
    const engine = room?.getEngine();
    if (!engine) return;

    const result = engine.playTiles(clientId, tileIds);
    if (!result.ok) {
      socket.emit('game:invalid', { reason: result.reason });
      return;
    }

    if (result.roundResult) {
      for (const player of room!.getPlayers()) {
        const playerSocket = io.sockets.sockets.get(player.socketId);
        if (playerSocket) {
          playerSocket.emit('game:roundEnd', {
            state: engine.getClientState(player.id),
            roundResult: result.roundResult,
          });
        }
      }
    } else {
      for (const player of room!.getPlayers()) {
        const playerSocket = io.sockets.sockets.get(player.socketId);
        if (playerSocket) {
          playerSocket.emit('game:stateSync', engine.getClientState(player.id));
        }
      }
    }
  });

  socket.on('game:pass', ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId);
    const engine = room?.getEngine();
    if (!engine) return;

    const result = engine.pass(clientId);
    if (!result.ok) {
      socket.emit('game:invalid', { reason: result.reason });
      return;
    }

    for (const player of room!.getPlayers()) {
      const playerSocket = io.sockets.sockets.get(player.socketId);
      if (playerSocket) {
        playerSocket.emit('game:stateSync', engine.getClientState(player.id));
      }
    }
  });

  socket.on('game:ready', ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const player = room.getPlayerById(clientId);
    if (player) player.isReady = true;

    if (room.getPlayers().every((p) => p.isReady)) {
      room.getPlayers().forEach((p) => (p.isReady = false));
      room.getEngine()?.startRound();
      const engine = room.getEngine()!;
      for (const p of room.getPlayers()) {
        const pSocket = io.sockets.sockets.get(p.socketId);
        if (pSocket) pSocket.emit('game:started', engine.getClientState(p.id));
      }
    }
  });
}
