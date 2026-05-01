/* Waiting room (after entering a room, before game starts) */

function WaitingRoomScreen({ width = 1280, height = 800 }) {
  const seats = [
    { idx: 0, ready: true, host: true, name: '용현', avatar: '용', rank: '대전' },
    { idx: 1, ready: true, name: '나', avatar: '나', isMe: true, rank: '서울' },
    { idx: 2, ready: false, name: 'NeoTaco', avatar: 'N', rank: '부산' },
    { idx: 3, empty: true },
  ];

  return (
    <div className="lx-screen" style={{ width, height, background: 'var(--lx-bg-0)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid var(--lx-line)',
        background: 'linear-gradient(180deg, var(--lx-bg-1) 0%, var(--lx-bg-0) 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 12px', fontSize: 11 }}>← 로비</button>
          <div>
            <div style={{ fontFamily: 'var(--lx-font-display)', fontSize: 22, color: 'var(--lx-text)' }}>주말의 한판</div>
            <div className="lx-mono" style={{ fontSize: 11, color: 'var(--lx-text-muted)' }}>방 #LX-2847 · 4인전 · 판돈 100</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="lx-btn lx-btn--ghost" style={{ fontSize: 12 }}>📋 초대 링크</button>
          <button className="lx-btn lx-btn--ghost" style={{ fontSize: 12 }}>⚙ 방 설정</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Seats */}
        <main style={{ flex: 1, padding: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 16 }}>
          {seats.map((s, i) => (
            <div key={i} className="lx-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 22,
              borderColor: s.isMe ? 'var(--lx-moon)' : (s.empty ? 'var(--lx-line-subtle)' : 'var(--lx-line)'),
              background: s.empty ? 'transparent' : undefined,
              borderStyle: s.empty ? 'dashed' : 'solid',
            }}>
              {s.empty ? (
                <>
                  <div style={{ fontSize: 36, color: 'var(--lx-text-faint)' }}>＋</div>
                  <div style={{ color: 'var(--lx-text-muted)', fontSize: 13 }}>빈 자리 · 친구 초대</div>
                  <button className="lx-btn lx-btn--ghost" style={{ fontSize: 11 }}>+ AI 추가</button>
                </>
              ) : (
                <>
                  <div className="lx-avatar" style={{ width: 64, height: 64, fontSize: 24, borderColor: s.isMe ? 'var(--lx-moon)' : 'var(--lx-gold)' }}>
                    {s.avatar}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--lx-text)', marginBottom: 2 }}>
                      {s.name}{s.host && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--lx-gold-bright)' }}>👑 방장</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--lx-text-dim)' }}>{s.rank} · 257승 · 승률 54%</div>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 999,
                    background: s.ready ? 'rgba(45, 186, 111, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: s.ready ? '#5DDA9E' : 'var(--lx-text-muted)',
                    border: `1px solid ${s.ready ? 'rgba(45,186,111,0.4)' : 'var(--lx-line)'}`,
                  }}>{s.ready ? '✓ 준비 완료' : '대기중...'}</div>
                </>
              )}
            </div>
          ))}
        </main>

        {/* Right: chat / settings */}
        <aside style={{ width: 320, borderLeft: '1px solid var(--lx-line)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 18, borderBottom: '1px solid var(--lx-line)' }}>
            <div className="lx-eyebrow" style={{ marginBottom: 10 }}>방 설정</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lx-text-dim)' }}>
                <span>모드</span><span style={{ color: 'var(--lx-text)' }}>4인전 (1~13)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lx-text-dim)' }}>
                <span>라운드</span><span style={{ color: 'var(--lx-text)' }}>5라운드</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lx-text-dim)' }}>
                <span>턴 시간</span><span style={{ color: 'var(--lx-text)' }}>30초</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lx-text-dim)' }}>
                <span>2 페널티</span><span style={{ color: 'var(--lx-gold-bright)' }}>적용 (×2)</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
            <div className="lx-eyebrow" style={{ marginBottom: 4 }}>채팅</div>
            {[
              { who: '용현', msg: '안녕하세요~', mine: false },
              { who: '나', msg: 'ㅎㅇ', mine: true },
              { who: 'NeoTaco', msg: '오늘 잘 부탁드립니다', mine: false },
              { who: '시스템', msg: '도윤님이 입장하셨습니다', system: true },
            ].map((m, i) => (
              <div key={i} style={{
                fontSize: 12,
                color: m.system ? 'var(--lx-text-muted)' : 'var(--lx-text)',
                fontStyle: m.system ? 'italic' : 'normal',
                alignSelf: m.mine ? 'flex-end' : 'flex-start',
                background: m.mine ? 'rgba(45, 186, 111, 0.12)' : (m.system ? 'transparent' : 'var(--lx-bg-2)'),
                padding: m.system ? '2px 0' : '6px 10px',
                borderRadius: 8,
                maxWidth: '85%',
              }}>
                {!m.system && <span style={{ color: 'var(--lx-gold-bright)', fontSize: 11, marginRight: 6 }}>{m.who}</span>}
                {m.msg}
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: '1px solid var(--lx-line)' }}>
            <input placeholder="메시지 입력..." style={{
              width: '100%',
              background: 'var(--lx-bg-1)',
              border: '1px solid var(--lx-line)',
              color: 'var(--lx-text)',
              padding: '8px 12px',
              borderRadius: 'var(--r-md)',
              fontSize: 12,
            }} />
          </div>
        </aside>
      </div>

      {/* Footer: ready / start */}
      <footer style={{
        padding: '14px 28px',
        borderTop: '1px solid var(--lx-line)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--lx-bg-1)',
      }}>
        <div style={{ fontSize: 12, color: 'var(--lx-text-dim)' }}>2/4명 준비 완료 · 1명 더 필요</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="lx-btn">방 나가기</button>
          <button className="lx-btn lx-btn--primary" style={{ padding: '12px 28px', fontSize: 14 }}>준비 완료 ✓</button>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { WaitingRoomScreen });
