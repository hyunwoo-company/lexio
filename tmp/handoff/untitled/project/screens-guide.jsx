/* Hand guide screen — combinations cheat sheet */

function HandGuideScreen({ width = 1280, height = 800 }) {
  const examples = {
    '싱글':       [{ n: 2, s: 'sun' }],
    '페어':       [{ n: 13, s: 'sun' }, { n: 13, s: 'moon' }],
    '트리플':     [{ n: 11, s: 'sun' }, { n: 11, s: 'moon' }, { n: 11, s: 'star' }],
    '스트레이트': [{ n: 5, s: 'sun' }, { n: 6, s: 'moon' }, { n: 7, s: 'star' }, { n: 8, s: 'cloud' }, { n: 9, s: 'sun' }],
    '플러시':     [{ n: 3, s: 'sun' }, { n: 7, s: 'sun' }, { n: 9, s: 'sun' }, { n: 11, s: 'sun' }, { n: 13, s: 'sun' }],
    '풀하우스':   [{ n: 8, s: 'sun' }, { n: 8, s: 'moon' }, { n: 8, s: 'star' }, { n: 12, s: 'sun' }, { n: 12, s: 'moon' }],
    '포카드':     [{ n: 9, s: 'sun' }, { n: 9, s: 'moon' }, { n: 9, s: 'star' }, { n: 9, s: 'cloud' }, { n: 5, s: 'sun' }],
    '스트레이트 플러시': [{ n: 4, s: 'sun' }, { n: 5, s: 'sun' }, { n: 6, s: 'sun' }, { n: 7, s: 'sun' }, { n: 8, s: 'sun' }],
  };

  return (
    <div className="lx-screen" style={{ width, height, background: 'var(--lx-bg-0)', overflow: 'auto' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 28px',
        borderBottom: '1px solid var(--lx-line)',
        background: 'var(--lx-bg-1)',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}>
        <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 12px', fontSize: 11 }}>← 닫기</button>
        <div>
          <div style={{ fontFamily: 'var(--lx-font-display)', fontSize: 22, color: 'var(--lx-text)' }}>족보 가이드</div>
          <div style={{ fontSize: 11, color: 'var(--lx-text-muted)' }}>조합과 서열을 한눈에</div>
        </div>
      </header>

      <div style={{ padding: 28, maxWidth: 1100, margin: '0 auto' }}>
        {/* Hierarchy explainer */}
        <div className="lx-panel" style={{ padding: 20, marginBottom: 20 }}>
          <div className="lx-eyebrow" style={{ marginBottom: 12 }}>서열 시스템</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--lx-text-dim)', marginBottom: 8 }}>숫자 서열 (높음 → 낮음)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', fontFamily: 'var(--lx-font-num)', fontSize: 14 }}>
                {[2, 1, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3].map((n, i) => (
                  <React.Fragment key={n}>
                    <span style={{
                      padding: '3px 8px',
                      background: n === 2 ? 'var(--lx-sun)' : (n === 1 ? 'rgba(230,57,70,0.4)' : 'var(--lx-bg-2)'),
                      color: n === 2 ? 'white' : 'var(--lx-text)',
                      borderRadius: 4,
                      fontWeight: n <= 2 ? 600 : 400,
                    }}>{n}</span>
                    {i < 14 && <span style={{ color: 'var(--lx-text-faint)', fontSize: 10 }}>›</span>}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--lx-text-muted)', marginTop: 8 }}>2가 가장 강하고, 3이 가장 약합니다</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--lx-text-dim)', marginBottom: 8 }}>문양 서열 (같은 숫자일 때)</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {['sun', 'moon', 'star', 'cloud'].map((s, i) => (
                  <React.Fragment key={s}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <SuitIcon suit={s} size={28} />
                      <span style={{ fontSize: 10, color: 'var(--lx-text-dim)' }}>{SUITS[s].name}</span>
                    </div>
                    {i < 3 && <span style={{ color: 'var(--lx-text-faint)' }}>›</span>}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--lx-text-muted)', marginTop: 8 }}>해(빨강) &gt; 달(초록) &gt; 별(노랑) &gt; 구름(파랑)</div>
            </div>
          </div>
        </div>

        {/* Combinations */}
        <div className="lx-eyebrow" style={{ marginBottom: 14 }}>조합 (낮음 → 높음)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HAND_RANKS.map((rank, i) => {
            const ex = examples[rank.name];
            return (
              <div key={rank.name} className="lx-panel" style={{
                padding: 16,
                display: 'grid',
                gridTemplateColumns: '60px 1fr 1.5fr',
                alignItems: 'center',
                gap: 18,
              }}>
                <div style={{
                  fontFamily: 'var(--lx-font-display)',
                  fontSize: 32,
                  color: 'var(--lx-gold-bright)',
                  textAlign: 'center',
                  opacity: 0.6,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--lx-text)', marginBottom: 4 }}>{rank.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--lx-text-dim)' }}>{rank.desc}</div>
                  {rank.sub && <div style={{ fontSize: 11, color: 'var(--lx-text-muted)', marginTop: 4, fontStyle: 'italic' }}>{rank.sub}</div>}
                </div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  {ex.map((t, j) => (
                    <Tile key={j} n={t.n} s={t.s} size="md" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Special rules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
          {[
            { title: '4개는 못 냅니다', body: '한 번에 낼 수 있는 개수는 1, 2, 3, 5개. 4개는 절대 불가.' },
            { title: '같은 개수만', body: '앞사람이 낸 개수와 동일하게, 더 높은 서열로만 받아칠 수 있습니다.' },
            { title: '2 페널티 주의', body: '게임 종료 시 손에 남은 ‘2’ 1개당 남은 패 ×2배.' },
          ].map(s => (
            <div key={s.title} style={{
              padding: 14,
              border: '1px dashed var(--lx-gold-deep)',
              borderRadius: 'var(--r-md)',
              background: 'rgba(212, 166, 86, 0.04)',
            }}>
              <div style={{ fontSize: 12, color: 'var(--lx-gold-bright)', fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: 'var(--lx-text-dim)', lineHeight: 1.5 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HandGuideScreen });
