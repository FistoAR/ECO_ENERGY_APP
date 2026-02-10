import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  FiPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiList,
  FiLoader,
} from "react-icons/fi";
import { ConfirmationModal } from "../components/ConfirmationModal.jsx";
import { Toast, useToast, ToastContainer } from "../components/Toast";
import ExpoCreation from "../components/ExpoCreation.jsx";
import ProductDetails from "../components/ProductDetails.jsx";
import TypeOfEntry from "../components/TypeOfEntry.jsx";
import WhatsAppMessage from "../components/WhatsAppMessage.jsx";
import MultipleDatePicker from "../components/MultipleDatePicker.jsx";
import Autocomplete from "../components/Autocomplete.jsx";
import { FiCalendar, FiPackage, FiMessageCircle } from "react-icons/fi";
import { expoApi, productApi, entryTypeApi, whatsappApi } from "../services/api";

const tabs = [
  {
    id: "expo",
    label: "Expo Creation",
    shortLabel: "Expo",
    icon: FiCalendar,
    component: ExpoCreation,
    api: expoApi,
  },
  {
    id: "product",
    label: "Product Details",
    shortLabel: "Products",
    icon: FiPackage,
    component: ProductDetails,
    api: productApi,
  },
  {
    id: "entry",
    label: "Type of Enquiry",
    shortLabel: "Enquiry",
    icon: FiList,
    component: TypeOfEntry,
    api: entryTypeApi,
  },
  {
    id: "whatsapp",
    label: "WhatsApp Message",
    shortLabel: "WhatsApp",
    icon: FiMessageCircle,
    component: WhatsAppMessage,
    api: whatsappApi,
  },
];

const ITEMS_PER_PAGE = 5;

