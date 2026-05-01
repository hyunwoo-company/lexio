/**
 * crypto.randomUUID()는 secure context(HTTPS/localhost) + 최신 브라우저에서만 동작.
 * Tailscale Funnel 또는 구형 모바일 브라우저에서 미지원이라 fallback 필요.
 */
function randomUUID(): string {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      try {
        return crypto.randomUUID();
      } catch {
        /* secure context 아니어도 try / fallback */
      }
    }
    if (typeof crypto.getRandomValues === 'function') {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      buf[6] = (buf[6] & 0x0f) | 0x40; // v4
      buf[8] = (buf[8] & 0x3f) | 0x80; // variant
      const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    }
  }
  // 마지막 fallback: Math.random 기반 (UUID v4 형식)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('lexio_client_id');
  if (!id) {
    id = randomUUID();
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
