/**
 * 렉시오 멀티플레이어 서버 E2E 봇 테스트
 *
 * 3개의 소켓 클라이언트(봇)로 실제 서버에 접속해 게임 1라운드 완주를 검증.
 * 실행: ts-node apps/server/test/e2e_bot_test.ts
 *
 * 사전 조건: apps/server가 http://localhost:3001 에서 실행 중이어야 함
 */

import { io, Socket } from 'socket.io-client';

const SERVER = 'http://localhost:3001';
const TIMEOUT = 30_000; // 30초

// ── 유틸 ──────────────────────────────────────────────────────────────────

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function createBot(name: string): Socket {
  return io(SERVER, {
    auth: { clientId: `test-bot-${name}-${Date.now()}` },
    autoConnect: false,
  });
}

function onceWithTimeout<T>(socket: Socket, event: string, timeoutMs = TIMEOUT): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`[${event}] 타임아웃 (${socket.id})`)), timeoutMs);
    socket.once(event, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

// ── 메인 테스트 ───────────────────────────────────────────────────────────

async function runE2ETest() {
  console.log('🃏 렉시오 E2E 봇 테스트 시작\n');

  const bot1 = createBot('bot1');
  const bot2 = createBot('bot2');
  const bot3 = createBot('bot3');

  try {
    // ── 연결 ──
    bot1.connect(); bot2.connect(); bot3.connect();
    await Promise.all([
      onceWithTimeout(bot1, 'connect'),
      onceWithTimeout(bot2, 'connect'),
      onceWithTimeout(bot3, 'connect'),
    ]);
    console.log('✅ 3개 봇 연결 완료');

    // ── 방 생성 (bot1) ──
    bot1.emit('room:create', { playerName: 'Bot1' });
    const { roomId } = await onceWithTimeout<{ roomId: string }>(bot1, 'room:created');
    console.log(`✅ 방 생성: ${roomId}`);

    // ── 방 입장 (bot2, bot3) ──
    bot2.emit('room:join', { roomId, playerName: 'Bot2' });
    bot3.emit('room:join', { roomId, playerName: 'Bot3' });
    await Promise.all([
      onceWithTimeout(bot2, 'room:joined'),
      onceWithTimeout(bot3, 'room:joined'),
    ]);
    console.log('✅ 3명 대기실 입장 완료');

    // ── 게임 시작 (bot1=방장) ──
    bot1.emit('game:start', { roomId });

    // 각 봇이 자신의 패 수신
    const [state1, state2, state3] = await Promise.all([
      onceWithTimeout<{ players: Array<{ id: string; handCount: number }> }>(bot1, 'game:started'),
      onceWithTimeout<{ players: Array<{ id: string; handCount: number }> }>(bot2, 'game:started'),
      onceWithTimeout<{ players: Array<{ id: string; handCount: number }> }>(bot3, 'game:started'),
    ]);
    console.log(`✅ 게임 시작 — 패 분배: Bot1=${state1.players.find(p => p.id === bot1.id)?.handCount ?? 'N/A'}개`);

    // ── 게임 진행: 각 봇이 자기 차례에 첫 타일 1장씩 내거나 패스 ──
    let roundDone = false;
    const bots: [Socket, string][] = [
      [bot1, 'Bot1'],
      [bot2, 'Bot2'],
      [bot3, 'Bot3'],
    ];

    for (const [sock, name] of bots) {
      sock.on('game:stateSync', (state: {
        currentPlayerIndex: number;
        players: Array<{ id: string; hand?: Array<{ id: string }>; handCount: number }>;
        phase: string;
      }) => {
        if (state.phase !== 'playing') return;
        const me = state.players.find((p) => p.id === sock.id);
        const isTurn = state.players[state.currentPlayerIndex]?.id === sock.id;
        if (isTurn && me?.hand && me.hand.length > 0) {
          console.log(`  → ${name} 타일 1장 내기`);
          sock.emit('game:play', { roomId, tileIds: [me.hand[0].id] });
        } else if (isTurn) {
          console.log(`  → ${name} 패스`);
          sock.emit('game:pass', { roomId });
        }
      });

      sock.on('game:roundEnd', () => {
        roundDone = true;
        console.log(`✅ 라운드 종료 감지 (${name})`);
      });
    }

    // 타임아웃까지 라운드 완료 대기
    const start = Date.now();
    while (!roundDone && Date.now() - start < TIMEOUT) {
      await wait(500);
    }

    if (roundDone) {
      console.log('\n🎉 E2E 테스트 성공: 3인 1라운드 완주 확인');
    } else {
      console.error('\n❌ E2E 테스트 실패: 라운드가 완료되지 않음 (타임아웃)');
      process.exit(1);
    }

  } catch (err) {
    console.error('\n❌ E2E 테스트 실패:', err);
    process.exit(1);
  } finally {
    bot1.disconnect();
    bot2.disconnect();
    bot3.disconnect();
  }
}

runE2ETest();
