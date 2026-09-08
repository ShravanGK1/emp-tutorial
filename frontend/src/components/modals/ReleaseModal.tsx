import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Employee } from '../../types';

interface ReleaseFormData {
  releaseDate: string;
  reason: string;
  remarks: string;
}

interface ReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { releaseDate: string; reason: string; remarks: string }) => void;
  employee: Employee | null;
}

export function ReleaseModal({ isOpen, onClose, onSubmit, employee }: ReleaseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReleaseFormData>({
    defaultValues: {
      releaseDate: '',
      reason: '',
      remarks: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        releaseDate: '',
        reason: '',
        remarks: ''
      });
    }
  }, [isOpen, reset]);

  if (!employee) return null;

  const onFormSubmit = (data: ReleaseFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-lg rounded-xl bg-[#111a2e] text-slate-200 shadow-2xl overflow-hidden border border-slate-700/80 transition-all">
          
          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">PEOPLE</p>
              <Dialog.Title className="text-xl font-bold text-white">Release Employee</Dialog.Title>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer mt-1"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="px-6 pb-6 space-y-4">
            
            {/* Warning Notice Banner */}
            <div className="bg-[#2a141a] border border-red-900/50 rounded-lg p-3 flex items-start gap-2.5">
              <span className="text-red-400 font-bold text-sm leading-none mt-0.5">!</span>
              <p className="text-xs text-red-400/95 leading-relaxed">
                Releasing an employee changes their status and removes them from active records.
              </p>
            </div>

            {/* Read-Only Employee Information Box */}
            <div className="bg-[#1b263b] rounded-lg border border-slate-700/80 p-4 space-y-2.5">
              <div className="pb-2 border-b border-slate-700/80">
                <h4 className="text-sm font-bold text-white">Employee Information</h4>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-400">Name: </span>
                  <span className="font-bold text-white">{employee.name || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-400">Employee Code: </span>
                  <span className="font-bold text-white">{employee.emp_code || '—'}</span>
                </div>

                {employee.client && (
                  <div>
                    <span className="text-slate-400">Client: </span>
                    <span className="font-bold text-white">{employee.client}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400">Site: </span>
                  <span className="font-bold text-white">{employee.site || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-400">Designation: </span>
                  <span className="font-bold text-white">{employee.designation || '—'}</span>
                </div>
              </div>
            </div>

            {/* Release Details Section */}
            <div className="space-y-3.5 pt-1">
              <h4 className="text-sm font-bold text-white">Release Details</h4>

              {/* Release Date (Mandatory) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Release Date <span className="text-slate-200 font-bold">*</span>
                </label>
                <input
                  type="date"
                  placeholder="dd-mm-yyyy"
                  {...register('releaseDate', { required: 'Release date is required' })}
                  className={`w-full rounded-lg border bg-[#1b263b] px-3 py-2 text-sm text-white placeholder-slate-400 shadow-2xs transition focus:outline-none focus:border-blue-500 ${
                    errors.releaseDate ? 'border-red-500 focus:border-red-500' : 'border-slate-600/70'
                  }`}
                />
                {errors.releaseDate && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.releaseDate.message}</p>
                )}
              </div>

              {/* Release Reason (Mandatory) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Release Reason <span className="text-slate-200 font-bold">*</span>
                </label>
                <select
                  {...register('reason', { required: 'Please select a release reason' })}
                  className={`w-full rounded-lg border bg-[#1b263b] px-3 py-2 text-sm text-white shadow-2xs transition focus:outline-none focus:border-blue-500 cursor-pointer ${
                    errors.reason ? 'border-red-500 focus:border-red-500' : 'border-slate-600/70'
                  }`}
                >
                  <option value="" className="bg-[#1b263b] text-slate-400">
                    Select reason
                  </option>
                  <option value="Resigned" className="bg-[#1b263b] text-white">Resigned</option>
                  <option value="Terminated" className="bg-[#1b263b] text-white">Terminated</option>
                  <option value="Contract Ended" className="bg-[#1b263b] text-white">Contract Ended</option>
                  <option value="Career Break" className="bg-[#1b263b] text-white">Career Break</option>
                  <option value="Relocation" className="bg-[#1b263b] text-white">Relocation</option>
                  <option value="Retirement" className="bg-[#1b263b] text-white">Retirement</option>
                  <option value="Other" className="bg-[#1b263b] text-white">Other</option>
                </select>
                {errors.reason && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.reason.message}</p>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Remarks
                </label>
                <textarea
                  {...register('remarks')}
                  rows={3}
                  placeholder="Enter remarks..."
                  className="w-full rounded-lg border border-slate-600/70 bg-[#1b263b] px-3 py-2 text-sm text-white placeholder-slate-400 shadow-2xs focus:border-blue-500 focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/80 mt-6">
              <span className="text-xs text-slate-400">Review from employee history</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#1b263b] hover:bg-slate-700 text-slate-200 border border-slate-600/70 text-sm font-semibold rounded-md transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-xs transition cursor-pointer"
                >
                  Release
                </button>
              </div>
            </div>

          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
