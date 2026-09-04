import { useEffect, useState, useMemo } from 'react';
import { FilterBar } from './components/FilterBar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModal } from './components/modals/EmployeeModal';
import { ReleaseModal } from './components/modals/ReleaseModal';
import { getEmployees, createEmployee, updateEmployee, releaseEmployee } from './api';
import type { Employee, EmployeeFormData } from './types';
import { ThemeProvider } from './context/ThemeContext';

function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ client: '', branch: '', site: '', status: '' });
  
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
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
        const matchesSkill = (emp.skill_desig || '').toLowerCase().includes(query);
        const matchesClientDesig = (emp.client_desig || '').toLowerCase().includes(query);
        const matchesClient = (emp.client || '').toLowerCase().includes(query);
        const matchesBranch = (emp.branch || '').toLowerCase().includes(query);
        const matchesSite = (emp.site || '').toLowerCase().includes(query);

        if (!matchesName && !matchesCode && !matchesEmail && !matchesMobile && 
            !matchesSkill && !matchesClientDesig && !matchesClient && !matchesBranch && !matchesSite) {
          return false;
        }
      }

      // 2. Dropdown Filters
      if (filters.client && emp.client !== filters.client) return false;
      if (filters.branch && emp.branch !== filters.branch) return false;
      if (filters.site && emp.site !== filters.site) return false;
      if (filters.status && emp.status !== filters.status) return false;

      return true;
    });
  }, [employees, searchQuery, filters]);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleFilterChange = (name: string, value: string) => setFilters(prev => ({ ...prev, [name]: value }));
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
          skill_desig: data.skill_desig || 'Technician',
          client_desig: data.skill_desig || 'Client Technician',
          email: data.email,
          mobile: data.mobile,
          weekly_off: 'Sunday',
          joined_on: new Date().toISOString().split('T')[0],
          released_on: null,
          site_count: 1,
          on_board: 'Yes',
          attn_app: 'Yes',
          trainee_app: 'No'
        };
        await createEmployee(payload);
      } else if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, data);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-brand-dark shadow">
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
        />
        
        <EmployeeTable 
          data={filteredEmployees}
          onEdit={handleEditEmployee}
          onRelease={handleReleaseEmployee}
        />
      </main>

      <EmployeeModal 
        isOpen={isEmployeeModalOpen} 
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        initialData={selectedEmployee || undefined}
        mode={modalMode}
      />
      <ReleaseModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        onSubmit={handleReleaseSubmit}
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