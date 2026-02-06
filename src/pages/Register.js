import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Store as Investor in Firestore by default
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: 'investor', // Simplified: All web sign-ups are investors
        createdAt: new Date()
      });

      alert("Investor Profile Initialized!");
      navigate('/login');
    } catch (err) {
      alert("Registration Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070a] p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Initialize <span className="text-blue-500">Account</span></h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">PropStream Mainframe Access</p>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none border border-transparent focus:border-blue-500 transition-all shadow-inner" 
            onChange={(e) => setEmail(e.target.value)} required />
          
          <input type="password" placeholder="Password" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none border border-transparent focus:border-blue-500 transition-all shadow-inner" 
            onChange={(e) => setPassword(e.target.value)} required />

          <div className="py-2">
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest text-center italic">
              Default Access Level: Private Investor
            </p>
          </div>

          <button className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95">
            Create Profile
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          Already Registered? <Link to="/login" className="text-blue-500 underline decoration-blue-500/30">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;