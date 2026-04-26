'use client';

interface ActionButtonsProps {
  isMyTurn: boolean;
  hasSelection: boolean;
  onPlay: () => void;
  onPass: () => void;
}

export function ActionButtons({ isMyTurn, hasSelection, onPlay, onPass }: ActionButtonsProps) {
  if (!isMyTurn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 16px 16px' }}>
        <span style={{ fontSize: 13, color: '#475569' }}>다른 플레이어의 차례입니다...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '8px 16px 16px' }}>
      <button
        onClick={onPass}
        style={{
          padding: '12px 24px',
          borderRadius: 10,
          border: '1.5px solid #334155',
          background: 'rgba(30,41,59,0.8)',
          color: '#94a3b8',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          flex: 1,
          maxWidth: 140,
          transition: 'all 0.1s ease',
        }}
      >
        패스
      </button>
      <button
        onClick={onPlay}
        disabled={!hasSelection}
        style={{
          padding: '12px 24px',
          borderRadius: 10,
          border: hasSelection ? '1.5px solid #1d4ed8' : '1.5px solid #1e293b',
          background: hasSelection
            ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
            : 'rgba(15,23,42,0.6)',
          color: hasSelection ? '#fff' : '#334155',
          fontWeight: 700,
          fontSize: 14,
          cursor: hasSelection ? 'pointer' : 'not-allowed',
          flex: 2,
          maxWidth: 200,
          boxShadow: hasSelection ? '0 0 12px rgba(37,99,235,0.4)' : 'none',
          transition: 'all 0.1s ease',
        }}
      >
        {hasSelection ? '타일 내기' : '타일 선택 필요'}
      </button>
    </div>
  );
}
