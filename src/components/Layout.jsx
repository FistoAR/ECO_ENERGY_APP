import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiUser, FiLogOut, FiBell, FiChevronDown, FiMenu } from 'react-icons/fi'
import ecoLogo from '../assets/eco-energy-logo.svg'


export default function Layout({ title, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-5">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-green-50 rounded-xl transition-all duration-200"
              >
                <img 
                  src={ecoLogo} 
                  alt="Eco Energy" 
                  className="w-12 h-12 lg:w-15 lg:h-15 transition-transform cursor-pointer"
                />
              </button>
              
              <div className="hidden lg:flex items-center gap-2">
                
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 lg:gap-3">
              
              

            
            

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 lg:gap-3 p-2 hover:bg-gray-100 rounded-xl transition-all group"
                >
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="font-semibold text-sm text-gray-900">{user?.name}</p>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 lg:w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-3">
                    {/* Profile Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.role} • {user?.department}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Logout */}
                    <button
                      onClick={() => { 
                        setShowProfile(false)
                        logout()
                        navigate('/login') 
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Title Bar */}
      <div className="lg:hidden bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiHome className="text-xl text-green-600" />
            {title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {children}
      </main>
    </div>
  )
}
