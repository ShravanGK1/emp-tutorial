import { Dialog } from '@headlessui/react';
import type { Employee } from '../../types';
import { UserCheck, X } from 'lucide-react';

interface ReonboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employee: Employee | null;
}

export function ReonboardModal({ isOpen, onClose, onConfirm, employee }: ReonboardModalProps) {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">People Management</p>
                <Dialog.Title className="text-lg font-semibold">On-board Employee</Dialog.Title>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Do you want to add this employee?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                This will re-onboard the employee and make their profile active again across the platform.
              </p>
            </div>

            {/* Employee Preview Card */}
            <div className="bg-gray-50 dark:bg-slate-700/60 rounded-lg p-4 border border-gray-200 dark:border-gray-600 mb-6 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Employee Name:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{employee.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Employee Code:</span>
                <span className="font-mono font-medium text-gray-900 dark:text-white">{employee.emp_code}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Client / Site:</span>
                <span className="text-gray-900 dark:text-white">{employee.client} - {employee.site}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Designation:</span>
                <span className="text-gray-900 dark:text-white">{employee.designation}</span>
              </div>
              {employee.released_on && (
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-amber-600 dark:text-amber-400">Released On:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{employee.released_on}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-xs text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-hidden cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-2 border border-transparent shadow-xs text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden cursor-pointer"
              >
                Yes, Add Employee
              </button>
            </div>
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
