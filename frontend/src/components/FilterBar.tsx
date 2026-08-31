import { Search, Plus, RefreshCw, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FilterBarProps {
  onAdd: () => void;
  onRefresh: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onClear: () => void;
  filters: { client: string; branch: string; site: string; status: string };
  onFilterChange: (name: string, value: string) => void;
}

export function FilterBar({ onAdd, onRefresh, onSearch, searchQuery, onClear, filters, onFilterChange }: FilterBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 px-6 bg-white dark:bg-slate-800 shadow-sm rounded-lg mb-6">
      
      {/* Search Bar */}
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

      {/* Dropdown Filters */}
      <select 
        value={filters.client}
        onChange={(e) => onFilterChange('client', e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
      >
        <option value="">Client Selection</option>
        <option value="Acme Corp">Acme Corp</option>
        <option value="Tata Communications">Tata Communications</option>
        <option value="Global Tech">Global Tech</option>
        <option value="Innovatech">Innovatech</option>
      </select>

      <select 
        value={filters.branch}
        onChange={(e) => onFilterChange('branch', e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
      >
        <option value="">Branch Selection</option>
        <option value="West">West</option>
        <option value="East">East</option>
        <option value="North">North</option>
        <option value="South">South</option>
        <option value="Central">Central</option>
      </select>

      <select 
        value={filters.site}
        onChange={(e) => onFilterChange('site', e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
      >
        <option value="">Site Selection</option>
        <option value="Austin">Austin</option>
        <option value="Chicago">Chicago</option>
        <option value="Boston">Boston</option>
        <option value="Seattle">Seattle</option>
        <option value="Atlanta">Atlanta</option>
        <option value="Denver">Denver</option>
        <option value="New York">New York</option>
        <option value="Miami">Miami</option>
        <option value="TCL BKC">TCL BKC</option>
      </select>

      <select 
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
      >
        <option value="">Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* Clear Button */}
      <button 
        onClick={onClear} 
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium px-2 transition-colors"
      >
        Clear all
      </button>

      {/* Right side actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none transition-colors"
        >
          <RefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
          Refresh
        </button>

        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Employee
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
        </button>
      </div>
    </div>
  );
}
