import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, startOfDay, setMonth, setYear } from 'date-fns';
import { FiCalendar, FiX, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'react-day-picker/dist/style.css';

export default function MultipleDatePicker({ 
  selectedDates = [], 
  onChange, 
  label = "Select Dates",
  placeholder = "Click to select dates"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  // Convert string dates to Date objects for the calendar
  const dateObjects = selectedDates
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()));

  // Handle date selection
  const handleSelect = (dates) => {
    if (!dates) {
      onChange([]);
      return;
    }
    
    const dateStrings = dates
      .map(d => format(d, 'yyyy-MM-dd'))
      .sort();
    
    onChange(dateStrings);
  };

  // Remove a specific date
  const handleRemoveDate = (dateToRemove) => {
    const newDates = selectedDates.filter(date => date !== dateToRemove);
    onChange(newDates);
  };

  // Clear all dates
  const handleClearAll = () => {
    onChange([]);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  // Generate years array (current year - 5 to current year + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);

  // Months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle month change
  const handleMonthSelect = (monthIndex) => {
    const newDate = setMonth(currentMonth, monthIndex);
    setCurrentMonth(newDate);
  };

  // Handle year change
  const handleYearSelect = (year) => {
    const newDate = setYear(currentMonth, year);
    setCurrentMonth(newDate);
  };

  // Navigate to previous/next month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentMonth(new Date());
    setShowMonthYearPicker(false);
  };

  // Custom styles for the calendar
  const css = `
    .rdp {
      --rdp-cell-size: 40px;
      --rdp-accent-color: #10b981;
      --rdp-background-color: #d1fae5;
      margin: 0;
    }
    .rdp-day_selected:not([disabled]) { 
      background-color: #10b981;
      color: white;
      font-weight: 600;
    }
    .rdp-day_selected:hover:not([disabled]) { 
      background-color: #059669;
    }
    .rdp-day:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: #ecfdf5;
    }
    .rdp-day_today:not(.rdp-day_selected) {
      border: 2px solid #10b981;
      font-weight: 600;
    }
    .rdp-head_cell {
      color: #6b7280;
      font-weight: 600;
      font-size: 0.75rem;
    }
    .rdp-day {
      border-radius: 8px;
      font-size: 0.875rem;
    }
    .rdp-day_disabled {
      color: #d1d5db;
    }
    .rdp-caption {
      display: none;
    }
    .rdp-nav {
      display: none;
    }
  `;

  return (
    <div className="space-y-2">
      <style>{css}</style>
      
      <label className="block text-xs sm:text-sm font-semibold text-gray-700">
        {label}
      </label>
      
      {/* Calendar Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 px-4 py-3 border rounded-xl transition-all text-left cursor-pointer ${
            isOpen 
              ? 'border-green-500 ring-2 ring-green-500/20' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <FiCalendar className={`w-5 h-5 ${isOpen ? 'text-green-500' : 'text-gray-400'}`} />
            <span className={selectedDates.length > 0 ? 'text-gray-900 sm:text-xs' : 'text-gray-400'}>
              {selectedDates.length > 0 
                ? `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
                : placeholder
              }
            </span>
          </div>
          <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Calendar Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Calendar Panel */}
            <div className="absolute z-50 mt-2 left-0 right-0 sm:left-auto sm:right-auto sm:min-w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-700">
                  Select Event Dates
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Custom Navigation Header */}
              <div className="flex items-center justify-between mb-4">
                {/* Previous Month Button */}
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Month/Year Selector */}
                <button
                  type="button"
                  onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="text-base font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showMonthYearPicker ? 'rotate-180' : ''}`} />
                </button>

                {/* Next Month Button */}
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <FiChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Month/Year Picker Dropdown */}
              {showMonthYearPicker && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  {/* Year Selection */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Year</label>
                    <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">
                      {years.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleYearSelect(year)}
                          className={`px-2 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                            currentMonth.getFullYear() === year
                              ? 'bg-green-500 text-white font-semibold'
                              : 'hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Month Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Month</label>
                    <div className="grid grid-cols-3 gap-1">
                      {months.map((month, index) => (
                        <button
                          key={month}
                          type="button"
                          onClick={() => {
                            handleMonthSelect(index);
                            setShowMonthYearPicker(false);
                          }}
                          className={`px-2 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                            currentMonth.getMonth() === index
                              ? 'bg-green-500 text-white font-semibold'
                              : 'hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Go to Today Button */}
                  <button
                    type="button"
                    onClick={goToToday}
                    className="w-full mt-3 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Go to Today
                  </button>
                </div>
              )}

              {/* Calendar */}
              {!showMonthYearPicker && (
                <DayPicker
                  mode="multiple"
                  selected={dateObjects}
                  onSelect={handleSelect}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  showOutsideDays
                  classNames={{
                    months: 'flex flex-col',
                    month: 'space-y-2 block mx-auto',
                    table: 'w-full border-collapse',
                    head_row: 'flex',
                    head_cell: 'w-10 text-center text-xs font-medium text-gray-500 py-2',
                    row: 'flex w-full',
                    cell: 'w-10 h-10 text-center p-0 relative',
                    day: 'w-10 h-10 rounded-lg text-sm transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 cursor-pointer',
                    day_selected: 'bg-green-500 text-white hover:bg-green-600 font-semibold',
                    day_today: 'border-2 border-green-500 font-semibold',
                    day_disabled: 'text-gray-300 hover:bg-transparent cursor-not-allowed',
                    day_outside: 'text-gray-300',
                  }}
                />
              )}

              {/* Quick Actions */}
              {!showMonthYearPicker && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Quick Select:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const dates = [];
                        for (let i = 0; i < 3; i++) {
                          const date = new Date(today);
                          date.setDate(today.getDate() + i);
                          dates.push(format(date, 'yyyy-MM-dd'));
                        }
                        onChange(dates);
                      }}
                      className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium cursor-pointer"
                    >
                      Next 3 days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const dates = [];
                        for (let i = 0; i < 7; i++) {
                          const date = new Date(today);
                          date.setDate(today.getDate() + i);
                          dates.push(format(date, 'yyyy-MM-dd'));
                        }
                        onChange(dates);
                      }}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium cursor-pointer"
                    >
                      Next 7 days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const dates = [];
                        for (let i = 0; i < 14; i++) {
                          const date = new Date(today);
                          date.setDate(today.getDate() + i);
                          const day = date.getDay();
                          if (day === 0 || day === 6) {
                            dates.push(format(date, 'yyyy-MM-dd'));
                          }
                        }
                        onChange(dates);
                      }}
                      className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all font-medium cursor-pointer"
                    >
                      Weekends
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Select entire current month from today
                        const today = new Date();
                        const year = currentMonth.getFullYear();
                        const month = currentMonth.getMonth();
                        const lastDay = new Date(year, month + 1, 0).getDate();
                        const dates = [];
                        
                        for (let day = 1; day <= lastDay; day++) {
                          const date = new Date(year, month, day);
                          if (date >= startOfDay(today)) {
                            dates.push(format(date, 'yyyy-MM-dd'));
                          }
                        }
                        onChange(dates);
                      }}
                      className="text-xs px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all font-medium cursor-pointer"
                    >
                      This Month
                    </button>
                  </div>
                </div>
              )}

              {/* Selected Count & Done Button */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected Dates Display */}
      {selectedDates.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 font-medium">
              Selected Dates ({selectedDates.length}):
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {selectedDates.sort().map((date, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm group hover:border-red-200 transition-colors"
              >
                <FiCalendar className="w-3.5 h-3.5 text-green-500" />
                {formatDisplayDate(date)}
                <button
                  type="button"
                  onClick={() => handleRemoveDate(date)}
                  className="ml-1 p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}