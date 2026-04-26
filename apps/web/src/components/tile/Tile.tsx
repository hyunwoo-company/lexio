'use client';

import type { Tile as TileType } from '@lexio/game-logic';

type Suit = 'sun' | 'moon' | 'star' | 'cloud';

const SUIT: Record<Suit, { symbol: string; color: string; shadow: string }> = {
  sun:   { symbol: '☀', color: '#c01010', shadow: '#800a0a' },
  moon:  { symbol: '☽', color: '#0a7060', shadow: '#064840' },
  star:  { symbol: '★', color: '#b07000', shadow: '#784a00' },
  cloud: { symbol: '☁', color: '#5020a0', shadow: '#32126e' },
};

// w, h: 앞면 크기 / depth: 측면 두께 / dx,dy: 사선 투영 오프셋
const SIZE = {
  sm: { w: 38, h: 56, depth: 10, dx: 8,  dy: 6,  sym: 18, num: 13, corner: 7  },
  md: { w: 50, h: 72, depth: 13, dx: 11, dy: 7,  sym: 24, num: 17, corner: 9  },
  lg: { w: 62, h: 90, depth: 16, dx: 13, dy: 9,  sym: 30, num: 21, corner: 11 },
};

// 앞면 색
const FACE   = '#f0e6c8';
const FACE_SEL = '#faf4e2';
// 윗면 (빛 받는 면 — 더 밝게)
const TOP    = '#faf4e2';
const TOP_EDGE = '#c8b890'; // 윗면-앞면 경계선
// 오른쪽 측면 (그림자 — 더 어둡게)
const RIGHT  = '#c4b07a';
const RIGHT_DARK = '#a09060';

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
  const totalW = d.w + d.dx;
  const totalH = d.h + d.dy;
  const liftY  = isSelected ? -18 : 0;

  // clip-path 좌표는 모두 px 정수값 (선명도 유지)
  // 윗면 parallelogram: (0,dy) → (w,dy) → (w+dx,0) → (dx,0)
  const topPath = `polygon(0 ${d.dy}px, ${d.w}px ${d.dy}px, ${totalW}px 0px, ${d.dx}px 0px)`;

  // 오른쪽 측면 parallelogram (div는 left=w에서 시작):
  // 컨테이너 기준 (w,dy)→(w+dx,0)→(w+dx,h)→(w,h+dy)
  // div 내부 상대 좌표: (0,dy)→(dx,0)→(dx,h)→(0,h+dy)
  const rightPath = `polygon(0px ${d.dy}px, ${d.dx}px 0px, ${d.dx}px ${d.h}px, 0px ${totalH}px)`;

  return (
    <div
      style={{
        width: totalW,
        height: totalH,
        position: 'relative',
        flexShrink: 0,
        transform: `translateY(${liftY}px)`,
        transition: 'transform 0.12s ease',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {/* ── 윗면 (Top face) ─────────────────── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: totalW,
        height: d.dy,
        background: `linear-gradient(to bottom, ${TOP} 0%, ${TOP_EDGE} 100%)`,
        clipPath: topPath,
        zIndex: 1,
      }} />

      {/* ── 오른쪽 측면 (Right face) ─────────── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: d.w,
        width: d.dx,
        height: totalH,
        background: `linear-gradient(to right, ${RIGHT} 0%, ${RIGHT_DARK} 100%)`,
        clipPath: rightPath,
        zIndex: 1,
      }} />

      {/* ── 앞면 (Front face) — 버튼 ─────────── */}
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={`${tile.suit} ${tile.number}`}
        style={{
          position: 'absolute',
          top: d.dy,
          left: 0,
          width: d.w,
          height: d.h,
          padding: 0,
          background: isSelected
            ? `linear-gradient(160deg, ${FACE_SEL} 0%, #e8dab8 100%)`
            : `linear-gradient(160deg, ${FACE} 0%, #e4d8b4 100%)`,
          border: isSelected
            ? `2px solid ${s.color}cc`
            : '1.5px solid #9a8060',
          borderRadius: '2px 2px 2px 2px',
          boxShadow: isSelected
            ? `0 6px 20px rgba(0,0,0,0.35), inset 0 0 10px ${s.color}18`
            : `0 2px 8px rgba(0,0,0,0.25)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          overflow: 'hidden',
          cursor: disabled ? 'default' : 'pointer',
          zIndex: 2,
        }}
      >
        {/* 상단 광택 (마작패 표면 광택) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)',
          borderRadius: '2px 2px 0 0',
          pointerEvents: 'none',
        }} />

        {/* 내부 테두리 프레임 (마작패 특유 이중 테두리) */}
        <div style={{
          position: 'absolute',
          inset: d.corner - 2,
          border: `1px solid ${isSelected ? s.color + '60' : 'rgba(140,110,60,0.35)'}`,
          borderRadius: 1,
          pointerEvents: 'none',
        }} />

        {/* 좌상단 숫자 */}
        <span style={{
          position: 'absolute',
          top: 4, left: 5,
          fontSize: d.corner,
          fontWeight: 900,
          lineHeight: 1,
          color: s.color,
          fontFamily: 'Georgia, "Times New Roman", serif',
          userSelect: 'none',
        }}>
          {tile.number}
        </span>

        {/* 중앙 문양 */}
        <span style={{
          fontSize: d.sym,
          lineHeight: 1,
          color: s.color,
          textShadow: `1px 2px 0 ${s.shadow}, 0 0 1px ${s.shadow}40`,
          fontFamily: 'Arial, sans-serif',
          userSelect: 'none',
          marginBottom: 1,
        }}>
          {s.symbol}
        </span>

        {/* 중앙 숫자 */}
        <span style={{
          fontSize: d.num,
          fontWeight: 900,
          lineHeight: 1,
          color: s.color,
          textShadow: `1px 1px 0 ${s.shadow}`,
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: '-0.5px',
          userSelect: 'none',
        }}>
          {tile.number}
        </span>

        {/* 우하단 숫자 (180도 회전) */}
        <span style={{
          position: 'absolute',
          bottom: 4, right: 5,
          fontSize: d.corner,
          fontWeight: 900,
          lineHeight: 1,
          color: s.color,
          fontFamily: 'Georgia, "Times New Roman", serif',
          transform: 'rotate(180deg)',
          userSelect: 'none',
        }}>
          {tile.number}
        </span>
      </button>
    </div>
  );
}

export function TileBack({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const d = SIZE[size];
  const totalW = d.w + d.dx;
  const totalH = d.h + d.dy;

  const topPath   = `polygon(0 ${d.dy}px, ${d.w}px ${d.dy}px, ${totalW}px 0px, ${d.dx}px 0px)`;
  const rightPath = `polygon(0px ${d.dy}px, ${d.dx}px 0px, ${d.dx}px ${d.h}px, 0px ${totalH}px)`;

  return (
    <div style={{ width: totalW, height: totalH, position: 'relative', flexShrink: 0 }}>
      {/* 윗면 */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: totalW, height: d.dy,
        background: 'linear-gradient(to bottom, #2a4820, #1a3014)',
        clipPath: topPath,
        zIndex: 1,
      }} />

      {/* 오른쪽 측면 */}
      <div style={{
        position: 'absolute', top: 0, left: d.w,
        width: d.dx, height: totalH,
        background: 'linear-gradient(to right, #1a3014, #0f2009)',
        clipPath: rightPath,
        zIndex: 1,
      }} />

      {/* 뒷면 */}
      <div style={{
        position: 'absolute',
        top: d.dy, left: 0,
        width: d.w, height: d.h,
        background: 'linear-gradient(160deg, #1e3a14 0%, #0f2009 100%)',
        border: '1.5px solid #2d5a1e',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        zIndex: 2,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
          borderRadius: '2px 2px 0 0',
        }} />
        <div style={{
          position: 'absolute', inset: d.corner - 2,
          border: '1px solid rgba(100,200,80,0.2)',
          borderRadius: 1,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: d.w * 0.3,
            fontWeight: 900,
            color: 'rgba(120,230,90,0.3)',
            fontFamily: 'Georgia, serif',
          }}>L</span>
        </div>
      </div>
    </div>
  );
}
