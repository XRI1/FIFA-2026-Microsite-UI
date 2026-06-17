import { useState, type CSSProperties } from "react";
import {
  supabase,
  Mission,
} from "../../../utils/supabase/client";
import { MissionModal } from "./MissionModal";
import { FlaticonIcon, type FlaticonIconName } from "./FlaticonIcon";

// ── Static mission data (no Supabase) ───────────────────────────
export const ALL_MISSIONS: Mission[] = [
  // Week 1
  {
    id: "w1-spot-products",
    week: 1,
    day: 1,
    title: "Spot the LG Products",
    description:
      "Look at our living room image on the microsite — how many LG products can you count? Comment your answer!",
    type: "spot-count",
    points: 80,
    timedDuration: 15,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w1-flag-quiz",
    week: 1,
    day: 2,
    title: "Team Flag Colour Quiz",
    description:
      "See a blank outline of your team's flag with 4 colour options. Tap to fill in the correct colours. 10 seconds per question.",
    type: "quiz",
    points: 80,
    timedDuration: 10,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w1-logo-hunt",
    week: 1,
    day: 3,
    title: "Logo Hunt",
    description:
      "Find the hidden LG logo inside our special World Cup illustration on the microsite. Easy if you look!",
    type: "hidden-hunt",
    points: 90,
    timedDuration: 10,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w1-jersey-flex",
    week: 1,
    day: 4,
    title: "Jersey Flex",
    description:
      "Wear your team's favorite jersey, snap a selfie, and upload it to the microsite!",
    type: "photo",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w1-oled-trivia",
    week: 1,
    day: 5,
    title: "LG Trivia: OLED Facts",
    description:
      "True or False: LG OLED TVs use self-lit pixels for perfect black levels. Answer 3 questions on the microsite!",
    type: "quiz",
    points: 100,
    timedDuration: 30,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w1-flag-pride",
    week: 1,
    day: 6,
    title: "Flag Pride",
    description:
      "Decorate any surface — wall, bag, desk — with your team flag and snap a photo. Show your pride!",
    type: "photo",
    points: 80,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w1-dream-screen",
    week: 1,
    day: 7,
    title: "Dream Screen Pick",
    description:
      "Go to lg.com and find the TV you would watch the World Cup Final on. Screenshot it and post your pick!",
    type: "external-visit",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },

  // Week 2
  {
    id: "w2-showroom",
    week: 2,
    day: 1,
    title: "Showroom Check-In",
    description:
      "Visit an LG showroom and check in on Facebook or Instagram with @LGBangladesh.",
    type: "photo",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w2-goal-no-goal",
    week: 2,
    day: 2,
    title: "Goal or No Goal?",
    description:
      "Answer whether ball freeze-frames are in or out of the goal. 20 seconds per picture.",
    type: "quiz",
    points: 80,
    timedDuration: 20,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w2-room-matchup",
    week: 2,
    day: 3,
    title: "Room Match-Up",
    description:
      "Drag-and-drop puzzle: match LG products to the correct rooms.",
    type: "drag-match",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w2-goal-reaction",
    week: 2,
    day: 4,
    title: "Goal Reaction Picture",
    description:
      "Upload a goal reaction moment — real or acted!",
    type: "photo",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w2-lg-quiz",
    week: 2,
    day: 5,
    title: "LG Quiz",
    description:
      "Fast tap poll: 3 questions about LG technologies (OLED, InstaView, Dolby Atmos).",
    type: "quiz",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w2-standee-selfie",
    week: 2,
    day: 6,
    title: "Standee Selfie",
    description:
      "Find the LG Superfan League standee at an LG outlet and take a selfie with it.",
    type: "photo",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w2-score-predict",
    week: 2,
    day: 7,
    title: "Score Prediction: Round of 16",
    description:
      "Select the top 8 teams that will advance to the knockout stage.",
    type: "predictor",
    points: 75,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },

  // Week 3
  {
    id: "w3-qf-predict",
    week: 3,
    day: 1,
    title: "Score Predictor: Quarter-Finals",
    description:
      "Predict the winning teams for all Quarter-Final matchups.",
    type: "predictor",
    points: 50,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w3-lg-tech",
    week: 3,
    day: 2,
    title: "LG x Football Tech",
    description:
      "Visit lg.com, find a feature that makes watching football better, and screenshot it.",
    type: "external-visit",
    points: 90,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w3-fastest-tap",
    week: 3,
    day: 3,
    title: "Fastest Tap Poll",
    description:
      "Answer 3 rapid-fire football rules questions — 10 seconds each!",
    type: "quiz",
    points: 80,
    timedDuration: 10,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w3-colour-match",
    week: 3,
    day: 4,
    title: "Colour Match Game",
    description:
      "Match color swatches to the correct LG products. 30 seconds max.",
    type: "drag-match",
    points: 70,
    timedDuration: 30,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w3-lightning-quiz",
    week: 3,
    day: 5,
    title: "Lightning Quiz",
    description:
      "Answer 3 football trivia questions about tournament history. 10 seconds total!",
    type: "quiz",
    points: 90,
    timedDuration: 10,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w3-wrong-answer",
    week: 3,
    day: 6,
    title: "Wrong Answer Only",
    description:
      "Choose the most hilariously wrong answer to football referee questions.",
    type: "quiz",
    points: 90,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w3-unscramble",
    week: 3,
    day: 7,
    title: "LG Product Unscramble",
    description:
      "Unscramble letters to guess LG products shown on the microsite. First 100 get bonus!",
    type: "unscramble",
    points: 100,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },

  // Week 4
  {
    id: "w4-sf-predict",
    week: 4,
    day: 1,
    title: "Score Prediction: Semi-Finals",
    description:
      "Select the top 4 powerhouse teams for the Semi-Finals.",
    type: "predictor",
    points: 60,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w4-beat-clue",
    week: 4,
    day: 2,
    title: "Beat the Clue",
    description:
      "Identify a team from progressive clues — faster answers earn more points!",
    type: "quiz",
    points: 100,
    timedDuration: 20,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w4-final-predict",
    week: 4,
    day: 3,
    title: "Final Prediction",
    description:
      "Choose which team will win the World Cup Final.",
    type: "predictor",
    points: 80,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w4-memory",
    week: 4,
    day: 4,
    title: "My Football Memory",
    description:
      "Share your all-time favourite World Cup moment in 1–2 sentences. Max 250 characters.",
    type: "comment",
    points: 80,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w4-maze-game",
    week: 4,
    day: 5,
    title: "Maze Game",
    description:
      "Identify the official LG Red from 4 colour swatches. 30 seconds!",
    type: "spot-count",
    points: 100,
    timedDuration: 30,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w4-lifes-good",
    week: 4,
    day: 6,
    title: "Life's Good Moment",
    description:
      'Share what "Life\'s Good" means to you this World Cup. Tag #LGSuperfanLeague.',
    type: "photo",
    points: 150,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
  {
    id: "w4-brand-trivia",
    week: 4,
    day: 7,
    title: "LG Brand Trivia",
    description:
      "Answer 3 questions about LG brand: slogan, logo, and product categories.",
    type: "quiz",
    points: 150,
    timedDuration: null,
    isActive: true,
    isDailySpecial: false,
  },
];

const INVOICE_MISSION_ID = "mega-bonus-invoice";

function InvoiceUpload({ userPhone }: { userPhone: string }) {
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [fileName, setFileName] = useState("");

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(file.type)) {
      setStatus("error");
      setFileName("Only JPG, PNG, WEBP or PDF allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setFileName("File must be under 5 MB");
      return;
    }

    setStatus("uploading");
    setFileName(file.name);

    try {
      // Upload file to Supabase Storage
      const ext = file.name.split(".").pop();
      const path = `invoices/${userPhone}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("mission-uploads")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("mission-uploads")
        .getPublicUrl(path);

      // Get user id
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("phone", userPhone)
        .single();

      if (user) {
        await supabase.from("mission_submissions").insert({
          mission_id: INVOICE_MISSION_ID,
          user_id: user.id,
          data: {
            invoice_url: publicUrl.publicUrl,
            file_name: file.name,
            type: "mega_bonus",
          },
          status: "pending",
          submitted_at: new Date().toISOString(),
        });
      }

      setStatus("success");
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("error");
      setFileName("Upload failed. Please try again.");
    }

    // Reset file input
    e.target.value = "";
  };

  if (status === "success") {
    return (
      <div className="w-full bg-green-50 border-2 border-green-400 rounded-xl p-4 flex items-center gap-3">
        <FlaticonIcon name="check" className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="text-green-800 font-bold text-sm">
            Invoice submitted!
          </p>
          <p className="text-green-600 text-xs">
            Our team will verify and credit your bonus points
            within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="w-full bg-red-dramatic text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={handleFile}
          disabled={status === "uploading"}
        />
        {status === "uploading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FlaticonIcon name="upload" className="w-4 h-4" />
            Upload Invoice →
          </>
        )}
      </label>
      {status === "error" && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
          <FlaticonIcon name="alert" className="w-4 h-4 flex-shrink-0" />
          <span>{fileName}</span>
        </div>
      )}
      {status === "uploading" && fileName && (
        <p className="mt-1 text-xs text-gray-500 text-center truncate">
          {fileName}
        </p>
      )}
    </div>
  );
}

interface MissionsListProps {
  userTeam: string;
  userPhone: string;
}

interface MissionStatus {
  mission_id: string;
  status: "pending" | "approved" | "rejected";
}

export const MISSION_ICONS: Record<string, FlaticonIconName> = {
  photo: "camera",
  quiz: "question",
  "spot-count": "search",
  "drag-match": "target",
  unscramble: "text",
  "hidden-hunt": "scan",
  comment: "message",
  predictor: "goal",
  video: "video",
  "external-visit": "map",
  "fan-art": "palette",
  "social-checkin": "badge-check",
  creative: "lightbulb",
  "rapid-tap": "gauge",
};

export function MissionsList({
  userTeam,
  userPhone,
}: MissionsListProps) {
  const [selectedMission, setSelectedMission] =
    useState<Mission | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<
    Set<string>
  >(new Set());

  const weeks = [1, 2, 3, 4];
  const missions = ALL_MISSIONS.filter(
    (m) => m.week === selectedWeek,
  );

  const handleMissionComplete = (
    missionId: string,
    _points: number,
  ) => {
    setCompletedMissions((prev) =>
      new Set(prev).add(missionId),
    );
    setSelectedMission(null);
  };

  return (
    <div className="space-y-6">
      {/* Mega Bonus Banner */}
      <div className="rounded-3xl overflow-hidden" style={{
        background: '#ffffff',
        boxShadow: '0 4px 32px rgba(200,0,44,0.12), 0 1px 4px rgba(0,0,0,0.06)',
        border: '1.5px solid rgba(200,0,44,0.15)',
      }}>
        {/* Gradient header strip */}
        <div className="relative overflow-hidden px-5 sm:px-7 pt-6 pb-6"
          style={{ background: 'linear-gradient(135deg, #C8002C 0%, #6b0016 60%, #1a0005 100%)' }}>
          {/* Subtle dot grid texture */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          {/* Top glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,180,0,0.25) 0%, transparent 70%)' }} />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(255,200,0,0.18)', border: '1px solid rgba(255,200,0,0.4)' }}>
                <FlaticonIcon name="zap" className="w-3 h-3" />
                <span className="text-yellow-300 font-black text-xs uppercase tracking-[0.18em]">Mega Bonus</span>
              </div>
              <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight">Buy LG. Win Bigger.</h2>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>Every LG Purchase = Mega Bonus</p>
            </div>
            <FlaticonIcon name="trophy" className="w-14 h-14 flex-shrink-0 mt-1" style={{ filter: 'drop-shadow(0 2px 12px rgba(255,200,0,0.5))' }} />
          </div>

          <p className="relative mt-4 text-xs sm:text-sm leading-relaxed pt-4" style={{ color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            Buy any LG product at an authorized outlet. Scan the QR on the standee or upload your invoice. Our AI verifies it instantly and credits bonus points to your fan profile.
          </p>
        </div>

        {/* Products Grid */}
        <div className="px-5 sm:px-7 py-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400 mb-3">Points by Product</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-5">
            {[
              { product: 'LG OLED / Smart TV (50"+)', points: '+400', icon: "tv" as FlaticonIconName, top: true },
              { product: 'LG Smart TV (32"–48")',      points: '+350', icon: "tv" as FlaticonIconName, top: false },
              { product: 'LG Refrigerator',            points: '+300', icon: "fridge" as FlaticonIconName, top: false },
              { product: 'LG Air Conditioner',         points: '+250', icon: "ac" as FlaticonIconName, top: false },
              { product: 'LG Washing Machine',         points: '+250', icon: "washer" as FlaticonIconName, top: false },
              { product: 'LG Soundbar / Speaker',      points: '+200', icon: "speaker" as FlaticonIconName, top: false },
              { product: 'LG Microwave / Appliance',   points: '+200', icon: "microwave" as FlaticonIconName, top: false },
              { product: 'Any 2 LG products (combo)',  points: '+400', icon: "combo-gift" as FlaticonIconName, top: true },
            ].map(({ product, points, icon, top }) => (
              <div key={product} className="flex flex-col items-center text-center gap-1 p-3 rounded-2xl transition-all" style={{
                background: top ? 'rgba(200,0,44,0.05)' : '#f8f7f5',
                border: top ? '1.5px solid rgba(200,0,44,0.2)' : '1.5px solid #ede8e0',
              }}>
                <FlaticonIcon name={icon} className="w-8 h-8" />
                <span className="text-xs text-gray-500 font-medium leading-tight">{product}</span>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="font-black text-lg leading-none" style={{ color: top ? '#C8002C' : '#333' }}>{points}</span>
                  <span className="text-xs font-bold text-gray-400">pts</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <InvoiceUpload userPhone={userPhone} />

          {/* Footer note */}
          <p className="text-xs text-center mt-4 text-gray-400 leading-relaxed">
            One scanned invoice = one verified buyer + one digital fan + one leaderboard contributor. Every store visit becomes a campaign asset.
          </p>
        </div>
      </div>

      {/* Week Selector */}
      <div className="bg-[#F0ECE4] rounded-xl p-4 shadow-sm">
        {/* Week tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { week: 1, name: 'Campaign Kickoff' },
            { week: 2, name: 'Heat Up' },
            { week: 3, name: 'Rivalry Reloaded' },
            { week: 4, name: 'The Final Sprint' },
          ].map(({ week, name }) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`flex-shrink-0 flex flex-col items-start px-4 py-2.5 rounded-xl transition-all ${
                selectedWeek === week
                  ? 'bg-lg-red text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-widest ${selectedWeek === week ? 'text-white/70' : 'text-gray-400'}`}>
                Week {week}
              </span>
              <span className="text-sm font-black leading-tight whitespace-nowrap">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active week heading */}
      {(() => {
        const WEEK_NAMES: Record<number, string> = {
          1: 'Campaign Kickoff', 2: 'Heat Up',
          3: 'Rivalry Reloaded', 4: 'The Final Sprint',
        };
        return (
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-lg-red flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Week {selectedWeek}</p>
              <h2 className="font-black text-gray-900 text-lg leading-tight">{WEEK_NAMES[selectedWeek]}</h2>
            </div>
          </div>
        );
      })()}

      {/* Missions Grid */}
      {missions.length === 0 ? (
        <div className="bg-[#F0ECE4] rounded-xl p-12 text-center">
          <FlaticonIcon name="lock" className="w-16 h-16 mx-auto mb-4 opacity-60" />
          <h3 className="text-xl font-bold mb-2">
            No missions for Week {selectedWeek}
          </h3>
          <p className="text-gray-600">
            Check back later or select a different week
          </p>
        </div>
      ) : (
        <div className="cyber-mission-grid fifa-mission-board rounded-2xl p-3 grid gap-2.5 grid-cols-2">
          {missions.map((mission, idx) => {
            const isCompleted = completedMissions.has(mission.id);
            const accent = '#222222';
            const missionIcon = MISSION_ICONS[mission.type] || "gamepad";

            return (
              <button
                key={mission.id}
                onClick={() => !isCompleted && setSelectedMission(mission)}
                disabled={isCompleted}
                className="cyber-mission-card relative text-left overflow-hidden"
                data-completed={isCompleted}
                style={{ '--mission-accent': accent } as CSSProperties}
              >
                <div className="cyber-mission-scan absolute inset-0 pointer-events-none" />
                <div className="cyber-mission-rail absolute top-0 left-5 right-5 h-px pointer-events-none" />

                {/* Corner brackets */}
                {[['top-1', 'left-1', 'borderTop', 'borderLeft'], ['top-1', 'right-1', 'borderTop', 'borderRight'], ['bottom-1', 'left-1', 'borderBottom', 'borderLeft'], ['bottom-1', 'right-1', 'borderBottom', 'borderRight']].map(([t, l, b1, b2], ci) => (
                  <span key={ci} className={`absolute ${t} ${l} w-2 h-2 pointer-events-none`} style={{
                    [b1]: `1.5px solid ${accent}`,
                    [b2]: `1.5px solid ${accent}`,
                  }} />
                ))}

                <div className="relative z-10 flex flex-col gap-2.5">
                  {/* Top row: number + icon */}
                  <div className="flex items-start justify-between">
                    <span className="cyber-mission-number font-black text-[10px] tracking-[0.24em]">
                      M-{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="cyber-mission-icon flex h-8 w-8 items-center justify-center">
                      <FlaticonIcon name={missionIcon} className="h-5 w-5" />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-[11px] sm:text-xs leading-snug line-clamp-2" style={{
                    color: '#171717',
                    letterSpacing: '0.055em',
                  }}>
                    {mission.title}
                  </h3>

                  {/* Divider */}
                  <div className="cyber-mission-divider w-full h-px" />

                  {/* Points + timer/status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FlaticonIcon name="trophy" className="w-3 h-3 flex-shrink-0" />
                      <span className="font-black text-[11px] sm:text-xs cyber-mission-accent" style={{ letterSpacing: '0.08em' }}>
                        {mission.points} XP
                      </span>
                    </div>
                    <div>
                      {isCompleted
                        ? <span className="flex items-center gap-1 text-[9px] font-black tracking-widest cyber-mission-accent"><FlaticonIcon name="check" className="w-3.5 h-3.5" /> CLEARED</span>
                        : mission.timedDuration
                          ? <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-black/45"><FlaticonIcon name="clock" className="w-3 h-3" /> {mission.timedDuration}S</span>
                          : <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-black/45"><FlaticonIcon name="play" className="w-3 h-3" /> INIT</span>
                      }
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Mission Modal */}
      {selectedMission && (
        <MissionModal
          mission={selectedMission}
          userPhone={userPhone}
          onClose={() => setSelectedMission(null)}
          onComplete={handleMissionComplete}
        />
      )}
    </div>
  );
}
