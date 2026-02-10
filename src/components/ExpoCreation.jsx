import { FiEdit2, FiTrash2, FiMapPin, FiCalendar } from 'react-icons/fi';

export default function ExpoCreation({ data = [], onEdit, onDelete, startIndex = 0 }) {
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-orange-100 text-orange-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDot = (status) => {
    const styles = {
      active: 'bg-green-500',
      upcoming: 'bg-orange-500',
      completed: 'bg-gray-500',
    };
    return styles[status] || 'bg-gray-500';
  };

  // Format dates for display
  const formatDates = (dates) => {
    if (!dates) return 'No dates';
    
    // Handle both single date (string) and multiple dates (array)
    const dateArray = Array.isArray(dates) ? dates : [dates];
    
    if (dateArray.length === 0) return 'No dates';
    
    // Sort dates
    const sortedDates = [...dateArray].sort((a, b) => new Date(a) - new Date(b));
    
    return sortedDates.map(date => 
      new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    );
  };

  // Get date range text
  const getDateRangeText = (dates) => {
    const formattedDates = formatDates(dates);
    if (!Array.isArray(formattedDates)) return formattedDates;
    
    if (formattedDates.length === 1) {
      return formattedDates[0];
    } else if (formattedDates.length === 2) {
      return `${formattedDates[0]} & ${formattedDates[1]}`;
    } else {
      return `${formattedDates[0]} - ${formattedDates[formattedDates.length - 1]}`;
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-4 py-3 border border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">
                S.No
              </th>
              <th className="px-4 py-3 border border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Expo Name
              </th>
              <th className="px-4 py-3 border border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 border border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-4 py-3 border border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-28">
                Status
              </th>
              <th className="px-4 py-3 border border-gray-200 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((expo, index) => {
              const dates = formatDates(expo.dates || expo.date);
              const dateArray = Array.isArray(dates) ? dates : [dates];
              
              return (
                <tr
                  key={expo.id}
                  className="hover:bg-green-50/50 transition-colors group bg-white"
                >
                  <td className="px-4 py-3 border border-gray-200 align-top">
                    <span className="text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-gray-200 align-top">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(expo.status)}`}></div>
                      <span className="text-sm font-semibold text-gray-900">{expo.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border border-gray-200 align-top">
                    <div className="flex items-center gap-1.5">
                      <FiMapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{expo.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border border-gray-200 align-top">
                    <div className="space-y-1">
                      {dateArray.length <= 3 ? (
                        // Show all dates if 3 or fewer
                        dateArray.map((date, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <FiCalendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{date}</span>
                          </div>
                        ))
                      ) : (
                        // Show summary if more than 3 dates
                        <>
                          <div className="flex items-center gap-1.5">
                            <FiCalendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{dateArray[0]}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 ml-5">...</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FiCalendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{dateArray[dateArray.length - 1]}</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-5">
                            {dateArray.length} days
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 border border-gray-200 align-top">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(expo.status)}`}>
                      {expo.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-gray-200 align-top">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(expo)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all hover:scale-110 cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(expo.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {data.map((expo, index) => {
          const dates = formatDates(expo.dates || expo.date);
          const dateArray = Array.isArray(dates) ? dates : [dates];
          
          return (
            <div
              key={expo.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      #{startIndex + index + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusBadge(expo.status)}`}>
                      {expo.status}
                    </span>
                    {dateArray.length > 1 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dateArray.length} days
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">{expo.name}</h4>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                    <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{expo.location}</span>
                  </div>
                  
                  {/* Dates Section */}
                  <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Event Dates:</p>
                    {dateArray.length <= 3 ? (
                      dateArray.map((date, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FiCalendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{dateArray[0]} - {dateArray[dateArray.length - 1]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onEdit(expo)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No expos found</h3>
          <p className="text-gray-500 text-sm">Add a new expo to get started</p>
        </div>
      )}
    </>
  );
}