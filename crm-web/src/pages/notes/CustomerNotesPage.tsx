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
  FileText,
  Clock,
  Building2,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavBar';
import { customerService } from '../../services/customerService';
import { customerNoteService } from '../../services/customerNotesService';
import { type Customer, type CustomerNote } from '../../types/crm';

export const CustomerNotesPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');

  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoadingCustomers(true);
        const data = await customerService.getAll();
        setCustomers(data);
        if (data.length > 0) {
          setSelectedCustomerId(data[0].id);
        }
      } catch {
        setFeedback({ type: 'error', message: 'Erro ao carregar a lista de clientes.' });
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const loadNotes = async (customerId: number) => {
    try {
      setIsLoadingNotes(true);
      const data = await customerNoteService.getByCustomer(customerId);
      setNotes(data);
    } catch {
      setNotes([]);
      setFeedback({ type: 'error', message: 'Erro ao carregar notas deste cliente.' });
    } finally {
      setIsLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (selectedCustomerId) {
      resetEditor();
      loadNotes(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const resetEditor = () => {
    setEditingNoteId(null);
    setNoteContent('');
  };

  const handleEditClick = (note: CustomerNote) => {
    setEditingNoteId(note.id);
    setNoteContent(note.content);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setFeedback({ type: 'error', message: 'Selecione um cliente primeiro.' });
      return;
    }
    if (!noteContent.trim()) {
      setFeedback({ type: 'error', message: 'O conteúdo da nota não pode estar vazio.' });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      if (editingNoteId) {
        await customerNoteService.update(editingNoteId, {
          content: noteContent.trim(),
          customerId: selectedCustomerId,
        });
        setFeedback({ type: 'success', message: 'Nota atualizada com sucesso!' });
      } else {
        await customerNoteService.create({
          content: noteContent.trim(),
          customerId: selectedCustomerId,
        });
        setFeedback({ type: 'success', message: 'Nota registrada com sucesso!' });
      }

      resetEditor();
      await loadNotes(selectedCustomerId);
    } catch {
      setFeedback({ type: 'error', message: 'Não foi possível salvar a nota.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!selectedCustomerId) return;
    if (!window.confirm('Deseja realmente excluir esta anotação?')) return;

    try {
      await customerNoteService.delete(noteId);
      setFeedback({ type: 'success', message: 'Nota excluída com sucesso.' });
      if (editingNoteId === noteId) resetEditor();
      await loadNotes(selectedCustomerId);
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao excluir a nota.' });
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(customerSearch.toLowerCase()))
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1f5] font-sans">
      <TopNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            CUSTOMER NOTES MANAGEMENT
          </h1>
          <p className="text-xs text-slate-500">
            Histórico de interações, reuniões e anotações comerciais por cliente
          </p>
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

        {/* Layout em 2 Colunas: Seletor de Cliente à Esquerda + Histórico & Editor à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Esquerda: Lista de Clientes */}
          <aside className="lg:col-span-4 bg-white rounded-md shadow-sm border border-slate-200 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 mb-3">
              Selecionar Cliente
            </h2>

            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Filtrar cliente..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
              />
            </div>

            {isLoadingCustomers ? (
              <div className="py-8 flex justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando clientes...</span>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Nenhum cliente encontrado.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                {filteredCustomers.map((customer) => {
                  const isSelected = customer.id === selectedCustomerId;
                  return (
                    <li key={customer.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={`w-full text-left px-3 py-2.5 rounded transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b365d] text-white'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-xs truncate">{customer.name}</div>
                        <div
                          className={`flex items-center gap-1 text-[11px] mt-0.5 truncate ${
                            isSelected ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {customer.companyName || 'Pessoa Física'}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Coluna Direita: Editor + Linha do Tempo de Notas */}
          <section className="lg:col-span-8 space-y-5">
            {/* Card do Editor */}
            <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {editingNoteId
                      ? `Editando Nota #${editingNoteId}`
                      : `Nova Anotação${selectedCustomer ? ` — ${selectedCustomer.name}` : ''}`}
                  </h2>
                </div>
                {editingNoteId && (
                  <button
                    onClick={resetEditor}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Nota</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  disabled={!selectedCustomerId || isSaving}
                  placeholder="Registre o resumo da ligação, proposta apresentada ou próximos passos com este cliente..."
                  className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />

                <div className="flex justify-end gap-2">
                  {editingNoteId && (
                    <button
                      type="button"
                      onClick={resetEditor}
                      className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!selectedCustomerId || isSaving}
                    className="bg-[#24497a] hover:bg-[#1b365d] text-white font-semibold text-xs py-2 px-5 rounded shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingNoteId ? 'UPDATE NOTE' : 'SAVE NOTE'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Histórico de Notas */}
            <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 mb-4">
                Histórico de Anotações ({notes.length})
              </h2>

              {isLoadingNotes ? (
                <div className="py-10 flex items-center justify-center text-slate-400 text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando histórico...</span>
                </div>
              ) : notes.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <FileText className="w-6 h-6 text-slate-300" />
                  <span>Nenhuma nota registrada para este cliente ainda.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <article
                      key={note.id}
                      className="p-4 rounded border border-slate-200 bg-[#f8fafc] hover:border-blue-200 transition"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {note.createdAt
                              ? new Date(note.createdAt).toLocaleString('pt-BR')
                              : `Registro #${note.id}`}
                          </span>
                          {note.author?.email && (
                            <span className="text-slate-400">• {note.author.email}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditClick(note)}
                            title="Editar nota"
                            className="p-1 text-slate-500 hover:text-[#24497a] hover:bg-blue-50 rounded transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
                            title="Excluir nota"
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                        {note.content}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};