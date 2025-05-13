import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { App } from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

// dinamyc add favicon
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/x-icon';
link.href = '/src/assets/favicon.ico';
document.head.appendChild(link);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
