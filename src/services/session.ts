const SESSION_TOKEN_KEY = 'agently.auth.token';

const hasWindow = () => typeof window !== 'undefined';

export const getSessionToken = (): string | null => {
  if (!hasWindow()) {
    return null;
  }

  return window.localStorage.getItem(SESSION_TOKEN_KEY);
};

export const setSessionToken = (token: string) => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
};

export const clearSessionToken = () => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(SESSION_TOKEN_KEY);
};
