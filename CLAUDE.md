# lexio 게임 만들기

@RULES.md 를 참고해서 게임을 만들려고해.
앱으로 하게되면 flutter를 통해 진행할거야

추가적으로 게임룰에 대해 잘 모르겠으면 notebooklm mcp를 통해서 lexio 프로젝트를 보고 룰에 대해 확인해봐

---

## 프로젝트 현황

### 아키텍처
- **모노레포**: Turborepo + pnpm workspaces
- **패키지 매니저**: pnpm
- **플랫폼**: 웹(Next.js) + 앱(Flutter) 동시 지원, 동일 서버에 연결해 크로스 플레이 가능

### 구조
```
lexio/
├── packages/
│   └── game-logic/        # TypeScript 핵심 게임 로직 (서버와 공유)
├── apps/
│   ├── server/            # Node.js + Socket.io 백엔드 (포트 3001)
│   ├── web/               # Next.js 14 프론트엔드 (포트 3000)
│   └── flutter/           # Flutter 앱 (진행 예정)
├── RULES.md
├── TODOLIST.md
└── README.md
```

### 완료된 작업
- [x] Turborepo 모노레포 초기화
- [x] `packages/game-logic` — 게임 로직 코어 구현 (36개 테스트 통과)
  - 타일 서열 비교 (2 > 1 > 15 > ... > 3 / 해 > 달 > 별 > 구름)
  - 조합 판별: 싱글/페어/트리플/스트레이트/플러시/풀하우스/포카드/스트레이트플러시
  - 스트레이트 1·2 예외 처리
  - 점수 계산 (숫자 2 보유 시 2^n 배 페널티)
- [x] `apps/server` — Node.js + Socket.io 백엔드
  - 방 생성/입장/퇴장, 게임 진행, 점수 정산
  - 서버 권위(Server Authoritative) 모델 — 부정행위 방지
- [x] `apps/web` — Next.js 웹 UI
  - 로비 화면 (방 만들기/입장)
  - 대기실 (플레이어 목록, 게임 시작)
  - 게임 보드 (손패, 상대 패, 중앙 플레이 영역, 내기/패스)
  - 라운드 종료 점수판
- [x] `apps/flutter` — Flutter 3.38.7 앱
  - Dart로 게임 로직 재구현 (lib/game/)
  - Socket.io 연결 (socket_io_client)
  - 상태 관리 (flutter_riverpod)
  - 라우팅 (go_router)
  - 로비/대기실/게임/점수 화면 완성

### 진행 예정
- [ ] 통합 테스트 (웹 ↔ Flutter 크로스 플레이)
- [ ] 배포 (Vercel + Railway)
- [ ] 앱 스토어 배포 (선택)

---

## 기술 스택

### 공통
- TypeScript 5.x, pnpm, Turborepo

### 백엔드 (apps/server)
- Node.js, Express, Socket.io 4.x, ts-node-dev

### 웹 프론트엔드 (apps/web)
- Next.js 14 App Router, TailwindCSS, Zustand, Framer Motion, Socket.io-client

### 앱 (apps/flutter)
- Flutter 3.x, Dart, socket_io_client, Riverpod
- **테스트**: Patrol 4.x + Patrol MCP (`patrol`, `patrol_mcp` dev dependency)

---

## E2E 테스트 전략

멀티플레이어 실시간 게임이므로 3개 레이어로 나눠 검증한다.

### 레이어 1 — 게임 로직 단위 테스트 ✅ (완료)
- 위치: `packages/game-logic/`
- 실행: `pnpm test`
- 커버: 타일 서열, 조합 판별, 점수 계산 (36개 테스트)

### 레이어 2 — 서버 멀티플레이어 E2E (봇 스크립트)
- 위치: `apps/server/test/e2e_bot_test.ts`
- 실행: `ts-node apps/server/test/e2e_bot_test.ts` (서버가 3001 포트에서 실행 중이어야 함)
- 커버: 3개 봇 클라이언트로 실제 소켓 연결 → 방 생성/입장 → 게임 시작 → 1라운드 완주 검증
- 이유: 멀티플레이어 게임 플로우와 실시간 상태 동기화는 단일 클라이언트 UI 테스트로 검증 불가

### 레이어 3 — Flutter UI E2E (Patrol + MCP)
- 위치: `apps/flutter/integration_test/`
- 실행: `patrol test --target integration_test/patrol_test.dart`
- 커버: 로비 화면 UI 플로우, 단일 클라이언트 상호작용
- 게임 상태(game:stateSync 이벤트)는 Mock 주입으로 검증
- MCP: `.mcp.json` 설정으로 Claude가 Patrol 도구를 직접 실행·디버깅 가능

### Patrol MCP 설정
- 런처 스크립트: `.claude/run-patrol` (sh, Git Bash 호환)
- MCP 설정 파일: `.mcp.json` (프로젝트 루트, Claude Code 자동 감지)
- `PROJECT_ROOT=./apps/flutter` — Flutter 서브디렉토리 지정
- patrol_cli 전역 설치 필요: `dart pub global activate patrol_cli 4.3.1`
- patrol_cli PATH 추가 필요: `C:\Users\hyunwoo\AppData\Local\Pub\Cache\bin`

### 테스트 파일 구조
```
apps/
├── flutter/
│   └── integration_test/
│       ├── patrol_test.dart          # 진입점 (모든 테스트 묶음)
│       └── tests/
│           ├── lobby_test.dart       # 로비 UI 플로우
│           └── room_test.dart        # 대기실/게임 화면 (TODO: 확장)
└── server/
    └── test/
        └── e2e_bot_test.ts           # 멀티플레이어 봇 E2E

```

---

## 게임 핵심 규칙 요약

- **숫자 서열**: 2 > 1 > 15 > 14 > ... > 3
- **문양 서열**: 해(sun) > 달(moon) > 별(star) > 구름(cloud)
- **낼 수 있는 개수**: 1개 / 2개 / 3개 / 5개 (4개 불가)
- **5개 조합 족보**: 스트레이트 < 플러시 < 풀하우스 < 포카드 < 스트레이트플러시
- **첫 선**: 구름3 보유자
- **점수**: 남은 타일 수 차이만큼 칩 교환, 숫자 2 보유 시 2^n 배 페널티
- **인원별**: 3인(1~9, 12개), 4인(1~13, 13개), 5인(1~15, 12개)
