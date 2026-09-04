import { Search, Plus, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

interface FilterBarProps {
  onAdd: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onClear: () => void;
  filters: { client: string; branch: string; site: string; status: string };
  onFilterChange: (name: string, value: string) => void;
}

function CustomDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string, 
  onChange: (val: string) => void, 
  options: {label: string, value: string}[], 
  placeholder: string 
}) {
  const selectedOption = options.find(o => o.value === value) || { label: placeholder, value: '' };
  
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton className="relative w-full min-w-[150px] text-left border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 bg-gray-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
          <span className="block truncate">{selectedOption.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
        <ListboxOptions 
          transition
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group relative cursor-pointer select-none py-2 pl-3 pr-4 text-gray-900 dark:text-gray-200 data-[focus]:bg-blue-50 dark:data-[focus]:bg-slate-700 data-[focus]:text-blue-900 dark:data-[focus]:text-white"
            >
              <span className="block truncate font-normal group-data-[selected]:font-medium text-sm">
                {option.label}
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function FilterBar({ onAdd, onSearch, searchQuery, onClear, filters, onFilterChange }: FilterBarProps) {
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

      {/* HeadlessUI Dropdown Filters */}
      <CustomDropdown 
        value={filters.client} 
        onChange={(val) => onFilterChange('client', val)} 
        placeholder="Client Selection"
        options={[
          { label: "All Clients", value: "" },
          { label: "Acme Corp", value: "Acme Corp" },
          { label: "Tata Communications", value: "Tata Communications" },
          { label: "Global Tech", value: "Global Tech" },
          { label: "Innovatech", value: "Innovatech" }
        ]} 
      />

      <CustomDropdown 
        value={filters.branch} 
        onChange={(val) => onFilterChange('branch', val)} 
        placeholder="Branch Selection"
        options={[
          { label: "All Branches", value: "" },
          { label: "West", value: "West" },
          { label: "East", value: "East" },
          { label: "North", value: "North" },
          { label: "South", value: "South" },
          { label: "Central", value: "Central" }
        ]} 
      />

      <CustomDropdown 
        value={filters.site} 
        onChange={(val) => onFilterChange('site', val)} 
        placeholder="Site Selection"
        options={[
          { label: "All Sites", value: "" },
          { label: "Austin", value: "Austin" },
          { label: "Chicago", value: "Chicago" },
          { label: "Boston", value: "Boston" },
          { label: "Seattle", value: "Seattle" },
          { label: "Atlanta", value: "Atlanta" },
          { label: "Denver", value: "Denver" },
          { label: "New York", value: "New York" },
          { label: "Miami", value: "Miami" },
          { label: "TCL BKC", value: "TCL BKC" }
        ]} 
      />

      <CustomDropdown 
        value={filters.status} 
        onChange={(val) => onFilterChange('status', val)} 
        placeholder="Status"
        options={[
          { label: "All Status", value: "" },
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" }
        ]} 
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