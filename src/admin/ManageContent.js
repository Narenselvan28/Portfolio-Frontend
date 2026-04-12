import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ManageContent = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = [
    { id: 'projects', name: 'Projects', endpoint: '/projects' },
    { id: 'events', name: 'Events', endpoint: '/events' },
    { id: 'certifications', name: 'Certifications', endpoint: '/certifications' },
    { id: 'academics', name: 'Academics', endpoint: '/academics' },
    { id: 'participations', name: 'Participations', endpoint: '/participations' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(currentTab.endpoint);
      setItems(data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      alert(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;
    try {
      await api.delete(`${currentTab.endpoint}/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed');
    }
  };

  const handleEdit = (id) => {
    const type = activeTab.slice(0, -1); // remove 's'
    navigate(`/admin/dashboard/edit-${type}/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
        <button 
          onClick={() => navigate(`/admin/dashboard/add-${activeTab.slice(0, -1)}`)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
              No {activeTab} found.
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-medium text-gray-200 truncate">{item.title || item.degree || item.competitionName || 'Untitled'}</h3>
                  <p className="text-sm text-gray-500 truncate">{item.description || item.provider || item.institution || item.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEdit(item._id)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageContent;
