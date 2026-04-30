'use client';

import { TileBack } from '@/components/tile/Tile';
import type { ClientPlayer } from '@lexio/game-logic';

interface PlayerSeatProps {
  player: ClientPlayer;
  isMe: boolean;
  isTurn: boolean;
  passed?: boolean;
  size?: 'sm' | 'md';
  showFan?: boolean;
}

export function PlayerSeat({
  player,
  isMe,
  isTurn,
  passed = false,
  size = 'md',
  showFan = true,
}: PlayerSeatProps) {
  const dims = size === 'sm' ? { ava: 36, font: 11 } : { ava: 44, font: 12 };
  const tilesShown = Math.min(player.handCount, size === 'sm' ? 7 : 9);
  const initial = player.name?.[0] ?? '?';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: passed ? 0.45 : 1,
        transition: 'opacity 200ms',
      }}
    >
      {/* 패뒷면 부채꼴 */}
      {showFan && player.handCount > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 2,
            padding: size === 'sm' ? '4px 6px 8px' : '6px 8px 10px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.18)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.25)',
          }}
        >
          {Array.from({ length: tilesShown }).map((_, i) => (
            <div
              key={i}
              style={{
                transform: `translateY(${Math.abs(i - tilesShown / 2) * 1.2}px)`,
              }}
            >
              <TileBack size="sm" />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        {/* 아바타 + 차례 ring */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: dims.ava,
              height: dims.ava,
              borderRadius: '50%',
              background: isMe
                ? 'linear-gradient(135deg, #1A4030, #0A2018)'
                : 'linear-gradient(135deg, #3A2D1A, #1A1408)',
              border: `2px solid ${isTurn ? 'var(--fgg-gold-bright)' : isMe ? 'var(--fgg-cheongryong)' : 'var(--fgg-line)'}`,
              boxShadow: isTurn ? '0 0 16px rgba(242, 200, 120, 0.6)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--fgg-font-display)',
              fontWeight: 600,
              fontSize: dims.ava * 0.42,
              color: 'var(--fgg-gold-bright)',
            }}
          >
            {initial}
          </div>
          {/* 타일 카운트 버블 */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -6,
              background: '#0A0F0D',
              color: 'var(--fgg-gold-bright)',
              fontFamily: 'var(--fgg-font-num)',
              fontSize: 11,
              fontWeight: 600,
              padding: '1px 5px',
              borderRadius: 8,
              border: '1px solid var(--fgg-line-strong)',
              minWidth: 18,
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {player.handCount}
          </div>
        </div>

        {/* 이름 + 칩 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: dims.font,
              fontWeight: 600,
              color: isTurn ? 'var(--fgg-gold-bright)' : 'var(--fgg-text)',
              whiteSpace: 'nowrap',
              maxWidth: 96,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {player.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--fgg-text-dim)' }}>💰 {player.chips}</div>
        </div>
      </div>

      {/* 상태 pill */}
      {(isTurn || passed || !player.isConnected) && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: 999,
            background: isTurn ? 'rgba(242, 200, 120, 0.15)' : 'rgba(255,255,255,0.05)',
            color: !player.isConnected
              ? '#FF8088'
              : isTurn
              ? 'var(--fgg-gold-bright)'
              : 'var(--fgg-text-dim)',
            border: `1px solid ${
              !player.isConnected
                ? 'rgba(230,57,70,0.4)'
                : isTurn
                ? 'var(--fgg-gold)'
                : 'var(--fgg-line)'
            }`,
          }}
        >
          {!player.isConnected ? '연결 끊김' : isTurn ? '차례' : '패스'}
        </div>
      )}
    </div>
  );
}
