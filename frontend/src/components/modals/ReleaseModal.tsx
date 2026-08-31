import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import type { Employee } from '../../types';

interface ReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { releaseDate: string, reason: string, remarks: string }) => void;
  employee: Employee | null;
}

export function ReleaseModal({ isOpen, onClose, onSubmit, employee }: ReleaseModalProps) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
          
          <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">People</p>
              <Dialog.Title className="text-xl font-medium">Release Employee</Dialog.Title>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Release an existing employee from active records</span>
              <div className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold">RELEASE</div>
            </div>
          </div>

          <form onSubmit={handleSubmit((data: any) => onSubmit(data))} className="p-8">
            <div className="border border-blue-400 dark:border-blue-600 rounded-lg p-6 relative bg-white dark:bg-slate-800">
              
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md flex items-center mb-6">
                <span className="font-bold mr-2">!</span> Releasing an employee changes their status and removes them from active records.
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Employee details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
                  <input disabled value={employee.name} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm bg-gray-50 dark:bg-slate-700 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Code</label>
                  <input disabled value={employee.emp_code} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm bg-gray-50 dark:bg-slate-700 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                  <input disabled value={employee.client} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm bg-gray-50 dark:bg-slate-700 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site</label>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-2">{employee.site}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation</label>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-2">{employee.skill_desig}</div>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Release details</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Release Date *</label>
                  <input {...register("releaseDate", { required: true })} type="date" className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Release Reason *</label>
                  <select {...register("reason", { required: true })} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white">
                    <option value="">Select reason</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Contract Ended">Contract Ended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks</label>
                  <textarea {...register("remarks")} className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-white" placeholder="Enter remarks..." rows={2}></textarea>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">This action can be reviewed from employee history.</span>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={onClose} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Release Employee
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
