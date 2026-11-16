export interface FunnelStage {
  id: number;
  name: string;
  stageOrder: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  originChannel?: string;
  funnelStage?: FunnelStage;
  funnelStageId?: number;
  assignedUserId?: number;
  createdAt?: string;
}

export interface CustomerRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  originChannel?: string;
  funnelStageId: number;
  assignedToUserId?: number;
}