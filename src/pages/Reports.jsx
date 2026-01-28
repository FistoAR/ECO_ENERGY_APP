import { useState, useMemo, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
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
  FiExternalLink,
  FiLoader,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiAlertTriangle
} from 'react-icons/fi'
import { customerApi, settingsApi, productApi, entryTypeApi } from '../services/api'

const ITEMS_PER_PAGE = 5

export default function Reports() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    expo: 'All',
    priority: 'All',
    customerType: 'All',
    type_of_enquiry: 'All'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [customers, setCustomers] = useState([])
  const [expos, setExpos] = useState([])
  const [customerTypes, setCustomerTypes] = useState([])
  const [enquiryTypes, setEnquiryTypes] = useState([])
  const [products, setProducts] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchCustomers()
    fetchExpos()
    fetchProducts()
    fetchEntryTypes()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await customerApi.getAll(1, 1000)
      if (response.success && response.data) {
        const customersData = response.data.data || []
        setCustomers(customersData)
        
        // Extract unique customer types
        const types = [...new Set(customersData
          .filter(c => c.customer_type)
          .map(c => c.customer_type)
        )].sort()
        setCustomerTypes(['All', ...types])
        
        // Calculate stats
        updateStats(customersData)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      alert('Failed to load customer data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExpos = async () => {
    try {
      const response = await settingsApi.getAll()
      if (response.success && response.data) {
        const exposData = response.data.expos || []
        setExpos(['All', ...exposData.map(e => e.name || e.expo_name)])
      }
    } catch (error) {
      console.error('Error fetching expos:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll(1, 1000)
      if (response.success && response.data) {
        const productsData = response.data.data || []
        setProducts(productsData)
        
        // Extract unique categories
        const categories = [...new Set(
          productsData
            .filter(p => p.category && p.status === 'active')
            .map(p => p.category)
        )].sort()
        setProductCategories(categories)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchEntryTypes = async () => {
    try {
      const response = await entryTypeApi.getAll(1, 100)
      if (response.success && response.data) {
        const types = response.data.data || []
        setEnquiryTypes(types)
      }
    } catch (error) {
      console.error('Error fetching entry types:', error)
    }
  }

  const updateStats = (data) => {
    setStats({
      total: data.length,
      high: data.filter(c => c.priority === 'high').length,
      medium: data.filter(c => c.priority === 'medium').length,
      low: data.filter(c => c.priority === 'low').length
    })
  }

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = customers
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(customer => 
        customer.customer_name?.toLowerCase().includes(searchLower) ||
        customer.company_name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.contact_number?.includes(search) ||
        customer.product_category?.toLowerCase().includes(searchLower)
      )
    }

    // Apply other filters
    filtered = filtered.filter(customer => {
      const matchesExpo = filters.expo === 'All' || customer.expo_name === filters.expo
      const matchesPriority = filters.priority === 'All' || customer.priority === filters.priority
      const matchesType = filters.customerType === 'All' || customer.customer_type === filters.customerType
      const matchesEnquiry = filters.type_of_enquiry === 'All' || customer.enquiry_type_name === filters.type_of_enquiry
      
      return matchesExpo && matchesPriority && matchesType && matchesEnquiry
    })

    // Update stats for filtered data
    updateStats(filtered)
    
    return filtered
  }, [search, filters, customers])

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
      type_of_enquiry: 'All'
    })
    setSearch('')
    setCurrentPage(1)
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'All').length + (search ? 1 : 0)

  // Priority options
  const priorityOptions = ['All', 'high', 'medium', 'low']

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
    return styles[priority] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const statsCards = [
    { label: 'Total', value: stats.total, color: 'bg-slate-100 text-slate-700' },
    { label: 'High Priority', value: stats.high, color: 'bg-red-50 text-red-700' },
    { label: 'Medium', value: stats.medium, color: 'bg-amber-50 text-amber-700' },
    { label: 'Low', value: stats.low, color: 'bg-emerald-50 text-emerald-700' },
  ]

  // Delete customer handler
  const handleDeleteCustomer = async (customerId) => {
    setIsDeleting(true)
    try {
      const response = await customerApi.delete(customerId)
      if (response.success) {
        // Remove from local state
        setCustomers(prev => prev.filter(c => c.id !== customerId))
        setDeleteConfirm(null)
        alert('Customer deleted successfully!')
      } else {
        alert(`Failed to delete customer: ${response.message}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Error: ${error.message || 'Failed to delete customer'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle edit success
  const handleEditSuccess = (updatedCustomer) => {
    setCustomers(prev => 
      prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    )
    setEditingCustomer(null)
    alert('Customer updated successfully!')
  }

  const exportData = () => {
    try {
      // Prepare data for export
      const exportData = filteredData.map(customer => ({
        'Customer Name': customer.customer_name || '',
        'Company Name': customer.company_name || '',
        'Contact Number': customer.contact_number || '',
        'WhatsApp Number': customer.whatsapp_number || '',
        'Email': customer.email || '',
        'Customer Type': customer.customer_type || '',
        'Expo': customer.expo_name || '',
        'Product': customer.product_category ? `${customer.product_category} - ${customer.product_size || ''}`.trim() : '',
        'Enquiry Type': customer.enquiry_type_name || '',
        'Priority': customer.priority || '',
        'Reference': customer.reference_by || '',
        'Remarks': customer.remarks || '',
        'Next Follow-up': formatDate(customer.next_followup_date),
        'Registration Date': formatDate(customer.created_at),
        'Address': customer.address || ''
      }))

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const cell = row[header] || ''
            // Escape quotes and wrap in quotes if contains comma
            return cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell
          }).join(',')
        )
      ].join('\n')

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      alert(`Exported ${exportData.length} customers successfully!`)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    }
  }

  function handleBack() {
    window.history.back();
  }

  return (
    <Layout title="Customer Reports">
         <button onClick={handleBack} className="text-md font-semibold text-white cursor-pointer py-2 px-3 my-2 bg-gray-700 rounded hover:bg-black transition-all flex items-center justify-center">← Back</button>
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
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5">View, edit and export customer data</p>
              </div>
            </div>
            <button 
              onClick={exportData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-sm transition-all"
            >
              <FiDownload className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {statsCards.map((stat, i) => (
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <FiX className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
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
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* <FilterSelect
                    label="Expo"
                    value={filters.expo}
                    onChange={v => handleFilterChange('expo', v)}
                    options={expos}
                  /> */}
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
                    options={customerTypes}
                  />
                  <FilterSelect
                    label="Enquiry Type"
                    value={filters.type_of_enquiry}
                    onChange={v => handleFilterChange('type_of_enquiry', v)}
                    options={['All', ...enquiryTypes.map(t => t.name)]}
                  />
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-12 text-center">
              <FiLoader className="w-8 h-8 animate-spin text-slate-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading customer data...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-100">
                      <th className="text-left px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">S.No.</th>
                      <th className="text-left px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="text-left px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="text-left px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                      <th className="text-left px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                      <th className="text-left px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                      <th className="text-left px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">Remarks</th>
                      <th className="text-center px-6 py-4 border border-gray-300 text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((customer, index) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border border-gray-300">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <p className="font-semibold text-gray-900">{customer.customer_name || '-'}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{customer.expo_name || '-'}</p>
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <p className="text-sm text-gray-700">{customer.contact_number || '-'}</p>
                          {customer.email && (
                            <p className="text-xs text-gray-500 mt-0.5">{customer.email}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <p className="text-sm text-gray-700">{customer.company_name || '-'}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{customer.customer_type || '-'}</p>
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <span className="text-sm text-gray-700">
                            {customer.product_category ? `${customer.product_category} - ${customer.product_size || ''}`.trim() : '-'}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">{customer.enquiry_type_name || '-'}</p>
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${getPriorityBadge(customer.priority)}`}>
                            {customer.priority || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <p className="text-sm text-gray-600 max-w-[200px] truncate" title={customer.remarks}>
                            {customer.remarks || '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4 border border-gray-300 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all hover:scale-[1.15] cursor-pointer"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCustomer(customer)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-[1.15] cursor-pointer"
                              title="Edit Customer"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(customer)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-[1.15] cursor-pointer"
                              title="Delete Customer"
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
              <div className="lg:hidden divide-y divide-gray-100">
                {paginatedData.map((customer) => (
                  <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold capitalize border ${getPriorityBadge(customer.priority)}`}>
                            {customer.priority || '-'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{customer.customer_name || '-'}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          <FiPhone className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                          {customer.contact_number || '-'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          <FiBriefcase className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                          {customer.company_name || '-'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                            {customer.product_category ? `${customer.product_category} - ${customer.product_size || ''}`.trim() : '-'}
                          </span>
                        </div>
                        {customer.remarks && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                            <FiFileText className="w-3 h-3 inline mr-1" />
                            {customer.remarks}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                          title="View"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(customer)}
                          className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredData.length === 0 && !isLoading && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No customers found</h3>
                  <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={clearFilters}
                    className="text-slate-600 hover:text-slate-800 font-medium text-sm cursor-pointer"
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
            </>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onEdit={() => {
            setSelectedCustomer(null)
            setEditingCustomer(selectedCustomer)
          }}
          onDelete={() => {
            setSelectedCustomer(null)
            setDeleteConfirm(selectedCustomer)
          }}
          getPriorityBadge={getPriorityBadge}
          formatDate={formatDate}
        />
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSuccess={handleEditSuccess}
          products={products}
          productCategories={productCategories}
          entryTypes={enquiryTypes}
          getPriorityBadge={getPriorityBadge}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          customer={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDeleteCustomer(deleteConfirm.id)}
          isDeleting={isDeleting}
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
      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white cursor-pointer"
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
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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

// Delete Confirmation Modal
const DeleteConfirmModal = ({ customer, onClose, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Customer</h3>
        <p className="text-gray-600">
          Are you sure you want to delete <span className="font-semibold">{customer.customer_name}</span>? 
          This action cannot be undone.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 p-6 pt-0">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isDeleting ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <FiTrash2 className="w-4 h-4" />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)

// Edit Customer Modal
const EditCustomerModal = ({ customer, onClose, onSuccess, products, productCategories, entryTypes, getPriorityBadge }) => {
  const [form, setForm] = useState({
    customer_name: customer.customer_name || '',
    contact_number: customer.contact_number || '',
    company_name: customer.company_name || '',
    customer_type: customer.customer_type || '',
    email: customer.email || '',
    whatsapp_number: customer.whatsapp_number || '',
    alternate_number: customer.alternate_number || '',
    address: customer.address || '',
    product_id: customer.product_id || null,
    type_of_enquiry_id: customer.type_of_enquiry_id || null,
    priority: customer.priority || 'medium',
    reference_by: customer.reference_by || '',
    remarks: customer.remarks || '',
    next_followup_date: customer.next_followup_date ? new Date(customer.next_followup_date) : null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(customer.product_category || '')
  const [productSizes, setProductSizes] = useState([])

  // Customer type options
  const customerTypes = ['Retail', 'Wholesale', 'Distributor', 'Corporate', 'Government']

  // Update product sizes when category changes
  useEffect(() => {
    if (selectedCategory && products.length > 0) {
      const filteredProducts = products.filter(
        p => p.category === selectedCategory && p.status === 'active'
      )
      setProductSizes(filteredProducts)
    } else {
      setProductSizes([])
    }
  }, [selectedCategory, products])

  // Set initial product sizes based on customer's product
  useEffect(() => {
    if (customer.product_category) {
      const filteredProducts = products.filter(
        p => p.category === customer.product_category && p.status === 'active'
      )
      setProductSizes(filteredProducts)
    }
  }, [customer.product_category, products])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    setForm(prev => ({ ...prev, product_id: null }))
  }

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, next_followup_date: date }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.customer_name.trim()) {
      alert('Customer name is required')
      return
    }

    if (!form.contact_number.trim()) {
      alert('Contact number is required')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        ...form,
        next_followup_date: form.next_followup_date
          ? new Date(form.next_followup_date).toISOString().split('T')[0]
          : null,
        customer_name: form.customer_name.trim(),
        contact_number: form.contact_number.trim(),
        company_name: form.company_name?.trim() || '',
        email: form.email?.trim() || '',
        whatsapp_number: form.whatsapp_number?.trim() || '',
        alternate_number: form.alternate_number?.trim() || '',
        address: form.address?.trim() || '',
        reference_by: form.reference_by?.trim() || '',
        remarks: form.remarks?.trim() || '',
        customer_type: form.customer_type?.trim() || '',
      }

      const response = await customerApi.update(customer.id, submitData)

      if (response.success) {
        // Merge updated data with original customer data
        const updatedCustomer = {
          ...customer,
          ...submitData,
          // Keep category and size info for display
          product_category: selectedCategory,
          product_size: productSizes.find(p => p.id === parseInt(form.product_id))?.size || '',
          enquiry_type_name: entryTypes.find(t => t.id === parseInt(form.type_of_enquiry_id))?.name || '',
        }
        onSuccess(updatedCustomer)
      } else {
        alert(`Failed to update customer: ${response.message}`)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert(`Error: ${error.message || 'Failed to update customer'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white flex-shrink-0">
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4 sm:hidden"></div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiEdit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Edit Customer</h3>
                <p className="text-blue-100 text-sm">{customer.customer_name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="w-4 h-4 text-blue-600" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="contact_number"
                  value={form.contact_number}
                  onChange={handleChange}
                  type="tel"
                  className={inputClass}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Company Name</label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Customer Type</label>
                <select
                  name="customer_type"
                  value={form.customer_type}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isSubmitting}
                >
                  <option value="">Select Type</option>
                  {customerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-blue-600" />
              Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">WhatsApp Number</label>
                <input
                  name="whatsapp_number"
                  value={form.whatsapp_number}
                  onChange={handleChange}
                  type="tel"
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Alternate Number</label>
                <input
                  name="alternate_number"
                  value={form.alternate_number}
                  onChange={handleChange}
                  type="tel"
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Reference By</label>
                <input
                  name="reference_by"
                  value={form.reference_by}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className={`${inputClass} resize-none`}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Enquiry Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiPackage className="w-4 h-4 text-blue-600" />
              Enquiry Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Product Category</label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className={inputClass}
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  {productCategories.map((category, index) => (
                    <option key={`${category}-${index}`} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Product Size</label>
                <select
                  name="product_id"
                  value={form.product_id || ''}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={!selectedCategory || isSubmitting || productSizes.length === 0}
                >
                  <option value="">Select Size</option>
                  {productSizes.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.size || 'No size specified'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Type of Enquiry</label>
                <select
                  name="type_of_enquiry_id"
                  value={form.type_of_enquiry_id || ''}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isSubmitting}
                >
                  <option value="">Select Type</option>
                  {entryTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">Next Follow-up Date</label>
                <DatePicker
                  selected={form.next_followup_date}
                  onChange={handleDateChange}
                  className={inputClass}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Priority */}
            <div className="mt-4 space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">Priority</label>
              <div className="flex gap-2">
                {['low', 'medium', 'high'].map(p => (
                  <label
                    key={p}
                    className={`flex-1 text-center py-2.5 rounded-xl cursor-pointer text-sm font-medium border-2 transition-all ${
                      form.priority === p
                        ? p === 'high'
                          ? 'bg-red-100 border-red-400 text-red-700'
                          : p === 'medium'
                            ? 'bg-amber-100 border-amber-400 text-amber-700'
                            : 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
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

            {/* Remarks */}
            <div className="mt-4 space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows={2}
                className={`${inputClass} resize-none`}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Customer Detail Modal Component
const CustomerDetailModal = ({ customer, onClose, onEdit, onDelete, getPriorityBadge, formatDate }) => {
  const [viewingAttachment, setViewingAttachment] = useState(null)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)

  const imageAttachments = customer.attachments?.filter(f => f.file_type?.startsWith('image/')) || []

  const openAttachment = (file, index) => {
    if (file.file_type?.startsWith('image/')) {
      setViewingAttachment(file)
      setCurrentAttachmentIndex(index)
    } else {
      const fileUrl = `https://www.fist-o.com/eco_energy/${file.file_path}`
      window.open(fileUrl, '_blank')
    }
  }

  const navigateAttachment = (direction) => {
    const newIndex = currentAttachmentIndex + direction
    if (newIndex >= 0 && newIndex < imageAttachments.length) {
      setCurrentAttachmentIndex(newIndex)
      setViewingAttachment(imageAttachments[newIndex])
    }
  }

  const handleDownload = async (file) => {
    try {
      const fileUrl = `https://www.fist-o.com/eco_energy/${file.file_path}`
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.original_name || file.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      const fileUrl = `https://www.fist-o.com/eco_energy/${file.file_path}`
      window.open(fileUrl, '_blank')
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return FiImage
    if (fileType === 'application/pdf') return FiFile
    return FiFile
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
                <h3 className="text-lg sm:text-xl font-bold truncate">{customer.customer_name || '-'}</h3>
                <p className="text-slate-300 text-sm mt-0.5 truncate">{customer.company_name || '-'}</p>
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
                <DetailItem icon={FiPhone} label="Contact Number" value={customer.contact_number || '-'} />
                <DetailItem icon={FiMessageSquare} label="WhatsApp" value={customer.whatsapp_number || '-'} />
                <DetailItem icon={FiPhone} label="Alternate Number" value={customer.alternate_number || '-'} />
                <DetailItem icon={FiMail} label="Email" value={customer.email || '-'} />
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
                <DetailItem icon={FiBriefcase} label="Company Name" value={customer.company_name || '-'} />
                <DetailItem icon={FiUsers} label="Customer Type" value={customer.customer_type || '-'} />
                <DetailItem icon={FiUser} label="Reference By" value={customer.reference_by || '-'} />
                <DetailItem icon={FiCalendar} label="Expo" value={customer.expo_name || '-'} />
              </div>
            </div>

            {/* Enquiry Details */}
            <div className='mb-6'>
              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiPackage className="w-4 h-4 text-slate-600" />
                Enquiry Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem 
                  icon={FiPackage} 
                  label="Product Details" 
                  value={customer.product_category ? `${customer.product_category} - ${customer.product_size || ''}`.trim() : '-'} 
                />
                <DetailItem icon={FiFlag} label="Type of Enquiry" value={customer.enquiry_type_name || '-'} />
                <DetailItem icon={FiCalendar} label="Next Follow-up" value={formatDate(customer.next_followup_date)} />
                <DetailItem icon={FiCalendar} label="Registration Date" value={formatDate(customer.created_at)} />
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
            {customer.attachments && customer.attachments.length > 0 && (
              <div className='mb-6'>
                <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiImage className="w-4 h-4 text-slate-600" />
                  Attachments ({customer.attachments.length})
                </h4>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                  {customer.attachments.map((file, index) => {
                    const FileIcon = getFileIcon(file.file_type)
                    const isImage = file.file_type?.startsWith('image/')
                    const fileUrl = `https://www.fist-o.com/eco_energy/${file.file_path}`
                    
                    return (
                      <div 
                        key={file.id} 
                        className="relative group cursor-pointer"
                        onClick={() => openAttachment(file, imageAttachments.indexOf(file))}
                      >
                        {isImage ? (
                          <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative">
                            <img 
                              src={fileUrl} 
                              alt={file.original_name || file.file_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlYmViZWIiLz48cGF0aCBkPSJNNjUgNDVINTVWNTVINjVWNjVINDUiIHN0cm9rZT0iI2JjYmNiYyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'
                              }}
                            />
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
                            <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 text-center truncate w-full">
                              {file.original_name || file.file_name}
                            </span>
                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                              <FiExternalLink className="w-3 h-3" />
                              Open
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1.5 truncate">{file.original_name || file.file_name}</p>
                        <div className="text-xs text-gray-400">
                          {Math.round((file.file_size || 0) / 1024)} KB
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={onEdit}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="py-3 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium text-sm transition-all cursor-pointer"
              >
                <FiTrash2 className="w-4 h-4" />
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
          onDownload={handleDownload}
        />
      )}
    </>
  )
}


// Full Screen Attachment Viewer Component
const AttachmentViewer = ({ file, files, currentIndex, onClose, onNavigate, onDownload }) => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const fileUrl = `https://www.fist-o.com/eco_energy/${file.file_path}`

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onNavigate(-1)
    if (e.key === 'ArrowRight') onNavigate(1)
  }

  // Add keyboard event listener
  useEffect(() => {
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
            {file.original_name || file.file_name}
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
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Zoom In"
          >
            <FiZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-1 sm:mx-2"></div>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
            title="Rotate"
          >
            <FiRotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="hidden sm:flex p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
            title="Reset"
          >
            <FiMaximize2 className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-1 sm:mx-2"></div>

          {/* Download */}
          <button
            onClick={() => onDownload(file)}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
            title="Download"
          >
            <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all ml-1 sm:ml-2 cursor-pointer"
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10 cursor-pointer"
            >
              <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => onNavigate(1)}
              disabled={currentIndex === files.length - 1}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10 cursor-pointer"
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
            src={fileUrl}
            alt={file.original_name || file.file_name}
            className="max-w-none transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxWidth: zoom === 1 ? '100%' : 'none',
              maxHeight: zoom === 1 ? '100%' : 'none'
            }}
            draggable={false}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyMDI0MjkiLz48cGF0aCBkPSJNNjUgNDVINTVWNTVINjVWNjVINDUiIHN0cm9rZT0iIzhjOWFhYiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'
            }}
          />
        </div>
      </div>

      {/* Thumbnail Strip (for multiple images) */}
      {files.length > 1 && (
        <div className="bg-black/50 p-2 sm:p-3">
          <div className="flex gap-2 justify-center overflow-x-auto pb-1">
            {files.map((f, index) => {
              const thumbUrl = `https://www.fist-o.com/eco_energy/${f.file_path}`
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    onNavigate(index - currentIndex);
                    console.log("Thumb url: ", thumbUrl);
                  }}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    index === currentIndex 
                      ? 'border-white opacity-100' 
                      : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={thumbUrl}
                    alt={f.original_name || f.file_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyMDI0MjkiLz48cGF0aCBkPSJNNjUgNDVINTVWNTVINjVWNjVINDUiIHN0cm9rZT0iIzhjOWFhYiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Mobile Download Button */}
      <div className="sm:hidden p-4 bg-black/50">
        <button
          onClick={() => onDownload(file)}
          className="w-full py-3 bg-white text-gray-900 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
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