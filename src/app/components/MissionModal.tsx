import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Mission } from '../types/mission';
import { supabase } from '../../../utils/supabase/client';
import confetti from 'canvas-confetti';
import { FlaticonIcon } from "./FlaticonIcon";

// Week 1 mission images
import imgSpotProducts from '../../imports/image-9.png';
import imgFlag1 from '../../imports/image-10.png';
import imgFlag2 from '../../imports/image-11.png';
import imgFlag3 from '../../imports/image-12.png';
import imgLogoHunt from '../../imports/image-13.png';

// Week 2 mission images
import imgGoal1 from '../../imports/image.png';
import imgGoal2 from '../../imports/image-1.png';
import imgGoal3 from '../../imports/image-2.png';
import imgGoal4 from '../../imports/image-3.png';
import imgPuzzle1 from '../../imports/image-4.png';
import imgPuzzle2 from '../../imports/image-5.png';

// Week 3 mission images
import imgColour1 from '../../imports/image-6.png';
import imgColour2 from '../../imports/image-7.png';
import imgScramble1 from '../../imports/image-8.png';
import imgScramble2 from '../../imports/image-14.png';
import imgScramble3 from '../../imports/image-15.png';

// Week 4 mission images
import imgMaze1 from '../../imports/image-17.png';
import imgMaze2 from '../../imports/image-18.png';

interface MissionModalProps {
  mission: Mission;
  userPhone: string;
  onClose: () => void;
  onComplete: (missionId: string, points: number) => void;
}

