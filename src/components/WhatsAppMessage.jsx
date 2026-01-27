import { FiEdit2, FiTrash2, FiMessageCircle } from 'react-icons/fi';

export default function WhatsAppMessage({ data = [], onEdit, onDelete, startIndex = 0 }) {
  console.log(`Data: ${JSON.stringify(data, null, 2)}`);
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
              <th className="px-4 py-3 border border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-48">
                Title
              </th>
              <th className="px-4 py-3 border border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Message
              </th>
              <th className="px-4 py-3 border border-gray-200 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((message, index) => (
              <tr
                key={message.id}
                className="hover:bg-green-50/50 transition-colors group bg-white"
              >
                {/* S.No */}
                <td className="px-4 py-4 border border-gray-200 align-top bg-white">
                  <span className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </span>
                </td>

                {/* Title */}
                <td className="px-4 py-4 border border-gray-200 align-top bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100 text-green-600">
                      <FiMessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {message.title}
                    </span>
                  </div>
                </td>

                {/* Message - Full text with wrapping */}
                <td className="px-4 py-4 border border-gray-200 align-top bg-white">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-full">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 border border-gray-200 align-top bg-white">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(message)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(message.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer hover:scale-110"
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
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{startIndex + index + 1}
                  </span>
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100 text-green-600">
                    <FiMessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Title</p>
                    <h4 className="text-base font-semibold text-gray-900">{message.title}</h4>
                  </div>
                </div>

                {/* Message - Full text */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Message</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={() => onEdit(message)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No messages found</h3>
          <p className="text-gray-500 text-sm">Add a new WhatsApp message template to get started</p>
        </div>
      )}
    </>
  );
}