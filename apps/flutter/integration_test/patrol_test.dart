// Patrol E2E 테스트 진입점 (Patrol 4.x)
// 실행: patrol test --target integration_test/patrol_test.dart
// MCP: Claude가 patrol MCP 도구를 통해 직접 실행·디버깅 가능

import 'tests/lobby_test.dart' as lobby;
import 'tests/room_test.dart' as room;

void main() {
  lobby.main();
  room.main();
}
