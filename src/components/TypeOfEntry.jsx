import { FiEdit2, FiTrash2, FiList } from 'react-icons/fi';

export default function TypeOfEntry({ data = [], onEdit, onDelete, startIndex = 0 }) {
  return (
    <>
      {/* Card Grid View - All Screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4">
        {data.map((entry, index) => (
          <div
            key={entry.id}
            className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 group-hover:scale-110 transition-transform">
                  <FiList className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-gray-400">
                    #{startIndex + index + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate mt-0.5">
                    {entry.name}
                  </h4>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all hover:scale-110 cursor-pointer"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 cursor-pointer"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No entry types found</h3>
          <p className="text-gray-500 text-sm">Add a new entry type to get started</p>
        </div>
      )}
    </>
  );
}