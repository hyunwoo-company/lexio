/* In-game main play screen — table, hand, center field, controls */

const { useState, useMemo } = React;

// Compact player seat (face-down tiles, name, timer ring, chip count)
function PlayerSeat({ player, position = 'top', size = 'md', compact = false }) {
  const dims = size === 'sm' ? { ava: 36, font: 11, tilew: 14 } : { ava: 44, font: 12, tilew: 18 };
  const isTurn = player.isTurn;
  const tilesShown = Math.min(player.tilesLeft, 13);

  return (
    <div className="seat" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      opacity: player.passed ? 0.45 : 1,
    }}>
      {/* Face-down tile fan — actual Tile components for visual consistency */}
      {!compact && (
        <div className="seat__tiles" style={{
          display: 'flex',
          gap: size === 'sm' ? 3 : 4,
          marginBottom: 2,
          padding: size === 'sm' ? '6px 8px 10px' : '7px 10px 12px',
          borderRadius: 10,
          background: 'rgba(0,0,0,0.18)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35), 0 6px 12px rgba(0,0,0,0.25)',
        }}>
          {Array.from({ length: tilesShown }).map((_, i) => (
            <Tile key={i} faceDown size={size === 'sm' ? 'sm' : 'sm'} n={1} s="sun" />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        {/* Avatar with optional turn ring */}
        <div style={{ position: 'relative' }}>
          <div className="lx-avatar" style={{
            width: dims.ava,
            height: dims.ava,
            borderColor: isTurn ? 'var(--lx-gold-bright)' : (player.isMe ? '#2DBA6F' : 'var(--lx-line)'),
            boxShadow: isTurn ? '0 0 16px rgba(242, 200, 120, 0.6)' : 'none',
            fontSize: dims.ava * 0.42,
            background: player.isMe ? 'linear-gradient(135deg, #1A4030, #0A2018)' : 'linear-gradient(135deg, #3A2D1A, #1A1408)',
          }}>
            {player.avatar}
          </div>
          {/* Tile count bubble */}
          <div style={{
            position: 'absolute',
            bottom: -4,
            right: -6,
            background: '#0A0F0D',
            color: 'var(--lx-gold-bright)',
            fontFamily: 'var(--lx-font-num)',
            fontSize: 11,
            fontWeight: 600,
            padding: '1px 5px',
            borderRadius: 8,
            border: '1px solid var(--lx-line-strong)',
            minWidth: 18,
            textAlign: 'center',
            lineHeight: 1.2,
          }}>{player.tilesLeft}</div>
        </div>

        {!compact && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <div style={{
              fontSize: dims.font,
              fontWeight: 600,
              color: isTurn ? 'var(--lx-gold-bright)' : 'var(--lx-text)',
              whiteSpace: 'nowrap',
            }}>{player.name}</div>
            <div className="lx-mono" style={{ fontSize: 10, color: 'var(--lx-text-dim)' }}>
              💰 {player.chips}
            </div>
          </div>
        )}
      </div>

      {/* Status pill */}
      {(isTurn || player.passed || player.lastAction) && !compact && (
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: 999,
          background: isTurn ? 'rgba(242, 200, 120, 0.15)' : 'rgba(255,255,255,0.05)',
          color: isTurn ? 'var(--lx-gold-bright)' : 'var(--lx-text-dim)',
          border: `1px solid ${isTurn ? 'var(--lx-gold)' : 'var(--lx-line)'}`,
        }}>
          {isTurn ? '차례' : (player.passed ? '패스' : player.lastAction)}
        </div>
      )}
    </div>
  );
}

