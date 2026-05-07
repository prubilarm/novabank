import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Para mostrar mensajes bonitos arriba
import { AuthProvider } from './contexts/AuthContext'; // El "guardián" de la sesión
import { useAuth } from './hooks/useAuth'; // Para preguntar si hay un usuario logueado

// --- Importamos nuestras Páginas ---
import LandingPage from './pages/LandingPage'; // La portada del banco
import LoginPage from './pages/LoginPage'; // Página para entrar
import RegisterPage from './pages/RegisterPage'; // Página para registrarse
import Dashboard from './pages/Dashboard'; // El panel principal del cliente
import TransactionsPage from './pages/TransactionsPage'; // Lista de movimientos
import TransferPage from './pages/TransferPage'; // Para mandar dinero
import AdminPanel from './pages/AdminPanel'; // El panel de control del banco (solo admin)

// Components
import Navbar from './components/Navbar';

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        } />
        <Route path="/transfer" element={
          <ProtectedRoute>
            <TransferPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
