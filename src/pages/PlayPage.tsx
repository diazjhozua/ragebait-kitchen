import { useState } from 'react';
import { useHasValidApiKey } from '../hooks/useApiKey';
import type { JudgeResponse } from '../types/game';
import ApiKeyPrompt from '../components/game/ApiKeyPrompt';
import RecipeForm from '../components/game/RecipeForm';
import JudgeResponseComponent from '../components/game/JudgeResponse';

function PlayPage() {
  const hasValidApiKey = useHasValidApiKey();
  const [judgeResponse, setJudgeResponse] = useState<JudgeResponse | null>(null);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);

  const handleJudgeComplete = (response: JudgeResponse) => {
    setJudgeResponse(response);
  };

  const handleTryAgain = () => {
    setJudgeResponse(null);
  };

  const handleSaveToLeaderboard = () => {
    // TODO: Implement in Phase 4
    console.log('Save to leaderboard:', judgeResponse);
    alert('Leaderboard saving will be implemented in Phase 4!');
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
          <ApiKeyPrompt onKeySet={() => setShowApiKeyPrompt(false)} />
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
              className="sticky top-8"
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  🏆 Leaderboard
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm font-medium mb-2">No entries yet</p>
                  <p className="text-xs">
                    Submit a recipe to see your judgment and start the leaderboard!
                  </p>
                  <div className="mt-4 text-xs text-gray-400">
                    Leaderboard functionality will be implemented in Phase 4
                  </div>
                </div>
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
    </div>
  )
}

export default PlayPage