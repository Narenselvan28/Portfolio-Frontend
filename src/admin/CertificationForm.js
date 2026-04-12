import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Award, Trash2, Plus, Save, Image as ImageIcon, Calendar } from 'lucide-react';

const CertificationForm = () => {
  const [certs, setCerts] = useState([]);
  const [formData, setFormData] = useState({
    title: '', issuer: '', category: 'Web', 
    date: '', skills: [], takeaway: '',
    certificateImage: '', link: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    const { data } = await api.get('/certifications');
    setCerts(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('images', file);
    try {
      const { data } = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, certificateImage: data.urls[0] }));
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
    setFormData({
      title: '', issuer: '', category: 'Web', 
      date: '', skills: [], takeaway: '',
      certificateImage: '', link: ''
    });
    setEditingId(null);
  };

  const handleEdit = (cert) => {
    setFormData(cert);
    setEditingId(cert._id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this certification node?')) {
      await api.delete(`/certifications/${id}`);
      fetchCerts();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-medium text-white tracking-tight">Expert Validations</h2>
          <p className="text-gray-300 text-sm font-light">Management of verified academic and professional credentials.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Registry
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('form'); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'form' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Add Credential
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certs.map((c) => (
            <motion.div 
              key={c._id}
              layout
              className="group bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all flex items-start gap-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center shrink-0">
                <Award className="w-8 h-8 text-purple-400 opacity-50" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{c.issuer}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(c)} className="text-gray-300 hover:text-white transition-colors"><Save className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c._id)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-white">{c.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono tracking-widest truncate">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-4">Credential Title</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-4">Issuing Authority</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20"
                  value={formData.issuer}
                  onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-4">Issued Date</label>
                  <input
                    type="date"
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 font-light"
                    value={formData.date ? formData.date.split('T')[0] : ''}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-4">Category</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {['Web', 'ML', 'IoT', 'Backend', 'Full Stack'].map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-4">Competencies (comma separated)</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  value={formData.skills.join(', ')}
                  onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-4">Verified Proof (Document)</label>
                <div className="relative">
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full bg-white/[0.03] border-2 border-dashed border-white/[0.05] rounded-2xl py-12 flex flex-col items-center justify-center gap-4">
                    <ImageIcon className="w-8 h-8 text-gray-700" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      {uploading ? 'Syncing...' : 'Upload Transcript'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/[0.05] flex gap-4">
            <button type="submit" className="px-12 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">Submit Node</button>
            <button type="button" onClick={() => setActiveTab('list')} className="px-12 py-4 bg-white/[0.03] text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">Abort</button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default CertificationForm;
