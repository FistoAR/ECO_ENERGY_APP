import { FiEdit2, FiTrash2, FiMessageCircle } from 'react-icons/fi';

export default function WhatsAppMessage({ data = [], onEdit, onDelete, startIndex = 0 }) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider rounded-tl-xl">
                S.No
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Message Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Template
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider rounded-tr-xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((message, index) => (
              <tr
                key={message.id}
                className="hover:bg-green-50/50 transition-colors group"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{startIndex + index + 1}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500"></div>
                    <span className="text-sm font-semibold text-gray-900">{message.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-xs xl:max-w-md">
                    <p className="text-sm text-gray-600 truncate" title={message.template}>
                      {message.template}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold capitalize">
                    {message.category}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(message)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(message.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {data.map((message, index) => (
          <div
            key={message.id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{startIndex + index + 1}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold capitalize">
                    {message.category}
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 truncate">{message.name}</h4>
                <div className="mt-2 p-2.5 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FiMessageCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {message.template}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onEdit(message)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No WhatsApp message records found
        </div>
      )}
    </>
  );
}