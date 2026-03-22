import { useState } from 'react';
import type { LeaderboardEntry } from '../../types/leaderboard';
import { RageScoreBadge } from '../game/RageScore';
import Button from '../common/Button';

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

  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50';
    if (rank === 2) return 'text-gray-600 bg-gray-50';
    if (rank === 3) return 'text-amber-600 bg-amber-50';
    return 'text-gray-500 bg-gray-50';
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="p-4">
        {/* Header with rank and basic info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Rank */}
            <div className={`px-2 py-1 rounded-full text-sm font-bold ${getRankColor()}`}>
              {getRankDisplay()}
            </div>

            {/* Player name and date */}
            <div>
              <h3 className="font-semibold text-gray-900">
                {entry.playerName}
              </h3>
              <p className="text-xs text-gray-500">
                {formatDate(entry.createdAt)}
              </p>
            </div>
          </div>

          {/* Rage score */}
          <RageScoreBadge score={entry.rage_score} />
        </div>

        {/* Recipe title and preview */}
        <div className="mb-3">
          <h4 className="font-medium text-gray-800 mb-1">
            {entry.recipeTitle || 'Untitled Recipe'}
          </h4>
          <p className="text-sm text-gray-600">
            {isExpanded
              ? entry.recipeContent
              : truncateText(entry.recipeContent, 100)}
            {entry.recipeContent.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-rage-600 hover:text-rage-700 text-xs font-medium underline"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </p>
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
                >
                  #{tag}
                </span>
              ))}
              {entry.tags.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  +{entry.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Judge style */}
        <div className="mb-3">
          <span className="text-xs text-gray-500">
            Judge Style: <span className="font-medium capitalize">{entry.judgeStyle.replace('-', ' ')}</span>
          </span>
        </div>

        {/* Reaction preview */}
        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-rage-500">
            <p className="text-sm text-gray-700 italic font-chef">
              "{truncateText(entry.reaction, 120)}"
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewDetails?.(entry)}
            className="text-sm font-medium text-rage-600 hover:text-rage-700 underline"
          >
            View Full Details
          </button>

          {showRemoveButton && onRemove && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onRemove(entry.id)}
              isLoading={isRemoving}
              loadingText="Removing..."
              className="ml-2"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
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