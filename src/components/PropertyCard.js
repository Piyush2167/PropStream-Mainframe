import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const [liveData, setLiveData] = useState({ currentBid: property.basePrice, highestBidder: 'System Ready' });
  const navigate = useNavigate();

  useEffect(() => {
    // Real-time listener for this specific property's bidding data
    const unsub = onSnapshot(doc(db, "properties", property._id), (snapshot) => {
      if (snapshot.exists()) {
        setLiveData(snapshot.data());
      }
    });
    return () => unsub();
  }, [property._id]);

  return (
    <div className="bg-[#0f1115] border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/40 transition-all shadow-2xl">
      {/* Asset Visual: Strictly contained zoom effect */}
      <div className="h-56 w-full overflow-hidden relative">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{property.location}</p>
        </div>
      </div>
      
      {/* Asset Intel & Bidding */}
      <div className="p-8">
        <h3 className="text-xl font-black text-white uppercase truncate mb-1 tracking-tight">{property.title}</h3>
        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-6 italic">
          Leader: <span className="text-blue-500">{liveData.highestBidder}</span>
        </p>
        
        <div className="flex justify-between items-end border-t border-slate-800 pt-6">
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest leading-none">Market Value</p>
            <p className="text-2xl font-mono font-black text-white mt-1">₹{liveData.currentBid?.toLocaleString()}</p>
          </div>
          <button 
            onClick={() => navigate(`/war-room/${property._id}`)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
          >
            Enter War Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;