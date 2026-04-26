'use client';

import type { Tile as TileType } from '@lexio/game-logic';

type Suit = 'sun' | 'moon' | 'star' | 'cloud';

const SUIT: Record<Suit, {
  symbol: string;
  color: string;
  glow: string;
  face: string;      // 타일 앞면 기본 색
  rightFace: string; // 우측 측면
  bottomFace: string;// 하단 측면
  accent: string;    // 테두리 강조
}> = {
  sun:   { symbol: '☀', color: '#ef4444', glow: '#fca5a5', face: '#1a0606', rightFace: '#0d0303', bottomFace: '#080202', accent: '#b91c1c' },
  moon:  { symbol: '☽', color: '#14b8a6', glow: '#5eead4', face: '#021210', rightFace: '#010908', bottomFace: '#010605', accent: '#0f766e' },
  star:  { symbol: '★', color: '#f59e0b', glow: '#fcd34d', face: '#160e01', rightFace: '#0c0800', bottomFace: '#080500', accent: '#b45309' },
  cloud: { symbol: '☁', color: '#8b5cf6', glow: '#c4b5fd', face: '#0c0718', rightFace: '#070411', bottomFace: '#05030b', accent: '#6d28d9' },
};

const SIZE = {
  sm: { w: 38, h: 54, depth: 5, emblem: 22, num: 14, sym: 12, corner: 7  },
  md: { w: 52, h: 74, depth: 7, emblem: 32, num: 19, sym: 16, corner: 9  },
  lg: { w: 62, h: 88, depth: 9, emblem: 40, num: 22, sym: 19, corner: 10 },
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
  const totalW = d.w + d.depth;
  const totalH = d.h + d.depth;

  return (
    <div
      style={{
        width: totalW,
        height: totalH,
        position: 'relative',
        flexShrink: 0,
        transform: isSelected ? `translate(-${d.depth / 2}px, -20px)` : 'translate(0, 0)',
        transition: 'transform 0.13s ease',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled && !isSelected ? 0.8 : 1,
      }}
    >
      {/* 우측 측면 */}
      <div style={{
        position: 'absolute',
        top: d.depth,
        right: 0,
        width: d.depth,
        height: d.h,
        background: `linear-gradient(to right, ${s.rightFace}, #020202)`,
        borderRadius: `0 3px 3px 0`,
        boxShadow: `inset -1px 0 0 rgba(255,255,255,0.04)`,
      }} />

      {/* 하단 측면 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: d.depth,
        width: d.w,
        height: d.depth,
        background: `linear-gradient(to bottom, ${s.bottomFace}, #010101)`,
        borderRadius: `0 0 3px 0`,
        boxShadow: `inset 0 -1px 0 rgba(255,255,255,0.02)`,
      }} />

      {/* 모서리 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: d.depth,
        height: d.depth,
        background: '#010101',
        borderRadius: '0 0 3px 0',
      }} />

      {/* 앞면 (버튼) */}
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={`${tile.suit} ${tile.number}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: d.w,
          height: d.h,
          borderRadius: '5px 5px 2px 5px',
          border: `1.5px solid ${isSelected ? s.glow : s.accent}`,
          background: isSelected
            ? `linear-gradient(160deg, ${s.face}ee 0%, #050508 100%)`
            : `linear-gradient(160deg, ${s.face} 0%, #03030a 100%)`,
          boxShadow: isSelected
            ? `0 0 0 1.5px ${s.glow}60, 0 0 16px ${s.color}80, inset 0 1px 0 rgba(255,255,255,0.12)`
            : `inset 0 1px 0 rgba(255,255,255,0.08), inset 1px 0 0 rgba(255,255,255,0.04)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          overflow: 'hidden',
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {/* 상단 광택 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 100%)',
          borderRadius: '4px 4px 0 0',
          pointerEvents: 'none',
        }} />

        {/* 선택 시 내부 글로우 */}
        {isSelected && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 40%, ${s.color}20 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
        )}

        {/* 좌상단 숫자 */}
        <span style={{
          position: 'absolute', top: 3, left: 4,
          fontSize: d.corner, fontWeight: 900, lineHeight: 1,
          color: s.glow,
          textShadow: `0 0 5px ${s.color}`,
          fontFamily: 'Georgia, serif',
        }}>
          {tile.number}
        </span>

        {/* 중앙 문양 엠블럼 */}
        <div style={{
          width: d.emblem,
          height: d.emblem,
          borderRadius: '50%',
          flexShrink: 0,
          position: 'relative',
          background: `radial-gradient(circle at 35% 30%, ${s.glow}50, ${s.color}cc 45%, ${s.face} 80%)`,
          border: `1.5px solid ${s.color}cc`,
          boxShadow: `0 0 10px ${s.color}70, 0 0 3px ${s.glow}50, inset 0 1px 0 rgba(255,255,255,0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 3,
            borderRadius: '50%',
            border: `1px solid ${s.glow}40`,
          }} />
          <span style={{
            fontSize: d.sym,
            color: '#fff',
            filter: `drop-shadow(0 0 3px ${s.glow})`,
            lineHeight: 1,
            position: 'relative',
            zIndex: 1,
          }}>
            {s.symbol}
          </span>
        </div>

        {/* 숫자 */}
        <span style={{
          fontSize: d.num,
          fontWeight: 900,
          color: s.glow,
          lineHeight: 1,
          textShadow: `0 0 8px ${s.color}, 0 0 2px ${s.glow}`,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.5px',
        }}>
          {tile.number}
        </span>

        {/* 우하단 숫자 (180도) */}
        <span style={{
          position: 'absolute', bottom: 3, right: 4,
          fontSize: d.corner, fontWeight: 900, lineHeight: 1,
          color: s.glow,
          textShadow: `0 0 5px ${s.color}`,
          fontFamily: 'Georgia, serif',
          transform: 'rotate(180deg)',
        }}>
          {tile.number}
        </span>
      </button>
    </div>
  );
}

export function TileBack({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const d = SIZE[size];
  const totalW = d.w + d.depth;
  const totalH = d.h + d.depth;

  return (
    <div style={{
      width: totalW,
      height: totalH,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* 우측 측면 */}
      <div style={{
        position: 'absolute',
        top: d.depth,
        right: 0,
        width: d.depth,
        height: d.h,
        background: 'linear-gradient(to right, #0c0f14, #020202)',
        borderRadius: '0 3px 3px 0',
      }} />

      {/* 하단 측면 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: d.depth,
        width: d.w,
        height: d.depth,
        background: 'linear-gradient(to bottom, #080b10, #010101)',
        borderRadius: '0 0 3px 0',
      }} />

      {/* 모서리 */}
      <div style={{
        position: 'absolute',
        bottom: 0, right: 0,
        width: d.depth, height: d.depth,
        background: '#010101',
        borderRadius: '0 0 3px 0',
      }} />

      {/* 앞면 */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: d.w, height: d.h,
        borderRadius: '5px 5px 2px 5px',
        border: '1.5px solid #1e293b',
        background: 'linear-gradient(160deg, #0f1623 0%, #060810 100%)',
        overflow: 'hidden',
      }}>
        {/* 광택 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)',
          borderRadius: '4px 4px 0 0',
        }} />
        {/* 내부 격자 */}
        <div style={{
          position: 'absolute', inset: 5,
          borderRadius: 3,
          border: '1px solid rgba(139,92,246,0.2)',
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent, transparent 4px,
            rgba(139,92,246,0.04) 4px, rgba(139,92,246,0.04) 8px
          )`,
        }} />
        {/* 중앙 L */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: d.w * 0.28,
            fontWeight: 900,
            color: 'rgba(139,92,246,0.4)',
            fontFamily: 'Georgia, serif',
            letterSpacing: 2,
            textShadow: '0 0 8px rgba(139,92,246,0.25)',
          }}>
            L
          </span>
        </div>
      </div>
    </div>
  );
}
