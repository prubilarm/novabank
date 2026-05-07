import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Smartphone, 
  CreditCard, 
  Lock, 
  Cpu, 
  BarChart3,
  ChevronRight,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050A18] text-white overflow-x-hidden font-sans selection:bg-blue-500/30">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Modern Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 backdrop-blur-xl bg-black/40 border-b border-white/5' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">NovaBank</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors relative group">
              Características
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#security" className="hover:text-white transition-colors relative group">
              Seguridad
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#tech" className="hover:text-white transition-colors relative group">
              Tecnología
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-blue-50 transition-all shadow-xl shadow-white/10 active:scale-95">
              Empieza ahora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - The "Wow" Factor */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em]">La Banca del Futuro v2.0</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              Controla tu <br />
              <span className="text-blue-500 italic">libertad</span> financiera.
            </h1>
            
            <p className="text-xl text-white/50 max-w-lg mb-12 leading-relaxed font-light">
              Experimenta una plataforma bancaria diseñada para la era digital. Seguridad cuántica, velocidad instantánea y una interfaz que se siente como el mañana.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link to="/register" className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-3 active:scale-95">
                Crea tu cuenta <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Smartphone className="w-5 h-5" /> Descarga la App
              </button>
            </div>

            <div className="mt-16 flex items-center gap-6 text-white/40">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050A18] bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">
                <span className="text-white">+100k</span> usuarios ya confían en nosotros
              </p>
            </div>
          </div>

          {/* Abstract Visual Elements */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-[4rem] rotate-6 blur-3xl"></div>
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-150 transition-transform duration-700">
                <Cpu className="w-64 h-64 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <p className="text-white/40 text-sm mb-1 uppercase tracking-wider">Saldo Total</p>
                    <h3 className="text-4xl font-bold">$124,560.80</h3>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: 'Ingresos', val: '+$12,400', color: 'text-emerald-400' },
                    { label: 'Gastos', val: '-$3,200', color: 'text-rose-400' },
                    { label: 'Inversiones', val: '+$8,900', color: 'text-blue-400' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-white/70 font-medium">{item.label}</span>
                      <span className={`font-bold ${item.color}`}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                Diseñado para quienes <br />
                no se conforman.
              </h2>
              <p className="text-white/40 text-lg font-light leading-relaxed">
                Hemos reinventado cada detalle de la experiencia bancaria tradicional para darte velocidad, control y elegancia en un solo lugar.
              </p>
            </div>
            <Link to="/register" className="group flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
              Ver todas las funciones <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-8 h-8 text-blue-400" />, title: "Seguridad Cuántica", desc: "Tus fondos y datos protegidos por los estándares de encriptación más altos del mundo." },
              { icon: <Zap className="w-8 h-8 text-yellow-400" />, title: "Velocidad Nova", desc: "Transferencias que ocurren antes de que termines de parpadear. Sin esperas, sin límites." },
              { icon: <Lock className="w-8 h-8 text-purple-400" />, title: "Privacidad Total", desc: "Tú eres el único dueño de tu información. Nosotros solo somos los guardianes." }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500">
                <div className="mb-8 p-5 bg-white/5 rounded-3xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20 text-white/40">
          <div className="md:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tighter">NovaBank</span>
             </div>
             <p className="text-sm leading-relaxed">
               Redefiniendo el concepto de banca para la nueva era digital. Seguro, rápido y transparente.
             </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Producto</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Cuentas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tarjetas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Inversiones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Compañía</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Licencia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Auditoría</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold text-white/20 uppercase tracking-widest">
           <span>© 2026 NovaBank Enterprise. Todos los derechos reservados.</span>
           <div className="flex gap-8">
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-white transition-colors">Instagram</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
