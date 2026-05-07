import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nova_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('nova_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_token');
  };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <main className={user ? "container mx-auto pb-10" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
