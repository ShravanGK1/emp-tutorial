import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Plus, Moon, Sun, ChevronDown, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

export interface DropdownOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  onAdd: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onClear: () => void;
  filters: { client: string; branch: string; site: string; status: string };
  onFilterChange: (name: string, value: string) => void;
  clientOptions: DropdownOption[];
  branchOptions: DropdownOption[];
  siteOptions: DropdownOption[];
  statusOptions: DropdownOption[];
}

function SearchableDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string, 
  onChange: (val: string) => void, 
  options: DropdownOption[], 
  placeholder: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(o => o.value === value) || { label: placeholder, value: '' };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter options based on user typing
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter(o => 
      o.label.toLowerCase().includes(q) || o.value === ''
    );
  }, [options, search]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-w-[170px] text-left border border-gray-300 dark:border-slate-600 rounded-md py-2 pl-3 pr-8 bg-white dark:bg-slate-700/90 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-between"
      >
        <span className={clsx("block truncate font-medium", !value ? "text-gray-500 dark:text-gray-300" : "text-gray-900 dark:text-white font-semibold")}>
          {selectedOption.label}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
          <ChevronDown className={clsx("h-4 w-4 text-gray-500 dark:text-gray-300 transition-transform duration-200", isOpen && "rotate-180")} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 max-h-64 w-60 overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl dark:shadow-black/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none text-sm border border-gray-200 dark:border-slate-600">
          
          {/* Search bar inside the filter dropdown */}
          <div className="p-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/80 sticky top-0 z-10">
            <div className="relative flex items-center">
              <Search className="h-4 w-4 text-gray-400 dark:text-slate-400 absolute left-2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${placeholder}...`}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
                onClick={(e) => e.stopPropagation()}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto py-1 divide-y divide-gray-100 dark:divide-slate-700/50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value || '__all__'}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "cursor-pointer select-none py-2 px-3 text-sm flex items-center justify-between transition-colors",
                    value === option.value
                      ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
                      : "text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-gray-500 dark:text-slate-400">
                No matching {placeholder.toLowerCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterBar({ 
  onAdd, 
  onSearch, 
  searchQuery, 
  onClear, 
  filters, 
  onFilterChange,
  clientOptions,
  branchOptions,
  siteOptions,
  statusOptions,
}: FilterBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sticky top-16 z-30 flex flex-wrap items-center gap-4 py-4 px-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-md rounded-lg mb-6 border border-gray-200/80 dark:border-gray-700/80 transition-colors">
      
      {/* Global Table Search Bar */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-slate-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
          placeholder="Search Name, Emp Code..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Searchable Dropdown Filters */}
      <SearchableDropdown 
        value={filters.client} 
        onChange={(val) => onFilterChange('client', val)} 
        placeholder="Clients"
        options={clientOptions} 
      />

      <SearchableDropdown 
        value={filters.branch} 
        onChange={(val) => onFilterChange('branch', val)} 
        placeholder="Branches"
        options={branchOptions} 
      />

      <SearchableDropdown 
        value={filters.site} 
        onChange={(val) => onFilterChange('site', val)} 
        placeholder="Sites"
        options={siteOptions} 
      />

      <SearchableDropdown 
        value={filters.status} 
        onChange={(val) => onFilterChange('status', val)} 
        placeholder="Status"
        options={statusOptions} 
      />

      {/* Clear Button */}
      <button 
        onClick={onClear} 
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium px-2 transition-colors cursor-pointer"
      >
        Clear all
      </button>

      {/* Right side actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors cursor-pointer"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Employee
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
        </button>
      </div>
    </div>
  );
}