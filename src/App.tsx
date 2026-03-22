import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'

// Lazy load pages for better performance
const PlayPage = lazy(() => import('./pages/PlayPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

// Navigation component with active state
function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center group transition-transform duration-200 hover:scale-105"
            >
              <h1 className="text-xl font-bold text-rage-700 group-hover:text-rage-800 transition-colors duration-200">
                🍳 Let's Ragebait Gordon Ramsay
              </h1>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  isActive('/')
                    ? 'border-rage-500 text-rage-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎮 Play
              </Link>
              <Link
                to="/about"
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  isActive('/about')
                    ? 'border-rage-500 text-rage-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ℹ️ About
              </Link>
            </div>
          </div>

          {/* Mobile menu button (for future mobile menu implementation) */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rage-500"
              aria-expanded="false"
              aria-label="Main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu (hidden by default) */}
        <div className="sm:hidden border-t border-gray-200 py-2">
          <div className="space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-rage-50 text-rage-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              🎮 Play
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                isActive('/about')
                  ? 'bg-rage-50 text-rage-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              ℹ️ About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner
        size="lg"
        message="Loading the kitchen..."
        className="py-12"
      />
    </div>
  )
}

// 404 Page component
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🍳</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600">
            Looks like this recipe got burned! The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rage-600 hover:bg-rage-700 transition-colors duration-200"
          >
            🎮 Back to Game
          </Link>
          <div>
            <Link
              to="/about"
              className="text-rage-600 hover:text-rage-500 text-sm font-medium transition-colors duration-200"
            >
              Learn About the Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary
      fallbackTitle="Kitchen Fire! 🔥"
      fallbackMessage="Something went wrong in the kitchen! Don't worry, your data is safe."
      showReload={true}
    >
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />

          <main className="flex-1 fade-in">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary
                      fallbackTitle="Game Error"
                      fallbackMessage="Something went wrong with the game. Your progress and API key are safe."
                    >
                      <PlayPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ErrorBoundary
                      fallbackTitle="Page Error"
                      fallbackMessage="Something went wrong loading the about page."
                    >
                      <AboutPage />
                    </ErrorBoundary>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  <span>Made with ❤️ for culinary chaos</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span className="block sm:inline">No actual Gordon Ramsays were harmed</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Powered by OpenAI</span>
                  <span>•</span>
                  <span>Built with React & TypeScript</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App