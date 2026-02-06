import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import AddProperty from './pages/AddProperty';
import WarRoom from './pages/WarRoom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#05070a] text-slate-200 font-sans selection:bg-blue-500/30">
        <Routes>
          {/* 1. Default Route: Project loads at Register */}
          <Route path="/" element={<Register />} />
          
          {/* 2. Authentication Route */}
          <Route path="/login" element={<Login />} />
          
          {/* 3. Admin Routes: For Onboarding and Control */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/onboard" element={<AddProperty />} />
          
          {/* 4. Investor Routes: For Browsing and Bidding */}
          <Route path="/dashboard" element={<InvestorDashboard />} />
          <Route path="/war-room/:id" element={<WarRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;