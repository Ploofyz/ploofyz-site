import { describe, expect, it, vi } from 'vitest';
import { restoreSpaRedirect } from '../lib/restoreSpaRedirect';

describe('restoreSpaRedirect', () => {
  it('restores a saved same-origin route and clears it', () => {
    const storage = {
      getItem: vi.fn(() => '/pavillion?month=2026-07#event'),
      removeItem: vi.fn(),
    };
    const history = {
      replaceState: vi.fn(),
    };

    expect(restoreSpaRedirect(storage, history, '/')).toBe(true);
    expect(storage.removeItem).toHaveBeenCalledWith('redirect');
    expect(history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/pavillion?month=2026-07#event',
    );
  });

  it('rejects protocol-relative redirects', () => {
    const storage = {
      getItem: vi.fn(() => '//example.com/path'),
      removeItem: vi.fn(),
    };
    const history = {
      replaceState: vi.fn(),
    };

    expect(restoreSpaRedirect(storage, history, '/')).toBe(false);
    expect(storage.removeItem).toHaveBeenCalledWith('redirect');
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it('does nothing when no redirect is saved', () => {
    const storage = {
      getItem: vi.fn(() => null),
      removeItem: vi.fn(),
    };
    const history = {
      replaceState: vi.fn(),
    };

    expect(restoreSpaRedirect(storage, history, '/')).toBe(false);
    expect(storage.removeItem).not.toHaveBeenCalled();
    expect(history.replaceState).not.toHaveBeenCalled();
  });
});
