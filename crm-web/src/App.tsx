import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';

const DashboardPlaceholder: React.FC = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-[#eef1f5]">
      <header className="bg-[#1b365d] text-white px-6 py-3.5 flex justify-between items-center">
        <span className="font-semibold">fabiomontenegro CRM API</span>
        <div className="flex items-center gap-4 text-sm">
          <span>Olá, {user?.username}</span>
          <button
            onClick={signOut}
            className="bg-[#2b548e] hover:bg-blue-700 px-3 py-1 rounded text-xs cursor-pointer"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="p-8 text-slate-700">
        Autenticação realizada com sucesso! Pronto para construir os próximos módulos.
      </main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;