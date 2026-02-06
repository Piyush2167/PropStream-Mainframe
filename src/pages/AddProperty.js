import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const AddProperty = () => {
  const [formData, setFormData] = useState({ title: '', location: '', basePrice: '', description: '' });
  const [image, setImage] = useState("");

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Save to MongoDB
      const res = await axios.post('http://localhost:5000/api/properties', { ...formData, imageUrl: image });
      
      // 2. Initialize in Firestore for Real-time bidding
      await setDoc(doc(db, "properties", res.data.data._id), {
        title: formData.title,
        currentBid: Number(formData.basePrice),
        highestBidder: 'No Bids',
        imageUrl: image,
        status: 'pending' 
      });

      alert("Asset Onboarded!");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-[#05070a]">
      <Navbar role="admin" />
      <div className="flex justify-center p-10">
        <form onSubmit={handleSubmit} className="bg-slate-900 p-10 rounded-[3rem] w-full max-w-2xl border border-slate-800 space-y-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Initialize Asset</h2>
          <input type="text" placeholder="Title" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="text" placeholder="Location" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none" onChange={e => setFormData({...formData, location: e.target.value})} />
          <input type="number" placeholder="Base Price" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none" onChange={e => setFormData({...formData, basePrice: e.target.value})} />
          <textarea placeholder="Description" className="w-full p-4 bg-slate-800 rounded-xl text-white outline-none h-32" onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="file" onChange={handleImage} className="text-slate-500 text-xs" />
          <button className="w-full py-4 bg-blue-600 text-white font-black rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/20">Commit to Mainframe</button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;