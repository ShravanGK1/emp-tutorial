import axios from 'axios';
import type { Employee } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/api';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get(`${API_URL}/employees`);
  return response.data;
};

export const createEmployee = async (data: any): Promise<Employee> => {
  const response = await axios.post(`${API_URL}/employees`, data);
  return response.data;
};

export const updateEmployee = async (id: number, data: any): Promise<Employee> => {
  const response = await axios.put(`${API_URL}/employees/${id}`, data);
  return response.data;
};

export const releaseEmployee = async (id: number, releaseDate: string, reason: string, remarks: string): Promise<Employee> => {
  const response = await axios.post(`${API_URL}/employees/${id}/release`, {
    release_date: releaseDate,
    release_reason: reason,
    remarks,
  });
  return response.data;
};

export const reonboardEmployee = async (id: number): Promise<Employee> => {
  const response = await axios.post(`${API_URL}/employees/${id}/re-onboard`);
  return response.data;
};
