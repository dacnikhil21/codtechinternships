'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedLogo({ className = '', onAnimationComplete }) {
  // Animation variants
  const tVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cVariants = {
    hidden: { 
      opacity: 0,
      x: 60, 
      rotate: -180,
      scale: 0.5,
      z: 10
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: { 
        duration: 1.5, 
        ease: [0.25, 0.1, 0.25, 1], // Custom smooth easing
        delay: 0.3 
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 1.8, ease: "easeOut" }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: [0, 0.5, 0.2],
      scale: [0.5, 1.2, 1],
      transition: { duration: 2, delay: 1.5, ease: "easeInOut" }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Logo Container */}
      <div className="relative flex items-center justify-center h-32 w-48 mb-4">
        
        {/* Subtle Background Glow */}
        <motion.div 
          className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
          variants={glowVariants}
          initial="hidden"
          animate="visible"
        />

        {/* The 'T' */}
        <motion.div
          className="absolute z-10 text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          style={{ left: '50%', transform: 'translateX(-20%)' }}
          variants={tVariants}
          initial="hidden"
          animate="visible"
        >
          T
        </motion.div>

        {/* The 'C' */}
        <motion.div
          className="absolute z-20 text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-700 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          style={{ right: '50%', transformOrigin: 'center right' }}
          variants={cVariants}
          initial="hidden"
          animate="visible"
        >
          C
        </motion.div>

        {/* C trailing motion effect (optional visual enhancement) */}
        <motion.div
          className="absolute z-0 text-6xl md:text-7xl font-black italic text-blue-500/20 blur-sm"
          style={{ right: '50%', transformOrigin: 'center right' }}
          variants={{
            hidden: { opacity: 0, x: 80, rotate: -180, scale: 0.5 },
            visible: { 
              opacity: [0, 0.3, 0], 
              x: 0, 
              rotate: 0, 
              scale: 1,
              transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          C
        </motion.div>
      </div>

      {/* Text Container */}
      <motion.div 
        className="flex flex-col items-center"
        variants={textVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onAnimationComplete}
      >
        <h2 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase flex items-center gap-2">
          <span className="text-gray-200">CODTECH</span>
          <span className="text-blue-500">INTERN</span>
        </h2>
        <div className="flex items-center gap-4 mt-2 w-full">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-blue-500/50"></div>
          <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
            Empowering Future Innovators
          </p>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-blue-500/50"></div>
        </div>
      </motion.div>
    </div>
  );
}
