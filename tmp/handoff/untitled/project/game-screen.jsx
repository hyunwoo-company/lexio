/* In-game screen layout — table felt + seat arrangement for 3/4/5 players */

const { useState: useStateIG } = React;

// Seat positioning (x%, y%) around an oval table.
// "me" is always at the bottom center.
const SEAT_LAYOUTS = {
  3: [
    { idx: 0, x: 50, y: 88, anchor: 'bottom' },   // me
    { idx: 1, x: 12, y: 28, anchor: 'left' },     // left-top
    { idx: 2, x: 88, y: 28, anchor: 'right' },    // right-top
  ],
  4: [
    { idx: 0, x: 50, y: 88, anchor: 'bottom' },
    { idx: 1, x: 8,  y: 45, anchor: 'left' },
    { idx: 2, x: 50, y: 12, anchor: 'top' },
    { idx: 3, x: 92, y: 45, anchor: 'right' },
  ],
  5: [
    { idx: 0, x: 50, y: 88, anchor: 'bottom' },
    { idx: 1, x: 10, y: 56, anchor: 'left' },
    { idx: 2, x: 25, y: 14, anchor: 'top' },
    { idx: 3, x: 75, y: 14, anchor: 'top' },
    { idx: 4, x: 90, y: 56, anchor: 'right' },
  ],
};

function GameScreen({
  playerCount = 4,
  density = 'comfortable',
  showRecommend = true,
  showEmotes = true,
  variant = 'oval', // 'oval' | 'flat'
  tileSize = 'lg',
  width = 1280,
  height = 760,
  showChat = false,
}) {
  const players = PLAYERS_BY_COUNT[playerCount];
  const myHand = HAND_BY_COUNT[playerCount]();
  const [selected, setSelected] = useStateIG(() => new Set(['9-moon', '9-star']));
  const [sortMode, setSortMode] = useStateIG('number');

  const seats = SEAT_LAYOUTS[playerCount];
  const handHeight = tileSize === 'xl' ? 150 : tileSize === 'lg' ? 120 : 90;
  const handBottomPad = density === 'compact' ? 56 : 70;

  return (
    <div className="lx-screen lx-felt" style={{ width, height, fontSize: density === 'compact' ? 13 : 14 }}>
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Round header */}
      <RoundHeader round={3} totalRounds={5} turnTime={22} totalTime={30} currentTurnName={players.find(p => p.isTurn)?.name || '나'} density={density} />

      {/* Top-left: round info + hand history */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        zIndex: 4,
      }}>
        <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 12px', fontSize: 11 }}>≡ 메뉴</button>
        <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 12px', fontSize: 11 }}>📖 족보</button>
      </div>

      {/* Top-right: room info + settings */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'flex-end',
        zIndex: 4,
      }}>
        <div className="lx-mono" style={{ fontSize: 10, color: 'var(--lx-text-dim)' }}>방 #LX-2847</div>
        <button className="lx-btn lx-btn--ghost" style={{ padding: '6px 12px', fontSize: 11 }}>⚙</button>
      </div>

      {/* Oval table outline */}
      {variant === 'oval' && (
        <div style={{
          position: 'absolute',
          left: '12%',
          right: '12%',
          top: '22%',
          bottom: `${handBottomPad + handHeight + 80}px`,
          borderRadius: '50% / 40%',
          border: '2px solid rgba(212, 166, 86, 0.25)',
          background: 'radial-gradient(ellipse at center, rgba(30, 92, 70, 0.6) 0%, rgba(14, 58, 44, 0.3) 70%, transparent 100%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 0 80px rgba(0,0,0,0.4)',
        }}>
          {/* Inner gold pinstripe */}
          <div style={{
            position: 'absolute', inset: 18,
            border: '1px solid rgba(212, 166, 86, 0.12)',
            borderRadius: '50% / 40%',
          }} />
        </div>
      )}

      {/* Center field */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '46%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}>
        <CenterField tiles={SAMPLE_FIELD} label={SAMPLE_FIELD_LABEL} prevHistory={SAMPLE_HISTORY} />
      </div>

      {/* Player seats */}
      {players.map((player, i) => {
        const seat = seats[i];
        if (!seat) return null;
        return (
          <div key={player.id} style={{
            position: 'absolute',
            left: `${seat.x}%`,
            top: `${seat.y}%`,
            transform: 'translate(-50%, -50%)',
            display: player.isMe ? 'none' : 'block', // me handled below
            zIndex: 3,
          }}>
            <PlayerSeat player={player} position={seat.anchor} size={density === 'compact' ? 'sm' : 'md'} />
          </div>
        );
      })}

      {/* Bottom: my hand region */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 4,
      }}>
        {/* My identity strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 18px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,15,13,0.6) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PlayerSeat player={{ ...players[0], tilesLeft: myHand.length }} compact size="sm" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{players[0].name}</div>
              <div style={{ display: 'flex', gap: 6, fontSize: 10, color: 'var(--lx-text-dim)' }}>
                <span>💰 {players[0].chips}</span>
                <span>·</span>
                <span>{myHand.length}장</span>
                <span>·</span>
                <span>{players[0].rank}</span>
              </div>
            </div>
          </div>
          {showEmotes && <EmoteRail />}
        </div>

        {/* Hand */}
        <div style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)',
        }}>
          <MyHand
            tiles={myHand}
            selectedIds={selected}
            onToggle={(id) => {
              const next = new Set(selected);
              if (next.has(id)) next.delete(id); else next.add(id);
              setSelected(next);
            }}
            density={density}
            tileSize={tileSize}
            sortMode={sortMode}
          />
        </div>

        {/* Action bar */}
        <ActionBar
          selectedCount={selected.size}
          isMyTurn={false}  // It's "용현"'s turn in mock; toggle for variant
          onPlay={() => {}}
          onPass={() => {}}
          onSort={() => setSortMode(sortMode === 'number' ? 'suit' : 'number')}
          sortMode={sortMode}
          density={density}
          recommendation={showRecommend ? '9 페어' : null}
        />
      </div>
    </div>
  );
}

Object.assign(window, { GameScreen });
