'use client';

import type { Tile as TileType } from '@lexio/game-logic';

type Suit = 'sun' | 'moon' | 'star' | 'cloud';

// FGG 사신수 매핑:
//   sun   = 주작 (Vermilion Bird) — 화염 봉황
//   moon  = 청룡 (Azure Dragon)   — 비늘과 뿔
//   star  = 백호 (White Tiger)    — 줄무늬와 王
//   cloud = 현무 (Black Tortoise) — 육각 갑옷과 뱀
const SUIT: Record<Suit, { name: string; color: string; deep: string }> = {
  sun:   { name: '주작', color: '#C8323D', deep: '#8C1F28' },
  moon:  { name: '청룡', color: '#2A8C56', deep: '#175C36' },
  star:  { name: '백호', color: '#D88438', deep: '#8C5320' },
  cloud: { name: '현무', color: '#3A5A8C', deep: '#1F2E4A' },
};

const SIZE = {
  sm: { w: 36, h: 52, crest: 32, num: 14, corner: 9,  radius: 5 },
  md: { w: 50, h: 72, crest: 48, num: 22, corner: 12, radius: 7 },
  lg: { w: 64, h: 92, crest: 60, num: 30, corner: 16, radius: 9 },
};

/* ──────── 사신수 Crest (viewBox 100x100 기준 SVG) ──────── */

function CrestJujak({ color }: { color: string }) {
  // 주작 — 화염 봉황: 16-spike 화염 ring + 봉황 머리/꼬리
  const cx = 50, cy = 50;
  const points: string[] = [];
  const N = 16;
  for (let i = 0; i < N * 2; i++) {
    const a = (i * Math.PI) / N - Math.PI / 2;
    const r = i % 2 === 0 ? 47 : 36;
    points.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return (
    <g>
      <polygon points={points.join(' ')} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
      {/* 12시: 봉황 볏 */}
      <path d="M 50 6 L 47 14 L 50 12 L 53 14 Z" fill={color} />
      <path d="M 44 9 L 42 16 L 45 14 Z" fill={color} opacity={0.85} />
      <path d="M 56 9 L 58 16 L 55 14 Z" fill={color} opacity={0.85} />
      {/* 6시: 꼬리깃 3가닥 */}
      <path d="M 50 94 L 48 84 L 50 88 L 52 84 Z" fill={color} />
      <path d="M 42 92 L 44 82 L 46 86 Z" fill={color} opacity={0.7} />
      <path d="M 58 92 L 56 82 L 54 86 Z" fill={color} opacity={0.7} />
      <circle cx={cx} cy={cy} r={26} fill="none" stroke={color} strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={29} fill="none" stroke={color} strokeWidth={0.8} opacity={0.5} />
    </g>
  );
}

function CrestCheongryong({ color }: { color: string }) {
  // 청룡 — 비늘 12 lobes + 두 뿔
  const cx = 50, cy = 50;
  const lobes = 12;
  const path: string[] = [];
  for (let i = 0; i <= lobes; i++) {
    const a = (i * Math.PI * 2) / lobes - Math.PI / 2;
    const aMid = a + Math.PI / lobes;
    const x1 = cx + Math.cos(a) * 38;
    const y1 = cy + Math.sin(a) * 38;
    const xc = cx + Math.cos(aMid) * 47;
    const yc = cy + Math.sin(aMid) * 47;
    if (i === 0) path.push(`M ${x1} ${y1}`);
    else path.push(`Q ${xc} ${yc} ${x1} ${y1}`);
  }
  return (
    <g>
      <path d={path.join(' ') + ' Z'} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
      {/* 12시: 두 뿔 */}
      <path d="M 44 4 L 47 14 L 49 10 Z" fill={color} />
      <path d="M 56 4 L 53 14 L 51 10 Z" fill={color} />
      {/* 좌우 작은 빛점 */}
      <circle cx={20} cy={50} r={1.6} fill={color} opacity={0.6} />
      <circle cx={80} cy={50} r={1.6} fill={color} opacity={0.6} />
      <circle cx={cx} cy={cy} r={26} fill="none" stroke={color} strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={30} fill="none" stroke={color} strokeWidth={0.7} opacity={0.45} />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180 - Math.PI / 2;
        const x = cx + Math.cos(a) * 33;
        const y = cy + Math.sin(a) * 33;
        return <circle key={deg} cx={x} cy={y} r={1.2} fill={color} opacity={0.5} />;
      })}
    </g>
  );
}

function CrestBaekho({ color }: { color: string }) {
  // 백호 — 줄무늬 ring + 王 무늬
  const cx = 50, cy = 50;
  const stripes: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i * Math.PI * 2) / 14 - Math.PI / 2;
    const x1 = cx + Math.cos(a) * 39;
    const y1 = cy + Math.sin(a) * 39;
    const x2 = cx + Math.cos(a) * 47;
    const y2 = cy + Math.sin(a) * 47;
    stripes.push({ x1, y1, x2, y2 });
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={47} fill="none" stroke={color} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={39} fill="none" stroke={color} strokeWidth={1.4} />
      {stripes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      ))}
      {/* 12시: 王자 모티프 */}
      <line x1={50} y1={5} x2={50} y2={20} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1={45} y1={9} x2={55} y2={9} stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <line x1={43} y1={14} x2={57} y2={14} stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <line x1={45} y1={18} x2={55} y2={18} stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={26} fill="none" stroke={color} strokeWidth={1.6} />
    </g>
  );
}

