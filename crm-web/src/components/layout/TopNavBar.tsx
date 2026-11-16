import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  GitBranch,
  CheckSquare,
  FileText,
  UserCog,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const TopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();

  const navItems = [
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/funnel-stages', label: 'Funnel Stages', icon: GitBranch },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/notes', label: 'Notes', icon: FileText },
    { to: '/users', label: 'Admin', icon: UserCog },
  ];

  return (
    <header className="w-full bg-[#1b365d] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-[#2b548e] p-1.5 rounded flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-200" />
          </div>
          <span className="font-semibold text-sm sm:text-base tracking-wide">
            fabiomontenegro CRM API
          </span>
        </div>

        {/* Usuário Logado e Logout */}
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className="text-blue-100 hidden sm:inline">{user?.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 bg-[#24497a] hover:bg-[#2b548e] px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Sub-barra de Navegação dos Módulos */}
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