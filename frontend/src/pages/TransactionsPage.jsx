import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Calendar, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCcw
} from 'lucide-react';
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
      setTransactions(response.data.transactions || []);
    } catch (error) {
      // Simulation fallback if API fails
      setTransactions([
        { id: 'sim-1', amount: 2500.00, direction: 'incoming', transaction_type: 'deposit', description: 'Nómina Mensual', created_at: new Date().toISOString(), counterparty: { full_name: 'Empresa Global S.A.' } },
        { id: 'sim-2', amount: 45.50, direction: 'outgoing', transaction_type: 'transfer', description: 'Pago Amazon Store', created_at: new Date(Date.now() - 86400000).toISOString(), counterparty: { full_name: 'Amazon' } },
        { id: 'sim-3', amount: 120.00, direction: 'outgoing', transaction_type: 'transfer', description: 'Cena Restaurante', created_at: new Date(Date.now() - 172800000).toISOString(), counterparty: { full_name: 'Restaurante Gourmet' } }
      ]);
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
      <div className="flex items-center justify-center min-h-screen bg-[#050A18]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050A18] text-white pt-28 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Movimientos</h1>
            <p className="text-white/40 font-light mt-1">Control total de tu flujo de efectivo.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={loadTransactions}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <RefreshCcw className="w-5 h-5 text-white/60" />
            </button>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        {/* Filters Box */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por concepto o contacto..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 self-start">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'incoming', label: 'Ingresos' },
                { id: 'outgoing', label: 'Gastos' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    filter === btn.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="group p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 hover:border-white/10 transition-all flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    tx.direction === 'incoming' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {tx.direction === 'incoming' ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
                  </div>
                  <div>
                    <p className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                      {tx.description || (tx.direction === 'incoming' ? 'Depósito recibido' : 'Transferencia enviada')}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-bold text-white/20 mt-1 uppercase tracking-widest">
                      <Calendar size={12} />
                      {new Date(tx.created_at).toLocaleDateString('es-ES', { 
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    tx.direction === 'incoming' ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {tx.direction === 'incoming' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest mt-1">Ref: {tx.id.substring(0, 8)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white/2 rounded-[2.5rem] border-2 border-dashed border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="text-white/10 w-10 h-10" />
              </div>
              <p className="text-white/40 font-medium">No se encontraron resultados para tu búsqueda.</p>
              <button 
                onClick={() => {setFilter('all'); setSearchTerm('');}}
                className="mt-4 text-blue-500 font-bold hover:underline"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>

        {/* Simple Pagination Mock */}
        {filteredTransactions.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-4">
             <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/20">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <span className="text-sm font-bold text-white/40">Página 1 de 1</span>
             <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/20">
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionsPage;
