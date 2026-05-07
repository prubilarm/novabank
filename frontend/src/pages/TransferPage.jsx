import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, DollarSign, AlertCircle, Globe, Building2, Send, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import axios from 'axios';

function TransferPage() {
  const navigate = useNavigate();
  const [transferType, setTransferType] = useState('internal'); // 'internal' o 'interbank'
  const [formData, setFormData] = useState({
    toEmail: '',
    account_number: '', 
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (transferType === 'internal' && !formData.toEmail) return toast.error('Ingresa el correo del destinatario');
    if (transferType === 'interbank' && !formData.account_number) return toast.error('Ingresa el número de cuenta de Aerum');
    if (!formData.amount || parseFloat(formData.amount) <= 0) return toast.error('El monto debe ser mayor a 0');
    
    setLoading(true);
    try {
      if (transferType === 'internal') {
        await api.post('/api/transfer', {
          toEmail: formData.toEmail,
          amount: parseFloat(formData.amount),
          description: formData.description || 'Transferencia NovaBank'
        });
        toast.success(`Transferencia interna de $${formData.amount} completada`);
      } else {
        await api.post('/api/transfer', {
          toEmail: 'interbank@novabank.com', 
          amount: parseFloat(formData.amount),
          description: `Interbancaria a Aerum: ${formData.account_number}`
        });

        try {
          const aerumResponse = await axios.post('https://banco-aerum.vercel.app/api/interbank/receive', {
            account_number: formData.account_number,
            amount: parseFloat(formData.amount),
            from_bank: 'NovaBank',
            description: formData.description || 'Transferencia desde NovaBank',
            api_key: 'AERUM-BRIDGE-2026' 
          });

          if (aerumResponse.status === 200 || aerumResponse.status === 201) {
            toast.success('¡Transferencia Interbancaria aceptada por Banco Aerum!');
          }
        } catch (e) {
          toast.success('Fondos retenidos en Bridge. Esperando confirmación de Aerum.');
        }
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en transferencia:', error);
      const message = error.response?.data?.error || 'Error en el procesamiento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A18] text-white pt-28 pb-20 px-6 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Volver al Panel</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Form */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Enviar Fondos</h1>
            <p className="text-white/40 font-light mb-10">Mueve tu capital con total seguridad y rapidez.</p>

            {/* Type Selector */}
            <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/5 mb-10">
              <button 
                onClick={() => setTransferType('internal')}
                className={`flex-1 py-4 rounded-[1.5rem] text-sm font-bold transition-all flex items-center justify-center gap-3 ${transferType === 'internal' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
              >
                <Zap size={18} /> Interna
              </button>
              <button 
                onClick={() => setTransferType('interbank')}
                className={`flex-1 py-4 rounded-[1.5rem] text-sm font-bold transition-all flex items-center justify-center gap-3 ${transferType === 'interbank' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
              >
                <Globe size={18} /> Interbancaria
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {transferType === 'internal' ? (
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4 ml-1">Destinatario NovaBank</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-lg"
                      placeholder="email@novabank.com"
                      value={formData.toEmail}
                      onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4 ml-1">Cuenta Destino Aerum</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-lg font-mono"
                      placeholder="AER-XXXXXX"
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4 ml-1">Monto a Transferir (USD)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-emerald-500 transition-colors">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-14 pr-6 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-3xl font-bold"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] text-xl font-bold text-white hover:shadow-2xl hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    Ejecutar Envío <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Info Cards */}
          <div className="lg:w-72 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-3">Seguridad Nova</h4>
              <p className="text-white/40 text-xs leading-relaxed font-light">
                Todas las operaciones están protegidas por encriptación de grado bancario y verificadas en tiempo real.
              </p>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-3 text-emerald-400">Instantáneo</h4>
              <p className="text-white/40 text-xs leading-relaxed font-light">
                Los fondos llegarán a su destino en menos de 2 segundos. Sin esperas, sin burocracia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferPage;
