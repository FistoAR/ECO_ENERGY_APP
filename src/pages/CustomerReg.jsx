import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
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
  FiBriefcase
} from 'react-icons/fi'

const initialForm = {
  expoName: '',
  customerName: '',
  contactNumber: '',
  companyName: '',
  customerType: '',
  email: '',
  whatsappNumber: '',
  alternateNumber: '',
  address: '',
  productDetails: '',
  typeOfEnquiry: '',
  priority: 'medium',
  referenceBy: '',
  remarks: '',
  nextFollowupDate: null
}

const expoOptions = ['Tech Expo 2024', 'Trade Fair 2024', 'Business Summit']
const enquiryTypes = ['Product Inquiry', 'Price Quote', 'Service Request', 'General']
const customerTypes = ['Retail', 'Wholesale', 'Distributor', 'Corporate', 'Government']
const productOptions = ['Product A', 'Product B', 'Product C', 'Product D']

export default function CustomerReg() {
  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState([])
  const [showTypeOptions, setShowTypeOptions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileRef = useRef()
  const cameraRef = useRef()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      type: file.type
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form:', form, 'Files:', files)
    alert('Customer registered successfully!')
    setForm(initialForm)
    setFiles([])
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setForm(initialForm)
    setFiles([])
  }

  const filteredTypes = customerTypes.filter(t =>
    t.toLowerCase().includes(form.customerType.toLowerCase())
  )

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Reusable Input Component
  const InputField = ({ label, required, icon: Icon, children, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
        {children}
      </div>
    </div>
  )

  // Common input class
  const inputClass = "w-full px-3 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
  const inputWithIconClass = "w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"

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
              <h2 className="text-lg sm:text-xl font-bold text-white">New Customer Registration</h2>
              <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">Fill in the customer details below</p>
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
              {/* Expo Name */}
              <InputField label="Expo Name" required>
                <select
                  name="expoName"
                  value={form.expoName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Expo</option>
                  {expoOptions.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </InputField>

              {/* Customer Name */}
              <InputField label="Customer Name" required icon={FiUser}>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className={inputWithIconClass}
                  required
                />
              </InputField>

              {/* Contact Number */}
              <InputField label="Contact Number" required icon={FiPhone}>
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  type="tel"
                  className={inputWithIconClass}
                  required
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
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={inputWithIconClass}
                />
              </InputField>

              {/* Customer Type */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Customer Type
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    name="customerType"
                    value={form.customerType}
                    onChange={handleChange}
                    onFocus={() => setShowTypeOptions(true)}
                    onBlur={() => setTimeout(() => setShowTypeOptions(false), 200)}
                    placeholder="Type to search..."
                    className={inputWithIconClass}
                  />
                </div>
                {showTypeOptions && filteredTypes.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-40 overflow-auto">
                    {filteredTypes.map(t => (
                      <li
                        key={t}
                        onClick={() => setForm({ ...form, customerType: t })}
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
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  type="tel"
                  className={inputWithIconClass}
                />
              </InputField>

              {/* Alternate Number */}
              <InputField label="Alternate Number" icon={FiPhone}>
                <input
                  name="alternateNumber"
                  value={form.alternateNumber}
                  onChange={handleChange}
                  placeholder="Enter alternate number"
                  type="tel"
                  className={inputWithIconClass}
                />
              </InputField>

              {/* Reference By */}
              <InputField label="Reference By" icon={FiUsers}>
                <input
                  name="referenceBy"
                  value={form.referenceBy}
                  onChange={handleChange}
                  placeholder="Enter reference name"
                  className={inputWithIconClass}
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
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
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
              {/* Product Details */}
              <InputField label="Product Details">
                <select
                  name="productDetails"
                  value={form.productDetails}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Product</option>
                  {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </InputField>

              {/* Type of Enquiry */}
              <InputField label="Type of Enquiry">
                <select
                  name="typeOfEnquiry"
                  value={form.typeOfEnquiry}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Type</option>
                  {enquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputField>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <label
                      key={p}
                      className={`flex-1 text-center py-3 rounded-xl cursor-pointer text-sm font-medium border-2 transition-all ${
                        form.priority === p
                          ? p === 'high'
                            ? 'bg-red-100 border-red-400 text-red-700'
                            : p === 'medium'
                            ? 'bg-amber-100 border-amber-400 text-amber-700'
                            : 'bg-green-100 border-green-400 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={form.priority === p}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow-up Date and Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-5 lg:mt-6">
              {/* Next Follow-up Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Next Follow-up Date
                </label>
                <div className="relative w-full">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none " />
                  <DatePicker
                    selected={form.nextFollowupDate}
                    onChange={date => setForm({ ...form, nextFollowupDate: date })}
                    className={inputWithIconClass}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    minDate={new Date()}
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
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all flex-1 xs:flex-none cursor-pointer"
              >
                <FiUpload className="w-4 h-4" />
                <span>Upload Files</span>
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current.click()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all flex-1 xs:flex-none cursor-pointer"
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
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                hidden
              />
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {files.map(f => (
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
                      <p className="text-xs text-gray-700 font-medium truncate">{f.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(f.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
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
  )
}