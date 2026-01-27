import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { 
  FiDatabase, 
  FiUserPlus, 
  FiBarChart2, 
  FiUsers, 
  FiActivity, 
  FiArrowRight,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi'

const menuItems = [
  { 
    title: 'Master Page', 
    desc: 'Manage Expo, Products, Entry Types', 
    icon: FiDatabase, 
    path: '/master', 
    color: 'from-indigo-500 to-indigo-600'
  },
  { 
    title: 'Customer Registration', 
    desc: 'Register new customers', 
    icon: FiUserPlus, 
    path: '/customer-registration', 
    color: 'from-emerald-500 to-emerald-600'
  },
  { 
    title: 'Reports', 
    desc: 'View analytics and reports', 
    icon: FiBarChart2, 
    path: '/reports', 
    color: 'from-amber-500 to-amber-600'
  },
  { 
    title: 'Employees', 
    desc: 'Manage employee details', 
    icon: FiUsers, 
    path: '/employees', 
    color: 'from-rose-500 to-rose-600'
  },
]

const stats = [
  { 
    label: 'Total Customers', 
    value: '1,234', 
    icon: FiUsers,
    change: '+12%',
    changeType: 'positive'
  },
  { 
    label: 'Active Expos', 
    value: '8', 
    icon: FiCalendar,
    change: '+2',
    changeType: 'positive'
  },
  { 
    label: 'Employees', 
    value: '24', 
    icon: FiActivity,
    change: '0',
    changeType: 'neutral'
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <Layout title="Dashboard">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Welcome Section - Mobile Only */}
        <div className="sm:hidden bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">Welcome back! 👋</h2>
          <p className="text-green-100 text-sm mt-1">Here's what's happening today</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-green-200 ${
                i === 2 ? 'xs:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 lg:p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl sm:rounded-2xl group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</p>
                    
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium truncate">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
              <FiDatabase className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Quick Access
          </h2>
          
          {/* Desktop/Tablet Grid View */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 lg:gap-6">
            {menuItems.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-2 hover:border-green-300 cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${item.color} w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 flex-shrink-0`}>
                    <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm lg:text-base mt-3 group-hover:translate-x-2 transition-all duration-300">
                      Open
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile List View */}
          <div className="sm:hidden space-y-2">
            {menuItems.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 active:scale-[0.98] active:bg-gray-50 cursor-pointer transition-all duration-200 flex items-center gap-3"
              >
                <div className={`bg-gradient-to-br ${item.color} w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {item.desc}
                  </p>
                </div>
                
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 group-active:bg-green-100 rounded-lg flex items-center justify-center">
                  <FiArrowRight className="w-4 h-4 text-gray-400 group-active:text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}