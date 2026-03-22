import { useState } from 'react';
import { useHasValidApiKey } from '../hooks/useApiKey';
import { useLeaderboard } from '../hooks/useLeaderboard';
import type { JudgeResponse, Recipe, JudgeStyle } from '../types/game';
import type { LeaderboardEntry } from '../types/leaderboard';
import ApiKeyPrompt from '../components/game/ApiKeyPrompt';
import RecipeForm from '../components/game/RecipeForm';
import JudgeResponseComponent from '../components/game/JudgeResponse';
import Leaderboard from '../components/leaderboard/Leaderboard';

function PlayPage() {
  const hasValidApiKey = useHasValidApiKey();
  const { addEntry } = useLeaderboard();

  const [judgeResponse, setJudgeResponse] = useState<JudgeResponse | null>(null);
  const [lastRecipe, setLastRecipe] = useState<Recipe | null>(null);
  const [lastPlayerName, setLastPlayerName] = useState<string>('');
  const [lastJudgeStyle, setLastJudgeStyle] = useState<JudgeStyle>('classic-rage');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  const handleJudgeComplete = (response: JudgeResponse, recipe: Recipe, playerName: string, judgeStyle: JudgeStyle) => {
    setJudgeResponse(response);
    setLastRecipe(recipe);
    setLastPlayerName(playerName);
    setLastJudgeStyle(judgeStyle);
  };

  const handleTryAgain = () => {
    setJudgeResponse(null);
    setLastRecipe(null);
    setLastPlayerName('');
    setLastJudgeStyle('classic-rage');
  };

  const handleSaveToLeaderboard = async () => {
    if (!judgeResponse || !lastRecipe || !lastPlayerName) {
      return;
    }

    setIsSaving(true);
    try {
      const success = await addEntry(lastRecipe, judgeResponse, lastPlayerName, lastJudgeStyle);
      if (success) {
        // Clear the current response to show the updated leaderboard
        handleTryAgain();
      } else {
        alert('Failed to save to leaderboard. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save to leaderboard:', error);
      alert('Failed to save to leaderboard. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEntryClick = (entry: LeaderboardEntry) => {
    setSelectedEntry(entry);
  };

  const handleCloseEntryModal = () => {
    setSelectedEntry(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🍳 Submit Your Recipe for Judgment
        </h1>
        <p className="text-lg text-gray-600">
          Think your cooking is good? Gordon Ramsay might disagree...
        </p>
      </div>

      {/* API Key Check */}
      {!hasValidApiKey && (
        <div className="mb-8">
          <ApiKeyPrompt onKeySet={() => {}} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recipe Form Panel */}
        <div className="xl:col-span-2">
          {hasValidApiKey ? (
            <RecipeForm onJudgeComplete={handleJudgeComplete} />
          ) : (
            <div className="bg-gray-100 rounded-lg shadow p-12 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0l-3-3m3 3l3-3m-3-9V5.25A2.25 2.25 0 0010.5 3h-3A2.25 2.25 0 005.25 5.25V12h13.5V5.25A2.25 2.25 0 0016.5 3h-3A2.25 2.25 0 0012 5.25V3z" />
                </svg>
                <p className="text-lg font-medium text-gray-600">
                  Enter your OpenAI API key above to start judging recipes
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results/Leaderboard Panel */}
        <div className="xl:col-span-1">
          {judgeResponse ? (
            <JudgeResponseComponent
              response={judgeResponse}
              onSaveToLeaderboard={handleSaveToLeaderboard}
              onTryAgain={handleTryAgain}
              isSaving={isSaving}
              className="sticky top-8"
            />
          ) : (
            <div className="sticky top-8">
              <Leaderboard
                pageSize={5}
                showControls={false}
                onEntryClick={handleEntryClick}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowFullLeaderboard(true)}
                  className="text-rage-600 hover:text-rage-700 text-sm font-medium underline"
                >
                  View Full Leaderboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasValidApiKey && !judgeResponse && (
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Pro Tips for Maximum Rage
            </h3>
            <ul className="text-left text-blue-800 space-y-2 text-sm">
              <li>• Use bizarre ingredient combinations (pineapple on pizza is just the start)</li>
              <li>• Describe terrible cooking techniques (microwaving steaks, anyone?)</li>
              <li>• Mix cuisines in the most ridiculous ways possible</li>
              <li>• Don't forget to mention any "special" preparation methods</li>
              <li>• The more detailed your disaster, the better Gordon's reaction!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Full Leaderboard Modal */}
      {showFullLeaderboard && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowFullLeaderboard(false)}></div>
            </div>

            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900">
                    🏆 Full Leaderboard
                  </h3>
                  <button
                    onClick={() => setShowFullLeaderboard(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <Leaderboard
                    showControls={true}
                    onEntryClick={handleEntryClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entry Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseEntryModal}></div>
            </div>

            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <JudgeResponseComponent
                response={{
                  rage_score: selectedEntry.rage_score,
                  tags: selectedEntry.tags,
                  reasons: ['Detailed breakdown not available in archived entries'],
                  reaction: selectedEntry.reaction
                }}
                onTryAgain={handleCloseEntryModal}
                className="border-0 shadow-none"
              />
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Recipe by <strong>{selectedEntry.playerName}</strong>
                  </span>
                  <span>
                    {new Date(selectedEntry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayPage