import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavBar';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { taskService } from '../../services/taskService';
import { customerService } from '../../services/customerService';
import {
  type Customer,
  type Task,
  type TaskPriority,
  type TaskRequest,
  type TaskStatus,
} from '../../types/crm';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{ id: number; title: string } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<TaskRequest>({
    title: '',
    description: '',
    dueDate: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    customerId: 0,
    assignedUserId: 1,
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, customersData] = await Promise.all([
        taskService.getAll(),
        customerService.getAll(),
      ]);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);

      if (customersData.length > 0 && !editingId) {
        setFormData((prev) => ({
          ...prev,
          customerId: prev.customerId || customersData[0].id,
        }));
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao carregar tarefas e clientes.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      customerId: customers[0]?.id || 0,
      assignedUserId: 1,
    });
  };

  const handleEditClick = (task: Task) => {
    setEditingId(task.id);
    const formattedDate = task.dueDate ? task.dueDate.slice(0, 16) : '';
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: formattedDate,
      status: task.status,
      priority: task.priority,
      customerId: task.customer?.id || task.customerId || customers[0]?.id || 0,
      assignedUserId: task.assignedUser?.id || 1,
    });
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', message: 'O título da tarefa é obrigatório.' });
      return;
    }
    if (!formData.customerId) {
      setFeedback({ type: 'error', message: 'Selecione um cliente vinculado.' });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      const payload: TaskRequest = {
        ...formData,
        assignedUserId: formData.assignedUserId || 1,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString().replace(/\.\d{3}Z$/, 'Z')
          : undefined,
      };

      if (editingId) {
        await taskService.update(editingId, payload);
        setFeedback({ type: 'success', message: 'Tarefa atualizada com sucesso!' });
      } else {
        await taskService.create(payload);
        setFeedback({ type: 'success', message: 'Tarefa criada com sucesso!' });
      }

      resetForm();
      await loadData();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.defaultMessage ||
        'Não foi possível salvar a tarefa. Verifique os campos e o prazo informado.';
      setFeedback({ type: 'error', message: apiMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      setIsDeleting(true);
      await taskService.delete(taskToDelete.id);
      setFeedback({ type: 'success', message: 'Tarefa excluída com sucesso.' });
      if (editingId === taskToDelete.id) resetForm();
      setTaskToDelete(null);
      await loadData();
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao excluir tarefa.' });
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELED':
        return 'bg-slate-200 text-slate-600 border-slate-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const isTaskOverdue = (task: Task): boolean => {
    if (!task.dueDate) return false;
    if (task.status === 'COMPLETED' || task.status === 'CANCELED') return false;
    return new Date(task.dueDate).getTime() < Date.now();
  };

  const filteredTasks = (Array.isArray(tasks) ? tasks : []).filter((task) => {
    const customerLabel =
      task.customer?.name ||
      task.customerName ||
      customers.find((c) => c.id === task.customerId)?.name ||
      '';

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customerLabel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1f5] font-sans">
      <TopNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              TASK MANAGEMENT
            </h1>
            <p className="text-xs text-slate-500">
              Gerencie atividades, prazos e prioridades vinculadas aos clientes
            </p>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded shadow-sm transition cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-5 p-3 rounded border flex items-center justify-between text-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Formulário Lateral */}
          <section className="lg:col-span-4 bg-white rounded-md shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {editingId ? `Editando Tarefa #${editingId}` : 'Registration & Editing'}
              </h2>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Enviar proposta comercial"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cliente Vinculado *
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) =>
                    setFormData({ ...formData, customerId: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800 bg-white"
                >
                  <option value={0} disabled>
                    Selecione um cliente...
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.companyName ? `(${c.companyName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as TaskPriority })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800 bg-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as TaskStatus })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800 bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Prazo (Due Date)
                </label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes ou observações da tarefa..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#24497a] hover:bg-[#1b365d] text-white font-semibold text-xs py-2.5 px-4 rounded shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'UPDATE' : 'SAVE'}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => setTaskToDelete({ id: editingId, title: formData.title })}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-3.5 rounded shadow-sm transition cursor-pointer"
                  >
                    DELETE
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Tabela e Filtros */}
          <section className="lg:col-span-8 bg-white rounded-md shadow-sm border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar tarefa ou cliente..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-700 bg-white"
              >
                <option value="ALL">Todos Status</option>
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELED">CANCELED</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-700 bg-white"
              >
                <option value="ALL">Todas Prioridades</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {isLoading ? (
              <div className="py-12 flex items-center justify-center text-slate-500 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando tarefas...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhuma tarefa encontrada.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                      <th className="py-2.5 px-3">Tarefa / Cliente</th>
                      <th className="py-2.5 px-3">Prazo</th>
                      <th className="py-2.5 px-3">Prioridade</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredTasks.map((task) => {
                      const customerName =
                        task.customer?.name ||
                        task.customerName ||
                        customers.find((c) => c.id === task.customerId)?.name ||
                        'Cliente não informado';

                      return (
                        <tr key={task.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800">{task.title}</div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                              <User className="w-3 h-3" />
                              <span>{customerName}</span>
                            </div>
                            {task.description && (
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </td>

                        <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                            {task.dueDate ? (
                              (() => {
                                const overdue = isTaskOverdue(task);
                                return (
                                  <div className="flex flex-col items-start gap-1">
                                    <span
                                      className={`inline-flex items-center gap-1 font-medium ${
                                        overdue ? 'text-red-600' : 'text-slate-600'
                                      }`}
                                    >
                                      {overdue ? (
                                        <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
                                      ) : (
                                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                      )}
                                      {new Date(task.dueDate).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>

                                    {overdue && (
                                      <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 rounded">
                                        Atrasada
                                      </span>
                                    )}
                                  </div>
                                );
                              })()
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getPriorityBadge(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getStatusBadge(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(task)}
                                title="Editar"
                                className="p-1.5 text-slate-500 hover:text-[#24497a] hover:bg-blue-50 rounded transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setTaskToDelete({ id: task.id, title: task.title })}
                                title="Excluir"
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Confirmar Exclusão"
        description={`Deseja realmente excluir a tarefa "${taskToDelete?.title}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};