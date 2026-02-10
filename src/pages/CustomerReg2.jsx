import { useState, useRef, useCallback, useEffect } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiUpload,
  FiCamera,
  FiX,
  FiSave,
  FiRefreshCw,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiMessageSquare,
  FiPackage,
  FiUsers,
  FiBriefcase,
  FiLoader,
} from "react-icons/fi";
import {
  customerApi,
  settingsApi,
  productApi,
  entryTypeApi,
} from "../services/api";

const initialForm = {
  expo_id: null,
  customer_name: "",
  contact_number: "",
  company_name: "",
  customer_type: "",
  email: "",
  whatsapp_number: "",
  alternate_number: "",
  address: "",
  product_id: null,
  type_of_enquiry_id: null,
  priority: "medium",
  reference_by: "",
  remarks: "",
  next_followup_date: null,
  employee_id: 1,
  employee_name: "Admin User",
};

// Customer type options
const customerTypes = [
  "Retail",
  "Wholesale",
  "Distributor",
  "Corporate",
  "Government",
];

export default function CustomerReg() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Data from API
  const [currentExpo, setCurrentExpo] = useState(null);
  const [productCategories, setProductCategories] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [entryTypes, setEntryTypes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fileRef = useRef();
  const cameraRef = useRef();
  const customerTypeRef = useRef();

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch product sizes when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchProductSizes(selectedCategory);
    } else {
      setProductSizes([]);
      setForm((prev) => ({ ...prev, product_id: null }));
    }
  }, [selectedCategory]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching initial data...");

      // Fetch current expo
      const expoResponse = await settingsApi.getCurrentExpo();
      console.log("Expo response:", expoResponse);

      if (expoResponse.success && expoResponse.data) {
        const expoData = expoResponse.data;
        setCurrentExpo(expoData);
        setForm((prev) => ({
          ...prev,
          expo_id: expoData.id,
          expo_name: expoData.name || "",
        }));
        console.log("Expo set:", expoData.name);
      } else {
        console.warn("No expo data found in response");
      }

      // Fetch all products to get categories and sizes
      console.log("Fetching products...");
      const productsResponse = await productApi.getAll(1, 1000);
      console.log("Products response:", productsResponse);

      if (productsResponse.success && productsResponse.data) {
        const products = productsResponse.data.data || [];
        setAllProducts(products);

        // Extract unique categories
        const categories = [
          ...new Set(
            products
              .filter((p) => p.category && p.status === "active")
              .map((p) => p.category),
          ),
        ].sort();

        console.log("Extracted categories:", categories);
        setProductCategories(categories);
      }

      // Fetch entry types
      console.log("Fetching entry types...");
      const entryTypesResponse = await entryTypeApi.getAll(1, 100);
      console.log("Entry types response:", entryTypesResponse);

      if (entryTypesResponse.success && entryTypesResponse.data) {
        const types = entryTypesResponse.data.data || [];
        setEntryTypes(types);
        console.log("Entry types set:", types.length);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      alert(`Error loading data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductSizes = async (category) => {
    try {
      console.log("Fetching sizes for category:", category);

      if (!category || !allProducts.length) {
        setProductSizes([]);
        return;
      }

      // Filter products by category from already loaded products
      const filteredProducts = allProducts.filter(
        (product) =>
          product.category === category && product.status === "active",
      );

      console.log("Filtered products:", filteredProducts);
      setProductSizes(filteredProducts);
    } catch (error) {
      console.error("Error fetching product sizes:", error);
      setProductSizes([]);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle customer type input specifically
  const handleCustomerTypeChange = useCallback((e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, customer_type: value }));
    setShowTypeOptions(true);
  }, []);

  const handleCustomerTypeSelect = useCallback((type) => {
    setForm((prev) => ({ ...prev, customer_type: type }));
    setShowTypeOptions(false);
  }, []);

  const handleCustomerTypeBlur = useCallback(() => {
    // Small delay to allow click events to register before closing
    setTimeout(() => {
      setShowTypeOptions(false);
    }, 150);
  }, []);

  const handleFileUpload = useCallback((e) => {
    const uploadedFiles = Array.from(e.target.files);

    const newFiles = uploadedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Clear file input
    e.target.value = "";
  }, []);

  const removeFile = useCallback((id) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const uploadAttachments = async (customerId) => {
    const uploadPromises = files.map(async (fileObj) => {
      try {
        const response = await customerApi.uploadFile(customerId, fileObj.file);
        return response.success;
      } catch (error) {
        console.error("Error uploading file:", error);
        return false;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.every((result) => result === true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.expo_id) {
      alert("Expo is required");
      return;
    }

    if (!form.customer_name.trim()) {
      alert("Customer name is required");
      return;
    }

    if (!form.contact_number.trim()) {
      alert("Contact number is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const submitData = {
        ...form,
        next_followup_date: form.next_followup_date
          ? new Date(form.next_followup_date).toISOString().split("T")[0]
          : null,
        customer_name: form.customer_name.trim(),
        contact_number: form.contact_number.trim(),
        company_name: form.company_name?.trim() || "",
        email: form.email?.trim() || "",
        whatsapp_number: form.whatsapp_number?.trim() || "",
        alternate_number: form.alternate_number?.trim() || "",
        address: form.address?.trim() || "",
        reference_by: form.reference_by?.trim() || "",
        remarks: form.remarks?.trim() || "",
        customer_type: form.customer_type?.trim() || "",
      };

      console.log("Submitting data:", submitData);

      // Create customer
      const response = await customerApi.create(submitData);
      console.log("Create response:", response);

      if (response.success) {
        const customerId = response.data.id;

        // Upload attachments if any
        if (files.length > 0) {
          const uploadSuccess = await uploadAttachments(customerId);
          if (!uploadSuccess) {
            console.warn("Some files failed to upload");
          }
        }

        alert("Customer registered successfully!");
        handleReset();
      } else {
        alert(`Failed to register customer: ${response.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(`Error: ${error.message || "Failed to register customer"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = useCallback(() => {
    setForm({
      ...initialForm,
      expo_id: currentExpo?.expo_id || currentExpo?.id || null,
    });

    // Clean up file preview URLs
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setSelectedCategory("");
    setProductSizes([]);
    setShowTypeOptions(false);
  }, [currentExpo, files]);

  const handleDateChange = useCallback((date) => {
    setForm((prev) => ({ ...prev, next_followup_date: date }));
  }, []);

  const handleCategoryChange = useCallback((e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setForm((prev) => ({ ...prev, product_id: null }));
  }, []);

  const filteredTypes = customerTypes.filter((t) =>
    t.toLowerCase().includes(form.customer_type?.toLowerCase() || ""),
  );

  const formatFileSize = useCallback((bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }, []);

  // Get expo name for display
  const getExpoDisplayName = useCallback(() => {
    if (!currentExpo) return "Loading...";

    if (currentExpo.expo_name) return currentExpo.expo_name;
    if (currentExpo.name) return currentExpo.name;
    if (currentExpo.id) return `Expo #${currentExpo.id}`;

    return "Unknown Expo";
  }, [currentExpo]);

  // Reusable Input Component
  const InputField = useCallback(
    ({ label, required, icon: Icon, children, className = "", error = "" }) => (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          )}
          {children}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    ),
    [],
  );

  // Common input class
  const inputClass =
    "w-full px-3 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed";
  const inputWithIconClass =
    "w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed";

  if (isLoading) {
    return (
      <Layout title="Customer Registration">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FiLoader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Customer Registration">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiUser className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                New Customer Registration
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">
                {getExpoDisplayName()}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
          {/* Section 1: Basic Information */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2 pb-3 mb-4 sm:mb-5 border-b border-gray-200">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Expo Name (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Expo Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={getExpoDisplayName()}
                    readOnly
                    className={`${inputClass} bg-gray-50`}
                  />
                  <input
                    type="hidden"
                    name="expo_id"
                    value={form.expo_id || ""}
                  />
                </div>
              </div>

              {/* Customer Name */}
              <InputField label="Customer Name" required icon={FiUser}>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className={inputWithIconClass}
                  required
                  disabled={isSubmitting}
                />
              </InputField>

              {/* Contact Number */}
              <InputField label="Contact Number" required icon={FiPhone}>
                <input
                  name="contact_number"
                  value={form.contact_number}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  type="tel"
                  className={inputWithIconClass}
                  required
                  disabled={isSubmitting}
                />
              </InputField>
            </div>
          </div>

          {/* Section 2: Company Details */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2 pb-3 mb-4 sm:mb-5 border-b border-gray-200">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiBriefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              Company Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Company Name */}
              <InputField label="Company Name" icon={FiBriefcase}>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={inputWithIconClass}
                  disabled={isSubmitting}
                />
              </InputField>

              {/* Customer Type */}
              <div className="space-y-2 relative" ref={customerTypeRef}>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Type
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    name="customer_type"
                    value={form.customer_type}
                    onChange={handleCustomerTypeChange}
                    onFocus={() => setShowTypeOptions(true)}
                    onBlur={handleCustomerTypeBlur}
                    placeholder="Type to search..."
                    className={inputWithIconClass}
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </div>
                {showTypeOptions && filteredTypes.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-40 overflow-auto">
                    {filteredTypes.map((t) => (
                      <li
                        key={t}
                        onClick={() => handleCustomerTypeSelect(t)}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Email */}
              <InputField label="Email" icon={FiMail}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={inputWithIconClass}
                  disabled={isSubmitting}
                />
              </InputField>
            </div>
          </div>

          {/* Section 3: Contact Details */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2 pb-3 mb-4 sm:mb-5 border-b border-gray-200">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* WhatsApp Number */}
              <InputField label="WhatsApp Number" icon={FiMessageSquare}>
                <input
                  name="whatsapp_number"
                  value={form.whatsapp_number}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  type="tel"
                  className={inputWithIconClass}
                  disabled={isSubmitting}
                />
              </InputField>

              {/* Alternate Number */}
              <InputField label="Alternate Number" icon={FiPhone}>
                <input
                  name="alternate_number"
                  value={form.alternate_number}
                  onChange={handleChange}
                  placeholder="Enter alternate number"
                  type="tel"
                  className={inputWithIconClass}
                  disabled={isSubmitting}
                />
              </InputField>

              {/* Reference By */}
              <InputField label="Reference By" icon={FiUsers}>
                <input
                  name="reference_by"
                  value={form.reference_by}
                  onChange={handleChange}
                  placeholder="Enter reference name"
                  className={inputWithIconClass}
                  disabled={isSubmitting}
                />
              </InputField>
            </div>

            {/* Address - Full Width */}
            <div className="mt-4 sm:mt-5 lg:mt-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Enquiry Details */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2 pb-3 mb-4 sm:mb-5 border-b border-gray-200">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiPackage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              Enquiry Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Product Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className={inputClass}
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  {productCategories.map((category, index) => (
                    <option key={`${category}-${index}`} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Size */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Size
                </label>
                <select
                  name="product_id"
                  value={form.product_id || ""}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={
                    !selectedCategory ||
                    isSubmitting ||
                    productSizes.length === 0
                  }
                >
                  <option value="">Select Size</option>
                  {productSizes.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.size || "No size specified"}
                    </option>
                  ))}
                </select>
                {!selectedCategory ? (
                  <p className="text-gray-500 text-xs">
                    Select a category first
                  </p>
                ) : productSizes.length === 0 ? (
                  <p className="text-gray-500 text-xs">
                    No sizes available for this category
                  </p>
                ) : null}
              </div>

              {/* Type of Enquiry */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Type of Enquiry
                </label>
                <select
                  name="type_of_enquiry_id"
                  value={form.type_of_enquiry_id || ""}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isSubmitting}
                >
                  <option value="">Select Type</option>
                  {entryTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-5 lg:mt-6">
              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((p) => (
                    <label
                      key={p}
                      className={`flex-1 text-center py-3 rounded-xl cursor-pointer text-sm font-medium border-2 transition-all ${
                        form.priority === p
                          ? p === "high"
                            ? "bg-red-100 border-red-400 text-red-700"
                            : p === "medium"
                              ? "bg-amber-100 border-amber-400 text-amber-700"
                              : "bg-green-100 border-green-400 text-green-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={form.priority === p}
                        onChange={handleChange}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Next Follow-up Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Next Follow-up Date
                </label>
                <div className="relative w-full">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                  <DatePicker
                    selected={form.next_followup_date}
                    onChange={handleDateChange}
                    className={inputWithIconClass}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    minDate={new Date()}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Remarks */}
              <InputField label="Remarks">
                <input
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Enter any remarks"
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </InputField>
            </div>
          </div>

          {/* Section 5: Attachments */}
          <div className="mb-6 sm:mb-8 pt-4 sm:pt-6 border-t border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2 mb-4 sm:mb-5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiUpload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              Attachments
            </h3>

            {/* Upload Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 mb-4 lg:flex-row lg:max-w-[70%]">
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all flex-1 xs:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiUpload className="w-4 h-4" />
                <span>Upload Files</span>
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current.click()}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all flex-1 xs:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCamera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                hidden
                disabled={isSubmitting}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                hidden
                disabled={isSubmitting}
              />
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="relative bg-gray-50 border border-gray-200 rounded-xl p-2.5 group"
                  >
                    {f.preview ? (
                      <img
                        src={f.preview}
                        alt={f.name}
                        className="w-full h-20 sm:h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-20 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-xs text-gray-700 font-medium truncate">
                        {f.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatFileSize(f.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      disabled={isSubmitting}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all disabled:opacity-50"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Registering...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Register Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}