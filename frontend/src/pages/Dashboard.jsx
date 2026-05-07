import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Send, ArrowUpRight, ArrowDownLeft, Plus, X, CreditCard, User } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(user);
  const [transactions, setTransactions] = useState([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferData, setTransferData] = useState({ targetEmail: '', amount: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('nova_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const transRes = await axios.get('/api/transactions', config);
      setTransactions(transRes.data);
      
      // Actualizar balance desde el server
      const loginRes = await axios.get('/api/user/profile', config); // Necesitaría esta ruta o usar el login data
      if (loginRes.data) setProfile(loginRes.data);

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
      setMessage({ text: 'Transferencia enviada con éxito', type: 'success' });
      setTransferData({ targetEmail: '', amount: '', description: '' });
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div className="md:col-span-2 glass p-8 bg-gradient-to-br from-primary/20 to-secondary/20 border-white/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Saldo Disponible</p>
              <h1 className="text-5xl font-bold">
                ${profile?.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </h1>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <Wallet className="text-secondary" size={32} />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowTransfer(true)} className="btn-primary flex items-center gap-2">
              <Send size={18} /> Enviar Dinero
            </button>
          </div>
        </motion.div>

        <motion.div className="glass p-8 relative overflow-hidden group border-white/10">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-3xl"></div>
          <p className="text-sm font-semibold mb-6 flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> Mi Cuenta
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">ID de Cuenta:</p>
            <p className="text-xs font-mono text-secondary break-all">{profile?.accountId}</p>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-3">
             <div className="bg-primary/20 p-2 rounded-full"><User size={16} /></div>
             <p className="text-sm font-bold">{profile?.fullName}</p>
          </div>
        </motion.div>
      </div>

      <div className="glass p-8 border-white/5">
        <h3 className="text-xl font-bold mb-8">Movimientos Recientes</h3>
        <div className="space-y-4">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${t.sender_account_id === profile.accountId ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {t.sender_account_id === profile.accountId ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div>
                  <p className="font-bold">{t.description || 'Transferencia'}</p>
                  <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`text-lg font-bold ${t.sender_account_id === profile.accountId ? 'text-red-500' : 'text-emerald-500'}`}>
                {t.sender_account_id === profile.accountId ? '-' : '+'}${t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showTransfer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass max-w-md w-full p-8 relative border-white/20">
              <button onClick={() => setShowTransfer(false)} className="absolute right-6 top-6 text-gray-400 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-6">Enviar Dinero</h2>
              {message.text && <div className={`p-4 rounded-xl mb-6 text-center text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50' : 'bg-red-500/10 text-red-500 border border-red-500/50'}`}>{message.text}</div>}
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-widest">Email del destinatario</label>
                  <input type="email" className="input-nova" placeholder="usuario@novabank.com" value={transferData.targetEmail} onChange={(e) => setTransferData({...transferData, targetEmail: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-widest">Monto (USD)</label>
                  <input type="number" className="input-nova" placeholder="0.00" value={transferData.amount} onChange={(e) => setTransferData({...transferData, amount: e.target.value})} required />
                </div>
                <button type="submit" className="btn-primary w-full mt-4 py-4">Confirmar Transferencia</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
