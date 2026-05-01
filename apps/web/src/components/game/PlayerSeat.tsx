'use client';

import type { ClientPlayer } from '@lexio/game-logic';

interface PlayerSeatProps {
  player: ClientPlayer;
  isMe: boolean;
  isTurn: boolean;
  passed?: boolean;
  size?: 'sm' | 'md';
  /** @deprecated 패뒷면은 더 이상 표시 안 함 */
  showFan?: boolean;
}

export function PlayerSeat({
  player,
  isMe,
  isTurn,
  passed = false,
  size = 'md',
}: PlayerSeatProps) {
  const dims = size === 'sm' ? { ava: 30, font: 11, stat: 10 } : { ava: 38, font: 12, stat: 11 };
  const initial = player.name?.[0] ?? '?';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: size === 'sm' ? '5px 10px 5px 5px' : '6px 12px 6px 6px',
        borderRadius: 999,
        background: isTurn ? 'rgba(212,166,86,0.18)' : 'rgba(10,15,13,0.7)',
        border: `1.5px solid ${
          isTurn ? 'var(--fgg-gold)' : !player.isConnected ? 'rgba(230,57,70,0.5)' : 'var(--fgg-line)'
        }`,
        boxShadow: isTurn
          ? '0 0 18px rgba(242,200,120,0.45), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 4px 12px rgba(0,0,0,0.35)',
        opacity: passed ? 0.45 : 1,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'all 220ms',
        whiteSpace: 'nowrap',
      }}
    >
      {/* 아바타 */}
      <div
        style={{
          width: dims.ava,
          height: dims.ava,
          borderRadius: '50%',
          background: isMe
            ? 'linear-gradient(135deg, #1A4030, #0A2018)'
            : 'linear-gradient(135deg, #3A2D1A, #1A1408)',
          border: `1.5px solid ${isTurn ? 'var(--fgg-gold-bright)' : isMe ? 'var(--fgg-cheongryong)' : 'rgba(212,166,86,0.4)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--fgg-font-display)',
          fontWeight: 600,
          fontSize: dims.ava * 0.46,
          color: 'var(--fgg-gold-bright)',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {initial}
      </div>

      {/* 이름 + 타일 + 코인 — 한 줄 (세로 공간 절약) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 7,
          minWidth: 0,
          lineHeight: 1.1,
        }}
      >
        <span
          style={{
            fontSize: dims.font,
            fontWeight: 600,
            color: isTurn ? 'var(--fgg-gold-bright)' : 'var(--fgg-text)',
            maxWidth: 80,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {player.name}
        </span>
        {/* 타일 카운트 — 골드 강조 */}
        <span
          style={{
            color: 'var(--fgg-gold-bright)',
            fontWeight: 700,
            fontSize: dims.stat,
            fontFamily: 'var(--fgg-font-num)',
          }}
          title="남은 타일"
        >
          🀫{player.handCount}
        </span>
        {/* 코인 */}
        <span
          style={{
            color: 'var(--fgg-text-dim)',
            fontSize: dims.stat,
            fontFamily: 'var(--fgg-font-num)',
          }}
          title="칩"
        >
          💰{player.chips}
        </span>
      </div>

      {/* 상태 라벨 (오른쪽 끝 작은 dot/text) */}
      {passed && !isTurn && (
        <span
          style={{
            fontSize: 9,
            color: '#FF8088',
            fontWeight: 700,
            letterSpacing: '0.06em',
            paddingLeft: 4,
          }}
        >
          PASS
        </span>
      )}
      {!player.isConnected && (
        <span style={{ fontSize: 9, color: '#FF8088', paddingLeft: 4 }}>⚠</span>
      )}
    </div>
  );
}
