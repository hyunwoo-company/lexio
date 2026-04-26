export type Suit = 'sun' | 'moon' | 'star' | 'cloud';

export type TileNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface Tile {
  id: string;
  number: TileNumber;
  suit: Suit;
}

export type CombinationType =
  | 'single'
  | 'pair'
  | 'triple'
  | 'straight'
  | 'flush'
  | 'fullhouse'
  | 'fourcard'
  | 'straightflush';

export interface TileCombination {
  tiles: Tile[];
  type: CombinationType;
  strength: number;
}

export type GamePhase = 'waiting' | 'playing' | 'scoring' | 'finished';

export interface Player {
  id: string;
  name: string;
  hand: Tile[];
  chips: number;
  isConnected: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  lastPlay: TileCombination | null;
  lastPlayerId: string | null;
  passCount: number;
  roundNumber: number;
  firstPlayerId: string | null;
}

export type PlayerCount = 3 | 4 | 5;

export interface GameConfig {
  playerCount: PlayerCount;
  maxNumber: 9 | 13 | 15;
  tilesPerPlayer: 12 | 13;
}

export interface ChipExchange {
  fromId: string;
  toId: string;
  amount: number;
}

export interface RoundResult {
  exchanges: ChipExchange[];
  penalizedPlayers: { playerId: string; tileCount: number; penaltyMultiplier: number }[];
}

export interface ClientGameState extends Omit<GameState, 'players'> {
  players: ClientPlayer[];
}

export interface ClientPlayer extends Omit<Player, 'hand'> {
  handCount: number;
  hand?: Tile[];
}
