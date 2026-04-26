import 'tile.dart';

enum CombinationType {
  single,
  pair,
  triple,
  straight,
  flush,
  fullhouse,
  fourcard,
  straightflush,
}

class TileCombination {
  final List<Tile> tiles;
  final CombinationType type;
  final double strength;

  const TileCombination({
    required this.tiles,
    required this.type,
    required this.strength,
  });

  factory TileCombination.fromJson(Map<String, dynamic> json) => TileCombination(
        tiles: (json['tiles'] as List).map((t) => Tile.fromJson(t as Map<String, dynamic>)).toList(),
        type: CombinationType.values.byName(json['type'] as String),
        strength: (json['strength'] as num).toDouble(),
      );
}

const combinationLabel = {
  CombinationType.single: '싱글',
  CombinationType.pair: '페어',
  CombinationType.triple: '트리플',
  CombinationType.straight: '스트레이트',
  CombinationType.flush: '플러시',
  CombinationType.fullhouse: '풀하우스',
  CombinationType.fourcard: '포카드',
  CombinationType.straightflush: '스트레이트 플러시',
};