export default function Master() {
  const [activeTab, setActiveTab] = useState("expo");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const { showToast, hideToast, toasts } = useToast();
  
  // Autocomplete options state
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const CurrentComponent = currentTab?.component;
  const currentApi = currentTab?.api;

  // Fetch data on mount and tab/page change
  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage]);

  // Fetch category options when product tab is active and form is opened
  useEffect(() => {
    if (activeTab === 'product' && showForm) {
      fetchCategoryOptions();
    }
  }, [activeTab, showForm]);

  const fetchData = async () => {
    if (!currentApi) return;
    
    setLoading(true);
    try {
      const response = await currentApi.getAll(currentPage, ITEMS_PER_PAGE);
      setData(response.data.data || response.data);
      
      if (response.data.pagination) {
        setTotalItems(response.data.pagination.total_items);
        setTotalPages(response.data.pagination.total_pages);
      }
    } catch (error) {
      showToast(error.message || "Failed to fetch data", "error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all unique categories for autocomplete
  const fetchCategoryOptions = async () => {
    setLoadingCategories(true);
    try {
      // Fetch all products to get unique categories
      const response = await productApi.getAll(1, 1000); // Get all products
      const products = response.data.data || response.data || [];
      
      // Extract unique categories
      const uniqueCategories = [...new Set(
        products
          .map(p => p.category)
          .filter(Boolean)
          .map(c => c.trim())
      )].sort();
      
      setCategoryOptions(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategoryOptions([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

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
    setConfirmAction(() => async () => {
      try {
        await currentApi.delete(id);
        showToast("Item deleted successfully!", "success");
        setShowConfirm(false);
        
        // Refresh data
        fetchData();
        
        // Adjust page if needed
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        showToast(error.message || "Failed to delete item", "error");
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for expo dates
    if (activeTab === 'expo' && (!formData.dates || formData.dates.length === 0)) {
      showToast("Please select at least one date", "error");
      return;
    }

    // Validation for product
    if (activeTab === 'product') {
      if (!formData.category || formData.category.trim() === '') {
        showToast("Product category is required", "error");
        return;
      }
    }

    setFormLoading(true);
    
    try {
      if (editId) {
        await currentApi.update(editId, formData);
        showToast("Item updated successfully!", "success");
      } else {
        await currentApi.create(formData);
        showToast("Item added successfully!", "success");
      }
      
      setShowForm(false);
      setFormData({});
      setEditId(null);
      
      // Refresh data
      fetchData();
    } catch (error) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).join(', ');
        showToast(errorMessages, "error");
      } else {
        showToast(error.message || "Failed to save item", "error");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const getFormFields = () => {
    const fields = {
      expo: [
        { key: 'name', label: 'Expo Name', type: 'text', placeholder: 'Enter expo name' },
        { key: 'location', label: 'Location', type: 'text', placeholder: 'Enter location' },
        { key: 'dates', label: 'Event Dates', type: 'multidate' },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'upcoming', 'completed'] }
      ],
      product: [
        { key: 'category', label: 'Product Category', type: 'autocomplete', placeholder: 'Search or add category...' },
        { key: 'size', label: 'Product Size', type: 'text', placeholder: 'Enter product size' }
      ],
      entry: [
        { key: 'name', label: 'Type of Enquiry', type: 'text', placeholder: 'Enter enquiry type' }
      ],
      whatsapp: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter message title' },
        { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your WhatsApp message template...' }
      ]
    };
    return fields[activeTab] || [];
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setShowForm(false);
    setData([]);
  };

  // Render form field based on type
  const renderFormField = (field) => {
    switch (field.type) {
      case 'autocomplete':
        return (
          <div key={field.key} className="space-y-1.5 sm:space-y-2">
            <Autocomplete
              label={field.label}
              value={formData[field.key] || ''}
              onChange={(value) => setFormData({ ...formData, [field.key]: value })}
              options={categoryOptions}
              placeholder={field.placeholder}
              loading={loadingCategories}
              allowCreate={true}
              createText="Create category:"
            />
          </div>
        );
      
      case 'multidate':
        return (
          <div key={field.key} className="sm:col-span-2">
            <MultipleDatePicker
              label={field.label}
              selectedDates={formData[field.key] || []}
              onChange={(dates) => setFormData({ ...formData, [field.key]: dates })}
              placeholder="No dates selected. Add dates for the expo."
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.key} className="sm:col-span-2 space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">
              {field.label}
            </label>
            <textarea
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-vertical text-sm sm:text-base"
              rows={4}
              placeholder={field.placeholder}
              value={formData[field.key] || ""}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              required
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.key} className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">
              {field.label}
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              value={formData[field.key] || field.options[0]}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              required
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        );
      
      default:
        return (
          <div key={field.key} className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">
              {field.label}
            </label>
            <input
              type={field.type}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              placeholder={field.placeholder}
              value={formData[field.key] || ""}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              required={field.key !== 'size'} // Size is optional
            />
          </div>
        );
    }
  };

  function handleBack() {
    window.history.back();
  }

  return (
    <Layout title="Master Page">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} hideToast={hideToast} />

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

      {/* Tabs */}
      <button onClick={handleBack} className="text-md font-semibold text-white cursor-pointer py-2 px-3 my-2 bg-gray-700 rounded hover:bg-black transition-all flex items-center justify-center">← Back</button>

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

      {/* Content Area */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text text-transparent">
              {currentTab?.label}
            </h2>
            <p className="text-gray-600 mt-0.5 sm:mt-1 text-sm sm:text-base">
              Manage your {currentTab?.label.toLowerCase()}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add New
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 text-green-500 animate-spin" />
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {/* Content Component */}
            {CurrentComponent && data.length > 0 && (
              <>
                <CurrentComponent
                  data={data}
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
                    endIndex={endIndex}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && data.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiList className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Get started by adding a new item.
                </p>
                <button
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base cursor-pointer"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                  Add New Item
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden"></div>

            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {editId ? "Edit Item" : "Add New Item"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl sm:rounded-2xl text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
                disabled={formLoading}
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {getFormFields().map((field) => renderFormField(field))}
              </div>
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base cursor-pointer"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formLoading && <FiLoader className="w-4 h-4 animate-spin" />}
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

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}) {
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
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
      <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
        Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
        <span className="font-semibold text-gray-900">{endIndex}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm cursor-pointer"
          }`}
        >
          <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <div className="hidden xs:flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all ${
                page === currentPage
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm cursor-pointer"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="xs:hidden px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm cursor-pointer"
          }`}
        >
          <span>Next</span>
          <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}