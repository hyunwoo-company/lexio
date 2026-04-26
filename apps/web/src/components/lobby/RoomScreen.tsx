'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket, useSocket } from '@/hooks/useSocket';
import { useGameStore, type RoomInfo } from '@/store/gameStore';
import { GameBoard } from '@/components/game/GameBoard';
import { getClientId, loadSession } from '@/lib/clientId';

interface RoomScreenProps {
  roomId: string;
}

export function RoomScreen({ roomId }: RoomScreenProps) {
  useSocket();
  const { myId, gameState, roomInfo: initialRoomInfo, setRoomInfo, setRoom } = useGameStore();
  const [room, setRoomLocal] = useState<RoomInfo | null>(initialRoomInfo);
  const reconnectAttempted = useRef(false);

  const updateRoom = (r: RoomInfo) => {
    setRoomLocal(r);
    setRoomInfo(r);
  };

  // 새로고침 후 재연결 처리
  useEffect(() => {
    if (reconnectAttempted.current) return;
    reconnectAttempted.current = true;

    const socket = getSocket();

    const storedMyId = useGameStore.getState().myId;
    if (!storedMyId) {
      const session = loadSession();
      if (session && session.roomId === roomId) {
        const clientId = getClientId();
        setRoom(roomId, clientId, session.playerName);

        const doReconnect = () => socket.emit('room:reconnect', { roomId });
        if (socket.connected) {
          doReconnect();
        } else {
          if (!socket.connected) socket.connect();
          socket.once('connect', doReconnect);
        }
      }
    }
  }, [roomId, setRoom]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('room:updated', ({ room: r }: { room: RoomInfo }) => updateRoom(r));
    socket.on('room:joined', ({ room: r }: { room: RoomInfo }) => updateRoom(r));

    return () => {
      socket.off('room:updated');
      socket.off('room:joined');
    };
  }, []);

  const handleStart = () => {
    const socket = getSocket();
    socket.emit('game:start', { roomId });
  };

  // 게임 시작됨
  if (gameState?.phase === 'playing' || gameState?.phase === 'scoring') {
    return <GameBoard />;
  }

  const isHost = room?.players[0]?.id === myId;
  const canStart = (room?.playerCount ?? 0) >= 3;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white">LEXIO</h1>
        <p className="text-gray-400 mt-1">대기실</p>
      </div>

      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">방 코드</p>
          <p className="text-3xl font-black tracking-widest text-blue-400">{roomId}</p>
          <p className="text-xs text-gray-500 mt-1">친구에게 이 코드를 알려주세요</p>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">참가자 ({room?.playerCount ?? 0}/5)</p>
          <ul className="space-y-2">
            {room?.players.map((p, i) => (
              <li key={p.id} className="flex items-center gap-2">
                {i === 0 && <span className="text-xs text-yellow-400">방장</span>}
                <span className={p.id === myId ? 'font-bold text-white' : 'text-gray-300'}>{p.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-bold transition-colors"
          >
            {canStart ? '게임 시작' : `최소 3명 필요 (현재 ${room?.playerCount ?? 0}명)`}
          </button>
        )}

        {!isHost && (
          <p className="text-center text-sm text-gray-500">방장이 게임을 시작할 때까지 기다려 주세요</p>
        )}
      </div>
    </div>
  );
}
