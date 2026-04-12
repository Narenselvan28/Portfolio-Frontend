import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Plus, Save, Image as ImageIcon, Users } from 'lucide-react';

const EventForm = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '', role: '', description: '',
    insights: '', participantCount: 0, 
    date: '', images: []
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await api.get('/events');
    setEvents(data);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    try {
      const { data } = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/events/${editingId}`, formData);
      } else {
        await api.post('/events', formData);
      }
      resetForm();
      fetchEvents();
      setActiveTab('list');
    } catch (err) {
      console.error('Save failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', role: '', description: '',
      insights: '', participantCount: 0, 
      date: '', images: []
    });
    setEditingId(null);
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingId(event._id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event node?')) {
      await api.delete(`/events/${id}`);
      fetchEvents();
    }
  };

  return (
    <div className="space-y-12 text-white">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-medium tracking-tight">Leadership & Ventures</h2>
          <p className="text-gray-300 text-sm font-light">Managing organizational impact and startup milestones.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Milestones
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('form'); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'form' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Add Venture
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 gap-8">
          {events.map((e) => (
            <motion.div 
              key={e._id}
              layout
              className="group bg-white/[0.02] border border-white/[0.05] p-10 rounded-[3rem] hover:bg-white/[0.04] transition-all flex items-center gap-10"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center shrink-0">
                <Calendar className="w-8 h-8 text-orange-400 opacity-50" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">{e.role}</span>
                <h3 className="text-2xl font-medium text-white">{e.title}</h3>
                <p className="text-gray-400 text-sm font-light line-clamp-1">{e.description}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(e)} className="text-gray-700 hover:text-white transition-colors"><Save className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(e._id)} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Title</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Leadership Role</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Date</label>
                  <input
                    type="date"
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                    value={formData.date ? formData.date.split('T')[0] : ''}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Impact Count</label>
                  <input
                    type="number"
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                    value={formData.participantCount}
                    onChange={(e) => setFormData({...formData, participantCount: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Detailed Insights</label>
                <textarea
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl min-h-[150px]"
                  value={formData.insights}
                  onChange={(e) => setFormData({...formData, insights: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Asset Matrix (Photos)</label>
                <div className="relative">
                  <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full bg-white/[0.03] border-2 border-dashed border-white/[0.05] rounded-2xl py-12 flex flex-col items-center justify-center gap-4">
                    <ImageIcon className="w-8 h-8 text-gray-600" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{uploading ? 'Syncing...' : 'Deploy Visuals'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <button type="submit" className="px-12 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">Synchronize Milestone</button>
            <button type="button" onClick={() => setActiveTab('list')} className="px-12 py-4 bg-white/[0.03] text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">Abort</button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default EventForm;
