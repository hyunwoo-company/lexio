/* Interactive playable demo — click tiles to select, click play, see field update */

const { useState: useStateDemo, useMemo: useMemoDemo } = React;

function PlayableDemo({ width = 1280, height = 800 }) {
  const initialHand = HAND_BY_COUNT[4]();
  const [hand, setHand] = useStateDemo(initialHand);
  const [selected, setSelected] = useStateDemo(new Set());
  const [field, setField] = useStateDemo({ tiles: SAMPLE_FIELD, label: SAMPLE_FIELD_LABEL, who: '소영' });
  const [history, setHistory] = useStateDemo([
    { who: '소영', combo: '구름 3' },
    { who: '용현', combo: '5 페어' },
    { who: '나', combo: '7 페어' },
    { who: 'NeoTaco', combo: '패스' },
    { who: 'Mira', combo: '9 페어' },
  ]);
  const [sortMode, setSortMode] = useStateDemo('number');
  const [toast, setToast] = useStateDemo(null);
  const [seatTiles, setSeatTiles] = useStateDemo({ p2: 9, p3: 11, p4: 8, p5: 12 });

  const sorted = useMemoDemo(() => {
    const arr = [...hand];
    if (sortMode === 'number') {
      arr.sort((a, b) => NUMBER_RANK(a.n) - NUMBER_RANK(b.n) || SUIT_RANK[a.s] - SUIT_RANK[b.s]);
    } else {
      arr.sort((a, b) => SUIT_RANK[b.s] - SUIT_RANK[a.s] || NUMBER_RANK(a.n) - NUMBER_RANK(b.n));
    }
    return arr;
  }, [hand, sortMode]);

  // Detect combo of selected tiles
  const selectedTiles = sorted.filter(t => selected.has(t.id));
  const combo = useMemoDemo(() => {
    if (selectedTiles.length === 0) return null;
    if (selectedTiles.length === 4) return { valid: false, label: '4개는 낼 수 없습니다' };
    if (selectedTiles.length === 1) return { valid: true, label: `싱글 · ${SUITS[selectedTiles[0].s].name} ${selectedTiles[0].n}` };
    if (selectedTiles.length === 2) {
      const same = selectedTiles[0].n === selectedTiles[1].n;
      return same ? { valid: true, label: `${selectedTiles[0].n} 페어` } : { valid: false, label: '같은 숫자가 아님' };
    }
    if (selectedTiles.length === 3) {
      const same = selectedTiles.every(t => t.n === selectedTiles[0].n);
      return same ? { valid: true, label: `${selectedTiles[0].n} 트리플` } : { valid: false, label: '같은 숫자가 아님' };
    }
    if (selectedTiles.length === 5) {
      // Simple straight check (numeric only, ignoring 1/2 special)
      const ns = selectedTiles.map(t => t.n).sort((a,b) => a-b);
      const isStraight = ns.every((v, i) => i === 0 || v === ns[i-1] + 1);
      const isFlush = selectedTiles.every(t => t.s === selectedTiles[0].s);
      if (isStraight && isFlush) return { valid: true, label: '스트레이트 플러시' };
      const counts = {};
      ns.forEach(n => counts[n] = (counts[n] || 0) + 1);
      const cv = Object.values(counts).sort((a,b)=>b-a);
      if (cv[0] === 4) return { valid: true, label: '포카드' };
      if (cv[0] === 3 && cv[1] === 2) return { valid: true, label: '풀하우스' };
      if (isFlush) return { valid: true, label: '플러시' };
      if (isStraight) return { valid: true, label: '스트레이트' };
      return { valid: false, label: '유효하지 않은 5장 조합' };
    }
    return null;
  }, [selectedTiles]);

  function toggle(id) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  function play() {
    if (!combo || !combo.valid) return;
    const playedTiles = [...selectedTiles];
    setField({ tiles: playedTiles, label: combo.label, who: '나' });
    setHand(prev => prev.filter(t => !selected.has(t.id)));
    setSelected(new Set());
    setHistory(h => [...h, { who: '나', combo: combo.label }]);
    setToast({ type: 'success', msg: `${combo.label} 성공!` });
    setTimeout(() => setToast(null), 1800);
    // Simulate next player playing
    setTimeout(() => {
      setSeatTiles(s => ({ ...s, p2: Math.max(0, s.p2 - (Math.random() > 0.5 ? 2 : 0)) }));
      setHistory(h => [...h, { who: '용현', combo: '패스' }]);
    }, 1200);
  }

  function pass() {
    setSelected(new Set());
    setHistory(h => [...h, { who: '나', combo: '패스' }]);
    setToast({ type: 'info', msg: '패스했습니다' });
    setTimeout(() => setToast(null), 1500);
  }

  function reset() {
    setHand(initialHand);
    setSelected(new Set());
    setField({ tiles: SAMPLE_FIELD, label: SAMPLE_FIELD_LABEL, who: '소영' });
    setHistory([
      { who: '소영', combo: '구름 3' },
      { who: '용현', combo: '5 페어' },
    ]);
    setSeatTiles({ p2: 9, p3: 11, p4: 8, p5: 12 });
  }

  // Other seats with live tile counts
  const seats = [
    { ...PLAYERS_BY_COUNT[4][1], tilesLeft: seatTiles.p2 },
    { ...PLAYERS_BY_COUNT[4][2], tilesLeft: seatTiles.p3, isTurn: false },
    { ...PLAYERS_BY_COUNT[4][3], tilesLeft: seatTiles.p4 },
  ];

  return (
    <div className="lx-screen lx-felt" style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />

      {/* Demo notice strip */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 10,
        display: 'flex', gap: 8, alignItems: 'center',
        padding: '6px 12px',
        background: 'rgba(45, 186, 111, 0.15)',
        border: '1px solid rgba(45, 186, 111, 0.4)',
        borderRadius: 999,
        fontSize: 11,
        color: '#5DDA9E',
        fontWeight: 600,
      }}>
        <span>● LIVE DEMO</span>
        <span style={{ color: 'var(--lx-text-dim)', fontWeight: 400 }}>타일을 클릭해보세요</span>
      </div>

      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, display: 'flex', gap: 8 }}>
        <button className="lx-btn lx-btn--ghost" onClick={reset} style={{ fontSize: 11, padding: '6px 12px' }}>↻ 리셋</button>
      </div>

      {/* Other seats */}
      <div style={{ position: 'absolute', left: '8%', top: 45, zIndex: 3 }}>
        <PlayerSeat player={seats[0]} size="md" />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 80, transform: 'translateX(-50%)', zIndex: 3 }}>
        <PlayerSeat player={seats[1]} size="md" />
      </div>
      <div style={{ position: 'absolute', right: '8%', top: 45, zIndex: 3 }}>
        <PlayerSeat player={seats[2]} size="md" />
      </div>

      {/* Oval table */}
      <div style={{
        position: 'absolute',
        left: '14%', right: '14%',
        top: '24%', bottom: '34%',
        borderRadius: '50% / 40%',
        border: '2px solid rgba(212, 166, 86, 0.25)',
        background: 'radial-gradient(ellipse at center, rgba(30, 92, 70, 0.6) 0%, rgba(14, 58, 44, 0.3) 70%, transparent 100%)',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
      }} />

      {/* Center field */}
      <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div className="lx-eyebrow" style={{ fontSize: 10 }}>{field.who}님이 냄</div>
          <div style={{ display: 'flex', gap: 6, transition: 'all 300ms' }} key={field.label}>
            {field.tiles.map((t, i) => (
              <div key={`${t.id}-${i}`} style={{
                transform: `rotate(${(i - (field.tiles.length - 1) / 2) * 4}deg)`,
                animation: 'fade-in 280ms ease-out',
              }}>
                <Tile n={t.n} s={t.s} size="lg" />
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: 'var(--lx-font-display)',
            fontSize: 18,
            color: 'var(--lx-gold-bright)',
          }}>{field.label}</div>
          {/* History trail */}
          <div style={{ display: 'flex', gap: 6, fontSize: 10, color: 'var(--lx-text-muted)', fontFamily: 'var(--lx-font-mono)', maxWidth: 600, justifyContent: 'center', flexWrap: 'wrap' }}>
            {history.slice(-5).map((h, i) => (
              <span key={i} style={{ opacity: i === history.slice(-5).length - 1 ? 1 : 0.5 }}>
                {h.who}: {h.combo} {i < history.slice(-5).length - 1 && '›'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '20%',
          transform: 'translate(-50%, -50%)',
          padding: '10px 20px',
          background: toast.type === 'success' ? 'rgba(45, 186, 111, 0.95)' : 'rgba(212, 166, 86, 0.95)',
          color: '#0A0F0D',
          fontWeight: 700,
          fontSize: 14,
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 20,
          animation: 'fade-in 200ms',
        }}>{toast.msg}</div>
      )}

      {/* Bottom: my hand area */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4 }}>
        <div style={{
          padding: '6px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,15,13,0.6) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="lx-avatar" style={{ width: 36, height: 36, fontSize: 14, borderColor: 'var(--lx-moon)', background: 'linear-gradient(135deg, #1A4030, #0A2018)' }}>나</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>나 (이도현)</div>
              <div style={{ fontSize: 10, color: 'var(--lx-text-dim)' }}>💰 28 · {hand.length}장 남음</div>
            </div>
            {combo && (
              <div style={{
                marginLeft: 14,
                padding: '6px 14px',
                background: combo.valid ? 'rgba(45, 186, 111, 0.15)' : 'rgba(230, 57, 70, 0.15)',
                border: `1px solid ${combo.valid ? 'rgba(45,186,111,0.5)' : 'rgba(230,57,70,0.5)'}`,
                borderRadius: 6,
                fontSize: 12,
                color: combo.valid ? '#5DDA9E' : '#FF8088',
              }}>
                {combo.valid ? '✓' : '✕'} {combo.label}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)' }}>
          <div className="lx-hand" style={{ gap: 3, padding: '10px 12px', minHeight: 110 }}>
            {sorted.map(t => (
              <Tile
                key={t.id}
                n={t.n}
                s={t.s}
                size="lg"
                selected={selected.has(t.id)}
                onClick={() => toggle(t.id)}
              />
            ))}
            {hand.length === 0 && (
              <div style={{ padding: 30, color: 'var(--lx-gold-bright)', fontFamily: 'var(--lx-font-display)', fontSize: 24 }}>
                🎉 모든 패를 비웠습니다!
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, padding: '10px 18px',
          background: 'rgba(10,15,13,0.85)',
          borderTop: '1px solid var(--lx-line)',
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => setSortMode(sortMode === 'number' ? 'suit' : 'number')}>
              ↕ {sortMode === 'number' ? '숫자순' : '문양순'}
            </button>
            <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => setSelected(new Set())}>
              선택 해제
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="lx-btn lx-btn--danger" onClick={pass}>패스</button>
            <button
              className="lx-btn lx-btn--primary"
              onClick={play}
              disabled={!combo || !combo.valid}
              style={{ opacity: (!combo || !combo.valid) ? 0.4 : 1, fontSize: 14, padding: '10px 22px' }}
            >
              내기 ▸
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { PlayableDemo });
