enum Suit {
  sun,   // 해 (빨강, 최강)
  moon,  // 달 (초록)
  star,  // 별 (노랑)
  cloud, // 구름 (파랑, 최약)
}

class Tile {
  final String id;
  final int number; // 1~15
  final Suit suit;

  const Tile({required this.id, required this.number, required this.suit});

  factory Tile.fromJson(Map<String, dynamic> json) => Tile(
        id: json['id'] as String,
        number: json['number'] as int,
        suit: Suit.values.byName(json['suit'] as String),
      );

  Map<String, dynamic> toJson() => {'id': id, 'number': number, 'suit': suit.name};

  @override
  String toString() => '${suit.name} $number';

  @override
  bool operator ==(Object other) => other is Tile && other.id == id;

  @override
  int get hashCode => id.hashCode;
}
