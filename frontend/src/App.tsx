import { useEffect, useState } from 'react';
import { FilterBar } from './components/FilterBar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModal } from './components/modals/EmployeeModal';
import { ReleaseModal } from './components/modals/ReleaseModal';
import { getEmployees, createEmployee, updateEmployee, releaseEmployee } from './api';
import type { Employee, EmployeeFormData } from './types';
import { ThemeProvider } from './context/ThemeContext';

function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ client: '', branch: '', site: '', status: '' });
  
  // Modal states
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const applyFilters = (query: string, currentFilters: typeof filters, data: Employee[]) => {
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(lowerQuery) ||
                          emp.emp_code.toLowerCase().includes(lowerQuery) ||
                          emp.email.toLowerCase().includes(lowerQuery);
      const matchClient = currentFilters.client ? emp.client === currentFilters.client : true;
      const matchBranch = currentFilters.branch ? emp.branch === currentFilters.branch : true;
      const matchSite = currentFilters.site ? emp.site === currentFilters.site : true;
      const matchStatus = currentFilters.status ? emp.status === currentFilters.status : true;
      
      return matchSearch && matchClient && matchBranch && matchSite && matchStatus;
    });
    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    applyFilters(searchQuery, filters, employees);
  }, [searchQuery, filters, employees]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
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
          ...data,
          status: 'Active', // Default
          branch: 'West', // Default since form doesn't capture
          client_desig: data.skill_desig, // Fallback
          site_count: 1, // Default mock
          on_board: 'Yes',
          attn_app: data.app_registered ? 'Yes' : 'No',
          trainee_app: 'No'
        };
        await createEmployee(payload);
      } else if (selectedEmployee) {
        const payload = {
          ...selectedEmployee,
          ...data,
          branch: selectedEmployee.branch || 'West',
          client_desig: data.skill_desig,
          attn_app: data.app_registered ? 'Yes' : 'No',
        };
        await updateEmployee(selectedEmployee.id, payload);
      }
      setIsEmployeeModalOpen(false);
      fetchEmployees(); // Refresh list
    } catch (error) {
      console.error("Error saving employee", error);
    }
  };

  const handleReleaseSubmit = async (data: { releaseDate: string, reason: string, remarks: string }) => {
    try {
      if (selectedEmployee) {
        await releaseEmployee(selectedEmployee.id, data.releaseDate, data.reason, data.remarks);
        setIsReleaseModalOpen(false);
        fetchEmployees(); // Refresh list
      }
    } catch (error) {
      console.error("Error releasing employee", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Header */}
      <header className="bg-brand-dark shadow">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-white flex items-center gap-4">
              Employees 
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-normal">
                {employees.length} records
              </span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar 
          onAdd={handleAddEmployee}
          onRefresh={fetchEmployees}
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

      {/* Modals */}
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
