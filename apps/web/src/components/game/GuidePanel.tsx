'use client';

interface GuidePanelProps {
  open: boolean;
  onClose: () => void;
}

const COMBOS = [
  { name: '싱글', desc: '1장 — 1>15>14>...>2' },
  { name: '페어', desc: '같은 숫자 2장' },
  { name: '트리플', desc: '같은 숫자 3장' },
  { name: '스트레이트', desc: '연속 5장 (1+2 동시 불가)' },
  { name: '플러시', desc: '같은 문양 5장' },
  { name: '풀하우스', desc: '트리플+페어' },
  { name: '포카드', desc: '같은 숫자 4장+1장' },
  { name: '스트레이트플러시', desc: '연속+같은 문양' },
];

export function GuidePanel({ open, onClose }: GuidePanelProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fgg-panel"
        style={{
          maxWidth: 480,
          width: '100%',
          maxHeight: '85dvh',
          overflowY: 'auto',
          padding: 18,
          fontSize: 12,
          color: 'var(--fgg-text)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--fgg-font-display)',
              fontSize: 20,
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
              fontSize: 22,
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1,
            }}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 숫자 / 사신수 서열 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div style={{ padding: '8px 10px', background: 'rgba(212,166,86,0.08)', borderRadius: 8, border: '1px solid var(--fgg-line)' }}>
            <div className="fgg-eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>숫자 서열</div>
            <div style={{ fontFamily: 'var(--fgg-font-num)', fontSize: 11 }}>
              <strong style={{ color: 'var(--fgg-gold-bright)' }}>1</strong> &gt; 15 &gt; 14 &gt; ... &gt; 3 &gt; <strong>2</strong>
            </div>
          </div>
          <div style={{ padding: '8px 10px', background: 'rgba(212,166,86,0.08)', borderRadius: 8, border: '1px solid var(--fgg-line)' }}>
            <div className="fgg-eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>사신수 서열</div>
            <div style={{ fontSize: 10, lineHeight: 1.5 }}>
              <span style={{ color: '#C8323D' }}>주작</span> &gt; <span style={{ color: '#2A8C56' }}>현무</span> &gt; <span style={{ color: '#D88438' }}>백호</span> &gt; <span style={{ color: '#3A5A8C' }}>청룡</span>
            </div>
          </div>
        </div>

        {/* 8개 콤보 */}
        <div className="fgg-eyebrow" style={{ fontSize: 9, marginBottom: 6 }}>족보 (낮음 → 높음)</div>
        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            lineHeight: 1.5,
          }}
        >
          {COMBOS.map((c) => (
            <li key={c.name}>
              <strong style={{ color: 'var(--fgg-gold-bright)' }}>{c.name}</strong>
              <span style={{ color: 'var(--fgg-text-dim)', marginLeft: 6 }}>{c.desc}</span>
            </li>
          ))}
        </ol>

        {/* 선 / 패널티 룰 */}
        <div className="fgg-eyebrow" style={{ fontSize: 9, marginTop: 14, marginBottom: 6 }}>선 / 점수 룰</div>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.5 }}>
          <li>
            <strong style={{ color: 'var(--fgg-gold-bright)' }}>1라운드 첫 선</strong>: 청룡 2를 가진 사람.
          </li>
          <li>
            <strong style={{ color: 'var(--fgg-gold-bright)' }}>다음 라운드 선</strong>: 직전 라운드 1등(가장 먼저 패를 다 낸 사람). 어떤 패든 자유롭게 시작 가능.
          </li>
          <li>
            <strong>4장 콤보</strong>는 절대 불가. 1/2/3/5장만.
          </li>
          <li>
            <strong>패널티</strong>: 라운드 종료 시 손에 1을 가지고 있으면 남은 패 ×2^n (1개→×2, 2개→×4).
          </li>
          <li>
            나머지 모두 패스 → 마지막 낸 사람이 새 선.
          </li>
        </ul>

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
