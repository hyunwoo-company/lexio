'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/hooks/useSocket';
import { useGameStore, type RoomInfo } from '@/store/gameStore';
import { getClientId, saveSession } from '@/lib/clientId';

export function LobbyScreen() {
  const nameRef = useRef<HTMLInputElement>(null);
  const joinCodeRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const cleanupRef = useRef<(() => void) | null>(null);
  const router = useRouter();
  const { setRoom, setRoomInfo, setError } = useGameStore();

  const handleBack = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setMode('idle');
    setLoading(false);
    setErrorMsg('');
  };

  const handleCreate = () => {
    const name = nameRef.current?.value.trim() ?? '';
    if (!name) return;
    setLoading(true);
    setErrorMsg('');
    const socket = getSocket();

    const onCreated = ({ roomId, room }: { roomId: string; room: RoomInfo }) => {
      cleanup();
      setRoom(roomId, getClientId(), name);
      setRoomInfo(room);
      saveSession(roomId, name);
      router.push(`/room/${roomId}`);
    };
    const onError = ({ reason }: { reason: string }) => {
      cleanup();
      setError(reason);
      setErrorMsg(reason);
      setLoading(false);
    };
    const onConnectError = () => {
      cleanup();
      setErrorMsg('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    };
    const cleanup = () => {
      socket.off('room:created', onCreated);
      socket.off('room:error', onError);
      socket.off('connect_error', onConnectError);
    };
    cleanupRef.current = cleanup;

    socket.on('room:created', onCreated);
    socket.on('room:error', onError);
    socket.on('connect_error', onConnectError);

    if (!socket.connected) socket.connect();
    socket.emit('room:create', { playerName: name });
  };

  const handleJoin = () => {
    const name = nameRef.current?.value.trim() ?? '';
    const joinCode = joinCodeRef.current?.value.trim().toUpperCase() ?? '';
    if (!name || !joinCode) return;
    setLoading(true);
    setErrorMsg('');
    const socket = getSocket();

    const onJoined = ({ roomId, room }: { roomId: string; room: RoomInfo }) => {
      cleanup();
      setRoom(roomId, getClientId(), name);
      setRoomInfo(room);
      saveSession(roomId, name);
      router.push(`/room/${roomId}`);
    };
    const onError = ({ reason }: { reason: string }) => {
      cleanup();
      setError(reason);
      setErrorMsg(reason);
      setLoading(false);
    };
    const onConnectError = () => {
      cleanup();
      setErrorMsg('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    };
    const cleanup = () => {
      socket.off('room:joined', onJoined);
      socket.off('room:error', onError);
      socket.off('connect_error', onConnectError);
    };
    cleanupRef.current = cleanup;

    socket.on('room:joined', onJoined);
    socket.on('room:error', onError);
    socket.on('connect_error', onConnectError);

    if (!socket.connected) socket.connect();
    socket.emit('room:join', { roomId: joinCode, playerName: name });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-black tracking-tight mb-2" style={{ color: 'var(--fgg-gold, #D4A656)' }}>FGG</h1>
        <p className="text-gray-400">사신수 타일 × 포커 족보 클라이밍 게임</p>
      </div>

      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">닉네임</label>
          <input
            ref={nameRef}
            id="player-name"
            defaultValue=""
            placeholder="이름 입력..."
            maxLength={12}
            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {mode === 'join' && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">방 코드</label>
            <input
              ref={joinCodeRef}
              id="room-code"
              defaultValue=""
              placeholder="6자리 코드..."
              maxLength={6}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-xl font-bold"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {mode !== 'join' && (
            <button
              id="btn-create"
              onClick={() => { setMode('create'); handleCreate(); }}
              disabled={loading}
              className="py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-bold transition-colors"
            >
              {loading && mode === 'create' ? '생성 중...' : '방 만들기'}
            </button>
          )}

          {mode !== 'create' && (
            <button
              id="btn-join"
              onClick={() => mode === 'idle' ? setMode('join') : handleJoin()}
              disabled={loading}
              className="py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl font-bold transition-colors"
            >
              {mode === 'join' ? (loading ? '입장 중...' : '입장하기') : '방 입장'}
            </button>
          )}

          {mode !== 'idle' && (
            <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              돌아가기
            </button>
          )}

          {errorMsg && (
            <p className="text-sm text-red-400 text-center">{errorMsg}</p>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600 text-center">
        3~5명 플레이 · 온라인 멀티플레이
      </div>
    </div>
  );
}
