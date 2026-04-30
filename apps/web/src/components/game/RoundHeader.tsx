'use client';

interface RoundHeaderProps {
  round: number;
  currentTurnName: string;
  roomCode?: string;
}

export function RoundHeader({ round, currentTurnName, roomCode }: RoundHeaderProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 18px',
        background: 'rgba(10, 15, 13, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--fgg-line)',
        borderRadius: 999,
        zIndex: 5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontSize: 10,
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
            fontSize: 20,
            color: 'var(--fgg-gold-bright)',
          }}
        >
          {round}
        </span>
      </div>

      <div style={{ width: 1, height: 18, background: 'var(--fgg-line)' }} />

      <div style={{ fontSize: 12, color: 'var(--fgg-text-dim)' }}>
        <span style={{ color: 'var(--fgg-gold-bright)', fontWeight: 600 }}>{currentTurnName}</span> 차례
      </div>

      {roomCode && (
        <>
          <div style={{ width: 1, height: 18, background: 'var(--fgg-line)' }} />
          <span
            style={{
              fontFamily: 'var(--fgg-font-display)',
              fontSize: 11,
              color: 'var(--fgg-text-muted)',
            }}
          >
            #{roomCode}
          </span>
        </>
      )}
    </div>
  );
}
