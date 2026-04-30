'use client';

import type { Tile as TileType } from '@lexio/game-logic';

type Suit = 'sun' | 'moon' | 'star' | 'cloud';

// FGG 사신수 매핑 (조선고적도보, public domain — Wikimedia Commons)
//   sun   = 주작 (Vermilion Bird)
//   moon  = 청룡 (Azure Dragon)
//   star  = 백호 (White Tiger)
//   cloud = 현무 (Black Tortoise)
const SUIT: Record<Suit, { name: string; color: string; deep: string; img: string }> = {
  sun:   { name: '주작', color: '#C8323D', deep: '#8C1F28', img: '/sasinsoo/jujak.jpg' },
  moon:  { name: '청룡', color: '#2A8C56', deep: '#175C36', img: '/sasinsoo/cheongryong.jpg' },
  star:  { name: '백호', color: '#D88438', deep: '#8C5320', img: '/sasinsoo/baekho.jpg' },
  cloud: { name: '현무', color: '#3A5A8C', deep: '#1F2E4A', img: '/sasinsoo/hyunmu.jpg' },
};

const SIZE = {
  sm: { w: 38, h: 54, crest: 32, num: 14, corner: 9,  radius: 5 },
  md: { w: 52, h: 76, crest: 48, num: 22, corner: 12, radius: 7 },
  lg: { w: 66, h: 96, crest: 62, num: 30, corner: 16, radius: 9 },
};

/* ───── 사신수 이미지 crest ─────
   조선고적도보(1932) 사신도 사진. 사진 배경(누런 종이)을 타일 아이보리와
   자연스럽게 섞기 위해 mix-blend-mode: multiply 사용. */
function ImageCrest({ suit, size, isAce }: { suit: Suit; size: number; isAce?: boolean }) {
  const s = SUIT[suit];
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: isAce
          ? `1.6px solid ${s.color}`
          : `1px solid ${s.color}55`,
        boxShadow: isAce
          ? `0 0 0 2px rgba(212,166,86,0.55), 0 0 12px ${s.color}66, inset 0 0 8px rgba(255,255,255,0.18)`
          : `inset 0 0 6px rgba(255,255,255,0.12)`,
        background: `radial-gradient(circle, rgba(255,250,235,0.45) 0%, rgba(245,230,200,0.05) 70%)`,
      }}
    >
      {/* 동양화 이미지 (mix-blend-mode: multiply로 종이 배경을 타일 아이보리와 합성) */}
      <img
        src={s.img}
        alt={s.name}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          mixBlendMode: 'multiply',
          filter: isAce ? 'saturate(1.15) contrast(1.05)' : 'saturate(0.95)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ───── 1번(ace) 화려 외곽 ─────
   이미지 위에 gold filigree ring + 코너 별 + 외곽 glow. */
function AceOrnate({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {/* 외곽 톱니 — 금테두리 */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 24 - Math.PI / 2;
        const x1 = 50 + Math.cos(a) * 47;
        const y1 = 50 + Math.sin(a) * 47;
        const x2 = 50 + Math.cos(a) * 49;
        const y2 = 50 + Math.sin(a) * 49;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#F2C878"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        );
      })}
      {/* 4방위 별 */}
      {[0, 90, 180, 270].map((deg) => {
        const a = (deg * Math.PI) / 180 - Math.PI / 2;
        const cx = 50 + Math.cos(a) * 50;
        const cy = 50 + Math.sin(a) * 50;
        return (
          <polygon
            key={deg}
            points={Array.from({ length: 8 }).map((_, j) => {
              const aa = (j * Math.PI) / 4;
              const r = j % 2 === 0 ? 3.2 : 1.4;
              return `${cx + Math.cos(aa) * r},${cy + Math.sin(aa) * r}`;
            }).join(' ')}
            fill="#F2C878"
            stroke={color}
            strokeWidth={0.4}
          />
        );
      })}
    </svg>
  );
}

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

      {/* 가운데 사신수 이미지 + 숫자 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <div style={{ position: 'relative', width: d.crest, height: d.crest }}>
          <ImageCrest suit={tile.suit as Suit} size={d.crest} isAce={isAce} />
          {isAce && <AceOrnate size={d.crest} color={s.color} />}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Cormorant Garamond, "Noto Serif KR", Georgia, serif',
              fontWeight: isAce ? 900 : 800,
              fontSize: isAce ? d.num + 2 : d.num,
              lineHeight: 1,
              color: isAce ? '#1A1408' : s.color,
              textShadow: isAce
                ? '0 0 8px rgba(255,255,235,0.95), 0 0 14px rgba(242,200,120,0.8), 0 1px 0 rgba(255,250,230,0.9)'
                : '0 1px 0 rgba(255, 250, 230, 0.7)',
              letterSpacing: '-0.03em',
              pointerEvents: 'none',
            }}
          >
            {tile.number}
          </span>
        </div>
      </div>

      {/* 우하단 코너 미니 crest (이미지 작게) */}
      <span
        style={{
          position: 'absolute',
          right: Math.max(2, d.w * 0.08),
          bottom: Math.max(2, d.h * 0.05),
          zIndex: 2,
          opacity: 0.8,
        }}
      >
        <ImageCrest suit={tile.suit as Suit} size={d.corner} />
      </span>

      {/* 외곽 림 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          border: isAce ? '1.5px solid rgba(212,166,86,0.55)' : '1px solid rgba(140, 110, 60, 0.35)',
          boxShadow: 'inset 0 0 0 1px rgba(255,250,230,0.5)',
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
