// Polyfill window.fetch setter for environments/extensions that reassign window.fetch
try {
  const origFetch = window.fetch;
  let activeFetch = typeof origFetch === 'function' ? origFetch.bind(window) : origFetch;
  const desc = {
    configurable: true,
    enumerable: true,
    get: () => activeFetch,
    set: (fn: typeof fetch) => {
      activeFetch = fn;
    },
  };
  try {
    Object.defineProperty(window, 'fetch', desc);
  } catch {
    try {
      delete (window as unknown as { fetch?: unknown }).fetch;
      Object.defineProperty(window, 'fetch', desc);
    } catch {}
  }
} catch {}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
