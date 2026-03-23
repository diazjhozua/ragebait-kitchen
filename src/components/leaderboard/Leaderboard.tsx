import { useState } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import type { LeaderboardEntry } from '../../types/leaderboard';
import LeaderboardEntryComponent from './LeaderboardEntry';
import Pagination from './Pagination';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface LeaderboardProps {
  pageSize?: number;
  showControls?: boolean;
  onEntryClick?: (entry: LeaderboardEntry) => void;
  className?: string;
}

export default function Leaderboard({
  pageSize = 10,
  showControls = true,
  onEntryClick,
  className = ''
}: LeaderboardProps) {
  const {
    entries,
    totalEntries,
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
    isLoading,
    error,
    stats,
    removeEntry,
    clearLeaderboard,
    goToPage,
    nextPage,
    prevPage,
    setSorting,
    refresh,
    exportData
  } = useLeaderboard({ pageSize });

  const [sortBy, setSortBy] = useState<'rage_score' | 'date'>('rage_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleSortChange = (newSortBy: 'rage_score' | 'date') => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setSorting(newSortBy, newSortOrder);
  };

  const handleRemoveEntry = async (id: string) => {
    setRemovingId(id);
    const success = await removeEntry(id);
    if (!success) {
      // Error handling is done in the hook
    }
    setRemovingId(null);
  };

  const handleClearLeaderboard = async () => {
    setIsClearing(true);
    const success = await clearLeaderboard();
    if (success) {
      setShowClearConfirm(false);
    }
    setIsClearing(false);
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ragebait-leaderboard-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export leaderboard:', error);
    }
  };

  if (isLoading && entries.length === 0) {
    return (
      <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl hell-glow ${className}`}>
        <LoadingSpinner size="md" message="Loading Hall of Shame..." className="py-8 loading-kitchen" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl p-6 hell-glow ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-gordon-rage">😡</div>
          <h3 className="mt-2 text-lg font-bold text-hell-300 animate-burning-text">KITCHEN DISASTER!</h3>
          <p className="mt-1 text-sm text-steel-300">{error}</p>
          <div className="mt-6">
            <Button onClick={refresh} variant="hell" size="sm" withFlame={true}>
              🔥 TRY AGAIN
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (totalEntries === 0) {
    return (
      <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl hell-glow ${className}`}>
        <div className="px-6 py-4 border-b border-flame-600 bg-gradient-to-r from-hell-800 to-hell-700">
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-flame-flicker">🏆</span>
            <h2 className="text-xl font-bold text-hell-100 font-chef">HALL OF CULINARY SHAME</h2>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="text-8xl mb-6 animate-steam">💨</div>
          <h3 className="mt-2 text-lg font-bold text-hell-300 animate-burning-text">THE KITCHEN IS EMPTY!</h3>
          <p className="mt-1 text-sm text-steel-300 max-w-xs mx-auto">
            No brave souls have dared to face Gordon's wrath yet. Submit a recipe to earn your place in the <span className="text-hell-400 font-bold">Hall of Shame!</span>
          </p>
          <div className="mt-6 flex justify-center space-x-4 opacity-60">
            <span className="text-2xl animate-sizzle">🔥</span>
            <span className="text-2xl animate-gordon-rage delay-200">😈</span>
            <span className="text-2xl animate-flame-flicker delay-400">💀</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl hell-glow animate-fade-in ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-flame-600 bg-gradient-to-r from-hell-800 to-hell-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl animate-flame-flicker">🏆</span>
              <h2 className="text-xl font-bold text-hell-100 font-chef animate-burning-text">HALL OF CULINARY SHAME</h2>
              <span className="text-3xl animate-flame-flicker">🏆</span>
            </div>
            <p className="text-sm text-steel-300 font-semibold">
              {totalEntries} {totalEntries === 1 ? 'disaster' : 'disasters'} recorded • <span className="text-flame-400">Gordon is watching</span>
            </p>
          </div>

          {showControls && (
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={refresh}
                disabled={isLoading}
                className="hover-sizzle"
              >
                🔄 Refresh
              </Button>

              <Button
                variant="chef"
                size="sm"
                onClick={handleExport}
                className="hover-flame"
              >
                📤 Export
              </Button>

              <Button
                variant="hell"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                withFlame={true}
              >
                🗑️ Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center hell-kitchen-bg border border-steel-600 rounded-lg p-3 hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-flame-400 animate-sizzle">{stats.averageRageScore}</div>
            <div className="text-xs text-steel-400 font-semibold">AVG RAGE</div>
          </div>
          <div className="text-center hell-kitchen-bg border border-steel-600 rounded-lg p-3 hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-hell-400 animate-hell-pulse">{stats.highestRageScore}</div>
            <div className="text-xs text-steel-400 font-semibold">MAX FURY</div>
          </div>
          <div className="text-center hell-kitchen-bg border border-steel-600 rounded-lg p-3 hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-green-400">{stats.lowestRageScore}</div>
            <div className="text-xs text-steel-400 font-semibold">LEAST BAD</div>
          </div>
          <div className="text-center hell-kitchen-bg border border-steel-600 rounded-lg p-3 hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-flame-300 animate-steam">{stats.mostCommonTags[0]?.count || 0}</div>
            <div className="text-xs text-steel-400 font-semibold">TOP TAG</div>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold text-flame-300 flex items-center space-x-2">
              <span>⚔️</span>
              <span>Sort by:</span>
            </span>
            <button
              onClick={() => handleSortChange('rage_score')}
              className={`text-sm px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
                sortBy === 'rage_score'
                  ? 'bg-hell-600 text-hell-100 border-2 border-flame-500 animate-hell-pulse'
                  : 'bg-kitchen-700 text-steel-300 border-2 border-steel-600 hover:bg-kitchen-600 hover:border-flame-600'
              }`}
            >
              🔥 Rage Score {sortBy === 'rage_score' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSortChange('date')}
              className={`text-sm px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
                sortBy === 'date'
                  ? 'bg-hell-600 text-hell-100 border-2 border-flame-500 animate-hell-pulse'
                  : 'bg-kitchen-700 text-steel-300 border-2 border-steel-600 hover:bg-kitchen-600 hover:border-flame-600'
              }`}
            >
              📅 Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center text-sm text-flame-400 font-semibold">
              <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-flame-500 border-t-transparent rounded-full"></div>
              Gordon is judging...
            </div>
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="divide-y divide-flame-600">
        {entries.map((entry, index) => {
          const rank = (currentPage * pageSize) + index + 1;
          return (
            <div key={entry.id} className="p-4 hell-kitchen-bg hover:bg-kitchen-700 transition-colors duration-200">
              <LeaderboardEntryComponent
                entry={entry}
                rank={rank}
                onRemove={showControls ? handleRemoveEntry : undefined}
                onViewDetails={onEntryClick}
                isRemoving={removingId === entry.id}
                showRemoveButton={showControls}
              />
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={goToPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />

        {/* Clear confirmation modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-kitchen-900 opacity-90"></div>
              </div>

              <div className="inline-block align-bottom hell-kitchen-bg border-2 border-hell-600 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 hell-glow animate-scale-in">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-hell-800 border-2 border-hell-600 sm:mx-0 sm:h-10 sm:w-10 animate-hell-pulse">
                    <div className="text-2xl animate-gordon-rage">💀</div>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-bold text-hell-300 font-chef animate-burning-text">
                      CLEAR ALL DISASTERS?
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-steel-300">
                        Are you sure you want to <span className="text-hell-400 font-bold">OBLITERATE</span> all {totalEntries} leaderboard disasters?
                        <span className="text-flame-400 font-semibold"> This action cannot be undone!</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-2 sm:space-y-0">
                  <Button
                    variant="hell"
                    onClick={handleClearLeaderboard}
                    isLoading={isClearing}
                    loadingText="💀 OBLITERATING..."
                    className="w-full sm:w-auto sm:ml-3"
                    withFlame={true}
                  >
                    🗑️ CLEAR ALL
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowClearConfirm(false)}
                    disabled={isClearing}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                  >
                    🛡️ Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}