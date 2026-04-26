'use client';

import { create } from 'zustand';
import type { ClientGameState, RoundResult } from '@lexio/game-logic';

export interface RoomInfo {
  id: string;
  players: { id: string; name: string; isReady: boolean }[];
  playerCount: number;
  isPlaying: boolean;
}

interface GameStore {
  roomId: string | null;
  myId: string | null;
  myName: string | null;
  roomInfo: RoomInfo | null;
  gameState: ClientGameState | null;
  selectedTileIds: string[];
  roundResult: RoundResult | null;
  error: string | null;

  setRoom: (roomId: string, myId: string, myName: string) => void;
  setRoomInfo: (info: RoomInfo) => void;
  setGameState: (state: ClientGameState) => void;
  setRoundResult: (result: RoundResult) => void;
  toggleTile: (tileId: string) => void;
  clearSelection: () => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  roomId: null,
  myId: null,
  myName: null,
  roomInfo: null,
  gameState: null,
  selectedTileIds: [],
  roundResult: null,
  error: null,

  setRoom: (roomId, myId, myName) => set({ roomId, myId, myName }),
  setRoomInfo: (info) => set({ roomInfo: info }),
  setGameState: (state) => set({ gameState: state, roundResult: null }),
  setRoundResult: (result) => set({ roundResult: result }),
  toggleTile: (tileId) =>
    set((s) => ({
      selectedTileIds: s.selectedTileIds.includes(tileId)
        ? s.selectedTileIds.filter((id) => id !== tileId)
        : [...s.selectedTileIds, tileId],
    })),
  clearSelection: () => set({ selectedTileIds: [] }),
  setError: (msg) => set({ error: msg }),
  reset: () =>
    set({ roomId: null, myId: null, myName: null, roomInfo: null, gameState: null, selectedTileIds: [], roundResult: null, error: null }),
}));
