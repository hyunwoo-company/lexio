'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Tile as TileType, Suit, TileNumber } from '@lexio/game-logic';
import { Tile } from '@/components/tile/Tile';

const SASIN: Record<Suit, { name: string; color: string }> = {
  sun: { name: '주작', color: '#C8323D' },
  moon: { name: '현무', color: '#3A5A8C' },
  star: { name: '백호', color: '#D88438' },
  cloud: { name: '청룡', color: '#2A8C56' },
};

type Step = {
  n: number;
  eyebrow: string;
  title: string;
  body: string;
  visual: 'logo' | 'suits' | 'numbers' | 'counts' | 'first' | 'score';
};

const STEPS: Step[] = [
  {
    n: 1,
    eyebrow: 'STEP 01',
    title: 'FGG에 오신 것을 환영합니다',
    body: '사신수 타일과 포커 족보가 만난 클라이밍 보드게임. 가장 먼저 손에 든 모든 패를 비우면 승리합니다. 3~5인용.',
    visual: 'logo',
  },
  {
    n: 2,
    eyebrow: 'STEP 02',
    title: '4가지 사신수 · 60개의 타일',
    body: '주작(sun)·현무(moon)·백호(star)·청룡(cloud). 같은 숫자라면 주작이 가장 강하고 청룡이 가장 약합니다.',
    visual: 'suits',
  },
  {
    n: 3,
    eyebrow: 'STEP 03',
    title: '숫자 서열은 거꾸로',
    body: '1이 가장 강하고(ace), 2가 가장 약합니다. 그 다음은 15 → 14 → ... → 3 순. 일반 카드 게임과 다른 FGG의 핵심 룰입니다.',
    visual: 'numbers',
  },
  {
    n: 4,
    eyebrow: 'STEP 04',
    title: '같은 개수, 더 높게',
    body: '앞사람이 낸 개수만큼 받아쳐야 합니다. 1·2·3·5개만 가능 — 4개는 절대 낼 수 없습니다. 5개 조합은 포커 족보를 따릅니다.',
    visual: 'counts',
  },
  {
    n: 5,
    eyebrow: 'STEP 05',
    title: '첫 선(先)은 청룡 2',
    body: '게임 시작 시 가장 약한 타일인 청룡 2(cloud-2)를 가진 사람이 첫 번째 선이 됩니다. 다만 첫 턴에 반드시 청룡 2를 내야 하는 것은 아닙니다.',
    visual: 'first',
  },
  {
    n: 6,
    eyebrow: 'STEP 06',
    title: '점수와 1(ace) 페널티',
    body: '라운드 종료 시 남은 타일 개수 차이만큼 칩을 교환합니다. 손에 1(ace)이 남으면 남은 패가 ×2배로 계산되니 주의하세요. (2개면 ×4, 3개면 ×8)',
    visual: 'score',
  },
];

function VisualLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 26,
          background:
            'linear-gradient(135deg, var(--fgg-gold-bright), var(--fgg-gold-deep))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--fgg-font-display)',
          fontStyle: 'italic',
          fontWeight: 600,
          color: '#1A1408',
          fontSize: 92,
          boxShadow:
            '0 14px 44px rgba(212, 166, 86, 0.45), inset 0 2px 0 rgba(255,255,255,0.35)',
          lineHeight: 1,
        }}
      >
        F
      </div>
      <div
        className="fgg-display"
        style={{
          fontSize: 52,
          letterSpacing: '0.16em',
          background:
            'linear-gradient(180deg, var(--fgg-gold-bright) 0%, var(--fgg-gold) 60%, var(--fgg-gold-deep) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        FGG
      </div>
      <div className="fgg-eyebrow">Four Guardian Gods</div>
    </div>
  );
}

