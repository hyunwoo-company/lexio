'use client';

interface RoundHeaderProps {
  round: number;
  currentTurnName: string;
  roomCode?: string;
  /** 현재 턴 남은 시간(초). undefined면 미표시. */
  turnSecondsLeft?: number;
  turnTotalSeconds?: number;
}

export function RoundHeader({
  round,
  currentTurnName,
  roomCode,
  turnSecondsLeft,
  turnTotalSeconds = 120,
}: RoundHeaderProps) {
  const showTimer = typeof turnSecondsLeft === 'number';
  const pct = showTimer ? Math.max(0, Math.min(100, (turnSecondsLeft / turnTotalSeconds) * 100)) : 100;
  const lowTime = showTimer && turnSecondsLeft <= 15;

  return (
    <div
      style={{
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 4,
        zIndex: 5,
      }}
    >
      {/* 1단: ROUND + 차례 + 방번호 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 16px',
          background: 'rgba(10, 15, 13, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--fgg-line)',
          borderRadius: 999,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span
            style={{
              fontSize: 9,
              color: 'var(--fgg-text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Round
          </span>
          <span
            style={{
              fontFamily: 'var(--fgg-font-display)',
              fontSize: 16,
              color: 'var(--fgg-gold-bright)',
              lineHeight: 1,
            }}
          >
            {round}
          </span>
        </div>

        <div style={{ width: 1, height: 14, background: 'var(--fgg-line)' }} />

        <div style={{ fontSize: 11, color: 'var(--fgg-text-dim)' }}>
          <span style={{ color: 'var(--fgg-gold-bright)', fontWeight: 600 }}>
            {currentTurnName}
          </span>{' '}
          차례
        </div>

        {roomCode && (
          <>
            <div style={{ width: 1, height: 14, background: 'var(--fgg-line)' }} />
            <span
              style={{
                fontFamily: 'var(--fgg-font-display)',
                fontSize: 10,
                color: 'var(--fgg-text-muted)',
              }}
            >
              #{roomCode}
            </span>
          </>
        )}
      </div>

      {/* 2단: 턴 타이머 (라운드 아래) */}
      {showTimer && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            background: 'rgba(10, 15, 13, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${lowTime ? 'var(--fgg-jujak)' : 'var(--fgg-line)'}`,
            borderRadius: 999,
          }}
        >
          {/* 진행 바 */}
          <div
            style={{
              flex: 1,
              minWidth: 80,
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background: lowTime ? 'var(--fgg-jujak)' : 'var(--fgg-gold-bright)',
                transition: 'width 1s linear',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--fgg-font-num)',
              fontSize: 11,
              fontWeight: 700,
              color: lowTime ? 'var(--fgg-jujak)' : 'var(--fgg-text)',
              minWidth: 28,
              textAlign: 'right',
              lineHeight: 1,
            }}
          >
            {turnSecondsLeft}s
          </span>
        </div>
      )}
    </div>
  );
}
