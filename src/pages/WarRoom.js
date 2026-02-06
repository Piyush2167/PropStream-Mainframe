// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { db, auth } from '../firebase/config';
// import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
// import Navbar from '../components/Navbar';

// const WarRoom = () => {
//   const { id } = useParams(); // Get property ID from URL
//   const [data, setData] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [userRole, setUserRole] = useState('investor'); // Default role

//   useEffect(() => {
//     // 1. Listen to Real-time Auction Data
//     const unsub = onSnapshot(doc(db, "properties", id), (snapshot) => {
//       if (snapshot.exists()) {
//         const d = snapshot.data();
//         setData(d);
        
//         // 2. Calculate remaining time based on Admin's end time
//         const timer = Math.max(0, Math.floor((d.endTime - Date.now()) / 1000));
//         setTimeLeft(timer);
//       }
//     });

//     return () => unsub();
//   }, [id]);

//   const handleBid = async () => {
//     if (timeLeft <= 0) return alert("Bidding Terminated: Auction Expired.");
//     if (!auth.currentUser) return alert("Please Login to Bid.");

//     // 3. Atomically update Price and Highest Bidder email
//     await updateDoc(doc(db, "properties", id), {
//       currentBid: increment(100000), // Increase by 1 Lakh
//       highestBidder: auth.currentUser.email
//     });
//   };

//   if (!data) return <div className="h-screen flex items-center justify-center text-slate-500 uppercase tracking-widest">Initialising Terminal...</div>;

//   return (
//     <div className="min-h-screen bg-[#05070a]">
//       <Navbar role={userRole} />
      
//       <div className="p-10 max-w-6xl mx-auto">
//         <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
          
//           {/* Auction Header */}
//           <div className="flex justify-between items-start mb-12 relative z-10">
//             <div>
//               <span className="bg-red-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">Live War Room</span>
//               <h1 className="text-5xl font-black text-white mt-4 uppercase tracking-tighter">{data.title}</h1>
//               <p className="text-blue-500 font-bold text-xs uppercase mt-2 tracking-widest">{data.location}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Time Remaining</p>
//               <p className={`text-5xl font-mono font-black mt-2 ${timeLeft < 60 ? 'text-red-500 animate-bounce' : 'text-white'}`}>
//                 {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
//             {/* Visual Asset Section */}
//             <div className="rounded-[2rem] overflow-hidden border-2 border-slate-800 shadow-2xl">
//               <img src={data.imageUrl} className="w-full h-full object-cover" alt="Asset" />
//             </div>

//             {/* Bidding Control Panel */}
//             <div className="space-y-8">
//               <div className="bg-black/40 p-8 rounded-3xl border border-slate-800">
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Current Leader</p>
//                 <p className="text-2xl font-black text-blue-400 truncate">{data.highestBidder || "Awaiting Initial Bid"}</p>
//               </div>

//               <div className="bg-black/40 p-8 rounded-3xl border border-slate-800">
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Current Valuation</p>
//                 <p className="text-6xl font-mono font-black text-emerald-400">₹{data.currentBid?.toLocaleString()}</p>
//               </div>

//               <button 
//                 disabled={timeLeft <= 0}
//                 onClick={handleBid}
//                 className={`w-full py-8 rounded-3xl font-black text-2xl tracking-widest transition-all active:scale-95 shadow-2xl ${timeLeft > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
//               >
//                 {timeLeft > 0 ? "PLACE BID +1L" : "AUCTION CLOSED"}
//               </button>
//             </div>
//           </div>

//           {/* Background Decorative Element */}
//           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WarRoom;










import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase/config";
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

const WarRoom = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
  const unsub = onSnapshot(doc(db, "properties", id), (snapshot) => {
    if (snapshot.exists()) {
      const d = snapshot.data();
      setData(d);

      if (d.status === "LIVE" && d.endTime) {
        setEndTime(d.endTime);
      } else {
        setEndTime(null);
        setTimeLeft(0);
      }
    }
  });

  return () => unsub();
}, [id]);


useEffect(() => {
  if (!endTime) return;

  const interval = setInterval(() => {
    const remaining = Math.max(
      0,
      Math.floor((endTime - Date.now()) / 1000)
    );
    setTimeLeft(remaining);
  }, 1000);

  return () => clearInterval(interval);
}, [endTime]);

  const handleBid = async () => {
    if (!auth.currentUser) {
      alert("Please login to bid");
      return;
    }

    if (data.status !== "LIVE") {
      alert("Auction not started yet");
      return;
    }

    if (timeLeft <= 0) {
      alert("Auction Closed");
      return;
    }

    await updateDoc(doc(db, "properties", id), {
      currentBid: increment(100000), // +1 Lakh
      highestBidder: auth.currentUser.email,
    });
  };

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500 uppercase tracking-widest">
        Initialising Terminal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a]">
      <Navbar role="investor" />

      <div className="p-10 max-w-6xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <span className="bg-red-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                Live War Room
              </span>
              <h1 className="text-5xl font-black text-white mt-4 uppercase">
                {data.title}
              </h1>
              <p className="text-blue-500 font-bold text-xs uppercase mt-2">
                {data.location}
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-black uppercase">
                Time Remaining
              </p>
              <p className="text-5xl font-mono font-black mt-2 text-white">
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* IMAGE */}
            <div className="rounded-[2rem] overflow-hidden border-2 border-slate-800">
              <img
                src={data.imageUrl}
                className="w-full h-full object-cover"
                alt="Property"
              />
            </div>

            {/* BID PANEL */}
            <div className="space-y-8">
              <div className="bg-black/40 p-8 rounded-3xl border border-slate-800">
                <p className="text-slate-500 text-[10px] font-black uppercase">
                  Current Leader
                </p>
                <p className="text-2xl font-black text-blue-400 truncate">
                  {data.highestBidder || "No bids yet"}
                </p>
              </div>

              <div className="bg-black/40 p-8 rounded-3xl border border-slate-800">
                <p className="text-slate-500 text-[10px] font-black uppercase">
                  Current Valuation
                </p>
                <p className="text-6xl font-mono font-black text-emerald-400">
                  ₹{data.currentBid?.toLocaleString()}
                </p>
              </div>

              <button
                onClick={handleBid}
                disabled={timeLeft <= 0 || data.status !== "LIVE"}
                className={`w-full py-8 rounded-3xl font-black text-2xl tracking-widest transition-all ${
                  data.status === "LIVE" && timeLeft > 0
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                {data.status !== "LIVE"
                  ? "AUCTION NOT STARTED"
                  : timeLeft > 0
                  ? "PLACE BID +1L"
                  : "AUCTION CLOSED"}
              </button>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default WarRoom;
