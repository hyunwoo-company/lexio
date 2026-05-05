'use client';

import { Tile } from '@/components/tile/Tile';
import type { Tile as TileType, Suit, TileNumber } from '@lexio/game-logic';

interface GuidePanelProps {
  open: boolean;
  onClose: () => void;
}

type ExampleTile = { number: TileNumber; suit: Suit };

interface ComboRow {
  name: string;
  desc: string;
  low: ExampleTile[];
  high: ExampleTile[];
}

const COMBOS: ComboRow[] = [
  {
    name: '싱글',
    desc: '1장 — 숫자가 같으면 사신수 우열',
    low: [{ number: 2, suit: 'cloud' }],
    high: [{ number: 1, suit: 'sun' }],
  },
  {
    name: '페어',
    desc: '같은 숫자 2장',
    low: [
      { number: 2, suit: 'cloud' },
      { number: 2, suit: 'star' },
    ],
    high: [
      { number: 1, suit: 'sun' },
      { number: 1, suit: 'moon' },
    ],
  },
  {
    name: '트리플',
    desc: '같은 숫자 3장',
    low: [
      { number: 2, suit: 'cloud' },
      { number: 2, suit: 'star' },
      { number: 2, suit: 'moon' },
    ],
    high: [
      { number: 1, suit: 'sun' },
      { number: 1, suit: 'moon' },
      { number: 1, suit: 'star' },
    ],
  },
  {
    name: '스트레이트',
    desc: '연속 5장 · 1과 2는 한 스트레이트에 동시 불가',
    low: [
      { number: 3, suit: 'cloud' },
      { number: 4, suit: 'sun' },
      { number: 5, suit: 'moon' },
      { number: 6, suit: 'star' },
      { number: 7, suit: 'cloud' },
    ],
    high: [
      { number: 12, suit: 'sun' },
      { number: 13, suit: 'moon' },
      { number: 14, suit: 'star' },
      { number: 15, suit: 'cloud' },
      { number: 1, suit: 'sun' },
    ],
  },
  {
    name: '플러시',
    desc: '같은 사신수 5장',
    low: [
      { number: 2, suit: 'cloud' },
      { number: 4, suit: 'cloud' },
      { number: 6, suit: 'cloud' },
      { number: 8, suit: 'cloud' },
      { number: 11, suit: 'cloud' },
    ],
    high: [
      { number: 5, suit: 'sun' },
      { number: 8, suit: 'sun' },
      { number: 11, suit: 'sun' },
      { number: 13, suit: 'sun' },
      { number: 1, suit: 'sun' },
    ],
  },
  {
    name: '풀하우스',
    desc: '트리플 + 페어 · 트리플 숫자로 비교',
    low: [
      { number: 3, suit: 'cloud' },
      { number: 3, suit: 'star' },
      { number: 3, suit: 'moon' },
      { number: 2, suit: 'cloud' },
      { number: 2, suit: 'star' },
    ],
    high: [
      { number: 1, suit: 'sun' },
      { number: 1, suit: 'moon' },
      { number: 1, suit: 'star' },
      { number: 2, suit: 'sun' },
      { number: 2, suit: 'moon' },
    ],
  },
  {
    name: '포카드',
    desc: '같은 숫자 4장 + 1장',
    low: [
      { number: 3, suit: 'cloud' },
      { number: 3, suit: 'star' },
      { number: 3, suit: 'moon' },
      { number: 3, suit: 'sun' },
      { number: 2, suit: 'cloud' },
    ],
    high: [
      { number: 1, suit: 'cloud' },
      { number: 1, suit: 'star' },
      { number: 1, suit: 'moon' },
      { number: 1, suit: 'sun' },
      { number: 2, suit: 'cloud' },
    ],
  },
  {
    name: '스트레이트 플러시',
    desc: '연속 5장 + 같은 사신수',
    low: [
      { number: 3, suit: 'cloud' },
      { number: 4, suit: 'cloud' },
      { number: 5, suit: 'cloud' },
      { number: 6, suit: 'cloud' },
      { number: 7, suit: 'cloud' },
    ],
    high: [
      { number: 12, suit: 'sun' },
      { number: 13, suit: 'sun' },
      { number: 14, suit: 'sun' },
      { number: 15, suit: 'sun' },
      { number: 1, suit: 'sun' },
    ],
  },
];

function asTile(e: ExampleTile, idx: number): TileType {
  return { id: `guide-${e.suit}-${e.number}-${idx}`, number: e.number, suit: e.suit };
}

function TileRow({ tiles }: { tiles: ExampleTile[] }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {tiles.map((t, i) => (
        <div key={i} style={{ transform: 'scale(0.72)', transformOrigin: 'left top', marginRight: -11, marginBottom: -16 }}>
          <Tile tile={asTile(t, i)} size="sm" />
        </div>
      ))}
    </div>
  );
}

