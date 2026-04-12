import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Trash2, Save, MapPin } from 'lucide-react';

const ParticipationForm = () => {
  const [participations, setParticipations] = useState([]);
  const [formData, setFormData] = useState({
    title: '', organization: '', result: '',
    date: '', takeaway: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    const { data } = await api.get('/participations');
    setParticipations(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/participations/${editingId}`, formData);
      } else {
        await api.post('/participations', formData);
      }
      resetForm();
      fetchParticipations();
      setActiveTab('list');
    } catch (err) {
      console.error('Save failed');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', organization: '', result: '', date: '', takeaway: '' });
    setEditingId(null);
  };

  const handleEdit = (p) => {
    setFormData(p);
    setEditingId(p._id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this participation record?')) {
      await api.delete(`/participations/${id}`);
      fetchParticipations();
    }
  };

  return (
    <div className="space-y-12 text-white">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-medium tracking-tight text-white">Competitive Presence</h2>
          <p className="text-gray-400 text-sm font-light">Events, hackathons, and symposium history.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            History
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('form'); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'form' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Add Record
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {participations.map((p) => (
            <motion.div 
              key={p._id}
              layout
              className="group bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">{new Date(p.date).getFullYear()}</span>
                  <div className="flex gap-2 text-gray-300">
                    <button onClick={() => handleEdit(p)} className="hover:text-white transition-colors"><Save className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p._id)} className="hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="text-lg font-medium leading-tight text-white">{p.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono tracking-widest">
                  <MapPin className="w-3 h-3" /> {p.organization || 'Various'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-12 space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-4">Event Title</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-4">Institution / Organizer</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2 text-white">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-4">Date</label>
                  <input
                    type="date"
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                    value={formData.date ? formData.date.split('T')[0] : ''}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-4">Achievement / Role</label>
                  <input
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                    value={formData.result}
                    onChange={(e) => setFormData({...formData, result: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-4">Key Takeaway</label>
                <textarea
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl min-h-[100px]"
                  value={formData.takeaway}
                  onChange={(e) => setFormData({...formData, takeaway: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <button type="submit" className="px-12 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">Archive Attendance</button>
            <button type="button" onClick={() => setActiveTab('list')} className="px-12 py-4 bg-white/[0.03] text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">Abort</button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default ParticipationForm;
