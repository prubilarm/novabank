import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowUpRight, ArrowDownLeft, History, CreditCard, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      
      // Cargamos el saldo por separado para que sea más robusto
      try {
        const balanceRes = await api.get('/api/balance');
        setBalance(balanceRes.data.balance || 0);
      } catch (err) {
        console.error('Error balance:', err);
        setBalance(0);
      }

      // Cargamos el historial por separado
      try {
        const transactionsRes = await api.get('/api/history?limit=5');
        setTransactions(transactionsRes.data.transactions || []);
      } catch (err) {
        console.error('Error history:', err);
        setTransactions([]);
      }
      
    } catch (error) {
      console.error('Error general dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos para el gráfico (simulados)
  const chartData = [
    { name: 'Lun', monto: 1200 },
    { name: 'Mar', monto: 1350 },
    { name: 'Mié', monto: 1100 },
    { name: 'Jue', monto: 1450 },
    { name: 'Vie', monto: 1600 },
    { name: 'Sáb', monto: 1550 },
    { name: 'Dom', monto: 1700 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Banner de bienvenida */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Hola, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Bienvenido a tu dashboard financiero</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Saldo y acciones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjeta de saldo principal */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm opacity-90">Saldo disponible</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-4xl font-bold">
                      {showBalance ? `$${balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}` : '••••••'}
                    </p>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 hover:bg-white/20 rounded-lg transition"
                    >
                      {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <CreditCard className="w-12 h-12 opacity-80" />
              </div>
              
              <div className="flex gap-3 mt-6">
                <Link to="/transfer" className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-xl text-center font-semibold transition">
                  Transferir
                </Link>
                <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-xl font-semibold transition">
                  Depositar
                </button>
              </div>
            </div>

            {/* Gráfico de actividad */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Actividad semanal</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="monto" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Columna derecha - Acciones rápidas */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/transfer" className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <ArrowUpRight className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Enviar</span>
                </Link>
                <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <ArrowDownLeft className="w-8 h-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Solicitar</span>
                </button>
                <Link to="/transactions" className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <History className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Historial</span>
                </Link>
                <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Tarjetas</span>
                </button>
              </div>
            </div>

            {/* Movimientos recientes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Movimientos recientes</h3>
                <Link to="/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Ver todos
                </Link>
              </div>
              
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">No hay movimientos recientes</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.direction === 'outgoing' ? 'bg-red-50' : 'bg-green-50'
                        }`}>
                          {tx.direction === 'outgoing' ? 
                            <ArrowUpRight className="w-5 h-5 text-red-600" /> : 
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 text-sm">
                            {tx.direction === 'outgoing' ? 'Enviado' : 'Recibido'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {tx.counterparty?.full_name || tx.counterparty?.email || tx.description || 'Transferencia'}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold text-sm ${
                        tx.direction === 'outgoing' ? 'text-gray-900' : 'text-green-600'
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
