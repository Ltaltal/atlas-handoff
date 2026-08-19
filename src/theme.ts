// Theme — light and dark are the same token names with different values, so
// switching is a single attribute on <html>.

export type ThemeName = 'light' | 'dark';

const STORAGE_KEY = 'atlas.handoff.theme';

export function loadThemeName(): ThemeName {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  const prefersDark =
    typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(name: ThemeName): void {
  // The theme's styles are scoped to [data-astryx-theme], and its light/dark
  // values key off [data-theme]. Both live on <html>.
  document.documentElement.dataset.astryxTheme = 'neutral';
  document.documentElement.dataset.theme = name;
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    /* ignore */
  }
}
