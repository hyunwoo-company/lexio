'use client';

import { TileBack } from '@/components/tile/Tile';
import type { ClientPlayer } from '@lexio/game-logic';

interface OpponentAreaProps {
  player: ClientPlayer;
  isCurrentTurn: boolean;
}

export function OpponentArea({ player, isCurrentTurn }: OpponentAreaProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '6px 8px',
        borderRadius: 12,
        background: isCurrentTurn ? 'rgba(250,204,21,0.12)' : 'rgba(0,0,0,0.15)',
        border: isCurrentTurn ? '1.5px solid rgba(250,204,21,0.5)' : '1.5px solid transparent',
        transition: 'all 0.2s ease',
        minWidth: 60,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: isCurrentTurn ? '#fcd34d' : '#cbd5e1',
          maxWidth: 70,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {player.name}
        </span>
        {isCurrentTurn && (
          <span style={{ fontSize: 10, color: '#fbbf24', animation: 'pulse 1s infinite' }}>▲</span>
        )}
      </div>
      <span style={{ fontSize: 10, color: '#64748b' }}>칩: {player.chips}</span>

      {/* 타일 패 (쌓인 형태로 표시) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', maxWidth: 120 }}>
        {Array.from({ length: Math.min(player.handCount, 9) }).map((_, i) => (
          <TileBack key={i} size="sm" />
        ))}
        {player.handCount > 9 && (
          <span style={{ fontSize: 10, color: '#94a3b8', alignSelf: 'center' }}>+{player.handCount - 9}</span>
        )}
      </div>
      {player.handCount === 0 && (
        <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>완료!</span>
      )}
      {!player.isConnected && (
        <span style={{ fontSize: 10, color: '#ef4444' }}>연결 끊김</span>
      )}
    </div>
  );
}
