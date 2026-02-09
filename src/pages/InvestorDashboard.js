import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import API_URL from '../config/api';

const InvestorDashboard = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch from MongoDB
    axios.get(`${API_URL}/properties`)
      .then(res => setProperties(res.data))
      .catch(err => console.error("Error fetching properties:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#05070a]">
      <Navbar role="investor" />
      <div className="p-10 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Investor <span className="text-blue-500">Terminal</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 italic">Mainframe Connectivity: Active</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map(p => <PropertyCard key={p._id} property={p} />)}
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;