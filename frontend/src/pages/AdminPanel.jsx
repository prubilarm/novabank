import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Search, Eye, ArrowUpRight, ArrowDownLeft, ShieldAlert, TrendingUp, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Usuario para ver detalle
  const [userHistory, setUserHistory] = useState([]); // Historial del usuario seleccionado
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleAuditUser = async (userToAudit) => {
    try {
      setSelectedUser(userToAudit);
      setShowModal(true);
      // Cargar historial específico del usuario
      const response = await api.get(`/admin/transactions?user_id=${userToAudit.id}`);
      setUserHistory(response.data.transactions);
    } catch (error) {
      toast.error('Error al cargar historial del usuario');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-blue-600" /> Panel de Auditoría
          </h1>
          <p className="text-gray-500">Supervisión global de usuarios y movimientos financieros.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..."
            className="input-field pl-10 w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-l-4 border-blue-600">
          <p className="text-sm text-gray-500 font-medium">Total Usuarios</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="card border-l-4 border-emerald-500">
          <p className="text-sm text-gray-500 font-medium">Volumen Total NovaBank</p>
          <p className="text-3xl font-bold text-gray-900">
            ${users.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{u.full_name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">${(u.balance || 0).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    {u.welcome_email_sent ? (
                      <span className="text-emerald-600 text-xs font-medium">Enviado</span>
                    ) : (
                      <span className="text-amber-600 text-xs font-medium">Pendiente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleAuditUser(u)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors"
                    >
                      <Eye size={16} /> Auditar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Auditoría Detallada */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.full_name}</h2>
                  <p className="text-sm text-gray-500 italic">{selectedUser.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Users size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Cards Rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <p className="text-sm text-blue-600 font-bold mb-1 uppercase tracking-wider">Saldo Auditado</p>
                  <p className="text-3xl font-black text-blue-900">${selectedUser.balance?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Correo Registrado</p>
                  <p className="text-xl font-bold text-gray-900">{selectedUser.email}</p>
                </div>
              </div>

              {/* Historial de Transacciones Auditado */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" /> Historial Completo de Movimientos
                </h3>
                <div className="space-y-4">
                  {userHistory.length > 0 ? userHistory.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${tx.direction === 'incoming' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.direction === 'incoming' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{tx.description || 'Transferencia'}</p>
                          <p className="text-xs text-gray-500">ID: {tx.id} | {new Date(tx.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className={`text-lg font-black ${tx.direction === 'incoming' ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {tx.direction === 'incoming' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl">
                      <p className="text-gray-500">Este usuario aún no ha realizado movimientos.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 text-right">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-primary"
              >
                Cerrar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
