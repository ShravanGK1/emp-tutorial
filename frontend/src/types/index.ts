export interface Employee {
  id: number;
  emp_code: string;
  client: string;
  branch: string;
  site: string;
  name: string;
  gender: string;
  status: string;
  skill_desig: string;
  client_desig: string;
  email: string;
  mobile: string;
  weekly_off: string;
  joined_on: string;
  released_on: string | null;
  site_count: number;
  on_board: string;
  attn_app: string;
  trainee_app: string;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'released_on' | 'site_count' | 'on_board' | 'attn_app' | 'trainee_app' | 'status'> & {
  app_registered: boolean;
};
