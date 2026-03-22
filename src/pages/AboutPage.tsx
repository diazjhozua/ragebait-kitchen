function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Let's Ragebait Gordon Ramsay
        </h1>

        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            Welcome to the most entertaining cooking game where bad recipes meet brutal honesty!
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li>Submit your most outrageous recipe ideas</li>
            <li>Get roasted by our AI Gordon Ramsay judge</li>
            <li>Earn rage points based on how terrible your cooking is</li>
            <li>Climb the leaderboard of culinary disasters</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              🔑 Bring Your Own Key (BYOK)
            </h3>
            <p className="text-yellow-700">
              This game uses your own OpenAI API key for AI responses. Your key stays local
              in your browser and is only used to communicate directly with OpenAI.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📊 Local Leaderboard
            </h3>
            <p className="text-blue-700">
              The leaderboard is stored locally on your device. It's not shared with others
              and can be edited (we trust you to play fair!).
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🛡️ Safety First
            </h3>
            <p className="text-green-700">
              Our AI judge only insults your food and cooking skills, never personal attacks.
              All content is kept family-friendly and focused on culinary critique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage