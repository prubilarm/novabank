import { LogOut, Home, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="glass m-6 px-8 py-4 flex justify-between items-center sticky top-6 z-40 border-white/5">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30">
          <CreditCard size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Nova<span className="text-primary">Bank</span>
        </h2>
      </div>

      <div className="flex gap-8 items-center">
        <Link to="/" className="text-sm font-medium flex items-center gap-2 hover:text-primary transition-colors">
          <Home size={18} /> Inicio
        </Link>
        <div className="flex items-center gap-6 border-l border-white/10 pl-8">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user.full_name}</p>
            <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">ID: {user.account_number}</p>
          </div>
          <button 
            onClick={onLogout} 
            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
