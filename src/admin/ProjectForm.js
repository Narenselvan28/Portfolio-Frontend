import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { 
  Trash2, Image as ImageIcon, Save, Code,
  Monitor, HardDrive, FlaskConical
} from 'lucide-react';

const ProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', longDescription: '',
    techStack: [], domain: 'Web App', presentedAt: '',
    isCompetition: false, result: '', outcome: '',
    githubLink: '', liveLink: '', images: [],
    deploymentPhotos: [], testingPhotos: [],
    priorityOverride: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [uploadingField, setUploadingField] = useState(null); // 'images', 'deploymentPhotos', 'testingPhotos'

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
    setUploadingField(field);
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
      setUploadingField(null);
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
      techStack: [], domain: 'Web App', presentedAt: '',
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
    if (window.confirm('Are you sure you want to delete this project?')) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  const ImageSection = ({ title, field, icon: Icon, description }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 ml-4">
        <Icon className="w-4 h-4 text-gray-400" />
        <div>
          <label className="text-[10px] text-white uppercase tracking-widest font-bold block">{title}</label>
          <p className="text-[9px] text-gray-500 uppercase tracking-tighter">{description}</p>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="file" multiple
          onChange={(e) => handleFileUpload(e, field)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-full bg-white/[0.03] border-2 border-dashed border-white/[0.05] rounded-2xl py-8 flex flex-col items-center justify-center gap-2 hover:border-white/10 transition-all">
          <ImageIcon className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase font-bold">
            {uploadingField === field ? 'Uploading...' : 'Add Photos'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {formData[field].map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={img} className="w-full h-full object-cover" alt="" />
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }))}
              className="absolute inset-0 bg-red-500/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-medium text-white tracking-tight">Full Project List</h2>
          <p className="text-gray-300 text-sm font-light">List of your works and research.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            My Projects
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('form'); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'form' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Add New Project
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
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">{p.domain}</span>
                <h3 className="text-2xl font-medium text-white">{p.title}</h3>
                <p className="text-gray-400 text-sm font-light line-clamp-1">{p.description}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(p)} className="p-3 hover:bg-white hover:text-black rounded-xl transition-all">
                  <Save className="w-5 h-5 text-gray-400 group-hover:text-inherit" />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-3 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
                  <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-inherit" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Metadata */}
            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Project Title</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700 font-light"
                  placeholder="e.g. Smart Gardening System"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Small Summary</label>
                <textarea
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700 font-light min-h-[80px]"
                  placeholder="One sentence description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Category</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl focus:outline-none focus:border-white/20 appearance-none font-light cursor-pointer"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  >
                    {['Web App', 'Machine Learning', 'IoT', 'Full Stack', 'Other'].map(d => (
                      <option key={d} value={d} className="bg-[#050505]">{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">List Order</label>
                  <input
                    type="number"
                    className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                    value={formData.priorityOverride}
                    onChange={(e) => setFormData({...formData, priorityOverride: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-4">Technologies Used</label>
                <input
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-white px-8 py-4 rounded-2xl"
                  placeholder="e.g. React, Python, Arduino"
                  value={formData.techStack.join(', ')}
                  onChange={(e) => setFormData({...formData, techStack: e.target.value.split(',').map(s => s.trim())})}
                />
              </div>
            </div>

            {/* Right Column: Photos Categorization */}
            <div className="bg-white/[0.01] border border-white/[0.03] p-10 rounded-[2.5rem] space-y-12">
              <ImageSection 
                title="UI & Design Preview" 
                field="images" 
                icon={Monitor}
                description="Screenshots and high-fidelity visuals"
              />
              
              <ImageSection 
                title="Hardware & Deployment" 
                field="deploymentPhotos" 
                icon={HardDrive}
                description="Physical setups and production photos"
              />

              <ImageSection 
                title="Testing & Analytics" 
                field="testingPhotos" 
                icon={FlaskConical}
                description="Live tests and data analysis screens"
              />
            </div>
          </div>

          <div className="pt-12 border-t border-white/[0.05] flex gap-4">
            <button
              type="submit"
              className="px-12 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-white/10 hover:bg-gray-200 transition-all font-mono"
            >
              {editingId ? 'Push Changes to Live' : 'Deploy This Project'}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); setActiveTab('list'); }}
              className="px-12 py-4 bg-white/[0.03] text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all font-mono"
            >
              Discard Operation
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default ProjectForm;
