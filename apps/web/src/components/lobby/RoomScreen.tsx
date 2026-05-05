'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket, useSocket } from '@/hooks/useSocket';
import { useGameStore, type RoomInfo } from '@/store/gameStore';
import { GameBoard } from '@/components/game/GameBoard';
import { getClientId, loadSession, clearSession } from '@/lib/clientId';

interface RoomScreenProps {
  roomId: string;
}

const MAX_SEATS = 5;

export function RoomScreen({ roomId }: RoomScreenProps) {
  useSocket();
  const router = useRouter();
  const { myId, gameState, roomInfo: initialRoomInfo, setRoomInfo, setRoom, reset } = useGameStore();
  const [room, setRoomLocal] = useState<RoomInfo | null>(initialRoomInfo);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const reconnectAttempted = useRef(false);

  const updateRoom = (r: RoomInfo) => {
    setRoomLocal(r);
    setRoomInfo(r);
  };

  const handleLeave = () => {
    if (!confirm('정말 나가시겠습니까? 게임 중이라면 인원 부족으로 종료될 수 있습니다.')) return;
    const socket = getSocket();
    socket.emit('room:leave', { roomId });
    clearSession();
    reset();
    router.push('/');
  };

  // 새로고침 후 재연결 처리
  useEffect(() => {
    if (reconnectAttempted.current) return;
    reconnectAttempted.current = true;

    const socket = getSocket();

    const storedMyId = useGameStore.getState().myId;
    if (!storedMyId) {
      const session = loadSession();
      if (session && session.roomId === roomId) {
        const clientId = getClientId();
        setRoom(roomId, clientId, session.playerName);

        const doReconnect = () => socket.emit('room:reconnect', { roomId });
        if (socket.connected) {
          doReconnect();
        } else {
          if (!socket.connected) socket.connect();
          socket.once('connect', doReconnect);
        }
      }
    }
  }, [roomId, setRoom]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('room:updated', ({ room: r }: { room: RoomInfo }) => updateRoom(r));
    socket.on('room:joined', ({ room: r }: { room: RoomInfo }) => updateRoom(r));

    return () => {
      socket.off('room:updated');
      socket.off('room:joined');
    };
  }, []);

  const handleStart = () => {
    const socket = getSocket();
    socket.emit('game:start', { roomId });
  };

  // 게임 시작됨
  if (gameState?.phase === 'playing' || gameState?.phase === 'scoring') {
    return <GameBoard />;
  }

  const players = room?.players ?? [];
  const isHost = players[0]?.id === myId;
  const playerCount = room?.playerCount ?? players.length;
  const canStart = playerCount >= 3;
  const emptySeatCount = Math.max(0, MAX_SEATS - playerCount);
  const emptySeats = Array.from({ length: emptySeatCount });

  const inviteUrl = (() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    return `${origin}/?roomId=${roomId}`;
  })();

  const showMsg = (msg: string) => {
    setCopyMsg(msg);
    setTimeout(() => setCopyMsg(null), 2000);
  };

  const handleShare = async () => {
    const shareText = `FGG 게임에 초대합니다!\n방 코드: ${roomId}\n${inviteUrl}`;
    // Web Share API (모바일 우선)
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title: 'FGG 게임 초대',
          text: shareText,
          url: inviteUrl,
        });
        return;
      } catch {/* user cancel */}
    }
    // 클립보드 fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        showMsg('초대 링크가 복사되었습니다');
        return;
      } catch {/* noop */}
    }
    showMsg('수동으로 코드를 복사해 주세요');
  };

  const copyCode = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(roomId);
        showMsg('방 코드가 복사되었습니다');
      } catch {/* noop */}
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--fgg-bg-0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 20px 28px',
        gap: 28,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 골드 비네트 */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at top, rgba(212, 166, 86, 0.10) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* 좌상단 나가기 */}
      <button
        onClick={handleLeave}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 2,
          background: 'rgba(10,15,13,0.7)',
          border: '1px solid var(--fgg-line)',
          color: 'var(--fgg-text-dim)',
          padding: '8px 14px',
          borderRadius: 999,
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'inherit',
          letterSpacing: '0.04em',
          backdropFilter: 'blur(6px)',
        }}
      >
        ← 나가기
      </button>

      {/* 헤더 */}
      <header
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 880,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          textAlign: 'center',
        }}
      >
        <div className="fgg-eyebrow">Waiting Room</div>
        <h1
          className="fgg-display"
          style={{
            fontSize: 44,
            margin: 0,
            color: 'var(--fgg-gold-bright)',
            letterSpacing: '0.06em',
            textShadow: '0 0 24px rgba(242, 200, 120, 0.35)',
          }}
        >
          대기실
        </h1>
        <p style={{ fontSize: 13, color: 'var(--fgg-text-dim)', margin: 0 }}>
          사신수 타일 × 포커 족보 클라이밍
        </p>
      </header>

      {/* 방 코드 패널 */}
      <section
        className="fgg-panel"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 520,
          padding: '22px 26px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div className="fgg-eyebrow" style={{ color: 'var(--fgg-gold)' }}>
          Room Code
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', 'Menlo', monospace",
            fontSize: 40,
            letterSpacing: '0.32em',
            fontWeight: 700,
            color: 'var(--fgg-gold-bright)',
            textShadow: '0 0 18px rgba(242, 200, 120, 0.35)',
            paddingLeft: '0.32em',
          }}
        >
          {roomId}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={copyCode}
            className="fgg-btn"
            style={{ padding: '6px 14px', fontSize: 12 }}
          >
            📋 코드 복사
          </button>
          <button
            onClick={handleShare}
            className="fgg-btn fgg-btn--primary"
            style={{ padding: '6px 14px', fontSize: 12 }}
          >
            🔗 친구 초대
          </button>
        </div>
        {copyMsg && (
          <div style={{
            fontSize: 11,
            color: 'var(--fgg-gold-bright)',
            marginTop: 4,
            fontStyle: 'italic',
          }}>
            ✓ {copyMsg}
          </div>
        )}
      </section>

      {/* 참가자 그리드 */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 880,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div className="fgg-eyebrow">Players</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            {room?.mode && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: `1px solid ${room.mode === 'full' ? 'var(--fgg-jujak)' : 'var(--fgg-line-strong)'}`,
                  color: room.mode === 'full' ? 'var(--fgg-jujak)' : 'var(--fgg-gold-bright)',
                  background: room.mode === 'full' ? 'rgba(200,50,61,0.1)' : 'rgba(212,166,86,0.08)',
                }}
                title={room.mode === 'full' ? '전체 모드 (1~15 모든 인원)' : '기본 모드 (인원수별)'}
              >
                {room.mode === 'full' ? '전체' : '기본'}
              </span>
            )}
            <div
              style={{
                fontFamily: 'var(--fgg-font-num)',
                fontSize: 16,
                color: 'var(--fgg-text-dim)',
              }}
            >
              <span style={{ color: 'var(--fgg-gold-bright)' }}>{playerCount}</span> / {MAX_SEATS}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 14,
          }}
        >
          {players.map((p, i) => {
            const isMe = p.id === myId;
            const host = i === 0;
            const initial = p.name?.charAt(0) ?? '?';

            return (
              <div
                key={p.id}
                className="fgg-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  padding: '20px 16px',
                  borderColor: isMe ? 'var(--fgg-gold)' : 'var(--fgg-line)',
                  boxShadow: isMe
                    ? '0 0 24px rgba(212, 166, 86, 0.25), 0 12px 40px rgba(0,0,0,0.5)'
                    : undefined,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3A2D1A, #1A1408)',
                    border: `2px solid ${isMe ? 'var(--fgg-gold-bright)' : 'var(--fgg-gold)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--fgg-font-display)',
                    fontWeight: 600,
                    fontSize: 26,
                    color: 'var(--fgg-gold-bright)',
                    boxShadow: '0 0 12px rgba(212, 166, 86, 0.25)',
                  }}
                >
                  {initial}
                </div>

                <div style={{ textAlign: 'center', minHeight: 38 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--fgg-text)',
                      marginBottom: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    {p.name}
                    {host && (
                      <span style={{ fontSize: 11, color: 'var(--fgg-gold-bright)' }}>
                        👑 방장
                      </span>
                    )}
                  </div>
                  {isMe && (
                    <div style={{ fontSize: 11, color: 'var(--fgg-gold)' }}>(나)</div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '4px 14px',
                    borderRadius: 999,
                    background: 'rgba(45, 186, 111, 0.15)',
                    color: '#5DDA9E',
                    border: '1px solid rgba(45, 186, 111, 0.4)',
                  }}
                >
                  ✓ 입장 완료
                </div>
              </div>
            );
          })}

          {emptySeats.map((_, i) => (
            <div
              key={`empty-${i}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '20px 16px',
                minHeight: 188,
                border: '1px dashed rgba(212, 166, 86, 0.25)',
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.015)',
              }}
            >
              <div style={{ fontSize: 36, color: 'var(--fgg-text-muted)' }}>＋</div>
              <div style={{ color: 'var(--fgg-text-muted)', fontSize: 12, textAlign: 'center' }}>
                빈 자리
                <br />
                친구 초대
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 12,
            color: canStart ? 'var(--fgg-text-dim)' : 'var(--fgg-gold)',
            textAlign: 'center',
            marginTop: 4,
            fontStyle: 'italic',
          }}
        >
          {canStart
            ? `${playerCount}명 입장 · 게임 시작 가능`
            : `최소 3명 필요 · 현재 ${playerCount}명`}
        </div>
      </section>

      {/* 푸터: 시작 버튼 */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          justifyContent: 'center',
          marginTop: 'auto',
        }}
      >
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="fgg-btn fgg-btn--primary"
            style={{
              padding: '14px 36px',
              fontSize: 16,
              letterSpacing: '0.08em',
              fontFamily: 'var(--fgg-font-display)',
              minWidth: 240,
            }}
          >
            {canStart ? '게임 시작 ▸' : '대기 중...'}
          </button>
        ) : (
          <p
            style={{
              fontSize: 13,
              color: 'var(--fgg-text-dim)',
              textAlign: 'center',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            방장이 게임을 시작할 때까지 기다려 주세요
          </p>
        )}
      </footer>
    </div>
  );
}
