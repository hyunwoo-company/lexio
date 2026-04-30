'use client';

import type { RoundResult, ClientGameState } from '@lexio/game-logic';

interface ScoreBoardProps {
  gameState: ClientGameState;
  roundResult: RoundResult;
  onReady: () => void;
}

export function ScoreBoard({ gameState, roundResult, onReady }: ScoreBoardProps) {
  const playerMap = Object.fromEntries(gameState.players.map((p) => [p.id, p.name]));

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-800 rounded-2xl max-w-md w-full">
      <h2 className="text-2xl font-bold">라운드 {gameState.roundNumber} 종료</h2>

      {roundResult.penalizedPlayers.length > 0 && (
        <div className="w-full">
          <h3 className="text-sm text-red-400 font-semibold mb-2">페널티 (숫자 1 보유)</h3>
          <ul className="space-y-1">
            {roundResult.penalizedPlayers.map((p) => (
              <li key={p.playerId} className="text-sm text-red-300">
                {playerMap[p.playerId]}: 타일 {p.tileCount}개 × {p.penaltyMultiplier}배 패널티
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full">
        <h3 className="text-sm text-gray-400 font-semibold mb-2">칩 교환</h3>
        {roundResult.exchanges.length === 0 ? (
          <p className="text-sm text-gray-500">교환 없음</p>
        ) : (
          <ul className="space-y-1">
            {roundResult.exchanges.map((ex, i) => (
              <li key={i} className="text-sm">
                <span className="text-red-400">{playerMap[ex.fromId]}</span>
                {' → '}
                <span className="text-green-400">{playerMap[ex.toId]}</span>
                {' '}
                <span className="font-bold">{ex.amount}점</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full">
        <h3 className="text-sm text-gray-400 font-semibold mb-2">현재 칩</h3>
        <ul className="space-y-1">
          {[...gameState.players]
            .sort((a, b) => b.chips - a.chips)
            .map((p) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="font-bold" style={{ color: '#F2C878' }}>{p.chips}점</span>
              </li>
            ))}
        </ul>
      </div>

      <button
        onClick={onReady}
        className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
      >
        다음 라운드 준비
      </button>
    </div>
  );
}
