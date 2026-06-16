import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { FlaticonIcon } from "./FlaticonIcon";

interface Team {
  id: string;
  name: string;
  flag: string;
  flagCode: string;
}

const TEAMS: Team[] = [
  { id: 'dza', name: 'Algeria', flag: '🇩🇿', flagCode: 'dz' },
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', flagCode: 'ar' },
  { id: 'aus', name: 'Australia', flag: '🇦🇺', flagCode: 'au' },
  { id: 'aut', name: 'Austria', flag: '🇦🇹', flagCode: 'at' },
  { id: 'bel', name: 'Belgium', flag: '🇧🇪', flagCode: 'be' },
  { id: 'bih', name: 'Bosnia and Herzegovina', flag: '🇧🇦', flagCode: 'ba' },
  { id: 'bra', name: 'Brazil', flag: '🇧🇷', flagCode: 'br' },
  { id: 'cpv', name: 'Cabo Verde', flag: '🇨🇻', flagCode: 'cv' },
  { id: 'can', name: 'Canada', flag: '🇨🇦', flagCode: 'ca' },
  { id: 'col', name: 'Colombia', flag: '🇨🇴', flagCode: 'co' },
  { id: 'cod', name: 'Congo DR', flag: '🇨🇩', flagCode: 'cd' },
  { id: 'civ', name: "Côte d'Ivoire", flag: '🇨🇮', flagCode: 'ci' },
  { id: 'hrv', name: 'Croatia', flag: '🇭🇷', flagCode: 'hr' },
  { id: 'cuw', name: 'Curaçao', flag: '🇨🇼', flagCode: 'cw' },
  { id: 'cze', name: 'Czechia', flag: '🇨🇿', flagCode: 'cz' },
  { id: 'ecu', name: 'Ecuador', flag: '🇪🇨', flagCode: 'ec' },
  { id: 'egy', name: 'Egypt', flag: '🇪🇬', flagCode: 'eg' },
  { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagCode: 'gb-eng' },
  { id: 'fra', name: 'France', flag: '🇫🇷', flagCode: 'fr' },
  { id: 'ger', name: 'Germany', flag: '🇩🇪', flagCode: 'de' },
  { id: 'gha', name: 'Ghana', flag: '🇬🇭', flagCode: 'gh' },
  { id: 'hti', name: 'Haiti', flag: '🇭🇹', flagCode: 'ht' },
  { id: 'irn', name: 'Iran', flag: '🇮🇷', flagCode: 'ir' },
  { id: 'irq', name: 'Iraq', flag: '🇮🇶', flagCode: 'iq' },
  { id: 'jpn', name: 'Japan', flag: '🇯🇵', flagCode: 'jp' },
  { id: 'jor', name: 'Jordan', flag: '🇯🇴', flagCode: 'jo' },
  { id: 'mex', name: 'Mexico', flag: '🇲🇽', flagCode: 'mx' },
  { id: 'mar', name: 'Morocco', flag: '🇲🇦', flagCode: 'ma' },
  { id: 'ned', name: 'Netherlands', flag: '🇳🇱', flagCode: 'nl' },
  { id: 'nzl', name: 'New Zealand', flag: '🇳🇿', flagCode: 'nz' },
  { id: 'nor', name: 'Norway', flag: '🇳🇴', flagCode: 'no' },
  { id: 'pan', name: 'Panama', flag: '🇵🇦', flagCode: 'pa' },
  { id: 'pry', name: 'Paraguay', flag: '🇵🇾', flagCode: 'py' },
  { id: 'por', name: 'Portugal', flag: '🇵🇹', flagCode: 'pt' },
  { id: 'qat', name: 'Qatar', flag: '🇶🇦', flagCode: 'qa' },
  { id: 'sau', name: 'Saudi Arabia', flag: '🇸🇦', flagCode: 'sa' },
  { id: 'sco', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagCode: 'gb-sct' },
  { id: 'sen', name: 'Senegal', flag: '🇸🇳', flagCode: 'sn' },
  { id: 'zaf', name: 'South Africa', flag: '🇿🇦', flagCode: 'za' },
  { id: 'kor', name: 'South Korea', flag: '🇰🇷', flagCode: 'kr' },
  { id: 'esp', name: 'Spain', flag: '🇪🇸', flagCode: 'es' },
  { id: 'swe', name: 'Sweden', flag: '🇸🇪', flagCode: 'se' },
  { id: 'sui', name: 'Switzerland', flag: '🇨🇭', flagCode: 'ch' },
  { id: 'tun', name: 'Tunisia', flag: '🇹🇳', flagCode: 'tn' },
  { id: 'tur', name: 'Türkiye', flag: '🇹🇷', flagCode: 'tr' },
  { id: 'usa', name: 'United States', flag: '🇺🇸', flagCode: 'us' },
  { id: 'uru', name: 'Uruguay', flag: '🇺🇾', flagCode: 'uy' },
  { id: 'uzb', name: 'Uzbekistan', flag: '🇺🇿', flagCode: 'uz' },
];

interface TeamSelectionProps {
  onTeamSelected: (team: string, teamFlag: string) => Promise<void>;
  onBack: () => void;
}

export function TeamSelection({ onTeamSelected, onBack }: TeamSelectionProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return TEAMS;
    const query = searchQuery.toLowerCase();
    return TEAMS.filter(team => team.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleConfirm = async () => {
    if (!selectedTeam) return;

    const team = TEAMS.find(t => t.id === selectedTeam);
    if (!team) return;

    setLoading(true);
    try {
      await onTeamSelected(team.name, team.flag);
    } catch (err) {
      console.error('Failed to select team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-page min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="premium-panel fifa-match-panel rounded-3xl p-6 md:p-8 space-y-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FlaticonIcon name="arrow-left" className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-lg-smart tracking-wide">
              LG SUPER FAN LEAGUE
            </h1>
            <h2 className="text-xl font-bold text-gray-900">Choose Your Team</h2>
            <p className="text-gray-600">Select your favorite FIFA 2026 team to support</p>
            <p className="text-sm text-gray-500">{TEAMS.length} teams available</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FlaticonIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none"
            />
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 max-h-[55vh] overflow-y-auto p-1 md:p-2">
            {filteredTeams.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No teams found matching "{searchQuery}"
              </div>
            ) : (
              filteredTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                disabled={loading}
                className={`relative p-2 md:p-3 rounded-xl border-2 transition-all transform hover:scale-105 active:scale-95 ${
                  selectedTeam === team.id
                    ? 'border-lg-deep-purple bg-lg-deep-purple/10 shadow-lg'
                    : 'border-white/80 hover:border-lg-red/50 bg-white/70 shadow-sm'
                }`}
              >
                {selectedTeam === team.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-lg-deep-purple rounded-full flex items-center justify-center">
                    <FlaticonIcon name="check" className="w-4 h-4" />
                  </div>
                )}
                <div className="text-center space-y-1">
                  <img
                    src={`https://flagcdn.com/w80/${team.flagCode}.png`}
                    alt={`${team.name} flag`}
                    className="w-10 h-7 md:w-12 md:h-8 object-cover rounded mx-auto shadow-sm"
                  />
                  <div className="text-[10px] md:text-xs font-semibold text-gray-900 leading-tight">{team.name}</div>
                </div>
              </button>
              ))
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedTeam || loading}
            className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Selection'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
