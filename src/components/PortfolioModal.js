import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import api from '../api';

const PortfolioModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    platformType: 'Full Stack MERN', message: ''
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
    }
    return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', phone: '', platformType: 'Full Stack MERN', message: '' });
      }, 2500);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg h-full md:h-auto bg-white rounded-none md:rounded-[3rem] shadow-2xl overflow-y-auto border border-stone-200/80"
          >
            <div className="sticky top-6 right-6 md:absolute md:top-10 md:right-10 z-20 flex justify-end px-6 md:px-0">
              <button 
                onClick={onClose} 
                className="p-3 bg-stone-100 hover:bg-[#0F172A] text-stone-500 hover:text-white rounded-full transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 md:p-12 space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F172A] text-[9px] text-white uppercase tracking-[0.2em] font-bold rounded-full">
                  Collaboration Hub
                </div>
                <div className="space-y-1">
                  <h2 className="text-4xl font-display font-medium text-[#0F172A]">Build with Naren</h2>
                  <p className="text-stone-500 text-sm font-light">Initiate your next masterpiece.</p>
                </div>
              </div>

              {status === 'success' ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[#0F172A]">Transmitted!</h3>
                  <p className="text-stone-500 text-sm">Response coming soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Naren Selvan' },
                      { label: 'Email', key: 'email', type: 'email', placeholder: 'naren@example.com' },
                    ].map(field => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[10px] text-stone-500 uppercase tracking-widest font-bold ml-2">{field.label}</label>
                        <input 
                          required type={field.type}
                          className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:border-[#0F172A] transition-all text-sm text-[#0F172A]"
                          value={formData[field.key]}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-stone-500 uppercase tracking-widest font-bold ml-2">Objective</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:border-[#0F172A] transition-all text-sm appearance-none text-[#0F172A]"
                      value={formData.platformType}
                      onChange={(e) => setFormData({...formData, platformType: e.target.value})}
                    >
                      <option value="Full Stack MERN">Full Stack MERN</option>
                      <option value="IoT Interface">IoT Interface</option>
                      <option value="ML Dashboard">ML Dashboard</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-stone-500 uppercase tracking-widest font-bold ml-2">Notes</label>
                    <textarea 
                      required rows={4}
                      className="w-full bg-stone-50 border border-stone-200 px-5 py-4 rounded-xl focus:outline-none focus:border-[#0F172A] transition-all text-sm resize-none text-[#0F172A]"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Share your vision..."
                    />
                  </div>

                  <button 
                    type="submit" disabled={status === 'sending'}
                    className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-4 rounded-xl font-bold text-[11px] tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-[#0F172A]/10"
                  >
                    {status === 'sending' ? 'Transmitting...' : <><Send className="w-4 h-4" /> Initiate Hub</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioModal;