// Center field — shows the last play
function CenterField({ tiles, label, prevHistory = [] }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      position: 'relative',
    }}>
      {/* Combination label */}
      <div className="lx-eyebrow" style={{ color: 'var(--lx-gold-bright)', fontSize: 11 }}>
        현재 필드
      </div>

      {/* The played tiles, slightly fanned */}
      <div style={{ display: 'flex', gap: 6, padding: '4px 10px' }}>
        {tiles.map((t, i) => (
          <div key={t.id} style={{
            transform: `rotate(${(i - (tiles.length - 1) / 2) * 4}deg) translateY(${Math.abs(i - (tiles.length - 1) / 2) * 2}px)`,
          }}>
            <Tile n={t.n} s={t.s} size="lg" />
          </div>
        ))}
      </div>

      {/* Combo type */}
      <div style={{
        fontFamily: 'var(--lx-font-display)',
        fontSize: 18,
        color: 'var(--lx-text)',
        letterSpacing: '0.04em',
      }}>{label}</div>

      {/* History trail */}
      {prevHistory.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          fontSize: 10,
          color: 'var(--lx-text-muted)',
          fontFamily: 'var(--lx-font-mono)',
        }}>
          {prevHistory.slice(-3).map((h, i) => (
            <React.Fragment key={i}>
              <span>{h.who}: {h.combo}</span>
              {i < Math.min(prevHistory.length, 3) - 1 && <span style={{ opacity: 0.4 }}>›</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// Round / turn header
function RoundHeader({ round = 3, totalRounds = 5, turnTime = 22, totalTime = 30, currentTurnName = '용현', density = 'comfortable' }) {
  const pct = (turnTime / totalTime) * 100;
  return (
    <div style={{
      position: 'absolute',
      top: density === 'compact' ? 8 : 14,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '8px 18px',
      background: 'rgba(10, 15, 13, 0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--lx-line)',
      borderRadius: 999,
      zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 10, color: 'var(--lx-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Round</span>
        <span style={{ fontFamily: 'var(--lx-font-display)', fontSize: 20, color: 'var(--lx-gold-bright)' }}>{round}</span>
        <span style={{ fontSize: 11, color: 'var(--lx-text-muted)' }}>/ {totalRounds}</span>
      </div>
      <div style={{ width: 1, height: 18, background: 'var(--lx-line)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', width: 60, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: `${pct}%`,
            background: pct < 30 ? 'var(--lx-sun)' : 'var(--lx-gold-bright)',
            transition: 'width 1s linear',
          }} />
        </div>
        <span className="lx-mono" style={{ fontSize: 12, color: pct < 30 ? 'var(--lx-sun)' : 'var(--lx-text)' }}>{turnTime}s</span>
      </div>
      <div style={{ width: 1, height: 18, background: 'var(--lx-line)' }} />
      <div style={{ fontSize: 12, color: 'var(--lx-text-dim)' }}>
        <span style={{ color: 'var(--lx-gold-bright)', fontWeight: 600 }}>{currentTurnName}</span> 차례
      </div>
    </div>
  );
}

// Action bar — pass / play / sort buttons
function ActionBar({ selectedCount, isMyTurn, onPlay, onPass, onSort, sortMode = 'number', density = 'comfortable', recommendation }) {
  const canPlay = isMyTurn && selectedCount > 0 && selectedCount !== 4;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: density === 'compact' ? '6px 14px' : '10px 18px',
      background: 'linear-gradient(180deg, rgba(10,15,13,0.4) 0%, rgba(10,15,13,0.85) 100%)',
      borderTop: '1px solid var(--lx-line)',
    }}>
      {/* Left: sort + recommend */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 10px', fontSize: 11 }} onClick={onSort}>
          {sortMode === 'number' ? '↕ 숫자순' : '↕ 문양순'}
        </button>
        {recommendation && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            border: '1px dashed var(--lx-gold)',
            borderRadius: 6,
            fontSize: 11,
            color: 'var(--lx-gold-bright)',
          }}>
            <span style={{ fontSize: 10 }}>💡</span>
            추천: {recommendation}
          </div>
        )}
      </div>

      {/* Right: pass / play */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {selectedCount === 4 && (
          <span style={{ fontSize: 11, color: 'var(--lx-sun)' }}>⚠ 4개는 낼 수 없습니다</span>
        )}
        {selectedCount > 0 && selectedCount !== 4 && (
          <span style={{ fontSize: 11, color: 'var(--lx-text-dim)' }}>{selectedCount}개 선택됨</span>
        )}
        <button className="lx-btn lx-btn--danger" onClick={onPass} disabled={!isMyTurn} style={{ opacity: isMyTurn ? 1 : 0.4 }}>
          패스
        </button>
        <button
          className="lx-btn lx-btn--primary"
          onClick={onPlay}
          disabled={!canPlay}
          style={{ opacity: canPlay ? 1 : 0.4, fontSize: 14, padding: '10px 22px' }}
        >
          내기 ▸
        </button>
      </div>
    </div>
  );
}

// Reactions / emotes button
function EmoteRail() {
  const emotes = ['👍', '😅', '🔥', '😱', '💀'];
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      padding: 4,
      background: 'rgba(10,15,13,0.85)',
      borderRadius: 999,
      border: '1px solid var(--lx-line)',
    }}>
      {emotes.map(e => (
        <button key={e} style={{
          width: 28, height: 28,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          fontSize: 16,
          cursor: 'pointer',
        }}>{e}</button>
      ))}
    </div>
  );
}

// MyHand — fan of tiles with selection state
function MyHand({ tiles, selectedIds, onToggle, density = 'comfortable', tileSize = 'lg', sortMode = 'number' }) {
  const sorted = useMemo(() => {
    const arr = [...tiles];
    if (sortMode === 'number') {
      arr.sort((a, b) => NUMBER_RANK(a.n) - NUMBER_RANK(b.n) || SUIT_RANK[a.s] - SUIT_RANK[b.s]);
    } else {
      arr.sort((a, b) => SUIT_RANK[b.s] - SUIT_RANK[a.s] || NUMBER_RANK(a.n) - NUMBER_RANK(b.n));
    }
    return arr;
  }, [tiles, sortMode]);

  return (
    <div className="lx-hand" style={{ gap: density === 'compact' ? 1 : 3, padding: density === 'compact' ? '0 8px' : '4px 12px', minHeight: tileSize === 'lg' ? 110 : 90 }}>
      {sorted.map((t) => (
        <Tile
          key={t.id}
          n={t.n}
          s={t.s}
          size={tileSize}
          selected={selectedIds.has(t.id)}
          onClick={() => onToggle(t.id)}
        />
      ))}
    </div>
  );
}

Object.assign(window, {
  PlayerSeat, CenterField, RoundHeader, ActionBar, EmoteRail, MyHand,
});
