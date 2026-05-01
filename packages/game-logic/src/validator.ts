import { NUMBER_RANK, SUIT_RANK } from './constants';
import type { Suit } from './types';
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
  const sorted = sortByStraightOrder(tiles, maxNumber);
  if (!sorted) return false;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== 1) return false;
  }
  return true;
}

// FGG 스트레이트 정렬:
//   - 1은 ace high (maxNumber 뒤): 12-13-14-15-1 같은 형태
//   - 1-2-3-4-5는 ace low 특수 케이스로 허용 (1+2+3+4+5만)
//   - 2는 그 외 일반 최저값 (2-3-4-5-6 가능)
// 반환: 정렬된 서열 배열, 유효하지 않으면 null
function sortByStraightOrder(tiles: Tile[], maxNumber: TileNumber): number[] | null {
  const numbers = tiles.map((t) => t.number);
  const has1 = numbers.includes(1);
  const has2 = numbers.includes(2);

  // 1과 2가 모두 있는 경우 — 1-2-3-4-5 ace low 만 허용
  if (has1 && has2) {
    const rest = [...numbers].sort((a, b) => a - b);
    if (rest.length !== 5) return null;
    if (rest[0] === 1 && rest[1] === 2 && rest[2] === 3 && rest[3] === 4 && rest[4] === 5) {
      // 1을 가장 약한 위치로 (가상 rank -1) → straight 강도는 5
      return [-1, 0, 1, 2, 3];
    }
    return null;
  }

  if (has1) {
    // 1이 있고 2가 없으면 ace high — 나머지 4개가 maxNumber-3 ~ maxNumber 연속이어야 함
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

// 스트레이트 strength: 가장 높은 위치의 (numberRank * 10 + suitRank)
// 같은 숫자 sequence면 max card의 suit로 tie-break
//   - ace high (12-13-14-15-1): top = 1 (ace)
//   - ace low (1-2-3-4-5): top = 5 (1을 가장 약한 위치로)
//   - 일반: top = max number
function straightStrength(tiles: Tile[], maxNumber: TileNumber): number {
  const numbers = tiles.map((t) => t.number);
  const has1 = numbers.includes(1);
  const has2 = numbers.includes(2);

  let topTile: Tile | undefined;
  let topRank: number;

  if (has1 && has2) {
    topTile = tiles.find((t) => t.number === 5);
    topRank = NUMBER_RANK[5 as TileNumber];
  } else if (has1) {
    topTile = tiles.find((t) => t.number === 1);
    topRank = NUMBER_RANK[maxNumber] + 1;
  } else {
    const maxNum = Math.max(...numbers) as TileNumber;
    topTile = tiles.find((t) => t.number === maxNum);
    topRank = NUMBER_RANK[maxNum];
  }
  const suitRank = topTile ? SUIT_RANK[topTile.suit as Suit] : 0;
  return topRank * 10 + suitRank;
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
