import type { TileNumber, Suit, CombinationType, GameConfig, PlayerCount } from './types';

// 숫자 서열: 2가 최강(14), 3이 최약(0)
export const NUMBER_RANK: Record<TileNumber, number> = {
  3: 0, 4: 1, 5: 2, 6: 3, 7: 4, 8: 5, 9: 6,
  10: 7, 11: 8, 12: 9, 13: 10, 14: 11, 15: 12,
  1: 13, 2: 14,
};

// 문양 서열: 해가 최강(3), 구름이 최약(0)
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

export const SUIT_LABEL: Record<Suit, string> = {
  sun: '해',
  moon: '달',
  star: '별',
  cloud: '구름',
};
