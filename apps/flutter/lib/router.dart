import 'package:go_router/go_router.dart';
import 'screens/lobby_screen.dart';
import 'screens/room_screen.dart';

final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (ctx, state) => const LobbyScreen()),
    GoRoute(
      path: '/room/:roomId',
      builder: (ctx, state) => RoomScreen(roomId: state.pathParameters['roomId']!),
    ),
  ],
);
