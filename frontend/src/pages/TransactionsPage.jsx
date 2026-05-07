import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowUpRight, ArrowDownLeft, Search, Calendar, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, incoming, outgoing
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/history');
      setTransactions(response.data.transactions);
    } catch (error) {
      toast.error('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.direction === filter;
    const matchesSearch = tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.counterparty?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Movimientos</h1>
          <p className="text-gray-500 text-sm">Revisa y filtra todas tus transacciones pasadas.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      {/* Filtros */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por descripción o contacto..."
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'incoming', label: 'Ingresos' },
              { id: 'outgoing', label: 'Gastos' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === btn.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Transacciones */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="card hover:border-blue-200 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  tx.direction === 'incoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {tx.direction === 'incoming' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {tx.description || (tx.direction === 'incoming' ? 'Depósito recibido' : 'Transferencia enviada')}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar size={12} />
                    {new Date(tx.created_at).toLocaleString('es-ES', { 
                      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-black ${
                  tx.direction === 'incoming' ? 'text-emerald-600' : 'text-gray-900'
                }`}>
                  {tx.direction === 'incoming' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {tx.id.substring(0, 8)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-gray-300 w-8 h-8" />
            </div>
            <p className="text-gray-500 font-medium">No se encontraron transacciones con estos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionsPage;
