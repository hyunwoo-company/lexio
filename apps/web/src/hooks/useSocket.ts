'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '@/store/gameStore';
import { getClientId } from '@/lib/clientId';
import type { ClientGameState, RoundResult } from '@lexio/game-logic';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SERVER_URL, {
      autoConnect: false,
      auth: { clientId: getClientId() },
    });
  }
  return socket;
}

export function useSocket() {
  const { setGameState, setRoundResult, setError } = useGameStore();
  const attached = useRef(false);

  useEffect(() => {
    if (attached.current) return;
    attached.current = true;

    const s = getSocket();
    if (!s.connected) s.connect();

    s.on('game:started', (state: ClientGameState) => setGameState(state));
    s.on('game:stateSync', (state: ClientGameState) => setGameState(state));
    s.on('game:roundEnd', ({ state, roundResult }: { state: ClientGameState; roundResult: RoundResult }) => {
      setGameState(state);
      setRoundResult(roundResult);
    });
    s.on('game:invalid', ({ reason }: { reason: string }) => setError(reason));
    s.on('room:error', ({ reason }: { reason: string }) => setError(reason));

    return () => {
      s.off('game:started');
      s.off('game:stateSync');
      s.off('game:roundEnd');
      s.off('game:invalid');
      s.off('room:error');
      attached.current = false;
    };
  }, [setGameState, setRoundResult, setError]);

  return getSocket();
}
