import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, UserPlus, Shield, ArrowLeft, Loader2, CreditCard } from 'lucide-react';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await register(fullName, email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050A18] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

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
            <h1 className="text-4xl font-bold tracking-tight mb-3">Únete a Nova</h1>
            <p className="text-white/40 font-light">Comienza tu viaje financiero hoy mismo</p>
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Nombre Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    placeholder="Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Email Personal</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 px-1 py-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-[11px] text-white/40 font-medium">
                  Acepto los <a href="#" className="text-blue-500 hover:underline">términos de servicio</a> y la política de privacidad.
                </label>
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
                      Crear Cuenta <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <span className="relative px-4 bg-[#0A0F1E] text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">O regístrate con</span>
              </div>

              <div className="mt-8">
                <button className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95">
                  <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                  Google Workspace
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-white/30 text-sm">
            ¿Ya eres cliente?{' '}
            <Link to="/login" className="font-bold text-blue-500 hover:text-blue-400 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
