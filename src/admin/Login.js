import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials synchronization failure.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-white selection:text-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="text-center mb-12 space-y-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight">Admin Console</h1>
          <p className="text-gray-500 text-sm font-light tracking-wide">Enter credentials to access the nexus.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-white/[0.02] border border-white/[0.05] text-white px-12 py-4 rounded-xl focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all placeholder:text-gray-700 text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/[0.02] border border-white/[0.05] text-white px-12 py-4 rounded-xl focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all placeholder:text-gray-700 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-[11px] font-mono text-center tracking-wider"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-white text-black font-medium py-4 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm tracking-tight"
          >
            {isLoading ? 'Synchronizing...' : 'Authorize Access'}
          </motion.button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-medium">Terminal v2.0.4 — Secured by RSA</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
