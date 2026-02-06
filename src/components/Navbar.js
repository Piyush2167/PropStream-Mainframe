import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-[#05070a] border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <h1 className="text-xl font-black text-white uppercase tracking-tighter">PROP<span className="text-blue-500">STREAM</span></h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Dynamic Links based on Role */}
        <Link to={role === 'admin' ? "/admin" : "/dashboard"} className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Terminal</Link>
        
        {role === 'admin' && (
          <Link to="/onboard" className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Onboard</Link>
        )}

        <button 
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all"
        >
          Disconnect
        </button>
      </div>
    </nav>
  );
};

export default Navbar;