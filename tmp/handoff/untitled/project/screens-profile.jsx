/* Profile / stats screen */

function ProfileScreen({ width = 1280, height = 800 }) {
  const stats = [
    { label: '총 전적', value: '247', sub: '전' },
    { label: '승률', value: '54', sub: '%' },
    { label: '1등 횟수', value: '78', sub: '회' },
    { label: '평균 점수', value: '+12', sub: '/판' },
  ];
  const recent = [
    { date: '04-30', mode: '4인전', rank: 1, change: +24, vs: '용현, NeoTaco, Mira' },
    { date: '04-29', mode: '5인전', rank: 3, change: -8, vs: '도윤, Tiger, 소영, 용현' },
    { date: '04-29', mode: '4인전', rank: 2, change: +6, vs: 'Mira, 도윤, NeoTaco' },
    { date: '04-28', mode: '3인전', rank: 1, change: +18, vs: 'NeoTaco, 용현' },
    { date: '04-27', mode: '4인전', rank: 4, change: -32, vs: 'Tiger, Mira, 소영', penalty: true },
  ];

  return (
    <div className="lx-screen" style={{ width, height, background: 'var(--lx-bg-0)', overflow: 'auto' }}>
      <header style={{ padding: '14px 28px', borderBottom: '1px solid var(--lx-line)', background: 'var(--lx-bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 12px', fontSize: 11 }}>← 로비</button>
          <div style={{ fontFamily: 'var(--lx-font-display)', fontSize: 22 }}>프로필</div>
        </div>
        <button className="lx-btn lx-btn--ghost" style={{ fontSize: 12 }}>⚙ 설정</button>
      </header>

      <div style={{ padding: 28, maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Identity card */}
        <div className="lx-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div className="lx-avatar" style={{ width: 96, height: 96, fontSize: 36 }}>나</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--lx-text)', fontFamily: 'var(--lx-font-display)' }}>이도현</div>
            <div style={{ fontSize: 12, color: 'var(--lx-text-dim)' }}>@dohyun_lee · 가입 2024.03</div>
          </div>
          <div style={{
            padding: '4px 14px',
            borderRadius: 999,
            background: 'linear-gradient(180deg, rgba(212, 166, 86, 0.2), rgba(212, 166, 86, 0.05))',
            border: '1px solid var(--lx-gold)',
            fontSize: 12,
            color: 'var(--lx-gold-bright)',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>♛ 골드 III · 1,247 점</div>
          <div style={{ width: '100%', marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--lx-text-muted)', marginBottom: 4 }}>
              <span>골드 III</span>
              <span>다음: 골드 II (1,500)</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, var(--lx-gold-deep), var(--lx-gold-bright))' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, width: '100%' }}>
            <button className="lx-btn lx-btn--ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}>친구 추가</button>
            <button className="lx-btn lx-btn--ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}>프로필 수정</button>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {stats.map(s => (
              <div key={s.label} className="lx-panel" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--lx-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                <div style={{ marginTop: 6, fontFamily: 'var(--lx-font-display)', fontSize: 32, color: 'var(--lx-gold-bright)' }}>
                  {s.value}<span style={{ fontSize: 14, color: 'var(--lx-text-dim)', marginLeft: 2 }}>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Favorite combos */}
          <div className="lx-panel" style={{ padding: 18 }}>
            <div className="lx-eyebrow" style={{ marginBottom: 12 }}>잘 쓰는 조합 Top 3</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { name: '플러시', count: 42, ex: [{n:3,s:'sun'},{n:7,s:'sun'},{n:9,s:'sun'},{n:11,s:'sun'},{n:13,s:'sun'}] },
                { name: '풀하우스', count: 28, ex: [{n:8,s:'sun'},{n:8,s:'moon'},{n:8,s:'star'},{n:12,s:'sun'},{n:12,s:'moon'}] },
                { name: '스트레이트', count: 21, ex: [{n:5,s:'sun'},{n:6,s:'moon'},{n:7,s:'star'},{n:8,s:'cloud'},{n:9,s:'sun'}] },
              ].map(c => (
                <div key={c.name} style={{ flex: 1, padding: 12, border: '1px solid var(--lx-line)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--lx-text)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--lx-text-muted)', marginBottom: 8 }}>{c.count}회 성공</div>
                  <div style={{ display: 'flex', gap: 1, transform: 'scale(0.7)', transformOrigin: 'left' }}>
                    {c.ex.map((t, i) => <Tile key={i} n={t.n} s={t.s} size="sm" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent games */}
          <div className="lx-panel" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div className="lx-eyebrow">최근 전적</div>
              <button className="lx-btn lx-btn--ghost" style={{ padding: '4px 10px', fontSize: 10 }}>전체보기 →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recent.map((r, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 60px 50px 1fr 80px',
                  padding: '10px 12px',
                  background: 'var(--lx-bg-1)',
                  borderRadius: 'var(--r-sm)',
                  alignItems: 'center',
                  fontSize: 12,
                }}>
                  <span className="lx-mono" style={{ color: 'var(--lx-text-muted)' }}>{r.date}</span>
                  <span style={{ color: 'var(--lx-text-dim)' }}>{r.mode}</span>
                  <span style={{
                    fontFamily: 'var(--lx-font-display)',
                    fontSize: 18,
                    color: r.rank === 1 ? 'var(--lx-gold-bright)' : 'var(--lx-text)',
                  }}>{r.rank === 1 ? '🥇' : `#${r.rank}`}</span>
                  <span style={{ color: 'var(--lx-text-muted)', fontSize: 11 }}>vs {r.vs}{r.penalty && <span style={{ color: 'var(--lx-sun)', marginLeft: 6 }}>2 페널티</span>}</span>
                  <span style={{
                    textAlign: 'right',
                    fontFamily: 'var(--lx-font-num)',
                    fontWeight: 600,
                    color: r.change > 0 ? '#5DDA9E' : 'var(--lx-sun)',
                  }}>{r.change > 0 ? '+' : ''}{r.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen });
