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
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <LoadingSpinner size="md" message="Loading leaderboard..." className="py-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading leaderboard</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Button onClick={refresh} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (totalEntries === 0) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">🏆 Leaderboard</h2>
        </div>
        <div className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No entries yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Submit a recipe to get started and climb the leaderboard of culinary disasters!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">🏆 Leaderboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'} total
            </p>
          </div>

          {showControls && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={isLoading}
              >
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                Export
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.averageRageScore}</div>
            <div className="text-xs text-gray-500">Avg Rage Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.highestRageScore}</div>
            <div className="text-xs text-gray-500">Highest Rage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.lowestRageScore}</div>
            <div className="text-xs text-gray-500">Lowest Rage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.mostCommonTags[0]?.count || 0}</div>
            <div className="text-xs text-gray-500">Most Common Tag</div>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <button
              onClick={() => handleSortChange('rage_score')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sortBy === 'rage_score'
                  ? 'bg-rage-100 text-rage-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rage Score {sortBy === 'rage_score' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSortChange('date')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sortBy === 'date'
                  ? 'bg-rage-100 text-rage-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </div>
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="divide-y divide-gray-200">
        {entries.map((entry, index) => {
          const rank = (currentPage * pageSize) + index + 1;
          return (
            <div key={entry.id} className="p-4">
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Clear All Entries
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete all {totalEntries} leaderboard entries? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  variant="danger"
                  onClick={handleClearLeaderboard}
                  isLoading={isClearing}
                  loadingText="Clearing..."
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Clear All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                  disabled={isClearing}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}