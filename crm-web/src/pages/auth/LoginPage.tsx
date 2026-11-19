import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({ email, password });
      navigate('/dashboard');
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 400 || status === 401 || status === 403) {
        setErrorMessage('E-mail ou senha inválidos. Verifique suas credenciais.');
      } else {
        setErrorMessage('Não foi possível conectar ao servidor da API. Verifique se o backend está ativo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1f5] font-sans">
      <header className="w-full bg-[#1b365d] text-white px-6 py-3.5 shadow-sm flex items-center gap-3">
        <div className="bg-[#2b548e] p-1.5 rounded flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-blue-200" />
        </div>
        <span className="font-semibold text-base tracking-wide">
          fabiomontenegro CRM API
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] bg-white rounded-md shadow-md border border-slate-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold text-slate-700">
              Autenticação...
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Insira suas credenciais para acessar o painel do CRM
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Login
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] focus:border-transparent text-slate-800 placeholder-slate-400 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2b548e] focus:border-transparent text-slate-800 placeholder-slate-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#24497a] hover:bg-[#1b365d] text-white font-medium text-sm py-2.5 px-4 rounded shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>

          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={() =>
                alert('Entre em contato com o administrador do sistema para redefinir sua senha.')
              }
              className="text-xs text-slate-500 hover:text-[#24497a] transition cursor-pointer"
            >
              Esqueci minha senha
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};