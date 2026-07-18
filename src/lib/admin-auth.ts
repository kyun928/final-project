const ADMIN_SESSION_KEY = "wisein_admin_session";

export function setAdminSession(token: string) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, token);
}

export function getAdminSession(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_SESSION_KEY);
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminSession());
}
