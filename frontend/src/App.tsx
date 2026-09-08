import { useEffect, useState, useMemo } from 'react';
import { FilterBar } from './components/FilterBar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModal } from './components/modals/EmployeeModal';
import { ReleaseModal } from './components/modals/ReleaseModal';
import { ReonboardModal } from './components/modals/ReonboardModal';
import { getEmployees, createEmployee, updateEmployee, releaseEmployee, reonboardEmployee } from './api';
import type { Employee, EmployeeFormData } from './types';
import { ThemeProvider } from './context/ThemeContext';

function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ client: '', branch: '', site: '', status: '' });
  
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isReonboardModalOpen, setIsReonboardModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      console.log("App received employees count:", data.length);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- Dynamic Dependent Dropdown Options ---
  // 1. Available Clients (from all employees)
  const clientOptions = useMemo(() => {
    const clients = Array.from(new Set(employees.map(e => e.client).filter(Boolean))).sort();
    return [{ label: "All Clients", value: "" }, ...clients.map(c => ({ label: c, value: c }))];
  }, [employees]);

  // 2. Available Branches (scoped to selected client if one is selected)
  const branchOptions = useMemo(() => {
    let list = employees;
    if (filters.client) {
      list = list.filter(e => e.client === filters.client);
    }
    const branches = Array.from(new Set(list.map(e => e.branch).filter(Boolean))).sort();
    return [{ label: "All Branches", value: "" }, ...branches.map(b => ({ label: b, value: b }))];
  }, [employees, filters.client]);

  // 3. Available Sites (scoped to selected client AND branch)
  const siteOptions = useMemo(() => {
    let list = employees;
    if (filters.client) {
      list = list.filter(e => e.client === filters.client);
    }
    if (filters.branch) {
      list = list.filter(e => e.branch === filters.branch);
    }
    const sites = Array.from(new Set(list.map(e => e.site).filter(Boolean))).sort();
    return [{ label: "All Sites", value: "" }, ...sites.map(s => ({ label: s, value: s }))];
  }, [employees, filters.client, filters.branch]);

  // 4. Available Status Options (scoped to selected client, branch, and site)
  const statusOptions = useMemo(() => {
    let list = employees;
    if (filters.client) list = list.filter(e => e.client === filters.client);
    if (filters.branch) list = list.filter(e => e.branch === filters.branch);
    if (filters.site) list = list.filter(e => e.site === filters.site);

    const hasActive = list.some(e => e.status === 'Active');
    const hasInactive = list.some(e => e.status === 'Inactive');

    const opts = [{ label: "All Status", value: "" }];
    if (hasActive) opts.push({ label: "Active", value: "Active" });
    if (hasInactive) opts.push({ label: "Inactive", value: "Inactive" });
    return opts;
  }, [employees, filters.client, filters.branch, filters.site]);

  // Filtered employees calculation based on search query and dropdown filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // 1. Search Query Filter (Searches Name, Emp Code, Mobile, Email, Designation)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (emp.name || '').toLowerCase().includes(query);
        const matchesCode = (emp.emp_code || '').toLowerCase().includes(query);
        const matchesEmail = (emp.email || '').toLowerCase().includes(query);
        const matchesMobile = (emp.mobile || '').toLowerCase().includes(query);
        const matchesSkill = (emp.designation || '').toLowerCase().includes(query);
        const matchesClientDesig = (emp.client_desig || '').toLowerCase().includes(query);
        const matchesClient = (emp.client || '').toLowerCase().includes(query);
        const matchesBranch = (emp.branch || '').toLowerCase().includes(query);
        const matchesSite = (emp.site || '').toLowerCase().includes(query);

        if (!matchesName && !matchesCode && !matchesEmail && !matchesMobile && 
            !matchesSkill && !matchesClientDesig && !matchesClient && !matchesBranch && !matchesSite) {
          return false;
        }
      }

      // 2. Cascading Dropdown Filters
      if (filters.client && emp.client !== filters.client) return false;
      if (filters.branch && emp.branch !== filters.branch) return false;
      if (filters.site && emp.site !== filters.site) return false;
      if (filters.status && emp.status !== filters.status) return false;

      return true;
    });
  }, [employees, searchQuery, filters]);

  const handleSearch = (query: string) => setSearchQuery(query);

  // Cascading filter change with auto-reset for dependent child filters
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => {
      const updated = { ...prev, [name]: value };

      if (name === 'client') {
        // Check if currently selected branch exists in newly selected client
        const validBranches = employees
          .filter(e => !value || e.client === value)
          .map(e => e.branch);
        if (updated.branch && !validBranches.includes(updated.branch)) {
          updated.branch = '';
        }

        // Check if currently selected site exists in newly selected client
        const validSites = employees
          .filter(e => !value || e.client === value)
          .map(e => e.site);
        if (updated.site && !validSites.includes(updated.site)) {
          updated.site = '';
        }
      } else if (name === 'branch') {
        // Check if currently selected site exists in newly selected branch
        const validSites = employees
          .filter(e => (!updated.client || e.client === updated.client) && (!value || e.branch === value))
          .map(e => e.site);
        if (updated.site && !validSites.includes(updated.site)) {
          updated.site = '';
        }
      }

      return updated;
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ client: '', branch: '', site: '', status: '' });
  };

  const handleAddEmployee = () => {
    setModalMode('add');
    setSelectedEmployee(null);
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setModalMode('edit');
    setSelectedEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleReleaseEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsReleaseModalOpen(true);
  };

  const handleEmployeeSubmit = async (data: EmployeeFormData) => {
    try {
      if (modalMode === 'add') {
        const payload = {
          emp_code: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          client: data.client || 'Acme Corp',
          branch: 'West',
          site: data.site || 'Austin',
          name: data.name,
          gender: data.gender || 'Male',
          status: 'Active',
          designation: data.designation || 'Technician',
          client_desig: data.designation || 'Client Technician',
          email: data.email,
          mobile: data.mobile,
          weekly_off: data.weekly_off || 'Sunday',
          joined_on: data.joined_on || new Date().toISOString().split('T')[0],
          released_on: null,
          site_count: 1,
          on_board: 'Active',
          attn_app: 'Yes',
          trainee_app: 'No'
        };
        await createEmployee(payload);
      } else if (selectedEmployee) {
        const isReactivating = data.status === 'Active' || data.on_board === 'Active';
        const payload = {
          ...selectedEmployee,
          ...data,
          status: data.status || selectedEmployee.status,
          on_board: isReactivating ? 'Active' : (data.on_board || selectedEmployee.on_board),
          released_on: isReactivating ? null : selectedEmployee.released_on,
          release_reason: isReactivating ? null : selectedEmployee.release_reason,
          remarks: isReactivating ? null : selectedEmployee.remarks
        };
        await updateEmployee(selectedEmployee.id, payload);
      }
      setIsEmployeeModalOpen(false);
      await fetchEmployees();
    } catch (error) {
      console.error("Error saving employee", error);
    }
  };

  const handleReleaseSubmit = async (data: { releaseDate: string, reason: string, remarks: string }) => {
    try {
      if (selectedEmployee) {
        await releaseEmployee(selectedEmployee.id, data.releaseDate, data.reason, data.remarks);
        setIsReleaseModalOpen(false);
        await fetchEmployees();
      }
    } catch (error) {
      console.error("Error releasing employee", error);
    }
  };

  const handleReonboardEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsReonboardModalOpen(true);
  };

  const handleConfirmReonboard = async () => {
    try {
      if (selectedEmployee) {
        await reonboardEmployee(selectedEmployee.id);
        setIsReonboardModalOpen(false);
        await fetchEmployees();
      }
    } catch (error) {
      console.error("Error re-onboarding employee", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200">
      <header className="sticky top-0 z-30 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md shadow-md transition-colors border-b border-slate-800/80">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-white flex items-center gap-4">
              Employees 
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-normal">
                {filteredEmployees.length} of {employees.length} records
              </span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar 
          onAdd={handleAddEmployee}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onClear={handleClearFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          clientOptions={clientOptions}
          branchOptions={branchOptions}
          siteOptions={siteOptions}
          statusOptions={statusOptions}
        />
        
        <EmployeeTable 
          data={filteredEmployees}
          onEdit={handleEditEmployee}
          onRelease={handleReleaseEmployee}
          onReonboard={handleReonboardEmployee}
        />
      </main>

      <EmployeeModal 
        isOpen={isEmployeeModalOpen} 
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        initialData={selectedEmployee || undefined}
        mode={modalMode}
        employees={employees}
      />
      <ReleaseModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        onSubmit={handleReleaseSubmit}
        employee={selectedEmployee}
      />
      <ReonboardModal
        isOpen={isReonboardModalOpen}
        onClose={() => setIsReonboardModalOpen(false)}
        onConfirm={handleConfirmReonboard}
        employee={selectedEmployee}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}