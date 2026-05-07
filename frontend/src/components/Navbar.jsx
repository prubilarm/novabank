import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  History, 
  Send, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  CreditCard,
  ChevronDown
} from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transferir', href: '/transfer', icon: Send },
    { name: 'Historial', href: '/transactions', icon: History },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin', href: '/admin', icon: ShieldCheck });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-black/40 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white hidden sm:block">NovaBank</span>
            </Link>
            
            <div className="hidden lg:ml-12 lg:flex lg:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white shadow-inner'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive(item.href) ? 'text-blue-400' : ''}`} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center gap-6">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0A0F1E]"></span>
            </button>
            
            <div className="h-8 w-px bg-white/5"></div>
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none">{user?.full_name?.split(' ')[0]}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">
                  {user?.role === 'admin' ? 'Master Admin' : 'Premium Account'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-white/10 flex items-center justify-center text-blue-400 font-bold">
                {user?.full_name?.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="p-2 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#0A0F1E] border-b border-white/5 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-5 py-4 rounded-2xl text-base font-bold ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5 mr-4" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-white/5">
              <button
                onClick={logout}
                className="w-full flex items-center px-5 py-4 rounded-2xl text-base font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
              >
                <LogOut className="w-5 h-5 mr-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
