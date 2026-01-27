import { FiEdit2, FiTrash2, FiPackage, FiMaximize } from 'react-icons/fi';

export default function ProductDetails({ data = [], onEdit, onDelete, startIndex = 0 }) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-4 py-3 border border-gray-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Product Category
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Product Size
              </th>
              <th className="px-4 py-3 border border-gray-300 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((product, index) => (
              <tr
                key={product.id}
                className="hover:bg-green-50/50 transition-colors group"
              >
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{startIndex + index + 1}</span>
                </td>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100 text-green-600">
                      <FiPackage className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{product.category}</span>
                  </div>
                </td>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    <FiMaximize className="w-3.5 h-3.5" />
                    {product.size}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
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
        {data.map((product, index) => (
          <div
            key={product.id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* S.No Badge */}
                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{startIndex + index + 1}
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-100 text-green-600">
                    <FiPackage className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-base font-semibold text-gray-900">{product.category}</p>
                  </div>
                </div>

                {/* Size */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-600">
                    <FiMaximize className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-base font-semibold text-gray-900">{product.size}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
            <FiPackage className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500 text-sm">Add a new product to get started</p>
        </div>
      )}
    </>
  );
}