import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  CheckSquare,
  AlertTriangle,
  Loader2,
  AlertCircle,
  ArrowRight,
  Calendar,
  GitBranch,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavBar';
import { customerService } from '../../services/customerService';
import { funnelStageService } from '../../services/funnelStageService';
import { taskService } from '../../services/taskService';
import { type Customer, type FunnelStage, type Task } from '../../types/crm';

export const DashboardPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const [customersData, stagesData, tasksData] = await Promise.all([
          customerService.getAll(),
          funnelStageService.getAll(),
          taskService.getAll(),
        ]);
        setCustomers(customersData);
        setStages(stagesData);
        setTasks(tasksData);
      } catch {
        setErrorMessage('Não foi possível carregar os indicadores do dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Cálculos de Indicadores (KPIs)
  const totalCustomers = customers.length;

  const wonStage = stages.find(
    (s) =>
      s.name.toLowerCase().includes('ganho') ||
      s.name.toLowerCase().includes('fechado') ||
      s.name.toLowerCase().includes('won')
  );

  const wonCustomersCount = wonStage
    ? customers.filter((c) => (c.funnelStage?.id || c.funnelStageId) === wonStage.id).length
    : 0;

  const conversionRate =
    totalCustomers > 0 ? Math.round((wonCustomersCount / totalCustomers) * 100) : 0;

  const openTasks = tasks.filter(
    (t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS'
  );

  const now = new Date();
  const overdueTasks = openTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now
  );

  const upcomingTasks = [...openTasks]
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1f5] font-sans">
      <TopNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              DASHBOARD DE INDICADORES
            </h1>
            <p className="text-xs text-slate-500">
              Visão executiva consolidada do funil de vendas, clientes e atividades
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded border bg-red-50 border-red-200 text-red-700 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Consolidando métricas do CRM...</span>
          </div>
        ) : (
          <>
            {/* Cards de KPIs */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Total de Clientes
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{totalCustomers}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Contatos ativos na base</p>
                </div>
                <div className="bg-blue-50 text-[#1b365d] p-3 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Taxa de Conversão
                  </p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">{conversionRate}%</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {wonCustomersCount} negócio(s) ganho(s)
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Tarefas em Aberto
                  </p>
                  <p className="text-2xl font-bold text-[#24497a] mt-1">{openTasks.length}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    De {tasks.length} tarefa(s) total
                  </p>
                </div>
                <div className="bg-indigo-50 text-[#24497a] p-3 rounded-lg">
                  <CheckSquare className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Tarefas em Atraso
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      overdueTasks.length > 0 ? 'text-red-600' : 'text-slate-800'
                    }`}
                  >
                    {overdueTasks.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Prazos expirados</p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    overdueTasks.length > 0
                      ? 'bg-red-50 text-red-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </section>

            {/* Grid Inferior: Distribuição do Funil + Próximas Tarefas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Distribuição por Etapa do Funil */}
              <section className="lg:col-span-7 bg-white rounded-md shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#1b365d]" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Distribuição de Clientes por Etapa
                    </h2>
                  </div>
                  <Link
                    to="/funnel-stages"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#24497a] hover:underline"
                  >
                    <span>Ver Kanban</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {stages.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">
                    Nenhum estágio configurado no funil.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stages.map((stage) => {
                      const count = customers.filter(
                        (c) => (c.funnelStage?.id || c.funnelStageId) === stage.id
                      ).length;
                      const percentage =
                        totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;

                      return (
                        <div key={stage.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">
                              {stage.stageOrder}. {stage.name}
                            </span>
                            <span className="text-slate-500 font-medium">
                              {count} cliente(s) ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#24497a] rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Próximas Tarefas Prioritárias */}
              <section className="lg:col-span-5 bg-white rounded-md shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#1b365d]" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Próximas Tarefas Pendentes
                    </h2>
                  </div>
                  <Link
                    to="/tasks"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#24497a] hover:underline"
                  >
                    <span>Gerenciar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {upcomingTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">
                    Nenhuma tarefa pendente no momento.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {upcomingTasks.map((task) => {
                      const isOverdue = task.dueDate && new Date(task.dueDate) < now;
                      const customerName =
                        task.customer?.name ||
                        task.customerName ||
                        customers.find((c) => c.id === task.customerId)?.name ||
                        'Cliente';

                      return (
                        <li key={task.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {task.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {customerName}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded border ${
                                task.priority === 'HIGH'
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : task.priority === 'MEDIUM'
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {task.dueDate && (
                            <div
                              className={`mt-1.5 inline-flex items-center gap-1 text-[11px] ${
                                isOverdue ? 'text-red-600 font-semibold' : 'text-slate-400'
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(task.dueDate).toLocaleString('pt-BR', {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                })}
                                {isOverdue ? ' (Atrasada)' : ''}
                              </span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};