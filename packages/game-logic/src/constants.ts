import type { TileNumber, Suit, CombinationType, GameConfig, PlayerCount } from './types';

// FGG 숫자 서열: 1이 최강(14, ace high), 2가 최약(0)
// 1 > 15 > 14 > ... > 4 > 3 > 2
export const NUMBER_RANK: Record<TileNumber, number> = {
  2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7,
  10: 8, 11: 9, 12: 10, 13: 11, 14: 12, 15: 13,
  1: 14,
};

// 문양 서열: 주작(sun)이 최강(3), 현무(cloud)가 최약(0)
// sun=주작, moon=청룡, star=백호, cloud=현무
export const SUIT_RANK: Record<Suit, number> = {
  cloud: 0,
  star: 1,
  moon: 2,
  sun: 3,
};

// 5개 조합 족보 등급
export const COMBINATION_RANK: Record<CombinationType, number> = {
  single: -1,
  pair: -1,
  triple: -1,
  straight: 0,
  flush: 1,
  fullhouse: 2,
  fourcard: 3,
  straightflush: 4,
};

// 인원수별 게임 설정
export const GAME_CONFIG: Record<PlayerCount, GameConfig> = {
  3: { playerCount: 3, maxNumber: 9, tilesPerPlayer: 12 },
  4: { playerCount: 4, maxNumber: 13, tilesPerPlayer: 13 },
  5: { playerCount: 5, maxNumber: 15, tilesPerPlayer: 12 },
};

export const ALL_SUITS: Suit[] = ['sun', 'moon', 'star', 'cloud'];

// 사신수 매핑
export const SUIT_LABEL: Record<Suit, string> = {
  sun: '주작',
  moon: '청룡',
  star: '백호',
  cloud: '현무',
};
