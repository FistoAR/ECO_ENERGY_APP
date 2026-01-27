import { useState, useMemo } from 'react'
import Layout from '../components/Layout'
import { 
  FiDownload, 
  FiSearch, 
  FiUsers, 
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiEye,
  FiSliders,
  FiMapPin,
  FiMessageSquare,
  FiPackage,
  FiFlag,
  FiUser,
  FiFileText,
  FiImage,
  FiFile,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
  FiMaximize2,
  FiExternalLink
} from 'react-icons/fi'

// Sample customer data (matching CustomerReg fields)
const customersData = [
  { 
    id: 1, 
    customerName: 'John Smith', 
    companyName: 'ABC Corporation', 
    contactNumber: '9876543210',
    whatsappNumber: '9876543210',
    alternateNumber: '9876543200',
    email: 'john@abc.com',
    address: '123 Business Park, Mumbai, Maharashtra - 400001',
    expoName: 'Tech Expo 2024', 
    customerType: 'Corporate',
    productDetails: 'Product A',
    typeOfEnquiry: 'Product Inquiry',
    priority: 'high', 
    referenceBy: 'Mr. Sharma',
    remarks: 'Interested in bulk order for Q2',
    nextFollowupDate: '2024-03-20',
    uploads: [
      { id: 1, name: 'business_card.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800' },
      { id: 2, name: 'requirement.pdf', type: 'pdf', url: '#' }
    ],
    createdAt: '2024-03-15'
  },
  { 
    id: 2, 
    customerName: 'Jane Doe', 
    companyName: 'XYZ Limited', 
    contactNumber: '9876543211',
    whatsappNumber: '9876543211',
    alternateNumber: '',
    email: 'jane@xyz.com',
    address: '456 Industrial Area, Delhi - 110001',
    expoName: 'Trade Fair 2024', 
    customerType: 'Wholesale',
    productDetails: 'Product B',
    typeOfEnquiry: 'Price Quote',
    priority: 'medium', 
    referenceBy: 'Website',
    remarks: 'Needs pricing for 100 units',
    nextFollowupDate: '2024-03-22',
    uploads: [
      { id: 1, name: 'inquiry_photo.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800' }
    ],
    createdAt: '2024-03-14'
  },
  { 
    id: 3, 
    customerName: 'Mike Johnson', 
    companyName: 'DEF Industries', 
    contactNumber: '9876543212',
    whatsappNumber: '9876543212',
    alternateNumber: '9876543202',
    email: 'mike@def.com',
    address: '789 Tech Hub, Bangalore - 560001',
    expoName: 'Tech Expo 2024', 
    customerType: 'Distributor',
    productDetails: 'Product C',
    typeOfEnquiry: 'Service Request',
    priority: 'low', 
    referenceBy: 'Existing Customer',
    remarks: 'Looking for after-sales support',
    nextFollowupDate: '2024-03-18',
    uploads: [],
    createdAt: '2024-03-13'
  },
  { 
    id: 4, 
    customerName: 'Sarah Williams', 
    companyName: 'GHI Tech Solutions', 
    contactNumber: '9876543213',
    whatsappNumber: '9876543213',
    alternateNumber: '',
    email: 'sarah@ghi.com',
    address: '321 Software Park, Hyderabad - 500001',
    expoName: 'Business Summit', 
    customerType: 'Corporate',
    productDetails: 'Product A',
    typeOfEnquiry: 'Product Inquiry',
    priority: 'high', 
    referenceBy: 'LinkedIn',
    remarks: 'Enterprise solution required',
    nextFollowupDate: '2024-03-25',
    uploads: [
      { id: 1, name: 'company_profile.pdf', type: 'pdf', url: '#' }
    ],
    createdAt: '2024-03-12'
  },
  { 
    id: 5, 
    customerName: 'Robert Brown', 
    companyName: 'JKL Enterprises', 
    contactNumber: '9876543214',
    whatsappNumber: '9876543214',
    alternateNumber: '9876543204',
    email: 'robert@jkl.com',
    address: '654 Commerce Street, Chennai - 600001',
    expoName: 'Tech Expo 2024', 
    customerType: 'Retail',
    productDetails: 'Product B',
    typeOfEnquiry: 'General',
    priority: 'medium', 
    referenceBy: 'Trade Show',
    remarks: 'General inquiry about product range',
    nextFollowupDate: '2024-03-28',
    uploads: [
      { id: 1, name: 'product_image.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800' },
      { id: 2, name: 'specs.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800' },
      { id: 3, name: 'catalog.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800' }
    ],
    createdAt: '2024-03-11'
  },
  { 
    id: 6, 
    customerName: 'Emily Davis', 
    companyName: 'MNO Government Services', 
    contactNumber: '9876543215',
    whatsappNumber: '9876543215',
    alternateNumber: '',
    email: 'emily@mno.gov',
    address: '987 Secretariat Building, Pune - 411001',
    expoName: 'Trade Fair 2024', 
    customerType: 'Government',
    productDetails: 'Product D',
    typeOfEnquiry: 'Price Quote',
    priority: 'high', 
    referenceBy: 'Tender Notice',
    remarks: 'Government tender requirement',
    nextFollowupDate: '2024-03-30',
    uploads: [
      { id: 1, name: 'tender_doc.pdf', type: 'pdf', url: '#' },
      { id: 2, name: 'requirement.pdf', type: 'pdf', url: '#' }
    ],
    createdAt: '2024-03-10'
  },
  { 
    id: 7, 
    customerName: 'David Wilson', 
    companyName: 'PQR Manufacturing Ltd', 
    contactNumber: '9876543216',
    whatsappNumber: '9876543216',
    alternateNumber: '9876543206',
    email: 'david@pqr.com',
    address: '147 Factory Road, Ahmedabad - 380001',
    expoName: 'Business Summit', 
    customerType: 'Wholesale',
    productDetails: 'Product A',
    typeOfEnquiry: 'Service Request',
    priority: 'low', 
    referenceBy: 'Cold Call',
    remarks: 'Maintenance contract inquiry',
    nextFollowupDate: '2024-04-01',
    uploads: [],
    createdAt: '2024-03-09'
  },
  { 
    id: 8, 
    customerName: 'Lisa Anderson', 
    companyName: 'STU Corporation', 
    contactNumber: '9876543217',
    whatsappNumber: '9876543217',
    alternateNumber: '',
    email: 'lisa@stu.com',
    address: '258 Business Center, Kolkata - 700001',
    expoName: 'Tech Expo 2024', 
    customerType: 'Corporate',
    productDetails: 'Product C',
    typeOfEnquiry: 'Product Inquiry',
    priority: 'medium', 
    referenceBy: 'Email Campaign',
    remarks: 'Demo requested for next week',
    nextFollowupDate: '2024-04-05',
    uploads: [
      { id: 1, name: 'meeting_notes.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800' }
    ],
    createdAt: '2024-03-08'
  },
]

