'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedLogo({ className = '', onAnimationComplete }) {
  // Animation duration settings
  const duration = 2.5;

  const tVariants = {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // C orbits: Starts right, goes back, swings around front of T, settles left
  const cVariants = {
    hidden: { 
      opacity: 0,
      x: 120, 
      z: -150,
      rotateY: -720,
      scale: 0.8,
      filter: 'blur(8px)'
    },
    visible: {
      opacity: [0, 1, 1, 1],
      x: [120, 40, -10, -55], // Balanced center position
      z: [-150, 150, 50, 0],   // Comes forward then settles
      rotateY: [-720, -360, -180, 0], // Spins 3D
      scale: [0.8, 1.2, 1.1, 1],
      filter: ['blur(8px)', 'blur(4px)', 'blur(1px)', 'blur(0px)'],
      transition: { 
        duration: duration, 
        ease: [0.25, 0.1, 0.25, 1], // easeInOutExpo-like
        delay: 0.4,
        times: [0, 0.4, 0.7, 1]
      }
    }
  };

  // Trailing light effect for C
  const cTrailVariants = {
    hidden: { 
      opacity: 0,
      x: 120, 
      z: -150,
      rotateY: -720,
      scale: 0.8,
      filter: 'blur(15px)'
    },
    visible: {
      opacity: [0, 0.6, 0.3, 0],
      x: [120, 40, -10, -55], 
      z: [-150, 150, 50, 0],   
      rotateY: [-720, -360, -180, 0], 
      scale: [0.8, 1.2, 1.1, 1],
      filter: ['blur(15px)', 'blur(8px)', 'blur(4px)', 'blur(2px)'],
      transition: { 
        duration: duration, 
        ease: [0.25, 0.1, 0.25, 1], 
        delay: 0.45, // slight delay for trail
        times: [0, 0.4, 0.7, 1]
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, delay: duration + 0.2, ease: "easeOut" }
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, delay: duration + 0.6, ease: "easeInOut" }
    }
  };

  const backgroundGlowVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: [0, 0.4, 0.15],
      scale: [0.5, 1.5, 1],
      transition: { duration: duration + 1, ease: "easeInOut" }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      
      {/* 3D Container for Logo */}
      <div 
        className="relative flex items-center justify-center h-32 w-64 mb-4"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        
        {/* Core background subtle pulse glow */}
        <motion.div 
          className="absolute inset-0 bg-blue-600/20 rounded-full blur-[40px]"
          variants={backgroundGlowVariants}
          initial="hidden"
          animate="visible"
        />

        {/* The 'T' - Metallic Silver */}
        <motion.div
          className="absolute z-10 text-7xl md:text-8xl font-black italic"
          style={{ 
            left: '50%', 
            transform: 'translateX(-20%)', // Centered relative to C
            color: '#E5E7EB',
            textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.8)',
            background: 'linear-gradient(to bottom, #ffffff 0%, #a1a1aa 50%, #3f3f46 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          variants={tVariants}
          initial="hidden"
          animate="visible"
        >
          T
        </motion.div>

        {/* The 'C' Light Trail */}
        <motion.div
          className="absolute z-20 text-7xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600"
          style={{ 
            left: '50%',
            transformStyle: 'preserve-3d',
            textShadow: '0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.5)',
          }}
          variants={cTrailVariants}
          initial="hidden"
          animate="visible"
        >
          C
        </motion.div>

        {/* The 'C' - Electric Blue Glow */}
        <motion.div
          className="absolute z-30 text-7xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-blue-600 to-indigo-800"
          style={{ 
            left: '50%',
            transformStyle: 'preserve-3d',
            textShadow: '0 0 15px rgba(59,130,246,0.6), 1px 1px 2px rgba(0,0,0,0.5)',
            WebkitTextStroke: '1px rgba(147, 197, 253, 0.3)' // Subtle neon edge
          }}
          variants={cVariants}
          initial="hidden"
          animate="visible"
        >
          C
        </motion.div>

      </div>

      {/* Text Container */}
      <motion.div 
        className="flex flex-col items-center z-40"
        variants={textVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onAnimationComplete}
      >
        <h2 className="text-2xl md:text-3xl font-black tracking-[0.25em] uppercase flex items-center gap-2">
          <span className="text-gray-200 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">CODTECH</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">INTERN</span>
        </h2>
        
        <motion.div 
          className="flex items-center gap-4 mt-3 w-full opacity-80"
          variants={taglineVariants}
        >
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <p className="text-[10px] md:text-[11px] text-blue-200/70 font-bold uppercase tracking-[0.35em] drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
            Empowering Future Innovators
          </p>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-blue-500/50 to-transparent"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
