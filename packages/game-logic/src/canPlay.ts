import { compareCombinations } from './comparator';
import type { TileCombination } from './types';

// played가 last보다 강한지 검사
export function canPlay(played: TileCombination, last: TileCombination): boolean {
  // 개수가 달라야 하면 불가
  if (played.tiles.length !== last.tiles.length) return false;
  return compareCombinations(played, last) > 0;
}
