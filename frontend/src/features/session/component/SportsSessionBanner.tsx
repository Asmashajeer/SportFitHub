import { motion } from 'framer-motion';
import { Zap,  ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLocation, } from 'react-router-dom';
const SportsBanner = () => {
  const location = useLocation();
  const isSports = location.pathname.includes('sports');


  // Configuration
  const content = {
    title: isSports ? 'Play' : 'Move',
    gradient: isSports
      ? 'from-emerald-400 via-fuchsia-500 to-yellow-400'
      : 'from-amber-800 via-fuchsia-500 to-red-400',
    glowColor: isSports ? 'bg-green-600' : 'bg-fuchsia-600',

    image: isSports ? '/SportsBanner.png' : '/fitnessBanner.png',
    pattern:
      "data:image/svg+xml,%3Csvg width='70' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E",

    tagline: isSports ? 'Compete with the Best' : 'Energy on Demand',
  };

  return (
    <div className="relative w-full min-h-125 md:h-150 bg-[#0A0A0A] overflow-hidden rounded-[2.5rem] my-6">
    
      <motion.div
        key={isSports ? 'sports-glow' : 'fitness-glow'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className={`absolute top-[-10%] right-[-5%] w-100 h-100 ${content.glowColor} rounded-full blur-[120px] animate-pulse transition-colors duration-1000`}
      />
      <div className="absolute bottom-[-10%] left-[-5%] w-75 h-75 bg-fuchsia-600 rounded-full blur-[100px] opacity-30" />


      <motion.div
        key={content.pattern}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${content.pattern})`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 ">
  
        <div className="max-w-xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6"
          >
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {content.tagline}
            </span>
          </motion.div>

          <motion.h1
            key={content.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter italic uppercase"
          >
            {content.title} <br />
            <span
              className={`text-transparent bg-clip-text bg-linear-to-r ${content.gradient}`}
            >
              Different
            </span>
          </motion.h1>

          <motion.p className="mt-6 text-lg text-slate-300 max-w-sm font-medium">
            {isSports
              ? 'Join elite sports communities and elevate your game with professional coaching.'
              : 'Ditch the boring gym. Join high-energy group sessions that feel more like a party.'}
          </motion.p>

          <div className="flex flex-wrap items-center gap-4 mt-8 justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-emerald-700 text-white hover:bg-yellow-400 transition-colors rounded-full px-8 h-14 font-bold text-lg group"
              onClick={() => {
                  document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Find a Session
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
         
          </div>
        </div>

    
        <div className="relative mt-12 md:mt-0 w-full md:w-1/2 flex justify-center">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="w-70 h-95 md:w-87.5 md:h-120 rounded-[3rem] border-8 border-white/10 rotate-3 overflow-hidden shadow-2xl shadow-blue-500/20">
              <motion.img
                key={content.image}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                src={content.image}
                alt="Action"
                className="w-full h-full object-cover -rotate-3"
              />
            </div>

            {/* <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-6 -left-12 bg-black border border-emerald-800 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
            >
              <div className="bg-black p-3 rounded-xl">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">
                  Active users
                </p>
                <p className="text-xl font-black text-slate-900"></p>
              </div>
            </motion.div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SportsBanner;
