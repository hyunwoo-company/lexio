import 'package:flutter/material.dart';

class ActionButtons extends StatelessWidget {
  final bool isMyTurn;
  final bool hasSelection;
  final VoidCallback onPlay;
  final VoidCallback onPass;

  const ActionButtons({
    super.key,
    required this.isMyTurn,
    required this.hasSelection,
    required this.onPlay,
    required this.onPass,
  });

  @override
  Widget build(BuildContext context) {
    if (!isMyTurn) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Text('다른 플레이어의 차례입니다...', style: TextStyle(color: Color(0xFF6B7280))),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          OutlinedButton(
            onPressed: onPass,
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.white,
              side: const BorderSide(color: Color(0xFF4B5563)),
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
            ),
            child: const Text('패스', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          ElevatedButton(
            onPressed: hasSelection ? onPlay : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              disabledBackgroundColor: const Color(0xFF374151),
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
            ),
            child: Text(
              hasSelection ? '타일 내기' : '타일 선택',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
