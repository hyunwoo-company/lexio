# TODOLIST

## 완료
- [x] Phase 0: Turborepo 모노레포 초기화
- [x] Phase 1: game-logic 코어 구현 + 단위 테스트 (36개)
- [x] Phase 2: Node.js + Socket.io 백엔드
- [x] Phase 3: Next.js 웹 UI + Socket 연동

---

## 진행 예정

### Phase 4: 웹 배포
- [ ] Vercel에 `apps/web` 배포
- [ ] Railway에 `apps/server` 배포
- [ ] 환경변수 설정 (`NEXT_PUBLIC_SERVER_URL`)
- [ ] 실제 멀티플레이 통합 테스트

### Phase 5: Flutter 앱 — 게임 로직 구현 ✅ 완료
- [x] `apps/flutter` 프로젝트 초기화 (Flutter 3.38.7)
- [x] Dart로 게임 로직 재구현 (`lib/game/`)
  - [x] `models/` — Tile, TileCombination, GameState
  - [x] `constants.dart` — NUMBER_RANK, SUIT_RANK, COMBINATION_RANK
  - [x] `comparator.dart` — 타일/조합 비교
  - [x] `validator.dart` — 조합 판별 (스트레이트 1·2 예외 포함)
  - [x] `can_play.dart` — 낼 수 있는지 검사
- [x] `pubspec.yaml` 의존성 설정 (socket_io_client, flutter_riverpod, go_router)

### Phase 6: Flutter 앱 — UI 구현 ✅ 완료
- [x] Socket.io 서버 연결 (`lib/services/socket_service.dart`)
- [x] 로비 화면 (`lobby_screen.dart`)
  - [x] 방 만들기 / 방 입장
- [x] 대기실 화면 (`room_screen.dart`)
  - [x] 플레이어 목록, 게임 시작 버튼, 방코드 탭으로 복사
- [x] 게임 화면 (`game_screen.dart`)
  - [x] 타일 위젯 (문양별 색상, 선택 시 위로 올라감)
  - [x] 내 손패 (탭으로 선택/해제)
  - [x] 상대 플레이어 영역 (뒤집힌 타일 개수)
  - [x] 중앙 플레이 영역 (마지막 낸 패)
  - [x] 내기 / 패스 버튼
- [x] 점수 화면 (`score_screen.dart`)
  - [x] 칩 교환 내역, 페널티 표시
  - [x] 다음 라운드 준비 버튼

### Phase 7: 통합 테스트 및 폴리싱
- [ ] 웹 ↔ Flutter 크로스 플레이 테스트
- [ ] 연결 끊김 처리 검증
- [ ] 타일 선택 애니메이션 (Flutter: AnimatedContainer)
- [ ] 효과음 추가
- [ ] 모바일 반응형 웹 개선

### Phase 8: 앱 배포 (선택)
- [ ] Android APK 빌드
- [ ] iOS 빌드 (Mac 필요)
- [ ] App Store / Play Store 배포
