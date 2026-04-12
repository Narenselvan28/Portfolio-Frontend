import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowUpRight, Sparkles, Clock, X } from 'lucide-react';
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

const ProjectCard = ({ project, isFeatured, idx, onClick }) => {
  const coverImage = project.images?.[0] || project.deploymentPhotos?.[0] || null;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -12, shadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group cursor-pointer bg-white border border-gray-100 hover:border-black/10 flex flex-col transition-all duration-500 shadow-sm hover:shadow-2xl rounded-[2.5rem] relative z-10 ${
        isFeatured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Soft Hover Glow */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gray-50 rounded-[2.5rem] -z-10 transition-opacity"
      />
      {/* Cover Image */}
      <div className={`bg-gray-50 relative overflow-hidden ${isFeatured ? 'md:aspect-[21/9] aspect-video' : 'aspect-video'}`}>
        {coverImage ? (
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8 }}
            src={coverImage} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="w-12 h-12 text-gray-100" />
          </div>
        )}
        <div className="absolute bottom-6 left-6">
          <Badge variant={isFeatured ? 'highlight' : 'accent'}>{project.domain}</Badge>
        </div>
      </div>

      <div className="p-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            {isFeatured && (
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3 text-black" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-black font-bold font-mono">Featured Work</span>
              </div>
            )}
            <h3 className={`font-display font-medium text-black leading-tight tracking-tight ${
              isFeatured ? 'text-3xl md:text-4xl' : 'text-xl'
            }`}>
              {project.title}
            </h3>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 font-body">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4">
            {project.techStack.slice(0, 4).map(tech => (
              <span key={tech} className="text-[9px] text-gray-500 tracking-[0.2em] uppercase font-mono font-bold lowercase">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  const sections = [
    { title: 'UI Preview', data: project.images },
    { title: 'Deployment', data: project.deploymentPhotos },
    { title: 'Testing', data: project.testingPhotos },
  ].filter(s => s.data && s.data.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/50 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl rounded-[3.5rem] relative"
      >
        <div className="absolute top-10 right-10 z-[110]">
          <button 
            onClick={onClose}
            className="group p-4 bg-gray-50 hover:bg-black rounded-full transition-all duration-300 shadow-sm"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        <div className="p-10 md:p-20 space-y-20">
          {/* Header */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Badge variant="highlight">{project.domain}</Badge>
              <div className="h-px w-12 bg-gray-100" />
              <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-mono font-bold">{project.presentedAt || 'Personal Project'}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-medium text-black tracking-tightest leading-[0.9]">{project.title}</h2>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-12 border-t border-gray-50">
            <div className="lg:col-span-8 space-y-8">
              <span className="text-[11px] tracking-[0.3em] text-gray-300 uppercase font-mono font-bold block">Overview</span>
              <p className="text-gray-500 text-xl font-body leading-relaxed font-light">
                {project.longDescription || project.description}
              </p>
            </div>
            
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-6">
                <span className="text-[11px] tracking-[0.3em] text-gray-300 uppercase font-mono font-bold block">Stack</span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="px-4 py-2 border border-gray-100 text-[10px] tracking-[0.1em] text-gray-400 font-mono font-bold uppercase rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {project.githubLink && (
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={project.githubLink} target="_blank" rel="noreferrer" 
                    className="flex justify-between items-center p-5 border border-gray-100 hover:border-black transition-all rounded-2xl"
                  >
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest">Source Code</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.a>
                )}
                {project.liveLink && (
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={project.liveLink} target="_blank" rel="noreferrer" 
                    className="flex justify-between items-center p-5 bg-black text-white rounded-2xl shadow-xl shadow-black/10"
                  >
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest">Live Dashboard</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>

          {/* Visual Evidence Sections */}
          {sections.map(section => (
            <div key={section.title} className="space-y-12">
              <div className="flex items-center gap-6">
                <span className="text-[12px] tracking-[0.4em] text-black uppercase font-mono font-bold">{section.title}</span>
                <div className="h-px flex-1 bg-gray-50"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {section.data.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="aspect-video bg-gray-50 rounded-3xl overflow-hidden group border border-gray-50 shadow-sm"
                  >
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      src={img} alt={`${section.title} proof`} className="w-full h-full object-cover" 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Outcome Section */}
          {project.outcome && (
            <div className="bg-gray-50 p-16 rounded-[3rem] border border-gray-100">
              <span className="text-[11px] tracking-[0.3em] text-gray-300 uppercase font-mono font-bold block mb-8">Key Outcome / Impact</span>
              <p className="text-black text-2xl font-display leading-relaxed font-light italic">
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

  const getDisplayList = () => {
    const list = [...projects];
    if (sortMode === 'featured') {
      return list.sort((a, b) => {
        const aFeatured = (a.priorityOverride || 0) > 80 ? 1 : 0;
        const bFeatured = (b.priorityOverride || 0) > 80 ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return (b.priorityOverride || 0) - (a.priorityOverride || 0) || new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const displayList = getDisplayList();

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-6">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full"
      />
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-mono font-bold"
      >
        Compiling Portfolio
      </motion.span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="max-w-6xl mx-auto px-6 pt-44 pb-28"
    >
      
      {/* Header */}
      <div className="mb-24">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            <span className="text-[11px] tracking-[0.4em] uppercase text-gray-300 font-mono font-bold">Curated Works</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-display font-medium text-black leading-[0.9] tracking-tightest">
            Selected
            <br />
            <span className="italic font-light">milestones.</span>
          </h1>
          <p className="text-gray-600 text-xl font-body max-w-lg leading-relaxed">
            A precise exploration into engineering robust digital systems and scalable product architectures.
          </p>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-4 mb-20 pb-6 border-b border-gray-50">
        <button 
          onClick={() => setSortMode('featured')} 
          className={`px-8 py-3 text-[11px] tracking-[0.3em] uppercase transition-all relative font-mono font-bold ${
            sortMode === 'featured' 
              ? 'text-black' 
              : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          Featured
          {sortMode === 'featured' && <motion.div layoutId="sort-indicator" className="absolute bottom-0 left-8 right-8 h-px bg-black" />}
        </button>
        <button 
          onClick={() => setSortMode('latest')} 
          className={`px-8 py-3 text-[11px] tracking-[0.3em] uppercase transition-all relative font-mono font-bold ${
            sortMode === 'latest' 
              ? 'text-black' 
              : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          Latest
          {sortMode === 'latest' && <motion.div layoutId="sort-indicator" className="absolute bottom-0 left-8 right-8 h-px bg-black" />}
        </button>
      </div>

      {/* Projects Grid */}
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <AnimatePresence mode="popLayout">
          {displayList.map((project, idx) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              idx={idx}
              isFeatured={sortMode === 'featured' && (project.priorityOverride || 0) > 80 && idx < 1} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>

      {/* Empty State */}
      {displayList.length === 0 && (
        <div className="text-center py-32">
          <p className="text-gray-300 text-[11px] tracking-widest uppercase font-mono font-bold">Synchronizing Work Archives...</p>
        </div>
      )}

    </motion.div>
  );
};

export default Projects;