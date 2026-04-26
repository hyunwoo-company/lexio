'use client';

import type { Tile as TileType } from '@lexio/game-logic';

type Suit = 'sun' | 'moon' | 'star' | 'cloud';

const SUIT: Record<Suit, {
  symbol: string;
  color: string;       // 문양 메인 색
  shadow: string;      // 문양 그림자
  sideColor: string;   // 측면 색
  sideShade: string;   // 측면 어두운 부분
}> = {
  sun:   { symbol: '☀', color: '#c0110d', shadow: '#7a0a07', sideColor: '#1e3a14', sideShade: '#0f1f0a' },
  moon:  { symbol: '☽', color: '#0a7a6a', shadow: '#065045', sideColor: '#1e3a14', sideShade: '#0f1f0a' },
  star:  { symbol: '★', color: '#b07800', shadow: '#7a5200', sideColor: '#1e3a14', sideShade: '#0f1f0a' },
  cloud: { symbol: '☁', color: '#5020a0', shadow: '#32126e', sideColor: '#1e3a14', sideShade: '#0f1f0a' },
};

const SIZE = {
  sm: { w: 38, h: 54, depth: 6,  emblem: 18, num: 13, corner: 7,  frame: 3 },
  md: { w: 52, h: 74, depth: 8,  emblem: 26, num: 18, corner: 9,  frame: 4 },
  lg: { w: 64, h: 90, depth: 10, emblem: 34, num: 22, corner: 10, frame: 5 },
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

  // 선택 시 위로 떠오르는 느낌
  const liftY = isSelected ? -16 : 0;

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
        filter: isSelected ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))' : 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
      }}
    >
      {/* 우측 측면 (대나무색) */}
      <div style={{
        position: 'absolute',
        top: d.depth,
        right: 0,
        width: d.depth,
        height: d.h,
        background: `linear-gradient(to right, ${s.sideColor}, ${s.sideShade})`,
        borderRadius: '0 3px 3px 0',
      }} />

      {/* 하단 측면 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: d.depth,
        width: d.w,
        height: d.depth,
        background: `linear-gradient(to bottom, ${s.sideShade}, #060d06)`,
        borderRadius: '0 0 3px 0',
      }} />

      {/* 모서리 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: d.depth,
        height: d.depth,
        background: '#060d06',
        borderRadius: '0 0 3px 0',
      }} />

      {/* 앞면 */}
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
          borderRadius: '4px 4px 2px 4px',
          border: isSelected
            ? `2px solid ${s.color}aa`
            : '1.5px solid #b8a88a',
          background: isSelected
            ? 'linear-gradient(160deg, #fdf7ec 0%, #f0e8d0 100%)'
            : 'linear-gradient(160deg, #fef9f0 0%, #f0e8d4 100%)',
          boxShadow: isSelected
            ? `inset 0 0 12px ${s.color}22, inset 0 1px 0 rgba(255,255,255,0.9)`
            : `inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.06)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          overflow: 'hidden',
          cursor: disabled ? 'default' : 'pointer',
          padding: 0,
        }}
      >
        {/* 아이보리 상단 광택 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, transparent 100%)',
          borderRadius: '3px 3px 0 0',
          pointerEvents: 'none',
        }} />

        {/* 내부 장식 테두리 (마작 특유의 이중 테두리) */}
        <div style={{
          position: 'absolute',
          inset: d.frame,
          borderRadius: 2,
          border: `1px solid ${isSelected ? s.color + '55' : 'rgba(140,110,70,0.25)'}`,
          pointerEvents: 'none',
        }} />

        {/* 좌상단 숫자 */}
        <span style={{
          position: 'absolute', top: d.frame + 1, left: d.frame + 2,
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
          fontSize: d.emblem,
          lineHeight: 1,
          color: s.color,
          textShadow: `1px 2px 0 ${s.shadow}`,
          fontFamily: 'Arial, sans-serif',
          userSelect: 'none',
          marginBottom: 2,
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
          position: 'absolute', bottom: d.frame + 1, right: d.frame + 2,
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
  const totalW = d.w + d.depth;
  const totalH = d.h + d.depth;

  return (
    <div style={{
      width: totalW,
      height: totalH,
      position: 'relative',
      flexShrink: 0,
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
    }}>
      {/* 우측 측면 */}
      <div style={{
        position: 'absolute',
        top: d.depth, right: 0,
        width: d.depth, height: d.h,
        background: 'linear-gradient(to right, #1e3a14, #0f1f0a)',
        borderRadius: '0 3px 3px 0',
      }} />

      {/* 하단 측면 */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: d.depth,
        width: d.w, height: d.depth,
        background: 'linear-gradient(to bottom, #0f1f0a, #060d06)',
        borderRadius: '0 0 3px 0',
      }} />

      {/* 모서리 */}
      <div style={{
        position: 'absolute',
        bottom: 0, right: 0,
        width: d.depth, height: d.depth,
        background: '#060d06',
        borderRadius: '0 0 3px 0',
      }} />

      {/* 뒷면 - 녹색 바탕 */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: d.w, height: d.h,
        borderRadius: '4px 4px 2px 4px',
        border: '1.5px solid #2d5a1e',
        background: 'linear-gradient(160deg, #1a3a12 0%, #0f2009 100%)',
        overflow: 'hidden',
      }}>
        {/* 상단 광택 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
          borderRadius: '3px 3px 0 0',
        }} />
        {/* 내부 테두리 */}
        <div style={{
          position: 'absolute',
          inset: d.frame,
          borderRadius: 2,
          border: '1px solid rgba(100,200,80,0.2)',
        }} />
        {/* 중앙 L 마크 */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: d.w * 0.3,
            fontWeight: 900,
            color: 'rgba(120,220,90,0.35)',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
          }}>
            L
          </span>
        </div>
      </div>
    </div>
  );
}
