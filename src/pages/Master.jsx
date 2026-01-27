import { useState } from "react";
import Layout from "../components/Layout";
import { FiPlus, FiX, FiChevronLeft, FiChevronRight, FiList } from "react-icons/fi";
import { ConfirmationModal } from "../components/ConfirmationModal.jsx";
import { Toast, useToast, ToastContainer } from "../components/Toast"
import ExpoCreation from "../components/ExpoCreation.jsx";
import ProductDetails from "../components/ProductDetails.jsx";
import TypeOfEntry from "../components/TypeOfEntry.jsx";
import WhatsAppMessage from "../components/WhatsAppMessage.jsx";
import { FiCalendar, FiPackage, FiMessageCircle } from 'react-icons/fi';

const tabs = [
  { id: "expo", label: "Expo Creation", shortLabel: "Expo", icon: FiCalendar, component: ExpoCreation },
  { id: "product", label: "Product Details", shortLabel: "Products", icon: FiPackage, component: ProductDetails },
  { id: "entry", label: "Type of Entry", shortLabel: "Entry", icon: FiList, component: TypeOfEntry },
  { id: "whatsapp", label: "WhatsApp Message", shortLabel: "WhatsApp", icon: FiMessageCircle, component: WhatsAppMessage },
];

const initialData = {
  expo: [
    { id: 1, name: "Tech Expo 2024", location: "Convention Center", date: "2024-03-15", status: "active" },
    { id: 2, name: "Trade Fair 2024", location: "Exhibition Hall", date: "2024-04-10", status: "upcoming" },
    { id: 3, name: "Innovation Summit", location: "Tech Park", date: "2024-05-20", status: "active" },
    { id: 4, name: "Global Expo 2024", location: "World Trade Center", date: "2024-06-15", status: "upcoming" },
    { id: 5, name: "Digital World", location: "IT Hub", date: "2024-07-01", status: "completed" },
    { id: 6, name: "Smart City Expo", location: "Metro Convention", date: "2024-08-10", status: "active" },
    { id: 7, name: "Green Tech Fair", location: "Eco Center", date: "2024-09-05", status: "upcoming" },
    { id: 8, name: "AI Conference", location: "Innovation Hub", date: "2024-10-20", status: "active" },
  ],
  product: [
    { id: 1, name: "Product A", category: "Electronics", price: 1500, status: "active" },
    { id: 2, name: "Product B", category: "Machinery", price: 25000, status: "active" },
    { id: 3, name: "Product C", category: "Software", price: 5000, status: "inactive" },
    { id: 4, name: "Product D", category: "Hardware", price: 8500, status: "active" },
    { id: 5, name: "Product E", category: "Electronics", price: 12000, status: "active" },
    { id: 6, name: "Product F", category: "Accessories", price: 2500, status: "inactive" },
  ],
  entry: [
    { id: 1, name: "Product Inquiry", priority: "high", status: "active" },
    { id: 2, name: "Price Quote", priority: "medium", status: "active" },
    { id: 3, name: "Technical Support", priority: "low", status: "active" },
    { id: 4, name: "Demo Request", priority: "high", status: "inactive" },
    { id: 5, name: "Partnership Inquiry", priority: "medium", status: "active" },
  ],
  whatsapp: [
    { id: 1, name: "Welcome Message", template: "Hello {name}! Thank you for visiting.", category: "greeting" },
    { id: 2, name: "Follow-up", template: "Hi {name}, following up on our conversation.", category: "followup" },
    { id: 3, name: "Thank You", template: "Thank you {name} for your interest!", category: "greeting" },
    { id: 4, name: "Reminder", template: "Hi {name}, just a reminder about our meeting.", category: "reminder" },
  ],
};

const ITEMS_PER_PAGE = 5;

export default function Master() {
  const [activeTab, setActiveTab] = useState("expo");
  const [data, setData] = useState(initialData);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast, hideToast, toasts } = useToast();

  const currentData = data[activeTab] || [];
  const CurrentComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((i) => i.id !== id),
      }));
      showToast("Item deleted successfully!", "success");
      setShowConfirm(false);
      const newTotal = currentData.length - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    });
    setShowConfirm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((i) =>
          i.id === editId ? { ...formData, id: editId } : i
        ),
      }));
      showToast("Item updated successfully!", "success");
    } else {
      setData((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { ...formData, id: Date.now() }],
      }));
      showToast("Item added successfully!", "success");
      const newTotal = currentData.length + 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      setCurrentPage(newTotalPages);
    }
    setShowForm(false);
    setFormData({});
    setEditId(null);
  };

  const getFormFields = () => {
    const fields = {
      expo: [
        { key: 'name', label: 'Expo Name', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'upcoming', 'completed'] }
      ],
      product: [
        { key: 'name', label: 'Product Name', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'price', label: 'Price', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
      ],
      entry: [
        { key: 'name', label: 'Entry Type', type: 'text' },
        { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high'] },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
      ],
      whatsapp: [
        { key: 'name', label: 'Message Name', type: 'text' },
        { key: 'template', label: 'Message Template', type: 'textarea' },
        { key: 'category', label: 'Category', type: 'text' }
      ]
    };
    return fields[activeTab] || [];
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setShowForm(false);
  };

  return (
    <Layout title="Master Page">
      {/* Toast Notifications */}
       <ToastContainer toasts={toasts} hideToast={hideToast} />

      {toasts.map((toast) => (
        <Toast
           key={toast.id}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={() => hideToast(toast.id)}
        />
      ))}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Tabs - Responsive */}
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-8 overflow-x-auto pb-2 -mx-2 px-2 sm:-mx-4 sm:px-4 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium sm:font-semibold text-xs sm:text-sm whitespace-nowrap transition-all shadow-sm group h-10 sm:h-14 flex-shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-green-50 border border-gray-100 hover:border-green-200"
            }`}
          >
            <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Content Area - Responsive */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text text-transparent">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600 mt-0.5 sm:mt-1 text-sm sm:text-base">
              Manage your {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add New
          </button>
        </div>

        {/* Content Component with Pagination */}
        {CurrentComponent && (
          <>
            <CurrentComponent
              data={paginatedData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              startIndex={startIndex}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={startIndex}
                endIndex={Math.min(endIndex, totalItems)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {currentData.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FiList className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Get started by adding a new item.</p>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
              Add New Item
            </button>
          </div>
        )}
      </div>

      {/* Form Modal - Responsive */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Drag Handle for Mobile */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden"></div>
            
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {editId ? "Edit Item" : "Add New Item"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl sm:rounded-2xl text-gray-500 hover:text-gray-700 transition-all"
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Dynamic Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {getFormFields().map((field) => (
                  <div key={field.key} className={`space-y-1.5 sm:space-y-2 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-vertical text-sm sm:text-base"
                        rows={3}
                        value={formData[field.key] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        required
                      />
                    ) : field.type === 'select' ? (
                      <select
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        value={formData[field.key] || field.options[0]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        required
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        value={formData[field.key] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

// Pagination Component - Responsive
function Pagination({ currentPage, totalPages, totalItems, startIndex, endIndex, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
      {/* Info */}
      <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
        Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
        <span className="font-semibold text-gray-900">{endIndex}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> results
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }`}
        >
          <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {/* Page Numbers - Hidden on very small screens */}
        <div className="hidden xs:flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all ${
                page === currentPage
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Mobile Page Indicator */}
        <div className="xs:hidden px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg">
          {currentPage} / {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }`}
        >
          <span>Next</span>
          <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}