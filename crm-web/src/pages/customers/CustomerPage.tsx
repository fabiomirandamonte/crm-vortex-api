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
} from 'lucide-react';

import { TopNavbar } from '../../components/layout/TopNavBar';
import { customerService } from '../../services/customerService';
import { type Customer, type CustomerRequest, type FunnelStage } from '../../types/crm';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatingStageId, setUpdatingStageId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CustomerRequest>({
    name: '',
    email: '',
    phone: '',
    company: '',
    originChannel: 'Website',
    funnelStageId: 1,
    assignedToUserId: 1,
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [customersData, stagesData] = await Promise.all([
        customerService.getAll(),
        customerService.getFunnelStages(),
      ]);
      setCustomers(customersData);
      setStages(stagesData);

      if (stagesData.length > 0 && !editingId) {
        setFormData((prev) => ({ ...prev, funnelStageId: stagesData[0].id }));
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao carregar clientes e estágios do funil.' });
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
      name: '',
      email: '',
      phone: '',
      company: '',
      originChannel: 'Website',
      funnelStageId: stages[0]?.id || 1,
      assignedToUserId: 1,
    });
  };

  const handleEditClick = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.companyName || '',
      originChannel: customer.originChannel || 'Website',
      funnelStageId: customer.funnelStage?.id || customer.funnelStageId || stages[0]?.id || 1,
      assignedToUserId: customer.assignedUserId || 1,
    });
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFeedback({
        type: 'error',
        message: 'Nome, e-mail e telefone são obrigatórios.',
      });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      if (editingId) {
        await customerService.update(editingId, formData);
        setFeedback({ type: 'success', message: 'Cliente atualizado com sucesso!' });
      } else {
        await customerService.create(formData);
        setFeedback({ type: 'success', message: 'Cliente cadastrado com sucesso!' });
      }

      resetForm();
      await loadData();
    } catch {
      setFeedback({ type: 'error', message: 'Não foi possível salvar os dados do cliente.' });
    } finally {
      setIsSaving(false);
    }
  };

const handleStageChange = async (customerId: number, newStageId: number) => {
    try {
      setUpdatingStageId(customerId);
      const updatedCustomer = await customerService.updateFunnelStage(customerId, newStageId);

      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? updatedCustomer : c))
      );
      setFeedback({ type: 'success', message: 'Estágio do funil atualizado!' });
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao mover cliente de estágio.' });
    } finally {
      setUpdatingStageId(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Deseja realmente excluir o cliente "${name}"?`)) return;

    try {
      await customerService.delete(id);
      setFeedback({ type: 'success', message: 'Cliente removido com sucesso.' });
      if (editingId === id) resetForm();
      await loadData();
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao excluir cliente. Verifique vínculos ativos.' });
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesText =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const currentStageId = c.funnelStage?.id || c.funnelStageId;
    const matchesStage =
      stageFilter === 'ALL' || String(currentStageId) === stageFilter;

    return matchesText && matchesStage;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1f5] font-sans">
      <TopNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              GESTÃO DE CLIENTES
            </h1>
            <p className="text-xs text-slate-500">
              Gerencie cadastros, pesquise contatos e atualize etapas do pipeline
            </p>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded shadow-sm transition cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cadastro</span>
            </button>
          )}
        </div>

        {/* Alertas de Feedback */}
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

        {/* Grid Principal: Formulário à Esquerda + Tabela/Pesquisa à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Esquerda: Cadastro & Edição */}
          <section className="lg:col-span-4 bg-white rounded-md shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {editingId ? `Editando Cliente #${editingId}` : 'Cadastrar & Editar'}
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
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Nine Fingers"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  E-mail
                </label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="cliente@empresa.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                  />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Telefone
                  </label>
                  <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="83988882666"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                    />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Empresa XP"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Estágio do Funil
                </label>
                <select
                  value={formData.funnelStageId}
                  onChange={(e) =>
                    setFormData({ ...formData, funnelStageId: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800 bg-white"
                >
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#24497a] hover:bg-[#1b365d] text-white font-semibold text-xs py-2.5 px-4 rounded shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'ATUALIZAR' : 'SALVAR'}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingId, formData.name)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-3.5 rounded shadow-sm transition cursor-pointer"
                  >
                    EXCLUIR
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Coluna Direita: Barra de Pesquisa & Tabela */}
          <section className="lg:col-span-8 bg-white rounded-md shadow-sm border border-slate-200 p-5">
            {/* Filtros de Pesquisa */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por nome, e-mail ou empresa..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-700 bg-white"
              >
                <option value="ALL">Todos os Estágios</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={String(stage.id)}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabela Responsiva */}
            {isLoading ? (
              <div className="py-12 flex items-center justify-center text-slate-500 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando registros...</span>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhum cliente encontrado com os filtros aplicados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                      <th className="py-2.5 px-3">Nome / Empresa</th>
                      <th className="py-2.5 px-3">Contato</th>
                      <th className="py-2.5 px-3">Estágio do Funil</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredCustomers.map((customer) => {
                      const currentStageId =
                        customer.funnelStage?.id || customer.funnelStageId || '';
                      return (
                        <tr key={customer.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800">{customer.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {customer.companyName || 'Pessoa Física'}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div>{customer.email || '-'}</div>
                            <div className="text-[11px] text-slate-400">
                              {customer.phone || '-'}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <select
                              value={currentStageId}
                              disabled={updatingStageId === customer.id}
                              onChange={(e) =>
                                handleStageChange(customer.id, Number(e.target.value))
                              }
                              className="px-2 py-1 text-[11px] font-medium rounded border border-slate-200 bg-blue-50/60 text-[#1b365d] focus:outline-none focus:ring-1 focus:ring-[#2b548e] cursor-pointer"
                            >
                              {stages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(customer)}
                                title="Editar"
                                className="p-1.5 text-slate-500 hover:text-[#24497a] hover:bg-blue-50 rounded transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(customer.id, customer.name)}
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
    </div>
  );
};