/* Round results / final results / profile / hand guide / tutorial screens */

function ScoreSettlementScreen({ width = 1280, height = 800 }) {
  // Round end — 1st player has 0 tiles, others have remaining counts.
  // Score exchange = difference in tile counts. Special: tile 2 in hand doubles count.
  const results = [
    { rank: 1, name: '용현', avatar: '용', tilesLeft: 0, has2: 0, effective: 0, change: +18, you: false },
    { rank: 2, name: '나', avatar: '나', tilesLeft: 2, has2: 0, effective: 2, change: +4, you: true },
    { rank: 3, name: 'NeoTaco', avatar: 'N', tilesLeft: 5, has2: 1, effective: 10, change: -6, you: false },
    { rank: 4, name: 'Mira', avatar: 'M', tilesLeft: 8, has2: 2, effective: 32, change: -16, you: false },
  ];

  return (
    <div className="lx-screen lx-felt" style={{ width, height, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: 32, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="lx-eyebrow" style={{ marginBottom: 8 }}>Round 3 / 5</div>
          <h1 className="lx-display" style={{ fontSize: 42, margin: 0, color: 'var(--lx-gold-bright)', textShadow: '0 0 20px rgba(242, 200, 120, 0.4)' }}>라운드 정산</h1>
          <div style={{ fontSize: 13, color: 'var(--lx-text-dim)', marginTop: 6 }}>
            🏆 <span style={{ color: 'var(--lx-text)' }}>용현</span>님이 먼저 패를 비웠습니다
          </div>
        </div>

        {/* Result table */}
        <div className="lx-panel" style={{ overflow: 'hidden', maxWidth: 880, margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1.6fr 1fr 1fr 1fr 1.2fr',
            padding: '12px 18px',
            background: 'var(--lx-bg-2)',
            borderBottom: '1px solid var(--lx-line)',
            fontSize: 11,
            color: 'var(--lx-text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            <div>순위</div>
            <div>플레이어</div>
            <div style={{ textAlign: 'center' }}>남은 패</div>
            <div style={{ textAlign: 'center' }}>2 페널티</div>
            <div style={{ textAlign: 'center' }}>적용</div>
            <div style={{ textAlign: 'right' }}>점수</div>
          </div>
          {results.map(r => (
            <div key={r.rank} style={{
              display: 'grid',
              gridTemplateColumns: '60px 1.6fr 1fr 1fr 1fr 1.2fr',
              padding: '14px 18px',
              alignItems: 'center',
              borderBottom: '1px solid var(--lx-line-subtle)',
              background: r.you ? 'rgba(45, 186, 111, 0.06)' : 'transparent',
            }}>
              <div style={{ fontFamily: 'var(--lx-font-display)', fontSize: 28, color: r.rank === 1 ? 'var(--lx-gold-bright)' : 'var(--lx-text)' }}>
                {r.rank === 1 ? '🥇' : r.rank}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="lx-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{r.avatar}</div>
                <span style={{ fontSize: 14, color: 'var(--lx-text)', fontWeight: r.you ? 600 : 400 }}>{r.name}{r.you && <span style={{ color: '#5DDA9E', marginLeft: 6, fontSize: 11 }}>(나)</span>}</span>
              </div>
              <div style={{ textAlign: 'center', fontFamily: 'var(--lx-font-num)', fontSize: 18, color: 'var(--lx-text)' }}>{r.tilesLeft}</div>
              <div style={{ textAlign: 'center', fontSize: 13, color: r.has2 ? 'var(--lx-sun)' : 'var(--lx-text-muted)' }}>
                {r.has2 ? `×${Math.pow(2, r.has2)} (2 ${r.has2}개)` : '—'}
              </div>
              <div style={{ textAlign: 'center', fontFamily: 'var(--lx-font-num)', fontSize: 20, color: r.has2 ? 'var(--lx-sun)' : 'var(--lx-text)' }}>{r.effective}</div>
              <div style={{
                textAlign: 'right',
                fontFamily: 'var(--lx-font-num)',
                fontSize: 22,
                fontWeight: 600,
                color: r.change > 0 ? '#5DDA9E' : 'var(--lx-sun)',
              }}>
                {r.change > 0 ? '+' : ''}{r.change}
              </div>
            </div>
          ))}
        </div>

        {/* Tile-2 special note */}
        <div style={{
          maxWidth: 880,
          margin: '14px auto 0',
          padding: '10px 16px',
          fontSize: 11,
          color: 'var(--lx-text-muted)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          ※ 게임 종료 시 손에 든 ‘숫자 2’ 타일 1개당 남은 타일 개수가 2배로 계산됩니다 (2개 = 4배, 3개 = 8배)
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 12, paddingTop: 24 }}>
          <button className="lx-btn">상세 히스토리</button>
          <button className="lx-btn lx-btn--primary" style={{ padding: '12px 28px', fontSize: 14 }}>다음 라운드 ▸</button>
        </div>
      </div>
    </div>
  );
}

function FinalResultScreen({ width = 1280, height = 800 }) {
  const final = [
    { rank: 1, name: '용현', avatar: '용', total: +52, wins: 3, signature: '플러시 5번' },
    { rank: 2, name: '나', avatar: '나', total: +14, wins: 1, you: true, signature: '풀하우스 2번' },
    { rank: 3, name: 'NeoTaco', avatar: 'N', total: -18, wins: 1, signature: '스트레이트 4번' },
    { rank: 4, name: 'Mira', avatar: 'M', total: -48, wins: 0, signature: '2 페널티 6번' },
  ];

  return (
    <div className="lx-screen" style={{ width, height, background: 'var(--lx-bg-0)', overflow: 'auto' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(212, 166, 86, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', padding: 40, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="lx-eyebrow" style={{ marginBottom: 6 }}>Game Over · 5 Rounds</div>
          <h1 className="lx-display" style={{ fontSize: 56, margin: 0, color: 'var(--lx-gold-bright)', letterSpacing: '0.06em' }}>최종 결과</h1>
        </div>

        {/* Podium-style top 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 16, alignItems: 'end', marginBottom: 32 }}>
          {[final[1], final[0], final[2]].map((p, i) => {
            const heights = [180, 240, 160];
            const colors = ['#C0C0C0', 'var(--lx-gold-bright)', '#CD7F32'];
            return (
              <div key={p.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div className="lx-avatar" style={{
                  width: i === 1 ? 80 : 64,
                  height: i === 1 ? 80 : 64,
                  fontSize: i === 1 ? 28 : 22,
                  borderColor: colors[i],
                  boxShadow: `0 0 24px ${colors[i]}66`,
                }}>{p.avatar}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: i === 1 ? 18 : 15, fontWeight: 600, color: 'var(--lx-text)' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--lx-font-num)', fontSize: i === 1 ? 32 : 24, color: p.total > 0 ? '#5DDA9E' : 'var(--lx-sun)' }}>
                    {p.total > 0 ? '+' : ''}{p.total}
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: heights[i],
                  background: `linear-gradient(180deg, ${colors[i]}33 0%, ${colors[i]}0D 100%)`,
                  border: `1px solid ${colors[i]}66`,
                  borderRadius: 'var(--r-md) var(--r-md) 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: 18,
                  fontFamily: 'var(--lx-font-display)',
                  fontSize: 48,
                  color: colors[i],
                }}>{p.rank === 1 ? '🥇' : p.rank}</div>
              </div>
            );
          })}
        </div>

        {/* Detail rows */}
        <div className="lx-panel" style={{ overflow: 'hidden' }}>
          {final.map((p, i) => (
            <div key={p.rank} style={{
              display: 'grid',
              gridTemplateColumns: '60px 56px 1fr 1fr 1fr 100px',
              padding: '14px 22px',
              alignItems: 'center',
              borderBottom: i < final.length - 1 ? '1px solid var(--lx-line-subtle)' : 'none',
              background: p.you ? 'rgba(45, 186, 111, 0.05)' : 'transparent',
            }}>
              <div style={{ fontFamily: 'var(--lx-font-display)', fontSize: 22, color: 'var(--lx-gold-bright)' }}>#{p.rank}</div>
              <div className="lx-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{p.avatar}</div>
              <div style={{ fontSize: 14, color: 'var(--lx-text)' }}>{p.name}{p.you && <span style={{ color: '#5DDA9E', marginLeft: 6, fontSize: 11 }}>(나)</span>}</div>
              <div style={{ fontSize: 12, color: 'var(--lx-text-dim)' }}>1등 {p.wins}회</div>
              <div style={{ fontSize: 12, color: 'var(--lx-text-muted)' }}>{p.signature}</div>
              <div style={{
                textAlign: 'right',
                fontFamily: 'var(--lx-font-num)',
                fontSize: 22, fontWeight: 600,
                color: p.total > 0 ? '#5DDA9E' : 'var(--lx-sun)',
              }}>{p.total > 0 ? '+' : ''}{p.total}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
          <button className="lx-btn">로비로</button>
          <button className="lx-btn">전적 보기</button>
          <button className="lx-btn lx-btn--primary" style={{ padding: '12px 28px' }}>↻ 같은 멤버로 한 판 더</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScoreSettlementScreen, FinalResultScreen });
