import { FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';

export default function ProductDetails({ data = [], onEdit, onDelete, startIndex = 0 }) {
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

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
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider rounded-tr-xl">
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
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{startIndex + index + 1}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      product.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-bold text-green-600">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
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
        {data.map((product, index) => (
          <div
            key={product.id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{startIndex + index + 1}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <FiTag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600 mt-2">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
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
          No product records found
        </div>
      )}
    </>
  );
}