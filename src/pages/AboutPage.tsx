import { useState } from 'react';
import { getRageScoreLevel } from '../utils/constants';

function AboutPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'faq' | 'privacy'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '🍳' },
    { id: 'features' as const, label: 'Features', icon: '⚡' },
    { id: 'faq' as const, label: 'FAQ', icon: '❓' },
    { id: 'privacy' as const, label: 'Privacy & Safety', icon: '🛡️' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🍳 Let's Ragebait Gordon Ramsay
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The ultimate culinary comedy game where terrible recipes meet brutal AI judgment.
          Submit your most outrageous cooking disasters and watch Gordon Ramsay's AI avatar lose his mind!
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-t-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-rage-500 text-rage-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Culinary Chaos!</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-600 mb-4">
                      Ever wondered what Gordon Ramsay would think of your cooking? Now you can find out without
                      risking actual food poisoning! Submit your most ridiculous recipe ideas and watch our AI
                      Gordon judge them with increasing levels of rage.
                    </p>
                    <p className="text-gray-600">
                      From questionable ingredient combinations to downright dangerous cooking methods, nothing is
                      off limits. The worse your recipe, the higher your rage score!
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-rage-50 to-red-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-rage-800 mb-4">🎯 Game Objective</h3>
                    <ul className="space-y-2 text-rage-700">
                      <li>• Create the most rage-inducing recipes</li>
                      <li>• Score 80+ points for maximum Gordon fury</li>
                      <li>• Climb the leaderboard of disasters</li>
                      <li>• Laugh at the brutal but hilarious critiques</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">How to Play</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { step: '1', title: 'Enter API Key', desc: 'Add your OpenAI API key (stays secure in your browser)', icon: '🔑' },
                    { step: '2', title: 'Submit Recipe', desc: 'Write your most outrageous culinary creation', icon: '📝' },
                    { step: '3', title: 'Get Judged', desc: 'Watch Gordon AI tear apart your cooking', icon: '⚡' },
                    { step: '4', title: 'Save & Share', desc: 'Add your score to the leaderboard', icon: '🏆' }
                  ].map((item) => (
                    <div key={item.step} className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <div className="text-2xl font-bold text-rage-600 mb-2">Step {item.step}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Rage Score System</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { range: '90-100', label: 'ABSOLUTE DISASTER', color: 'bg-red-900 text-white', emoji: '💀' },
                    { range: '70-89', label: 'KITCHEN NIGHTMARE', color: 'bg-red-700 text-white', emoji: '🔥' },
                    { range: '50-69', label: 'TERRIBLE', color: 'bg-orange-600 text-white', emoji: '😤' },
                    { range: '30-49', label: 'MEDIOCRE', color: 'bg-yellow-500 text-black', emoji: '😐' },
                    { range: '0-29', label: 'NOT BAD', color: 'bg-green-500 text-white', emoji: '👍' }
                  ].map((level) => (
                    <div key={level.range} className={`rounded-lg p-4 text-center ${level.color}`}>
                      <div className="text-2xl mb-2">{level.emoji}</div>
                      <div className="font-bold text-sm">{level.range}</div>
                      <div className="text-xs">{level.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Game Features</h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-rage-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">AI Judge Personalities</h3>
                        <p className="text-gray-600">Choose from 4 different Gordon Ramsay personalities:</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li><strong>Classic Rage:</strong> Explosive anger and dramatic reactions</li>
                          <li><strong>Dry Sarcasm:</strong> Cutting wit and sophisticated insults</li>
                          <li><strong>Disappointed:</strong> Sad disappointment instead of fury</li>
                          <li><strong>Constructive:</strong> Harsh but educational feedback</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Smart Leaderboard</h3>
                        <p className="text-gray-600">Local leaderboard with advanced features:</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Sort by rage score or submission date</li>
                          <li>• Pagination for large collections</li>
                          <li>• Statistics and analytics</li>
                          <li>• Export data as JSON</li>
                          <li>• Entry management and cleanup</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">BYOK Security</h3>
                        <p className="text-gray-600">Bring Your Own Key approach ensures:</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Your API key never leaves your browser</li>
                          <li>• Direct communication with OpenAI only</li>
                          <li>• Session or persistent storage options</li>
                          <li>• No server-side data collection</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Smart Validation</h3>
                        <p className="text-gray-600">Robust error handling and validation:</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Automatic retry for failed AI responses</li>
                          <li>• JSON validation with error recovery</li>
                          <li>• Fallback responses for network issues</li>
                          <li>• Real-time form validation</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Responsive Design</h3>
                        <p className="text-gray-600">Optimized for all devices:</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Mobile-first responsive layout</li>
                          <li>• Touch-friendly interactions</li>
                          <li>• Adaptive navigation and controls</li>
                          <li>• Optimized loading states</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎭</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Entertainment Features</h3>
                        <p className="text-gray-600">Built for maximum fun:</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Animated rage score visualization</li>
                          <li>• Entertaining loading messages</li>
                          <li>• Tag-based categorization</li>
                          <li>• Detailed judgment breakdowns</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Stack</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• React 18 with TypeScript</li>
                      <li>• Vite for fast development</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• React Router for navigation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">AI Integration</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• OpenAI GPT-4 API</li>
                      <li>• Client-side BYOK approach</li>
                      <li>• Structured JSON responses</li>
                      <li>• Retry logic and error handling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Data Management</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Zod for runtime validation</li>
                      <li>• localStorage for persistence</li>
                      <li>• UUID for unique identifiers</li>
                      <li>• Cross-tab synchronization</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

                <div className="space-y-6">
                  {[
                    {
                      q: "Do I need to sign up or create an account?",
                      a: "No! The game works entirely in your browser with no account required. Just bring your own OpenAI API key and start playing."
                    },
                    {
                      q: "How much does it cost to play?",
                      a: "The game is free, but you need your own OpenAI API key. Each judgment costs a few cents (typically $0.01-$0.05) depending on the length of your recipe and the AI's response."
                    },
                    {
                      q: "Is my API key safe?",
                      a: "Yes! Your API key is stored only in your browser (localStorage or session memory) and is never sent to our servers. It's only used to communicate directly with OpenAI's API."
                    },
                    {
                      q: "Can I play offline?",
                      a: "You need an internet connection to get AI judgments, but once loaded, you can view your saved leaderboard entries offline."
                    },
                    {
                      q: "How accurate are the AI responses?",
                      a: "The AI is designed for entertainment, not actual culinary advice! The judgments are humorous and exaggerated for comedic effect."
                    },
                    {
                      q: "What happens to my leaderboard data?",
                      a: "All leaderboard data is stored locally on your device. It's not shared with us or anyone else. You can export it as a JSON file or clear it anytime."
                    },
                    {
                      q: "Can I share my recipes and scores?",
                      a: "The leaderboard is local to your device, but you can export your data or screenshot your results to share with friends!"
                    },
                    {
                      q: "Are there any content restrictions?",
                      a: "Yes, the AI is programmed to keep responses family-friendly and focused only on food/cooking critique. Personal attacks or inappropriate content are filtered out."
                    },
                    {
                      q: "Why does the AI sometimes give weird responses?",
                      a: "We have retry logic and fallback responses, but AI can be unpredictable! If you get a broken response, try submitting again."
                    },
                    {
                      q: "Can I suggest new features?",
                      a: "This is a demonstration project, but feel free to fork the code on GitHub and add your own features!"
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">💡 Pro Tips for Maximum Rage</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Recipe Ideas That Drive Gordon Mad:</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Pineapple on pizza (but make it worse)</li>
                      <li>• Microwave "cooking" techniques</li>
                      <li>• Bizarre ingredient combinations</li>
                      <li>• Using ketchup as a "sauce base"</li>
                      <li>• Overcooked pasta with undercooked meat</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Writing Tips:</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Be specific about terrible techniques</li>
                      <li>• Mention questionable storage methods</li>
                      <li>• Include "creative" substitutions</li>
                      <li>• Don't hold back on the details</li>
                      <li>• The more confident you sound, the funnier it is</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy & Safety</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        🔒 Your Data Security
                      </h3>
                      <ul className="text-green-700 space-y-2 text-sm">
                        <li><strong>No Server Storage:</strong> Everything runs in your browser</li>
                        <li><strong>API Key Security:</strong> Never transmitted except to OpenAI</li>
                        <li><strong>Local Data Only:</strong> Recipes and scores stay on your device</li>
                        <li><strong>No Tracking:</strong> We don't collect any personal information</li>
                        <li><strong>No Analytics:</strong> No usage tracking or data collection</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                        🛡️ Content Safety
                      </h3>
                      <ul className="text-blue-700 space-y-2 text-sm">
                        <li><strong>Family-Friendly:</strong> AI responses are filtered for appropriate content</li>
                        <li><strong>Food-Only Insults:</strong> Critiques focus only on cooking, not personal attacks</li>
                        <li><strong>No Hate Speech:</strong> Harmful content is automatically filtered</li>
                        <li><strong>Profanity Filtering:</strong> Any strong language is automatically censored</li>
                        <li><strong>Safe for All Ages:</strong> Designed to be appropriate for everyone</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                        ⚠️ Important Disclaimers
                      </h3>
                      <ul className="text-yellow-700 space-y-2 text-sm">
                        <li><strong>Entertainment Only:</strong> This is a comedy game, not real cooking advice</li>
                        <li><strong>AI Limitations:</strong> Responses may be unpredictable or sometimes nonsensical</li>
                        <li><strong>Not Real Gordon:</strong> This is an AI simulation, not the actual chef</li>
                        <li><strong>Browser Storage:</strong> Data can be lost if browser data is cleared</li>
                        <li><strong>API Costs:</strong> You're responsible for your OpenAI usage costs</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                        🔧 Technical Security
                      </h3>
                      <ul className="text-purple-700 space-y-2 text-sm">
                        <li><strong>HTTPS Only:</strong> All connections are encrypted</li>
                        <li><strong>XSS Protection:</strong> Input sanitization prevents code injection</li>
                        <li><strong>No Dangerous HTML:</strong> User content is safely displayed</li>
                        <li><strong>Error Boundaries:</strong> Crashes are contained and recoverable</li>
                        <li><strong>Input Validation:</strong> All data is validated before processing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Protect You</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🔐 API Key Safety</h4>
                    <p className="text-sm text-gray-600">
                      Your OpenAI API key is encrypted in browser storage and only sent directly to OpenAI's servers.
                      We never see, log, or store your key on any server.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🧹 Data Validation</h4>
                    <p className="text-sm text-gray-600">
                      All user inputs and AI responses are validated and sanitized. Invalid or corrupted data is
                      automatically cleaned up to prevent issues.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🛡️ Safe Responses</h4>
                    <p className="text-sm text-gray-600">
                      The AI is programmed with strict safety guidelines and fallback responses to ensure
                      all content remains appropriate and focused on food critique.
                    </p>
                  </div>
                </div>
              </section>

              <section className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Privacy?</h3>
                <p className="text-gray-600 mb-4">
                  This is an open-source demonstration project. You can review the entire codebase to see exactly
                  how your data is handled. There are no hidden tracking scripts or data collection mechanisms.
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Built with transparency in mind</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">No servers, no databases, no tracking</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">Your privacy is our priority</span>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AboutPage