function RankLabel({ kind }: { kind: 'low' | 'high' }) {
  const isLow = kind === 'low';
  return (
    <span
      style={{
        fontFamily: 'var(--fgg-font-display)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        color: isLow ? 'var(--fgg-text-muted)' : 'var(--fgg-gold-bright)',
        background: isLow ? 'transparent' : 'rgba(212,166,86,0.12)',
        border: `1px solid ${isLow ? 'var(--fgg-line)' : 'var(--fgg-line-strong)'}`,
        padding: '2px 7px',
        borderRadius: 4,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        minWidth: 36,
        textAlign: 'center',
      }}
    >
      {isLow ? 'Low' : 'High'}
    </span>
  );
}

export function GuidePanel({ open, onClose }: GuidePanelProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.78)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fgg-panel"
        style={{
          maxWidth: 460,
          width: '100%',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: 18,
          fontSize: 12,
          color: 'var(--fgg-text)',
        }}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--fgg-font-display)',
              fontSize: 22,
              color: 'var(--fgg-gold-bright)',
              letterSpacing: '0.04em',
            }}
          >
            족보 가이드
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--fgg-text-dim)',
              fontSize: 24,
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1,
            }}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 숫자/사신수 서열 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            marginBottom: 12,
          }}
        >
          <div style={{ padding: '6px 10px', background: 'rgba(212,166,86,0.08)', borderRadius: 6, border: '1px solid var(--fgg-line)' }}>
            <div className="fgg-eyebrow" style={{ fontSize: 9, marginBottom: 2 }}>숫자</div>
            <div style={{ fontFamily: 'var(--fgg-font-num)', fontSize: 11 }}>
              <strong style={{ color: 'var(--fgg-gold-bright)' }}>1</strong> &gt; 15 &gt; 14 &gt; … &gt; 3 &gt; <strong>2</strong>
            </div>
          </div>
          <div style={{ padding: '6px 10px', background: 'rgba(212,166,86,0.08)', borderRadius: 6, border: '1px solid var(--fgg-line)' }}>
            <div className="fgg-eyebrow" style={{ fontSize: 9, marginBottom: 2 }}>사신수</div>
            <div style={{ fontSize: 10, lineHeight: 1.5 }}>
              <span style={{ color: '#C8323D' }}>주작</span> &gt; <span style={{ color: '#2A8C56' }}>현무</span> &gt; <span style={{ color: '#D88438' }}>백호</span> &gt; <span style={{ color: '#3A5A8C' }}>청룡</span>
            </div>
          </div>
        </div>

        {/* 비교 규칙 안내 */}
        <div
          style={{
            padding: '8px 10px',
            marginBottom: 10,
            border: '1px dashed var(--fgg-line-strong)',
            borderRadius: 8,
            background: 'rgba(212,166,86,0.05)',
            fontSize: 10,
            lineHeight: 1.5,
            color: 'var(--fgg-text-dim)',
          }}
        >
          <strong style={{ color: 'var(--fgg-gold-bright)' }}>비교 규칙</strong> · 같은 종류끼리 만났을 땐
          <strong style={{ color: 'var(--fgg-text)' }}> max 카드 숫자</strong>가 우선이고, 숫자가 같을 때만
          <strong style={{ color: 'var(--fgg-text)' }}> 사신수 우열</strong>로 tie-break.
          <br />
          5장 콤보의 종류 자체는 <span style={{ color: 'var(--fgg-gold)' }}>스트레이트 &lt; 플러시 &lt; 풀하우스 &lt; 포카드 &lt; 스트레이트플러시</span>.
        </div>

        {/* 콤보 row 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COMBOS.map((c) => (
            <div
              key={c.name}
              style={{
                padding: '10px 12px',
                border: '1px solid var(--fgg-line)',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.015)',
              }}
            >
              {/* 이름 + 설명 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--fgg-font-display)',
                    fontSize: 16,
                    color: 'var(--fgg-gold-bright)',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                    lineHeight: 1.1,
                  }}
                >
                  {c.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--fgg-text-dim)' }}>{c.desc}</div>
              </div>

              {/* Low / High 예시 (image10 스타일) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RankLabel kind="low" />
                  <TileRow tiles={c.low} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RankLabel kind="high" />
                  <TileRow tiles={c.high} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 선/패널티 룰 */}
        <div style={{ marginTop: 14 }}>
          <div className="fgg-eyebrow" style={{ fontSize: 9, marginBottom: 6 }}>선 / 점수 룰</div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.5 }}>
            <li>
              <strong style={{ color: 'var(--fgg-gold-bright)' }}>1라운드 첫 선</strong>: 청룡 2 보유자.
            </li>
            <li>
              <strong style={{ color: 'var(--fgg-gold-bright)' }}>다음 라운드 선</strong>: 직전 라운드 1등. 어떤 패든 자유롭게 시작 가능.
            </li>
            <li>
              <strong>4장 콤보</strong>는 절대 불가. 1/2/3/5장만.
            </li>
            <li>
              <strong>패널티</strong>: 라운드 종료 시 손에 1을 가지고 있으면 남은 패 ×2^n.
            </li>
            <li>나머지 모두 패스 → 마지막 낸 사람이 새 선.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="fgg-btn fgg-btn--primary"
          style={{ width: '100%', marginTop: 14, padding: '10px 16px', fontSize: 13 }}
        >
          확인
        </button>
      </div>
    </div>
  );
}
