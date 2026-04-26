import { ALL_SUITS } from './constants';
import type { Tile, TileNumber, GameConfig } from './types';

export function createDeck(config: GameConfig): Tile[] {
  const tiles: Tile[] = [];
  for (let n = 1; n <= config.maxNumber; n++) {
    for (const suit of ALL_SUITS) {
      tiles.push({ id: `${suit}-${n}`, number: n as TileNumber, suit });
    }
  }
  return tiles;
}

export function shuffleDeck(deck: Tile[]): Tile[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealTiles(deck: Tile[], config: GameConfig): Tile[][] {
  const hands: Tile[][] = Array.from({ length: config.playerCount }, () => []);
  for (let i = 0; i < config.playerCount * config.tilesPerPlayer; i++) {
    hands[i % config.playerCount].push(deck[i]);
  }
  return hands;
}

// 구름3 보유자 인덱스 반환
export function findFirstPlayer(hands: Tile[][]): number {
  for (let i = 0; i < hands.length; i++) {
    if (hands[i].some((t) => t.suit === 'cloud' && t.number === 3)) return i;
  }
  return 0;
}
