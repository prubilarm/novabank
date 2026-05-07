import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, DollarSign, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

function TransferPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    toEmail: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.toEmail || !formData.amount) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    if (parseFloat(formData.amount) <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/api/transfer', {
        toEmail: formData.toEmail,
        amount: parseFloat(formData.amount),
        description: formData.description || 'Transferencia'
      });
      
      toast.success(`Transferencia de $${formData.amount} realizada exitosamente`);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.error || 'Error al realizar la transferencia';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Nueva Transferencia</h1>
            <p className="text-gray-600 text-sm mt-1">Envía dinero de forma instantánea y segura</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo del destinatario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.toEmail}
                  onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="amigo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto a transferir
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="¿Para qué es esta transferencia?"
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Antes de transferir:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Verifica que el correo del destinatario sea correcto</li>
                  <li>Las transferencias son inmediatas e irreversibles</li>
                  <li>No hay comisiones por transferencias</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Transferir Ahora'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TransferPage;
