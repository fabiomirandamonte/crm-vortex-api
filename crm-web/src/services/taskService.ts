import api from './api';
import { type Task, type TaskRequest } from '../types/crm';


export const taskService = {
    async getAll(): Promise<Task[]> {
        const response = await api.get('/tasks');
        const data = response.data;

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.content)) return data.content;
        if (Array.isArray(data?.data)) return data.data;
        return [];
  },

  async create(data: TaskRequest): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async update(id: number, data: TaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