function CrestHyunmu({ color }: { color: string }) {
  // 현무 — 육각 갑옷 + 뱀
  const cx = 50, cy = 50;
  const hexagons: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6 - Math.PI / 2;
    const hx = cx + Math.cos(a) * 38;
    const hy = cy + Math.sin(a) * 38;
    const pts: string[] = [];
    for (let j = 0; j < 6; j++) {
      const ha = (j * Math.PI * 2) / 6 - Math.PI / 2;
      pts.push(`${hx + Math.cos(ha) * 8},${hy + Math.sin(ha) * 8}`);
    }
    hexagons.push(pts.join(' '));
  }
  const outerHex: string[] = [];
  for (let j = 0; j < 6; j++) {
    const a = (j * Math.PI * 2) / 6 - Math.PI / 2;
    outerHex.push(`${cx + Math.cos(a) * 47},${cy + Math.sin(a) * 47}`);
  }
  const innerHex: string[] = [];
  for (let j = 0; j < 6; j++) {
    const a = (j * Math.PI * 2) / 6 - Math.PI / 2;
    innerHex.push(`${cx + Math.cos(a) * 26},${cy + Math.sin(a) * 26}`);
  }
  return (
    <g>
      <polygon points={outerHex.join(' ')} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {hexagons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke={color} strokeWidth={1.2} strokeLinejoin="round" opacity={0.85} />
      ))}
      {/* 12시 뱀 — S커브 + 혀 */}
      <path d="M 50 6 Q 46 11 50 14 Q 54 17 50 22" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M 50 4 L 48.5 1 M 50 4 L 51.5 1" stroke={color} strokeWidth={1} strokeLinecap="round" />
      <polygon points={innerHex.join(' ')} fill="none" stroke={color} strokeWidth={1.4} />
    </g>
  );
}

function Crest({ suit, size }: { suit: Suit; size: number }) {
  const { color } = SUIT[suit];
  const inner =
    suit === 'sun'   ? <CrestJujak color={color} /> :
    suit === 'moon'  ? <CrestCheongryong color={color} /> :
    suit === 'star'  ? <CrestBaekho color={color} /> :
                       <CrestHyunmu color={color} />;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <circle cx={50} cy={50} r={28} fill={color} opacity={0.05} />
      {inner}
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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${s.name} ${tile.number}`}
      className={`fgg-tile${isSelected ? ' is-selected' : ''}${isClickable ? ' is-clickable' : ''}`}
      style={{
        width: d.w,
        height: d.h,
        borderRadius: d.radius,
        transform: `translateY(${liftY}px)`,
        cursor: disabled ? 'default' : 'pointer',
        background:
          'linear-gradient(180deg, #FFFDF4 0%, #FAF1D6 6%, #F4E6C0 18%, #F4E6C0 82%, #E2CC95 96%, #C8AC72 100%), #F4E6C0',
      }}
    >
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

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <div style={{ position: 'relative', width: d.crest, height: d.crest }}>
          <Crest suit={tile.suit as Suit} size={d.crest} />
          <span style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, "Noto Serif KR", Georgia, serif',
            fontWeight: 800,
            fontSize: d.num,
            lineHeight: 1,
            color: s.color,
            textShadow: '0 1px 0 rgba(255, 250, 230, 0.7)',
            letterSpacing: '-0.03em',
          }}>
            {tile.number}
          </span>
        </div>
      </div>

      <span style={{
        position: 'absolute',
        right: Math.max(2, d.w * 0.08),
        bottom: Math.max(2, d.h * 0.05),
        zIndex: 2,
        opacity: 0.85,
      }}>
        <Crest suit={tile.suit as Suit} size={d.corner} />
      </span>

      <span style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(140, 110, 60, 0.35)',
        boxShadow: 'inset 0 0 0 1px rgba(255,250,230,0.5)',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 5,
      }} />
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
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(ellipse 120% 60% at 50% -10%, rgba(255,250,225,0.5) 0%, transparent 55%), linear-gradient(180deg, #FBF2DC 0%, #F4E6C2 55%, #E8D4A2 100%)',
        boxShadow:
          'inset 0 0 0 1px rgba(140, 110, 60, 0.25), inset 0 1px 2px rgba(255,250,235,0.7), inset 0 -2px 3px rgba(140, 110, 60, 0.2)',
        borderRadius: 'inherit',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', inset: '16%',
        border: '1px solid rgba(140, 110, 60, 0.3)',
        borderRadius: 3,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(140,110,60,0.07) 0 1px, transparent 1px 6px)',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3,
      }}>
        <span style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: d.w * 0.32,
          fontWeight: 600,
          color: 'rgba(140, 110, 60, 0.55)',
          letterSpacing: '0.02em',
        }}>F</span>
      </div>
    </div>
  );
}
