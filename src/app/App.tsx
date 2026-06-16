import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { MainApp } from './MainApp';
import { DetailsPage } from './components/DetailsPage';
import {
  CustomCursor,
  ClickParticles,
  PremiumFootballAtmosphere,
  ScrollProgressBar,
} from './components/PremiumEffects';
import { Floating3DElements } from './components/Floating3DElements';

export default function App() {
  return (
    <BrowserRouter>
      <div className="premium-site-shell">
        <PremiumFootballAtmosphere />
        <CustomCursor />
        <ClickParticles />
        <ScrollProgressBar />
        <Floating3DElements />
        <div className="premium-site-content">
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
