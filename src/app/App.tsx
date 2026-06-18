import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { MainApp } from './MainApp';
import { DetailsPage } from './components/DetailsPage';
import {
  CustomCursor,
  ClickParticles,
  PremiumFootballAtmosphere,
  ScrollProgressBar,
} from './components/PremiumEffects';
import { Floating3DElements } from './components/Floating3DElements';

function AnimatedRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [location.pathname, reduceMotion]);

  const transition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="page-transition-frame"
        initial={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 18, scale: 0.985, filter: 'blur(8px)' }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
        }
        exit={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: -14, scale: 0.992, filter: 'blur(6px)' }
        }
        transition={transition}
      >
        <Routes location={location}>
          <Route path="/" element={<MainApp />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

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
          <AnimatedRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}
