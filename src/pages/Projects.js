import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowUpRight, Sparkles, X } from 'lucide-react';
import api from '../api';

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-gray-50 text-gray-400',
    primary: 'bg-black text-white',
    accent: 'bg-gray-100 text-black',
    highlight: 'bg-gray-900 text-white'
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
      className={`group cursor-pointer bg-white border border-gray-100 hover:border-black/10 flex flex-col transition-all duration-500 shadow-sm hover:shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] relative z-10 ${
        isFeatured ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`bg-gray-50 relative overflow-hidden rounded-t-[1.5rem] md:rounded-t-[2.5rem] ${isFeatured ? 'md:aspect-[21/9] aspect-video' : 'aspect-video'}`}>
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="w-12 h-12 text-gray-100" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
          <Badge variant={isFeatured ? 'highlight' : 'accent'}>{project.domain}</Badge>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-3 md:space-y-4">
        <div className="space-y-1">
          {isFeatured && (
            <div className="flex items-center gap-1.5 mb-1 md:mb-2">
              <Sparkles className="w-2.5 h-2.5 text-black" />
              <span className="text-[8px] tracking-[0.3em] uppercase text-black font-bold font-mono">Premium Hub</span>
            </div>
          )}
          <h3 className={`font-display font-medium text-black leading-tight tracking-tight ${
            isFeatured ? 'text-2xl md:text-4xl' : 'text-xl'
          }`}>
            {project.title}
          </h3>
        </div>
        
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 md:pt-4">
          {project.techStack?.slice(0, 3).map(tech => (
            <span key={tech} className="text-[9px] text-gray-400 tracking-[0.2em] font-mono lowercase">
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10 bg-black/50 backdrop-blur-2xl px-4 py-8 md:p-10"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-6xl max-h-full md:max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl rounded-[1.5rem] md:rounded-[3.5rem] relative"
      >
        <div className="sticky top-6 right-6 md:absolute md:top-10 md:right-10 z-[110] flex justify-end px-6 md:px-0">
          <button 
            onClick={onClose}
            className="p-3 md:p-4 bg-gray-50 hover:bg-black text-gray-400 hover:text-white rounded-full transition-all duration-300 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-20 space-y-12 md:space-y-20">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
              <Badge variant="highlight">{project.domain}</Badge>
              <span className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-mono font-bold">Ref: {project.presentedAt || 'Internal'}</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-display font-medium text-black leading-tight tracking-tightest">{project.title}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 pt-10 border-t border-gray-50">
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-mono font-bold block">Overview</span>
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-light">
                {project.longDescription || project.description}
              </p>
            </div>
            
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-mono font-bold block">Stack</span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="px-3 py-1.5 border border-gray-50 text-[10px] tracking-widest text-gray-400 font-mono uppercase rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex justify-between items-center p-4 md:p-5 border border-gray-100 hover:border-black rounded-xl transition-all">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Source</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex justify-between items-center p-4 md:p-5 bg-black text-white rounded-xl shadow-xl">
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
                <span className="text-[10px] md:text-[12px] tracking-[0.4em] text-black uppercase font-mono font-bold">{section.title}</span>
                <div className="h-px flex-1 bg-gray-50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {section.data.map((img, idx) => (
                  <div key={idx} className="aspect-video bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-50">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {project.outcome && (
            <div className="bg-gray-50 p-8 md:p-16 rounded-[1.5rem] md:rounded-[3rem] border border-gray-100">
              <p className="text-black text-xl md:text-2xl font-display leading-relaxed italic">
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

      <div className="flex items-center justify-center md:justify-start gap-4 mb-12 md:mb-20">
        {['featured', 'latest'].map(mode => (
          <button key={mode} onClick={() => setSortMode(mode)} className={`px-6 md:px-8 py-2 md:py-3 text-[10px] tracking-[0.3em] uppercase font-mono font-bold transition-all border-b-2 ${sortMode === mode ? 'border-black text-black' : 'border-transparent text-gray-300'}`}>
            {mode}
          </button>
        ))}
      </div>

      <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <AnimatePresence mode="popLayout">
          {displayList.map((project, idx) => (
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
    </motion.div>
  );
};

export default Projects;