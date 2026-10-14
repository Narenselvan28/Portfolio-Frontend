import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, Code, User, Activity, Globe, 
  Sparkles, ChevronRight, GraduationCap,
  Cpu, Zap, Award, Coffee, 
  Feather, Grid
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
    <div className="flex flex-col justify-center items-center h-screen bg-[#FAF9F6]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-stone-200 border-t-[#0F172A] rounded-full"
      />
      <p className="mt-4 text-[10px] text-stone-400 font-mono tracking-wider">Loading...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-[#FAF9F6] overflow-x-hidden min-h-screen text-[#0F172A]"
    >
      {/* Warm Ambient Studio Background Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100/60 via-[#FAF9F6] to-stone-50 opacity-80" />
        
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-[0.025] text-stone-800"
        >
          <Grid className="w-full h-full" />
        </motion.div>

        {/* Ambient warm floating orbs */}
        {[...Array(isMobile ? 3 : 5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -25, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              opacity: [0.08, 0.16, 0.08]
            }}
            transition={{ 
              duration: 14 + i * 2, 
              repeat: Infinity, 
              delay: i * 1.2,
              ease: "easeInOut"
            }}
            className="absolute rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? '#EBE4D5' : '#DDE4EC',
              width: 140 + i * 40,
              height: 140 + i * 40,
              left: `${(i * 30) % 100}%`,
              top: `${(i * 22) % 100}%`,
              filter: 'blur(70px)'
            }}
          />
        ))}

        {!isMobile && (
          <motion.div 
            animate={{ 
              x: mousePosition.x - 250,
              y: mousePosition.y - 250,
            }}
            transition={{ type: "spring", damping: 40, stiffness: 60 }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-200/20 via-stone-200/20 to-transparent blur-3xl pointer-events-none"
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
                className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-stone-200/70 rounded-full shadow-sm"
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] tracking-[0.18em] uppercase text-stone-600 font-mono font-medium">Available for work</span>
              </motion.div>
              
              <div className="flex items-center justify-between gap-4">
                <motion.h1 
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  className="text-6xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-medium text-[#0F172A] leading-[1.1] md:leading-[0.92] tracking-tight flex-1"
                >
                  Naren
                  <br />
                  <span className="relative inline-block">
                    Selvan
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.8, duration: 0.8 }} className="absolute -bottom-1 h-0.5 bg-[#0F172A]" />
                  </span>
                </motion.h1>

                {/* Mobile-only small profile image */}
                <motion.div
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                  className="md:hidden w-24 h-24 rounded-2xl overflow-hidden border border-stone-200 shadow-md shrink-0 bg-stone-100"
                >
                  <img src={profileImg} alt="Naren Selvan" className="w-full h-full object-cover" />
                </motion.div>
              </div>
              
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-3 text-stone-500">
                <Cpu className="w-4 h-4 text-[#0F172A]" />
                <span className="text-sm font-mono tracking-tight">Building with intelligence.</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </motion.div>
            </div>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="text-base md:text-lg text-stone-600 max-w-lg leading-relaxed font-light">
              {data.personalInfo?.summary}
            </motion.p>
            
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex flex-col sm:flex-row gap-4">
              <Link to="/projects" className="group flex items-center justify-center gap-3 bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-4 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase transition-all active:scale-95 shadow-xl shadow-[#0F172A]/10">
                View Work <ChevronRight className="w-4 h-4" />
              </Link>
              <button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-3 bg-white border border-stone-200 text-[#0F172A] px-8 py-4 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase transition-all hover:bg-stone-50 active:scale-95 shadow-sm">
                Collaborate <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
            </motion.div>
          </motion.div>

          <PortfolioModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

          {/* Profile Photo Section - Editorial Studio Card Presentation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden md:flex lg:col-span-6 relative items-center justify-center py-10 md:py-16 order-1 lg:order-2"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
          >
            {/* Ambient Backlight Aura matching photo warmth */}
            <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-tr from-amber-200/35 via-stone-200/40 to-slate-200/25 rounded-[3.5rem] blur-3xl -z-10 pointer-events-none" />

            {/* Subtle orbital rings */}
            {[...Array(isMobile ? 2 : 4)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 25 + i * 10, repeat: Infinity, ease: "linear" }}
                className={`absolute border border-stone-200/60 rounded-full`}
                style={{ width: `${100 + i * 15}%`, aspectRatio: '1/1', borderStyle: i % 2 !== 0 ? 'dashed' : 'solid', opacity: 0.45 - i * 0.08 }}
              />
            ))}

            {/* Orbiting Elements */}
            {!isMobile && [
              { Icon: Code, delay: 0, duration: 18, offset: 1.15, label: "React" },
              { Icon: Zap, delay: 4, duration: 22, offset: 1.25, label: "Fast" },
              { Icon: Globe, delay: 8, duration: 20, offset: 1.35, label: "Global" },
              { Icon: Award, delay: 12, duration: 24, offset: 1.45, label: "Awarded" }
            ].map((item, idx) => (
              <motion.div key={idx} animate={{ rotate: 360 }} transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: "linear" }} className="absolute inset-0 pointer-events-none" style={{ transform: `scale(${item.offset})` }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="p-2.5 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-md group">
                    <item.Icon className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#0F172A] transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Editorial Curved Portrait Card */}
            <div className="relative w-full max-w-[85%] md:max-w-md aspect-square rounded-[3rem] p-3 bg-white border border-stone-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] group">
              <div className="w-full h-full rounded-[2.35rem] overflow-hidden bg-stone-100 relative">
                <motion.img 
                  animate={{ scale: isHoveringProfile && !isMobile ? 1.05 : 1.01 }}
                  transition={{ duration: 0.6 }}
                  src={profileImg} 
                  alt="Naren Selvan" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
                {!isMobile && isHoveringProfile && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A]/10 via-transparent to-white/10 pointer-events-none" />
                )}
              </div>

              {/* Badges */}
              {!isMobile && (
                <>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute -left-10 top-1/4 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-full px-5 py-2.5 shadow-xl hidden lg:flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-mono tracking-wider font-bold uppercase text-stone-800">Technologist</span>
                  </motion.div>
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute -right-10 bottom-1/4 bg-[#0F172A] text-white rounded-full px-5 py-2.5 shadow-xl shadow-[#0F172A]/20 hidden lg:flex items-center gap-2.5">
                    <Feather className="w-3 h-3 text-amber-400" />
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
              <div key={idx} className="px-5 py-2.5 rounded-full bg-white border border-stone-200 text-[10px] text-stone-500 font-mono font-bold tracking-[0.15em] uppercase hover:border-[#0F172A] hover:text-[#0F172A] transition-all cursor-default shadow-sm">
                {ach}
              </div>
            ))}
          </motion.section>
        )}

        {/* Featured Project */}
        {data.featuredProject && (
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[0.25em] text-stone-400 uppercase font-bold">Best Work</span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <div className="group relative bg-white border border-stone-200/80 overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-[2rem] md:rounded-[3rem] shadow-[0_8px_30px_rgb(15,23,42,0.04)]">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-[4/3] lg:aspect-square bg-stone-50 overflow-hidden">
                  <img src={data.featuredProject.images?.[0]} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="p-8 md:p-14 space-y-6 flex flex-col justify-center">
                  <div className="space-y-3">
                    <span className="text-[9px] tracking-[0.25em] text-stone-400 uppercase font-bold">{data.featuredProject.domain}</span>
                    <h3 className="text-3xl md:text-5xl font-display font-medium text-[#0F172A] leading-tight tracking-tight">{data.featuredProject.title}</h3>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed line-clamp-3">{data.featuredProject.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.featuredProject.techStack?.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[8px] tracking-wider uppercase bg-stone-50 px-3 py-1.5 rounded-lg font-mono font-bold text-stone-700 border border-stone-200">{tech}</span>
                    ))}
                  </div>
                  <div className="pt-4 mt-auto">
                    <Link to="/projects" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#0F172A] font-bold border-b border-[#0F172A]/20 pb-1 hover:border-[#0F172A] transition-all">Explore Full System <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Navigation Index - Bento Grid Optimized for Mobile */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: 'Projects', path: '/projects', icon: Code, desc: 'Selected works & research' },
            { name: 'Leadership', path: '/leadership', icon: Globe, desc: 'Impact and management' },
            { name: 'Participations', path: '/participations', icon: Activity, desc: 'Competitions & nodes' },
            { name: 'Awards', path: '/certifications', icon: Sparkles, desc: 'Professional validations' },
            { name: 'Education', path: '/academics', icon: GraduationCap, desc: 'Scholastic background' },
            { name: 'Talk', path: 'mailto:contact@narenselvan.com', icon: User, desc: 'Start a transmission', external: true },
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.external ? '#' : item.path}
              onClick={item.external ? () => window.location.href = item.path : undefined}
              className="group h-56 md:h-72 bg-white border border-stone-200/80 hover:bg-[#0F172A] hover:border-[#0F172A] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-[0_4px_20px_rgb(15,23,42,0.03)] hover:shadow-2xl"
            >
              <item.icon className="w-6 md:w-8 h-6 md:h-8 text-stone-300 group-hover:text-white/40 transition-all" />
              <div className="space-y-1">
                <h4 className="text-base md:text-lg font-display font-medium text-[#0F172A] group-hover:text-white uppercase tracking-wider">{item.name}</h4>
                <p className="text-[10px] md:text-xs text-stone-500 group-hover:text-stone-400 font-mono tracking-tight">{item.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* Footer */}
        <footer className="pt-20 border-t border-stone-200 flex flex-col gap-10 md:gap-0 md:flex-row justify-between items-center bg-transparent">
          <div className="text-center md:text-left space-y-2">
            <span className="text-[10px] tracking-[0.25em] text-stone-400 uppercase font-bold">Naren Selvan</span>
            <p className="text-[10px] text-stone-500 uppercase tracking-wider">Late Night Build • India</p>
          </div>
          
          <div className="flex gap-8 md:gap-12">
            {['Email', 'LinkedIn', 'GitHub'].map(s => (
              <button key={s} className="text-[10px] tracking-[0.2em] text-stone-500 hover:text-[#0F172A] uppercase font-bold transition-all">{s}</button>
            ))}
          </div>

          <div className="text-[9px] text-stone-400 font-mono flex items-center gap-2">
            <Coffee className="w-3 h-3 text-amber-600" /> Still Building.
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default Home;