import 'tile.dart';
import 'tile_combination.dart';

class ClientPlayer {
  final String id;
  final String name;
  final int chips;
  final bool isConnected;
  final int handCount;
  final List<Tile>? hand; // 본인 패만 채워짐

  const ClientPlayer({
    required this.id,
    required this.name,
    required this.chips,
    required this.isConnected,
    required this.handCount,
    this.hand,
  });

  factory ClientPlayer.fromJson(Map<String, dynamic> json) {
    final rawHand = json['hand'] as List?;
    return ClientPlayer(
      id: json['id'] as String,
      name: json['name'] as String,
      chips: json['chips'] as int,
      isConnected: json['isConnected'] as bool,
      handCount: json['handCount'] as int,
      hand: rawHand?.map((t) => Tile.fromJson(t as Map<String, dynamic>)).toList(),
    );
  }
}

enum GamePhase { waiting, playing, scoring, finished }

class GameState {
  final GamePhase phase;
  final List<ClientPlayer> players;
  final int currentPlayerIndex;
  final TileCombination? lastPlay;
  final String? lastPlayerId;
  final int passCount;
  final int roundNumber;
  final String? firstPlayerId;

  const GameState({
    required this.phase,
    required this.players,
    required this.currentPlayerIndex,
    this.lastPlay,
    this.lastPlayerId,
    required this.passCount,
    required this.roundNumber,
    this.firstPlayerId,
  });

  ClientPlayer? get currentPlayer =>
      currentPlayerIndex < players.length ? players[currentPlayerIndex] : null;

  factory GameState.fromJson(Map<String, dynamic> json) {
    final lastPlayJson = json['lastPlay'] as Map<String, dynamic>?;
    return GameState(
      phase: GamePhase.values.byName(json['phase'] as String),
      players: (json['players'] as List)
          .map((p) => ClientPlayer.fromJson(p as Map<String, dynamic>))
          .toList(),
      currentPlayerIndex: json['currentPlayerIndex'] as int,
      lastPlay: lastPlayJson != null ? TileCombination.fromJson(lastPlayJson) : null,
      lastPlayerId: json['lastPlayerId'] as String?,
      passCount: json['passCount'] as int,
      roundNumber: json['roundNumber'] as int,
      firstPlayerId: json['firstPlayerId'] as String?,
    );
  }
}

class ChipExchange {
  final String fromId;
  final String toId;
  final int amount;

  const ChipExchange({required this.fromId, required this.toId, required this.amount});

  factory ChipExchange.fromJson(Map<String, dynamic> json) => ChipExchange(
        fromId: json['fromId'] as String,
        toId: json['toId'] as String,
        amount: json['amount'] as int,
      );
}

class PenalizedPlayer {
  final String playerId;
  final int tileCount;
  final int penaltyMultiplier;

  const PenalizedPlayer({
    required this.playerId,
    required this.tileCount,
    required this.penaltyMultiplier,
  });

  factory PenalizedPlayer.fromJson(Map<String, dynamic> json) => PenalizedPlayer(
        playerId: json['playerId'] as String,
        tileCount: json['tileCount'] as int,
        penaltyMultiplier: json['penaltyMultiplier'] as int,
      );
}

class RoundResult {
  final List<ChipExchange> exchanges;
  final List<PenalizedPlayer> penalizedPlayers;

  const RoundResult({required this.exchanges, required this.penalizedPlayers});

  factory RoundResult.fromJson(Map<String, dynamic> json) => RoundResult(
        exchanges: (json['exchanges'] as List)
            .map((e) => ChipExchange.fromJson(e as Map<String, dynamic>))
            .toList(),
        penalizedPlayers: (json['penalizedPlayers'] as List)
            .map((p) => PenalizedPlayer.fromJson(p as Map<String, dynamic>))
            .toList(),
      );
}
