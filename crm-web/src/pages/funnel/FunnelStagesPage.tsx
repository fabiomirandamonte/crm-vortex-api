import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavBar';
import { funnelStageService } from '../../services/funnelStageService';
import { customerService } from '../../services/customerService';
import { type Customer, type FunnelStage, type FunnelStageRequest } from '../../types/crm';

export const FunnelStagesPage: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<FunnelStageRequest>({
    name: '',
    stageOrder: 1,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [stagesData, customersData] = await Promise.all([
        funnelStageService.getAll(),
        customerService.getAll(),
      ]);
      setStages(stagesData);
      setCustomers(customersData);

      if (!editingId) {
        const nextOrder =
          stagesData.length > 0
            ? Math.max(...stagesData.map((s) => s.stageOrder)) + 1
            : 1;
        setFormData({ name: '', stageOrder: nextOrder });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao carregar estágios do funil e pipeline.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    const nextOrder =
      stages.length > 0 ? Math.max(...stages.map((s) => s.stageOrder)) + 1 : 1;
    setFormData({ name: '', stageOrder: nextOrder });
  };

  const handleEditClick = (stage: FunnelStage) => {
    setEditingId(stage.id);
    setFormData({
      name: stage.name,
      stageOrder: stage.stageOrder,
    });
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'O nome do estágio é obrigatório.' });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      if (editingId) {
        await funnelStageService.update(editingId, formData);
        setFeedback({ type: 'success', message: 'Estágio atualizado com sucesso!' });
      } else {
        await funnelStageService.create(formData);
        setFeedback({ type: 'success', message: 'Estágio criado com sucesso!' });
      }

      resetForm();
      await loadData();
    } catch {
      setFeedback({ type: 'error', message: 'Não foi possível salvar o estágio do funil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Deseja realmente excluir o estágio "${name}"?`)) return;

    try {
      await funnelStageService.delete(id);
      setFeedback({ type: 'success', message: 'Estágio removido com sucesso.' });
      if (editingId === id) resetForm();
      await loadData();
    } catch {
      setFeedback({
        type: 'error',
        message: 'Não é possível excluir um estágio que possui clientes vinculados.',
      });
    }
  };

  const handleMoveCustomer = async (customerId: number, targetStageId: number) => {
    try {
      await customerService.updateFunnelStage(customerId, targetStageId);
      setFeedback({ type: 'success', message: 'Cliente movido no pipeline!' });
      await loadData();
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao movimentar cliente no funil.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1f5] font-sans">
      <TopNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              GESTÃO DO FUNIL DE VENDAS
            </h1>
            <p className="text-xs text-slate-500">
              Acompanhe visualmente o andamento das negociações e gerencie a ordem das etapas de vendas
            </p>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded shadow-sm transition cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Estágio</span>
            </button>
          )}
        </div>

        {/* Alertas */}
        {feedback && (
          <div
            className={`p-3 rounded border flex items-center justify-between text-xs ${
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

        {/* Seção Superior: Pipeline Visual (Kanban por Estágio) */}
        <section className="bg-white rounded-md shadow-sm border border-slate-200 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 mb-4">
            Quadro do Funil de Vendas
          </h2>

          {isLoading ? (
            <div className="py-10 flex items-center justify-center text-slate-500 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Carregando pipeline...</span>
            </div>
          ) : stages.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Nenhum estágio cadastrado. Crie o primeiro estágio abaixo.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
              {stages.map((stage, index) => {
                const stageCustomers = customers.filter(
                  (c) => (c.funnelStage?.id || c.funnelStageId) === stage.id
                );
                const prevStage = index > 0 ? stages[index - 1] : null;
                const nextStage = index < stages.length - 1 ? stages[index + 1] : null;

                return (
                  <div
                    key={stage.id}
                    className="bg-[#f8fafc] border border-slate-200 rounded-md flex flex-col min-h-[240px]"
                  >
                    {/* Cabeçalho da Coluna */}
                    <div className="bg-[#1b365d] text-white px-3 py-2.5 rounded-t-md flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">
                        {stage.stageOrder}. {stage.name}
                      </span>
                      <span className="bg-[#2b548e] text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {stageCustomers.length}
                      </span>
                    </div>

                    {/* Cards de Clientes */}
                    <div className="p-2.5 space-y-2.5 flex-1">
                      {stageCustomers.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-[11px] text-slate-400 py-8">
                          Sem clientes nesta etapa
                        </div>
                      ) : (
                        stageCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className="bg-white border border-slate-200 rounded p-2.5 shadow-xs hover:border-blue-300 transition"
                          >
                            <div className="font-semibold text-xs text-slate-800 truncate">
                              {customer.name}
                            </div>
                            {customer.companyName && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                                <Building2 className="w-3 h-3 shrink-0" />
                                <span className="truncate">{customer.companyName}</span>
                              </div>
                            )}

                            {/* Botões de Movimentação Rápida */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                              {prevStage ? (
                                <button
                                  onClick={() => handleMoveCustomer(customer.id, prevStage.id)}
                                  title={`Mover para ${prevStage.name}`}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-[#1b365d] cursor-pointer"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                  <span>Voltar</span>
                                </button>
                              ) : (
                                <span />
                              )}

                              {nextStage && (
                                <button
                                  onClick={() => handleMoveCustomer(customer.id, nextStage.id)}
                                  title={`Avançar para ${nextStage.name}`}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#24497a] hover:text-[#1b365d] cursor-pointer"
                                >
                                  <span>Avançar</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Seção Inferior: CRUD de Estágios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Formulário */}
          <section className="lg:col-span-4 bg-white rounded-md shadow-sm border border-slate-200 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 mb-4">
              {editingId ? `Editando Estágio #${editingId}` : 'Cadastrar / Editar Etapa'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nome da Etapa
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Proposta Enviada"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ordem no Funil
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.stageOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, stageOrder: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#24497a] hover:bg-[#1b365d] text-white font-semibold text-xs py-2.5 px-4 rounded shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingId ? 'UPDATE STAGE' : 'SAVE STAGE'}</span>
              </button>
            </form>
          </section>

          {/* Tabela de Estágios */}
          <section className="lg:col-span-8 bg-white rounded-md shadow-sm border border-slate-200 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 mb-4">
              Lista de Etapas
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 w-20">Ordem</th>
                    <th className="py-2.5 px-3">Nome do Estágio</th>
                    <th className="py-2.5 px-3">Clientes</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {stages.map((stage) => {
                    const count = customers.filter(
                      (c) => (c.funnelStage?.id || c.funnelStageId) === stage.id
                    ).length;

                    return (
                      <tr key={stage.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-bold text-[#1b365d]">
                          #{stage.stageOrder}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {stage.name}
                        </td>
                        <td className="py-3 px-3 text-slate-500">{count} cliente(s)</td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditClick(stage)}
                              title="Editar"
                              className="p-1.5 text-slate-500 hover:text-[#24497a] hover:bg-blue-50 rounded transition cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(stage.id, stage.name)}
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
          </section>
        </div>
      </main>
    </div>
  );
};