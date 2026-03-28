import { useState } from 'react';
import { useHasValidApiKey } from '../hooks/useApiKey';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useGameification } from '../hooks/useGameification';
import type { JudgeResponse, Recipe, JudgeStyle } from '../types/game';
import type { LeaderboardEntry } from '../types/leaderboard';
import type { AchievementNotification } from '../types/gamification';
import ApiKeyPrompt from '../components/game/ApiKeyPrompt';
import RecipeForm from '../components/game/RecipeForm';
import JudgeResponseComponent from '../components/game/JudgeResponse';
import Leaderboard from '../components/leaderboard/Leaderboard';
import XPLeaderboard from '../components/gamification/XPLeaderboard';
import PlayerLevel from '../components/gamification/PlayerLevel';
import AchievementBadge from '../components/gamification/AchievementBadge';
import { KitchenAmbiance, ScoreAnimationWrapper, AchievementAnimationWrapper } from '../components/effects/AnimationWrapper';

function PlayPage() {
  const hasValidApiKey = useHasValidApiKey();
  const { addEntry, entries } = useLeaderboard();
  const {
    player,
    processRecipeSubmission,
    clearNotifications,
    getPlayerLevel,
    getProgress,
    loadChef,
    getAllChefProfiles
  } = useGameification();

  const [judgeResponse, setJudgeResponse] = useState<JudgeResponse | null>(null);
  const [lastRecipe, setLastRecipe] = useState<Recipe | null>(null);
  const [lastPlayerName, setLastPlayerName] = useState<string>('');
  const [lastJudgeStyle, setLastJudgeStyle] = useState<JudgeStyle>('classic-rage');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [activeNotifications, setActiveNotifications] = useState<AchievementNotification[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [xpTabActive, setXpTabActive] = useState(false);

  const handleJudgeComplete = async (response: JudgeResponse, recipe: Recipe, playerName: string, judgeStyle: JudgeStyle) => {
    setJudgeResponse(response);
    setLastRecipe(recipe);
    setLastPlayerName(playerName);
    setLastJudgeStyle(judgeStyle);

    // Process gamification for this recipe submission
    if (playerName.trim()) {
      try {
        const notifications = await processRecipeSubmission(
          recipe,
          response,
          playerName.trim(),
          judgeStyle,
          entries
        );

        if (notifications.length > 0) {
          setActiveNotifications(notifications);

          // Check for level up
          const hasLevelUp = notifications.some(n => n.levelUp);
          if (hasLevelUp) {
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 5000); // Hide after 5 seconds
          }
        }
      } catch (error) {
        console.error('Failed to process gamification:', error);
      }
    }
  };

  const handleTryAgain = () => {
    setJudgeResponse(null);
    setLastRecipe(null);
    setLastPlayerName('');
    setLastJudgeStyle('classic-rage');
    setIsSaving(false);
    setActiveNotifications([]);
    setShowLevelUp(false);
    setResetKey(prev => prev + 1);
  };

  const handleDismissNotification = (index: number) => {
    setActiveNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const handleDismissAllNotifications = () => {
    setActiveNotifications([]);
    clearNotifications();
  };

  const handleSaveToLeaderboard = async () => {
    if (!judgeResponse || !lastRecipe || !lastPlayerName) {
      return;
    }

    // Store the data before clearing the state
    const recipeToSave = lastRecipe;
    const responseToSave = judgeResponse;
    const playerNameToSave = lastPlayerName;
    const judgeStyleToSave = lastJudgeStyle;

    // Clear the UI immediately to show leaderboard
    setJudgeResponse(null);
    setLastRecipe(null);
    setLastPlayerName('');
    setLastJudgeStyle('classic-rage');
    setIsSaving(false);
    setActiveNotifications([]);
    setShowLevelUp(false);
    setResetKey(prev => prev + 1);

    // Save in background
    try {
      const success = await addEntry(recipeToSave, responseToSave, playerNameToSave, judgeStyleToSave);
      if (!success) {
        alert('Failed to save to leaderboard. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save to leaderboard:', error);
      alert('Failed to save to leaderboard. Please try again.');
    }
  };

  const handleEntryClick = (entry: LeaderboardEntry) => {
    setSelectedEntry(entry);
  };

  const handleCloseEntryModal = () => {
    setSelectedEntry(null);
  };


  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Effects */}
      <KitchenAmbiance
        intensity={(judgeResponse?.rage_score || 0) >= 80 ? 'high' : (judgeResponse?.rage_score || 0) >= 50 ? 'medium' : 'low'}
        score={judgeResponse?.rage_score || 0}
        className="fixed inset-0 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page Masthead ── */}
        <ScoreAnimationWrapper score={judgeResponse?.rage_score || 0} className="mb-10">
          <div
            className="relative text-center rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(127,29,29,0.18) 0%, rgba(10,0,0,0.55) 100%)',
              border: '1px solid rgba(220,38,38,0.3)',
              boxShadow: '0 0 60px rgba(220,38,38,0.1) inset, 0 4px 40px rgba(0,0,0,0.5)',
              padding: '40px 24px 32px',
            }}
          >
            {/* Decorative corner flames */}
            <span className="absolute top-3 left-4 text-2xl animate-flame-flicker opacity-50">🔥</span>
            <span className="absolute top-3 right-4 text-2xl animate-flame-flicker opacity-50" style={{ animationDelay: '0.7s' }}>🔥</span>

            {/* Title */}
            <h1
              className="font-chef font-black uppercase tracking-widest text-white mb-2"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                textShadow: '0 0 30px rgba(220,38,38,0.9), 0 0 60px rgba(220,38,38,0.5)',
                letterSpacing: '0.12em',
              }}
            >
              Hell's Kitchen
            </h1>

            {/* Flame divider */}
            <div
              className="mx-auto mb-3"
              style={{
                height: '2px',
                width: '180px',
                background: 'linear-gradient(90deg, transparent, #dc2626, #f97316, #dc2626, transparent)',
              }}
            />

            <p
              className="font-black uppercase mb-1"
              style={{
                fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                letterSpacing: '0.35em',
                color: '#f97316',
                textShadow: '0 0 12px rgba(249,115,22,0.7)',
              }}
            >
              Ragebait Simulator
            </p>
            <p style={{ color: 'rgba(156,163,175,0.7)', fontSize: '14px', marginTop: '8px' }}>
              Submit your worst recipes &mdash;{' '}
              <span style={{ color: 'rgba(239,68,68,0.85)', fontWeight: 700 }}>Gordon Ramsay WILL disagree</span>
            </p>

            {/* Player Level Display */}
            {player && getPlayerLevel() && (
              <div className="mt-5 flex justify-center">
                <PlayerLevel
                  level={getPlayerLevel()!}
                  currentXP={player.totalXP}
                  nextLevel={getProgress().nextLevel}
                  size="sm"
                  showProgress={true}
                />
              </div>
            )}

            {/* Level Up Celebration */}
            {showLevelUp && (
              <AchievementAnimationWrapper isNew={true} rarity="legendary" className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="hell-kitchen-bg border-4 border-flame-500 rounded-lg p-6 shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-2 animate-gordon-rage">🏆</div>
                    <div className="text-3xl font-bold text-flame-300 animate-burning-text">LEVEL UP!</div>
                    <div className="text-lg text-hell-300 font-bold">{getPlayerLevel()?.title}</div>
                  </div>
                </div>
              </AchievementAnimationWrapper>
            )}
          </div>
        </ScoreAnimationWrapper>

        {/* API Key Check */}
        {!hasValidApiKey && (
          <div className="mb-8 animate-slide-in-down">
            <ApiKeyPrompt onKeySet={() => {}} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Recipe Form Panel */}
          <div className="xl:col-span-2 animate-fade-in">
            {hasValidApiKey ? (
              <RecipeForm
                onJudgeComplete={handleJudgeComplete}
                onChefChange={loadChef}
                resetKey={resetKey}
              />
            ) : (
              <div className="hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl p-12 text-center hell-glow">
                <div className="text-hell-300">
                  <div className="text-6xl mb-4 animate-gordon-rage">😡</div>
                  <p className="text-lg font-bold text-flame-300">
                    <span className="animate-burning-text">GORDON IS WAITING...</span>
                  </p>
                  <p className="text-steel-300 mt-2">
                    Enter your OpenAI API key above to face the Kitchen Nightmare!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results/Leaderboard Panel */}
          <div className="xl:col-span-1 animate-fade-in delay-200 xl:sticky xl:top-8 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
            {judgeResponse ? (
              <ScoreAnimationWrapper score={judgeResponse.rage_score}>
                <JudgeResponseComponent
                  response={judgeResponse}
                  onSaveToLeaderboard={handleSaveToLeaderboard}
                  onTryAgain={handleTryAgain}
                  isSaving={isSaving}
                />
              </ScoreAnimationWrapper>
            ) : (
              <div>
                {/* Tab switcher */}
                <div className="flex mb-4 border-b border-flame-700">
                  <button
                    onClick={() => setXpTabActive(false)}
                    className={`px-4 py-2 text-sm font-bold transition-colors ${
                      !xpTabActive
                        ? 'text-flame-300 border-b-2 border-flame-400'
                        : 'text-steel-400 hover:text-hell-300'
                    }`}
                  >
                    🔥 Score
                  </button>
                  <button
                    onClick={() => setXpTabActive(true)}
                    className={`px-4 py-2 text-sm font-bold transition-colors ${
                      xpTabActive
                        ? 'text-flame-300 border-b-2 border-flame-400'
                        : 'text-steel-400 hover:text-hell-300'
                    }`}
                  >
                    ⭐ XP
                  </button>
                </div>

                {xpTabActive ? (
                  <XPLeaderboard profiles={getAllChefProfiles()} />
                ) : (
                  <Leaderboard
                    showControls={true}
                    onEntryClick={handleEntryClick}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Achievement Notifications */}
        {activeNotifications.length > 0 && (
          <div className="fixed top-4 right-4 z-40 space-y-3 max-w-sm">
            {activeNotifications.map((notification, index) => (
              <AchievementAnimationWrapper key={index} isNew={true} rarity={notification.achievement.category === 'special' ? 'legendary' : 'epic'}>
                <div className="relative">
                  <AchievementBadge
                    achievement={notification.achievement}
                    size="lg"
                    showDescription={true}
                    isUnlocked={true}
                    isNew={true}
                  />
                  <button
                    onClick={() => handleDismissNotification(index)}
                    className="absolute -top-2 -right-2 bg-hell-600 text-hell-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-hell-500 transition-colors"
                  >
                    ×
                  </button>
                  {notification.xpGained && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-flame-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                      +{notification.xpGained} XP
                    </div>
                  )}
                </div>
              </AchievementAnimationWrapper>
            ))}
            {activeNotifications.length > 1 && (
              <button
                onClick={handleDismissAllNotifications}
                className="w-full text-center text-sm text-steel-400 hover:text-flame-400 transition-colors font-semibold"
              >
                Dismiss All ({activeNotifications.length})
              </button>
            )}
          </div>
        )}

        {hasValidApiKey && !judgeResponse && (
          <div className="mt-12 text-center animate-slide-up">
            <div className="hell-kitchen-bg border-2 border-flame-600 rounded-lg p-6 max-w-2xl mx-auto shadow-xl">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-2xl animate-flame-flicker">🔥</span>
                <h3 className="text-lg font-bold text-hell-300">
                  GORDON'S RAGE MAXIMIZATION GUIDE
                </h3>
                <span className="text-2xl animate-flame-flicker">🔥</span>
              </div>
              <ul className="text-left text-flame-300 space-y-3 text-sm font-semibold">
                <li className="flex items-start space-x-2">
                  <span className="text-hell-400 animate-sizzle">💥</span>
                  <span>Use bizarre ingredient combinations (pineapple on pizza is amateur hour!)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-hell-400 animate-boil">🔥</span>
                  <span>Describe terrible cooking techniques (microwaving steaks? Gordon's nightmare!)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-hell-400 animate-steam">💨</span>
                  <span>Mix cuisines in the most ridiculous ways possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-hell-400 animate-sizzle delay-100">⚡</span>
                  <span>Don't forget to mention any "special" preparation methods</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-hell-400 animate-flame-flicker">👹</span>
                  <span className="animate-burning-text">The more detailed your disaster, the better Gordon's fury!</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Full Leaderboard Modal */}
        {showFullLeaderboard && (
          <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-kitchen-900 opacity-90" onClick={() => setShowFullLeaderboard(false)}></div>
              </div>

              <div className="inline-block align-middle hell-kitchen-bg border-2 border-hell-600 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-6xl max-h-[90vh] overflow-y-auto hell-glow animate-scale-in">
                <div className="hell-kitchen-bg">
                  <div className="flex items-center justify-between p-6 border-b border-flame-600 bg-gradient-to-r from-hell-800 to-hell-700">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl animate-flame-flicker">🏆</span>
                      <h3 className="text-2xl font-bold text-hell-100 font-chef">
                        HALL OF CULINARY SHAME
                      </h3>
                      <span className="text-3xl animate-flame-flicker">🏆</span>
                    </div>
                    <button
                      onClick={() => setShowFullLeaderboard(false)}
                      className="text-hell-400 hover:text-hell-200 transition-colors animate-bounce"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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
          <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-kitchen-900 opacity-90" onClick={handleCloseEntryModal}></div>
              </div>

              <div className="inline-block align-middle hell-kitchen-bg border-2 border-hell-600 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl max-h-[90vh] overflow-y-auto hell-glow animate-scale-in">
                <ScoreAnimationWrapper score={selectedEntry.rage_score}>
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
                </ScoreAnimationWrapper>
                <div className="px-6 pb-6 border-t border-flame-600 bg-gradient-to-r from-hell-800 to-hell-700">
                  <div className="flex items-center justify-between text-sm text-steel-300">
                    <span className="flex items-center space-x-2">
                      <span className="animate-flame-flicker">👨‍🍳</span>
                      <span>Recipe by <strong className="text-hell-300 font-bold">{selectedEntry.playerName}</strong></span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <span className="animate-steam">📅</span>
                      <span>{new Date(selectedEntry.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayPage