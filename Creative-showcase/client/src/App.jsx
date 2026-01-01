import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ArtworkProvider } from './contexts/ArtworkContext'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Page Components
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import BrowsePage from './pages/BrowsePage'
import ArtworkDetail from './pages/ArtworkDetail'
import SettingsPage from './pages/SettingsPage'
import UploadPage from './pages/UploadPage'
import NotFound from './pages/NotFound'
import ConnectionTest from './components/ConnectionTest'

// Route Guards
import PrivateRoute from './components/routes/PrivateRoute'
import PublicRoute from './components/routes/PublicRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ArtworkProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                } />
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/conn" element={
                  <PublicRoute>
                    <ConnectionTest />
                  </PublicRoute>
                } />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/artwork/:id" element={<ArtworkDetail />} />

                {/* Private Routes */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/upload" element={
                  <PrivateRoute>
                    <UploadPage />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                } />

                {/* Error Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </ArtworkProvider>
      </AuthProvider>
    </Router>
  )
}

export default App