const ITEMS_PER_PAGE = 5

// Filter options
const expoOptions = ['All', 'Tech Expo 2024', 'Trade Fair 2024', 'Business Summit']
const priorityOptions = ['All', 'high', 'medium', 'low']
const customerTypeOptions = ['All', 'Retail', 'Wholesale', 'Distributor', 'Corporate', 'Government']
const enquiryTypeOptions = ['All', 'Product Inquiry', 'Price Quote', 'Service Request', 'General']

export default function Reports() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    expo: 'All',
    priority: 'All',
    customerType: 'All',
    enquiryType: 'All'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Filter and search logic
  const filteredData = useMemo(() => {
    return customersData.filter(customer => {
      const searchLower = search.toLowerCase()
      const matchesSearch = search === '' || 
        customer.customerName.toLowerCase().includes(searchLower) ||
        customer.companyName.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.contactNumber.includes(search) ||
        customer.productDetails.toLowerCase().includes(searchLower)

      const matchesExpo = filters.expo === 'All' || customer.expoName === filters.expo
      const matchesPriority = filters.priority === 'All' || customer.priority === filters.priority
      const matchesType = filters.customerType === 'All' || customer.customerType === filters.customerType
      const matchesEnquiry = filters.enquiryType === 'All' || customer.typeOfEnquiry === filters.enquiryType

      return matchesSearch && matchesExpo && matchesPriority && matchesType && matchesEnquiry
    })
  }, [search, filters])

  // Pagination
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      expo: 'All',
      priority: 'All',
      customerType: 'All',
      enquiryType: 'All'
    })
    setSearch('')
    setCurrentPage(1)
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'All').length + (search ? 1 : 0)

  // Stats
  const stats = [
    { label: 'Total', value: filteredData.length, color: 'bg-slate-100 text-slate-700' },
    { label: 'High Priority', value: filteredData.filter(c => c.priority === 'high').length, color: 'bg-red-50 text-red-700' },
    { label: 'Medium', value: filteredData.filter(c => c.priority === 'medium').length, color: 'bg-amber-50 text-amber-700' },
    { label: 'Low', value: filteredData.filter(c => c.priority === 'low').length, color: 'bg-emerald-50 text-emerald-700' },
  ]

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
    return styles[priority] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Layout title="Customer Reports">
      <div className="space-y-4 sm:space-y-6">
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiUsers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Customer Reports</h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5">View and export customer data</p>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-sm transition-all">
              <FiDownload className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-xl p-3 sm:p-4`}>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              <p className="text-xs sm:text-sm opacity-75 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Search and Filter Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Search by name, company, email, phone, product..."
                  className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                />
                {search && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-slate-100 text-slate-700 border-2 border-slate-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                <FiSliders className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-slate-700 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <FilterSelect
                    label="Expo"
                    value={filters.expo}
                    onChange={v => handleFilterChange('expo', v)}
                    options={expoOptions}
                  />
                  <FilterSelect
                    label="Priority"
                    value={filters.priority}
                    onChange={v => handleFilterChange('priority', v)}
                    options={priorityOptions}
                    capitalize
                  />
                  <FilterSelect
                    label="Customer Type"
                    value={filters.customerType}
                    onChange={v => handleFilterChange('customerType', v)}
                    options={customerTypeOptions}
                  />
                  <FilterSelect
                    label="Enquiry Type"
                    value={filters.enquiryType}
                    onChange={v => handleFilterChange('enquiryType', v)}
                    options={enquiryTypeOptions}
                  />
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
                  >
                    <FiX className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-100">
                  <th className="text-left px-6 py-4 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-4 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-6 py-4 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Remarks</th>
                  <th className="text-center px-6 py-4 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border border-gray-300">
                      <p className="font-semibold text-gray-900">{customer.customerName}</p>
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <p className="text-sm text-gray-700">{customer.contactNumber}</p>
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <p className="text-sm text-gray-700">{customer.companyName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{customer.customerType}</p>
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <span className="text-sm text-gray-700">{customer.productDetails}</span>
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${getPriorityBadge(customer.priority)}`}>
                        {customer.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <p className="text-sm text-gray-600 max-w-[200px] truncate" title={customer.remarks}>
                        {customer.remarks || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 border border-gray-300 text-center">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all hover:scale-[1.15] cursor-pointer"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {paginatedData.map((customer) => (
              <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold capitalize border ${getPriorityBadge(customer.priority)}`}>
                        {customer.priority}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{customer.customerName}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <FiPhone className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                      {customer.contactNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      <FiBriefcase className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                      {customer.companyName}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                        {customer.productDetails}
                      </span>
                    </div>
                    {customer.remarks && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                        <FiFileText className="w-3 h-3 inline mr-1" />
                        {customer.remarks}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all flex-shrink-0"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No customers found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="text-slate-600 hover:text-slate-800 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          getPriorityBadge={getPriorityBadge}
          formatDate={formatDate}
        />
      )}
    </Layout>
  )
}

// Filter Select Component
const FilterSelect = ({ label, value, onChange, options, capitalize = false }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-600">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {capitalize && opt !== 'All' ? opt.charAt(0).toUpperCase() + opt.slice(1) : opt}
        </option>
      ))}
    </select>
  </div>
)

// Pagination Component
const Pagination = ({ currentPage, totalPages, totalItems, startIndex, endIndex, onPageChange }) => (
  <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
        Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
        <span className="font-semibold">{endIndex}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  currentPage === pageNum
                    ? 'bg-slate-700 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="hidden xs:inline">Next</span>
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
)

// Customer Detail Modal Component
const CustomerDetailModal = ({ customer, onClose, getPriorityBadge, formatDate }) => {
  const [viewingAttachment, setViewingAttachment] = useState(null)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)

  const imageAttachments = customer.uploads?.filter(f => f.type === 'image') || []

  const openAttachment = (file, index) => {
    if (file.type === 'image') {
      setViewingAttachment(file)
      setCurrentAttachmentIndex(index)
    } else {
      // For non-image files, open in new tab or trigger download
      window.open(file.url, '_blank')
    }
  }

  const navigateAttachment = (direction) => {
    const newIndex = currentAttachmentIndex + direction
    if (newIndex >= 0 && newIndex < imageAttachments.length) {
      setCurrentAttachmentIndex(newIndex)
      setViewingAttachment(imageAttachments[newIndex])
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 p-4 sm:p-6 text-white flex-shrink-0">
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4 sm:hidden"></div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${getPriorityBadge(customer.priority)}`}>
                    {customer.priority} Priority
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold truncate">{customer.customerName}</h3>
                <p className="text-slate-300 text-sm mt-0.5 truncate">{customer.companyName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all flex-shrink-0 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            
            {/* Contact Information */}
            <div className='mb-6'>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-slate-600" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={FiPhone} label="Contact Number" value={customer.contactNumber} />
                <DetailItem icon={FiMessageSquare} label="WhatsApp" value={customer.whatsappNumber || '-'} />
                <DetailItem icon={FiPhone} label="Alternate Number" value={customer.alternateNumber || '-'} />
                <DetailItem icon={FiMail} label="Email" value={customer.email} />
              </div>
            </div>

            {/* Address */}
            <div className='mb-6'>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-slate-600" />
                Address
              </h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{customer.address || '-'}</p>
            </div>

            {/* Company & Customer Details */}
            <div className='mb-6'>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiBriefcase className="w-4 h-4 text-slate-600" />
                Company Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={FiBriefcase} label="Company Name" value={customer.companyName} />
                <DetailItem icon={FiUsers} label="Customer Type" value={customer.customerType} />
                <DetailItem icon={FiUser} label="Reference By" value={customer.referenceBy || '-'} />
                <DetailItem icon={FiCalendar} label="Expo" value={customer.expoName} />
              </div>
            </div>

            {/* Enquiry Details */}
            <div className='mb-6'>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiPackage className="w-4 h-4 text-slate-600" />
                Enquiry Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={FiPackage} label="Product Details" value={customer.productDetails} />
                <DetailItem icon={FiFlag} label="Type of Enquiry" value={customer.typeOfEnquiry} />
                <DetailItem icon={FiCalendar} label="Next Follow-up" value={formatDate(customer.nextFollowupDate)} />
              </div>
            </div>

            {/* Remarks */}
            {customer.remarks && (
              <div className='mb-6'>
                <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-slate-600" />
                  Remarks
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{customer.remarks}</p>
              </div>
            )}

            {/* Attachments */}
            {customer.uploads && customer.uploads.length > 0 && (
              <div className='mb-6'>
                <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiImage className="w-4 h-4 text-slate-600" />
                  Attachments ({customer.uploads.length})
                </h4>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                  {customer.uploads.map((file, index) => (
                    <div 
                      key={file.id} 
                      className="relative group cursor-pointer"
                      onClick={() => openAttachment(file, imageAttachments.indexOf(file))}
                    >
                      {file.type === 'image' ? (
                        <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative">
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <FiMaximize2 className="w-5 h-5 text-gray-700" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-3 hover:bg-gray-100 transition-colors">
                          <FiFile className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500 text-center truncate w-full">{file.name}</span>
                          <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                            <FiExternalLink className="w-3 h-3" />
                            Open
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1.5 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium text-sm transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Attachment Viewer */}
      {viewingAttachment && (
        <AttachmentViewer
          file={viewingAttachment}
          files={imageAttachments}
          currentIndex={currentAttachmentIndex}
          onClose={() => setViewingAttachment(null)}
          onNavigate={navigateAttachment}
        />
      )}
    </>
  )
}

// Full Screen Attachment Viewer Component
const AttachmentViewer = ({ file, files, currentIndex, onClose, onNavigate }) => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(file.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      // Fallback: open in new tab
      window.open(file.url, '_blank')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onNavigate(-1)
    if (e.key === 'ArrowRight') onNavigate(1)
  }

  // Add keyboard event listener
  useState(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-[60] flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-black/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-white text-sm sm:text-base font-medium truncate max-w-[150px] sm:max-w-[300px]">
            {file.name}
          </div>
          {files.length > 1 && (
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {files.length}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom Out"
          >
            <FiZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-white/60 text-xs sm:text-sm min-w-[45px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom In"
          >
            <FiZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-1 sm:mx-2"></div>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Rotate"
          >
            <FiRotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="hidden sm:flex p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Reset"
          >
            <FiMaximize2 className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-1 sm:mx-2"></div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Download"
          >
            <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all ml-1 sm:ml-2"
            title="Close"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative p-4">
        {/* Navigation Arrows */}
        {files.length > 1 && (
          <>
            <button
              onClick={() => onNavigate(-1)}
              disabled={currentIndex === 0}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => onNavigate(1)}
              disabled={currentIndex === files.length - 1}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Image */}
        <div 
          className="max-w-full max-h-full overflow-auto flex items-center justify-center"
          style={{
            cursor: zoom > 1 ? 'grab' : 'default'
          }}
        >
          <img
            src={file.url}
            alt={file.name}
            className="max-w-none transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxWidth: zoom === 1 ? '100%' : 'none',
              maxHeight: zoom === 1 ? '100%' : 'none'
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Thumbnail Strip (for multiple images) */}
      {files.length > 1 && (
        <div className="bg-black/50 p-2 sm:p-3">
          <div className="flex gap-2 justify-center overflow-x-auto pb-1">
            {files.map((f, index) => (
              <button
                key={f.id}
                onClick={() => {
                  onNavigate(index - currentIndex)
                }}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-white opacity-100' 
                    : 'border-transparent opacity-50 hover:opacity-75'
                }`}
              >
                <img
                  src={f.url}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Download Button */}
      <div className="sm:hidden p-4 bg-black/50">
        <button
          onClick={handleDownload}
          className="w-full py-3 bg-white text-gray-900 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
        >
          <FiDownload className="w-4 h-4" />
          Download Image
        </button>
      </div>
    </div>
  )
}

// Detail Item Component
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
      <Icon className="w-4 h-4 text-slate-500" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
    </div>
  </div>
)