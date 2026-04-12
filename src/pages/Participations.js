import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Award, ChevronRight } from 'lucide-react';
import api from '../api';

const ParticipationModal = ({ item, onClose }) => {
  if (!item) return null;

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
            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-semibold">{item.organization || 'Technical Competition'}</span>
            <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight">{item.title}</h2>
            <div className="flex flex-wrap items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {item.organization || 'Various'}</span>
              <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              {item.result && (
                <span className="bg-black text-white px-2 py-1 text-[8px] font-bold tracking-[0.2em]">{item.result}</span>
              )}
            </div>
          </div>

          {/* Takeaway */}
          {item.takeaway && (
            <div className="bg-gray-50 p-12 rounded-3xl border border-gray-100">
              <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold block mb-8">Executive Summary</span>
              <p className="text-gray-600 text-lg leading-relaxed font-light italic">
                "{item.takeaway}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Participations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const { data } = await api.get('/participations');
        setItems(data);
      } catch (error) {
        console.error('Error fetching participations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipations();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-6 text-black">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full"
      />
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[10px] tracking-[0.3em] uppercase font-mono font-bold"
      >
        Indexing Experience
      </motion.p>
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
            <span className="text-[11px] tracking-[0.4em] uppercase text-gray-300 font-mono font-bold">External Presence</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-display font-medium text-black leading-[0.9] tracking-tightest">
            Compendiums &
            <br />
            <span className="italic font-light">ventures.</span>
          </h1>
        </div>
      </div>

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {items.map((item) => (
          <motion.div 
            key={item._id}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -12 }}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 text-black"
          >
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black/20 group-hover:text-black transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                {item.result && item.result !== 'None' && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-black font-mono">{item.result}</span>
                )}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-mono font-bold">{item.organization || 'TECHNICAL EVENT'}</span>
                <h3 className="text-xl font-medium text-black leading-tight tracking-tight">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-gray-400 font-mono font-bold tracking-widest uppercase">
                <Calendar className="w-3 h-3" /> {new Date(item.date).getFullYear()}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <ParticipationModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Participations;