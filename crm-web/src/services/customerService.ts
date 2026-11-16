import api from './api';
import { type Customer, type CustomerRequest, type FunnelStage } from '../types/crm';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const response = await api.get('/customers');
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.content)) {
      return data.content;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
},

  async create(data: CustomerRequest): Promise<Customer> {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  async update(id: number, data: CustomerRequest): Promise<Customer> {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  async updateFunnelStage(id: number, stageId: number): Promise<Customer> {
    const response = await api.patch<Customer>(`/customers/${id}/funnel-stage`, null, {
      params: { stageId },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
  },

  async getFunnelStages(): Promise<FunnelStage[]> {
    const response = await api.get<FunnelStage[]>('/funnel-stages');
    return Array.isArray(response.data) ? response.data : [];
  },


};