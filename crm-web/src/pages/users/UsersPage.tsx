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
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavBar';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { type SystemUser, type SystemUserRequest, type UserRole } from '../../types/crm';

export const UsersPage: React.FC = () => {
  const { user: loggedUser } = useAuth();

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<SystemUserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setFeedback({
          type: 'error',
          message: 'Acesso restrito: apenas administradores podem listar usuários.',
        });
      } else {
        setFeedback({ type: 'error', message: 'Erro ao carregar usuários do sistema.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'USER',
    });
  };

  const handleEditClick = (user: SystemUser) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || 'USER',
    });
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setFeedback({ type: 'error', message: 'Nome e e-mail são obrigatórios.' });
      return;
    }

    if (!editingId && (!formData.password || formData.password.length < 6)) {
      setFeedback({
        type: 'error',
        message: 'Para novos usuários, a senha deve ter pelo menos 6 caracteres.',
      });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      const payload: SystemUserRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}),
      };

      if (editingId) {
        await userService.update(editingId, payload);
        setFeedback({ type: 'success', message: 'Usuário atualizado com sucesso!' });
      } else {
        await userService.create(payload);
        setFeedback({ type: 'success', message: 'Usuário cadastrado com sucesso!' });
      }

      resetForm();
      await loadUsers();
    } catch {
      setFeedback({
        type: 'error',
        message: 'Não foi possível salvar o usuário. Verifique se o e-mail já está em uso.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: SystemUser) => {
    if (user.email === loggedUser?.email) {
      setFeedback({
        type: 'error',
        message: 'Você não pode excluir o próprio usuário atualmente logado.',
      });
      return;
    }

    if (!window.confirm(`Deseja realmente remover o usuário "${user.name}" (${user.email})?`)) {
      return;
    }

    try {
      await userService.delete(user.id);
      setFeedback({ type: 'success', message: 'Usuário removido com sucesso.' });
      if (editingId === user.id) resetForm();
      await loadUsers();
    } catch {
      setFeedback({
        type: 'error',
        message: 'Erro ao excluir usuário. Verifique se há clientes ou tarefas vinculados a ele.',
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1f5] font-sans">
      <TopNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              USER MANAGEMENT (ADMIN)
            </h1>
            <p className="text-xs text-slate-500">
              Gerencie operadores internos, credenciais de acesso e níveis de permissão
            </p>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded shadow-sm transition cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Usuário</span>
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
                {editingId ? `Editando Usuário #${editingId}` : 'Registration & Editing'}
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
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Fábio Montenegro"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  E-mail de Acesso *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="operador@crm.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {editingId ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Perfil de Permissão (Role)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as UserRole })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800 bg-white"
                >
                  <option value="USER">USER (Operador / Vendas)</option>
                  <option value="ADMIN">ADMIN (Administrador)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#24497a] hover:bg-[#1b365d] text-white font-semibold text-xs py-2.5 px-4 rounded shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'UPDATE USER' : 'SAVE USER'}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Tabela de Usuários */}
          <section className="lg:col-span-8 bg-white rounded-md shadow-sm border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por nome ou e-mail..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-800"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] text-slate-700 bg-white"
              >
                <option value="ALL">Todos os Perfis</option>
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </div>

            {isLoading ? (
              <div className="py-12 flex items-center justify-center text-slate-500 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando usuários...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Nome / E-mail</th>
                      <th className="py-2.5 px-3">Perfil</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredUsers.map((user) => {
                      const isCurrentUser = user.email === loggedUser?.email;
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3 font-semibold text-slate-500">
                            #{user.id}
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isCurrentUser && (
                                <span className="text-[10px] bg-blue-100 text-[#1b365d] px-1.5 py-0.5 rounded font-medium">
                                  Você
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{user.email}</div>
                          </td>

                          <td className="py-3 px-3">
                            {user.role === 'ADMIN' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded border bg-purple-100 text-purple-800 border-purple-200">
                                <Shield className="w-3 h-3" />
                                ADMIN
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded border bg-slate-100 text-slate-700 border-slate-200">
                                <UserIcon className="w-3 h-3" />
                                USER
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(user)}
                                title="Editar"
                                className="p-1.5 text-slate-500 hover:text-[#24497a] hover:bg-blue-50 rounded transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                disabled={isCurrentUser}
                                title={
                                  isCurrentUser
                                    ? 'Não é possível excluir sua própria conta'
                                    : 'Excluir'
                                }
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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