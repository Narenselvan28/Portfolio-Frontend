import React, { useState, useEffect } from 'react';
import api, { getBackendStatus } from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendMode, setBackendMode] = useState('checking...');
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const mode = await getBackendStatus();
      setBackendMode(mode);
    };
    checkStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (backendMode === 'static') {
        // Fallback login for static mode
        if (username === 'admin' && password === 'adminpass123') {
          localStorage.setItem('adminToken', 'static-token');
          localStorage.setItem('backendMode', 'static');
          navigate('/admin/dashboard');
        } else {
          setError('Invalid credentials (Static Mode).');
        }
      } else {
        const { data } = await api.post('/admin/login', { username, password });
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('backendMode', 'dynamic');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || !err.response) {
        // Auto-switch to static if call fails during login
        setBackendMode('static');
        setError('Backend unreachable. Switched to Static Fallback. Try again.');
      } else {
        setError('Invalid credentials synchronization failure.');
      }
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-6 relative"
          >
            <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1">
              {backendMode === 'dynamic' ? (
                <div className="bg-green-500/20 p-1.5 rounded-full border border-green-500/30">
                  <Wifi className="w-3 h-3 text-green-500" />
                </div>
              ) : (
                <div className="bg-orange-500/20 p-1.5 rounded-full border border-orange-500/30">
                  <WifiOff className="w-3 h-3 text-orange-500" />
                </div>
              )}
            </div>
          </motion.div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight">Admin Console</h1>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded border ${
              backendMode === 'dynamic' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-orange-500/30 text-orange-500 bg-orange-500/5'
            }`}>
              {backendMode} mode
            </span>
          </div>
          <p className="text-gray-500 text-sm font-light tracking-wide pt-2">Enter credentials to access the nexus.</p>
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
              className="text-red-400 text-[11px] font-mono text-center tracking-wider bg-red-400/5 py-2 rounded-lg border border-red-400/10"
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
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-medium">Terminal v2.1.0 — {backendMode === 'static' ? 'Local Vault Active' : 'Remote Nexus Active'}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
