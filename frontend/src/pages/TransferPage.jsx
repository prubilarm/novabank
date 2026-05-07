import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, DollarSign, AlertCircle, Globe, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import axios from 'axios'; // Importamos axios directamente para llamadas externas

function TransferPage() {
  const navigate = useNavigate();
  const [transferType, setTransferType] = useState('internal'); // 'internal' o 'interbank'
  const [formData, setFormData] = useState({
    toEmail: '',
    account_number: '', // Para transferencias interbancarias
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (transferType === 'internal' && !formData.toEmail) return toast.error('Ingresa el correo del destinatario');
    if (transferType === 'interbank' && !formData.account_number) return toast.error('Ingresa el número de cuenta de Aerum');
    if (!formData.amount || parseFloat(formData.amount) <= 0) return toast.error('El monto debe ser mayor a 0');
    
    setLoading(true);
    try {
      if (transferType === 'internal') {
        // --- Transferencia Interna en NovaBank ---
        await api.post('/api/transfer', {
          toEmail: formData.toEmail,
          amount: parseFloat(formData.amount),
          description: formData.description || 'Transferencia NovaBank'
        });
        toast.success(`Transferencia interna de $${formData.amount} completada`);
      } else {
        // --- Transferencia Interbancaria (Bridge a Banco Aerum) ---
        // 1. Primero registramos la salida de dinero en nuestro sistema (Backend NovaBank)
        await api.post('/api/transfer', {
          toEmail: 'interbank@novabank.com', // Cuenta puente del sistema
          amount: parseFloat(formData.amount),
          description: `Interbancaria a Aerum: ${formData.account_number}`
        });

        // 2. Conectamos con la API externa de Banco Aerum
        const aerumResponse = await axios.post('https://banco-aerum.vercel.app/api/interbank/receive', {
          account_number: formData.account_number,
          amount: parseFloat(formData.amount),
          from_bank: 'NovaBank',
          description: formData.description || 'Transferencia desde NovaBank',
          api_key: 'AERUM-BRIDGE-2026' // Nuestra llave de conexión
        });

        if (aerumResponse.status === 200 || aerumResponse.status === 201) {
          toast.success('¡Transferencia Interbancaria aceptada por Banco Aerum!');
        }
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en transferencia:', error);
      const message = error.response?.data?.error || 'Error en la conexión interbancaria';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {/* Selector de Tipo de Transferencia */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setTransferType('internal')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${transferType === 'internal' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User size={16} /> NovaBank
            </button>
            <button 
              onClick={() => setTransferType('interbank')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${transferType === 'interbank' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Globe size={16} /> Interbancaria
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {transferType === 'internal' ? <ArrowRight className="w-8 h-8 text-blue-600" /> : <Building2 className="w-8 h-8 text-blue-600" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {transferType === 'internal' ? 'Enviar a NovaBank' : 'Enviar a Aerum'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {transferType === 'internal' ? 'Transferencia instantánea gratuita' : 'Conexión segura vía Bridge Aerum'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {transferType === 'internal' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email del destinatario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="input-field pl-10"
                    placeholder="amigo@ejemplo.com"
                    value={formData.toEmail}
                    onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de cuenta Aerum</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="input-field pl-10"
                    placeholder="Ej: AER-001234-X"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input-field pl-10 font-bold text-lg"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Nota del Sistema:</p>
                <p className="text-xs opacity-80">
                  {transferType === 'internal' 
                    ? 'Las transferencias internas son instantáneas y no tienen comisión.' 
                    : 'Las transferencias a Aerum se procesan vía API Bridge y requieren validación de red.'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send size={18} /> {transferType === 'internal' ? 'Enviar Dinero' : 'Ejecutar Interbank Bridge'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TransferPage;
