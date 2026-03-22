function PlayPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Submit Your Recipe for Judgment
        </h1>
        <p className="text-lg text-gray-600">
          Think your cooking is good? Gordon Ramsay might disagree...
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recipe Form Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Recipe</h2>
          <p className="text-gray-600">Recipe form will be implemented in Phase 3</p>
        </div>

        {/* Leaderboard Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          <p className="text-gray-600">Leaderboard will be implemented in Phase 4</p>
        </div>
      </div>
    </div>
  )
}

export default PlayPage