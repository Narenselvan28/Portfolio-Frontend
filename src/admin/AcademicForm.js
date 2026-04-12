import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { GraduationCap, Trash2, Plus, Save, Image as ImageIcon } from 'lucide-react';

const AcademicForm = () => {
  const [academics, setAcademics] = useState([]);
  const [formData, setFormData] = useState({
    institution: '', degree: '', endYear: '',
    grade: '', description: '', achievements: [],
    documents: []
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAcademics();
  }, []);

  const fetchAcademics = async () => {
    const { data } = await api.get('/academics');
    setAcademics(data);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    try {
      const { data } = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...data.urls] }));
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
        await api.patch(`/academics/${editingId}`, formData);
      } else {
        await api.post('/academics', formData);
      }
      resetForm();
      fetchAcademics();
      setActiveTab('list');
    } catch (err) {
      console.error('Save failed');
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '', degree: '', endYear: '',
      grade: '', description: '', achievements: [],
      documents: []
    });
    setEditingId(null);
  };

  const handleEdit = (academic) => {
    setFormData(academic);
    setEditingId(academic._id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this academic node?')) {
      await api.delete(`/academics/${id}`);
      fetchAcademics();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2 text-white">
          <h2 className="text-4xl font-display font-medium tracking-tight">Academic Pedigree</h2>
          <p className="text-gray-300 text-sm font-light">Institutional credentials and scholastic achievements.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
          >
            Directory
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('form'); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'form' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
          >
            Add Degree
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 gap-8">
          {academics.map((a) => (
            <motion.div 
              key={a._id}
              layout
              className="group bg-white/[0.02] border border-white/[0.05] p-10 rounded-[3rem] hover:bg-white/[0.04] transition-all flex items-center gap-10"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/[0.03] flex items-center justify-center shrink-0">
                <GraduationCap className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
              <div className="flex-1 space-y-2 text-white">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">End — {a.endYear}</span>
                <h3 className="text-2xl font-medium">{a.degree}</h3>
                <p className="text-gray-400 font-light truncate">{a.institution}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(a)} className="text-gray-400 hover:text-white transition-colors"><Save className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(a._id)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-12 space-y-12 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-2 text-white">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Institution Name</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:border-white/20 outline-none"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Degree / Certification</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 self-start">
               <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Year of Finish</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] px-8 py-4 rounded-2xl"
                  value={formData.endYear}
                  onChange={(e) => setFormData({...formData, endYear: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">Grade Index</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] px-8 py-4 rounded-2xl"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <button type="submit" className="px-12 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-white/10 hover:bg-gray-200 transition-all">Synchronize Degree</button>
            <button type="button" onClick={() => setActiveTab('list')} className="px-12 py-4 bg-white/[0.03] text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">Abort</button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default AcademicForm;
