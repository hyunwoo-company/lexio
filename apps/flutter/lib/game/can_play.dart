import 'models/tile_combination.dart';
import 'comparator.dart';

bool canPlay(TileCombination played, TileCombination last) {
  if (played.tiles.length != last.tiles.length) return false;
  return compareCombinations(played, last) > 0;
}
