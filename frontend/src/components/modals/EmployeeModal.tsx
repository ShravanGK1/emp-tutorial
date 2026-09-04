import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import type { Employee, EmployeeFormData } from '../../types';
import { X } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  initialData?: Employee;
  mode: 'add' | 'edit';
}

export function EmployeeModal({ isOpen, onClose, onSubmit, initialData, mode }: EmployeeModalProps) {
  const [mobileDigits, setMobileDigits] = useState('');
  const [mobileError, setMobileError] = useState('');

  const { register, handleSubmit, reset } = useForm<EmployeeFormData>({
    defaultValues: initialData || {
      app_registered: false
    }
  });

  useEffect(() => {
    if (isOpen) {
      setMobileError('');
      if (initialData) {
        reset(initialData);
        // Extract 10 digits from existing mobile
        const digitsOnly = (initialData.mobile || '').replace(/\D/g, '').slice(-10);
        setMobileDigits(digitsOnly);
      } else {
        reset({ app_registered: false });
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

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-8">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Employee information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mode === 'add' ? 'Enter the employee details to create a new profile.' : ''}
                  </p>
                </div>
                {mode === 'edit' && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Employee ID: {initialData?.emp_code}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Code *</label>
                  <input {...register("emp_code", { required: true })} className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white" placeholder="Enter employee code" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Full Name *</label>
                  <input {...register("name", { required: true })} className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white" placeholder="Enter full name" />
                </div>
                
                {/* 10-Digit Mobile Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobileDigits}
                    onChange={handleMobileChange}
                    className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white placeholder-gray-400 tracking-wider font-mono"
                    placeholder="9876543210"
                  />
                  {mobileError && (
                    <p className="text-xs text-red-500 mt-1">{mobileError}</p>
                  )}
                  {mobileDigits.length > 0 && mobileDigits.length < 10 && !mobileError && (
                    <p className="text-xs text-amber-500 mt-1">{10 - mobileDigits.length} digits remaining</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input {...register("email")} type="email" className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white" placeholder="name@company.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender *</label>
                  <select {...register("gender")} className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Joining *</label>
                  <input {...register("joined_on", { required: true })} type="date" className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekly Off *</label>
                  <select {...register("weekly_off")} className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white">
                    <option value="">Select day</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Sat, Sun">Sat, Sun</option>
                    <option value="Monday">Monday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekly Off for days *</label>
                  <input type="number" defaultValue="1" className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white" placeholder="Enter number" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client *</label>
                  <select {...register("client", { required: true })} className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white">
                    <option value="">Select client</option>
                    <option value="Acme Corp">Acme Corp</option>
                    <option value="Tata Communications">Tata Communications</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site *</label>
                  <select {...register("site", { required: true })} className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white">
                    <option value="">Select site</option>
                    <option value="Austin">Austin</option>
                    <option value="TCL BKC">TCL BKC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation *</label>
                  <select {...register("skill_desig", { required: true })} className="w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-teal-500 text-base py-2 px-1 bg-transparent dark:text-white">
                    <option value="">Select designation</option>
                    <option value="LS/G">LS/G</option>
                    <option value="Sr. Analyst">Sr. Analyst</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">App registered</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register("app_registered")} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                  </label>
                  {mode === 'add' && <span className="ml-3 text-xs text-gray-500">Off by default</span>}
                  {mode === 'edit' && initialData?.status === 'Active' && <span className="ml-3 text-xs text-teal-600">Active</span>}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 mr-4">* Required fields</span>
                  <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none">
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