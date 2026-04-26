import 'models/tile.dart';
import 'models/tile_combination.dart';
import 'constants.dart';

int getNumberRank(int n) => numberRank[n] ?? 0;
int getSuitRank(Suit s) => suitRank[s] ?? 0;

// 양수: a > b, 음수: a < b
int compareTiles(Tile a, Tile b) {
  final numDiff = getNumberRank(a.number) - getNumberRank(b.number);
  if (numDiff != 0) return numDiff;
  return getSuitRank(a.suit) - getSuitRank(b.suit);
}

Tile getStrongestTile(List<Tile> tiles) =>
    tiles.reduce((best, t) => compareTiles(t, best) > 0 ? t : best);

double calcSimpleStrength(List<Tile> tiles) {
  final s = getStrongestTile(tiles);
  return getNumberRank(s.number) * 10.0 + getSuitRank(s.suit);
}

const combinationRank = {
  CombinationType.single: -1,
  CombinationType.pair: -1,
  CombinationType.triple: -1,
  CombinationType.straight: 0,
  CombinationType.flush: 1,
  CombinationType.fullhouse: 2,
  CombinationType.fourcard: 3,
  CombinationType.straightflush: 4,
};

int compareCombinations(TileCombination a, TileCombination b) {
  if (a.tiles.length == 5) {
    final rankDiff = (combinationRank[a.type] ?? 0) - (combinationRank[b.type] ?? 0);
    if (rankDiff != 0) return rankDiff;
  }
  return a.strength.compareTo(b.strength);
}
