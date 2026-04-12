import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Calendar, Phone, MessageSquare, Clock } from 'lucide-react';

const MessageInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/admin/messages');
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Archive this message permanently?')) {
      await api.delete(`/admin/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    }
  };

  if (loading) return <div className="text-white font-mono text-xs opacity-50">Syncing inbox...</div>;

  return (
    <div className="space-y-12 text-white">
      <div className="space-y-2">
        <h2 className="text-4xl font-display font-medium tracking-tight">Lead Matrix</h2>
        <p className="text-gray-300 text-sm font-light">Incoming collaboration requests and network nodes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="py-20 text-center bg-white/[0.02] border border-white/[0.05] rounded-[3rem]">
              <MessageSquare className="w-12 h-12 text-gray-800 mx-auto mb-4" />
              <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No active transmissions</p>
            </div>
          ) : (
            messages.map((m) => (
              <motion.div 
                key={m._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white/[0.02] border border-white/[0.05] p-10 rounded-[3rem] hover:bg-white/[0.04] transition-all flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">
                      {new Date(m.createdAt).toLocaleDateString()} at {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-tighter font-bold text-blue-400">
                      {m.platformType}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-white">{m.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                       <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs">
                        <Mail className="w-3 h-3" /> {m.email}
                      </a>
                      {m.phone && (
                        <span className="flex items-center gap-2 text-gray-400 text-xs text-white">
                          <Phone className="w-3 h-3" /> {m.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed font-light bg-black/20 p-6 rounded-2xl border border-white/[0.03]">
                    {m.message}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(m._id)}
                  className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all self-end md:self-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageInbox;
