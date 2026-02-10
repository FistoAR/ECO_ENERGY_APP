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
  FiDatabase,
  FiDownload,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import {
  customerApi,
  settingsApi,
  productApi,
  entryTypeApi,
  whatsappApi,  // Add this
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

// Excel format columns definition
const excelColumns = [
  {
    column: "customer_name",
    header: "Customer Name",
    required: true,
    example: "John Doe",
    description: "Full name of the customer",
  },
  {
    column: "contact_number",
    header: "Contact Number",
    required: true,
    example: "9876543210",
    description: "Primary contact number",
  },
  {
    column: "company_name",
    header: "Company Name",
    required: false,
    example: "ABC Corp",
    description: "Company or business name",
  },
  {
    column: "customer_type",
    header: "Customer Type",
    required: false,
    example: "Retail",
    description: "Retail, Wholesale, Distributor, Corporate, Government",
  },
  {
    column: "email",
    header: "Email",
    required: false,
    example: "john@example.com",
    description: "Email address",
  },
  {
    column: "whatsapp_number",
    header: "WhatsApp Number",
    required: false,
    example: "9876543210",
    description: "WhatsApp contact number",
  },
  {
    column: "alternate_number",
    header: "Alternate Number",
    required: false,
    example: "9876543211",
    description: "Alternative contact number",
  },
  {
    column: "address",
    header: "Address",
    required: false,
    example: "123 Main St, City",
    description: "Full address",
  },
  {
    column: "product_category",
    header: "Product Category",
    required: false,
    example: "Tiles",
    description: "Product category name",
  },
  {
    column: "product_size",
    header: "Product Size",
    required: false,
    example: "60x60",
    description: "Product size specification",
  },
  {
    column: "type_of_enquiry",
    header: "Type of Enquiry",
    required: false,
    example: "New Purchase",
    description: "Enquiry type name",
  },
  {
    column: "priority",
    header: "Priority",
    required: false,
    example: "medium",
    description: "low, medium, or high",
  },
  {
    column: "reference_by",
    header: "Reference By",
    required: false,
    example: "Jane Smith",
    description: "Referral source name",
  },
  {
    column: "remarks",
    header: "Remarks",
    required: false,
    example: "Interested in bulk order",
    description: "Additional notes",
  },
  {
    column: "next_followup_date",
    header: "Next Follow-up Date",
    required: false,
    example: "2024-12-25",
    description: "Date in YYYY-MM-DD format",
  },
];

export default function CustomerReg() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Bulk upload modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkUploadStatus, setBulkUploadStatus] = useState(null); // 'ready', 'uploading', 'success', 'error'

  // Data from API
  const [currentExpo, setCurrentExpo] = useState(null);
  const [productCategories, setProductCategories] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [entryTypes, setEntryTypes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState(null);


  const fileRef = useRef();
  const cameraRef = useRef();
  const customerTypeRef = useRef();
  const bulkFileRef = useRef();

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
      console.log("Fetching WhatsApp template...");
      try {
        const whatsappResponse = await whatsappApi.getAll(1, 1);
        console.log("WhatsApp response:", whatsappResponse);
        
        if (whatsappResponse.success && whatsappResponse.data) {
          const messages = whatsappResponse.data.data || [];
          if (messages.length > 0) {
            // Get the latest/first message template
            setWhatsappTemplate(messages[0]);
            console.log("WhatsApp template set:", messages[0].title);
          }
        }
      } catch (error) {
        console.error("Error fetching WhatsApp template:", error);
        // Non-critical error, don't block the form
      }
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

  // Send WhatsApp message after registration
  const sendWhatsAppMessage = useCallback((customerData) => {
    if (!whatsappTemplate || !whatsappTemplate.message) {
      console.log("No WhatsApp template available");
      return;
    }

    // Get the phone number (prefer WhatsApp number, fallback to contact number)
    let phoneNumber = customerData.whatsapp_number;
    
    if (!phoneNumber) {
      console.log("No phone number available for WhatsApp");
      return;
    }

    // Clean the phone number (remove spaces, dashes, etc.)
    phoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Add country code if not present (assuming India +91)
    if (!phoneNumber.startsWith('+')) {
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
      }
      if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
        phoneNumber = '91' + phoneNumber;
      }
    } else {
      phoneNumber = phoneNumber.substring(1); // Remove the + for wa.me
    }

    // Replace placeholders in the message template
    let message = whatsappTemplate.message;
    
    // Common placeholders replacement
    const replacements = {
      '{customer_name}': customerData.customer_name || '',
      '{name}': customerData.customer_name || '',
      '{company_name}': customerData.company_name || '',
      '{company}': customerData.company_name || '',
      '{expo_name}': currentExpo?.name || currentExpo?.expo_name || '',
      '{expo}': currentExpo?.name || currentExpo?.expo_name || '',
      '{product}': selectedCategory || '',
      '{product_category}': selectedCategory || '',
      '{date}': new Date().toLocaleDateString('en-IN'),
      '{contact_number}': customerData.contact_number || '',
      '{email}': customerData.email || '',
    };

    // Replace all placeholders
    Object.entries(replacements).forEach(([placeholder, value]) => {
      message = message.replace(new RegExp(placeholder, 'gi'), value);
    });

    // Encode the message for URL
    const fullMessage = `Dear ${customerData.customer_name || ""}\n${message}`;
const encodedMessage = encodeURIComponent(fullMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    console.log("Opening WhatsApp:", whatsappUrl);
    
    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, '_blank');
  }, [whatsappTemplate, currentExpo, selectedCategory]);

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

        const customerDataForWhatsApp = {
          ...form,
          customer_name: form.customer_name.trim(),
          contact_number: form.contact_number.trim(),
          whatsapp_number: form.whatsapp_number?.trim() || '',
          company_name: form.company_name?.trim() || '',
          email: form.email?.trim() || '',
        };

        // Send WhatsApp message
        sendWhatsAppMessage(customerDataForWhatsApp);


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

  // Bulk upload handlers
  const handleBulkFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        ".xlsx",
        ".xls",
      ];
      const isValid =
        validTypes.some((type) => file.type.includes(type)) ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls");

      if (isValid) {
        setBulkFile(file);
        setBulkUploadStatus("ready");
      } else {
        alert("Please upload a valid Excel file (.xlsx or .xls)");
        e.target.value = "";
      }
    }
  }, []);

  const handleBulkUpload = useCallback(() => {
    if (!bulkFile) {
      alert("Please select a file first");
      return;
    }
    // This will be implemented when backend is ready
    setBulkUploadStatus("uploading");
    // Simulate upload for now
    setTimeout(() => {
      setBulkUploadStatus("success");
    }, 2000);
  }, [bulkFile]);

  const handleDownloadTemplate = useCallback(() => {
    // Create CSV content for template
    const headers = excelColumns.map((col) => col.column).join(",");
    const exampleRow = excelColumns.map((col) => col.example).join(",");
    const csvContent = `${headers}\n${exampleRow}`;

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const closeBulkModal = useCallback(() => {
    setShowBulkModal(false);
    setBulkFile(null);
    setBulkUploadStatus(null);
    if (bulkFileRef.current) {
      bulkFileRef.current.value = "";
    }
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

  function handleBack() {
    window.history.back();
  }

  return (
    <Layout title="Customer Registration">
         <button onClick={handleBack} className="text-md font-semibold text-white cursor-pointer py-2 px-3 my-2 bg-gray-700 rounded hover:bg-black transition-all flex items-center justify-center">← Back</button>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
          <div className="flex items-center justify-between">
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
            {/* Bulk Data Button */}
            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium text-sm transition-all border border-white/30"
            >
              <FiDatabase className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Upload</span>
              <span className="sm:hidden">Bulk</span>
            </button>
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

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiDatabase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Bulk Customer Upload
                  </h3>
                  <p className="text-indigo-100 text-xs sm:text-sm">
                    Import multiple customers from Excel
                  </p>
                </div>
              </div>
              <button
                onClick={closeBulkModal}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Upload Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiUpload className="w-4 h-4 text-indigo-600" />
                      Upload Excel File
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: .xlsx, .xls
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium text-sm transition-all"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download Template
                  </button>
                </div>

                {/* File Upload Area */}
                <div
                  onClick={() => bulkFileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    bulkFile
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
                >
                  <input
                    ref={bulkFileRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleBulkFileSelect}
                    hidden
                  />
                  {bulkFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FiFileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">
                          {bulkFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(bulkFile.size)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBulkFile(null);
                          setBulkUploadStatus(null);
                          if (bulkFileRef.current) bulkFileRef.current.value = "";
                        }}
                        className="ml-2 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center text-red-600 transition-all"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <FiUpload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Excel files only (.xlsx, .xls)
                      </p>
                    </>
                  )}
                </div>

                {/* Upload Status */}
                {bulkUploadStatus === "uploading" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                    <FiLoader className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-700 font-medium">
                      Uploading and processing...
                    </span>
                  </div>
                )}
                {bulkUploadStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl flex items-center gap-3">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">
                      File uploaded successfully! (Backend integration pending)
                    </span>
                  </div>
                )}
                {bulkUploadStatus === "error" && (
                  <div className="mt-4 p-4 bg-red-50 rounded-xl flex items-center gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">
                      Upload failed. Please try again.
                    </span>
                  </div>
                )}
              </div>

              {/* Excel Format Guide */}
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <FiFileText className="w-4 h-4 text-indigo-600" />
                  Excel Format Guide
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Your Excel file should have the following columns. Required fields are marked with <span className="text-red-500">*</span>
                </p>

                {/* Format Table */}
                <div className="overflow-x-auto w-full">
  <div className="flex gap-3 min-w-max">
    {excelColumns.map((col) => (
      <code
        key={col.column}
        className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-xs font-mono whitespace-nowrap"
      >
        {col.column}
      </code>
    ))}
  </div>
</div>
              

                {/* Notes */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h5 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                    <FiAlertCircle className="w-4 h-4" />
                    Important Notes
                  </h5>
                  <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                    <li>The first row should contain column headers exactly as shown above</li>
                    <li>Date format should be YYYY-MM-DD (e.g., 2024-12-25)</li>
                    <li>Priority values should be: low, medium, or high</li>
                    <li>Customer type should be one of: Retail, Wholesale, Distributor, Corporate, Government</li>
                    <li>Empty optional fields can be left blank</li>
                    <li>Maximum 500 records per upload</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={closeBulkModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium text-sm transition-all w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile || bulkUploadStatus === "uploading"}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {bulkUploadStatus === "uploading" ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-4 h-4" />
                    Upload & Import
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}