import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/profile');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error al verificar usuario:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      toast.success('¡Bienvenido de vuelta!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Error de login:', error);
      const message = error.response?.data?.error || error.message || 'Error al iniciar sesión';
      // Aseguramos que message sea un string para evitar el error #31 de React
      toast.error(typeof message === 'string' ? message : 'Fallo en la autenticación');
      return { success: false, error: message };
    }
  };

  const register = async (full_name, email, password) => {
    try {
      const response = await api.post('/auth/register', { full_name, email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al registrarse';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const syncGoogleUser = async (userData) => {
    try {
      const response = await api.post('/auth/sync-google-user', userData);
      const { token, user: userInfo } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userInfo);
      
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al sincronizar usuario';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Sesión cerrada');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, syncGoogleUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
