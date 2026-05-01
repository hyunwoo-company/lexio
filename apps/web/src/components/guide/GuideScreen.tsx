'use client';

import Link from 'next/link';
import type { Tile as TileType, Suit, TileNumber } from '@lexio/game-logic';
import { Tile } from '@/components/tile/Tile';

const SASIN: Record<Suit, { name: string; color: string }> = {
  sun: { name: '주작', color: '#C8323D' },
  moon: { name: '현무', color: '#2A8C56' },
  star: { name: '백호', color: '#D88438' },
  cloud: { name: '청룡', color: '#3A5A8C' },
};

type ExampleTile = { number: TileNumber; suit: Suit };

interface HandRank {
  name: string;
  desc: string;
  sub?: string;
  example: ExampleTile[];
}

const HAND_RANKS: HandRank[] = [
  {
    name: '싱글',
    desc: '타일 1개. 더 높은 숫자 또는 같은 숫자라면 더 높은 문양.',
    sub: '최강패: 주작 1',
    example: [{ number: 1, suit: 'sun' }],
  },
  {
    name: '페어',
    desc: '같은 숫자 타일 2개. 같은 숫자 페어라면 가장 높은 문양 포함 쪽이 승.',
    sub: '최강패: 1 페어 (주작 1 포함)',
    example: [
      { number: 13, suit: 'sun' },
      { number: 13, suit: 'moon' },
    ],
  },
  {
    name: '트리플',
    desc: '같은 숫자 타일 3개. 더 높은 숫자가 승.',
    sub: '최강패: 1 트리플',
    example: [
      { number: 11, suit: 'sun' },
      { number: 11, suit: 'moon' },
      { number: 11, suit: 'star' },
    ],
  },
  {
    name: '스트레이트',
    desc: '문양 무관, 연속된 숫자 5개.',
    sub: '1은 maxNumber 뒤에 ace high (예: 12-13-14-15-1). 1과 2는 한 스트레이트에 함께 못 들어감.',
    example: [
      { number: 5, suit: 'sun' },
      { number: 6, suit: 'moon' },
      { number: 7, suit: 'star' },
      { number: 8, suit: 'cloud' },
      { number: 9, suit: 'sun' },
    ],
  },
  {
    name: '플러시',
    desc: '같은 문양 5개. 가장 높은 숫자(같으면 문양 서열)로 승부.',
    example: [
      { number: 3, suit: 'sun' },
      { number: 7, suit: 'sun' },
      { number: 9, suit: 'sun' },
      { number: 11, suit: 'sun' },
      { number: 13, suit: 'sun' },
    ],
  },
  {
    name: '풀하우스',
    desc: '트리플(3) + 페어(2). 트리플 쪽 숫자가 높은 풀하우스가 승.',
    example: [
      { number: 8, suit: 'sun' },
      { number: 8, suit: 'moon' },
      { number: 8, suit: 'star' },
      { number: 12, suit: 'sun' },
      { number: 12, suit: 'moon' },
    ],
  },
  {
    name: '포카드',
    desc: '같은 숫자 4개 + 아무 타일 1개. 4장의 숫자가 높은 쪽이 승.',
    example: [
      { number: 9, suit: 'sun' },
      { number: 9, suit: 'moon' },
      { number: 9, suit: 'star' },
      { number: 9, suit: 'cloud' },
      { number: 5, suit: 'sun' },
    ],
  },
  {
    name: '스트레이트 플러시',
    desc: '같은 문양 + 연속된 숫자 5개. 5장 조합 중 최강.',
    example: [
      { number: 4, suit: 'sun' },
      { number: 5, suit: 'sun' },
      { number: 6, suit: 'sun' },
      { number: 7, suit: 'sun' },
      { number: 8, suit: 'sun' },
    ],
  },
];

