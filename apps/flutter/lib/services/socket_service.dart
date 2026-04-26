import 'package:socket_io_client/socket_io_client.dart' as io;

const _serverUrl = String.fromEnvironment('SERVER_URL', defaultValue: 'http://localhost:3001');

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  late final io.Socket socket = io.io(
    _serverUrl,
    io.OptionBuilder().setTransports(['websocket']).disableAutoConnect().build(),
  );

  void connect() {
    if (!socket.connected) socket.connect();
  }

  void disconnect() => socket.disconnect();

  void emit(String event, dynamic data) => socket.emit(event, data);

  void on(String event, void Function(dynamic) handler) => socket.on(event, handler);

  void off(String event) => socket.off(event);

  String? get id => socket.id;
  bool get connected => socket.connected;
}
