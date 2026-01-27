import { useState, useEffect } from 'react'
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi'

export const Toast = ({ message = "Success!", type = "success", duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 300) // Wait for exit animation
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          ring: 'ring-green-200 border-green-200',
          icon: 'bg-gradient-to-r from-green-500 to-emerald-600',
          IconComponent: FiCheck
        }
      case 'error':
        return {
          ring: 'ring-red-200 border-red-200',
          icon: 'bg-gradient-to-r from-red-500 to-red-600',
          IconComponent: FiX
        }
      case 'warning':
        return {
          ring: 'ring-amber-200 border-amber-200',
          icon: 'bg-gradient-to-r from-amber-500 to-orange-600',
          IconComponent: FiAlertCircle
        }
      case 'info':
        return {
          ring: 'ring-blue-200 border-blue-200',
          icon: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          IconComponent: FiInfo
        }
      default:
        return {
          ring: 'ring-green-200 border-green-200',
          icon: 'bg-gradient-to-r from-green-500 to-emerald-600',
          IconComponent: FiCheck
        }
    }
  }

  const { ring, icon, IconComponent } = getTypeStyles()

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-out
        ${isExiting 
          ? 'opacity-0 translate-x-full sm:translate-x-full' 
          : 'opacity-100 translate-x-0'
        }
        /* Mobile: bottom center */
        bottom-4 left-4 right-4
        /* Tablet+: top right */
        sm:bottom-auto sm:top-20 sm:left-auto sm:right-4 sm:max-w-sm
      `}
    >
      <div className={`bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-2xl border border-gray-100 w-full ring-2 ${ring}`}>
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg text-white ${icon}`}>
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0 py-0.5 sm:py-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight break-words">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 -m-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 sm:mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-amber-500' :
              'bg-blue-500'
            }`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
    return id
  }

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { showToast, hideToast, toasts }
}

// Toast Container Component (for multiple toasts)
export const ToastContainer = ({ toasts, hideToast }) => {
  return (
    <div className="fixed z-50 pointer-events-none
      /* Mobile: bottom stack */
      bottom-0 left-0 right-0 p-4 space-y-2
      /* Tablet+: top right stack */
      sm:bottom-auto sm:top-16 sm:left-auto sm:right-0 sm:p-4 sm:space-y-3 sm:max-w-sm sm:w-full
    ">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto"
          style={{
            // Stagger animation delay for multiple toasts
            animationDelay: `${index * 100}ms`
          }}
        >
          <ToastItem
            {...toast}
            onClose={() => hideToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}

// Individual Toast Item (for container use)
const ToastItem = ({ message, type = "success", duration = 4000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      
      if (remaining <= 0) {
        clearInterval(interval)
        setIsExiting(true)
        setTimeout(onClose, 300)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          ring: 'ring-green-200 border-green-200',
          icon: 'bg-gradient-to-r from-green-500 to-emerald-600',
          progress: 'bg-green-500',
          IconComponent: FiCheck
        }
      case 'error':
        return {
          ring: 'ring-red-200 border-red-200',
          icon: 'bg-gradient-to-r from-red-500 to-red-600',
          progress: 'bg-red-500',
          IconComponent: FiX
        }
      case 'warning':
        return {
          ring: 'ring-amber-200 border-amber-200',
          icon: 'bg-gradient-to-r from-amber-500 to-orange-600',
          progress: 'bg-amber-500',
          IconComponent: FiAlertCircle
        }
      case 'info':
        return {
          ring: 'ring-blue-200 border-blue-200',
          icon: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          progress: 'bg-blue-500',
          IconComponent: FiInfo
        }
      default:
        return {
          ring: 'ring-green-200 border-green-200',
          icon: 'bg-gradient-to-r from-green-500 to-emerald-600',
          progress: 'bg-green-500',
          IconComponent: FiCheck
        }
    }
  }

  const { ring, icon, progress: progressColor, IconComponent } = getTypeStyles()

  return (
    <div 
      className={`transform transition-all duration-300 ease-out ${
        isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100 animate-slide-in'
      }`}
    >
      <div className={`bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-100 w-full ring-2 ${ring}`}>
        <div className="flex items-start gap-2.5 sm:gap-3">
          {/* Icon */}
          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg text-white ${icon}`}>
            <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0 py-0.5">
            <p className="font-medium text-gray-900 text-xs sm:text-sm leading-snug break-words">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-1 sm:p-1.5 -m-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2.5 sm:mt-3 h-0.5 sm:h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-100 ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default Toast