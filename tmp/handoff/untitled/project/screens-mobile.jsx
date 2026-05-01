/* Mobile screens — landscape (in-game) and portrait (lobby/menu) */

function MobileLandscapeIngame({ width = 844, height = 390 }) {
  // iPhone 14 Pro landscape: 844 x 390 (excluding bezel)
  const players = PLAYERS_4;
  const myHand = HAND_BY_COUNT[4]();
  const [sel, setSel] = React.useState(new Set(['9-moon', '9-star']));
  const [sortMode, setSortMode] = React.useState('number');

  return (
    <div className="lx-screen lx-felt" style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />

      {/* Top compact header */}
      <div style={{
        position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
        padding: '4px 12px', background: 'rgba(10, 15, 13, 0.85)',
        backdropFilter: 'blur(10px)', border: '1px solid var(--lx-line)',
        borderRadius: 999, display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, zIndex: 5,
      }}>
        <span style={{ color: 'var(--lx-gold-bright)', fontFamily: 'var(--lx-font-display)' }}>R 3/5</span>
        <span style={{ color: 'var(--lx-text-faint)' }}>|</span>
        <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: '70%', height: '100%', background: 'var(--lx-gold-bright)' }} />
        </div>
        <span className="lx-mono" style={{ fontSize: 9 }}>22s · 용현</span>
      </div>

      {/* Top-left menu */}
      <div style={{ position: 'absolute', top: 6, left: 8, display: 'flex', gap: 4, zIndex: 5 }}>
        <button className="lx-btn lx-btn--ghost" style={{ padding: '4px 8px', fontSize: 9 }}>≡</button>
        <button className="lx-btn lx-btn--ghost" style={{ padding: '4px 8px', fontSize: 9 }}>📖</button>
      </div>

      {/* Other 3 seats */}
      <div style={{ position: 'absolute', top: 38, left: 12, zIndex: 3 }}>
        <PlayerSeat player={players[1]} size="sm" />
      </div>
      <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 3, marginTop: 16 }}>
        <PlayerSeat player={players[2]} size="sm" />
      </div>
      <div style={{ position: 'absolute', top: 38, right: 12, zIndex: 3 }}>
        <PlayerSeat player={players[3]} size="sm" />
      </div>

      {/* Center field */}
      <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {SAMPLE_FIELD.map((t, i) => (
              <div key={t.id} style={{ transform: `rotate(${(i - 0.5) * 4}deg)` }}>
                <Tile n={t.n} s={t.s} size="md" />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--lx-gold-bright)', fontFamily: 'var(--lx-font-display)' }}>{SAMPLE_FIELD_LABEL}</div>
        </div>
      </div>

      {/* Bottom hand */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4, padding: '4px 8px 6px', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))' }}>
        <div className="lx-hand" style={{ gap: 1, padding: '2px 4px' }}>
          {[...myHand].sort((a, b) => NUMBER_RANK(a.n) - NUMBER_RANK(b.n) || SUIT_RANK[a.s] - SUIT_RANK[b.s]).map(t => (
            <Tile key={t.id} n={t.n} s={t.s} size="md" selected={sel.has(t.id)} onClick={() => {
              const next = new Set(sel);
              next.has(t.id) ? next.delete(t.id) : next.add(t.id);
              setSel(next);
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, padding: '0 4px' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="lx-btn lx-btn--ghost" style={{ padding: '3px 8px', fontSize: 9 }}>↕ {sortMode === 'number' ? '숫자' : '문양'}</button>
            <span style={{ fontSize: 10, color: 'var(--lx-gold-bright)' }}>💡 9 페어</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="lx-btn lx-btn--danger" style={{ padding: '5px 12px', fontSize: 10 }}>패스</button>
            <button className="lx-btn lx-btn--primary" style={{ padding: '5px 14px', fontSize: 11 }}>내기 ▸</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobilePortraitLobby({ width = 390, height = 780 }) {
  const rooms = [
    { name: '주말의 한판', host: '용현', count: '3/4', mode: '4인전', stake: 100 },
    { name: '초보환영', host: 'NeoTaco', count: '2/3', mode: '3인전', stake: 50 },
    { name: '점심시간 빠른판', host: '소영', count: '3/4', mode: '4인전', stake: 100 },
    { name: '실력자 모집', host: '도윤', count: '1/4', mode: '4인전', stake: 300 },
  ];

  return (
    <div className="lx-screen" style={{ width, height, background: 'var(--lx-bg-0)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '14px 16px', borderBottom: '1px solid var(--lx-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LogoMark size={26} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="lx-chip" style={{ fontSize: 10 }}>💰 28</span>
          <div className="lx-avatar" style={{ width: 30, height: 30, fontSize: 12 }}>나</div>
        </div>
      </header>

      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button className="lx-btn lx-btn--primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '10px' }}>＋ 방 만들기</button>
          <button className="lx-btn" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '10px' }}>⚡ 빠른시작</button>
        </div>

        {/* Tab strip */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1px solid var(--lx-line)' }}>
          {['전체', '3인', '4인', '5인'].map((t, i) => (
            <button key={t} style={{
              padding: '8px 14px',
              border: 'none',
              background: 'transparent',
              color: i === 0 ? 'var(--lx-gold-bright)' : 'var(--lx-text-dim)',
              fontSize: 12,
              fontWeight: i === 0 ? 600 : 400,
              borderBottom: i === 0 ? '2px solid var(--lx-gold-bright)' : '2px solid transparent',
              cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rooms.map(r => (
            <div key={r.name} className="lx-panel" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="lx-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{r.host[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--lx-text)' }}>{r.name}</div>
                <div style={{ fontSize: 10, color: 'var(--lx-text-dim)' }}>{r.mode} · 판돈 {r.stake}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--lx-font-num)', fontSize: 16, color: 'var(--lx-gold-bright)' }}>{r.count}</div>
                <div style={{ fontSize: 9, color: '#5DDA9E' }}>대기중</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tabbar */}
      <div style={{ marginTop: 'auto', padding: '8px 0 12px', borderTop: '1px solid var(--lx-line)', display: 'flex', justifyContent: 'space-around', background: 'var(--lx-bg-1)' }}>
        {[
          { label: '로비', icon: '🏠', active: true },
          { label: '친구', icon: '👥' },
          { label: '전적', icon: '📊' },
          { label: '상점', icon: '🛒' },
          { label: '프로필', icon: '👤' },
        ].map(t => (
          <div key={t.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, color: t.active ? 'var(--lx-gold-bright)' : 'var(--lx-text-muted)' }}>
            <div style={{ fontSize: 16 }}>{t.icon}</div>
            <div>{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MobileLandscapeIngame, MobilePortraitLobby });
