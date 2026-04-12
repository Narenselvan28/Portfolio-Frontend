import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, Award, GraduationCap, 
  Users, Calendar, UserCircle, LogOut, ChevronRight,
  Plus, Database, ExternalLink, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ProjectForm from './ProjectForm';
import CertificationForm from './CertificationForm';
import AcademicForm from './AcademicForm';
import ParticipationForm from './ParticipationForm';
import EventForm from './EventForm';
import MessageInbox from './MessageInbox';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to}>
    <motion.div 
      whileHover={{ x: 4 }}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
        active 
          ? 'bg-white text-black shadow-lg shadow-white/5' 
          : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} strokeWidth={1.5} />
      <span className="text-sm font-medium tracking-tight">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />}
    </motion.div>
  </Link>
);

const DashboardHome = () => (
  <div className="space-y-12">
    <div className="flex items-end justify-between">
      <div className="space-y-2">
        <h2 className="text-4xl font-display font-medium text-white tracking-tight">Admin Home</h2>
        <p className="text-gray-300 text-sm font-light">Quick summary of your portfolio content.</p>
      </div>
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-white/[0.05] border border-white/[0.1] rounded-2xl">
          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Database status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-white font-medium">Operational</span>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { label: 'Projects', value: '11', icon: FolderKanban, color: 'text-blue-400' },
        { label: 'Certifications', value: '8', icon: Award, color: 'text-purple-400' },
        { label: 'Events', value: '4', icon: Calendar, color: 'text-orange-400' },
      ].map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-2xl bg-white/[0.03] ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </div>
          <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">{stat.label}</p>
          <p className="text-5xl font-display font-medium text-white">{stat.value}</p>
        </motion.div>
      ))}
    </div>

    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <Database className="w-64 h-64 text-white" />
      </div>
      <div className="max-w-xl space-y-6 relative z-10">
        <h3 className="text-2xl font-medium text-white">Media Library</h3>
        <p className="text-gray-300 leading-relaxed font-light">
          Your photos and documents are safely stored in the cloud. You can manage them here to speed up your website.
        </p>
        <button className="px-8 py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
          Manage Assets
        </button>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', to: '/admin/dashboard' },
    { icon: MessageSquare, label: 'Messages & Leads', to: '/admin/dashboard/messages' },
    { icon: FolderKanban, label: 'Projects', to: '/admin/dashboard/projects' },
    { icon: Award, label: 'Certificates', to: '/admin/dashboard/certifications' },
    { icon: GraduationCap, label: 'Education', to: '/admin/dashboard/academics' },
    { icon: Users, label: 'Participations', to: '/admin/dashboard/participations' },
    { icon: Calendar, label: 'Activities', to: '/admin/dashboard/events' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex selection:bg-white selection:text-black">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/[0.05] flex flex-col p-8 fixed h-screen overflow-y-auto">
        <div className="flex items-center gap-4 mb-16 px-6">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-medium leading-tight">Naren Selvan</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.to}
              {...item}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="pt-8 border-t border-white/[0.05] mt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 w-full text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-80 flex-1 p-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/messages" element={<MessageInbox />} />
              <Route path="/projects" element={<ProjectForm />} />
              <Route path="/certifications" element={<CertificationForm />} />
              <Route path="/academics" element={<AcademicForm />} />
              <Route path="/participations" element={<ParticipationForm />} />
              <Route path="/events" element={<EventForm />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
