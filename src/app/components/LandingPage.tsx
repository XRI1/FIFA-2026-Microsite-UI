import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useAnimation,
  useScroll,
  useTransform,
} from "motion/react";
import {
  TiltCard,
  MagneticButton,
  AnimatedCounter,
  CursorSpotlight,
} from "./PremiumEffects";
import { Trophy, UserRound } from "lucide-react";
import { supabase } from "../../../utils/supabase/client";
import { FlaticonIcon, RankMedal, type FlaticonIconName } from "./FlaticonIcon";
import { ALL_MISSIONS, MISSION_ICONS } from "./MissionsListDB";
import heroBanner from "../../imports/WhatsApp_Image_2026-06-06_at_12.16.13_AM.png";
import heroBanner2 from "../../imports/kv-banner__1_.png";
import heroBanner2Mobile from "../../imports/ChatGPT-Image-Jun-14_-2026_-04_43_09-PM.png";
import kvWinText from "../../imports/kv-wintext.png";
import heroBannerMobile from "../../imports/ChatGPT_Image_Jun_10__2026__06_34_37_PM.png";
import lgLogo from "../../imports/LGE_Electronics_Logo_HeritageRed_Grey_RGB.png";
import superFanLogo from "../../imports/mnewmonic.png";
import kvText from "../../imports/kv-text.png";
import leaderboardRibbonLeft from "../../imports/leaderboard-ribbon-left.png";
import leaderboardRibbonRight from "../../imports/leaderboard-ribbon-right.png";
import howItWorksStadium from "../../imports/how-it-works-stadium.jpeg";

interface LandingPageProps {
  onGetStarted: () => void;
}

function CampaignSectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="campaign-section-heading">
      <div className={`campaign-eyebrow ${light ? "campaign-eyebrow-light" : ""}`}>
        <span />
        {eyebrow}
      </div>
      <h2 className={light ? "text-white" : "text-gray-900"}>{title}</h2>
      {description && (
        <p className={light ? "text-white/70" : "text-gray-500"}>{description}</p>
      )}
    </div>
  );
}

const FLAG_CODES: Record<string, string> = {
  Algeria: "dz",
  Argentina: "ar",
  Australia: "au",
  Austria: "at",
  Belgium: "be",
  "Bosnia and Herzegovina": "ba",
  Brazil: "br",
  "Cabo Verde": "cv",
  Canada: "ca",
  Colombia: "co",
  "Congo DR": "cd",
  "Côte d'Ivoire": "ci",
  Croatia: "hr",
  Curaçao: "cw",
  Czechia: "cz",
  Ecuador: "ec",
  Egypt: "eg",
  England: "gb-eng",
  France: "fr",
  Germany: "de",
  Ghana: "gh",
  Haiti: "ht",
  Iran: "ir",
  Iraq: "iq",
  Japan: "jp",
  Jordan: "jo",
  Mexico: "mx",
  Morocco: "ma",
  Netherlands: "nl",
  "New Zealand": "nz",
  Norway: "no",
  Panama: "pa",
  Paraguay: "py",
  Portugal: "pt",
  Qatar: "qa",
  "Saudi Arabia": "sa",
  Scotland: "gb-sct",
  Senegal: "sn",
  "South Africa": "za",
  "South Korea": "kr",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Tunisia: "tn",
  Türkiye: "tr",
  "United States": "us",
  Uruguay: "uy",
  Uzbekistan: "uz",
};

const RANK_STYLES = [
  {
    bg: "from-yellow-400 to-yellow-600",
    rank: 1 as const,
    size: "w-20 h-20",
    order: "order-2",
    mt: "mt-0",
  },
  {
    bg: "from-gray-300 to-gray-500",
    rank: 2 as const,
    size: "w-16 h-16",
    order: "order-1",
    mt: "mt-6",
  },
  {
    bg: "from-amber-600 to-amber-800",
    rank: 3 as const,
    size: "w-16 h-16",
    order: "order-3",
    mt: "mt-6",
  },
];

