'use client';

import type { Tile as TileType } from '@lexio/game-logic';

type Suit = 'sun' | 'moon' | 'star' | 'cloud';

// FGG 사신수 매핑 (이미지: 사용자 제공 일러스트)
//   sun   = 주작 (Vermilion Bird) — 火/陽/태양     → 붉은 숫자
//   moon  = 현무 (Black Tortoise) — 水/陰/달빛     → 초록 숫자
//   star  = 백호 (White Tiger)    — 金/별자리      → 검정 숫자 (이미지가 흰 호랑이)
//   cloud = 청룡 (Azure Dragon)   — 木/雲從龍      → 푸른 숫자
const SUIT: Record<Suit, { name: string; color: string; img: string }> = {
  sun:   { name: '주작', color: '#C8323D', img: '/sasinsoo/jujak.png' },
  moon:  { name: '현무', color: '#2A8C56', img: '/sasinsoo/hyunmu.png' },
  star:  { name: '백호', color: '#1A1408', img: '/sasinsoo/baekho.png' },
  cloud: { name: '청룡', color: '#3A5A8C', img: '/sasinsoo/cheongryong.png' },
};

const SIZE = {
  sm: { w: 40, h: 56, num: 12, padX: 4,  padY: 12, radius: 5 },
  md: { w: 56, h: 80, num: 17, padX: 5,  padY: 16, radius: 7 },
  lg: { w: 72, h: 102, num: 22, padX: 6, padY: 20, radius: 9 },
};

interface TileProps {
  tile: TileType;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Tile({ tile, isSelected, onClick, disabled, size = 'md' }: TileProps) {
  const s = SUIT[tile.suit as Suit];
  const d = SIZE[size];
  const liftY = isSelected ? -Math.round(d.h * 0.18) : 0;
  const isClickable = !!onClick && !disabled;
  const isAce = tile.number === 1;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${s.name} ${tile.number}`}
      className={`fgg-tile${isSelected ? ' is-selected' : ''}${isClickable ? ' is-clickable' : ''}${isAce ? ' is-ace' : ''}`}
      style={{
        width: d.w,
        height: d.h,
        borderRadius: d.radius,
        transform: `translateY(${liftY}px)`,
        cursor: disabled ? 'default' : 'pointer',
        background: isAce
          ? 'linear-gradient(180deg, #FFFCEC 0%, #F8E9C2 25%, #F0DFA8 75%, #DBC384 100%)'
          : 'linear-gradient(180deg, #FFFDF4 0%, #FAF1D6 6%, #F4E6C0 18%, #F4E6C0 82%, #E2CC95 96%, #C8AC72 100%)',
      }}
    >
      {/* 상단 specular highlight */}
      <span
        style={{
          position: 'absolute',
          top: 0, left: '4%', right: '4%',
          height: 4,
          background: 'linear-gradient(180deg, rgba(255,253,240,0.95) 0%, rgba(255,253,240,0) 100%)',
          pointerEvents: 'none',
          zIndex: 4,
          borderRadius: 'inherit',
        }}
      />

      {/* 가운데 사신수 이미지 — 동그라미 없이 자연스럽게, 가로형 이미지를 contain */}
      <div
        style={{
          position: 'absolute',
          top: d.padY,
          bottom: d.padY,
          left: d.padX,
          right: d.padX,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <img
          src={s.img}
          alt={s.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            mixBlendMode: 'multiply',
            filter: isAce ? 'saturate(1.15) contrast(1.05)' : 'saturate(0.97)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 좌측상단 숫자 */}
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 4,
          fontFamily: 'Cormorant Garamond, "Noto Serif KR", Georgia, serif',
          fontWeight: 800,
          fontSize: d.num,
          lineHeight: 1,
          color: s.color,
          textShadow: '0 1px 0 rgba(255, 250, 230, 0.7)',
          letterSpacing: '-0.03em',
          zIndex: 3,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {tile.number}
      </span>

      {/* 우측하단 숫자 (180° 회전) */}
      <span
        style={{
          position: 'absolute',
          bottom: 2,
          right: 4,
          fontFamily: 'Cormorant Garamond, "Noto Serif KR", Georgia, serif',
          fontWeight: 800,
          fontSize: d.num,
          lineHeight: 1,
          color: s.color,
          textShadow: '0 1px 0 rgba(255, 250, 230, 0.7)',
          letterSpacing: '-0.03em',
          transform: 'rotate(180deg)',
          transformOrigin: 'center',
          zIndex: 3,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {tile.number}
      </span>

      {/* 외곽 림 — ace는 골드 강조 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          border: isAce ? '1.5px solid rgba(212,166,86,0.7)' : '1px solid rgba(140, 110, 60, 0.35)',
          boxShadow: isAce
            ? 'inset 0 0 0 1px rgba(255,250,230,0.7), 0 0 14px rgba(242,200,120,0.45)'
            : 'inset 0 0 0 1px rgba(255,250,230,0.5)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          zIndex: 5,
        }}
      />
    </button>
  );
}

export function TileBack({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const d = SIZE[size];
  return (
    <div
      className="fgg-tile fgg-tile--back"
      style={{
        width: d.w,
        height: d.h,
        borderRadius: d.radius,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(ellipse 120% 60% at 50% -10%, rgba(255,250,225,0.5) 0%, transparent 55%), linear-gradient(180deg, #FBF2DC 0%, #F4E6C2 55%, #E8D4A2 100%)',
          boxShadow:
            'inset 0 0 0 1px rgba(140, 110, 60, 0.25), inset 0 1px 2px rgba(255,250,235,0.7), inset 0 -2px 3px rgba(140, 110, 60, 0.2)',
          borderRadius: 'inherit',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute', inset: '16%',
          border: '1px solid rgba(140, 110, 60, 0.3)',
          borderRadius: 3,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(140,110,60,0.07) 0 1px, transparent 1px 6px)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: d.w * 0.32,
            fontWeight: 600,
            color: 'rgba(140, 110, 60, 0.55)',
            letterSpacing: '0.02em',
          }}
        >
          F
        </span>
      </div>
    </div>
  );
}
