import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../game/models/game_state.dart';
import '../providers/game_provider.dart';

class ScoreScreen extends ConsumerWidget {
  final GameState gameState;
  final RoundResult roundResult;

  const ScoreScreen({super.key, required this.gameState, required this.roundResult});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final myInfo = ref.watch(myInfoProvider);
    final playerMap = {for (final p in gameState.players) p.id: p.name};

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Container(
              width: 360,
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(color: const Color(0xFF1F2937), borderRadius: BorderRadius.circular(20)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    '라운드 ${gameState.roundNumber} 종료',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),

                  if (roundResult.penalizedPlayers.isNotEmpty) ...[
                    const Text('페널티 (숫자 2 보유)', style: TextStyle(fontSize: 13, color: Color(0xFFF87171), fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    ...roundResult.penalizedPlayers.map((p) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text(
                            '${playerMap[p.playerId]}: 타일 ${p.tileCount}개 × ${p.penaltyMultiplier}배',
                            style: const TextStyle(fontSize: 13, color: Color(0xFFFCA5A5)),
                          ),
                        )),
                    const SizedBox(height: 16),
                  ],

                  const Text('칩 교환', style: TextStyle(fontSize: 13, color: Color(0xFF9CA3AF), fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  if (roundResult.exchanges.isEmpty)
                    const Text('교환 없음', style: TextStyle(fontSize: 13, color: Color(0xFF6B7280)))
                  else
                    ...roundResult.exchanges.map((ex) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Row(
                            children: [
                              Text(playerMap[ex.fromId] ?? '?', style: const TextStyle(color: Color(0xFFF87171))),
                              const Text(' → ', style: TextStyle(color: Color(0xFF9CA3AF))),
                              Text(playerMap[ex.toId] ?? '?', style: const TextStyle(color: Color(0xFF4ADE80))),
                              const Spacer(),
                              Text('${ex.amount}점', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                            ],
                          ),
                        )),

                  const SizedBox(height: 20),
                  const Text('현재 칩', style: TextStyle(fontSize: 13, color: Color(0xFF9CA3AF), fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  ...(List<ClientPlayer>.from(gameState.players)
                        ..sort((a, b) => b.chips.compareTo(a.chips)))
                      .map((p) => Padding(
                            padding: const EdgeInsets.only(bottom: 4),
                            child: Row(
                              children: [
                                Text(
                                  p.name,
                                  style: TextStyle(
                                    color: p.id == myInfo?.id ? Colors.white : const Color(0xFFD1D5DB),
                                    fontWeight: p.id == myInfo?.id ? FontWeight.bold : FontWeight.normal,
                                  ),
                                ),
                                const Spacer(),
                                Text('${p.chips}점', style: const TextStyle(color: Color(0xFFFBBF24), fontWeight: FontWeight.bold)),
                              ],
                            ),
                          )),

                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      final roomId = ref.read(myInfoProvider)?.roomId;
                      if (roomId != null) {
                        ref.read(socketServiceProvider).emit('game:ready', {'roomId': roomId});
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('다음 라운드 준비', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
