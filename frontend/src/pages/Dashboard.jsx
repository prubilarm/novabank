import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Wallet, 
  TrendingUp, 
  Plus, 
  Send,
  MoreHorizontal,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      try {
        const balanceRes = await api.get('/api/balance');
        setBalance(balanceRes.data.balance || 0);
      } catch (err) {
        setBalance(10000.00); // Fallback simulation
      }

      try {
        const transactionsRes = await api.get('/api/history?limit=5');
        setTransactions(transactionsRes.data.transactions || []);
      } catch (err) {
        setTransactions([]);
      }
      
    } catch (error) {
      console.error('Error general dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Lun', monto: 4500 },
    { name: 'Mar', monto: 5200 },
    { name: 'Mié', monto: 4800 },
    { name: 'Jue', monto: 6100 },
    { name: 'Vie', monto: 5900 },
    { name: 'Sáb', monto: 7200 },
    { name: 'Dom', monto: 8500 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050A18]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050A18] text-white pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-white/40 font-light mt-1">Bienvenido de nuevo, {user?.full_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5 text-white/60" />
            </button>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                {user?.full_name?.charAt(0)}
              </div>
              <span className="text-sm font-medium">{user?.full_name?.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Primary Card - Glassmorphism */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-10 shadow-2xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <CreditCard className="w-48 h-48 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Saldo Total</span>
                  <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-full bg-white/20"></div>
                     <div className="w-8 h-8 rounded-full bg-white/10 -ml-4"></div>
                  </div>
                </div>

                <div className="flex items-end gap-4 mb-10">
                  <h2 className="text-6xl font-bold tracking-tighter">
                    {showBalance ? `$${balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}` : '••••••'}
                  </h2>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="mb-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                  >
                    {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link to="/transfer" className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" /> Enviar Dinero
                  </Link>
                  <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Depositar
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Actividad Financiera</h3>
                  <p className="text-white/40 text-sm font-light">Rendimiento de los últimos 7 días</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl text-sm font-bold">
                  <TrendingUp className="w-4 h-4" /> +12.4%
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#ffffff20" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0A1222', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="monto" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorMonto)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <h3 className="font-bold mb-6">Mis Tarjetas</h3>
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <CreditCard className="w-20 h-20" />
                </div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Visa Signature</p>
                <p className="text-lg font-mono tracking-widest mb-6">•••• 4582</p>
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] text-white/40 mb-1">Titular</p>
                     <p className="text-xs font-bold uppercase">{user?.full_name}</p>
                   </div>
                   <div className="w-10 h-6 bg-yellow-500/20 rounded-md"></div>
                </div>
              </div>
              <button className="w-full py-4 border border-white/5 bg-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Añadir Tarjeta
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold">Movimientos</h3>
                <Link to="/transactions" className="text-xs font-bold text-blue-500 hover:text-blue-400">Ver todos</Link>
              </div>
              
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-white/20 text-sm">No hay actividad reciente</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          tx.direction === 'outgoing' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {tx.direction === 'outgoing' ? 
                            <ArrowUpRight className="w-6 h-6" /> : 
                            <ArrowDownLeft className="w-6 h-6" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">
                            {tx.counterparty?.full_name || tx.description || 'Transferencia'}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">
                            {new Date(tx.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold text-base ${
                        tx.direction === 'outgoing' ? 'text-white' : 'text-emerald-400'
                      }`}>
                        {tx.direction === 'outgoing' ? '-' : '+'}${tx.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
