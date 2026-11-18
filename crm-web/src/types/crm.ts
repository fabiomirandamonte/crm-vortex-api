export interface FunnelStage {
  id: number;
  name: string;
  stageOrder: number;
}

export interface FunnelStageRequest {
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
  assignedUserId?: number;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
  customer?: {
    id: number;
    name: string;
  };
  customerId?: number;
  customerName?: string;
  assignedUser?: {
    id: number;
    name?: string;
    email?: string;
  };
  createdAt?: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
  customerId: number;
  assignedUserId: number;
}