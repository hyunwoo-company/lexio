import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../game/models/game_state.dart';
import '../services/socket_service.dart';

// 소켓 서비스 싱글톤
final socketServiceProvider = Provider<SocketService>((ref) => SocketService());

// 내 플레이어 정보
class MyInfo {
  final String id;
  final String name;
  final String roomId;
  const MyInfo({required this.id, required this.name, required this.roomId});
}

final myInfoProvider = StateProvider<MyInfo?>((ref) => null);

// 게임 상태
final gameStateProvider = StateProvider<GameState?>((ref) => null);

// 라운드 결과
final roundResultProvider = StateProvider<RoundResult?>((ref) => null);

// 선택된 타일 ID 목록
final selectedTileIdsProvider = StateProvider<List<String>>((ref) => []);

// 에러 메시지
final errorProvider = StateProvider<String?>((ref) => null);

// 대기실 방 정보
class RoomInfo {
  final String id;
  final List<Map<String, dynamic>> players;
  final int playerCount;
  final bool isPlaying;
  const RoomInfo({
    required this.id,
    required this.players,
    required this.playerCount,
    required this.isPlaying,
  });

  factory RoomInfo.fromJson(Map<String, dynamic> json) => RoomInfo(
        id: json['id'] as String,
        players: (json['players'] as List).cast<Map<String, dynamic>>(),
        playerCount: json['playerCount'] as int,
        isPlaying: json['isPlaying'] as bool,
      );
}

final roomInfoProvider = StateProvider<RoomInfo?>((ref) => null);

// 타일 선택 토글
extension GameNotifier on WidgetRef {
  void toggleTile(String tileId) {
    final current = read(selectedTileIdsProvider);
    if (current.contains(tileId)) {
      read(selectedTileIdsProvider.notifier).state = current.where((id) => id != tileId).toList();
    } else {
      read(selectedTileIdsProvider.notifier).state = [...current, tileId];
    }
  }

  void clearSelection() => read(selectedTileIdsProvider.notifier).state = [];
}
