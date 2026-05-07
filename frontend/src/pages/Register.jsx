import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">NovaBank</h1>
          <p className="text-gray-400 text-sm">Crea tu cuenta hoy y toma el control</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-center text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-3 rounded-xl mb-6 text-center text-sm">
            ¡Registro exitoso! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs text-gray-500 mb-1 ml-1 block">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                className="input-nova pl-11" 
                placeholder="Ej. Juan Pérez"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 ml-1 block">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                className="input-nova pl-11" 
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 ml-1 block">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                className="input-nova pl-11" 
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-4">
            Empezar Ahora <UserPlus size={20} />
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-400">
          ¿Ya eres cliente? <Link to="/login" className="text-secondary font-bold hover:underline">Inicia Sesión</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
