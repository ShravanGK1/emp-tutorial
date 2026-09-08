import { useEffect, useState, useMemo, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import type { Employee, EmployeeFormData } from '../../types';
import { X, Building2, MapPin, Briefcase, User, Search, Check } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  initialData?: Employee;
  mode: 'add' | 'edit';
  employees?: Employee[];
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
}

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  required,
  error
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(opt => opt.toLowerCase().includes(term));
  }, [options, searchTerm]);

  const handleSelect = (opt: string) => {
    setSearchTerm(opt);
    onChange(opt);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">
        {label} {required && <span className="text-gray-700 dark:text-slate-200 font-bold">*</span>}
      </label>
      
      <div className={`relative flex items-center border-b ${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} focus-within:border-teal-500 dark:focus-within:border-blue-400 py-1.5 transition`}>
        <Search className="w-4 h-4 text-gray-400 dark:text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              onChange('');
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-0.5 cursor-pointer ml-1"
            aria-label="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg bg-white dark:bg-[#1b263b] border border-gray-200 dark:border-slate-700 shadow-xl py-1 text-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt}
                onMouseDown={() => handleSelect(opt)}
                className={`px-3 py-2 cursor-pointer hover:bg-teal-50 dark:hover:bg-slate-700/80 flex items-center justify-between text-gray-800 dark:text-slate-200 ${
                  value === opt ? 'bg-teal-50/80 dark:bg-slate-700 font-semibold text-teal-600 dark:text-teal-400' : ''
                }`}
              >
                <span>{opt}</span>
                {value === opt && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-slate-400">
              No matching options. Type to use "{searchTerm}".
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function EmployeeModal({ isOpen, onClose, onSubmit, initialData, mode, employees }: EmployeeModalProps) {
  const [mobileDigits, setMobileDigits] = useState('');
  const [mobileError, setMobileError] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      app_registered: false
    }
  });

  const clientValue = watch('client') || '';
  const siteValue = watch('site') || '';
  const designationValue = watch('designation') || '';

  useEffect(() => {
    register('client', { required: 'Client is required' });
    register('site', { required: 'Site is required' });
    register('designation', { required: 'Designation is required' });
  }, [register]);

  // Dynamically compute options from available employee data + base fallback options
  const clientOptions = useMemo(() => {
    const list = new Set(["Acme Corp", "Tata Communications", "Global Tech", "Innovatech"]);
    (employees || []).forEach(e => e.client && list.add(e.client));
    if (initialData?.client) list.add(initialData.client);
    return Array.from(list).sort();
  }, [employees, initialData]);

  const siteOptions = useMemo(() => {
    const list = new Set(["Austin", "Chicago", "Boston", "Seattle", "Atlanta", "Denver", "New York", "Miami", "TCL BKC"]);
    (employees || []).forEach(e => e.site && list.add(e.site));
    if (initialData?.site) list.add(initialData.site);
    return Array.from(list).sort();
  }, [employees, initialData]);

  const designationOptions = useMemo(() => {
    const list = new Set(["Sr. Analyst", "Supervisor", "HR Executive", "Technician", "Coordinator", "Safety Officer", "Recruiter", "Associate", "LS/G"]);
    (employees || []).forEach(e => e.designation && list.add(e.designation));
    if (initialData?.designation) list.add(initialData.designation);
    return Array.from(list).sort();
  }, [employees, initialData]);

  useEffect(() => {
    if (isOpen) {
      setMobileError('');
      if (initialData) {
        reset(initialData);
        // Extract 10 digits from existing mobile
        const digitsOnly = (initialData.mobile || '').replace(/\D/g, '').slice(-10);
        setMobileDigits(digitsOnly);
      } else {
        reset({ app_registered: false, client: '', site: '', designation: '' });
        setMobileDigits('');
      }
    }
  }, [isOpen, initialData, reset]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileDigits(value);
    if (value.length === 10) {
      setMobileError('');
    }
  };

  const onFormSubmit = (data: EmployeeFormData) => {
    if (mobileDigits.length !== 10) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return;
    }
    setMobileError('');
    onSubmit({
      ...data,
      mobile: mobileDigits
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl rounded bg-white dark:bg-slate-800 shadow-xl overflow-hidden">

          <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">People</p>
              <Dialog.Title className="text-xl font-medium">
                {mode === 'add' ? 'Add Employee' : 'Edit Employee'}
              </Dialog.Title>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">
                {mode === 'add' ? 'Create a new employee profile' : 'Update an existing employee profile'}
              </span>
              
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 max-h-[85vh] overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">

              {/* Edit Mode: Prominent Current Work Assignment Display */}
              {mode === 'edit' && initialData && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-teal-50 via-emerald-50/60 to-cyan-50 dark:from-slate-700/80 dark:via-slate-700/50 dark:to-teal-950/30 border border-teal-200/80 dark:border-teal-700/60 shadow-sm">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-teal-200/60 dark:border-slate-600/70">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                        Current Work Assignment
                      </h4>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                      {initialData.status === 'Active' ? 'Active On-board' : 'Released / Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg border border-teal-100 dark:border-slate-600/70 flex items-start gap-3">
                      <div className="p-2 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 mt-0.5">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block">Current Client</span>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-0.5" title={initialData.client || 'Not assigned'}>
                          {initialData.client || 'Not assigned'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg border border-teal-100 dark:border-slate-600/70 flex items-start gap-3">
                      <div className="p-2 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block">Current Site & Branch</span>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-0.5" title={`${initialData.site || 'Not assigned'}${initialData.branch ? ` (${initialData.branch})` : ''}`}>
                          {initialData.site || 'Not assigned'} {initialData.branch ? `(${initialData.branch})` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg border border-teal-100 dark:border-slate-600/70 flex items-start gap-3">
                      <div className="p-2 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 mt-0.5">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block">Current Designation</span>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-0.5" title={initialData.designation || 'Not assigned'}>
                          {initialData.designation || 'Not assigned'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    Employee Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mode === 'add' ? 'Enter the employee details to create a new profile.' : 'Update employee profile and assignment details.'}
                  </p>
                </div>
                {mode === 'edit' && (
                  <div className="text-sm font-medium px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                    Employee ID: <span className="text-gray-900 dark:text-white font-bold">{initialData?.emp_code}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Employee Code *</label>
                  <input {...register("emp_code", { required: true })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="Enter employee code" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Employee Full Name *</label>
                  <input 
                    {...register("name", { 
                      required: "Full name is required",
                      pattern: {
                        value: /^[^0-9]+$/,
                        message: "Numbers are not allowed in name"
                      },
                      onChange: (e) => {
                        // Strip numbers immediately on type or paste
                        e.target.value = e.target.value.replace(/[0-9]/g, '');
                      }
                    })} 
                    onKeyDown={(e) => {
                      // Block 0-9 digits from keyboard input
                      if (/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" 
                    placeholder="Enter full name (letters only)" 
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                {/* 10-Digit Mobile Number Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobileDigits}
                    onChange={handleMobileChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 tracking-wider font-mono"
                    placeholder="9876543210"
                  />
                  {mobileError && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">{mobileError}</p>
                  )}
                  {mobileDigits.length > 0 && mobileDigits.length < 10 && !mobileError && (
                    <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">{10 - mobileDigits.length} digits remaining</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Email</label>
                  <input {...register("email")} type="email" className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="name@company.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Gender *</label>
                  <select {...register("gender")} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer">
                    <option value="" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Select gender</option>
                    <option value="Male" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Male</option>
                    <option value="Female" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Female</option>
                    <option value="Other" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Date of Joining *</label>
                  <input {...register("joined_on", { required: true })} type="date" className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Weekly Off *</label>
                  <select {...register("weekly_off")} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer">
                    <option value="" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Select day</option>
                    <option value="Monday" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Monday</option>
                    <option value="Tuesday" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Tuesday</option>
                    <option value="Wednesday" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Wednesday</option>
                    <option value="Thursday" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Thursday</option>
                    <option value="Friday" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Friday</option>
                    <option value="Saturday" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Saturday</option>
                    <option value="Sunday" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5">Weekly Off for days *</label>
                  <input type="number" defaultValue="1" className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="Enter number" />
                </div>
              </div>

              {/* Assignment details inputs */}
              <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-3">
                  Client & Site Deployment Assignment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SearchableSelect
                  label="Client"
                  placeholder="Search client..."
                  options={clientOptions}
                  value={clientValue}
                  onChange={(val) => setValue('client', val, { shouldValidate: true })}
                  required
                  error={errors.client?.message}
                />
                
                <SearchableSelect
                  label="Site"
                  placeholder="Search site..."
                  options={siteOptions}
                  value={siteValue}
                  onChange={(val) => setValue('site', val, { shouldValidate: true })}
                  required
                  error={errors.site?.message}
                />
                
                <SearchableSelect
                  label="Designation"
                  placeholder="Search designation..."
                  options={designationOptions}
                  value={designationValue}
                  onChange={(val) => setValue('designation', val, { shouldValidate: true })}
                  required
                  error={errors.designation?.message}
                />
              </div>

              {/* Status / Onboarding Section in Edit Mode */}
              {mode === 'edit' && (
                <div className="mb-8 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Employment & On-board Status</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {initialData?.status === 'Inactive' || initialData?.released_on
                          ? `Currently Inactive (Released: ${initialData?.released_on || 'N/A'}). Change to Active to re-onboard.`
                          : 'Employee is currently active on-board.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Status:</label>
                      <select 
                        {...register("status")}
                        className="rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-1.5 px-3 text-sm font-medium text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="Active" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Active (On-boarded)</option>
                        <option value="Inactive" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Inactive (Released)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">App registered</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register("app_registered")} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                  </label>
                  {mode === 'add' && <span className="ml-3 text-xs text-gray-500">Off by default</span>}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 mr-4">* Required fields</span>
                  <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none cursor-pointer">
                    {mode === 'add' ? 'Add Employee' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}