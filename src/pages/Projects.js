import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowUpRight, Sparkles, X, Building2, Rocket, ChevronRight } from 'lucide-react';
import api from '../api';

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-stone-100 text-stone-600 border border-stone-200/60',
    primary: 'bg-[#0F172A] text-white',
    accent: 'bg-stone-100 text-stone-800 border border-stone-200',
    highlight: 'bg-[#0F172A] text-white'
  };
  return (
    <span className={`text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-lg font-mono font-bold ${styles[variant]}`}>
      {children}
    </span>
  );
};

const ProjectCard = ({ project, isFeatured, onClick }) => {
  const coverImage = project.images?.[0] || project.deploymentPhotos?.[0] || null;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group cursor-pointer bg-white border border-stone-200/80 hover:border-stone-300 flex flex-col transition-all duration-500 shadow-[0_4px_20px_rgb(15,23,42,0.03)] hover:shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] relative z-10 ${
        isFeatured ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`bg-stone-50 relative overflow-hidden rounded-t-[1.5rem] md:rounded-t-[2.5rem] ${isFeatured ? 'md:aspect-[21/9] aspect-video' : 'aspect-video'}`}>
        {coverImage ? (
          <img 
            src={coverImage.replace(/\.pdf$/i, '.jpg')} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="w-12 h-12 text-stone-300" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
          <Badge variant={isFeatured ? 'highlight' : 'accent'}>{project.domain}</Badge>
        </div>
        {project.outcome === 'Startup Initiative' && (
          <div className="absolute top-4 right-4 md:top-5 md:right-5 flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full shadow-sm">
            <Building2 className="w-3 h-3" />
            <span className="text-[8px] tracking-[0.15em] uppercase font-mono font-bold">Startup</span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-10 space-y-3 md:space-y-4">
        <div className="space-y-1">
          {isFeatured && (
            <div className="flex items-center gap-1.5 mb-1 md:mb-2">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span className="text-[8px] tracking-[0.25em] uppercase text-[#0F172A] font-bold font-mono">Premium Hub</span>
            </div>
          )}
          <h3 className={`font-display font-medium text-[#0F172A] leading-tight tracking-tight ${
            isFeatured ? 'text-2xl md:text-4xl' : 'text-xl'
          }`}>
            {project.title}
          </h3>
        </div>
        
        <p className="text-stone-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 font-light">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 md:pt-4">
          {project.techStack?.slice(0, 3).map(tech => (
            <span key={tech} className="text-[9px] text-stone-500 tracking-[0.18em] font-mono lowercase">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  const sections = [
    { title: 'Visual Matrix', data: project.images },
    { title: 'Architecture', data: project.deploymentPhotos },
    { title: 'Validation', data: project.testingPhotos },
  ].filter(s => s.data && s.data.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10 bg-[#0F172A]/70 backdrop-blur-2xl px-4 py-8 md:p-10"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-6xl max-h-full md:max-h-[90vh] overflow-y-auto border border-stone-200/80 shadow-2xl rounded-[1.5rem] md:rounded-[3.5rem] relative"
      >
        <div className="sticky top-6 right-6 md:absolute md:top-10 md:right-10 z-[110] flex justify-end px-6 md:px-0">
          <button 
            onClick={onClose}
            className="p-3 md:p-4 bg-stone-100 hover:bg-[#0F172A] text-stone-500 hover:text-white rounded-full transition-all duration-300 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-20 space-y-12 md:space-y-20">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
              <Badge variant="highlight">{project.domain}</Badge>
              <span className="text-[10px] tracking-[0.2em] text-stone-400 uppercase font-mono font-bold">Ref: {project.presentedAt || 'Internal'}</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-display font-medium text-[#0F172A] leading-tight tracking-tight">{project.title}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 pt-10 border-t border-stone-100">
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <span className="text-[10px] tracking-[0.25em] text-stone-400 uppercase font-mono font-bold block">Overview</span>
              <p className="text-stone-600 text-lg md:text-xl leading-relaxed font-light">
                {project.longDescription || project.description}
              </p>
            </div>
            
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.25em] text-stone-400 uppercase font-mono font-bold block">Stack</span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="px-3 py-1.5 border border-stone-200 bg-stone-50 text-[10px] tracking-wider text-stone-600 font-mono uppercase rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex justify-between items-center p-4 md:p-5 border border-stone-200 hover:border-[#0F172A] text-[#0F172A] rounded-xl transition-all">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Source</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex justify-between items-center p-4 md:p-5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl shadow-xl transition-colors">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Live Link</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {sections.map(section => (
            <div key={section.title} className="space-y-8 md:space-y-12">
              <div className="flex items-center gap-4">
                <span className="text-[10px] md:text-[12px] tracking-[0.3em] text-[#0F172A] uppercase font-mono font-bold">{section.title}</span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {section.data.map((img, idx) => (
                  <div key={idx} className="aspect-video bg-stone-50 rounded-2xl md:rounded-3xl overflow-hidden border border-stone-200/80 relative group">
                    <a href={img} target="_blank" rel="noreferrer" className="block w-full h-full relative cursor-zoom-in">
                      <img src={img.replace(/\.pdf$/i, '.jpg')} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-[#0F172A]/0 group-hover:bg-[#0F172A]/10 transition-colors flex items-center justify-center pointer-events-none">
                        <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-[#0F172A] px-4 py-2 rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-xl">
                          CLICK TO VIEW FULL
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {project.outcome && (
            <div className="bg-stone-50 p-8 md:p-16 rounded-[1.5rem] md:rounded-[3rem] border border-stone-200/80">
              <p className="text-[#0F172A] text-xl md:text-2xl font-display leading-relaxed italic">
                "{project.outcome}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [sortMode, setSortMode] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const displayList = [...projects].sort((a, b) => {
    if (sortMode === 'featured') {
      const aVal = (a.priorityOverride || 0);
      const bVal = (b.priorityOverride || 0);
      return bVal - aVal;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const rearmProject = projects.find(p => p.outcome === 'Startup Initiative');
  const regularList = displayList.filter(p => p.outcome !== 'Startup Initiative');

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-6">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full" />
      <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-mono font-bold">Compiling...</span>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 md:px-6 pt-28 md:pt-44 pb-20 md:pb-28">
      <div className="mb-16 md:mb-24">
        <div className="space-y-6 md:space-y-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-300 font-mono font-bold">Works</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-medium text-black leading-tight tracking-tightest">Selected milestones.</h1>
        </div>
      </div>

      {/* ── ReArm One — Featured Startup Section ── */}
      {rearmProject && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => setSelectedProject(rearmProject)}
          className="mb-20 md:mb-32 cursor-pointer group"
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-mono font-bold">Startup Venture</span>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
          </div>

          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-[#070D1B] via-[#0F172A] to-[#1E293B] border border-amber-500/20 min-h-[320px] md:min-h-[440px] flex flex-col justify-between p-8 md:p-16 shadow-2xl">

            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

            {/* Glowing orb */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white blur-3xl pointer-events-none"
            />

            {/* Top row */}
            <div className="relative flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-full">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[9px] tracking-[0.18em] uppercase font-mono font-bold">ReArm Technologies</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-full">
                  <Rocket className="w-3 h-3 text-amber-400" />
                  <span className="text-[9px] tracking-[0.18em] uppercase font-mono font-bold">Startup Initiative</span>
                </div>
              </div>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-white/40 group-hover:text-white/80 transition-colors duration-300"
              >
                <span className="text-[9px] tracking-[0.18em] uppercase font-mono font-bold">Explore</span>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </div>

            {/* Main content */}
            <div className="relative mt-8 md:mt-0 space-y-5 md:space-y-6 max-w-3xl">
              <div>
                <p className="text-amber-400/80 text-[10px] tracking-[0.25em] uppercase font-mono font-bold mb-3">Assistive Robotics · Neural Interfaces · Edge AI</p>
                <h2 className="text-3xl md:text-6xl font-display font-medium text-white leading-tight tracking-tight">
                  ReArm One
                </h2>
                <p className="text-white/60 text-sm md:text-base mt-1 font-light tracking-wide">AI-Powered Modular Occupational Prosthetic</p>
              </div>
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl font-light">
                Hybrid EEG–sEMG control architecture for task-specific modular prosthetic attachments — combining neural-intent recognition with muscle-activity signals for rehabilitation and industrial use.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {rearmProject.techStack?.slice(0, 5).map(tech => (
                  <span key={tech} className="px-3 py-1.5 border border-white/10 text-white/50 text-[9px] tracking-wider font-mono uppercase rounded-lg bg-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Hover CTA strip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 right-8 md:bottom-12 md:right-16 flex items-center gap-3 bg-white text-[#0F172A] px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl"
            >
              <span className="text-[10px] tracking-[0.18em] uppercase font-mono font-bold">View Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Sort tabs */}
      <div className="flex items-center justify-center md:justify-start gap-4 mb-12 md:mb-20">
        {['featured', 'latest'].map(mode => (
          <button key={mode} onClick={() => setSortMode(mode)} className={`px-6 md:px-8 py-2 md:py-3 text-[10px] tracking-[0.2em] uppercase font-mono font-bold transition-all border-b-2 ${sortMode === mode ? 'border-[#0F172A] text-[#0F172A]' : 'border-transparent text-stone-400 hover:text-[#0F172A]'}`}>
            {mode}
          </button>
        ))}
      </div>

      <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <AnimatePresence mode="popLayout">
          {regularList.map((project, idx) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              isFeatured={sortMode === 'featured' && (project.priorityOverride || 0) > 80 && idx < 1} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>

      <div className="mt-24 flex justify-center border-t border-stone-200 pt-16">
        <Link to="/certifications" className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform">
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono font-bold text-stone-400">Next Folder</span>
          <span className="text-2xl md:text-4xl font-display font-medium text-[#0F172A] tracking-tight group-hover:underline underline-offset-8">
            Professional Certifications
          </span>
        </Link>
      </div>
    </motion.div>
  );
};

export default Projects;