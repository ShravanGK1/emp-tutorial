export interface Employee {
  id: number;
  emp_code: string;
  client: string;
  branch: string;
  site: string;
  name: string;
  gender: string;
  status: string;
  designation: string;
  client_desig: string;
  email: string;
  mobile: string;
  weekly_off: string;
  joined_on: string;
  released_on: string | null;
  release_reason?: string | null;
  remarks?: string | null;
  site_count: number;
  on_board: string;
  attn_app: string;
  trainee_app: string;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'site_count' | 'attn_app' | 'trainee_app'> & {
  app_registered?: boolean;
  status?: string;
  on_board?: string;
  released_on?: string | null;
};
