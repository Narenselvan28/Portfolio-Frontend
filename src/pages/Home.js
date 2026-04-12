import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, Code, User, Activity, Globe, 
  Sparkles, Layers, ChevronRight, GraduationCap,
  Cpu, Zap, Compass, Star, Award, Coffee, 
  Feather, Grid, Box, Focus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import profileImg from '../assets/img 2.png';
import PortfolioModal from '../components/PortfolioModal';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({ 
    personalInfo: null, 
    achievements: [], 
    featuredProject: null, 
    loading: true 
  });
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/projects')
        ]);
        
        setData({ 
          personalInfo: profileRes.data,
          achievements: profileRes.data?.achievements || [], 
          featuredProject: projectsRes.data[0] || null, 
          loading: false 
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (data.loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full"
      />
      <p className="mt-4 text-xs text-gray-400 font-mono tracking-wider">Loading experience...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-white overflow-x-hidden"
    >
      {/* Monochromatic Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-50" />
        
        {/* Animated geometric pattern */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-[0.03]"
        >
          <Grid className="w-full h-full" />
        </motion.div>

        {/* Moving diagonal lines */}
        <motion.div 
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[200%] h-full"
        >
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-10" style={{ left: '20%' }} />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-10" style={{ left: '50%' }} />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-10" style={{ left: '80%' }} />
        </motion.div>

        {/* Floating monochromatic circles - Reduced density for performance */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              opacity: [0.01, 0.03, 0.01]
            }}
            transition={{ 
              duration: 12 + i * 2, 
              repeat: Infinity, 
              delay: i * 1,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-gray-800"
            style={{
              width: 100 + i * 30,
              height: 100 + i * 30,
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
              filter: 'blur(60px)'
            }}
          />
        ))}

        {/* Subtle scanning line effect - Slower for performance */}
        <motion.div 
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-10"
        />

        {/* Mouse-following spotlight - Smoother spring */}
        <motion.div 
          animate={{ 
            x: mousePosition.x - 200,
            y: mousePosition.y - 200,
          }}
          transition={{ type: "spring", damping: 40, stiffness: 60 }}
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-gray-100 to-transparent opacity-[0.05] blur-3xl pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32 pb-28 pt-32 relative z-10">
        
        {/* Hero Section - Enhanced */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { 
                opacity: 1, 
                transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
              }
            }}
            className="lg:col-span-6 space-y-10"
          >
            <div className="space-y-8">
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                />
                <span className="text-[10px] tracking-[0.2em] uppercase text-gray-600 font-mono font-medium">Available for work</span>
              </motion.div>
              
              <motion.h1 
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-black leading-[0.9] tracking-tighter"
              >
                Naren
                <br />
                <span className="relative inline-block">
                  Selvan
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-black to-transparent"
                  />
                </span>
              </motion.h1>
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 text-gray-500"
              >
                <Cpu className="w-4 h-4" />
                <span className="text-sm font-mono tracking-wide">Building with intelligence.</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </motion.div>
            </div>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="text-lg text-gray-600 max-w-lg leading-relaxed font-body"
            >
              {data.personalInfo?.summary}
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="pt-4 flex flex-wrap gap-4 items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/projects" 
                  className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase transition-all duration-300 hover:gap-5 hover:shadow-2xl"
                >
                  View Work <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="group inline-flex items-center gap-3 bg-white border border-gray-200 text-black px-8 py-4 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-2xl hover:bg-black hover:text-white"
                >
                  Build with Naren <Sparkles className="w-4 h-4" />
                </button>
              </motion.div>
              <motion.a 
                whileHover={{ x: 5 }}
                href={`mailto:${data.personalInfo?.socials?.email}`} 
                className="inline-flex items-center gap-2 text-gray-400 hover:text-black text-[10px] font-mono font-bold tracking-widest uppercase transition-colors"
              >
                Get in touch
                <ArrowUpRight className="w-3 h-3" />
              </motion.a>
            </motion.div>
          </motion.div>

          <PortfolioModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

          {/* Enhanced Profile Photo Section - Zoomed & More Attractive */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-6 relative flex items-center justify-center py-16"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
          >
            {/* Enhanced Orbital Rings with monochromatic theme */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[100%] aspect-square border border-dashed border-gray-300 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute w-[115%] aspect-square border border-black/[0.03] rounded-full"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute w-[130%] aspect-square border border-gray-100 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
              className="absolute w-[145%] aspect-square border border-dashed border-gray-200 rounded-full"
            />

            {/* Enhanced Orbiting Elements */}
            {[
              { Icon: Code, delay: 0, duration: 18, offset: 1.15, label: "React" },
              { Icon: Zap, delay: 4, duration: 22, offset: 1.25, label: "Fast" },
              { Icon: Globe, delay: 8, duration: 20, offset: 1.35, label: "Global" },
              { Icon: Award, delay: 12, duration: 24, offset: 1.45, label: "Awarded" },
              { Icon: Feather, delay: 16, duration: 28, offset: 1.2, label: "Creative" },
              { Icon: Box, delay: 20, duration: 26, offset: 1.3, label: "3D" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                animate={{ rotate: 360 }}
                transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none"
                style={{ transform: `scale(${item.offset})` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div 
                    whileHover={{ scale: 1.3 }}
                    className="p-2.5 bg-white border border-gray-200 rounded-full shadow-lg group cursor-pointer"
                  >
                    <item.Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-black transition-colors" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[6px] font-mono tracking-wider text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Main Image Container - ZOOMED */}
            <div className="relative w-full max-w-[90%] md:max-w-md aspect-square rounded-full p-3 bg-white shadow-2xl shadow-black/5 group">
              {/* Animated gradient border with pulse effect */}
              <motion.div 
                animate={{ 
                  background: isHoveringProfile 
                    ? ['linear-gradient(135deg, #000 0%, #333 50%, #000 100%)']
                    : ['linear-gradient(135deg, #e5e5e5 0%, #f5f5f5 50%, #e5e5e5 100%)']
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full p-[3px]"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <div className="relative w-full h-full overflow-hidden rounded-full">
                    {/* ZOOMED Image - scale increased */}
                    <motion.img 
                      animate={{ 
                        scale: isHoveringProfile ? 1.12 : 1.05,
                      }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
                      src={profileImg} 
                      alt="Naren Selvan" 
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Enhanced overlay effect on hover */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHoveringProfile ? 0.15 : 0 }}
                      className="absolute inset-0 bg-gradient-to-tr from-black via-black/50 to-transparent"
                    />
                    
                    {/* Lens flare effect */}
                    <motion.div 
                      animate={{ 
                        x: isHoveringProfile ? ["0%", "100%"] : "0%",
                        opacity: isHoveringProfile ? [0, 0.3, 0] : 0
                      }}
                      transition={{ duration: 1.5, repeat: isHoveringProfile ? Infinity : 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg]"
                      style={{ width: '50%' }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Decorative rings around image with animation */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-5 pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <motion.div 
                    animate={{ height: [8, 12, 8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 bg-black/30 rounded-full"
                    style={{ height: '10px' }}
                  />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <motion.div 
                    animate={{ height: [8, 12, 8] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    className="w-1 bg-black/30 rounded-full"
                    style={{ height: '10px' }}
                  />
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <motion.div 
                    animate={{ width: [8, 12, 8] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.25 }}
                    className="h-1 bg-black/30 rounded-full"
                    style={{ width: '10px' }}
                  />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <motion.div 
                    animate={{ width: [8, 12, 8] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                    className="h-1 bg-black/30 rounded-full"
                    style={{ width: '10px' }}
                  />
                </div>
              </motion.div>

              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-black/10 rounded-tl-2xl" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-black/10 rounded-tr-2xl" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-black/10 rounded-bl-2xl" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-black/10 rounded-br-2xl" />

              {/* Enhanced Floating badges */}
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute -left-10 top-1/4 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-xl hidden lg:flex items-center gap-2.5"
              >
                <motion.div 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                />
                <span className="text-[10px] font-mono tracking-wider font-medium">Creative Technologist</span>
              </motion.div>

              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="absolute -right-10 bottom-1/4 bg-black text-white border border-gray-800 rounded-full px-5 py-2.5 shadow-xl hidden lg:flex items-center gap-2.5"
              >
                <Feather className="w-3 h-3" />
                <span className="text-[10px] font-mono tracking-wider font-medium">Problem Solver</span>
              </motion.div>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-xl hidden lg:flex items-center gap-2.5 whitespace-nowrap"
              >
                <Focus className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] font-mono tracking-wider font-medium">Full Stack • AI/ML</span>
              </motion.div>
            </div>

            {/* Enhanced Pulse effect */}
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-black/5 -z-10"
            />
            
            {/* Secondary pulse ring */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute inset-0 rounded-full bg-black/5 -z-10"
            />
          </motion.div>
        </section>

        {/* Achievements - Animated Tags */}
        {data.achievements.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {data.achievements.map((ach, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -3, scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-6 py-3 rounded-full bg-white transition-all duration-300 cursor-default border border-gray-100 flex items-center gap-3 group hover:border-black hover:shadow-lg"
              >
                <Star className="w-3 h-3 text-gray-300 group-hover:text-amber-500 transition-colors" />
                <span className="text-[10px] text-gray-600 group-hover:text-black tracking-[0.2em] font-mono font-bold uppercase transition-colors">
                  {ach}
                </span>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Featured Project - Enhanced */}
        {data.featuredProject && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium">Featured Work</span>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Compass className="w-3 h-3 text-gray-300" />
              </motion.div>
            </div>

            <motion.div 
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-white border border-gray-100 overflow-hidden hover:border-black/10 transition-all duration-500 shadow-sm hover:shadow-2xl rounded-[2.5rem]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Area */}
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {data.featuredProject.images?.[0] ? (
                    <>
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        src={data.featuredProject.images[0]} 
                        alt={data.featuredProject.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Layers className="w-20 h-20 text-gray-200" />
                    </div>
                  )}
                </div>
                
                {/* Content Area */}
                <div className="p-10 md:p-14 space-y-8 flex flex-col justify-center">
                  <div className="space-y-5">
                    <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-mono font-bold">{data.featuredProject.domain}</span>
                    <h3 className="text-4xl md:text-5xl font-display font-medium text-black leading-tight tracking-tight">
                      {data.featuredProject.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base max-w-sm font-body">
                      {data.featuredProject.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {data.featuredProject.techStack?.slice(0, 5).map(tech => (
                      <span key={tech} className="text-[9px] text-gray-600 tracking-[0.2em] uppercase border border-gray-100 px-4 py-2 rounded-full font-mono font-medium hover:border-black hover:text-black transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <motion.div whileHover={{ x: 10 }}>
                      <Link 
                        to="/projects" 
                        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-black font-mono font-bold group"
                      >
                        View Full Project 
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* Navigation Index - Enhanced Bento Grid */}
        <section className="space-y-12">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { 
                opacity: 1, 
                transition: { staggerChildren: 0.08 } 
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { name: 'Projects', path: '/projects', icon: Code, desc: 'Selected works and digital products', color: '#000000' },
              { name: 'Leadership', path: '/leadership', icon: Globe, desc: 'Roles and organizational impact', color: '#1e3a8a' },
              { name: 'Participations', path: '/participations', icon: Activity, desc: 'Events and competitive experience', color: '#064e3b' },
              { name: 'Certifications', path: '/certifications', icon: Sparkles, desc: 'Professional validations', color: '#78350f' },
              { name: 'Academics', path: '/academics', icon: GraduationCap, desc: 'Educational milestones', color: '#581c87' },
              { name: 'Contact', path: 'mailto:contact@narenselvan.com', icon: User, desc: "Let's start a conversation", external: true, color: '#881337' },
            ].map((item, idx) => (
              <motion.div
                key={item.name}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="h-full"
                >
                  {item.external ? (
                    <a 
                      href={item.path}
                      className="group relative h-72 flex flex-col justify-between bg-gray-50 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${item.color}, #000)` }} />
                      <div className="relative z-10">
                        <item.icon className="w-8 h-8 text-gray-300 group-hover:text-white/50 transition-all duration-500" />
                      </div>
                      <div className="relative z-10 space-y-2">
                        <h4 className="text-sm font-display font-semibold text-black group-hover:text-white transition-colors duration-500 uppercase tracking-widest">{item.name}</h4>
                        <p className="text-[11px] font-body text-gray-500 group-hover:text-white/70 transition-colors duration-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </a>
                  ) : (
                    <Link 
                      to={item.path}
                      className="group relative h-72 flex flex-col justify-between bg-gray-50 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${item.color}, #000)` }} />
                      <div className="relative z-10">
                        <item.icon className="w-8 h-8 text-gray-300 group-hover:text-white/50 transition-all duration-500" />
                      </div>
                      <div className="relative z-10 space-y-2">
                        <h4 className="text-sm font-display font-semibold text-black group-hover:text-white transition-colors duration-500 uppercase tracking-widest">{item.name}</h4>
                        <p className="text-[11px] font-body text-gray-500 group-hover:text-white/70 transition-colors duration-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer - Enhanced */}
        <footer className="pt-24 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-medium">Naren Selvan</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Pollachi • India</p>
          </div>
          
          <div className="flex gap-12">
            <motion.a 
              whileHover={{ y: -3, color: '#000' }}
              href={`mailto:${data.personalInfo?.socials?.email}`} 
              className="text-[10px] tracking-[0.2em] text-gray-500 transition-all uppercase font-medium hover:tracking-[0.3em]"
            >
              Email
            </motion.a>
            <motion.a 
              whileHover={{ y: -3, color: '#000' }}
              href={data.personalInfo?.socials?.linkedin} 
              target="_blank" 
              className="text-[10px] tracking-[0.2em] text-gray-500 transition-all uppercase font-medium hover:tracking-[0.3em]"
            >
              LinkedIn
            </motion.a>
            <motion.a 
              whileHover={{ y: -3, color: '#000' }}
              href={data.personalInfo?.socials?.github} 
              target="_blank" 
              className="text-[10px] tracking-[0.2em] text-gray-500 transition-all uppercase font-medium hover:tracking-[0.3em]"
            >
              GitHub
            </motion.a>
          </div>

          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[9px] text-gray-300 font-mono"
          >
            <Coffee className="w-3 h-3 inline mr-1" />
            Built in late nights, proven in real worlds
          </motion.div>
        </footer>
      </div>
    </motion.div>
  );
};

export default Home;