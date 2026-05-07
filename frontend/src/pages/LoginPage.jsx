import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, LogIn, Shield, ArrowLeft, Loader2, CreditCard } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result && result.success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#050A18] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      {/* Nav Link */}
      <div className="p-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Volver a la portada</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20 relative z-10">
        <div className="max-w-md w-full">
          {/* Brand Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Bienvenido</h1>
            <p className="text-white/40 font-light">Accede a tu cuenta en NovaBank</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Email Corporativo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    placeholder="usuario@novabank.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 ml-1">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest">Contraseña</label>
                  <a href="#" className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors">¿Olvidaste la clave?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-lg font-bold text-white hover:shadow-2xl hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Entrar <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <span className="relative px-4 bg-[#0A0F1E] text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">O accede con</span>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95">
                  <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                  Google Workspace
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-white/30 text-sm">
            ¿Nuevo en NovaBank?{' '}
            <Link to="/register" className="font-bold text-blue-500 hover:text-blue-400 transition-colors">
              Crea tu cuenta gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
