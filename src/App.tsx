import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoginPage from './pages/LoginPage'
import DiscoverPage from './pages/DiscoverPage'
import ResultsPage from './pages/ResultsPage'
import ChatPage from './pages/ChatPage'
import SuggestPage from './pages/SuggestPage'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import { useAuthStore } from './store/authStore'

const PROTECTED = ['/discover', '/results', '/chat', '/suggest']

export default function App() {
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const showNav = isAuthenticated() && PROTECTED.some((p) => location.pathname.startsWith(p))

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LoginPage />} />
<Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/suggest" element={<ProtectedRoute><SuggestPage /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </>
  )
}
