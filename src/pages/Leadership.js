import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Calendar } from 'lucide-react';
import api from '../api';

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

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
          <Clock className="w-5 h-5 text-gray-400 rotate-45" />
        </button>

        <div className="p-8 md:p-16 space-y-12">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-semibold">{event.role || 'Organization Lead'}</span>
            <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight">{event.title}</h2>
            <div className="flex flex-wrap items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              {event.participantCount && <span className="flex items-center gap-2 font-black">• {event.participantCount}+ impacted</span>}
            </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-gray-50">
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold">Leadership Scope</span>
            <p className="text-gray-500 text-xl leading-relaxed font-light">
              {event.description}
            </p>
          </div>

          {event.insights && (
            <div className="bg-black p-12 rounded-3xl">
              <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-semibold block mb-8">Executive Insight</span>
              <p className="text-white text-lg leading-relaxed font-light italic">
                "{event.insights}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Leadership = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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
        Synchronizing Visionary Nodes
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
            <span className="text-[11px] tracking-[0.4em] uppercase text-gray-300 font-mono font-bold">Organizational Impact</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-display font-medium text-black leading-[0.9] tracking-tightest">
            Vision &
            <br />
            <span className="italic font-light">leadership.</span>
          </h1>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gray-50 -translate-x-1/2" />

        {events.map((event, idx) => (
          <motion.div 
            key={event._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className={`relative flex flex-col md:flex-row items-start mb-24 last:mb-0 ${
              idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className="absolute left-5 md:left-1/2 w-4 h-4 rounded-full bg-black -translate-x-1/2 mt-5 z-10 border-4 border-white shadow-sm" />

            <div className={`w-full md:w-[calc(50%-4rem)] ${idx % 2 === 0 ? 'md:pr-8 text-left md:text-right' : 'md:pl-8 text-left md:ml-auto'}`}>
              <div className="pl-12 md:pl-0 space-y-4">
                <span className="text-[11px] tracking-[0.4em] text-gray-400 uppercase font-mono font-bold">
                  {new Date(event.date).getFullYear()}
                </span>
                
                <motion.div 
                  onClick={() => setSelectedEvent(event)}
                  whileHover={{ y: -12 }}
                  className="group cursor-pointer bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="space-y-6">
                    <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-mono font-bold">{event.role}</span>
                    <h3 className="text-3xl font-display font-medium text-black tracking-tight leading-tight">{event.title}</h3>
                    <div className={`flex items-center gap-2 text-[10px] text-gray-400 font-mono font-bold ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <Users className="w-4 h-4" /> <span>{event.participantCount || 0}+ impacted</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Leadership;