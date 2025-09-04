import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cursorRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  useEffect(() => {
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Mouse follower cursor with trailing effect
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorFollower = cursorFollowerRef.current;
    if (!cursor || !cursorFollower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX - 12}px, ${mouseY - 12}px, 0)`;
    };

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      cursorFollower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0)`;
      requestAnimationFrame(animateFollower);
    };

    const addHoverEffect = () => {
      cursor.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0) scale(1.5)`;
      cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
      cursorFollower.style.transform = `translate3d(${followerX - 30}px, ${followerY - 30}px, 0) scale(1.2)`;
      cursorFollower.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    };

    const removeHoverEffect = () => {
      cursor.style.transform = `translate3d(${mouseX - 12}px, ${mouseY - 12}px, 0) scale(1)`;
      cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      cursorFollower.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    };

    // Start animation loop
    animateFollower();

    // Add event listeners
    document.addEventListener('mousemove', moveCursor);
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverEffect);
      el.addEventListener('mouseleave', removeHoverEffect);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverEffect);
        el.removeEventListener('mouseleave', removeHoverEffect);
      });
    };
  }, [isLoaded]);

  return (
    <div className="relative w-full">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 bg-white/20 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ease-out"
        style={{
          transform: 'translate3d(-12px, -12px, 0)',
        }}
      />
      
      {/* Cursor Follower */}
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 w-10 h-10 bg-white/10 rounded-full pointer-events-none z-[9998] mix-blend-difference transition-all duration-500 ease-out"
        style={{
          transform: 'translate3d(-20px, -20px, 0)',
        }}
      />
      {/* SECTION 1: Clean Modern Hero */}
      <section className="h-screen relative overflow-hidden bg-black flex items-center justify-center">
        {/* Grid Noise Background */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.02 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </motion.div>

        {/* Animated Top Gradient Blur Effects */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-3xl"
          animate={{
            background: [
              "linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.1), transparent)",
              "linear-gradient(to bottom, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.1), transparent)",
              "linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.1), transparent)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/30 to-transparent blur-2xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-transparent blur-2xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Fixed Navbar */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 flex items-center justify-center z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 bg-white/90 backdrop-blur-md mt-2 sm:mt-4 py-2 sm:py-2.5 rounded-full px-4 sm:px-6 shadow-lg border border-white/20">
            <h1 className="font-asimovian font-bold text-nowrap text-center justify-center align-middle leading-tight text-xl sm:text-2xl lg:text-3xl text-[#222] tracking-wide">
              Asimply Pulse
            </h1>
            <div className="hidden sm:flex gap-1 lg:gap-2">
              <a
                href="#"
                className="bg-transparent px-2 lg:px-3 py-2 lg:py-3 rounded-full text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                Home
              </a>
              <a
                href="#about"
                className="bg-transparent px-2 lg:px-3 py-2 lg:py-3 rounded-full text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                About
              </a>
              <a
                href="#how"
                className="bg-transparent px-2 lg:px-3 py-2 lg:py-3 rounded-full text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                Playground
              </a>
              <a
                href="#contact"
                className="bg-transparent px-2 lg:px-3 py-2 lg:py-3 rounded-full text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                Contact
              </a>
            </div>
            <a
              href="#section2"
              className="px-4 lg:px-6 py-2 lg:py-3 rounded-full text-[#fff] font-bold bg-gradient-to-r from-blue-800 to-blue-300 drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] hover:from-blue-700 hover:to-blue-400 transition-all text-sm lg:text-base"
            >
              Get started
            </a>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1 
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              Asimply Pulse
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              The future of web3 and fintech, simplified. Build, deploy, and scale decentralized applications with unprecedented ease.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.a
              href="#section2"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 transition-all shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)] text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Platform
            </motion.a>
            <motion.a
              href="#learn"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { icon: "⚡", text: "25ms Settlement" },
              { icon: "🔒", text: "Non-custodial" },
              { icon: "🌐", text: "Global Access" },
              { icon: "🚀", text: "Developer-first" }
            ].map((pill, index) => (
              <motion.span 
                key={index}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs sm:text-sm text-gray-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                {pill.icon} {pill.text}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Custom Cursor Styles */}
      <style>{`
        * {
          cursor: none !important;
        }
        
        html, body {
          background-color: #000000;
        }
        
        /* Ensure all sections have black background */
        section {
          background-color: #000000 !important;
        }
        
        /* Fix any white backgrounds that might appear during animations */
        .motion-div, [data-framer-motion] {
          background-color: transparent !important;
        }
        
        /* Smooth cursor transitions */
        .cursor-hover {
          transform: scale(1.5) !important;
          background-color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>

    </div>
  );
};

export default LandingPage;
