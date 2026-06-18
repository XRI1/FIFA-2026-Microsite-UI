import { useState } from 'react';
import { FlaticonIcon, type FlaticonIconName } from "./FlaticonIcon";

interface LeaderboardViewProps {
  currentUserId: string;
  currentTeam: string;
}

interface LeaderboardUser {
  id: string;
  name: string; // Now required and unique
  team: string;
  teamFlag: string;
  flagCode: string;
  points: number;
  rank: number;
}

interface TeamLeaderboard {
  team: string;
  teamFlag: string;
  flagCode: string;
  totalPoints: number;
  memberCount: number;
  rank: number;
}

export function LeaderboardView({ currentUserId, currentTeam }: LeaderboardViewProps) {
  const [view, setView] = useState<'individual' | 'team'>('individual');

  // Mock data
  const individualLeaderboard: LeaderboardUser[] = [
    { id: '1', name: 'Rahul Ahmed', team: 'Argentina', teamFlag: '', flagCode: 'ar', points: 2500, rank: 1 },
    { id: '2', name: 'Priya Das', team: 'Brazil', teamFlag: '', flagCode: 'br', points: 2350, rank: 2 },
    { id: '3', name: 'Karim Hassan', team: 'Germany', teamFlag: '', flagCode: 'de', points: 2200, rank: 3 },
    { id: '4', name: 'Nazia Khan', team: 'France', teamFlag: '', flagCode: 'fr', points: 2100, rank: 4 },
    { id: '5', name: 'Sakib Rahman', team: 'Spain', teamFlag: '', flagCode: 'es', points: 2000, rank: 5 },
    { id: '6', name: 'Fatima Islam', team: 'England', teamFlag: '', flagCode: 'gb-eng', points: 1950, rank: 6 },
    { id: '7', name: 'Tanvir Haque', team: 'Portugal', teamFlag: '', flagCode: 'pt', points: 1900, rank: 7 },
    { id: '8', name: 'Rupa Begum', team: 'Netherlands', teamFlag: '', flagCode: 'nl', points: 1850, rank: 8 },
    { id: currentUserId, name: 'You', team: currentTeam, teamFlag: '', flagCode: 'ar', points: 1200, rank: 15 },
  ];

  const teamLeaderboard: TeamLeaderboard[] = [
    { team: 'Brazil', teamFlag: '', flagCode: 'br', totalPoints: 45600, memberCount: 234, rank: 1 },
    { team: 'Argentina', teamFlag: '', flagCode: 'ar', totalPoints: 43200, memberCount: 198, rank: 2 },
    { team: 'Germany', teamFlag: '', flagCode: 'de', totalPoints: 41800, memberCount: 187, rank: 3 },
    { team: 'Spain', teamFlag: '', flagCode: 'es', totalPoints: 39500, memberCount: 176, rank: 4 },
    { team: 'France', teamFlag: '', flagCode: 'fr', totalPoints: 38200, memberCount: 165, rank: 5 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <FlaticonIcon name="trophy" className="w-6 h-6" />;
    if (rank === 2) return <FlaticonIcon name="medal" className="w-6 h-6" />;
    if (rank === 3) return <FlaticonIcon name="medal" className="w-6 h-6" />;
    return <span className="text-gray-500 font-bold w-6 text-center">{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800';
    return 'bg-[#F0ECE4]';
  };

  return (
    <div className="space-y-4">
      {/* View Toggle  pill style */}
      <div className="flex p-1 rounded-2xl gap-1" style={{ background: 'rgba(0,0,0,0.06)' }}>
        {[
          { id: 'individual', label: 'Individual', icon: "chart" as FlaticonIconName },
          { id: 'team', label: 'Team', icon: "users" as FlaticonIconName },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setView(id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
              view === id
                ? 'text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={view === id ? { background: 'linear-gradient(135deg, #C8002C 0%, #8a0015 100%)' } : {}}
          >
            <FlaticonIcon name={icon} className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Individual Leaderboard */}
      {view === 'individual' && (
        <div className="space-y-3">
          {individualLeaderboard.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const isTopThree = user.rank <= 3;

            return (
              <div
                key={user.id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all"
                style={{
                  background: isTopThree
                    ? getRankBadge(user.rank).includes('yellow') ? 'linear-gradient(135deg,#f5c842,#d4a017)' :
                      getRankBadge(user.rank).includes('gray') ? 'linear-gradient(135deg,#b0b0b0,#787878)' :
                      'linear-gradient(135deg,#cd7f32,#8b4a0e)'
                    : '#ffffff',
                  boxShadow: isTopThree
                    ? '0 4px 16px rgba(0,0,0,0.18)'
                    : '0 1px 4px rgba(0,0,0,0.06)',
                  border: isCurrentUser ? '2px solid #C8002C' : '1.5px solid rgba(0,0,0,0.06)',
                }}
              >
                <div className="w-8 sm:w-10 text-center flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>
                <img src={`https://flagcdn.com/w80/${user.flagCode}.png`} alt={`${user.team} flag`}
                  className="w-10 h-6 sm:w-12 sm:h-8 object-cover rounded-lg shadow-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-bold truncate text-sm sm:text-base ${isTopThree ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                    {isCurrentUser && <span className="text-xs bg-white/30 text-white px-1.5 py-0.5 rounded-full font-black flex-shrink-0">YOU</span>}
                  </div>
                  <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>Team {user.team}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-black text-base sm:text-xl ${isTopThree ? 'text-white' : 'text-lg-red'}`}>{user.points.toLocaleString()}</div>
                  <div className={`text-xs ${isTopThree ? 'text-white/70' : 'text-gray-400'}`}>pts</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Team Leaderboard */}
      {view === 'team' && (
        <div className="space-y-3">
          {teamLeaderboard.map((team) => {
            const isCurrentTeam = team.team === currentTeam;
            const isTopThree = team.rank <= 3;

            return (
              <div
                key={team.team}
                className={`${getRankBadge(team.rank)} ${
                  isCurrentTeam ? 'ring-4 ring-lg-deep-purple' : ''
                } ${isTopThree ? 'text-white' : 'bg-[#F0ECE4]'} rounded-xl p-3 sm:p-4 shadow-sm transition-all hover:shadow-md`}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center justify-center w-7 sm:w-10 flex-shrink-0">
                    {getRankIcon(team.rank)}
                  </div>

                  <img
                    src={`https://flagcdn.com/w80/${team.flagCode}.png`}
                    alt={`${team.team} flag`}
                    className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded shadow-sm flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <h3 className={`font-bold text-sm sm:text-base ${isTopThree ? 'text-white' : 'text-gray-900'}`}>
                        Team {team.team}
                      </h3>
                      {isCurrentTeam && (
                        <span className="text-xs bg-lg-purple text-white px-1.5 py-0.5 rounded-full font-semibold">
                          YOUR TEAM
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm ${isTopThree ? 'text-white/90' : 'text-gray-600'}`}>
                      {team.memberCount} members
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`text-base sm:text-xl font-bold ${isTopThree ? 'text-white' : 'text-lg-red'}`}>
                      {team.totalPoints.toLocaleString()}
                    </div>
                    <div className={`text-xs ${isTopThree ? 'text-white/90' : 'text-gray-500'}`}>
                      total points
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-lg-deep-purple to-lg-purple text-white rounded-xl p-4 text-center">
        <p className="text-sm opacity-90">Leaderboards update in real-time</p>
        <p className="text-xs opacity-75 mt-1">Keep completing missions to climb the ranks!</p>
      </div>
    </div>
  );
}
