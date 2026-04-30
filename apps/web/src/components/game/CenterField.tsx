'use client';

import { Tile } from '@/components/tile/Tile';
import type { TileCombination } from '@lexio/game-logic';

const COMBO_LABEL: Record<string, string> = {
  single: '싱글',
  pair: '페어',
  triple: '트리플',
  straight: '스트레이트',
  flush: '플러시',
  fullhouse: '풀하우스',
  fourcard: '포카드',
  straightflush: '스트레이트 플러시',
};

interface CenterFieldProps {
  lastPlay: TileCombination | null;
  lastPlayerName?: string;
}

export function CenterField({ lastPlay, lastPlayerName }: CenterFieldProps) {
  if (!lastPlay) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          padding: '20px 32px',
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--fgg-text-muted)',
            fontWeight: 600,
          }}
        >
          첫 패를 내 주세요
        </div>
        <div
          style={{
            width: 220,
            height: 100,
            borderRadius: 12,
            border: '2px dashed var(--fgg-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--fgg-text-faint, #3F3A2C)',
            fontFamily: 'var(--fgg-font-display)',
            fontSize: 14,
          }}
        >
          현무2 보유자가 시작
        </div>
      </div>
    );
  }

  const tiles = lastPlay.tiles;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--fgg-gold-bright)',
          fontWeight: 600,
        }}
      >
        현재 필드
      </div>

      {/* 부채꼴 fan으로 살짝 회전 */}
      <div style={{ display: 'flex', gap: 6, padding: '4px 10px' }}>
        {tiles.map((tile, i) => (
          <div
            key={tile.id}
            style={{
              transform: `rotate(${(i - (tiles.length - 1) / 2) * 4}deg) translateY(${
                Math.abs(i - (tiles.length - 1) / 2) * 2
              }px)`,
            }}
          >
            <Tile tile={tile} disabled size="md" />
          </div>
        ))}
      </div>

      <div
        style={{
          fontFamily: 'var(--fgg-font-display)',
          fontSize: 18,
          color: 'var(--fgg-text)',
          letterSpacing: '0.04em',
        }}
      >
        {COMBO_LABEL[lastPlay.type] ?? lastPlay.type}
      </div>

      {lastPlayerName && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--fgg-text-dim)',
            fontFamily: 'var(--fgg-font-display)',
            letterSpacing: '0.02em',
          }}
        >
          ◇ <span style={{ color: 'var(--fgg-gold-bright)', fontWeight: 600 }}>{lastPlayerName}</span>{' '}
          <span style={{ color: 'var(--fgg-text-muted)' }}>가 냄</span>
        </div>
      )}
    </div>
  );
}
