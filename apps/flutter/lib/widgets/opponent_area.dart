import 'package:flutter/material.dart';
import '../game/models/game_state.dart';
import 'tile_widget.dart';

class OpponentArea extends StatelessWidget {
  final ClientPlayer player;
  final bool isCurrentTurn;

  const OpponentArea({super.key, required this.player, this.isCurrentTurn = false});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: isCurrentTurn ? const Color(0xFF1F2937) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        border: isCurrentTurn ? Border.all(color: const Color(0xFFFBBF24), width: 2) : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(player.name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              if (isCurrentTurn) ...[
                const SizedBox(width: 4),
                const Text('차례', style: TextStyle(fontSize: 11, color: Color(0xFFFBBF24))),
              ],
            ],
          ),
          const SizedBox(height: 4),
          Text('칩: ${player.chips}', style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
          const SizedBox(height: 6),
          Wrap(
            spacing: 3,
            runSpacing: 3,
            alignment: WrapAlignment.center,
            children: List.generate(
              player.handCount,
              (_) => const TileBackWidget(width: 28, height: 40),
            ),
          ),
          if (!player.isConnected)
            const Padding(
              padding: EdgeInsets.only(top: 4),
              child: Text('연결 끊김', style: TextStyle(fontSize: 10, color: Color(0xFFF87171))),
            ),
        ],
      ),
    );
  }
}
