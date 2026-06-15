import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Trophy,
  Target,
  Gift,
  User,
  LogOut,
} from "lucide-react";
import { MissionsList } from "./MissionsListDB";
import { LeaderboardView } from "./LeaderboardView";
import lgLogo from "../../imports/LGE_Electronics_Logo_HeritageRed_Grey_RGB.png";
import mnewmonic from "../../imports/mnewmonic.png";
import giftBox from "../../imports/gift-box.png";

// Helper to get flag code from team name
const TEAM_FLAG_CODES: Record<string, string> = {
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

interface DashboardProps {
  user: {
    name: string;
    phone: string;
    team: string;
    teamFlag: string;
    points: number;
    rank: number;
  };
  onLogout: () => void;
}

type Tab = "missions" | "leaderboard" | "rewards";

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("missions");

  // Safety check - if user is incomplete, don't render
  if (!user || !user.phone || !user.name) {
    return (
      <div className="premium-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "missions" as Tab, label: "Missions", icon: Target },
    {
      id: "leaderboard" as Tab,
      label: "Leaderboard",
      icon: Trophy,
    },
    { id: "rewards" as Tab, label: "Rewards", icon: Gift },
  ];

  return (
    <div className="premium-page min-h-screen">
      {/* Header */}
      <div className="fifa-broadcast-header text-white" style={{ paddingBottom: '1px' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-5">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <img src={lgLogo} alt="LG Electronics" className="h-7 sm:h-9 w-auto bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm" />
              <div className="w-px h-6 sm:h-8" style={{ background: 'rgba(255,255,255,0.2)' }} />
              <img src={mnewmonic} alt="LG Super Fan League" className="h-12 sm:h-16 w-auto drop-shadow-lg" />
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* User Profile Card — glass */}
          <div className="fifa-score-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0"
                style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                <img src={`https://flagcdn.com/w80/${TEAM_FLAG_CODES[user.team] || "ar"}.png`}
                  alt={`${user.team} flag`} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 opacity-70" />
                  <span className="font-bold text-sm sm:text-base tracking-wide">{user.name || user.phone}</span>
                </div>
                <div className="text-xs sm:text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Supporting <span className="font-semibold text-white">{user.team}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl sm:text-3xl font-black tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                {user.points.toLocaleString()}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>points</div>
              <div className="text-xs font-bold mt-0.5 px-2 py-0.5 rounded-full inline-block"
                style={{ background: 'rgba(255,255,255,0.15)' }}>Rank #{user.rank}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation — sits inside header, at the bottom */}
        <div className="max-w-6xl mx-auto px-2 sm:px-6">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-3 sm:py-3.5 font-semibold transition-all whitespace-nowrap text-sm sm:text-base relative ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {activeTab === "missions" && (
              <MissionsList
                userTeam={user.team}
                userPhone={user.phone}
              />
            )}
            {activeTab === "leaderboard" && (
              <LeaderboardView
                currentUserId={user.phone}
                currentTeam={user.team}
              />
            )}
            {activeTab === "rewards" && (
              <div className="space-y-6">
                {/* Hero gift box image + title */}
                <div className="bg-red-dramatic rounded-2xl overflow-hidden relative">
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle, #fff 0%, transparent 70%)",
                    }}
                  />
                  <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-6">
                    <img
                      src={giftBox}
                      alt="LG Prize Box"
                      className="w-full sm:w-[480px] object-contain"
                    />
                    <div className="p-12 sm:p-10 sm:flex-1 relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-12 h-12 text-yellow-400" />
                        <h2 className="text-white font-black text-2xl uppercase tracking-wide">
                          Win Big!
                        </h2>
                      </div>
                      <p className="text-white/80 text-sm mb-5 leading-relaxed">
                        Complete missions, earn points, climb
                        the leaderboard — and walk away with
                        exclusive LG prizes every week!
                      </p>

                      {/* Grand Prize list */}
                      <div className="mb-4">
                        <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
                          🏆 Grand Prizes
                        </p>
                        <ul className="space-y-1.5">
                          {[
                            {
                              medal: "🥇",
                              rank: "1st Place",
                              prize: 'LG 50" 4K TV',
                            },
                            {
                              medal: "🥈",
                              rank: "2nd Place",
                              prize: 'LG 43" TV',
                            },
                            {
                              medal: "🥉",
                              rank: "3rd Place",
                              prize: 'LG 32" TV',
                            },
                          ].map((item) => (
                            <li
                              key={item.rank}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-xl flex-shrink-0">
                                {item.medal}
                              </span>
                              <span className="text-white/70">
                                {item.rank}
                              </span>
                              <span className="text-white font-bold ml-auto">
                                {item.prize}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weekly Prize list */}
                      <div>
                        <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
                          ⭐ Weekly Prizes
                        </p>
                        <ul className="space-y-1.5">
                          {[
                            {
                              medal: "🥇",
                              rank: "1st Winner",
                              prize: "Fan Jersey",
                            },
                            {
                              medal: "🥈🥉",
                              rank: "2nd & 3rd Winner",
                              prize: "Key Ring",
                            },
                          ].map((item) => (
                            <li
                              key={item.rank}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-lg flex-shrink-0">
                                {item.medal}
                              </span>
                              <span className="text-white/70">
                                {item.rank}
                              </span>
                              <span className="text-white font-bold ml-auto">
                                {item.prize}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grand Prize Cards */}

                {/* Weekly Prize Cards */}

                {/* How to Win */}
                <div
                  className="rounded-2xl p-5 sm:p-6"
                  style={{ backgroundColor: "#F0ECE4" }}
                >
                  <h3 className="font-black text-gray-900 mb-4 text-base uppercase tracking-wide">
                    How to Win
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    {[
                      {
                        icon: "🎯",
                        text: "Complete weekly missions to earn points",
                      },
                      {
                        icon: "📊",
                        text: "Climb the leaderboard each week",
                      },
                      {
                        icon: "🏆",
                        text: "Top scorers win grand & weekly prizes",
                      },
                    ].map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-white rounded-xl p-3"
                      >
                        <span className="text-2xl flex-shrink-0">
                          {tip.icon}
                        </span>
                        <p className="text-gray-600 leading-snug">
                          {tip.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