function TopPlayers() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop3() {
      try {
        const { data } = await supabase
          .from("users")
          .select("name, team, points")
          .order("points", { ascending: false })
          .limit(3);
        setPlayers(data || []);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    }
    fetchTop3();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center gap-6 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-24 h-32 bg-white/50 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );

  if (!players.length) return null;

  return (
    <FadeInWhenVisible direction="up">
      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-700 mb-6 uppercase tracking-widest">
          Top Players
        </h3>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
          Weekly champions. Top contributors. The legends
          fighting hardest for their nation.
        </p>
        <div className="flex items-end justify-center gap-4">
          {players.map((player, i) => {
            const style = RANK_STYLES[i];
            const flagCode = FLAG_CODES[player.team] || "un";
            return (
              <motion.div
                key={player.name}
                className={`flex flex-col items-center gap-2 ${style.order} ${style.mt}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <RankMedal rank={style.rank} className="w-7 h-7" />
                <div
                  className={`${style.size} rounded-full bg-gradient-to-br ${style.bg} flex items-center justify-center overflow-hidden shadow-lg border-4 border-white`}
                >
                  <img
                    src={`https://flagcdn.com/w80/${flagCode}.png`}
                    alt={player.team}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-xl px-3 py-2 shadow text-center min-w-[80px]">
                  <div className="font-bold text-gray-900 text-sm truncate max-w-[90px]">
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[90px]">
                    {player.team}
                  </div>
                  <div className="text-lg-red font-bold text-sm">
                    {player.points} pts
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </FadeInWhenVisible>
  );
}

function HeroSlider({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const heroImgRef = useRef<HTMLImageElement>(null);

  const slides = [
    { desktop: heroBanner, mobile: heroBannerMobile },
    { desktop: heroBanner2, mobile: heroBanner2Mobile },
  ];

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!heroImgRef.current) return;
      heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 48px)" }}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: current === i ? 1 : 0,
            zIndex: current === i ? 1 : 0,
          }}
        >
          {/* Desktop image */}
          <img
            ref={i === 0 ? heroImgRef : undefined}
            src={slide.desktop}
            alt={`LG Superfan League slide ${i + 1}`}
            className="hidden md:block w-full h-full object-cover will-change-transform"
            style={{ transformOrigin: "top center" }}
          />
          {/* Mobile image */}
          <img
            src={slide.mobile}
            alt={`LG Superfan League slide ${i + 1}`}
            className="md:hidden w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Stadium lights */}
      <StadiumLights />

      {/* Floating balls */}
      <FloatingBalls count={8} opacity={0.15} />

      {/* Cursor spotlight on hero */}
      <CursorSpotlight color="rgba(200,0,44,0.18)" />

      {/* Gradient + CTA */}
      <div
        className="absolute inset-0 flex items-end justify-center pb-12"
        style={{ zIndex: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <motion.div
          className="hero-3d-stage relative z-10 text-center space-y-6 px-4"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.img
            src={superFanLogo}
            alt="LG Super Fan League"
            className="hero-3d-logo w-44 md:w-64 mx-auto drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          <motion.img
            src={kvWinText}
            alt="Join now and win exciting prizes"
            className="hero-3d-prize-text w-72 md:w-96 mx-auto drop-shadow-2xl cursor-pointer"
            onClick={onGetStarted}
            whileHover={{
              scale: 1.08,
              filter:
                "drop-shadow(0 0 24px rgba(255,255,255,0.4))",
            }}
            whileTap={{ scale: 0.95 }}
          />
          <MagneticButton onClick={onGetStarted} strength={0.3}>
            <motion.button
              className="campaign-primary-button py-3 px-8 md:py-4 md:px-14 text-base md:text-xl"
              whileHover={{
                boxShadow:
                  "0 0 40px rgba(255,255,255,0.5), 0 8px 32px rgba(0,0,0,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{ letterSpacing: "0.04em" }}
            >
              JOIN NOW →
            </motion.button>
          </MagneticButton>
          <img
            src={kvText}
            alt="Pick Your Side, Complete Missions, Climb the Leaderboard"
            className="hero-3d-subline w-72 md:w-[480px] mx-auto drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
        style={{ zIndex: 3 }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              current === i
                ? "w-6 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Football Atmosphere Components ──────────────────────────────

const BALL_CONFIGS = [
  {
    x: "8%",
    y: "15%",
    size: 28,
    dur: 7,
    delay: 0,
    rotate: 360,
  },
  {
    x: "85%",
    y: "10%",
    size: 20,
    dur: 9,
    delay: 1.5,
    rotate: -270,
  },
  {
    x: "20%",
    y: "70%",
    size: 36,
    dur: 11,
    delay: 0.8,
    rotate: 180,
  },
  {
    x: "70%",
    y: "60%",
    size: 24,
    dur: 8,
    delay: 2,
    rotate: 360,
  },
  {
    x: "50%",
    y: "30%",
    size: 18,
    dur: 13,
    delay: 3,
    rotate: -360,
  },
  {
    x: "92%",
    y: "80%",
    size: 30,
    dur: 10,
    delay: 1,
    rotate: 270,
  },
  {
    x: "35%",
    y: "85%",
    size: 22,
    dur: 12,
    delay: 4,
    rotate: -180,
  },
  {
    x: "60%",
    y: "20%",
    size: 26,
    dur: 6,
    delay: 0.5,
    rotate: 360,
  },
];

function FloatingBalls({
  count = 8,
  opacity = 0.12,
}: {
  count?: number;
  opacity?: number;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {BALL_CONFIGS.slice(0, count).map((cfg, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: cfg.x, top: cfg.y, opacity }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 20, 0],
            rotate: [0, cfg.rotate],
          }}
          transition={{
            duration: cfg.dur,
            delay: cfg.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width={cfg.size}
            height={cfg.size}
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="white"
              stroke="#ccc"
              strokeWidth="2"
            />
            <polygon points="32,8 40,20 28,20" fill="#222" />
            <polygon points="56,24 44,20 48,34" fill="#222" />
            <polygon points="50,50 44,38 56,36" fill="#222" />
            <polygon points="32,56 36,44 28,44" fill="#222" />
            <polygon points="14,50 20,38 8,36" fill="#222" />
            <polygon points="8,24 20,34 16,20" fill="#222" />
            <polygon
              points="32,8 40,20 28,20 32,8"
              fill="#222"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function FootballTicker() {
  const items = [
    "⚽ FIFA WORLD CUP 2026",
    "🏆 LG SUPER FAN LEAGUE",
    "🎯 WEEK 1 MISSIONS LIVE",
    "🔥 BANGLADESH FANS UNITE",
    "⚡ DOUBLE POINTS HOUR",
    "🇦🇷 PICK YOUR SIDE",
    "WIN LG PRIZES",
    "🌍 48 NATIONS • 1 CHAMPION",
    "📺 WATCH ON LG OLED",
    "🎮 COMPLETE MISSIONS • EARN POINTS",
  ];
  return (
    <div
      className="campaign-ticker overflow-hidden py-2"
      style={{ zIndex: 10, position: "relative" }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-lg-red font-black text-xs md:text-sm tracking-[0.14em] uppercase flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function StadiumLights() {
  return (
    <div
      className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1, height: "100%" }}
    >
      {/* Left floodlight beam */}
      <motion.div
        className="absolute top-0 left-0"
        style={{
          width: 300,
          height: "70%",
          background:
            "conic-gradient(from 20deg at 0% 0%, transparent 0deg, rgba(255,255,180,0.06) 20deg, transparent 40deg)",
          transformOrigin: "top left",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Right floodlight beam */}
      <motion.div
        className="absolute top-0 right-0"
        style={{
          width: 300,
          height: "70%",
          background:
            "conic-gradient(from -20deg at 100% 0%, transparent 0deg, rgba(255,255,180,0.06) 20deg, transparent 40deg)",
          transformOrigin: "top right",
        }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function PublicLeaderboard() {
  const [individuals, setIndividuals] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [{ data: users }, { data: teamData }] =
          await Promise.all([
            supabase
              .from("users")
              .select("name, team, points")
              .order("points", { ascending: false })
              .limit(10),
            supabase
              .from("users")
              .select("team, points")
              .order("points", { ascending: false }),
          ]);

        setIndividuals(users || []);

        // Aggregate team points
        const teamMap: Record<string, number> = {};
        (teamData || []).forEach((u: any) => {
          teamMap[u.team] = (teamMap[u.team] || 0) + u.points;
        });
        const sorted = Object.entries(teamMap)
          .map(([team, total]) => ({ team, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);
        setTeams(sorted);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading)
    return (
      <div className="leaderboard-grid relative grid grid-cols-1 md:grid-cols-[1fr_0.92fr_1fr] gap-4 md:gap-5 items-start">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-80 rounded-lg border border-gray-200 bg-white/70 animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <div className="leaderboard-board relative">
      <img
        src={leaderboardRibbonLeft}
        alt=""
        aria-hidden="true"
        className="leaderboard-ribbon leaderboard-ribbon-left"
      />
      <img
        src={leaderboardRibbonRight}
        alt=""
        aria-hidden="true"
        className="leaderboard-ribbon leaderboard-ribbon-right"
      />
      <div className="leaderboard-grid relative grid grid-cols-1 md:grid-cols-[1fr_0.92fr_1fr] gap-4 md:gap-5 items-start">
      {/* Teams */}
      <FadeInWhenVisible direction="left">
        <div className="leaderboard-panel overflow-hidden bg-white">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <Trophy className="w-4 h-4 text-lg-red" strokeWidth={2.4} />
            <h3 className="text-gray-900 font-black text-base uppercase tracking-wide">
              Teams
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {teams.map((t, i) => {
              const rank = i + 1;
              const flagCode = FLAG_CODES[t.team] || "un";
              const isTop3 = rank <= 3;
              return (
                <div
                  key={t.team}
                  className={`flex items-center gap-3 px-4 py-2.5 ${isTop3 ? "bg-gray-50" : ""}`}
                >
                  <div className="w-7 text-center flex-shrink-0">
                    {isTop3 ? (
                      <RankMedal rank={rank as 1 | 2 | 3} className="w-5 h-5 mx-auto" />
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">
                        #{rank}
                      </span>
                    )}
                  </div>
                  <img
                    src={`https://flagcdn.com/w40/${flagCode}.png`}
                    alt={t.team}
                    className="w-7 h-5 object-cover rounded flex-shrink-0"
                  />
                  <span
                    className={`flex-1 font-black uppercase text-sm tracking-wide ${isTop3 ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {t.team}
                  </span>
                  <span
                    className={`font-black text-sm ${isTop3 ? "text-lg-red" : "text-gray-500"}`}
                  >
                    {t.total.toLocaleString()}
                  </span>
                </div>
              );
            })}
            {teams.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">
                No data yet
              </p>
            )}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* How Points Work */}
      <FadeInWhenVisible direction="up" delay={0.1}>
        <div className="leaderboard-points-card overflow-hidden bg-white">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg-red font-black text-lg text-center uppercase tracking-[0.14em]">
              How Points Work
            </h3>
          </div>
          <div className="px-5 py-5 space-y-4">
            {[
              {
                icon: "target" as FlaticonIconName,
                title: "Complete Missions",
                desc: "Each weekly mission earns points. Stack multiple missions for higher total.",
              },
              {
                icon: "zap" as FlaticonIconName,
                title: "Double Points Hour",
                desc: "Every week has a 60-min window where all points scored are 2×.",
              },
              {
                icon: "medal" as FlaticonIconName,
                title: "Badges & Bonuses",
                desc: "Unlock achievement badges (Prediction King, Legend etc.) for bonus pts.",
              },
              {
                icon: "chart" as FlaticonIconName,
                title: "Live Updates",
                desc: "Board reshuffles in real-time every time a fan scores.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <span className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <FlaticonIcon name={icon} className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-gray-900 font-bold text-sm">
                    {title}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Individual */}
      <FadeInWhenVisible direction="right" delay={0.1}>
        <div className="leaderboard-panel overflow-hidden bg-white">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <UserRound className="w-4 h-4 text-[#2b165c]" strokeWidth={2.6} />
            <h3 className="text-gray-900 font-black text-base uppercase tracking-wide">
              Individual
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {individuals.map((u, i) => {
              const rank = i + 1;
              const isTop3 = rank <= 3;
              return (
                <div
                  key={u.name + i}
                  className={`flex items-center gap-3 px-4 py-2.5 ${isTop3 ? "bg-gray-50" : ""}`}
                >
                  <div className="w-7 text-center flex-shrink-0">
                    {isTop3 ? (
                      <RankMedal rank={rank as 1 | 2 | 3} className="w-5 h-5 mx-auto" />
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">#{rank}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${isTop3 ? "text-gray-900" : "text-gray-600"}`}>
                      {u.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">{u.team}</p>
                  </div>
                  <span className={`font-black text-sm flex-shrink-0 ${isTop3 ? "text-lg-red" : "text-gray-500"}`}>
                    {u.points.toLocaleString()}
                  </span>
                </div>
              );
            })}
            {individuals.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">
                No data yet
              </p>
            )}
          </div>
        </div>
      </FadeInWhenVisible>
      </div>
    </div>
  );
}

function FadeInWhenVisible({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: false,
    margin: "-80px",
  });
  const initial = {
    up: { opacity: 0, y: 50 },
    down: { opacity: 0, y: -50 },
    left: { opacity: 0, x: -50 },
    right: { opacity: 0, x: 50 },
    none: { opacity: 0 },
  }[direction];

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage({
  onGetStarted,
}: LandingPageProps) {
  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    {
      num: 4,
      label: "Weeks",
      value: "Week",
      icon: "calendar" as FlaticonIconName,
    },
    {
      num: 28,
      label: "Missions",
      value: "Challenges",
      icon: "target" as FlaticonIconName,
    },
    {
      num: 1,
      label: "League",
      value: "League",
      icon: "users" as FlaticonIconName,
    },
    { num: 0, label: "Amazing", value: "Prizes", icon: "gift" as FlaticonIconName },
  ];

  const weekOneMissions = ALL_MISSIONS.filter((mission) => mission.week === 1);

  const howItWorks = [
    {
      icon: "users" as FlaticonIconName,
      title: "1. Join & Choose Team",
      desc: "Sign up with your phone number and pick your favorite FIFA 2026 team to support throughout the tournament.",
    },
    {
      icon: "target" as FlaticonIconName,
      title: "2. Complete Missions",
      desc: "Take photos, answer quizzes, predict scores, and engage in fun football-themed challenges to earn points.",
    },
    {
      icon: "trophy" as FlaticonIconName,
      title: "3. Win Rewards",
      desc: "Climb the leaderboard, compete with other fans, and unlock exclusive LG rewards for top performers.",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F0ECE4" }}
    >
      {/* Navbar */}
      <motion.nav
        className="premium-campaign-nav sticky top-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-2 sm:px-3 py-2.5 flex items-center justify-between gap-1.5 sm:gap-2">
          <img
            src={lgLogo}
            alt="LG Electronics"
            className="h-6 sm:h-7 md:h-8 w-auto max-w-[58px] sm:max-w-none bg-[#F0ECE4] px-1.5 sm:px-2 py-1 rounded-md flex-shrink-0"
          />
          <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
            {[
              { id: "hero", label: "Home", icon: "home" as FlaticonIconName },
              {
                id: "how-it-works",
                label: "How It Works",
                icon: "users" as FlaticonIconName,
              },
              {
                id: "missions",
                label: "Missions",
                icon: "target" as FlaticonIconName,
              },
              {
                id: "leaderboard",
                label: "Leaderboard",
                icon: "trophy" as FlaticonIconName,
              },
              { id: "details", label: "Details", icon: "gift" as FlaticonIconName },
            ].map(({ id, label, icon }) =>
              id === 'details' ? (
                <a
                  key={id}
                  href="/details"
                  className="premium-nav-link flex items-center gap-1.5 px-2 sm:px-3 md:px-4 py-2 rounded-full text-white/90 hover:text-white transition-all font-semibold text-sm"
                >
                  <FlaticonIcon name={icon} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden md:inline">{label}</span>
                </a>
              ) : (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="premium-nav-link flex items-center gap-1.5 px-2 sm:px-3 md:px-4 py-2 rounded-full text-white/90 hover:text-white transition-all font-semibold text-sm"
                >
                  <FlaticonIcon name={icon} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden md:inline">{label}</span>
                </button>
              )
            )}
          </div>
          <motion.button
            onClick={onGetStarted}
            className="campaign-primary-button py-1.5 px-2 sm:px-3 md:py-2 md:px-5 text-[11px] sm:text-xs md:text-sm flex-shrink-0 whitespace-nowrap"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">Join Now</span>
            <span className="sm:hidden">Join</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Scrolling Ticker */}
      <FootballTicker />

      {/* Hero Slider */}
      <div id="hero" className="relative overflow-hidden">
        <HeroSlider onGetStarted={onGetStarted} />

        {/* Stats */}
        <div className="bg-red-dramatic py-6 md:py-8 relative overflow-hidden">
          <FloatingBalls count={4} opacity={0.08} />
          <div
            className="max-w-6xl mx-auto px-3 md:px-4 relative"
            style={{ zIndex: 1 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {stats.map((stat, i) => {
                return (
                  <FadeInWhenVisible
                    key={stat.label}
                    delay={i * 0.1}
                    direction="up"
                  >
                    <motion.div
                      className="rounded-xl p-3 md:p-4 text-center cursor-default"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px)",
                        border:
                          "1px solid rgba(255,255,255,0.15)",
                      }}
                      whileHover={{
                        scale: 1.06,
                        background: "rgba(255,255,255,0.14)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <FlaticonIcon name={stat.icon} className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1.5" />
                      <div className="text-lg md:text-2xl font-black text-white">
                        {stat.num > 0 ? (
                          <AnimatedCounter value={stat.num} />
                        ) : (
                          <FlaticonIcon name="trophy" className="w-8 h-8 mx-auto" />
                        )}
                      </div>
                      <div
                        className="text-xs md:text-sm font-semibold"
                        style={{
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {stat.value}
                      </div>
                    </motion.div>
                  </FadeInWhenVisible>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div
        id="leaderboard"
        className="premium-editorial-section leaderboard-section py-12 md:py-16 relative overflow-hidden"
        style={{ backgroundColor: "#F0ECE4" }}
      >
        <div
          className="max-w-5xl mx-auto px-4 relative"
          style={{ zIndex: 2 }}
        >
          <FadeInWhenVisible direction="up">
            <div className="leaderboard-heading">
              <Trophy className="w-8 h-8 mx-auto text-lg-red" strokeWidth={2.4} />
              <h2>Live Leaderboard</h2>
              <p>Updates in real-time as fans score points</p>
            </div>
          </FadeInWhenVisible>
          <PublicLeaderboard />
        </div>
      </div>

      {/* How It Works */}
      <div
        id="how-it-works"
        className="how-it-works-stadium py-16 md:py-24 relative overflow-hidden"
        style={{ backgroundImage: `url(${howItWorksStadium})` }}
      >
        <div className="absolute inset-0 how-it-works-stadium-overlay" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <FadeInWhenVisible direction="up">
            <CampaignSectionHeading
              eyebrow="Four simple steps"
              title="How It Works"
              description="Choose your side, complete missions, climb the board and win."
              light
            />
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              {
                num: "01",
                icon: "football" as FlaticonIconName,
                title: "Choose Your Team",
                desc: "Pick the national team you want to represent. Your points boost your team on the global leaderboard. Choose wisely — once per season.",
              },
              {
                num: "02",
                icon: "target" as FlaticonIconName,
                title: "Complete Missions",
                desc: "New missions drop every week — photo challenges, quizzes, prediction games, reaction videos & memes. Each mission earns points.",
              },
              {
                num: "03",
                icon: "trophy" as FlaticonIconName,
                title: "Climb the Board",
                desc: "Your points roll up to your team's score AND your personal fan rank. Watch the live board update in real-time every time someone scores.",
              },
              {
                num: "04",
                icon: "gift" as FlaticonIconName,
                title: "Win LG Prizes",
                desc: "Weekly top fans win LG products — Smart TVs, Earbuds, Speakers & more. The bigger your score, the better your chance.",
              },
            ].map((step, i) => {
              return (
              <FadeInWhenVisible
                key={step.num}
                delay={i * 0.12}
                direction="up"
              >
                <TiltCard intensity={8}>
                  <motion.div
                    className="premium-step-card premium-step-card-off-white p-6 h-full flex flex-col gap-4"
                    whileHover={{
                      boxShadow: "0 20px 48px rgba(0,0,0,0.14)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                    }}
                  >
                    <div
                      className="w-14 h-14 bg-lg-red rounded-full flex items-center justify-center font-black text-white text-xl"
                    >
                      {step.num}
                    </div>
                    <FlaticonIcon name={step.icon} className="w-10 h-10" />
                    <h3 className="text-gray-900 font-black text-lg">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                </TiltCard>
              </FadeInWhenVisible>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Types */}
      <div
        id="missions"
        className="py-12 sm:py-16 md:py-24 bg-red-dramatic relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <FadeInWhenVisible direction="up">
            <CampaignSectionHeading
              eyebrow="Play your way"
              title="Exciting Mission Types"
              description="Week 1 missions are live. Log in to play and start earning points."
              light
            />
          </FadeInWhenVisible>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-5">
            {weekOneMissions.map((mission, i) => {
              const icon = MISSION_ICONS[mission.type] || "gamepad";

              return (
              <FadeInWhenVisible
                key={mission.id}
                delay={i * 0.08}
                direction="up"
              >
                <TiltCard intensity={10}>
                  <motion.div
                    className="group relative overflow-hidden rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 h-full min-h-[186px] sm:min-h-[230px] md:min-h-[260px] flex flex-col text-left"
                    style={{
                      backgroundColor: "#F0ECE4",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                    whileHover={{
                      boxShadow: "0 24px 48px rgba(0,0,0,0.22)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-lg-red/0 via-lg-red/0 to-lg-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex h-full min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                        <span className="inline-flex min-w-0 items-center rounded-full bg-lg-red/10 px-2 sm:px-2.5 py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.12em] sm:tracking-[0.18em] text-lg-red whitespace-nowrap">
                          Week 1
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-gray-500 whitespace-nowrap">
                          {mission.points} XP
                        </span>
                      </div>
                      <motion.div
                        className="mission-type-orb mb-2.5 sm:mb-3 md:mb-4"
                        style={{
                          width: "clamp(3rem, 13vw, 5.25rem)",
                          height: "clamp(3rem, 13vw, 5.25rem)",
                        }}
                        whileHover={{
                          scale: 1.1,
                          rotate: [-5, 5, -3, 0],
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <FlaticonIcon name={icon} className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9" />
                      </motion.div>
                      <h3 className="font-black text-gray-900 text-[11px] sm:text-sm md:text-lg leading-tight line-clamp-2 break-words">
                        {mission.title}
                      </h3>
                      <p className="mt-2 hidden sm:block text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {mission.description}
                      </p>
                      <button
                        type="button"
                        onClick={onGetStarted}
                        className="campaign-primary-button mt-auto inline-flex w-full items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-[11px] sm:text-xs md:text-sm whitespace-nowrap"
                      >
                        <FlaticonIcon name="play" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Play
                      </button>
                    </div>
                  </motion.div>
                </TiltCard>
              </FadeInWhenVisible>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details & T&C teaser */}
      <div id="details" className="campaign-details-ribbon-area py-12 md:py-16" style={{ backgroundColor: '#F0ECE4' }}>
        <img
          src={leaderboardRibbonLeft}
          alt=""
          aria-hidden="true"
          className="campaign-details-ribbon campaign-details-ribbon-left"
        />
        <img
          src={leaderboardRibbonRight}
          alt=""
          aria-hidden="true"
          className="campaign-details-ribbon campaign-details-ribbon-right"
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <FadeInWhenVisible direction="up">
            <div className="campaign-feature-card overflow-hidden">
              <div className="bg-red-dramatic px-8 py-8">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Campaign Details & Policies</h2>
                <p className="text-white/80 text-sm md:text-base">
                  Learn about the campaign rules, prizes, eligibility and our Fair Play Policy.
                </p>
              </div>
              <div className="px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  {[
                    { icon: "goal" as FlaticonIconName, label: 'About Campaign' },
                    { icon: "medal" as FlaticonIconName, label: 'Prizes & Products' },
                    { icon: "scale" as FlaticonIconName, label: 'Fair Play Policy' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="text-center">
                      <FlaticonIcon name={icon} className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-xs font-bold text-lg-red">{label}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="/details"
                  className="campaign-primary-button flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm"
                >
                  View Full Details →
                </a>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="py-8" style={{ backgroundColor: '#F0ECE4' }}>
        <div className="max-w-4xl mx-auto px-4">
          <FadeInWhenVisible direction="up">
            <div className="campaign-policy-strip px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FlaticonIcon name="scale" className="w-6 h-6 flex-shrink-0" />
                <p className="font-bold text-gray-900 text-sm">Fair Play Policy (T&C)</p>
                <p className="text-gray-500 text-xs hidden sm:block">— Campaign rules, eligibility & prize conditions</p>
              </div>
              <a href="/details#tnc" className="text-lg-red font-bold text-sm hover:underline flex-shrink-0">
                Read Policy →
              </a>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-red-dramatic py-12 md:py-16 relative overflow-hidden">
        <FloatingBalls count={6} opacity={0.1} />
        <FadeInWhenVisible direction="up">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Ready to Join the League?
            </h2>
            <p className="text-base md:text-xl text-white/90">
              Sign up now and start your journey to becoming an
              LG Superfan!
            </p>
            <MagneticButton
              onClick={onGetStarted}
              strength={0.4}
            >
              <motion.button
                className="campaign-primary-button py-3 px-10 md:py-4 md:px-14 text-base md:text-lg"
                whileHover={{
                  boxShadow:
                    "0 0 50px rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                style={{ letterSpacing: "0.04em" }}
              >
                JOIN NOW →
              </motion.button>
            </MagneticButton>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* Footer */}
      <div
        className="py-10 md:py-14"
        style={{ backgroundColor: "#1a0a0a" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
            {/* Logo & tagline */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <img
                src={lgLogo}
                alt="LG Electronics"
                className="h-10 w-auto bg-white px-3 py-1.5 rounded-lg"
              />
              <p className="text-white/60 text-sm">
                Life's Good
              </p>
              <p className="text-white/40 text-xs">
                © 2026 LG Electronics. All rights reserved.
              </p>
            </div>

            {/* Social */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-xs">
                Follow Us
              </h4>
              <div className="space-y-2">
                <a
                  href="https://www.facebook.com/LGBangladesh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm justify-center md:justify-start"
                >
                  <FlaticonIcon name="facebook" className="w-5 h-5" /> Facebook —
                  @LGBangladesh
                </a>
                <a
                  href="https://www.instagram.com/lgbangladesh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm justify-center md:justify-start"
                >
                  <FlaticonIcon name="instagram" className="w-5 h-5" /> Instagram
                  — @lgbangladesh
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-xs">
                Contact
              </h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FlaticonIcon name="phone" className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p>
                      Toll Free:{" "}
                      <span className="text-white font-semibold">
                        08000545454
                      </span>
                    </p>
                    <p>
                      Hotline:{" "}
                      <span className="text-white font-semibold">
                        09678545454
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FlaticonIcon name="time" className="w-5 h-5 flex-shrink-0" />
                  <p>
                    Available:{" "}
                    <span className="text-white font-semibold">
                      8:00 am – 9:00 pm
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/30 text-xs">
              LG Super Fan League • FIFA 2026 Bangladesh •
              Campaign runs mid-June to late July 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
