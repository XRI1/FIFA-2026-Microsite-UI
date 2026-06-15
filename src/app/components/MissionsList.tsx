import { useState } from 'react';
import { Trophy, Clock, CheckCircle2, Lock, Calendar } from 'lucide-react';
import { MISSIONS_DATA, Mission } from '../types/mission';
import { MissionModal } from './MissionModal';

interface MissionsListProps {
  userTeam: string;
}

export function MissionsList({ userTeam }: MissionsListProps) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

  const weeks = [1, 2, 3, 4, 5, 6];
  const weekMissions = MISSIONS_DATA.filter(m => m.week === selectedWeek);

  const getMissionIcon = (type: string) => {
    const icons: Record<string, string> = {
      photo: '📸',
      quiz: '❓',
      'spot-count': '🔍',
      'drag-match': '🎯',
      unscramble: '🔤',
      'hidden-hunt': '🕵️',
      comment: '💬',
      predictor: '⚽',
      video: '🎬',
      'external-visit': '📍',
      'fan-art': '🎨',
      'social-checkin': '✅',
      creative: '💡',
      'rapid-tap': '⚡',
    };
    return icons[type] || '🎮';
  };

  const handleMissionComplete = (missionId: string, points: number) => {
    setCompletedMissions(prev => new Set(prev).add(missionId));
    setSelectedMission(null);
  };

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-lg-purple" />
          <h2 className="font-bold text-lg">Select Week</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weeks.map(week => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedWeek === week
                  ? 'bg-lg-red text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {weekMissions.map(mission => {
          const isCompleted = completedMissions.has(mission.id);
          const isLocked = !mission.isActive;

          return (
            <button
              key={mission.id}
              onClick={() => !isLocked && setSelectedMission(mission)}
              disabled={isLocked}
              className={`bg-white rounded-xl p-4 shadow-sm transition-all text-left ${
                isLocked
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]'
              } ${isCompleted ? 'ring-2 ring-lg-green' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{getMissionIcon(mission.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 leading-tight">{mission.title}</h3>
                    {isLocked && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-lg-green flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-lg-red font-bold">
                        <Trophy className="w-4 h-4" />
                        <span>{mission.points}</span>
                      </div>
                      {mission.timedDuration && (
                        <div className="flex items-center gap-1 text-lg-purple text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{mission.timedDuration}s</span>
                        </div>
                      )}
                    </div>
                    {isCompleted && (
                      <span className="text-xs font-semibold text-lg-green">Completed</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mission Modal */}
      {selectedMission && (
        <MissionModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
          onComplete={handleMissionComplete}
        />
      )}
    </div>
  );
}