function VisualSuits() {
  const order: Suit[] = ['sun', 'moon', 'star', 'cloud'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        {order.map((s, i) => (
          <div
            key={s}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transform: `translateY(${i * 4}px)`,
            }}
          >
            <Tile
              tile={{ number: 7 as TileNumber, suit: s } as TileType}
              size="md"
            />
            <div
              style={{
                fontFamily: 'var(--fgg-font-display)',
                fontSize: 18,
                color: SASIN[s].color,
                fontWeight: 600,
              }}
            >
              {SASIN[s].name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--fgg-text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {i === 0 ? '가장 강함' : i === 3 ? '가장 약함' : s}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--fgg-text-muted)',
          fontFamily: 'var(--fgg-font-display)',
        }}
      >
        <span style={{ color: SASIN.sun.color }}>주작</span> ›
        <span style={{ color: SASIN.moon.color }}>현무</span> ›
        <span style={{ color: SASIN.star.color }}>백호</span> ›
        <span style={{ color: SASIN.cloud.color }}>청룡</span>
      </div>
    </div>
  );
}

function VisualNumbers() {
  const seq: TileNumber[] = [1, 15, 14, 13, 12];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {seq.map((n, i) => (
          <div
            key={n}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              opacity: 1 - i * 0.15,
            }}
          >
            <Tile
              tile={{ number: n as TileNumber, suit: 'sun' } as TileType}
              size="md"
            />
            <span
              style={{
                fontSize: 11,
                color: i === 0 ? 'var(--fgg-gold-bright)' : 'var(--fgg-text-muted)',
                fontWeight: i === 0 ? 700 : 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {i === 0 ? 'ACE' : `#${i + 1}`}
            </span>
          </div>
        ))}
        <span
          style={{
            color: 'var(--fgg-text-muted)',
            fontSize: 18,
            alignSelf: 'center',
            padding: '0 8px',
          }}
        >
          ···
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Tile
            tile={{ number: 2 as TileNumber, suit: 'cloud' } as TileType}
            size="md"
          />
          <span
            style={{
              fontSize: 11,
              color: 'var(--fgg-text-muted)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            가장 약함
          </span>
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--fgg-gold)',
          fontStyle: 'italic',
          letterSpacing: '0.04em',
        }}
      >
        1 › 15 › 14 › 13 › ··· › 4 › 3 › 2
      </div>
    </div>
  );
}

