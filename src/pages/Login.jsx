import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiUser } from 'react-icons/fi'
import ecoLogo from '../assets/eco-energy-logo.svg';

// Simple Logo Component
const Logo = ({ className = "w-15 h-15" }) => (
  <img src={ecoLogo} alt='logo' className={className}/>
)

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the redirect path from location state, or default to home
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!username.trim()) {
      setError('Please enter your username or email')
      return
    }
    
    if (!password) {
      setError('Please enter your password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await login(username.trim(), password)
      
      if (result.success) {
        // Navigate to the page they tried to visit or home
        navigate(from, { replace: true })
      } else {
        setError(result.error || 'Invalid credentials. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 border-4 border-green-100">
            <Logo className="w-15 h-15" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm font-medium">Login Failed</p>
                  <p className="text-red-600 text-sm mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Username/Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter username or email"
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button 
                type="button"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
                onClick={() => alert('Please contact administrator to reset your password.')}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Eco Energy. All rights reserved.
        </p>
      </div>
    </div>
  )
}