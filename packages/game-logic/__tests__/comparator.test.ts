import { compareTiles, getNumberRank, getSuitRank } from '../src/comparator';
import type { Tile } from '../src/types';

const tile = (number: number, suit: string): Tile =>
  ({ id: `${suit}-${number}`, number, suit } as Tile);

describe('getNumberRank', () => {
  it('2가 가장 높음 (14)', () => expect(getNumberRank(2)).toBe(14));
  it('1이 두 번째로 높음 (13)', () => expect(getNumberRank(1)).toBe(13));
  it('3이 가장 낮음 (0)', () => expect(getNumberRank(3)).toBe(0));
  it('15가 12', () => expect(getNumberRank(15)).toBe(12));
});

describe('getSuitRank', () => {
  it('해가 최강 (3)', () => expect(getSuitRank('sun')).toBe(3));
  it('구름이 최약 (0)', () => expect(getSuitRank('cloud')).toBe(0));
});

describe('compareTiles', () => {
  it('숫자 서열: 해3 > 구름2이지만 실제는 해3 < 구름4', () => {
    // 해3(number=3, rank=0) vs 구름4(number=4, rank=1)
    expect(compareTiles(tile(3, 'sun'), tile(4, 'cloud'))).toBeLessThan(0);
  });

  it('같은 숫자면 문양 서열로 비교', () => {
    expect(compareTiles(tile(5, 'sun'), tile(5, 'cloud'))).toBeGreaterThan(0);
  });

  it('해2가 모든 타일 중 최강', () => {
    expect(compareTiles(tile(2, 'sun'), tile(1, 'sun'))).toBeGreaterThan(0);
    expect(compareTiles(tile(2, 'sun'), tile(15, 'sun'))).toBeGreaterThan(0);
  });

  it('구름3이 모든 타일 중 최약', () => {
    expect(compareTiles(tile(3, 'cloud'), tile(3, 'star'))).toBeLessThan(0);
    expect(compareTiles(tile(3, 'cloud'), tile(4, 'cloud'))).toBeLessThan(0);
  });
});
