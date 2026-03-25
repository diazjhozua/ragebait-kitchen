import { useState } from 'react';
import type { LeaderboardEntry } from '../../types/leaderboard';
import { RageScoreBadge } from '../game/RageScore';

interface LeaderboardEntryProps {
  entry: LeaderboardEntry;
  rank: number;
  onRemove?: (id: string) => void;
  onViewDetails?: (entry: LeaderboardEntry) => void;
  isRemoving?: boolean;
  showRemoveButton?: boolean;
  className?: string;
}

export default function LeaderboardEntryComponent({
  entry,
  rank,
  onRemove,
  onViewDetails,
  isRemoving = false,
  showRemoveButton = true,
  className = ''
}: LeaderboardEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getRankDisplay = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return { text: '#f87171', glow: 'rgba(239,68,68,0.5)' };
    if (s >= 70) return { text: '#fb923c', glow: 'rgba(249,115,22,0.4)' };
    if (s >= 50) return { text: '#fbbf24', glow: 'rgba(251,191,36,0.35)' };
    if (s >= 30) return { text: '#a3e635', glow: 'rgba(163,230,53,0.3)' };
    return { text: '#4ade80', glow: 'rgba(74,222,128,0.3)' };
  };

  const scoreColor = getScoreColor(entry.rage_score);

  return (
    <div className={`group ${className}`}>
      {/* Collapsed row — always visible */}
      <button
        className="w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5 py-2 px-1 rounded hover:bg-kitchen-700/50 transition-colors duration-150">
          {/* Rank */}
          <span
            className="shrink-0 text-sm font-black w-7 text-center"
            style={{ color: rank <= 3 ? undefined : 'rgba(107,114,128,0.7)' }}
          >
            {getRankDisplay()}
          </span>

          {/* Name + recipe title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-sm font-bold text-white truncate leading-tight">
                {entry.playerName}
              </span>
            </div>
            <p className="text-xs truncate leading-tight" style={{ color: 'rgba(156,163,175,0.7)' }}>
              {entry.recipeTitle || 'Untitled Recipe'}
            </p>
          </div>

          {/* Score */}
          <div className="shrink-0 text-right">
            <span
              className="text-lg font-black leading-none"
              style={{ color: scoreColor.text, textShadow: `0 0 10px ${scoreColor.glow}` }}
            >
              {entry.rage_score}
            </span>
            <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(107,114,128,0.6)' }}>
              rage
            </div>
          </div>

          {/* Expand chevron */}
          <span
            className="shrink-0 text-xs transition-transform duration-200"
            style={{
              color: 'rgba(107,114,128,0.5)',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expanded section */}
      {isExpanded && (
        <div
          className="mx-1 mb-2 rounded-lg overflow-hidden"
          style={{ background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          {/* Gordon's reaction */}
          <div className="px-3 pt-3 pb-2">
            <p className="text-xs italic font-chef leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
              "{truncateText(entry.reaction, 140)}"
            </p>
          </div>

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {entry.tags.slice(0, 5).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(127,29,29,0.5)', color: 'rgba(252,165,165,0.9)', border: '1px solid rgba(220,38,38,0.3)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer: date + style + actions */}
          <div
            className="px-3 py-2 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(55,65,81,0.6)' }}
          >
            <div className="flex items-center gap-2" style={{ color: 'rgba(107,114,128,0.65)', fontSize: '10px' }}>
              <span>📅 {formatDate(entry.createdAt)}</span>
              <span>•</span>
              <span className="capitalize">{entry.judgeStyle.replace(/-/g, ' ')}</span>
            </div>
            <div className="flex items-center gap-2">
              {onViewDetails && (
                <button
                  onClick={e => { e.stopPropagation(); onViewDetails(entry); }}
                  className="text-[10px] font-bold uppercase tracking-wider transition-colors"
                  style={{ color: 'rgba(249,115,22,0.8)' }}
                >
                  Details
                </button>
              )}
              {showRemoveButton && onRemove && (
                <button
                  onClick={e => { e.stopPropagation(); onRemove(entry.id); }}
                  disabled={isRemoving}
                  className="text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
                  style={{ color: 'rgba(239,68,68,0.6)' }}
                >
                  {isRemoving ? '...' : '🗑 Remove'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for smaller displays
export function CompactLeaderboardEntry({
  entry,
  rank,
  onViewDetails,
  className = ''
}: Pick<LeaderboardEntryProps, 'entry' | 'rank' | 'onViewDetails' | 'className'>) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const getRankDisplay = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div
      className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${className}`}
      onClick={() => onViewDetails?.(entry)}
    >
      <div className="flex items-center space-x-3 flex-1">
        <span className="text-sm font-bold text-gray-600">
          {getRankDisplay()}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {entry.playerName}
          </p>
          <p className="text-xs text-gray-500">
            {entry.recipeTitle || 'Untitled Recipe'}
          </p>
        </div>

        <div className="text-right">
          <RageScoreBadge score={entry.rage_score} className="mb-1" />
          <p className="text-xs text-gray-400">
            {formatDate(entry.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}