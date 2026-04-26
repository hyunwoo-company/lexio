'use client';

import { useGameStore } from '@/store/gameStore';
import { useSocket } from '@/hooks/useSocket';
import { OpponentArea } from './OpponentArea';
import { CenterPlay } from './CenterPlay';
import { PlayerHand } from './PlayerHand';
import { ActionButtons } from './ActionButtons';
import { ScoreBoard } from './ScoreBoard';
import type { Tile } from '@lexio/game-logic';

export function GameBoard() {
  const { gameState, myId, roomId, selectedTileIds, clearSelection, setError, roundResult, error } = useGameStore();
  const socket = useSocket();

  if (!gameState || !myId || !roomId) return null;

  const me = gameState.players.find((p) => p.id === myId);
  const opponents = gameState.players.filter((p) => p.id !== myId);
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myId;
  const playerNames = Object.fromEntries(gameState.players.map((p) => [p.id, p.name]));

  const handlePlay = () => {
    if (selectedTileIds.length === 0) return;
    socket.emit('game:play', { roomId, tileIds: selectedTileIds });
    clearSelection();
  };

  const handlePass = () => {
    socket.emit('game:pass', { roomId });
    clearSelection();
  };

  const handleReady = () => {
    socket.emit('game:ready', { roomId });
  };

  if (roundResult && gameState.phase === 'scoring') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #0d3320 0%, #071a10 100%)',
          padding: 16,
        }}
      >
        <ScoreBoard gameState={gameState} roundResult={roundResult} onReady={handleReady} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at center, #0e3b1f 0%, #071810 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 테이블 테두리 느낌 */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '8px solid #3d1a00',
        borderRadius: 0,
        pointerEvents: 'none',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
        zIndex: 10,
      }} />

      {/* 상대 플레이어 영역 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: '12px 8px 8px',
        borderBottom: '2px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap',
        gap: 4,
        minHeight: 100,
      }}>
        {opponents.map((p) => (
          <OpponentArea
            key={p.id}
            player={p}
            isCurrentTurn={currentPlayer?.id === p.id}
          />
        ))}
      </div>

      {/* 중앙 플레이 영역 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
      }}>
        <CenterPlay
          lastPlay={gameState.lastPlay}
          lastPlayerId={gameState.lastPlayerId}
          playerNames={playerNames}
          currentPlayerName={currentPlayer?.name ?? '?'}
        />
      </div>

      {/* 내 영역 */}
      <div style={{
        borderTop: '2px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.25)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 16px 0',
        }}>
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{me?.name}</span>
          <span style={{ fontSize: 12, color: '#fbbf24' }}>칩: {me?.chips}</span>
        </div>
        <PlayerHand hand={(me?.hand ?? []) as Tile[]} isMyTurn={isMyTurn} />
        <ActionButtons
          isMyTurn={isMyTurn}
          hasSelection={selectedTileIds.length > 0}
          onPlay={handlePlay}
          onPass={handlePass}
        />
      </div>

      {/* 에러 토스트 */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#b91c1c',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          whiteSpace: 'nowrap',
        }}>
          {error}
          <button
            style={{ textDecoration: 'underline', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}
            onClick={() => setError(null)}
          >닫기</button>
        </div>
      )}
    </div>
  );
}
