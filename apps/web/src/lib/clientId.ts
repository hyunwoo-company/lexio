export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('lexio_client_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('lexio_client_id', id);
  }
  return id;
}

export function saveSession(roomId: string, playerName: string): void {
  sessionStorage.setItem('lexio_session', JSON.stringify({ roomId, playerName }));
}

export function loadSession(): { roomId: string; playerName: string } | null {
  try {
    const raw = sessionStorage.getItem('lexio_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem('lexio_session');
}
