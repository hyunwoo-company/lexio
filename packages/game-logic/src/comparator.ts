import { NUMBER_RANK, SUIT_RANK, COMBINATION_RANK } from './constants';
import type { Tile, TileNumber, Suit, TileCombination } from './types';

export function getNumberRank(n: TileNumber): number {
  return NUMBER_RANK[n];
}

export function getSuitRank(s: Suit): number {
  return SUIT_RANK[s];
}

// 양수: a > b, 음수: a < b, 0: 동일
export function compareTiles(a: Tile, b: Tile): number {
  const numDiff = getNumberRank(a.number) - getNumberRank(b.number);
  if (numDiff !== 0) return numDiff;
  return getSuitRank(a.suit) - getSuitRank(b.suit);
}

// 타일 배열에서 가장 강한 타일 반환
export function getStrongestTile(tiles: Tile[]): Tile {
  return tiles.reduce((best, tile) => (compareTiles(tile, best) > 0 ? tile : best));
}

// single/pair/triple의 strength 계산: 주요 numberRank * 10 + 최고 suitRank
export function calcSimpleStrength(tiles: Tile[]): number {
  const strongest = getStrongestTile(tiles);
  return getNumberRank(strongest.number) * 10 + getSuitRank(strongest.suit);
}

// 두 조합 비교: 양수 a > b, 음수 a < b
export function compareCombinations(a: TileCombination, b: TileCombination): number {
  // 5개 조합은 족보 등급 먼저 비교
  if (a.tiles.length === 5) {
    const rankDiff = COMBINATION_RANK[a.type] - COMBINATION_RANK[b.type];
    if (rankDiff !== 0) return rankDiff;
  }
  return a.strength - b.strength;
}
