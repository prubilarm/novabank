import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Send, ArrowUpRight, ArrowDownLeft, Plus, X, CreditCard } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferData, setTransferData] = useState({ targetAccountNumber: '', amount: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('nova_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [profileRes, transRes] = await Promise.all([
        axios.get('/api/user/profile', config),
        axios.get('/api/transactions', config)
      ]);

      setProfile(profileRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('nova_token');
      await axios.post('/api/transactions/transfer', transferData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Transferencia exitosa', type: 'success' });
      setTransferData({ targetAccountNumber: '', amount: '', description: '' });
      setTimeout(() => {
        setShowTransfer(false);
        setMessage({ text: '', type: '' });
        fetchData();
      }, 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error en la transferencia', type: 'error' });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 glass p-8 bg-gradient-to-br from-primary/20 to-secondary/20 border-white/20"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Saldo Total</p>
              <h1 className="text-5xl font-bold">
                ${profile?.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </h1>
            </div>
            <Wallet className="text-primary" size={32} />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowTransfer(true)} className="btn-primary flex items-center gap-2">
              <Send size={18} /> Transferir
            </button>
            <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-all border border-white/10 flex items-center gap-2">
              <Plus size={18} /> Recargar
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 relative overflow-hidden group"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/20 blur-3xl group-hover:bg-secondary/30 transition-colors"></div>
          <p className="text-sm font-semibold mb-6 flex items-center gap-2">
            <CreditCard size={18} /> Tarjeta Virtual
          </p>
          <div className="space-y-4">
            <p className="text-2xl tracking-[0.2em] font-mono">**** 8821</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Vencimiento</p>
                <p className="text-sm font-bold">08/29</p>
              </div>
              <div className="w-10 h-6 bg-orange-500/80 rounded-md"></div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-400">Número de cuenta</p>
            <p className="text-sm font-mono text-secondary">{profile?.account_number}</p>
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <div className="glass p-8">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
          Historial de Movimientos
        </h3>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic">No se registran movimientos.</div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${t.sender_id === profile.id ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {t.sender_id === profile.id ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <p className="font-bold group-hover:text-primary transition-colors">{t.description || 'Transferencia Nova'}</p>
                    <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${t.sender_id === profile.id ? 'text-red-500' : 'text-emerald-500'}`}>
                  {t.sender_id === profile.id ? '-' : '+'}${t.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal - Tailwind Powered */}
      <AnimatePresence>
        {showTransfer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full p-8 relative shadow-2xl border-white/20"
            >
              <button onClick={() => setShowTransfer(false)} className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Nueva Transferencia</h2>

              {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-center text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Cuenta de destino</label>
                  <input 
                    type="text" 
                    className="input-nova" 
                    placeholder="10 dígitos"
                    value={transferData.targetAccountNumber} 
                    onChange={(e) => setTransferData({...transferData, targetAccountNumber: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Monto a enviar</label>
                  <input 
                    type="number" 
                    className="input-nova" 
                    placeholder="$ 0.00"
                    value={transferData.amount} 
                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Referencia</label>
                  <input 
                    type="text" 
                    className="input-nova" 
                    placeholder="Ej. Pago cena"
                    value={transferData.description} 
                    onChange={(e) => setTransferData({...transferData, description: e.target.value})} 
                  />
                </div>
                <button type="submit" className="btn-primary w-full mt-4">Confirmar Envío</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
