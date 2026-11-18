import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { CustomersPage } from './pages/customers/CustomerPage';
import { FunnelStagesPage } from './pages/funnel/FunnelStagesPage';
import { TasksPage } from './pages/tasks/TasksPage';
import { CustomerNotesPage } from './pages/notes/CustomerNotesPage';
import { UsersPage } from './pages/users/UsersPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />+

          <Route
            path="/funnel-stages"
            element={
              <ProtectedRoute>
                <FunnelStagesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/notes"
            element={
              <ProtectedRoute>
                <CustomerNotesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          
          {/* Redireciona /dashboard e qualquer outra rota desconhecida para /customers */}
          <Route path="/dashboard" element={<Navigate to="/customers" replace />} />
          <Route path="*" element={<Navigate to="/customers" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;