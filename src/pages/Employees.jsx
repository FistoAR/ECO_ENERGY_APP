import { useState, useMemo, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiSliders,
  FiBriefcase,
  FiShield,
  FiKey,
  FiAtSign,
  FiEye,
  FiEyeOff,
  FiUserCheck,
  FiUserX,
  FiLoader,
  FiAlertTriangle,
} from "react-icons/fi";
import { employeeApi, departmentApi } from "../services/api";

const ITEMS_PER_PAGE = 10;
const roles = ["Admin", "Employee"];

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    department: "All",
    role: "All",
    status: "All",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    department: "",
    role: "Employee",
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
  });
  const [errors, setErrors] = useState({});

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await employeeApi.getAll(
        currentPage,
        ITEMS_PER_PAGE,
        search,
        filters,
      );
      if (response.success && response.data) {
        setEmployees(response.data.data || []);
        setStats(
          response.data.stats || {
            total: 0,
            active: 0,
            inactive: 0,
            admins: 0,
          },
        );
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.total_pages);
          setTotalItems(response.data.pagination.total_items);
        }
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, filters]);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentApi.getAll();
      if (response.success && response.data) {
        setDepartments(response.data.map((d) => d.name));
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  // Generate username from name
  const generateUsername = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "")
      .substring(0, 15);
  };

  // Handle name change and auto-generate username
  const handleNameChange = (name) => {
    setForm((prev) => ({
      ...prev,
      name,
      username: editId ? prev.username : generateUsername(name),
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + employees.length, totalItems);

  const activeFiltersCount =
    Object.values(filters).filter((v) => v !== "All").length + (search ? 1 : 0);

  // Stats cards
  const statsCards = [
    {
      label: "Total",
      value: stats.total,
      color: "bg-slate-100 text-slate-700",
      icon: FiUser,
    },
    {
      label: "Active",
      value: stats.active,
      color: "bg-emerald-50 text-emerald-700",
      icon: FiUserCheck,
    },
    {
      label: "Inactive",
      value: stats.inactive,
      color: "bg-amber-50 text-amber-700",
      icon: FiUserX,
    },
    {
      label: "Admins",
      value: stats.admins,
      color: "bg-blue-50 text-blue-700",
      icon: FiShield,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ department: "All", role: "All", status: "All" });
    setSearch("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    clearFilters();
    fetchEmployees();
  };

  const handlePageChange = (page) => {
    if (typeof page === "function") {
      setCurrentPage((prev) => {
        const newPage = page(prev);
        return Math.max(1, Math.min(newPage, totalPages));
      });
    } else {
      setCurrentPage(page);
    }
  };

  const openAddModal = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      department: "",
      role: "Employee",
      status: "active",
    });
    setEditId(null);
    setShowPassword(false);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setForm({
      name: emp.name,
      phone: emp.phone,
      email: emp.email,
      username: emp.username,
      password: "******",
      department: emp.department,
      role: emp.role,
      status: emp.status,
    });
    setEditId(emp.id);
    setShowPassword(false);
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        username: form.username.trim().toLowerCase(),
        department: form.department,
        role: form.role,
        status: form.status,
      };

      if (!editId || (form.password && form.password !== "******")) {
        submitData.password = form.password;
      }

      let response;
      if (editId) {
        response = await employeeApi.update(editId, submitData);
      } else {
        response = await employeeApi.create(submitData);
      }

      if (response.success) {
        setShowModal(false);
        fetchEmployees();
        alert(
          editId
            ? "Employee updated successfully!"
            : "Employee created successfully!",
        );
      } else {
        // Handle validation errors
        if (response.errors) {
          setErrors(response.errors);
          // Show first error as alert for visibility
          const firstError = Object.values(response.errors)[0];
          if (firstError) {
            alert(`Validation Error: ${firstError}`);
          }
        } else {
          alert(response.message || "Operation failed");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      // Handle errors from the catch block
      if (error.errors) {
        setErrors(error.errors);
        const firstError = Object.values(error.errors)[0];
        if (firstError) {
          alert(`Validation Error: ${firstError}`);
        }
      } else {
        alert(error.message || "Failed to save employee");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (emp) => {
    setDeleteTarget(emp);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const response = await employeeApi.delete(deleteTarget.id);
      if (response.success) {
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        fetchEmployees();
        alert("Employee deleted successfully!");
      } else {
        alert(response.message || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role) => {
    return role === "Admin"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  };

  function handleBack() {
    window.history.back();
  }

  return (
    <Layout title="Employee Management">
      <button
        onClick={handleBack}
        className="text-md font-semibold text-white cursor-pointer py-2 px-3 my-2 bg-gray-700 rounded hover:bg-black transition-all flex items-center justify-center"
      >
        ← Back
      </button>

      <div className="space-y-4 sm:space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">
                  Employee Management
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                  Manage your team members
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-sm transition-all cursor-pointer disabled:opacity-50"
                title="Refresh"
              >
                <FiRefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-800 hover:bg-gray-100 rounded-xl font-medium text-sm transition-all cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsCards.map((stat, i) => (
            <div
              key={i}
              className={`${stat.color} rounded-xl p-3 sm:p-4 flex items-center gap-3`}
            >
              <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs sm:text-sm opacity-75">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            {/* Desktop: Single Row Layout */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                />
                {search && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <FiX className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white min-w-[140px] cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white min-w-[120px] cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white min-w-[120px] cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-medium transition-all cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Mobile/Tablet: Stacked Layout */}
            <div className="lg:hidden space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                    >
                      <FiX className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                    showFilters || activeFiltersCount > 0
                      ? "bg-slate-100 text-slate-700 border-2 border-slate-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
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

              {showFilters && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-600">
                        Department
                      </label>
                      <select
                        value={filters.department}
                        onChange={(e) =>
                          handleFilterChange("department", e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white cursor-pointer"
                      >
                        <option value="All">All</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-600">
                        Role
                      </label>
                      <select
                        value={filters.role}
                        onChange={(e) =>
                          handleFilterChange("role", e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white cursor-pointer"
                      >
                        <option value="All">All</option>
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-600">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white cursor-pointer"
                      >
                        <option value="All">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
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
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-12 text-center">
              <FiLoader className="w-8 h-8 animate-spin text-slate-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading employees...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employees.map((emp, index) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-500">
                            {startIndex + index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {emp.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                @{emp.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700 flex items-center gap-1.5">
                              <FiMail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[180px]">
                                {emp.email}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 flex items-center gap-1.5">
                              <FiPhone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              {emp.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                            <FiBriefcase className="w-3.5 h-3.5" />
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRoleBadge(emp.role)}`}
                          >
                            <FiShield className="w-3 h-3" />
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${getStatusBadge(emp.status)}`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(emp)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all hover:scale-110 cursor-pointer"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(emp)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 cursor-pointer"
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

                {employees.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUser className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No employees found
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-slate-600 hover:text-slate-800 font-medium text-sm cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden p-4 sm:p-6">
                {employees.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {employees.map((emp, index) => (
                      <EmployeeCard
                        key={emp.id}
                        employee={emp}
                        serialNo={startIndex + index + 1}
                        onEdit={() => openEditModal(emp)}
                        onDelete={() => confirmDelete(emp)}
                        getRoleBadge={getRoleBadge}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUser className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No employees found
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-slate-600 hover:text-slate-800 font-medium text-sm cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 0 && employees.length > 0 && (
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <EmployeeModal
          form={form}
          setForm={setForm}
          editId={editId}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          onNameChange={handleNameChange}
          departments={departments}
          roles={roles}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <DeleteConfirmModal
          employee={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </Layout>
  );
}

// Employee Card Component
const EmployeeCard = ({
  employee,
  serialNo,
  onEdit,
  onDelete,
  getRoleBadge,
  getStatusBadge,
}) => (
  <div className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-4 transition-all hover:shadow-md group">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold text-lg flex-shrink-0 relative">
          {employee.name.charAt(0).toUpperCase()}
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-slate-700 text-white text-xs rounded-full flex items-center justify-center">
            {serialNo}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {employee.name}
          </h3>
          <p className="text-xs text-gray-500">@{employee.username}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          title="Edit"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          title="Delete"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-3">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${getRoleBadge(employee.role)}`}
      >
        <FiShield className="w-3 h-3" />
        {employee.role}
      </span>
      <span
        className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold capitalize border ${getStatusBadge(employee.status)}`}
      >
        {employee.status}
      </span>
    </div>

    <div className="space-y-2 pt-3 border-t border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="truncate">{employee.email}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span>{employee.phone}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FiBriefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="font-medium text-slate-700">
          {employee.department}
        </span>
      </div>
    </div>
  </div>
);

// Employee Modal Component
const EmployeeModal = ({
  form,
  setForm,
  editId,
  showPassword,
  setShowPassword,
  isSubmitting,
  onSubmit,
  onClose,
  onNameChange,
  departments,
  roles,
  errors,
  setErrors,
}) => {
  const getInputClass = (field) =>
    `w-full pl-10 pr-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
      errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"
    }`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 p-4 sm:p-6 text-white flex-shrink-0">
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4 sm:hidden"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <FiUser className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {editId ? "Edit Employee" : "Add New Employee"}
                </h3>
                <p className="text-slate-300 text-xs mt-0.5">
                  {editId
                    ? "Update employee information"
                    : "Fill in the details below"}
                </p>
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

        {/* Modal Form */}
        <form
          onSubmit={onSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
        >
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={form.name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter full name"
                className={getInputClass("name")}
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, ""),
                    });
                    if (errors.phone)
                      setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  placeholder="Enter phone number"
                  className={getInputClass("phone")}
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Email ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="Enter email address"
                  className={getInputClass("email")}
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiAtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.username}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      username: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, ""),
                    });
                    if (errors.username)
                      setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  placeholder="Auto-generated"
                  className={`${getInputClass("username")} bg-gray-50`}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-gray-500">Auto-generated from name</p>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password {!editId && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder={editId ? "Leave unchanged" : "Enter password"}
                  className={`${getInputClass("password")} pr-10`}
                  required={!editId}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {editId && (
                <p className="text-xs text-gray-500">
                  Leave as is to keep current password
                </p>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={form.department}
                  onChange={(e) => {
                    setForm({ ...form, department: e.target.value });
                    if (errors.department)
                      setErrors((prev) => ({ ...prev, department: "" }));
                  }}
                  className={`${getInputClass("department")} appearance-none cursor-pointer`}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`${getInputClass("role")} appearance-none cursor-pointer`}
                  required
                  disabled={isSubmitting}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="flex gap-3">
              {["active", "inactive"].map((status) => (
                <label
                  key={status}
                  className={`flex-1 text-center py-3 rounded-xl cursor-pointer text-sm font-medium border-2 transition-all ${
                    form.status === status
                      ? status === "active"
                        ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                        : "bg-amber-100 border-amber-400 text-amber-700"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={form.status === status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  {editId ? "Updating..." : "Adding..."}
                </>
              ) : editId ? (
                "Update Employee"
              ) : (
                "Add Employee"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ employee, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiAlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Employee?</h3>
      <p className="text-gray-500 text-sm mb-2">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-700">{employee.name}</span>?
      </p>
      <p className="text-gray-400 text-xs mb-6">
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
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
);

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}) => {
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

  if (totalPages === 0) return null;

  return (
    <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
          Showing{" "}
          <span className="font-semibold text-gray-900">{startIndex + 1}</span>{" "}
          to <span className="font-semibold text-gray-900">{endIndex}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
          employees
        </p>

        <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => onPageChange((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            }`}
          >
            <FiChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..."}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  page === currentPage
                    ? "bg-slate-700 text-white shadow-lg"
                    : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="sm:hidden flex items-center gap-1">
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg">
              {currentPage} / {totalPages}
            </span>
          </div>

          <button
            onClick={() => onPageChange((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            }`}
          >
            <span className="hidden xs:inline">Next</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;
