import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return <div>Appointment Booking — Milestone 0 placeholder</div>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
