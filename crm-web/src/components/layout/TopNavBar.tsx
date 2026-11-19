import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  GitBranch,
  CheckSquare,
  FileText,
  UserCog,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const TopNavbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Painel', icon: LayoutDashboard, adminOnly: false },
    { to: '/customers', label: 'Clientes', icon: Users, adminOnly: false },
    { to: '/funnel-stages', label: 'Funil de Vendas', icon: GitBranch, adminOnly: false },
    { to: '/tasks', label: 'Tarefas', icon: CheckSquare, adminOnly: false },
    { to: '/notes', label: 'Anotações', icon: FileText, adminOnly: false },
    { to: '/users', label: 'Administração', icon: UserCog, adminOnly: true },
  ].filter((item) => !item.adminOnly || isAdmin);

  return (
    <header className="w-full bg-[#1b365d] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#2b548e] p-1.5 rounded flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-200" />
          </div>
          <span className="font-semibold text-sm sm:text-base tracking-wide">
            fabiomontenegro CRM
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-blue-100">{user?.email}</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#2b548e] text-blue-100">
              {user?.role === 'ADMIN' ? 'Admin' : 'Operador'}
            </span>
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-1.5 bg-[#24497a] hover:bg-[#2b548e] px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <nav className="bg-[#152a4a] border-t border-[#264673]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? 'border-blue-400 text-white bg-[#1b365d]'
                    : 'border-transparent text-blue-200 hover:text-white hover:bg-[#1b365d]/50'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};