'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSocket } from '@/hooks/useSocket';
import { PlayerSeat } from './PlayerSeat';
import { CenterField } from './CenterField';
import { RoundHeader } from './RoundHeader';
import { PlayerHand } from './PlayerHand';
import { ActionBar } from './ActionBar';
import { ScoreBoard } from './ScoreBoard';
import type { ClientPlayer, Tile } from '@lexio/game-logic';

// 사람 수별 좌석 위치 (% 단위, 절대좌표) + anchor (좌석을 viewport 안쪽으로 정렬해 잘림 방지)
// 0번 = me (항상 하단 중앙). 1번~ = 시계방향(왼쪽 → 위 → 오른쪽)으로 상대들 배치.
type SeatAnchor = 'top' | 'bottom' | 'left' | 'right';

const SEAT_LAYOUTS: Record<3 | 4 | 5, { x: number; y: number; anchor: SeatAnchor }[]> = {
  3: [
    { x: 50, y: 88, anchor: 'bottom' },
    { x: 4,  y: 28, anchor: 'left' },
    { x: 96, y: 28, anchor: 'right' },
  ],
  4: [
    { x: 50, y: 88, anchor: 'bottom' },
    { x: 4,  y: 46, anchor: 'left' },
    { x: 50, y: 14, anchor: 'top' },
    { x: 96, y: 46, anchor: 'right' },
  ],
  5: [
    { x: 50, y: 88, anchor: 'bottom' },
    { x: 4,  y: 56, anchor: 'left' },
    { x: 22, y: 14, anchor: 'top' },
    { x: 78, y: 14, anchor: 'top' },
    { x: 96, y: 56, anchor: 'right' },
  ],
};

function transformForAnchor(anchor: SeatAnchor): string {
  switch (anchor) {
    case 'left':   return 'translate(0, -50%)';
    case 'right':  return 'translate(-100%, -50%)';
    case 'top':    return 'translate(-50%, 0)';
    case 'bottom':
    default:       return 'translate(-50%, -50%)';
  }
}

// 내 자리(0번) 다음부터 시계방향으로 상대 배치 — gameState.players의 순서를 좌석 인덱스에 매핑
function makeSeatedPlayers(players: ClientPlayer[], myId: string): { player: ClientPlayer; seatIdx: number }[] {
  const meIdx = players.findIndex((p) => p.id === myId);
  if (meIdx < 0) return players.map((p, i) => ({ player: p, seatIdx: i }));
  const ordered: ClientPlayer[] = [];
  for (let k = 0; k < players.length; k++) {
    ordered.push(players[(meIdx + k) % players.length]);
  }
  return ordered.map((p, i) => ({ player: p, seatIdx: i }));
}

export function GameBoard() {
  const { gameState, myId, roomId, selectedTileIds, clearSelection, setError, roundResult, error } = useGameStore();
  const socket = useSocket();
  const [sortMode, setSortMode] = useState<'number' | 'suit'>('number');

  if (!gameState || !myId || !roomId) return null;

  const playerCount = gameState.players.length as 3 | 4 | 5;
  const seats = SEAT_LAYOUTS[playerCount] ?? SEAT_LAYOUTS[4];
  const seated = makeSeatedPlayers(gameState.players, myId);
  const me = gameState.players.find((p) => p.id === myId);
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myId;
  const playerNames = Object.fromEntries(gameState.players.map((p) => [p.id, p.name]));
  const lastPlayerName = gameState.lastPlayerId ? playerNames[gameState.lastPlayerId] : undefined;

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
        className="fgg-felt"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <ScoreBoard gameState={gameState} roundResult={roundResult} onReady={handleReady} />
      </div>
    );
  }

  return (
    <div
      className="fgg-felt"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 비네트 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {/* 황동 테이블 림 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '6px solid #2A1F0F',
          boxShadow: 'inset 0 0 0 1px var(--fgg-line-strong), inset 0 0 60px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* 라운드 헤더 */}
      <RoundHeader
        round={gameState.roundNumber}
        currentTurnName={currentPlayer?.name ?? '?'}
        roomCode={roomId}
      />

      {/* Oval 테이블 + 좌석 + 중앙필드를 담는 메인 영역 */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
        }}
      >
        {/* Oval table outline */}
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            top: '24%',
            bottom: '32%',
            borderRadius: '50% / 40%',
            border: '2px solid rgba(212, 166, 86, 0.25)',
            background:
              'radial-gradient(ellipse at center, rgba(30, 92, 70, 0.6) 0%, rgba(14, 58, 44, 0.3) 70%, transparent 100%)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 0 80px rgba(0,0,0,0.4)',
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 18,
              border: '1px solid rgba(212, 166, 86, 0.12)',
              borderRadius: '50% / 40%',
            }}
          />
        </div>

        {/* 중앙 필드 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '46%',
            transform: 'translate(-50%, -50%)',
            zIndex: 4,
          }}
        >
          <CenterField lastPlay={gameState.lastPlay} lastPlayerName={lastPlayerName} />
        </div>

        {/* 상대 좌석들 (내 자리 0번은 하단 hand 섹션이 대신함) */}
        {seated.map(({ player, seatIdx }) => {
          if (seatIdx === 0) return null; // 내 자리는 별도
          const seat = seats[seatIdx];
          if (!seat) return null;
          const isTurn = currentPlayer?.id === player.id;
          return (
            <div
              key={player.id}
              style={{
                position: 'absolute',
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                transform: transformForAnchor(seat.anchor),
                zIndex: 5,
              }}
            >
              <PlayerSeat
                player={player}
                isMe={false}
                isTurn={isTurn}
                size="md"
                showFan={true}
              />
            </div>
          );
        })}
      </div>

      {/* 하단: 내 손패 + 액션 바 */}
      <div
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,15,13,0.6) 100%)',
          borderTop: '1px solid var(--fgg-line)',
          zIndex: 6,
          position: 'relative',
        }}
      >
        {/* 내 identity strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '6px 18px 0',
          }}
        >
          {me && (
            <PlayerSeat
              player={me}
              isMe={true}
              isTurn={isMyTurn}
              size="sm"
              showFan={false}
            />
          )}
        </div>

        {/* 손패 */}
        <PlayerHand hand={(me?.hand ?? []) as Tile[]} isMyTurn={isMyTurn} sortMode={sortMode} />

        {/* 액션바 */}
        <ActionBar
          isMyTurn={isMyTurn}
          selectedCount={selectedTileIds.length}
          onPlay={handlePlay}
          onPass={handlePass}
          onSort={() => setSortMode(sortMode === 'number' ? 'suit' : 'number')}
          sortMode={sortMode}
        />
      </div>

      {/* 에러 토스트 */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
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
          }}
        >
          {error}
          <button
            style={{
              textDecoration: 'underline',
              fontSize: 13,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              color: '#fff',
            }}
            onClick={() => setError(null)}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}
