const SPA_REDIRECT_KEY = 'redirect';

type RedirectStorage = Pick<Storage, 'getItem' | 'removeItem'>;
type RedirectHistory = Pick<History, 'replaceState'>;

export const restoreSpaRedirect = (
  storage: RedirectStorage = window.sessionStorage,
  history: RedirectHistory = window.history,
  currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`,
) => {
  const redirect = storage.getItem(SPA_REDIRECT_KEY);

  if (!redirect) {
    return false;
  }

  storage.removeItem(SPA_REDIRECT_KEY);

  if (!redirect.startsWith('/') || redirect.startsWith('//') || redirect === currentPath) {
    return false;
  }

  history.replaceState(null, '', redirect);
  return true;
};
