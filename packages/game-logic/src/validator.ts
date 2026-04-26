import { NUMBER_RANK, SUIT_RANK } from './constants';
import { calcSimpleStrength, getNumberRank, getSuitRank, getStrongestTile } from './comparator';
import type { Tile, TileCombination, TileNumber } from './types';

// maxNumber: 3인→9, 4인→13, 5인→15
export function detectCombination(tiles: Tile[], maxNumber: TileNumber = 15): TileCombination | null {
  if (tiles.length === 0 || tiles.length === 4) return null;

  if (tiles.length === 1) return makeSingle(tiles);
  if (tiles.length === 2) return makePair(tiles);
  if (tiles.length === 3) return makeTriple(tiles);
  if (tiles.length === 5) return makeFiveTile(tiles, maxNumber);

  return null;
}

function makeSingle(tiles: Tile[]): TileCombination {
  return { tiles, type: 'single', strength: calcSimpleStrength(tiles) };
}

function makePair(tiles: Tile[]): TileCombination | null {
  if (tiles[0].number !== tiles[1].number) return null;
  return { tiles, type: 'pair', strength: calcSimpleStrength(tiles) };
}

function makeTriple(tiles: Tile[]): TileCombination | null {
  const [a, b, c] = tiles;
  if (a.number !== b.number || b.number !== c.number) return null;
  return { tiles, type: 'triple', strength: calcSimpleStrength(tiles) };
}

function makeFiveTile(tiles: Tile[], maxNumber: TileNumber): TileCombination | null {
  // 우선순위: straightflush → fourcard → fullhouse → flush → straight
  return (
    tryStraightFlush(tiles, maxNumber) ??
    tryFourCard(tiles) ??
    tryFullHouse(tiles) ??
    tryFlush(tiles) ??
    tryStraight(tiles, maxNumber)
  );
}

function tryStraightFlush(tiles: Tile[], maxNumber: TileNumber): TileCombination | null {
  if (!isFlush(tiles)) return null;
  if (!isStraight(tiles, maxNumber)) return null;
  const strength = straightStrength(tiles, maxNumber);
  return { tiles, type: 'straightflush', strength };
}

function tryFourCard(tiles: Tile[]): TileCombination | null {
  const groups = groupByNumber(tiles);
  const fourGroup = groups.find((g) => g.length === 4);
  if (!fourGroup) return null;
  const strength = getNumberRank(fourGroup[0].number) * 10;
  return { tiles, type: 'fourcard', strength };
}

function tryFullHouse(tiles: Tile[]): TileCombination | null {
  const groups = groupByNumber(tiles);
  if (groups.length !== 2) return null;
  const tripleGroup = groups.find((g) => g.length === 3);
  if (!tripleGroup) return null;
  const strength = getNumberRank(tripleGroup[0].number) * 10;
  return { tiles, type: 'fullhouse', strength };
}

function tryFlush(tiles: Tile[]): TileCombination | null {
  if (!isFlush(tiles)) return null;
  const strongest = getStrongestTile(tiles);
  const strength = getNumberRank(strongest.number) * 10 + getSuitRank(strongest.suit);
  return { tiles, type: 'flush', strength };
}

function tryStraight(tiles: Tile[], maxNumber: TileNumber): TileCombination | null {
  if (!isStraight(tiles, maxNumber)) return null;
  const strength = straightStrength(tiles, maxNumber);
  return { tiles, type: 'straight', strength };
}

function isFlush(tiles: Tile[]): boolean {
  return tiles.every((t) => t.suit === tiles[0].suit);
}

function isStraight(tiles: Tile[], maxNumber: TileNumber): boolean {
  // 2는 스트레이트에 포함 불가
  if (tiles.some((t) => t.number === 2)) return false;

  const sorted = sortByStraightOrder(tiles, maxNumber);
  if (!sorted) return false;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== 1) return false;
  }
  return true;
}

// 스트레이트 정렬: 1은 maxNumber 다음으로 처리
// 반환: 정렬된 서열 배열, 유효하지 않으면 null
function sortByStraightOrder(tiles: Tile[], maxNumber: TileNumber): number[] | null {
  const numbers = tiles.map((t) => t.number);
  const has1 = numbers.includes(1);
  const has2 = numbers.includes(2);

  if (has2) return null;

  if (has1) {
    // 1이 있으면: 나머지 4개가 maxNumber-3 ~ maxNumber 연속이어야 함
    const others = numbers.filter((n) => n !== 1);
    const otherRanks = others.map((n) => NUMBER_RANK[n as TileNumber]);
    const maxRank = NUMBER_RANK[maxNumber];
    const expectedStart = maxRank - 3;
    const sorted = [...otherRanks].sort((a, b) => a - b);

    if (sorted[0] !== expectedStart) return null;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] !== 1) return null;
    }
    // 1을 맨 뒤에 붙임
    return [...sorted, maxRank + 1];
  }

  // 일반 스트레이트: 연속된 실제 숫자 값으로 비교
  const sorted = [...numbers].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== 1) return null;
  }
  return sorted;
}

// 스트레이트 strength: 가장 높은 위치의 numberRank
function straightStrength(tiles: Tile[], maxNumber: TileNumber): number {
  const has1 = tiles.some((t) => t.number === 1);
  if (has1) {
    // 1이 있는 스트레이트가 최강 (maxNumber 뒤에 1)
    return NUMBER_RANK[maxNumber] + 1;
  }
  const maxNum = Math.max(...tiles.map((t) => t.number)) as TileNumber;
  return NUMBER_RANK[maxNum];
}

function groupByNumber(tiles: Tile[]): Tile[][] {
  const map = new Map<number, Tile[]>();
  for (const tile of tiles) {
    const group = map.get(tile.number) ?? [];
    group.push(tile);
    map.set(tile.number, group);
  }
  return Array.from(map.values());
}
