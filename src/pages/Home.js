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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (isMobile) return; // Disable mouse follow on mobile for performance
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (data.loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full"
      />
      <p className="mt-4 text-[10px] text-gray-400 font-mono tracking-wider">Syncing Presence...</p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-50" />
        
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-[0.03]"
        >
          <Grid className="w-full h-full" />
        </motion.div>

        {/* Floating monochromatic circles - Reduced density for mobile performance */}
        {[...Array(isMobile ? 3 : 6)].map((_, i) => (
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
              left: `${(i * 33) % 100}%`,
              top: `${(i * 25) % 100}%`,
              filter: 'blur(60px)'
            }}
          />
        ))}

        {!isMobile && (
          <motion.div 
            animate={{ 
              x: mousePosition.x - 200,
              y: mousePosition.y - 200,
            }}
            transition={{ type: "spring", damping: 40, stiffness: 60 }}
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-gray-100 to-transparent opacity-[0.05] blur-3xl"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-20 md:space-y-32 pb-20 md:pb-28 pt-24 md:pt-32 relative z-10">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
            }}
            className="lg:col-span-6 space-y-8 md:space-y-10 order-2 lg:order-1"
          >
            <div className="space-y-6 md:space-y-8">
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full"
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] tracking-[0.15em] uppercase text-gray-600 font-mono font-medium">Available for work</span>
              </motion.div>
              
              <motion.h1 
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-black leading-[1.1] md:leading-[0.9] tracking-tightest"
              >
                Naren
                <br />
                <span className="relative inline-block">
                  Selvan
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.8, duration: 0.8 }} className="absolute -bottom-1 h-0.5 bg-black" />
                </span>
              </motion.h1>
              
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-3 text-gray-400">
                <Cpu className="w-4 h-4" />
                <span className="text-sm font-mono tracking-tight">Building with intelligence.</span>
                <Zap className="w-4 h-4 text-gray-300" />
              </motion.div>
            </div>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
              {data.personalInfo?.summary}
            </motion.p>
            
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex flex-col sm:flex-row gap-4">
              <Link to="/projects" className="group flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase transition-all hover:bg-gray-900 active:scale-95 shadow-xl shadow-black/5">
                View Work <ChevronRight className="w-4 h-4" />
              </Link>
              <button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-3 bg-white border border-gray-100 text-black px-8 py-4 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase transition-all hover:bg-gray-50 active:scale-95">
                Collaborate <Sparkles className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>

          <PortfolioModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

          {/* Profile Photo Section - Optimized for Mobile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-6 relative flex items-center justify-center py-10 md:py-16 order-1 lg:order-2"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
          >
            {/* Reduced orbital rings for mobile */}
            {[...Array(isMobile ? 2 : 4)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 25 + i * 10, repeat: Infinity, ease: "linear" }}
                className={`absolute border border-gray-100 rounded-full`}
                style={{ width: `${100 + i * 15}%`, aspectRatio: '1/1', borderStyle: i % 2 !== 0 ? 'dashed' : 'solid', opacity: 0.5 - i * 0.1 }}
              />
            ))}

            {/* Orbiting Elements - Hidden on mobile */}
            {!isMobile && [
              { Icon: Code, delay: 0, duration: 18, offset: 1.15, label: "React" },
              { Icon: Zap, delay: 4, duration: 22, offset: 1.25, label: "Fast" },
              { Icon: Globe, delay: 8, duration: 20, offset: 1.35, label: "Global" },
              { Icon: Award, delay: 12, duration: 24, offset: 1.45, label: "Awarded" }
            ].map((item, idx) => (
              <motion.div key={idx} animate={{ rotate: 360 }} transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: "linear" }} className="absolute inset-0 pointer-events-none" style={{ transform: `scale(${item.offset})` }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="p-2.5 bg-white border border-gray-100 rounded-full shadow-lg group">
                    <item.Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Main Image Container */}
            <div className="relative w-full max-w-[80%] md:max-w-md aspect-square rounded-full p-2 bg-white shadow-2xl shadow-black/5 group">
              <div className="absolute inset-0 rounded-full p-[2px] bg-gray-100">
                <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                  <motion.img 
                    animate={{ scale: isHoveringProfile && !isMobile ? 1.08 : 1.02 }}
                    transition={{ duration: 0.6 }}
                    src={profileImg} 
                    alt="Naren Selvan" 
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  {!isMobile && isHoveringProfile && (
                     <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/5 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Badges - Hidden on mobile */}
              {!isMobile && (
                <>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute -left-10 top-1/4 bg-white border border-gray-100 rounded-full px-5 py-2.5 shadow-xl hidden lg:flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-mono tracking-wider font-bold uppercase">Technologist</span>
                  </motion.div>
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute -right-10 bottom-1/4 bg-black text-white rounded-full px-5 py-2.5 shadow-xl hidden lg:flex items-center gap-2.5">
                    <Feather className="w-3 h-3" />
                    <span className="text-[9px] font-mono tracking-wider font-bold uppercase">Creative</span>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-3">
            {data.achievements.map((ach, idx) => (
              <div key={idx} className="px-5 py-2.5 rounded-full bg-white border border-gray-50 text-[10px] text-gray-400 font-mono font-bold tracking-[0.15em] uppercase hover:border-black hover:text-black transition-all cursor-default">
                {ach}
              </div>
            ))}
          </motion.section>
        )}

        {/* Featured Project */}
        {data.featuredProject && (
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[0.3em] text-gray-300 uppercase font-bold">Best Work</span>
              <div className="h-px flex-1 bg-gray-50" />
            </div>

            <div className="group relative bg-white border border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-[2rem] md:rounded-[3rem]">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-[4/3] lg:aspect-square bg-gray-50 overflow-hidden">
                  <img src={data.featuredProject.images?.[0]} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="p-8 md:p-14 space-y-6 flex flex-col justify-center">
                  <div className="space-y-3">
                    <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">{data.featuredProject.domain}</span>
                    <h3 className="text-3xl md:text-5xl font-display font-medium leading-tight">{data.featuredProject.title}</h3>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3">{data.featuredProject.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.featuredProject.techStack?.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[8px] tracking-widest uppercase bg-gray-50 px-3 py-1.5 rounded-lg font-mono font-bold text-gray-600 border border-gray-100">{tech}</span>
                    ))}
                  </div>
                  <div className="pt-4 mt-auto">
                    <Link to="/projects" className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black font-bold border-b border-black/10 pb-1 hover:border-black transition-all">Explore Full System <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Navigation Index - Bento Grid Optimized for Mobile */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: 'Projects', path: '/projects', icon: Code, desc: 'Selected works & research', color: '#000' },
            { name: 'Leadership', path: '/leadership', icon: Globe, desc: 'Impact and management', color: '#000' },
            { name: 'Participations', path: '/participations', icon: Activity, desc: 'Competitions & nodes', color: '#000' },
            { name: 'Awards', path: '/certifications', icon: Sparkles, desc: 'Professional validations', color: '#000' },
            { name: 'Education', path: '/academics', icon: GraduationCap, desc: 'Scholastic background', color: '#000' },
            { name: 'Talk', path: 'mailto:contact@narenselvan.com', icon: User, desc: 'Start a transmission', external: true, color: '#000' },
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.external ? '#' : item.path}
              onClick={item.external ? () => window.location.href = item.path : undefined}
              className="group h-56 md:h-72 bg-gray-50 hover:bg-black p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 shadow-sm"
            >
              <item.icon className="w-6 md:w-8 h-6 md:h-8 text-gray-300 group-hover:text-white/20 transition-all" />
              <div className="space-y-1">
                <h4 className="text-base md:text-lg font-display font-medium text-black group-hover:text-white uppercase tracking-widest">{item.name}</h4>
                <p className="text-[10px] md:text-xs text-gray-400 group-hover:text-gray-500 font-mono tracking-tight">{item.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* Footer */}
        <footer className="pt-20 border-t border-gray-100 flex flex-col gap-10 md:gap-0 md:flex-row justify-between items-center bg-white">
          <div className="text-center md:text-left space-y-2">
            <span className="text-[10px] tracking-[0.4em] text-gray-300 uppercase font-bold">Naren Selvan</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Late Night Build • India</p>
          </div>
          
          <div className="flex gap-8 md:gap-12">
            {['Email', 'LinkedIn', 'GitHub'].map(s => (
              <button key={s} className="text-[10px] tracking-[0.3em] text-gray-400 hover:text-black uppercase font-bold transition-all">{s}</button>
            ))}
          </div>

          <div className="text-[9px] text-gray-200 font-mono flex items-center gap-2">
            <Coffee className="w-3 h-3" /> Still Building.
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default Home;