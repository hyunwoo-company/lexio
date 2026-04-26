import 'package:flutter/material.dart';
import '../game/models/tile_combination.dart';
import 'tile_widget.dart';

class CenterPlay extends StatelessWidget {
  final TileCombination? lastPlay;
  final String? lastPlayerName;
  final String currentPlayerName;

  const CenterPlay({
    super.key,
    this.lastPlay,
    this.lastPlayerName,
    required this.currentPlayerName,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          '현재 차례: $currentPlayerName',
          style: const TextStyle(color: Color(0xFFFBBF24), fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        if (lastPlay != null) ...[
          Text(
            '${lastPlayerName ?? '?'} — ${combinationLabel[lastPlay!.type]}',
            style: const TextStyle(fontSize: 12, color: Color(0xFF9CA3AF)),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: lastPlay!.tiles
                .map((t) => Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 3),
                      child: TileWidget(tile: t, width: 56, height: 78),
                    ))
                .toList(),
          ),
        ] else
          const Text('패를 내 주세요', style: TextStyle(color: Color(0xFF6B7280))),
      ],
    );
  }
}
