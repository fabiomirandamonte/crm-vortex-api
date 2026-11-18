import api from './api';
import { type SystemUser, type SystemUserRequest } from '../types/crm';

export const userService = {
  async getAll(): Promise<SystemUser[]> {
    const response = await api.get<SystemUser[]>('/users');
    return response.data;
  },

  async create(data: SystemUserRequest): Promise<SystemUser> {
    const response = await api.post<SystemUser>('/users', data);
    return response.data;
  },

  async update(id: number, data: SystemUserRequest): Promise<SystemUser> {
    const response = await api.put<SystemUser>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};