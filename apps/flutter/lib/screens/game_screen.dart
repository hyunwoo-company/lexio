import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/game_provider.dart';
import '../game/models/game_state.dart';
import '../widgets/opponent_area.dart';
import '../widgets/center_play.dart';
import '../widgets/tile_widget.dart';
import '../widgets/action_buttons.dart';
import 'score_screen.dart';

class GameScreen extends ConsumerStatefulWidget {
  const GameScreen({super.key});

  @override
  ConsumerState<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends ConsumerState<GameScreen> {
  @override
  void initState() {
    super.initState();
    _registerSocketListeners();
  }

  void _registerSocketListeners() {
    final socket = ref.read(socketServiceProvider);
    socket.on('game:stateSync', (data) {
      ref.read(gameStateProvider.notifier).state =
          GameState.fromJson((data as Map).cast<String, dynamic>());
      ref.read(selectedTileIdsProvider.notifier).state = [];
    });
    socket.on('game:roundEnd', (data) {
      final m = (data as Map).cast<String, dynamic>();
      ref.read(gameStateProvider.notifier).state = GameState.fromJson(m['state'].cast<String, dynamic>());
      ref.read(roundResultProvider.notifier).state = RoundResult.fromJson(m['roundResult'].cast<String, dynamic>());
      ref.read(selectedTileIdsProvider.notifier).state = [];
    });
    socket.on('game:invalid', (data) {
      ref.read(errorProvider.notifier).state = (data as Map)['reason'] as String;
    });
  }

  @override
  void dispose() {
    final socket = ref.read(socketServiceProvider);
    socket.off('game:stateSync');
    socket.off('game:roundEnd');
    socket.off('game:invalid');
    super.dispose();
  }

  void _play() {
    final selected = ref.read(selectedTileIdsProvider);
    final roomId = ref.read(myInfoProvider)?.roomId;
    if (selected.isEmpty || roomId == null) return;
    ref.read(socketServiceProvider).emit('game:play', {'roomId': roomId, 'tileIds': selected});
    ref.read(selectedTileIdsProvider.notifier).state = [];
  }

  void _pass() {
    final roomId = ref.read(myInfoProvider)?.roomId;
    if (roomId == null) return;
    ref.read(socketServiceProvider).emit('game:pass', {'roomId': roomId});
    ref.read(selectedTileIdsProvider.notifier).state = [];
  }

  @override
  Widget build(BuildContext context) {
    final gameState = ref.watch(gameStateProvider);
    final myInfo = ref.watch(myInfoProvider);
    final selectedIds = ref.watch(selectedTileIdsProvider);
    final error = ref.watch(errorProvider);
    final roundResult = ref.watch(roundResultProvider);

    if (gameState == null || myInfo == null) {
      return const Scaffold(backgroundColor: Color(0xFF111827), body: Center(child: CircularProgressIndicator()));
    }

    // 라운드 종료 화면
    if (roundResult != null && gameState.phase == GamePhase.scoring) {
      return ScoreScreen(gameState: gameState, roundResult: roundResult);
    }

    final me = gameState.players.firstWhere((p) => p.id == myInfo.id, orElse: () => gameState.players[0]);
    final opponents = gameState.players.where((p) => p.id != myInfo.id).toList();
    final currentPlayer = gameState.currentPlayer;
    final isMyTurn = currentPlayer?.id == myInfo.id;
    final playerNames = {for (final p in gameState.players) p.id: p.name};

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // 상대 플레이어 영역
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: const BoxDecoration(
                    border: Border(bottom: BorderSide(color: Color(0xFF374151))),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: opponents
                        .map((p) => OpponentArea(
                              player: p,
                              isCurrentTurn: currentPlayer?.id == p.id,
                            ))
                        .toList(),
                  ),
                ),

                // 중앙 플레이 영역
                Expanded(
                  child: Center(
                    child: CenterPlay(
                      lastPlay: gameState.lastPlay,
                      lastPlayerName: gameState.lastPlayerId != null ? playerNames[gameState.lastPlayerId] : null,
                      currentPlayerName: currentPlayer?.name ?? '?',
                    ),
                  ),
                ),

                // 내 영역
                Container(
                  decoration: const BoxDecoration(
                    border: Border(top: BorderSide(color: Color(0xFF374151))),
                  ),
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(me.name, style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 13)),
                            Text('칩: ${me.chips}', style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 13)),
                          ],
                        ),
                      ),
                      // 손패
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          alignment: WrapAlignment.center,
                          children: (me.hand ?? []).map((tile) => TileWidget(
                            tile: tile,
                            isSelected: selectedIds.contains(tile.id),
                            onTap: isMyTurn ? () => ref.toggleTile(tile.id) : null,
                          )).toList(),
                        ),
                      ),
                      const SizedBox(height: 8),
                      ActionButtons(
                        isMyTurn: isMyTurn,
                        hasSelection: selectedIds.isNotEmpty,
                        onPlay: _play,
                        onPass: _pass,
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // 에러 토스트
            if (error != null)
              Positioned(
                bottom: 80,
                left: 20,
                right: 20,
                child: Material(
                  borderRadius: BorderRadius.circular(12),
                  color: const Color(0xFFB91C1C),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      children: [
                        Expanded(child: Text(error, style: const TextStyle(color: Colors.white))),
                        GestureDetector(
                          onTap: () => ref.read(errorProvider.notifier).state = null,
                          child: const Text('닫기', style: TextStyle(color: Colors.white70, decoration: TextDecoration.underline)),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
