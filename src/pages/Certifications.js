import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import api from '../api';

const CertificationModal = ({ cert, onClose }) => {
  if (!cert) return null;

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
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-semibold">{cert.issuer}</span>
            <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight leading-[1.1]">{cert.title}</h2>
            <div className="flex items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              {cert.category && <span>• {cert.category}</span>}
            </div>
          </div>

          <div className="aspect-[1.414/1] bg-gray-50 border border-gray-100 overflow-hidden rounded-2xl group relative">
            {cert.certificateImage ? (
              <motion.img 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.8 }}
                src={cert.certificateImage} 
                alt={`${cert.title} Certificate`} 
                className="w-full h-full object-contain p-4 md:p-8"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <Award className="w-16 h-16 text-gray-100" />
                <span className="text-[10px] text-gray-300 uppercase tracking-[0.2em]">Verified Professional Document</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-50 text-black">
            {cert.skills?.length > 0 && (
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold">Competencies</span>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-gray-50 text-[10px] text-black font-medium uppercase tracking-wider rounded-lg border border-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {cert.takeaway && (
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold">Key Growth</span>
                <p className="text-gray-500 text-base leading-relaxed font-light italic">
                  "{cert.takeaway}"
                </p>
              </div>
            )}
          </div>

          {cert.link && (
            <div className="pt-8">
              <motion.a 
                whileHover={{ x: 5 }}
                href={cert.link} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-black font-bold group"
              >
                Launch Verification Portal <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await api.get('/certifications');
        setCerts(data);
      } catch (error) {
        console.error('Error fetching certifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
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
        Verifying Professional Timeline
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
            <span className="text-[11px] tracking-[0.4em] uppercase text-gray-300 font-mono font-bold">Verified Credentials</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-display font-medium text-black leading-[0.9] tracking-tightest">
            Expert
            <br />
            <span className="italic font-light">validations.</span>
          </h1>
          <p className="text-gray-600 text-xl font-body max-w-lg leading-relaxed">
            A precise registry of professional certifications and technical qualifications.
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {certs.map((cert) => (
          <motion.div 
            key={cert._id}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -12 }}
            onClick={() => setSelectedCert(cert)}
            className="group cursor-pointer bg-white border border-gray-100 hover:border-black/10 p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl relative overflow-hidden text-black"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black/20 group-hover:text-black transition-colors">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-mono font-bold">{cert.issuer}</span>
                <h3 className="text-xl font-medium text-black leading-tight tracking-tight underline-offset-4 group-hover:underline">{cert.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-gray-400 font-mono font-bold tracking-widest uppercase">
                <Calendar className="w-3 h-3" /> {new Date(cert.date).getFullYear()}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedCert && (
          <CertificationModal 
            cert={selectedCert} 
            onClose={() => setSelectedCert(null)} 
          />
        )}
      </AnimatePresence>

      {certs.length === 0 && (
        <div className="text-center py-32 font-mono text-black">
          <p className="text-gray-300 text-[11px] tracking-widest uppercase font-bold">No credentials archived.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Certifications;