const NUMBER_ORDER: TileNumber[] = [1, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

export function GuideScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at top, rgba(212,166,86,0.06) 0%, transparent 55%), var(--fgg-bg-0)',
        color: 'var(--fgg-text)',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 28px',
          borderBottom: '1px solid var(--fgg-line)',
          background: 'var(--fgg-bg-1)',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Link
          href="/"
          className="fgg-btn"
          style={{ padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}
        >
          ← 로비로
        </Link>
        <div>
          <div
            className="fgg-display"
            style={{ fontSize: 24, color: 'var(--fgg-text)', lineHeight: 1.1 }}
          >
            족보 가이드
          </div>
          <div className="fgg-eyebrow" style={{ marginTop: 4 }}>
            조합과 서열을 한눈에
          </div>
        </div>
      </header>

      <div style={{ padding: '28px 24px 60px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Hierarchy explainer */}
        <div className="fgg-panel" style={{ padding: 22, marginBottom: 22 }}>
          <div className="fgg-eyebrow" style={{ marginBottom: 14 }}>
            서열 시스템
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--fgg-text-dim)',
                  marginBottom: 10,
                }}
              >
                숫자 서열 (높음 → 낮음)
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  alignItems: 'center',
                  fontFamily: 'var(--fgg-font-num)',
                  fontSize: 14,
                }}
              >
                {NUMBER_ORDER.map((n, i) => (
                  <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        padding: '4px 9px',
                        background:
                          n === 1
                            ? 'linear-gradient(180deg, var(--fgg-gold-bright), var(--fgg-gold-deep))'
                            : n === 2
                              ? 'rgba(120,120,140,0.18)'
                              : 'var(--fgg-bg-2)',
                        color:
                          n === 1
                            ? '#1A1408'
                            : n === 2
                              ? 'var(--fgg-text-muted)'
                              : 'var(--fgg-text)',
                        borderRadius: 5,
                        fontWeight: n === 1 || n === 2 ? 700 : 500,
                        border:
                          n === 1
                            ? '1px solid var(--fgg-gold-deep)'
                            : '1px solid var(--fgg-line)',
                      }}
                    >
                      {n}
                    </span>
                    {i < NUMBER_ORDER.length - 1 && (
                      <span
                        style={{
                          color: 'var(--fgg-text-muted)',
                          fontSize: 10,
                        }}
                      >
                        ›
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--fgg-text-muted)',
                  marginTop: 10,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: 'var(--fgg-gold-bright)', fontWeight: 600 }}>1이 최강(ace)</span>,
                2가 최약. (FGG 룰)
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--fgg-text-dim)',
                  marginBottom: 10,
                }}
              >
                문양 서열 (같은 숫자일 때)
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {(['sun', 'moon', 'star', 'cloud'] as Suit[]).map((s, i) => (
                  <span
                    key={s}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
                  >
                    <Tile
                      tile={{ number: 7 as TileNumber, suit: s } as TileType}
                      size="sm"
                    />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span
                        style={{
                          fontFamily: 'var(--fgg-font-display)',
                          fontSize: 16,
                          color: SASIN[s].color,
                          fontWeight: 600,
                        }}
                      >
                        {SASIN[s].name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: 'var(--fgg-text-muted)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {s}
                      </span>
                    </span>
                    {i < 3 && (
                      <span style={{ color: 'var(--fgg-text-muted)' }}>›</span>
                    )}
                  </span>
                ))}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--fgg-text-muted)',
                  marginTop: 10,
                  lineHeight: 1.5,
                }}
              >
                sun=주작 · moon=현무 · star=백호 · cloud=청룡
              </div>
            </div>
          </div>
        </div>

        {/* Combinations */}
        <div className="fgg-eyebrow" style={{ marginBottom: 14 }}>
          조합 (낮음 → 높음)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HAND_RANKS.map((rank, i) => (
            <div
              key={rank.name}
              className="fgg-panel"
              style={{
                padding: 18,
                display: 'grid',
                gridTemplateColumns: '60px 1fr auto',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                className="fgg-display"
                style={{
                  fontSize: 36,
                  color: 'var(--fgg-gold-bright)',
                  textAlign: 'center',
                  opacity: 0.65,
                  fontStyle: 'italic',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: 'var(--fgg-text)',
                    marginBottom: 6,
                    fontFamily: 'var(--fgg-font-display)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {rank.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--fgg-text-dim)',
                    lineHeight: 1.5,
                  }}
                >
                  {rank.desc}
                </div>
                {rank.sub && (
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--fgg-gold)',
                      marginTop: 6,
                      fontStyle: 'italic',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {rank.sub}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  justifyContent: 'flex-end',
                  paddingBottom: 16,
                }}
              >
                {rank.example.map((t, j) => (
                  <Tile
                    key={j}
                    tile={{ number: t.number, suit: t.suit } as TileType}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special rules */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
            marginTop: 24,
          }}
        >
          {[
            {
              title: '4개는 못 냅니다',
              body: '한 번에 낼 수 있는 개수는 1, 2, 3, 5개. 4개는 절대 불가.',
            },
            {
              title: '같은 개수만',
              body: '앞사람이 낸 개수와 동일하게, 더 높은 서열로만 받아칠 수 있습니다.',
            },
            {
              title: '1 페널티 주의',
              body: '게임 종료 시 손에 남은 1(ace) 1개당 남은 패 ×2배. (2개면 ×4, 3개면 ×8)',
            },
            {
              title: '첫 선 (先)',
              body: '가장 약한 타일인 청룡 2(cloud-2) 보유자가 첫 선이 됩니다.',
            },
          ].map((s) => (
            <div
              key={s.title}
              style={{
                padding: 16,
                border: '1px dashed var(--fgg-gold-deep)',
                borderRadius: 12,
                background: 'rgba(212, 166, 86, 0.04)',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--fgg-gold-bright)',
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: '0.04em',
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--fgg-text-dim)',
                  lineHeight: 1.55,
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
