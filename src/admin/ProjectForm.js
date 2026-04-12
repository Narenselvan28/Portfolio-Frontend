import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Image as ImageIcon, Link as LinkIcon, 
  ChevronDown, Save, X, Terminal, Globe, Code
} from 'lucide-react';

const ProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', longDescription: '',
    techStack: [], domain: 'Web', presentedAt: '',
    isCompetition: false, result: '', outcome: '',
    githubLink: '', liveLink: '', images: [],
    deploymentPhotos: [], testingPhotos: [],
    priorityOverride: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  };

  const handleFileUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    try {
      const { data } = await api.post('/upload', uploadData);
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...data.urls]
      }));
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
        await api.patch(`/projects/${editingId}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      resetForm();
      fetchProjects();
      setActiveTab('list');
    } catch (err) {
      console.error('Save failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', longDescription: '',
      techStack: [], domain: 'Web', presentedAt: '',
      isCompetition: false, result: '', outcome: '',
      githubLink: '', liveLink: '', images: [],
      deploymentPhotos: [], testingPhotos: [],
      priorityOverride: 0
    });
    setEditingId(null);
  };

  const handleEdit = (project) => {
    setFormData(project);
    setEditingId(project._id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm deletion of this project node?')) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-medium text-white tracking-tight">Project Matrix</h2>
          <p className="text-gray-300 text-sm font-light">Management of industrial and personal research nodes.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Archive
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('form'); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'form' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Terminal Add
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((p) => (
            <motion.div 
              key={p._id}
              layout
              className="group bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all flex items-center gap-8"
            >
              <div className="w-24 h-24 rounded-2xl bg-white/[0.03] overflow-hidden shrink-0 flex items-center justify-center">
                {p.images?.[0] ? (
                  <img src={p.images[0]} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" alt="" />
                ) : (
                  <Code className="w-8 h-8 text-gray-700" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{p.domain}</span>
                <h3 className="text-xl font-medium text-white">{p.title}</h3>
                <p className="text-gray-400 text-sm font-light line-clamp-1">{p.description}</p>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(p)} className="p-3 hover:bg-white hover:text-black rounded-xl transition-all">
                  <Save className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-3 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
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
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Node Title</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700 font-light"
                  placeholder="e.g. Machine Health Monitor"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Brief Narrative</label>
                <textarea
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700 font-light min-h-[120px]"
                  placeholder="One sentence system overview..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Domain</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 appearance-none font-light cursor-pointer"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  >
                    {['Web', 'ML', 'IoT', 'Full Stack', 'Frontend', 'Tools', 'Foundational', 'ML + IoT'].map(d => (
                      <option key={d} value={d} className="bg-[#050505]">{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Priority Node</label>
                  <input
                    type="number"
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 transition-all font-light"
                    value={formData.priorityOverride}
                    onChange={(e) => setFormData({...formData, priorityOverride: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">System Components (Tech Stack)</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700 font-light"
                  placeholder="React, IoT, ESP32 (comma separated)"
                  value={formData.techStack.join(', ')}
                  onChange={(e) => setFormData({...formData, techStack: e.target.value.split(',').map(s => s.trim())})}
                />
              </div>

              <div className="space-y-2 text-white">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Asset Upload (Visuals)</label>
                <div className="relative">
                  <input
                    type="file" multiple
                    onChange={(e) => handleFileUpload(e, 'images')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full bg-white/[0.03] border-2 border-dashed border-white/[0.05] rounded-2xl py-12 flex flex-col items-center justify-center gap-4 group-hover:border-white/10 transition-all">
                    <ImageIcon className="w-8 h-8 text-gray-600" />
                    <span className="text-xs text-gray-400 font-mono tracking-widest uppercase font-bold">
                      {uploading ? 'Synching assets...' : 'Deploy new visuals'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/[0.05] flex gap-4">
            <button
              type="submit"
              className="px-12 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-white/10 hover:bg-gray-200 transition-all"
            >
              Commit Node Changes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-12 py-4 bg-white/[0.03] text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all"
            >
              Cancel Operation
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default ProjectForm;
