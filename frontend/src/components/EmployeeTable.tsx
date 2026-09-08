import { useState, useMemo, useEffect } from 'react';
import type { Employee } from '../types';
import { ArrowUpDown, Edit, UserMinus, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface EmployeeTableProps {
  data: Employee[];
  onEdit: (emp: Employee) => void;
  onRelease: (emp: Employee) => void;
  onReonboard?: (emp: Employee) => void;
}

type SortConfig = { key: keyof Employee | null; direction: 'asc' | 'desc' };

export function EmployeeTable({ data, onEdit, onRelease, onReonboard }: EmployeeTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Reset to page 1 when filtered dataset changes or shrinks
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      const key = sortConfig.key;
      sortableItems.sort((a, b) => {
        const valA = a[key] ?? '';
        const valB = b[key] ?? '';
        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return sortedData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, sortedData]);

  const requestSort = (key: keyof Employee) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const columns = [
    { label: 'oid', key: 'id', sortable: false },
    { label: 'Client', key: 'client', sortable: true },
    { label: 'Branch', key: 'branch', sortable: true },
    { label: 'Site', key: 'site', sortable: true },
    { label: 'Emp Code', key: 'emp_code', sortable: true },
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Gender', key: 'gender', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
    { label: 'Designation', key: 'designation', sortable: true },
    { label: 'Client Desig', key: 'client_desig', sortable: true },
    { label: 'Email', key: 'email', sortable: false },
    { label: 'Mobile', key: 'mobile', sortable: false },
    { label: 'Weekly Off', key: 'weekly_off', sortable: true },
    { label: 'Joined On', key: 'joined_on', sortable: true },
    { label: 'Released On', key: 'released_on', sortable: true },
    { label: 'On Board', key: 'on_board', sortable: true },
    { label: 'Attn App', key: 'attn_app', sortable: true },
    { label: 'Trainee App', key: 'trainee_app', sortable: true },
  ];

  const renderSortIcon = (sortable?: boolean) => {
    if (!sortable) return null;
    return <ArrowUpDown className="ml-1 h-3 w-3 inline text-gray-400" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto relative">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  className={clsx(
                    "px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap",
                    col.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600" : ""
                  )}
                  onClick={() => col.sortable && requestSort(col.key as keyof Employee)}
                >
                  {col.label} {renderSortIcon(col.sortable)}
                </th>
              ))}
              {/* Sticky Action Column Header */}
              <th 
                scope="col" 
                className="sticky right-0 bg-gray-50 dark:bg-slate-700 px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)] dark:shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.4)] z-20"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((emp, idx) => (
              <tr key={emp.id} className="group hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{(currentPage - 1) * itemsPerPage + idx + 1 < 10 ? `0${(currentPage - 1) * itemsPerPage + idx + 1}` : (currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.client}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.branch}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.site}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{emp.emp_code}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{emp.name}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.gender}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <span className={clsx(
                    "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                    emp.status === 'Active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  )}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.designation}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.client_desig}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.email}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.mobile}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.weekly_off}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.joined_on}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.released_on || '—'}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <span className={clsx(
                    "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                    (emp.status !== 'Inactive' && !emp.released_on && (emp.on_board === 'Active' || emp.on_board === 'Yes'))
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  )}>
                    {(emp.status !== 'Inactive' && !emp.released_on && (emp.on_board === 'Active' || emp.on_board === 'Yes')) ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">{emp.attn_app}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-gray-500 dark:text-gray-400">{emp.trainee_app}</td>

                {/* Sticky Action Column Body Cell */}
                <td className="sticky right-0 bg-white dark:bg-slate-800 group-hover:bg-gray-50 dark:group-hover:bg-slate-700 px-4 py-4 whitespace-nowrap text-center text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)] dark:shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.4)] z-10">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => onEdit(emp)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    {emp.status === 'Active' ? (
                      <button onClick={() => onRelease(emp)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer" title="Release">
                        <UserMinus className="h-4 w-4" />
                      </button>
                    ) : (
                      onReonboard && (
                        <button onClick={() => onReonboard(emp)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer" title="Re-onboard Employee">
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="font-medium">{data.length}</span> records
            </p>
          </div>
          <div className="flex items-center gap-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 cursor-pointer"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-sm font-medium text-blue-600 dark:text-blue-400">
                {currentPage}
              </button>
              {currentPage < Math.ceil(data.length / itemsPerPage) && (
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer"
                >
                  {currentPage + 1}
                </button>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / itemsPerPage)))}
                disabled={currentPage >= Math.ceil(data.length / itemsPerPage)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 cursor-pointer"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
