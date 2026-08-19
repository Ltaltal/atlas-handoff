import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css';
import { App } from './App';
import { loadThemeName, applyTheme } from './theme';

// Set the theme before first paint so there is no flash of the wrong one.
applyTheme(loadThemeName());

const container = document.getElementById('root');
if (!container) throw new Error('#root container not found in index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