export function MissionModal({ mission, userPhone, onClose, onComplete }: MissionModalProps) {
  const [step, setStep] = useState<'intro' | 'play' | 'submit' | 'success'>('intro');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mission.timedDuration || 0);

  useEffect(() => {
    if (step === 'play' && mission.timedDuration && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft, mission.timedDuration]);

  const handleStart = () => {
    setStep('play');
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setStep('submit');

    try {
      // Get user ID from phone
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (userError || !user) {
        console.error('Error getting user:', userError);
        alert('Failed to submit. Please try again.');
        setLoading(false);
        return;
      }

      // Save submission to database
      const { error: submissionError } = await supabase
        .from('mission_submissions')
        .insert({
          mission_id: mission.id,
          user_id: user.id,
          data: data,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (submissionError) {
        // Check if already submitted
        if (submissionError.code === '23505') {
          console.log('Mission already submitted');
        } else {
          console.error('Error saving submission:', submissionError);
          alert('Failed to submit. Please try again.');
          setLoading(false);
          return;
        }
      }

      console.log('✅ Mission submitted to database:', mission.id);

      setStep('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onComplete(mission.id, mission.points);
      }, 2000);
    } catch (err) {
      console.error('Error submitting mission:', err);
      alert('Failed to submit. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#F0ECE4] rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-red-dramatic text-white p-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FlaticonIcon name="trophy" className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{mission.title}</h2>
              <p className="text-sm opacity-90">{mission.points} points</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <span className="text-2xl leading-none">�</span>
          </button>
        </div>

        {/* Timer */}
        {mission.timedDuration && step === 'play' && (
          <div className="bg-lg-yellow text-gray-900 px-4 py-2 flex items-center justify-center gap-2 font-bold">
            <FlaticonIcon name="clock" className="w-5 h-5" />
            <span>{timeLeft}s remaining</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {step === 'intro' && (
            <IntroStep mission={mission} onStart={handleStart} />
          )}
          {step === 'play' && (
            <PlayStep mission={mission} onSubmit={handleSubmit} />
          )}
          {step === 'submit' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 animate-spin text-lg-red mx-auto mb-4" />
              <p className="text-lg font-semibold">Submitting your entry...</p>
            </div>
          )}
          {step === 'success' && (
            <div className="text-center py-12">
              <FlaticonIcon name="check" className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Mission Complete!</h3>
              <p className="text-gray-600 mb-4">You earned {mission.points} points</p>
              <div className="text-4xl font-bold text-lg-red animate-pulse">
                +{mission.points}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IntroStep({ mission, onStart }: { mission: Mission; onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-xl mb-2">Mission Briefing</h3>
        <p className="text-gray-700 leading-relaxed">{mission.description}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Mission Type:</span>
          <span className="font-semibold capitalize">{mission.type.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Reward:</span>
          <span className="font-bold text-lg-red">{mission.points} points</span>
        </div>
        {mission.timedDuration && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Time Limit:</span>
            <span className="font-semibold text-lg-purple">{mission.timedDuration} seconds</span>
          </div>
        )}
      </div>

      <button
        onClick={onStart}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Start Mission
      </button>
    </div>
  );
}

function PlayStep({ mission, onSubmit }: { mission: Mission; onSubmit: (data: any) => void }) {
  // Route by specific mission ID first, then fall back to type
  switch (mission.id) {
    case 'w1-spot-products':
      return <SpotLGProducts onSubmit={onSubmit} />;
    case 'w1-flag-quiz':
      return <FlagColourQuiz onSubmit={onSubmit} />;
    case 'w1-logo-hunt':
      return <LogoHunt onSubmit={onSubmit} />;
    case 'w1-jersey-flex':
      return <JerseyFlex onSubmit={onSubmit} />;
    case 'w1-oled-trivia':
      return <OLEDTrivia onSubmit={onSubmit} />;
    case 'w1-flag-pride':
      return <FlagPride onSubmit={onSubmit} />;
    case 'w1-dream-screen':
      return <DreamScreen onSubmit={onSubmit} />;

    // Week 2
    case 'w2-showroom':
      return <ShowroomCheckIn onSubmit={onSubmit} />;
    case 'w2-goal-no-goal':
      return <GoalOrNoGoal onSubmit={onSubmit} />;
    case 'w2-room-matchup':
      return <RoomMatchUp onSubmit={onSubmit} />;
    case 'w2-goal-reaction':
      return <GoalReaction onSubmit={onSubmit} />;
    case 'w2-lg-quiz':
      return <LGQuiz onSubmit={onSubmit} />;
    case 'w2-standee-selfie':
      return <StandeeSelfie onSubmit={onSubmit} />;
    case 'w2-score-predict':
      return <ScorePrediction onSubmit={onSubmit} />;

    // Week 3
    case 'w3-qf-predict':
      return <QFPredictor onSubmit={onSubmit} />;
    case 'w3-lg-tech':
      return <LGFootballTech onSubmit={onSubmit} />;
    case 'w3-fastest-tap':
      return <FastestTapPoll onSubmit={onSubmit} />;
    case 'w3-colour-match':
      return <ColourMatchGame onSubmit={onSubmit} />;
    case 'w3-lightning-quiz':
      return <LightningQuiz onSubmit={onSubmit} />;
    case 'w3-wrong-answer':
      return <WrongAnswerOnly onSubmit={onSubmit} />;
    case 'w3-unscramble':
      return <LGUnscramble onSubmit={onSubmit} />;

    // Week 4
    case 'w4-sf-predict':
      return <SFPredictor onSubmit={onSubmit} />;
    case 'w4-beat-clue':
      return <BeatTheClue onSubmit={onSubmit} />;
    case 'w4-final-predict':
      return <FinalPredictor onSubmit={onSubmit} />;
    case 'w4-memory':
      return <FootballMemory onSubmit={onSubmit} />;
    case 'w4-maze-game':
      return <MazeGame onSubmit={onSubmit} />;
    case 'w4-lifes-good':
      return <LifesGoodMoment onSubmit={onSubmit} />;
    case 'w4-brand-trivia':
      return <LGBrandTrivia onSubmit={onSubmit} />;

    default:
      break;
  }

  switch (mission.type) {
    case 'photo':
      return <PhotoUpload onSubmit={onSubmit} />;
    case 'video':
      return <VideoUpload onSubmit={onSubmit} />;
    case 'quiz':
      return <QuizMission onSubmit={onSubmit} />;
    case 'spot-count':
      return <SpotCountMission mission={mission} onSubmit={onSubmit} />;
    case 'drag-match':
      return <DragMatchMission onSubmit={onSubmit} />;
    case 'unscramble':
      return <UnscrambleMission onSubmit={onSubmit} />;
    case 'comment':
      return <CommentMission onSubmit={onSubmit} />;
    case 'predictor':
      return <PredictorMission onSubmit={onSubmit} />;
    case 'fan-art':
      return <FanArtMission onSubmit={onSubmit} />;
    default:
      return <GenericMission onSubmit={onSubmit} />;
  }
}

// ── Week 1 Specific Missions ─────────────────────────────────────

function useCountdown(seconds: number, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    if (timeLeft <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);
  const reset = (s: number) => setTimeLeft(s);
  return { timeLeft, reset };
}

function TimerBar({ timeLeft, total, color = 'bg-lg-red' }: { timeLeft: number; total: number; color?: string }) {
  const pct = Math.max(0, (timeLeft / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div
        className={`${color} h-2 rounded-full transition-all duration-1000`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// 1. Spot the LG Products
function SpotLGProducts({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [answer, setAnswer] = useState('');
  const [expired, setExpired] = useState(false);
  const { timeLeft } = useCountdown(15, () => setExpired(true));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-gray-600">Count LG products in the image</span>
        <span className={`flex items-center gap-1 ${timeLeft <= 5 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={15} />
      <img src={imgSpotProducts} alt="Living room with LG products" className="w-full rounded-xl object-contain max-h-64 bg-gray-100" />
      <div>
        <label className="block text-sm font-semibold mb-2">How many LG products can you count?</label>
        <input
          type="number"
          min="0"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          disabled={expired}
          placeholder="Enter your count..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red outline-none text-center text-2xl font-bold"
        />
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={() => onSubmit({ answer, timeExpired: expired })}
        disabled={!answer}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
}

// 2. Team Flag Colour Quiz
const FLAG_QUESTIONS = [
  { image: imgFlag1, question: 'Question 1: Identify the correct flag colours' },
  { image: imgFlag2, question: 'Question 2: Identify the correct flag colours' },
  { image: imgFlag3, question: 'Question 3: Identify the correct flag colours' },
];
const FLAG_OPTIONS = [
  ['Red & White', 'Blue & White', 'Green & Gold', 'Red & Blue'],
  ['Red & Yellow', 'Blue & White', 'Green & White', 'Black & Red'],
  ['Orange & White', 'Red & Green', 'Blue & Yellow', 'White & Red'],
];

function FlagColourQuiz({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(10, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, selected || 'skipped'];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < FLAG_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      reset(10);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const q = FLAG_QUESTIONS[qIndex];
  const opts = FLAG_OPTIONS[qIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Question {qIndex + 1} / {FLAG_QUESTIONS.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 3 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={10} color="bg-yellow-400" />
      <p className="font-semibold text-gray-800">{q.question}</p>
      <img src={q.image} alt={`Flag question ${qIndex + 1}`} className="w-full rounded-xl object-contain max-h-52 bg-gray-50 border border-gray-200" />
      <div className="grid grid-cols-2 gap-3">
        {opts.map((opt, idx) => {
          const label = ['A', 'B', 'C', 'D'][idx];
          return (
            <button
              key={opt}
              disabled={expired}
              onClick={() => setSelected(opt)}
              className={`flex items-center justify-center p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                selected === opt ? 'border-lg-red bg-lg-red/10 text-lg-red' : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-base flex-shrink-0 ${
                selected === opt ? 'bg-lg-red text-white' : 'bg-gray-100 text-gray-600'
              }`}>{label}</span>
            </button>
          );
        })}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up for this question!</p>}
      <button
        onClick={handleNext}
        disabled={!selected && !expired}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < FLAG_QUESTIONS.length - 1 ? 'Next Question →' : 'Submit All Answers'}
      </button>
    </div>
  );
}

// 3. Logo Hunt
function LogoHunt({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [answer, setAnswer] = useState('');
  const [expired, setExpired] = useState(false);
  const { timeLeft } = useCountdown(10, () => setExpired(true));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-gray-600">Find the hidden LG logo!</span>
        <span className={`flex items-center gap-1 ${timeLeft <= 3 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={10} color="bg-purple-500" />
      <img src={imgLogoHunt} alt="World Cup illustration — find the LG logo" className="w-full rounded-xl object-contain max-h-64 bg-gray-100" />
      <div>
        <label className="block text-sm font-semibold mb-2">Where did you find the LG logo? (describe the location)</label>
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          disabled={expired}
          placeholder="e.g. top-left corner, on the billboard..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red outline-none"
        />
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={() => onSubmit({ answer, timeExpired: expired })}
        disabled={!answer}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
}

// 4. Jersey Flex
function JerseyFlex({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB'); return; }
    if (!['image/jpeg','image/png'].includes(file.type)) { setError('Only JPG / PNG allowed'); return; }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="bg-lg-red/5 border border-lg-red/20 rounded-xl p-4 text-sm text-gray-700 space-y-1">
        <p className="font-bold text-lg-red text-base">Jersey Flex</p>
        <p>Wear your team's favorite jersey, snap a selfie, and upload it!</p>
        <p className="text-xs text-gray-500 mt-2">📎 Format: JPG / PNG &nbsp;•&nbsp; Max size: 5 MB</p>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-lg-red transition-colors">
        {preview ? (
          <img src={preview} alt="Jersey selfie" className="max-h-60 mx-auto rounded-lg mb-3 object-contain" />
        ) : (
          <div className="text-6xl mb-3">👕</div>
        )}
        <label className="cursor-pointer">
          <span className="text-lg-red font-semibold hover:underline">{preview ? 'Change Photo' : 'Upload Selfie'}</span>
          <input type="file" accept="image/jpeg,image/png" onChange={handleFile} className="hidden" />
        </label>
      </div>
      {error && <p className="text-lg-red text-sm flex items-center gap-1"><FlaticonIcon name="alert" className="w-4 h-4" />{error}</p>}
      <button
        onClick={() => onSubmit({ photo: preview })}
        disabled={!preview}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Selfie
      </button>
    </div>
  );
}

// 5. LG Trivia: OLED Facts
const OLED_QUESTIONS = [
  { q: 'To display the color "Perfect Black," an LG OLED TV completely turns off individual pixels in dark areas.', correct: true },
  { q: 'The picture quality and colors on an LG OLED TV look exactly the same, even if you are watching from a wide side-angle.', correct: true },
  { q: 'LG OLED TVs only support basic stereo sound and cannot play advanced cinema audio formats like Dolby Atmos.', correct: false },
];

function OLEDTrivia({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(30, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, selected ?? false];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < OLED_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      reset(30);
    } else {
      onSubmit({ answers: newAnswers.map((a, i) => ({ question: i + 1, answer: a ? 'True' : 'False' })) });
    }
  };

  const q = OLED_QUESTIONS[qIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Question {qIndex + 1} / {OLED_QUESTIONS.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 10 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={30} color="bg-blue-500" />
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-xs font-bold text-blue-500 uppercase mb-2">True or False?</p>
        <p className="font-semibold text-gray-900 leading-relaxed">{q.q}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[true, false].map(val => (
          <button
            key={String(val)}
            disabled={expired}
            onClick={() => setSelected(val)}
            className={`py-4 rounded-xl border-2 font-black text-lg transition-all ${
              selected === val
                ? val ? 'border-green-500 bg-green-50 text-green-600' : 'border-lg-red bg-lg-red/10 text-lg-red'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {val ? '✅ True' : '❌ False'}
          </button>
        ))}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up for this question!</p>}
      <button
        onClick={handleNext}
        disabled={selected === null && !expired}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < OLED_QUESTIONS.length - 1 ? 'Next Question →' : 'Submit All Answers'}
      </button>
    </div>
  );
}

// 6. Flag Pride
function FlagPride({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB'); return; }
    if (!['image/jpeg','image/png'].includes(file.type)) { setError('Only JPG / PNG allowed'); return; }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm text-gray-700 space-y-1">
        <p className="font-bold text-yellow-700 text-base">Flag Pride</p>
        <p>Decorate any surface (wall, desk, or bag) with your team flag, take a photo, and show your support!</p>
        <p className="text-xs text-gray-500 mt-2">📎 Format: JPG / PNG &nbsp;•&nbsp; Max size: 5 MB</p>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-yellow-400 transition-colors">
        {preview ? (
          <img src={preview} alt="Flag pride" className="max-h-60 mx-auto rounded-lg mb-3 object-contain" />
        ) : (
          <div className="text-6xl mb-3">🚩</div>
        )}
        <label className="cursor-pointer">
          <span className="text-yellow-600 font-semibold hover:underline">{preview ? 'Change Photo' : 'Upload Photo'}</span>
          <input type="file" accept="image/jpeg,image/png" onChange={handleFile} className="hidden" />
        </label>
      </div>
      {error && <p className="text-lg-red text-sm flex items-center gap-1"><FlaticonIcon name="alert" className="w-4 h-4" />{error}</p>}
      <button
        onClick={() => onSubmit({ photo: preview })}
        disabled={!preview}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Photo
      </button>
    </div>
  );
}

// 7. Dream Screen Pick
function DreamScreen({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setError('File must be under 3 MB'); return; }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700 space-y-1">
        <p className="font-bold text-blue-700 text-base">Dream Screen Pick</p>
        <p>Go to lg.com, find your dream World Cup TV, screenshot it, and upload your pick here!</p>
        <a href="https://lg.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-blue-600 font-semibold hover:underline text-xs">→ Visit lg.com</a>
        <p className="text-xs text-gray-500 mt-2">📎 Format: JPG / PNG / Screenshot &nbsp;•&nbsp; Max size: 3 MB</p>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
        {preview ? (
          <img src={preview} alt="Dream screen pick" className="max-h-60 mx-auto rounded-lg mb-3 object-contain" />
        ) : (
          <div className="text-6xl mb-3">📺</div>
        )}
        <label className="cursor-pointer">
          <span className="text-blue-600 font-semibold hover:underline">{preview ? 'Change Screenshot' : 'Upload Screenshot'}</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
      {error && <p className="text-lg-red text-sm flex items-center gap-1"><FlaticonIcon name="alert" className="w-4 h-4" />{error}</p>}
      <button
        onClick={() => onSubmit({ screenshot: preview })}
        disabled={!preview}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Pick
      </button>
    </div>
  );
}

function PhotoUpload({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [preview, setPreview] = useState<string>('');
  const [caption, setCaption] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-lg-red transition-colors">
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
        ) : (
          <FlaticonIcon name="upload" className="w-16 h-16 mx-auto mb-4 opacity-60" />
        )}
        <label className="cursor-pointer">
          <span className="text-lg-red font-semibold hover:underline">
            {preview ? 'Change Photo' : 'Upload Photo'}
          </span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Add a caption (optional)</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none resize-none"
          rows={3}
          placeholder="Share your thoughts..."
        />
      </div>

      <button
        onClick={() => onSubmit({ photo: preview, caption })}
        disabled={!preview}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Photo
      </button>
    </div>
  );
}

function VideoUpload({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <FlaticonIcon name="upload" className="w-16 h-16 mx-auto mb-4 opacity-60" />
        <label className="cursor-pointer">
          <span className="text-lg-red font-semibold hover:underline">Upload Video</span>
          <input type="file" accept="video/*" className="hidden" />
        </label>
        <p className="text-sm text-gray-500 mt-2">Max 30 seconds</p>
      </div>
      <button
        onClick={() => onSubmit({ video: 'placeholder.mp4' })}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
      >
        Submit Video
      </button>
    </div>
  );
}

function QuizMission({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const questions = [
    { id: 1, text: 'Which LG technology provides perfect blacks and infinite contrast?' },
  ];
  const options = ['QLED', 'OLED', 'LED', 'Plasma'];

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-lg">{questions[0].text}</p>
      </div>
      <div className="space-y-3">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
              selected === idx
                ? 'border-lg-deep-purple bg-lg-deep-purple/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={() => onSubmit({ answer: selected })}
        disabled={selected === null}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Answer
      </button>
    </div>
  );
}

function SpotCountMission({ mission, onSubmit }: { mission: Mission; onSubmit: (data: any) => void }) {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-4">
      <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Image with LG products would appear here</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">How many LG products do you see?</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none text-center text-2xl font-bold"
          min="0"
        />
      </div>
      <button
        onClick={() => onSubmit({ count })}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
      >
        Submit Count
      </button>
    </div>
  );
}

function DragMatchMission({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600">Drag and match teams with their flag colors</p>
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-500">Interactive drag-and-drop interface would appear here</p>
      </div>
      <button
        onClick={() => onSubmit({ matches: [] })}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
      >
        Submit Matches
      </button>
    </div>
  );
}

function UnscrambleMission({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [answer, setAnswer] = useState('');

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-2xl font-bold tracking-widest mb-2">DEOL</p>
        <p className="text-sm text-gray-600">Unscramble the LG product name</p>
      </div>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none text-center text-xl font-semibold uppercase"
        placeholder="Your answer"
      />
      <button
        onClick={() => onSubmit({ answer })}
        disabled={!answer}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
}

function CommentMission({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [comment, setComment] = useState('');

  return (
    <div className="space-y-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none resize-none"
        rows={6}
        placeholder="Share your thoughts, pride, or prediction..."
      />
      <button
        onClick={() => onSubmit({ comment })}
        disabled={!comment}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Comment
      </button>
    </div>
  );
}

function PredictorMission({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="text-4xl mb-2">🇦🇷</div>
            <p className="font-semibold">Argentina</p>
          </div>
          <div className="text-2xl font-bold text-gray-400">vs</div>
          <div className="text-center flex-1">
            <div className="text-4xl mb-2">🇧🇷</div>
            <p className="font-semibold">Brazil</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <input
            type="number"
            value={team1Score}
            onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
            className="w-20 h-20 text-center text-3xl font-bold rounded-xl border-2 border-gray-300 focus:border-lg-red outline-none"
            min="0"
            max="20"
          />
          <span className="text-2xl font-bold">-</span>
          <input
            type="number"
            value={team2Score}
            onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
            className="w-20 h-20 text-center text-3xl font-bold rounded-xl border-2 border-gray-300 focus:border-lg-red outline-none"
            min="0"
            max="20"
          />
        </div>
      </div>
      <button
        onClick={() => onSubmit({ prediction: `${team1Score}-${team2Score}` })}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
      >
        Submit Prediction
      </button>
    </div>
  );
}

function FanArtMission({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600">Create and upload your LG x FIFA fan art</p>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        {preview ? (
          <img src={preview} alt="Fan Art" className="max-h-80 mx-auto rounded-lg mb-4" />
        ) : (
          <div className="text-6xl mb-4">🎨</div>
        )}
        <label className="cursor-pointer">
          <span className="text-lg-red font-semibold hover:underline">
            {preview ? 'Change Artwork' : 'Upload Artwork'}
          </span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      <button
        onClick={() => onSubmit({ artwork: preview })}
        disabled={!preview}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
      >
        Submit Fan Art
      </button>
    </div>
  );
}

function GenericMission({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <p className="text-gray-600">Complete the mission requirement</p>
      </div>
      <button
        onClick={() => onSubmit({ completed: true })}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
      >
        Mark as Complete
      </button>
    </div>
  );
}

// ── Week 2 Specific Missions ─────────────────────────────────────

// Helper: photo upload with custom instructions
function PhotoUploadMission({
  onSubmit, heading, instruction, maxMB = 5, accent = 'lg-red',
}: {
  onSubmit: (data: any) => void;
  heading: string;
  instruction: string;
  maxMB?: number;
  accent?: string;
}) {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMB * 1024 * 1024) { setError(`File must be under ${maxMB} MB`); return; }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1">
        <p className="font-bold text-gray-900 text-base">{heading}</p>
        <p className="text-sm text-gray-600">{instruction}</p>
        <p className="text-xs text-gray-400 mt-1">📎 JPG / PNG &nbsp;•&nbsp; Max {maxMB} MB</p>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-lg-red transition-colors">
        {preview
          ? <img src={preview} alt="Upload preview" className="max-h-56 mx-auto rounded-lg mb-3 object-contain" />
          : <div className="text-5xl mb-3">📸</div>}
        <label className="cursor-pointer">
          <span className="text-lg-red font-semibold hover:underline">{preview ? 'Change Photo' : 'Upload Photo'}</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={() => onSubmit({ photo: preview })}
        disabled={!preview}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
}

// W2-1: Showroom Check-In
function ShowroomCheckIn({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <PhotoUploadMission
      onSubmit={onSubmit}
      heading="Showroom Check-In"
      instruction="Visit any official LG showroom. Check in on Facebook or Instagram, tag @LGSUPERFAN, and upload a screenshot of your post here!"
      maxMB={3}
    />
  );
}

// W2-2: Goal or No Goal
const GOAL_IMAGES = [
  { src: imgGoal1, answer: 'goal' },
  { src: imgGoal2, answer: 'no-goal' },
  { src: imgGoal3, answer: 'goal' },
  { src: imgGoal4, answer: 'goal' },
];

function GoalOrNoGoal({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(20, () => setExpired(true));

  const handleAnswer = (ans: string) => {
    if (selected || expired) return;
    setSelected(ans);
    const newAnswers = [...answers, ans];
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);
      setExpired(false);
      if (qIndex < GOAL_IMAGES.length - 1) {
        setQIndex(qIndex + 1);
        reset(20);
      } else {
        onSubmit({ answers: newAnswers });
      }
    }, 600);
  };

  const img = GOAL_IMAGES[qIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Picture {qIndex + 1} / {GOAL_IMAGES.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={20} color="bg-green-500" />
      <img src={img.src} alt={`Goal scene ${qIndex + 1}`} className="w-full rounded-xl object-cover max-h-56" />
      <p className="text-center text-sm font-semibold text-gray-600">Was it in or not?</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer('goal')}
          disabled={!!selected || expired}
          className={`py-4 rounded-xl font-black text-lg transition-all border-2 ${
            selected === 'goal' ? 'bg-green-500 border-green-500 text-white scale-95' : 'border-green-500 text-green-600 hover:bg-green-50'
          }`}
        >
          ⚽ GOAL!
        </button>
        <button
          onClick={() => handleAnswer('no-goal')}
          disabled={!!selected || expired}
          className={`py-4 rounded-xl font-black text-lg transition-all border-2 ${
            selected === 'no-goal' ? 'bg-lg-red border-lg-red text-white scale-95' : 'border-lg-red text-lg-red hover:bg-red-50'
          }`}
        >
          ✋ NO GOAL
        </button>
      </div>
      {expired && (
        <button
          onClick={() => handleAnswer('skipped')}
          className="w-full bg-gray-300 text-gray-700 font-bold py-3 rounded-xl"
        >
          ⏰ Time's up — Next →
        </button>
      )}
    </div>
  );
}

// W2-3: LG Room Match-Up
const PUZZLE_IMAGES = [imgPuzzle1, imgPuzzle2];

function RoomMatchUp({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(20, () => setExpired(true));

  const options = [['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'D']];

  const handleNext = () => {
    const newAnswers = [...answers, selected || 'skipped'];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < PUZZLE_IMAGES.length - 1) {
      setQIndex(qIndex + 1);
      reset(20);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Puzzle {qIndex + 1} / {PUZZLE_IMAGES.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={20} color="bg-purple-500" />
      <img src={PUZZLE_IMAGES[qIndex]} alt={`Room puzzle ${qIndex + 1}`} className="w-full rounded-xl object-contain max-h-56 bg-gray-50" />
      <p className="text-center text-sm font-semibold text-gray-700">Select the correct missing piece:</p>
      <div className="grid grid-cols-4 gap-3">
        {options[qIndex].map(opt => (
          <button
            key={opt}
            disabled={expired}
            onClick={() => setSelected(opt)}
            className={`py-4 rounded-xl border-2 font-black text-xl transition-all ${
              selected === opt ? 'border-lg-red bg-lg-red/10 text-lg-red' : 'border-gray-200 hover:border-gray-400 text-gray-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={handleNext}
        disabled={!selected && !expired}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < PUZZLE_IMAGES.length - 1 ? 'Next Puzzle →' : 'Submit Answers'}
      </button>
    </div>
  );
}

// W2-4: Goal Reaction Picture
function GoalReaction({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <PhotoUploadMission
      onSubmit={onSubmit}
      heading="Goal Reaction Picture"
      instruction="Give a goal reaction picture (real or acted) and upload your celebration!"
      maxMB={5}
    />
  );
}

// W2-5: LG Quiz (Fast Tap Poll)
const LG_QUIZ_QUESTIONS = [
  {
    q: 'Which premium display technology is LG globally famous for inventing, pioneering, and leading in the TV market?',
    options: ['A) Plasma', 'B) QLED', 'C) OLED'],
    correct: 'C',
  },
  {
    q: 'What is the name of the LG refrigerator technology that lets you knock twice on the glass panel to see what\'s inside without opening the door?',
    options: ['A) Door-in-Door', 'B) InstaView', 'C) SmartView'],
    correct: 'B',
  },
  {
    q: 'Which premium, 3D surround sound audio format is built directly into premium LG OLED TVs to simulate a movie theater or stadium experience?',
    options: ['A) Mega Bass', 'B) Dolby Atmos', 'C) MP3 Surround'],
    correct: 'B',
  },
];

function LGQuiz({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(15, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, selected || 'skipped'];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < LG_QUIZ_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      reset(15);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const q = LG_QUIZ_QUESTIONS[qIndex];

  return (
    <div className="space-y-4">
      <div className="bg-lg-red/5 border border-lg-red/20 rounded-xl px-4 py-2 text-center">
        <p className="text-lg-red font-black text-sm uppercase tracking-widest">Fast Tap Poll — Faster Answer, More Points!</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Q{qIndex + 1} / {LG_QUIZ_QUESTIONS.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={15} color="bg-lg-red" />
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-gray-900 leading-snug">{q.q}</p>
      </div>
      <div className="space-y-2">
        {q.options.map((opt) => {
          const letter = opt[0];
          return (
            <button
              key={opt}
              disabled={expired}
              onClick={() => setSelected(letter)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                selected === letter ? 'border-lg-red bg-lg-red/10 text-lg-red' : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 ${
                selected === letter ? 'bg-lg-red text-white' : 'bg-gray-100 text-gray-600'
              }`}>{letter}</span>
              {opt.substring(3)}
            </button>
          );
        })}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={handleNext}
        disabled={!selected && !expired}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < LG_QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'Submit Answers'}
      </button>
    </div>
  );
}

// W2-6: Standee Selfie
function StandeeSelfie({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <PhotoUploadMission
      onSubmit={onSubmit}
      heading="Standee Selfie"
      instruction="Find the LG Superfan League standee at your nearest LG outlet, snap a quick selfie with it, and upload it!"
      maxMB={5}
    />
  );
}

// W2-7: Score Prediction Round of 16
const ALL_TEAMS = [
  'Algeria','Argentina','Australia','Austria','Belgium','Bosnia & Herzegovina',
  'Brazil','Cabo Verde','Canada','Colombia','Congo DR',"Côte d'Ivoire",
  'Croatia','Curaçao','Czechia','Ecuador','Egypt','England','France','Germany',
  'Ghana','Haiti','Iran','Iraq','Japan','Jordan','Mexico','Morocco',
  'Netherlands','New Zealand','Norway','Panama','Paraguay','Portugal',
  'Qatar','Saudi Arabia','Scotland','Senegal','South Africa','South Korea',
  'Spain','Sweden','Switzerland','Tunisia','Türkiye','United States',
  'Uruguay','Uzbekistan',
];

// ── Week 3 Specific Missions ─────────────────────────────────────

// W3-1: QF Predictor
const QF_TEAMS = [
  'Algeria','Argentina','Australia','Austria','Belgium','Bosnia & Herzegovina',
  'Brazil','Cabo Verde','Canada','Colombia','Congo DR',"Côte d'Ivoire",
  'Croatia','Curaçao','Czechia','Ecuador','Egypt','England','France','Germany',
  'Ghana','Haiti','Iran','Iraq','Japan','Jordan','Mexico','Morocco',
  'Netherlands','New Zealand','Norway','Panama','Paraguay','Portugal',
  'Qatar','Saudi Arabia','Scotland','Senegal','South Africa','South Korea',
  'Spain','Sweden','Switzerland','Tunisia','Türkiye','United States',
  'Uruguay','Uzbekistan',
];
const QF_MATCHUPS = [
  { id: 'qf1', label: 'QF Match 1' },
  { id: 'qf2', label: 'QF Match 2' },
  { id: 'qf3', label: 'QF Match 3' },
  { id: 'qf4', label: 'QF Match 4' },
];

function QFPredictor({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [picks, setPicks] = useState<Record<string, string>>({});

  const allPicked = QF_MATCHUPS.every(m => picks[m.id]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="font-bold text-blue-800">Score Prediction: Quarter-Finals</p>
        <p className="text-sm text-blue-700 mt-1">Predict the winning teams for the high-stakes Quarter-Final matchups!</p>
        <p className="text-xs text-blue-500 mt-1">No upload required — just select your picks.</p>
      </div>
      <div className="space-y-3">
        {QF_MATCHUPS.map(m => (
          <div key={m.id}>
            <label className="block text-sm font-bold text-gray-700 mb-1">{m.label} — Who wins?</label>
            <select
              value={picks[m.id] || ''}
              onChange={e => setPicks({ ...picks, [m.id]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red outline-none text-sm"
            >
              <option value="">Select a team…</option>
              {QF_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSubmit({ picks })}
        disabled={!allPicked}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {allPicked ? 'Submit Predictions' : 'Pick all 4 winners to continue'}
      </button>
    </div>
  );
}

// W3-2: LG x Football Tech
function LGFootballTech({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <PhotoUploadMission
      onSubmit={onSubmit}
      heading="LG Football Tech"
      instruction="Visit lg.com and find one feature that makes watching football better on LG. Screenshot and share it!"
      maxMB={5}
    />
  );
}

// W3-3: Fastest Tap Poll
const FASTEST_TAP_QUESTIONS = [
  {
    q: 'How many halves are played in a standard football match?',
    options: ['1 Half', '2 Halves', '4 Quarters'],
    correct: '2 Halves',
  },
  {
    q: 'Which part of the body is a player (other than the goalkeeper) strictly forbidden from using?',
    options: ['The Head', 'The Chest', 'The Hands'],
    correct: 'The Hands',
  },
  {
    q: 'How many yellow cards equal a red card and an automatic ejection?',
    options: ['1 Yellow Card', '2 Yellow Cards', '3 Yellow Cards'],
    correct: '2 Yellow Cards',
  },
];

function FastestTapPoll({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(10, () => setExpired(true));

  const handlePick = (opt: string) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    setExpired(false);
    if (qIndex < FASTEST_TAP_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      reset(10);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const q = FASTEST_TAP_QUESTIONS[qIndex];

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-center">
        <p className="text-orange-700 font-black text-sm uppercase tracking-widest">⚡ Three rapid-fire questions — one tap each!</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Q{qIndex + 1} / {FASTEST_TAP_QUESTIONS.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 3 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={10} color="bg-orange-400" />
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-gray-900 leading-snug">{q.q}</p>
      </div>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            disabled={expired}
            className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 font-semibold text-sm transition-all"
          >
            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-black flex items-center justify-center flex-shrink-0">
              {['A','B','C'][i]}
            </span>
            {opt}
          </button>
        ))}
      </div>
      {expired && (
        <button onClick={() => handlePick('skipped')} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">
          ⏰ Time's up — Next →
        </button>
      )}
    </div>
  );
}

// W3-4: Colour Match Game
const COLOUR_MATCH_DATA = [
  { image: imgColour1, correct: 'B', label: 'Living Room' },
  { image: imgColour2, correct: 'A', label: 'Bedroom' },
];

function ColourMatchGame({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(15, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, selected || 'skipped'];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < COLOUR_MATCH_DATA.length - 1) {
      setQIndex(qIndex + 1);
      reset(15);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const q = COLOUR_MATCH_DATA[qIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Scene {qIndex + 1} / {COLOUR_MATCH_DATA.length} — {q.label}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={15} color="bg-pink-500" />
      <img src={q.image} alt={`Colour match scene ${qIndex + 1}`} className="w-full rounded-xl object-contain max-h-52" />
      <p className="text-center text-sm font-semibold text-gray-700">Which LG product fits best in this scene?</p>
      <div className="grid grid-cols-3 gap-3">
        {['A', 'B', 'C'].map(opt => (
          <button
            key={opt}
            disabled={expired}
            onClick={() => setSelected(opt)}
            className={`py-4 rounded-xl border-2 font-black text-2xl transition-all ${
              selected === opt ? 'border-lg-red bg-lg-red/10 text-lg-red scale-95' : 'border-gray-200 hover:border-gray-400 text-gray-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={handleNext}
        disabled={!selected && !expired}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < COLOUR_MATCH_DATA.length - 1 ? 'Next Scene →' : 'Submit Answers'}
      </button>
    </div>
  );
}

// W3-5: Lightning Quiz
const LIGHTNING_QUESTIONS = [
  {
    q: 'Name the only nation in football history to have won the cup 5 times.',
    options: ['a. Brazil', 'b. Germany', 'c. Uruguay'],
    correct: 'a',
  },
  {
    q: 'Which country defeated Croatia 4-2 in the final to lift the 2018 trophy?',
    options: ['a. Spain', 'b. Germany', 'c. France'],
    correct: 'c',
  },
  {
    q: 'Which European country hosted the 2018 tournament?',
    options: ['a. Italy', 'b. Japan', 'c. Russia'],
    correct: 'c',
  },
];

function LightningQuiz({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(10, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, selected || 'skipped'];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < LIGHTNING_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      reset(10);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const q = LIGHTNING_QUESTIONS[qIndex];

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-2 text-center">
        <p className="text-yellow-800 font-black text-sm uppercase tracking-widest">⚡ Lightning Quiz — 10 seconds to answer!</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Q{qIndex + 1} / {LIGHTNING_QUESTIONS.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 3 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={10} color="bg-yellow-400" />
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-gray-900 leading-snug">{q.q}</p>
      </div>
      <div className="space-y-2">
        {q.options.map(opt => {
          const letter = opt[0];
          return (
            <button
              key={opt}
              disabled={expired}
              onClick={() => setSelected(letter)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                selected === letter ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:border-yellow-400 text-gray-700'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 ${
                selected === letter ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600'
              }`}>{letter.toUpperCase()}</span>
              {opt.substring(3)}
            </button>
          );
        })}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={handleNext}
        disabled={!selected && !expired}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < LIGHTNING_QUESTIONS.length - 1 ? 'Next Question →' : 'Submit Answers'}
      </button>
    </div>
  );
}

// W3-6: Wrong Answer Only
const WRONG_ANSWER_QUESTIONS = [
  {
    q: 'Why do defenders stand shoulder-to-shoulder to form a "Wall" during a free kick?',
    options: [
      'To physically block the ball\'s direct path to the goal net.',
      'To block the bright stadium sun out of the goalkeeper\'s eyes.',
    ],
    wrong: 1,
  },
  {
    q: 'What is the referee actually doing when they run over to check the VAR screen?',
    options: [
      'Reviewing a critical foul or offside replay.',
      'Checking if their online food delivery order has arrived yet.',
    ],
    wrong: 1,
  },
  {
    q: 'Why does the referee add extra "Stoppage Time" minutes at the end of a half?',
    options: [
      'To make up for time lost due to injuries, substitutions, and delays.',
      'Because the stadium DJ needs a few more minutes to find a good playlist.',
    ],
    wrong: 1,
  },
];

function WrongAnswerOnly({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const handleNext = () => {
    const newAnswers = [...answers, selected ?? -1];
    setAnswers(newAnswers);
    setSelected(null);
    if (qIndex < WRONG_ANSWER_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const q = WRONG_ANSWER_QUESTIONS[qIndex];

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-center">
        <p className="text-purple-700 font-black text-sm uppercase tracking-widest">😂 Wrong Answers Only!</p>
        <p className="text-purple-600 text-xs mt-0.5">Pick the most hilariously wrong answer</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Q{qIndex + 1} / {WRONG_ANSWER_QUESTIONS.length}</span>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-gray-900 leading-snug">{q.q}</p>
      </div>
      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 font-medium text-sm transition-all text-left ${
              selected === i ? 'border-purple-500 bg-purple-50 text-purple-800' : 'border-gray-200 hover:border-purple-300 text-gray-700'
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 mt-0.5 ${
              selected === i ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>{['A','B'][i]}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={selected === null}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < WRONG_ANSWER_QUESTIONS.length - 1 ? 'Next Question →' : 'Submit Answers'}
      </button>
    </div>
  );
}

// W3-7: LG Product Unscramble
const UNSCRAMBLE_WORDS = [
  { image: imgScramble1, hint: 'The powerhouse "heart" of an LG refrigerator or AC that circulates the cooling.', answer: 'COMPRESSOR' },
  { image: imgScramble2, hint: 'The smart technology inside LG appliances that saves energy and cuts down electricity bills.', answer: 'INVERTER' },
  { image: imgScramble3, hint: 'The tiny dots of light that make up every image on an LG display screen.', answer: 'PIXELS' },
];

function LGUnscramble({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(30, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, input.trim().toUpperCase() || 'skipped'];
    setAnswers(newAnswers);
    setInput('');
    setExpired(false);
    if (qIndex < UNSCRAMBLE_WORDS.length - 1) {
      setQIndex(qIndex + 1);
      reset(30);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const w = UNSCRAMBLE_WORDS[qIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Word {qIndex + 1} / {UNSCRAMBLE_WORDS.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 10 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={30} color="bg-green-500" />
      <img src={w.image} alt={`Unscramble word ${qIndex + 1}`} className="w-full rounded-xl object-contain max-h-52 bg-pink-50" />
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Hint</p>
        <p className="text-sm text-gray-700">{w.hint}</p>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Your answer:</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          disabled={expired}
          placeholder="Type the unscrambled word…"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-center text-xl font-bold uppercase tracking-widest"
          maxLength={15}
        />
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={handleNext}
        disabled={!input && !expired}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < UNSCRAMBLE_WORDS.length - 1 ? 'Next Word →' : 'Submit Answers'}
      </button>
    </div>
  );
}

// ── Week 4 Specific Missions ─────────────────────────────────────

const ALL_TEAMS_W4 = [
  'Algeria','Argentina','Australia','Austria','Belgium','Bosnia & Herzegovina',
  'Brazil','Cabo Verde','Canada','Colombia','Congo DR',"Côte d'Ivoire",
  'Croatia','Curaçao','Czechia','Ecuador','Egypt','England','France','Germany',
  'Ghana','Haiti','Iran','Iraq','Japan','Jordan','Mexico','Morocco',
  'Netherlands','New Zealand','Norway','Panama','Paraguay','Portugal',
  'Qatar','Saudi Arabia','Scotland','Senegal','South Africa','South Korea',
  'Spain','Sweden','Switzerland','Tunisia','Türkiye','United States',
  'Uruguay','Uzbekistan',
];

// W4-1: Semi-Final Predictor (top 4 teams)
function SFPredictor({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [picks, setPicks] = useState<string[]>(['', '', '', '']);

  const allPicked = picks.every(p => p);
  const update = (i: number, val: string) => {
    const next = [...picks]; next[i] = val; setPicks(next);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="font-bold text-blue-800">Score Prediction: Semi-Finals</p>
        <p className="text-sm text-blue-700 mt-1">Select the top 4 powerhouse teams heading into the Semi-Finals!</p>
        <p className="text-xs text-blue-500 mt-1">No upload required — just select your picks.</p>
      </div>
      <div className="space-y-3">
        {['Semi-Final Spot 1','Semi-Final Spot 2','Semi-Final Spot 3','Semi-Final Spot 4'].map((label, i) => (
          <div key={i}>
            <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <select
              value={picks[i]}
              onChange={e => update(i, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red outline-none text-sm"
            >
              <option value="">Select a team…</option>
              {ALL_TEAMS_W4.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSubmit({ picks })}
        disabled={!allPicked}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {allPicked ? 'Submit Prediction' : 'Pick all 4 teams to continue'}
      </button>
    </div>
  );
}

// W4-2: Beat the Clue
const BEAT_CLUES = [
  { pts: 100, clue: 'They were the very first team to score a hat-trick in tournament history, back in 1930, courtesy of Guillermo Stábile.' },
  { pts: 80,  clue: 'They hold the infamous record for the most yellow cards received in a single tournament match (9 cards against the Netherlands in 2022).' },
  { pts: 60,  clue: 'They are famously nicknamed La Albiceleste by football fans worldwide.' },
  { pts: 40,  clue: 'The country that lifted the 1986 trophy thanks to Diego Maradona\'s legendary "Hand of God" goal.' },
  { pts: 20,  clue: 'The reigning world champions led by Lionel Messi, who wear the iconic Light Blue and White stripes.' },
];

function BeatTheClue({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [clueIndex, setClueIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [expired, setExpired] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { timeLeft, reset } = useCountdown(20, () => setExpired(true));

  const currentClue = BEAT_CLUES[clueIndex];

  const handleNextClue = () => {
    if (clueIndex < BEAT_CLUES.length - 1) {
      setClueIndex(clueIndex + 1);
      setExpired(false);
      reset(20);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit({ answer, clueReached: clueIndex + 1, pointsEarned: currentClue.pts });
  };

  return (
    <div className="space-y-4">
      <div className="bg-lg-red/5 border border-lg-red/20 rounded-xl p-3 text-center">
        <p className="text-lg-red font-black text-sm uppercase tracking-widest">⚡ Beat The Clue!</p>
        <p className="text-gray-600 text-xs mt-0.5">The faster you guess, the more points you score</p>
      </div>

      {/* Points at stake */}
      <div className="flex gap-2 justify-center">
        {BEAT_CLUES.map((c, i) => (
          <div key={i} className={`flex-1 py-1.5 rounded-lg text-center text-xs font-black transition-all ${
            i === clueIndex ? 'bg-lg-red text-white' :
            i < clueIndex ? 'bg-gray-200 text-gray-400 line-through' :
            'bg-gray-100 text-gray-500'
          }`}>
            {c.pts}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Clue {clueIndex + 1} / {BEAT_CLUES.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={20} color="bg-lg-red" />

      <div className="bg-gray-50 rounded-xl p-4 min-h-20 flex items-center">
        <p className="text-gray-800 leading-relaxed text-sm">{currentClue.clue}</p>
      </div>

      <input
        type="text"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Type the team name…"
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red outline-none text-center font-bold"
      />

      <div className="grid grid-cols-2 gap-3">
        {clueIndex < BEAT_CLUES.length - 1 && !submitted && (
          <button
            onClick={handleNextClue}
            disabled={expired && clueIndex === BEAT_CLUES.length - 1}
            className="py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-bold text-sm hover:border-gray-400 transition-all"
          >
            Next Clue ({BEAT_CLUES[clueIndex + 1].pts} pts) →
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!answer || submitted}
          className={`py-3 rounded-xl bg-lg-red hover:bg-lg-red/90 text-white font-bold text-sm transition-all disabled:opacity-50 ${clueIndex === BEAT_CLUES.length - 1 || submitted ? 'col-span-2' : ''}`}
        >
          Submit for {currentClue.pts} pts!
        </button>
      </div>
    </div>
  );
}

// W4-3: Final Predictor
function FinalPredictor({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [pick, setPick] = useState('');

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-center">
        <p className="text-2xl mb-1">🏆</p>
        <p className="font-bold text-yellow-800 text-base">Final Prediction</p>
        <p className="text-sm text-yellow-700 mt-1">Who takes home the ultimate trophy? Drop your World Cup Champion pick before the final match begins!</p>
        <p className="text-xs text-yellow-600 mt-1">No upload required.</p>
      </div>
      <select
        value={pick}
        onChange={e => setPick(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 outline-none text-sm font-semibold"
      >
        <option value="">Select the World Cup Champion…</option>
        {ALL_TEAMS_W4.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <button
        onClick={() => onSubmit({ pick })}
        disabled={!pick}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {pick ? `Submit: ${pick} 🏆` : 'Pick your champion'}
      </button>
    </div>
  );
}

// W4-4: My Football Memory
function FootballMemory({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [text, setText] = useState('');
  const MAX = 250;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="font-bold text-gray-900 text-base">My Football Memory</p>
        <p className="text-sm text-gray-600 mt-1">Share your all-time favorite World Cup memory in 1–2 sentences!</p>
        <p className="text-xs text-gray-400 mt-1">Max 250 characters • No upload required</p>
      </div>
      <div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX))}
          rows={5}
          placeholder="e.g. Watching Maradona's Hand of God goal with my dad in 1986 — we still argue about it to this day!"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red outline-none resize-none text-sm"
        />
        <div className={`text-right text-xs mt-1 font-semibold ${text.length >= MAX ? 'text-lg-red' : 'text-gray-400'}`}>
          {text.length} / {MAX}
        </div>
      </div>
      <button
        onClick={() => onSubmit({ memory: text })}
        disabled={text.length < 10}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Share Memory
      </button>
    </div>
  );
}

// W4-5: Maze Game
const MAZE_ROUNDS = [
  { image: imgMaze1, answer: 'A' },
  { image: imgMaze2, answer: 'B' },
];

function MazeGame({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(25, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, selected || 'skipped'];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < MAZE_ROUNDS.length - 1) {
      setQIndex(qIndex + 1);
      reset(25);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const m = MAZE_ROUNDS[qIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Maze {qIndex + 1} / {MAZE_ROUNDS.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 8 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={25} color="bg-pink-500" />
      <img src={m.image} alt={`Maze ${qIndex + 1}`} className="w-full rounded-xl object-contain max-h-56 bg-pink-50" />
      <p className="text-center text-sm font-semibold text-gray-700">Who will reach the LG showroom first?</p>
      <div className="grid grid-cols-3 gap-3">
        {['A', 'B', 'C'].map(opt => (
          <button
            key={opt}
            disabled={expired}
            onClick={() => setSelected(opt)}
            className={`py-5 rounded-xl border-2 font-black text-2xl transition-all ${
              selected === opt ? 'border-lg-red bg-lg-red/10 text-lg-red scale-95' : 'border-gray-200 hover:border-lg-red text-gray-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={handleNext}
        disabled={!selected && !expired}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < MAZE_ROUNDS.length - 1 ? 'Next Maze →' : 'Submit Answers'}
      </button>
    </div>
  );
}

// W4-6: Life's Good Moment
function LifesGoodMoment({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [mode, setMode] = useState<'text' | 'photo'>('text');
  const [text, setText] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const MAX = 150;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB'); return; }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canSubmit = mode === 'text' ? text.length >= 5 : !!preview;

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="font-bold text-green-800 text-base">Life's Good Moment</p>
        <p className="text-sm text-green-700 mt-1">Share Your Life's Good Moment. Post what Life's Good means to YOU this World Cup. Tag #LGSuperfanLeague!</p>
      </div>

      {/* Toggle */}
      <div className="flex rounded-xl overflow-hidden border-2 border-gray-200">
        <button
          onClick={() => setMode('text')}
          className={`flex-1 py-2.5 font-bold text-sm transition-all ${mode === 'text' ? 'bg-lg-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          ✍️ Text (150 chars)
        </button>
        <button
          onClick={() => setMode('photo')}
          className={`flex-1 py-2.5 font-bold text-sm transition-all ${mode === 'photo' ? 'bg-lg-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          📸 Photo (5 MB)
        </button>
      </div>

      {mode === 'text' ? (
        <div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX))}
            rows={4}
            placeholder="Life's Good means… (include #LGSuperfanLeague)"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none resize-none text-sm"
          />
          <div className={`text-right text-xs mt-1 font-semibold ${text.length >= MAX ? 'text-lg-red' : 'text-gray-400'}`}>
            {text.length} / {MAX}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
          {preview
            ? <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-3 object-contain" />
            : <div className="text-5xl mb-3">🌟</div>}
          <label className="cursor-pointer">
            <span className="text-green-600 font-semibold hover:underline">{preview ? 'Change Photo' : 'Upload Photo'}</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      )}

      <button
        onClick={() => onSubmit({ mode, text: mode === 'text' ? text : undefined, photo: mode === 'photo' ? preview : undefined })}
        disabled={!canSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        Share My Life's Good Moment 🌟
      </button>
    </div>
  );
}

// W4-7: LG Brand Trivia
const BRAND_TRIVIA = [
  {
    q: 'LG\'s official company slogan is "________"',
    options: ['a. Life\'s Amazing', 'b. Life\'s Good', 'c. Life\'s Awesome'],
    correct: 'b',
  },
  {
    q: 'If you look closely at the red circular LG logo, what image does it subtly form?',
    options: ['a. A football', 'b. A smiling face', 'c. A tree'],
    correct: 'b',
  },
  {
    q: 'Which of these products is LG NOT famous for making?',
    options: ['a. Smart Refrigerators', 'b. Washing Machines', 'c. Sports Shoes'],
    correct: 'c',
  },
];

function LGBrandTrivia({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const { timeLeft, reset } = useCountdown(20, () => setExpired(true));

  const handleNext = () => {
    const newAnswers = [...answers, selected || 'skipped'];
    setAnswers(newAnswers);
    setSelected(null);
    setExpired(false);
    if (qIndex < BRAND_TRIVIA.length - 1) {
      setQIndex(qIndex + 1);
      reset(20);
    } else {
      onSubmit({ answers: newAnswers });
    }
  };

  const q = BRAND_TRIVIA[qIndex];

  return (
    <div className="space-y-4">
      <div className="bg-lg-red/5 border border-lg-red/20 rounded-xl px-4 py-2 text-center">
        <p className="text-lg-red font-black text-sm uppercase tracking-widest">🏷️ LG Brand Trivia</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Q{qIndex + 1} / {BRAND_TRIVIA.length}</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 ? 'text-lg-red animate-pulse' : 'text-gray-700'}`}>
          <FlaticonIcon name="clock" className="w-4 h-4" />{timeLeft}s
        </span>
      </div>
      <TimerBar timeLeft={timeLeft} total={20} color="bg-lg-red" />
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-gray-900 leading-snug">{q.q}</p>
      </div>
      <div className="space-y-2">
        {q.options.map(opt => {
          const letter = opt[0];
          return (
            <button
              key={opt}
              disabled={expired}
              onClick={() => setSelected(letter)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                selected === letter ? 'border-lg-red bg-lg-red/10 text-lg-red' : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 ${
                selected === letter ? 'bg-lg-red text-white' : 'bg-gray-100 text-gray-600'
              }`}>{letter.toUpperCase()}</span>
              {opt.substring(3)}
            </button>
          );
        })}
      </div>
      {expired && <p className="text-lg-red text-sm text-center font-semibold">⏰ Time's up!</p>}
      <button
        onClick={handleNext}
        disabled={!selected && !expired}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {qIndex < BRAND_TRIVIA.length - 1 ? 'Next Question →' : 'Submit Answers'}
      </button>
    </div>
  );
}

function ScorePrediction({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const MAX = 8;

  const filtered = ALL_TEAMS.filter(t => t.toLowerCase().includes(search.toLowerCase()));

  const toggle = (team: string) => {
    if (selected.includes(team)) {
      setSelected(selected.filter(t => t !== team));
    } else if (selected.length < MAX) {
      setSelected([...selected, team]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="font-bold text-blue-800 text-base">Score Prediction: Round of 16</p>
        <p className="text-sm text-blue-700 mt-1">Select the top 8 teams you think will make it to the Round of 16!</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Selected:</span>
        <span className={`font-black text-lg ${selected.length === MAX ? 'text-green-600' : 'text-lg-red'}`}>
          {selected.length} / {MAX}
        </span>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(t => (
            <span key={t} className="bg-lg-red text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              {t}
              <button onClick={() => toggle(t)} className="hover:opacity-70">✕</button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search teams..."
        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-lg-red outline-none text-sm"
      />

      <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
        {filtered.map(team => {
          const isSelected = selected.includes(team);
          const isDisabled = !isSelected && selected.length >= MAX;
          return (
            <button
              key={team}
              onClick={() => toggle(team)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                isSelected ? 'bg-lg-red/10 border-lg-red text-lg-red' :
                isDisabled ? 'border-gray-100 text-gray-300 cursor-not-allowed' :
                'border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              <span className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${
                isSelected ? 'bg-lg-red border-lg-red text-white text-xs' : 'border-gray-300'
              }`}>{isSelected && '✓'}</span>
              {team}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onSubmit({ teams: selected })}
        disabled={selected.length !== MAX}
        className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {selected.length === MAX ? 'Submit Prediction' : `Select ${MAX - selected.length} more team${MAX - selected.length !== 1 ? 's' : ''}`}
      </button>
    </div>
  );
}
