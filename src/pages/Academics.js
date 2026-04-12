import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ChevronRight, Book, Clock } from 'lucide-react';
import api from '../api';

const AcademicModal = ({ academic, onClose }) => {
  if (!academic) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/5 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl rounded-3xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-30 p-2 hover:bg-gray-50 rounded-full transition-colors font-light text-black"
        >
          <ChevronRight className="w-5 h-5 text-gray-400 rotate-45" />
        </button>

        <div className="p-8 md:p-16 space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-semibold">{academic.institution}</span>
            <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight leading-[1.1]">{academic.degree}</h2>
            <div className="flex flex-wrap items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              <span className="flex items-center gap-2"><Book className="w-3.5 h-3.5" /> Class of {academic.endYear}</span>
              {academic.grade && <span className="flex items-center gap-2">• Grade Index: {academic.grade}</span>}
            </div>
          </div>

          {/* Description */}
          {academic.description && (
            <div className="space-y-6 pt-12 border-t border-gray-50">
              <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold">Scholastic Context</span>
              <p className="text-gray-500 text-xl leading-relaxed font-light">
                {academic.description}
              </p>
            </div>
          )}

          {/* Documents Grid */}
          {academic.documents?.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[11px] tracking-[0.3em] text-black uppercase font-bold">Academic Transcripts</span>
                <div className="h-px flex-1 bg-gray-50"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {academic.documents.map((doc, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="aspect-[1.414/1] bg-gray-50 border border-gray-50 overflow-hidden rounded-2xl group relative shadow-sm"
                  >
                    <motion.img 
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.8 }}
                      src={doc} alt="Academic Document" className="w-full h-full object-contain p-4 md:p-8" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <GraduationCap className="w-16 h-16 text-black/5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Academics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAcademic, setSelectedAcademic] = useState(null);

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        const { data } = await api.get('/academics');
        setData(data);
      } catch (error) {
        console.error('Error fetching academics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademics();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-6 text-black">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full"
      />
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[10px] tracking-[0.3em] uppercase font-mono font-bold"
      >
        Validating Scholastics
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
      <div className="mb-24">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            <span className="text-[11px] tracking-[0.4em] uppercase text-gray-300 font-mono font-bold">Institutional Pedigree</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-display font-medium text-black leading-[0.9] tracking-tightest">
            Academic
            <br />
            <span className="italic font-light">background.</span>
          </h1>
          <p className="text-gray-600 text-xl font-body max-w-lg leading-relaxed">
            An archive of official credentials, degrees, and academic performance metrics.
          </p>
        </div>
      </div>

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="space-y-10"
      >
        {data.map((item) => (
          <motion.div 
            key={item._id}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -10, backgroundColor: "rgba(0,0,0,0.01)" }}
            onClick={() => setSelectedAcademic(item)}
            className="group cursor-pointer bg-white border border-gray-100 p-10 md:p-16 transition-all duration-500 rounded-[3rem] shadow-sm hover:shadow-2xl relative overflow-hidden text-black"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-20">
              <div className="flex flex-row md:flex-col gap-8 md:gap-6 md:w-32 shrink-0">
                <span className="text-[12px] tracking-[0.4em] text-gray-500 uppercase font-mono font-bold">{item.endYear}</span>
                {item.grade && (
                  <span className="text-[11px] tracking-[0.2em] text-black font-bold font-mono bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl inline-block text-center">{item.grade}</span>
                )}
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-4xl md:text-5xl font-display font-medium text-black leading-tight tracking-tight">{item.degree}</h3>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 uppercase tracking-[0.2em] font-mono font-bold">
                  <GraduationCap className="w-4.5 h-4.5 text-black/40" />
                  <span>{item.institution}</span>
                </div>
              </div>
              <div className="hidden md:block text-gray-100 group-hover:text-black group-hover:translate-x-4 transition-all duration-700">
                <ChevronRight className="w-10 h-10 font-thin" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedAcademic && (
          <AcademicModal 
            academic={selectedAcademic} 
            onClose={() => setSelectedAcademic(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Academics;