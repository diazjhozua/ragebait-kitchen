import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'

// Lazy load pages for better performance
const PlayPage = lazy(() => import('./pages/PlayPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

// Navigation component with active state
function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { to: '/', label: 'Play', icon: '🎮', path: '/' },
    { to: '/about', label: 'About', icon: '⚔️', path: '/about' },
    { to: '/settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ]

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, #080000 0%, #130303 60%, #1a0505 100%)',
        borderBottom: '1px solid rgba(220,38,38,0.25)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.9), 0 1px 0 rgba(220,38,38,0.1) inset',
      }}
    >
      {/* Flame accent strip — top */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #7f1d1d 20%, #dc2626 40%, #f97316 50%, #dc2626 60%, #7f1d1d 80%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ height: '64px' }}>

          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <span
              className="text-3xl transition-all duration-300 group-hover:scale-125 group-hover:rotate-12"
              style={{ filter: 'drop-shadow(0 0 10px rgba(249,115,22,0.85))' }}
            >
              🔥
            </span>
            <div className="leading-none">
              <div
                className="font-chef font-black uppercase tracking-widest text-white"
                style={{
                  fontSize: '18px',
                  letterSpacing: '0.18em',
                  textShadow: '0 0 18px rgba(220,38,38,0.95), 0 0 36px rgba(220,38,38,0.5), 0 0 60px rgba(220,38,38,0.2)',
                }}
              >
                Hell's Kitchen
              </div>
              <div
                className="font-black uppercase text-red-500"
                style={{ fontSize: '8px', letterSpacing: '0.38em', marginTop: '1px', opacity: 0.9 }}
              >
                Ragebait Simulator
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label, icon, path }) => {
              const active = isActive(path)
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative px-5 py-2 rounded font-black uppercase transition-all duration-200"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    color: active ? '#ffffff' : 'rgba(239,68,68,0.65)',
                    background: active ? 'rgba(127,29,29,0.5)' : 'transparent',
                    border: active ? '1px solid rgba(220,38,38,0.45)' : '1px solid transparent',
                    textShadow: active ? '0 0 12px rgba(220,38,38,0.9)' : 'none',
                    boxShadow: active ? '0 0 15px rgba(220,38,38,0.15) inset' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = '#ffffff'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(127,29,29,0.3)'
                      ;(e.currentTarget as HTMLElement).style.border = '1px solid rgba(220,38,38,0.3)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.65)'
                      ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.border = '1px solid transparent'
                    }
                  }}
                >
                  <span className="mr-1.5">{icon}</span>
                  {label}
                  {active && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        bottom: '-1px',
                        width: '28px',
                        height: '2px',
                        background: 'linear-gradient(90deg, #dc2626, #f97316, #dc2626)',
                        boxShadow: '0 0 8px rgba(249,115,22,0.8)',
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden">
            <button
              type="button"
              className="p-2 rounded transition-all duration-200"
              style={{ color: 'rgba(239,68,68,0.7)' }}
              aria-label="Main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden py-2" style={{ borderTop: '1px solid rgba(220,38,38,0.2)', background: 'rgba(8,0,0,0.95)' }}>
        <div className="px-4 space-y-1">
          {navLinks.map(({ to, label, icon, path }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-3 py-2 rounded font-black uppercase transition-all duration-200"
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: isActive(path) ? '#fff' : 'rgba(239,68,68,0.7)',
                background: isActive(path) ? 'rgba(127,29,29,0.5)' : 'transparent',
              }}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Flame accent strip — bottom */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(220,38,38,0.5) 50%, transparent 100%)' }} />
    </nav>
  )
}

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4" style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.7))' }}>🔥</div>
          <h1
            className="font-chef font-black mb-3"
            style={{ fontSize: '72px', color: '#dc2626', textShadow: '0 0 30px rgba(220,38,38,0.6)', lineHeight: 1 }}
          >
            404
          </h1>
          <h2 className="text-xl font-bold text-white mb-2" style={{ letterSpacing: '0.1em' }}>
            RECIPE NOT FOUND
          </h2>
          <p style={{ color: 'rgba(156,163,175,0.8)', fontSize: '14px' }}>
            Looks like this dish got burned beyond recognition.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase text-sm rounded transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#fff',
              letterSpacing: '0.15em',
              boxShadow: '0 0 20px rgba(220,38,38,0.4)',
            }}
          >
            🎮 Back to Kitchen
          </Link>
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
      <Router basename={import.meta.env.BASE_URL}>
        <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
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
                <Route
                  path="/settings"
                  element={
                    <ErrorBoundary
                      fallbackTitle="Settings Error"
                      fallbackMessage="Something went wrong loading the settings page."
                    >
                      <SettingsPage />
                    </ErrorBoundary>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <footer
            className="mt-auto"
            style={{
              background: 'linear-gradient(180deg, #0a0000 0%, #080000 100%)',
              borderTop: '1px solid rgba(220,38,38,0.2)',
            }}
          >
            {/* Top flame strip */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(220,38,38,0.5) 30%, rgba(249,115,22,0.6) 50%, rgba(220,38,38,0.5) 70%, transparent 100%)' }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <span style={{ filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.7))' }}>🔥</span>
                  <span
                    className="font-chef italic"
                    style={{ color: 'rgba(220,38,38,0.8)', fontSize: '14px', fontWeight: 700 }}
                  >
                    Hell's Kitchen
                  </span>
                  <span style={{ color: 'rgba(107,114,128,0.5)' }}>•</span>
                  <span style={{ color: 'rgba(107,114,128,0.6)', fontSize: '13px' }}>
                    No actual Gordon Ramsays were harmed
                  </span>
                </div>
                <div
                  className="flex items-center gap-3"
                  style={{ fontSize: '11px', color: 'rgba(107,114,128,0.55)', letterSpacing: '0.05em' }}
                >
                  <span>Powered by OpenAI</span>
                  <span style={{ color: 'rgba(220,38,38,0.4)' }}>•</span>
                  <span>React &amp; TypeScript</span>
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