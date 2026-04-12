import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import api from '../api';

const PortfolioModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platformType: 'Full Stack MERN',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
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
      }, 2000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-8 right-8 z-10">
              <button 
                onClick={onClose} 
                className="group p-3 bg-gray-50 hover:bg-black rounded-full transition-all duration-300 shadow-sm"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            <div className="p-12 space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[9px] text-white uppercase tracking-[0.2em] font-bold rounded-full">
                  Collaboration Hub
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-display font-medium text-black tracking-tighter leading-tight">Build with Naren</h2>
                  <p className="text-gray-500 text-sm font-light">Initiate your professional portfolio architecture.</p>
                </div>
              </div>

              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium">Request Transmitted</h3>
                  <p className="text-gray-500 text-sm">Naren has been notified via SMS. Look out for a response soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-black">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-2">Full Name</label>
                      <input 
                        required
                        className="w-full bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl focus:outline-none focus:border-black transition-all text-sm"
                        placeholder="Naren Selvan"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 text-black">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-2">Email Identity</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl focus:outline-none focus:border-black transition-all text-sm"
                        placeholder="naren@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-black">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-2">Mobile Contact (Optional)</label>
                    <input 
                      type="tel"
                      className="w-full bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl focus:outline-none focus:border-black transition-all text-sm"
                      placeholder="+91 XXXX XXXX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2 text-black">
                     <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-2">Platform Engine</label>
                     <select 
                       className="w-full bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl focus:outline-none focus:border-black transition-all text-sm appearance-none"
                       value={formData.platformType}
                       onChange={(e) => setFormData({...formData, platformType: e.target.value})}
                     >
                       <option value="Full Stack MERN">Full Stack MERN</option>
                       <option value="IoT Interface">IoT Interface</option>
                       <option value="ML Dashboard">ML Dashboard</option>
                       <option value="SaaS Platform">SaaS Platform</option>
                     </select>
                  </div>

                  <div className="space-y-2 text-black">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-2">Objective Notes</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl focus:outline-none focus:border-black transition-all text-sm resize-none"
                      placeholder="Describe your vision..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                        Transmitting...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Initiate Build Request
                      </>
                    )}
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
