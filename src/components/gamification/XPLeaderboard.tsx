import type { PlayerGamification } from '../../types/gamification';
import { PlayerLevelCompact } from './PlayerLevel';
import { PLAYER_LEVELS } from '../../hooks/useGameification';

interface XPLeaderboardProps {
  profiles: { name: string; profile: PlayerGamification }[];
  className?: string;
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

function getRankLabel(rank: number) {
  return rank <= 3 ? RANK_MEDALS[rank - 1] : `#${rank}`;
}

function formatXP(xp: number) {
  return xp.toLocaleString();
}

export default function XPLeaderboard({ profiles, className = '' }: XPLeaderboardProps) {
  if (profiles.length === 0) {
    return (
      <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl p-8 text-center hell-glow ${className}`}>
        <div className="text-5xl mb-3">⭐</div>
        <p className="text-hell-300 font-bold text-lg">No chef profiles yet</p>
        <p className="text-steel-400 text-sm mt-1">Submit a recipe to start earning XP</p>
      </div>
    );
  }

  const topXP = profiles[0]?.profile.totalXP || 1;

  return (
    <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl hell-glow ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-flame-600 bg-gradient-to-r from-hell-800 to-hell-700">
        <div className="flex items-center space-x-2">
          <span className="text-xl animate-flame-flicker">⭐</span>
          <h2 className="text-lg font-bold text-hell-100 font-chef">XP Leaderboard</h2>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-px bg-hell-700 border-b border-hell-700">
        <div className="bg-hell-900 px-3 py-2 text-center">
          <div className="text-flame-300 font-black text-lg">{profiles.length}</div>
          <div className="text-steel-400 text-xs font-semibold uppercase tracking-wide">Chefs</div>
        </div>
        <div className="bg-hell-900 px-3 py-2 text-center">
          <div className="text-flame-300 font-black text-lg">{formatXP(topXP)}</div>
          <div className="text-steel-400 text-xs font-semibold uppercase tracking-wide">Top XP</div>
        </div>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-hell-700">
        {profiles.map(({ name, profile }, index) => {
          const rank = index + 1;
          const levelData = PLAYER_LEVELS[profile.level] ?? PLAYER_LEVELS[0];
          const xpBarWidth = Math.max(4, Math.round((profile.totalXP / topXP) * 100));

          return (
            <li key={name} className="px-4 py-3 hover:bg-hell-800 transition-colors">
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span className="text-lg w-8 text-center flex-shrink-0 font-black text-hell-300">
                  {getRankLabel(rank)}
                </span>

                {/* Chef info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-hell-100 truncate text-sm">{name}</span>
                    <PlayerLevelCompact level={levelData} currentXP={profile.totalXP} />
                  </div>

                  {/* XP bar */}
                  <div className="w-full bg-hell-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-flame-600 to-hell-500 transition-all duration-500"
                      style={{ width: `${xpBarWidth}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-flame-400 font-semibold">
                      {formatXP(profile.totalXP)} XP
                    </span>
                    <span className="text-xs text-steel-500">
                      {profile.statistics.achievementsUnlocked} achievement{profile.statistics.achievementsUnlocked !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
