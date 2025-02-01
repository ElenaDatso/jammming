import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import 'normalize.css';
import './index.scss';
import App from './App.tsx';
import './components/api/SpotifyLogin.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/authorized" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
