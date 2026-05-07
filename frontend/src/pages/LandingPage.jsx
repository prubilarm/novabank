import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, ArrowRight, CheckCircle, Smartphone, CreditCard } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl font-bold">NB</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">NovaBank</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-slate-400 font-medium">
            <a href="#features" className="hover:text-blue-400 transition-colors">Características</a>
            <a href="#security" className="hover:text-blue-400 transition-colors">Seguridad</a>
            <a href="#bridge" className="hover:text-blue-400 transition-colors">Aerum Bridge</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all border border-slate-700"> Entrar </Link>
            <Link to="/register" className="px-5 py-2.5 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"> Empezar </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-bounce">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">NovaBank v2.0 ya está aquí</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            La banca del <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">futuro</span>,<br />
            en tus manos hoy.
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            NovaBank combina la seguridad bancaria tradicional con la velocidad de la era digital. Gestiona, transfiere y audita con total transparencia.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/register" className="w-full md:w-auto px-8 py-4 bg-blue-600 rounded-2xl text-lg font-bold hover:scale-105 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">
              Abre tu cuenta gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full md:w-auto px-8 py-4 bg-slate-800 rounded-2xl text-lg font-bold hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2">
              Descargar App <Smartphone className="w-5 h-5" />
            </button>
          </div>

          {/* Floating UI Elements */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2070" className="rounded-2xl opacity-80" alt="Dashboard Preview" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">¿Por qué elegir NovaBank?</h2>
            <p className="text-slate-400">Todo lo que necesitas de un banco, sin las filas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-8 h-8 text-blue-400" />, title: "Máxima Seguridad", desc: "Encriptación de grado militar y autenticación biométrica en cada paso." },
              { icon: <Globe className="w-8 h-8 text-indigo-400" />, title: "Aerum Bridge", desc: "Transfiere fondos instantáneamente a cualquier banco de la red Aerum." },
              { icon: <Zap className="w-8 h-8 text-yellow-400" />, title: "Pagos Rápidos", desc: "Envía dinero por email o número de cuenta en menos de 2 segundos." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 transition-all group">
                <div className="mb-6 p-4 bg-slate-900 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20">
             <CreditCard className="w-64 h-64 -rotate-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 relative z-10 leading-tight">
            Únete a los más de <br />100,000 usuarios satisfechos.
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-12 relative z-10">
            {["Seguro", "Rápido", "Sin Comisiones", "Auditado"].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-200" />
                <span className="font-semibold">{text}</span>
              </div>
            ))}
          </div>
          <Link to="/register" className="inline-block px-10 py-5 bg-white text-blue-700 rounded-2xl text-xl font-bold hover:bg-slate-100 transition-all relative z-10 shadow-xl">
            Crea tu cuenta hoy
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">NovaBank</span>
            <span>© 2026 Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Soporte</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