function VisualCounts() {
  const groups: { label: string; tiles: ExampleTile[]; ok: boolean }[] = [
    { label: '1개', tiles: [{ number: 5, suit: 'sun' }], ok: true },
    {
      label: '2개',
      tiles: [
        { number: 8, suit: 'sun' },
        { number: 8, suit: 'moon' },
      ],
      ok: true,
    },
    {
      label: '3개',
      tiles: [
        { number: 11, suit: 'sun' },
        { number: 11, suit: 'moon' },
        { number: 11, suit: 'star' },
      ],
      ok: true,
    },
    {
      label: '4개',
      tiles: [
        { number: 9, suit: 'sun' },
        { number: 9, suit: 'moon' },
        { number: 9, suit: 'star' },
        { number: 9, suit: 'cloud' },
      ],
      ok: false,
    },
    {
      label: '5개',
      tiles: [
        { number: 4, suit: 'sun' },
        { number: 5, suit: 'sun' },
        { number: 6, suit: 'sun' },
        { number: 7, suit: 'sun' },
        { number: 8, suit: 'sun' },
      ],
      ok: true,
    },
  ];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      {groups.map((g) => (
        <div
          key={g.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            opacity: g.ok ? 1 : 0.5,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--fgg-font-display)',
              fontSize: 18,
              color: g.ok ? 'var(--fgg-gold-bright)' : '#FF8088',
              minWidth: 56,
              fontWeight: 600,
            }}
          >
            {g.ok ? '✓' : '✗'} {g.label}
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            {g.tiles.map((t, j) => (
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
  );
}

type ExampleTile = { number: TileNumber; suit: Suit };

function VisualFirst() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div
        style={{
          fontFamily: 'var(--fgg-font-display)',
          fontSize: 60,
          color: 'var(--fgg-gold-bright)',
          fontStyle: 'italic',
          textShadow: '0 0 24px rgba(242,200,120,0.4)',
        }}
      >
        先
      </div>
      <Tile
        tile={{ number: 2 as TileNumber, suit: 'cloud' } as TileType}
        size="lg"
      />
      <div
        style={{
          fontSize: 13,
          color: 'var(--fgg-text-dim)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        가장 약한 타일 <strong style={{ color: SASIN.cloud.color }}>청룡 2</strong>
        <br />
        보유자가 첫 선
      </div>
    </div>
  );
}

function VisualScore() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tile
          tile={{ number: 1 as TileNumber, suit: 'sun' } as TileType}
          size="lg"
        />
        <span
          style={{
            fontFamily: 'var(--fgg-font-display)',
            fontSize: 40,
            color: 'var(--fgg-gold-bright)',
            fontStyle: 'italic',
          }}
        >
          ×2
        </span>
      </div>
      <div
        style={{
          padding: '12px 20px',
          border: '1px dashed var(--fgg-gold-deep)',
          borderRadius: 10,
          background: 'rgba(212,166,86,0.06)',
          fontSize: 12,
          color: 'var(--fgg-text-dim)',
          textAlign: 'center',
          lineHeight: 1.6,
          maxWidth: 280,
        }}
      >
        손에 남은 <strong style={{ color: 'var(--fgg-gold-bright)' }}>1(ace)</strong> 1개당
        <br />
        남은 패 개수가 ×2배로 계산
      </div>
    </div>
  );
}

function StepVisual({ visual }: { visual: Step['visual'] }) {
  switch (visual) {
    case 'logo':
      return <VisualLogo />;
    case 'suits':
      return <VisualSuits />;
    case 'numbers':
      return <VisualNumbers />;
    case 'counts':
      return <VisualCounts />;
    case 'first':
      return <VisualFirst />;
    case 'score':
      return <VisualScore />;
  }
}

export function TutorialScreen() {
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;
  const isFirst = current === 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at top, rgba(212,166,86,0.06) 0%, transparent 55%), var(--fgg-bg-0)',
        color: 'var(--fgg-text)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Progress */}
      <div
        style={{
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderBottom: '1px solid var(--fgg-line)',
          background: 'var(--fgg-bg-1)',
        }}
      >
        <Link
          href="/"
          className="fgg-btn"
          style={{
            padding: '8px 14px',
            fontSize: 11,
            textDecoration: 'none',
          }}
        >
          ← 로비로
        </Link>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background:
                  i <= current
                    ? 'var(--fgg-gold-bright)'
                    : 'rgba(255,255,255,0.08)',
                transition: 'background 200ms',
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--fgg-text-muted)',
            fontFamily: 'var(--fgg-font-num)',
            letterSpacing: '0.08em',
          }}
        >
          {current + 1} / {STEPS.length}
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          padding: '40px 60px',
          gap: 60,
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div>
          <div className="fgg-eyebrow" style={{ marginBottom: 12 }}>
            {step.eyebrow}
          </div>
          <h1
            className="fgg-display"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              margin: '0 0 20px',
              color: 'var(--fgg-text)',
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            {step.title}
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'var(--fgg-text-dim)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {step.body}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <StepVisual visual={step.visual} />
        </div>
      </div>

      {/* Footer nav */}
      <div
        style={{
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--fgg-line)',
          background: 'var(--fgg-bg-1)',
          gap: 12,
        }}
      >
        <button
          className="fgg-btn"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={isFirst}
          style={{ padding: '10px 18px', fontSize: 13 }}
        >
          ← 이전
        </button>

        {isLast ? (
          <Link
            href="/"
            className="fgg-btn fgg-btn--primary"
            style={{
              padding: '12px 28px',
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            로비로 돌아가기 ▸
          </Link>
        ) : (
          <button
            className="fgg-btn fgg-btn--primary"
            onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
            style={{ padding: '12px 28px', fontSize: 13 }}
          >
            다음 ▸
          </button>
        )}
      </div>
    </div>
  );
}
