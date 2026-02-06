import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // MASTER ADMIN CONFIGURATION: Only this email can reach the Admin Dashboard
  const MASTER_ADMIN_EMAIL = "piyush.admin@propstream.com"; 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Perform Master Admin Check
      if (user.email === MASTER_ADMIN_EMAIL) {
        alert("Master Admin Authenticated. Accessing Dashtrod...");
        navigate('/admin');
      } else {
        alert("Investor Identity Verified. Accessing Terminal...");
        navigate('/dashboard');
      }
    } catch (err) {
      alert("Access Denied: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070a] p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access <span className="text-blue-500">Terminal</span></h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Authenticate Identity</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none border border-transparent focus:border-blue-500 transition-all shadow-inner" 
            onChange={(e) => setEmail(e.target.value)} required />
          
          <input type="password" placeholder="Password" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none border border-transparent focus:border-blue-500 transition-all shadow-inner" 
            onChange={(e) => setPassword(e.target.value)} required />

          <button className="w-full py-4 bg-blue-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            Authorize Access
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Create Account? <Link to="/" className="text-blue-500 underline decoration-blue-500/30">Register here</Link>
                </p>
      </div>
    </div>
  );
};

export default Login;