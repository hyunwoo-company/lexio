import { GameEngine } from '../game/GameEngine';
import type { PlayerCount } from '@lexio/game-logic';

export interface RoomPlayer {
  id: string;       // stable clientId (재연결 시에도 유지)
  name: string;
  socketId: string; // 재연결 시 갱신
  isReady: boolean;
  isConnected: boolean;
}

export class Room {
  readonly id: string;
  private players: RoomPlayer[] = [];
  private engine: GameEngine | null = null;
  readonly createdAt: number;

  constructor(id: string) {
    this.id = id;
    this.createdAt = Date.now();
  }

  addPlayer(player: Omit<RoomPlayer, 'isConnected'>): boolean {
    if (this.players.length >= 5) return false;
    if (this.engine) return false;
    this.players.push({ ...player, isConnected: true });
    return true;
  }

  removePlayer(socketId: string): RoomPlayer | null {
    const player = this.players.find((p) => p.socketId === socketId);
    if (!player) return null;

    if (this.engine) {
      // 게임 중에는 제거하지 않고 연결 끊김으로 표시
      player.isConnected = false;
      this.engine.setPlayerConnection(player.id, false);
      return player;
    }

    // 대기실에서는 완전 제거
    const idx = this.players.findIndex((p) => p.socketId === socketId);
    const [removed] = this.players.splice(idx, 1);
    return removed;
  }

  reconnectPlayer(clientId: string, newSocketId: string): RoomPlayer | null {
    const player = this.players.find((p) => p.id === clientId);
    if (!player) return null;
    player.socketId = newSocketId;
    player.isConnected = true;
    if (this.engine) {
      this.engine.setPlayerConnection(clientId, true);
    }
    return player;
  }

  getPlayers(): RoomPlayer[] {
    return [...this.players];
  }

  getPlayer(socketId: string): RoomPlayer | undefined {
    return this.players.find((p) => p.socketId === socketId);
  }

  getPlayerById(clientId: string): RoomPlayer | undefined {
    return this.players.find((p) => p.id === clientId);
  }

  getPlayerCount(): number {
    return this.players.length;
  }

  getHostId(): string | null {
    return this.players[0]?.id ?? null;
  }

  canStart(): boolean {
    return this.players.length >= 3 && this.players.length <= 5 && !this.engine;
  }

  startGame(): boolean {
    if (!this.canStart()) return false;
    const count = this.players.length as PlayerCount;
    this.engine = new GameEngine(
      this.players.map((p) => ({ id: p.id, name: p.name })),
      count
    );
    this.engine.startRound();
    return true;
  }

  getEngine(): GameEngine | null {
    return this.engine;
  }

  isEmpty(): boolean {
    return this.players.every((p) => !p.isConnected);
  }

  toJSON() {
    return {
      id: this.id,
      players: this.players.map(({ id, name, isReady, isConnected }) => ({ id, name, isReady, isConnected })),
      playerCount: this.players.length,
      isPlaying: !!this.engine,
    };
  }
}
