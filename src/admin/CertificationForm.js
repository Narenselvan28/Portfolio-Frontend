import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Award, Trash2, Save, Calendar } from 'lucide-react';

const CertificationForm = () => {
  const [certs, setCerts] = useState([]);
  const [formData, setFormData] = useState({
    title: '', issuer: '', date: '', link: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    const { data } = await api.get('/certifications');
    setCerts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/certifications/${editingId}`, formData);
      } else {
        await api.post('/certifications', formData);
      }
      resetForm();
      fetchCerts();
      setActiveTab('list');
    } catch (err) {
      console.error('Save failed');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', issuer: '', date: '', link: '' });
    setEditingId(null);
  };

  const handleEdit = (c) => {
    setFormData(c);
    setEditingId(c._id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this certificate?')) {
      await api.delete(`/certifications/${id}`);
      fetchCerts();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-medium text-white tracking-tight">My Certificates</h2>
          <p className="text-gray-300 text-sm font-light">Manage your professional and academic certifications.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            List
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('form'); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'form' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Add New
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((c) => (
            <motion.div 
              key={c._id}
              layout
              className="group bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all relative"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/[0.03] rounded-xl">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(c)} className="p-2 text-gray-400 hover:text-white transition-colors"><Save className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">{c.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">{c.issuer}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-300 font-mono tracking-widest">
                  <Calendar className="w-3 h-3" /> {new Date(c.date).toLocaleDateString()}
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
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Certificate Name</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Issued By</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  placeholder="e.g. Amazon Web Services"
                  value={formData.issuer}
                  onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Date Issued</label>
                <input
                  type="date"
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  value={formData.date ? formData.date.split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Credential URL (Optional)</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/[0.05] flex gap-4">
            <button type="submit" className="px-12 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-white/10 hover:bg-gray-200 transition-all">Save Certificate</button>
            <button type="button" onClick={() => { resetForm(); setActiveTab('list'); }} className="px-12 py-4 bg-white/[0.03] text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">Cancel</button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default CertificationForm;
