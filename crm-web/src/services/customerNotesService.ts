import api from './api';
import { type CustomerNote, type CustomerNoteRequest } from '../types/crm';

export const customerNoteService = {
    async getByCustomer(customerId: number): Promise<CustomerNote[]> {
        const response = await api.get(`/customer-notes/customer/${customerId}`);
        return Array.isArray(response.data) ? response.data : response.data.content || [];
    },

    async create(data: CustomerNoteRequest): Promise<CustomerNote> {
        const response = await api.post<CustomerNote>(`/customer-notes`, data);
        return response.data;
    },

    async update(id: number, data: CustomerNoteRequest): Promise<CustomerNote> {
        const response = await api.put<CustomerNote>(`/customer-notes/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/customer-notes/${id}`);
    },
};