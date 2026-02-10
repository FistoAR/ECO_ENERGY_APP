import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useExpo } from '../context/ExpoContext';
import { customerApi, employeeApi, expoApi } from '../services/api';
import { 
  FiDatabase, 
  FiUserPlus, 
  FiBarChart2, 
  FiUsers, 
  FiActivity, 
  FiArrowRight,
  FiCalendar,
  FiChevronDown,
  FiCheck,
  FiMapPin,
  FiClock,
  FiLoader,
  FiRefreshCw,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

const menuItems = [
  { 
    title: 'Master Page', 
    desc: 'Manage Expo, Products, Enquiry Types & Whatsapp Message', 
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
];

export default function Home() {
  const navigate = useNavigate();
  const { currentExpo, allExpos, loading, error, selectExpo, refresh } = useExpo();
  const [showExpoDropdown, setShowExpoDropdown] = useState(false);
  const [isChangingExpo, setIsChangingExpo] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({
    customers: { total: 0, loading: true, error: null },
    employees: { total: 0, active: 0, loading: true, error: null },
    expos: { total: 0, active: 0, loading: true, error: null }
  });
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  // Fetch all stats
  const fetchStats = useCallback(async () => {
    setIsRefreshingStats(true);
    
    // Fetch customers count
    try {
      const customerResponse = await customerApi.getAll(1, 1);
      if (customerResponse.success && customerResponse.data?.pagination) {
        setStats(prev => ({
          ...prev,
          customers: {
            total: customerResponse.data.pagination.total_items || 0,
            loading: false,
            error: null
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setStats(prev => ({
        ...prev,
        customers: { ...prev.customers, loading: false, error: 'Failed to load' }
      }));
    }

    // Fetch employees count
    try {
      const employeeResponse = await employeeApi.getAll(1, 1);
      if (employeeResponse.success && employeeResponse.data) {
        setStats(prev => ({
          ...prev,
          employees: {
            total: employeeResponse.data.pagination?.total_items || 0,
            active: employeeResponse.data.stats?.active || 0,
            loading: false,
            error: null
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setStats(prev => ({
        ...prev,
        employees: { ...prev.employees, loading: false, error: 'Failed to load' }
      }));
    }

    // Fetch expos count
    try {
      const expoResponse = await expoApi.getAll(1, 1000);
      if (expoResponse.success && expoResponse.data) {
        const expos = expoResponse.data.data || [];
        const activeExpos = expos.filter(e => e.status === 'active').length;
        setStats(prev => ({
          ...prev,
          expos: {
            total: expoResponse.data.pagination?.total_items || expos.length,
            active: activeExpos,
            loading: false,
            error: null
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching expos:', err);
      setStats(prev => ({
        ...prev,
        expos: { ...prev.expos, loading: false, error: 'Failed to load' }
      }));
    }

    setIsRefreshingStats(false);
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh stats when expo changes
  useEffect(() => {
    if (currentExpo) {
      fetchStats();
    }
  }, [currentExpo?.id, fetchStats]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDates = (dates) => {
    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return 'No dates set';
    }
    
    if (dates.length === 1) {
      return formatDate(dates[0]);
    }
    
    const sorted = [...dates].sort();
    return `${formatDate(sorted[0])} - ${formatDate(sorted[sorted.length - 1])}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const handleExpoSelect = async (expo) => {
    if (expo.id === currentExpo?.id) {
      setShowExpoDropdown(false);
      return;
    }

    setIsChangingExpo(true);
    try {
      const result = await selectExpo(expo);
      if (result.success) {
        setShowExpoDropdown(false);
      } else {
        alert('Failed to change expo: ' + result.error);
      }
    } catch (err) {
      alert('Error changing expo');
    } finally {
      setIsChangingExpo(false);
    }
  };

  const handleRefreshAll = () => {
    refresh();
    fetchStats();
  };

  // Stats cards configuration
  const statsCards = [
    { 
      label: 'Total Customers', 
      value: stats.customers.total,
      loading: stats.customers.loading,
      error: stats.customers.error,
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-100 to-blue-50',
      path: '/reports'
    },
    { 
      label: 'Active Expos', 
      value: stats.expos.active,
      subValue: `of ${stats.expos.total} total`,
      loading: stats.expos.loading,
      error: stats.expos.error,
      icon: FiCalendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-100 to-green-50',
      path: '/master'
    },
    { 
      label: 'Employees', 
      value: stats.employees.total,
      subValue: `${stats.employees.active} active`,
      loading: stats.employees.loading,
      error: stats.employees.error,
      icon: FiActivity,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-100 to-purple-50',
      path: '/employees'
    },
  ];

  // Show loading state
  if (loading && !currentExpo) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FiLoader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button 
              onClick={handleRefreshAll}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Current Expo Selector - Featured Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white relative ">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium">Current Expo</p>
                  {currentExpo ? (
                    <h2 className="text-lg sm:text-xl font-bold mt-0.5">{currentExpo.name}</h2>
                  ) : (
                    <h2 className="text-lg sm:text-xl font-bold mt-0.5 text-slate-400">No Expo Selected</h2>
                  )}
                </div>
              </div>

              {/* Expo Selector Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExpoDropdown(!showExpoDropdown)}
                  disabled={isChangingExpo || allExpos.length === 0}
                  className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingExpo ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Changing...</span>
                    </>
                  ) : (
                    <>
                      <span>Change Expo</span>
                      <FiChevronDown className={`w-4 h-4 transition-transform ${showExpoDropdown ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {/* Dropdown */}
                {showExpoDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowExpoDropdown(false)}
                    ></div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-full sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Expo</p>
                        <span className="text-xs text-gray-400">{allExpos.length} available</span>
                      </div>
                      
                      {allExpos.length === 0 ? (
                        <div className="p-6 text-center">
                          <FiCalendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No expos available</p>
                          <button
                            onClick={() => {
                              setShowExpoDropdown(false);
                              navigate('/master');
                            }}
                            className="mt-3 text-green-600 text-sm font-medium hover:underline"
                          >
                            Create an expo →
                          </button>
                        </div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto">
                          {allExpos.map((expo) => (
                            <button
                              key={expo.id}
                              onClick={() => handleExpoSelect(expo)}
                              disabled={isChangingExpo}
                              className={`w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 disabled:opacity-50 ${
                                currentExpo?.id === expo.id ? 'bg-green-50' : ''
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                expo.status === 'active' 
                                  ? 'bg-green-100 text-green-600' 
                                  : expo.status === 'completed'
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-amber-100 text-amber-600'
                              }`}>
                                <FiCalendar className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900 truncate">{expo.name}</p>
                                  {currentExpo?.id === expo.id && (
                                    <FiCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                  <FiMapPin className="w-3 h-3" />
                                  <span className="truncate">{expo.location}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {formatDates(expo.dates)}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                                expo.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : expo.status === 'completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {expo.status}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Expo Details */}
            {currentExpo && (
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <FiMapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{currentExpo.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiClock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{formatDates(currentExpo.dates)}</span>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  currentExpo.status === 'active'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : currentExpo.status === 'completed'
                    ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {currentExpo.status === 'active' ? '● Live Now' : currentExpo.status === 'completed' ? '✓ Completed' : '○ Upcoming'}
                </span>
              </div>
            )}

            {/* No Expo Selected State */}
            {!currentExpo && !loading && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-slate-400 text-sm">Please select an expo to continue</p>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Section - Mobile Only */}
        <div className="sm:hidden bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Welcome back! 👋</h2>
              <p className="text-green-100 text-sm mt-1">Here's what's happening today</p>
            </div>
            <button
              onClick={fetchStats}
              disabled={isRefreshingStats}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshingStats ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {statsCards.map((stat, i) => (
            <div 
              key={i} 
              onClick={() => navigate(stat.path)}
              className={`group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-green-200 cursor-pointer ${
                i === 2 ? 'xs:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-2.5 sm:p-3 lg:p-4 bg-gradient-to-br ${stat.bgColor} rounded-xl sm:rounded-2xl group-hover:scale-105 transition-all duration-300 flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('green') ? '#22c55e' : '#a855f7' }} />
                </div>
                <div className="flex-1 min-w-0">
                  {stat.loading ? (
                    <div className="flex items-center gap-2">
                      <FiLoader className="w-5 h-5 text-gray-400 animate-spin" />
                      <span className="text-gray-400 text-sm">Loading...</span>
                    </div>
                  ) : stat.error ? (
                    <div className="flex items-center gap-2">
                      <FiAlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">{stat.error}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                          {formatNumber(stat.value)}
                        </p>
                      </div>
                      {stat.subValue && (
                        <p className="text-xs text-gray-500 mt-0.5">{stat.subValue}</p>
                      )}
                    </>
                  )}
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium truncate">{stat.label}</p>
                </div>
                <FiArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Stats Button - Desktop */}
        <div className="hidden sm:flex justify-end">
          <button
            onClick={fetchStats}
            disabled={isRefreshingStats}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRefreshingStats ? 'animate-spin' : ''}`} />
            {isRefreshingStats ? 'Refreshing...' : 'Refresh Stats'}
          </button>
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
  );
}