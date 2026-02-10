import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';

export default function Autocomplete({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Type to search...',
  loading = false,
  allowCreate = true,
  createText = 'Add new:',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update search term when value changes externally
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, options]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    onChange(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleCreateNew = () => {
    if (searchTerm.trim()) {
      onChange(searchTerm.trim());
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        } else if (searchTerm.trim() && allowCreate) {
          handleCreateNew();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const showCreateOption = 
    allowCreate && 
    searchTerm.trim() && 
    !filteredOptions.some(opt => opt.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Input Field */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full pl-10 pr-10 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl text-sm sm:text-base transition-all ${
              isOpen
                ? 'border-green-500 ring-2 ring-green-500/20'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden"
          >
            {loading ? (
              <div className="p-4 text-center">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              </div>
            ) : (
              <>
                {/* Options List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors ${
                          highlightedIndex === index
                            ? 'bg-green-50 text-green-700'
                            : 'hover:bg-gray-50 text-gray-900'
                        } ${
                          option.toLowerCase() === searchTerm.toLowerCase()
                            ? 'font-semibold'
                            : ''
                        }`}
                      >
                        <span className="truncate">{option}</span>
                        {option.toLowerCase() === searchTerm.toLowerCase() && (
                          <FiCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    !showCreateOption && (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No matching options found
                      </div>
                    )
                  )}
                </div>

                {/* Create New Option */}
                {showCreateOption && (
                  <div className="border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 hover:bg-green-50 text-green-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>{createText}</span>
                      <span className="font-semibold">"{searchTerm}"</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}