// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { db } from '../firebase/config';
// import { collection, onSnapshot } from 'firebase/firestore';
// import Navbar from '../components/Navbar';

// const AdminDashboard = () => {
//   const [liveAssets, setLiveAssets] = useState([]);
//   const [stats, setStats] = useState([]);

//   useEffect(() => {
//     // 1. Sync Live Bids from Firestore
//     const unsub = onSnapshot(collection(db, "properties"), (snapshot) => {
//       setLiveAssets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     });

//     // 2. Fetch Aggregation from MongoDB
//     axios.get('http://localhost:5000/api/stats').then(res => setStats(res.data));

//     return () => unsub();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#05070a]">
//       <Navbar role="admin" />
//       <div className="p-10 max-w-7xl mx-auto">
//         <h1 className="text-4xl font-black text-white uppercase italic mb-10">Admin <span className="text-blue-500">Dashtrod</span></h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           <div className="lg:col-span-2 space-y-6">
//             <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Live Market Feed</h2>
//             {liveAssets.map(asset => (
//               <div key={asset.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex justify-between items-center">
//                 <div>
//                   <p className="text-white font-black uppercase text-lg">{asset.title}</p>
//                   <p className="text-blue-500 text-[10px] font-bold uppercase">Leader: {asset.highestBidder}</p>
//                 </div>
//                 <p className="text-2xl font-mono font-black text-white">₹{asset.currentBid?.toLocaleString()}</p>
//               </div>
//             ))}
//           </div>

//           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem]">
//             <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Market Distribution</h2>
//             {stats.map(s => (
//               <div key={s._id} className="mb-4 border-b border-slate-800 pb-2">
//                 <p className="text-white font-bold uppercase text-xs">{s._id}</p>
//                 <p className="text-slate-500 text-[10px]">Avg: ₹{s.avgPrice?.toLocaleString()}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;









import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import API_URL from "../config/api";

const AdminDashboard = () => {
  const [liveAssets, setLiveAssets] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Listen to Firestore properties
    const unsub = onSnapshot(collection(db, "properties"), (snapshot) => {
      setLiveAssets(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    // Fetch analytics from MongoDB
    axios
      .get(`${API_URL}/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));

    return () => unsub();
  }, []);

  // 🔥 START AUCTION (KEY FIX)
  const startAuction = async (asset) => {
    const ref = doc(db, "properties", asset.id);

    await updateDoc(ref, {
      status: "LIVE",
      endTime: Date.now() + 10 * 60 * 1000, // 10 minutes
      highestBidder: asset.highestBidder || "No bids",
      currentBid: asset.currentBid,
    });

    alert("Auction Started Successfully");
  };


  
  return (
    <div className="min-h-screen bg-[#05070a]">
      <Navbar role="admin" />

      <div className="p-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase italic mb-10">
          Admin <span className="text-blue-500">Dashtrod</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LIVE MARKET FEED */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
              Live Market Feed
            </h2>

            {liveAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-black uppercase text-lg">
                    {asset.title}
                  </p>
                  <p className="text-blue-500 text-[10px] font-bold uppercase">
                    Leader: {asset.highestBidder || "No bids"}
                  </p>

                  {asset.status !== "LIVE" && (
                    <button
                      onClick={() => startAuction(asset)}
                      className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-black uppercase"
                    >
                      Start Auction
                    </button>
                  )}
                </div>

                <p className="text-2xl font-mono font-black text-white">
                  ₹{asset.currentBid?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* MARKET DISTRIBUTION */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem]">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">
              Market Distribution
            </h2>

            {stats.map((s) => (
              <div
                key={s._id}
                className="mb-4 border-b border-slate-800 pb-2"
              >
                <p className="text-white font-bold uppercase text-xs">
                  {s._id}
                </p>
                <p className="text-slate-500 text-[10px]">
                  Avg: ₹{s.avgPrice?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
