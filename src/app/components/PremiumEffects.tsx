import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';

function FootballMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 14l9 6.5-3.4 10.6H26.4L23 20.5 32 14Z" fill="currentColor" />
      <path d="m23 20.5-10 3.6M41 20.5l10 3.6M26.4 31.1 19 40m18.6-8.9L45 40M19 40l-2 10m28-10 2 10M24 53h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PremiumFootballAtmosphere() {
  return (
    <div className="premium-football-atmosphere" aria-hidden="true">
      <div className="fifa-stadium-beam fifa-stadium-beam-left" />
      <div className="fifa-stadium-beam fifa-stadium-beam-right" />
      <motion.div
        className="premium-football premium-football-one"
        animate={{ y: [0, -18, 0], rotate: [8, 18, 8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <FootballMark />
      </motion.div>
      <motion.div
        className="premium-football premium-football-two"
        animate={{ y: [0, 14, 0], rotate: [-14, -4, -14] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <FootballMark />
      </motion.div>
      <div className="premium-atmosphere-glow premium-atmosphere-glow-one" />
      <div className="premium-atmosphere-glow premium-atmosphere-glow-two" />
    </div>
  );
}

// ── 1. Custom Glowing Cursor ─────────────────────────────────────
export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const trailY = useSpring(cursorY, { stiffness: 80, damping: 20 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(!!(el.closest('button, a, [data-hover]')));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          x: trailX, y: trailY,
          translateX: '-50%', translateY: '-50%',
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          background: 'rgba(200,0,44,0.15)',
          border: '1.5px solid rgba(200,0,44,0.6)',
          transition: 'width 0.2s, height 0.2s',
          scale: clicking ? 0.8 : 1,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorX, y: cursorY,
          translateX: '-50%', translateY: '-50%',
          width: 6, height: 6,
          background: '#C8002C',
          scale: clicking ? 1.5 : 1,
          transition: 'scale 0.1s',
        }}
      />
    </>
  );
}

// ── 2. 3D Tilt Card ──────────────────────────────────────────────
export function TiltCard({
  children, className = '', intensity = 12,
}: {
  children: React.ReactNode; className?: string; intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, []);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative ${className}`}
    >
      {children}
      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          mixBlendMode: 'overlay',
        }}
      />
    </motion.div>
  );
}

// ── 3. Magnetic Button ───────────────────────────────────────────
export function MagneticButton({
  children, className = '', onClick, strength = 0.4,
}: {
  children: React.ReactNode; className?: string; onClick?: () => void; strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <motion.div style={{ x: sx, y: sy }} onClick={onClick} className={className}>
        {children}
      </motion.div>
    </div>
  );
}

// ── 4. Animated Counter ──────────────────────────────────────────
export function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, value]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

// ── 5. Cursor Spotlight (hero section) ───────────────────────────
export function CursorSpotlight({ color = 'rgba(200,0,44,0.12)' }: { color?: string }) {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <div
        className="absolute rounded-full transition-all duration-75"
        style={{
          width: 600, height: 600,
          left: pos.x - 300, top: pos.y - 300,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

// ── 6. Particle Burst on Click ───────────────────────────────────
export function ClickParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  useEffect(() => {
    const EMOJIS = ['⚽', '🏆', '⭐', '🔥', '✨', '💥'];
    let id = 0;
    const onClick = (e: MouseEvent) => {
      const newParticles = Array.from({ length: 6 }, () => ({
        id: id++,
        x: e.clientX,
        y: e.clientY,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      }));
      setParticles(p => [...p, ...newParticles]);
      setTimeout(() => setParticles(p => p.filter(p2 => !newParticles.find(n => n.id === p2.id))), 800);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {particles.map(p => (
        <motion.span
          key={p.id}
          className="fixed text-2xl select-none"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
          animate={{
            opacity: 0, scale: 1.5,
            x: (Math.random() - 0.5) * 120,
            y: (Math.random() - 0.8) * 120,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ── 7. Scroll Progress Bar ────────────────────────────────────────
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-0.5 z-[10000] origin-left bg-red-dramatic"
      style={{ scaleX: progress }}
    />
  );
}

// ── 8. Text Scramble ─────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789⚽🏆';
export function ScrambleText({ text, trigger = true }: { text: string; trigger?: boolean }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!trigger) return;
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(text.split('').map((c, i) => {
        if (i < iter) return text[i];
        if (c === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(''));
      iter += 0.4;
      if (iter >= text.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [trigger, text]);

  return <span>{display}</span>;
}
