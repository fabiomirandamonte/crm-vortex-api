import api from './api';
import { type FunnelStage, type FunnelStageRequest } from '../types/crm';

export const funnelStageService = {
  async getAll(): Promise<FunnelStage[]> {
    const response = await api.get<FunnelStage[]>('/funnel-stages');
    return response.data.sort((a, b) => a.stageOrder - b.stageOrder);
  },

  async create(data: FunnelStageRequest): Promise<FunnelStage> {
    const response = await api.post<FunnelStage>('/funnel-stages', data);
    return response.data;
  },

  async update(id: number, data: FunnelStageRequest): Promise<FunnelStage> {
    const response = await api.put<FunnelStage>(`/funnel-stages/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/funnel-stages/${id}`);
  },
};