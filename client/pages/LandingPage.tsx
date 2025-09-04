
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Custom cursor effect
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorFollower = cursorFollowerRef.current;
    if (!cursor || !cursorFollower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const moveCursor = (e: MouseEvent) => {
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

    animateFollower();
    document.addEventListener('mousemove', moveCursor);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
    };
  }, [isLoaded]);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 bg-white/20 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ease-out"
        style={{ transform: 'translate3d(-12px, -12px, 0)' }}
      />
      
      {/* Cursor Follower */}
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 w-10 h-10 bg-white/10 rounded-full pointer-events-none z-[9998] mix-blend-difference transition-all duration-500 ease-out"
        style={{ transform: 'translate3d(-20px, -20px, 0)' }}
      />

      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center">
        {/* Animated Background Effects */}
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

        {/* Fixed Navbar */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 flex items-center justify-center z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 bg-white/90 backdrop-blur-md mt-2 sm:mt-4 py-2 sm:py-2.5 rounded-full px-4 sm:px-6 shadow-lg border border-white/20">
            <h1 className="font-bold text-nowrap text-center justify-center align-middle leading-tight text-xl sm:text-2xl lg:text-3xl text-[#222] tracking-wide">
              Asimply Pulse
            </h1>
            <div className="hidden sm:flex gap-1 lg:gap-2">
              <a href="#" className="bg-transparent px-2 lg:px-3 py-2 lg:py-3 rounded-full text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm lg:text-base">
                Home
              </a>
              <a href="#about" className="bg-transparent px-2 lg:px-3 py-2 lg:py-3 rounded-full text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm lg:text-base">
                About
              </a>
              <a href="#features" className="bg-transparent px-2 lg:px-3 py-2 lg:py-3 rounded-full text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm lg:text-base">
                Features
              </a>
            </div>
            <button
              onClick={handleGetStarted}
              className="px-4 lg:px-6 py-2 lg:py-3 rounded-full text-[#fff] font-bold bg-gradient-to-r from-blue-800 to-blue-300 drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] hover:from-blue-700 hover:to-blue-400 transition-all text-sm lg:text-base"
            >
              Get Started
            </button>
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
            <motion.button
              onClick={handleGetStarted}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 transition-all shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)] text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Platform
            </motion.button>
            <motion.button
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
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
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex flex-col items-center justify-center py-20">
        <motion.h2 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Future of Web3
        </motion.h2>
        <motion.p 
          className="text-lg opacity-80 max-w-2xl text-center px-4 leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Web3 represents the next evolution of the internet, bringing decentralized finance and blockchain technology to everyone.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm transition-colors hover:border-white/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 blur-3xl" />
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 p-3 text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Decentralized Web3</h3>
                <p className="mt-2 text-sm text-zinc-300 leading-6">
                  Trustless, permissionless networks powered by smart contracts and cryptographic primitives.
                  Own your identity and assets across interoperable ecosystems.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm transition-colors hover:border-white/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-600/30 to-cyan-600/30 blur-3xl" />
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 p-3 text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Next‑Gen FinTech</h3>
                <p className="mt-2 text-sm text-zinc-300 leading-6">
                  Real‑time payments, embedded finance, and on‑chain settlement unlock faster, borderless
                  experiences with transparent compliance and reduced costs.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            onClick={handleGetStarted}
            className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-700 to-indigo-500 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)] hover:from-blue-600 hover:to-indigo-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Building
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex flex-col items-center justify-center py-20 bg-gradient-to-b from-zinc-900/80 to-black">
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Platform Features
        </motion.h2>
        <motion.p
          className="text-lg opacity-80 max-w-2xl text-center px-4 leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Discover the powerful features that make Asimply Pulse the best choice for your web3 and fintech needs.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex flex-col items-center bg-zinc-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-white/20 transition-colors"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 text-4xl">🔗</div>
            <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
            <p className="text-sm text-zinc-300 text-center">
              Easily connect with existing tools, wallets, and protocols. Our APIs and SDKs make onboarding a breeze.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center bg-zinc-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-white/20 transition-colors"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 text-4xl">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-sm text-zinc-300 text-center">
              Advanced encryption, multi-factor authentication, and audit trails keep your assets and data safe.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center bg-zinc-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-white/20 transition-colors"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 text-4xl">📈</div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
            <p className="text-sm text-zinc-300 text-center">
              Monitor transactions, user activity, and system health with live dashboards and customizable reports.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="min-h-[60vh] flex flex-col items-center justify-center py-20 bg-zinc-950/90">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          What Our Users Say
        </motion.h2>
        <motion.div
          className="flex flex-col md:flex-row gap-8 max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex-1 bg-zinc-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full" />
              <span className="font-semibold">Alex T.</span>
            </div>
            <p className="text-zinc-300 text-sm">
              “Asimply Pulse made it so easy to launch our dApp. The documentation and support are top-notch!”
            </p>
          </motion.div>
          <motion.div
            className="flex-1 bg-zinc-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-10 h-10 rounded-full" />
              <span className="font-semibold">Priya S.</span>
            </div>
            <p className="text-zinc-300 text-sm">
              “The analytics dashboard gives us real-time insights we never had before. Highly recommended!”
            </p>
          </motion.div>
          <motion.div
            className="flex-1 bg-zinc-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" className="w-10 h-10 rounded-full" />
              <span className="font-semibold">Liam W.</span>
            </div>
            <p className="text-zinc-300 text-sm">
              “Security is our top concern, and Asimply Pulse delivers. We trust them with our most critical operations.”
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="min-h-[40vh] flex flex-col items-center justify-center py-20 bg-gradient-to-t from-blue-900/80 to-black">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-4 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Ready to get started?
        </motion.h2>
        <motion.p
          className="text-lg opacity-80 max-w-xl text-center px-4 leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Join thousands of innovators building the future of finance and the decentralized web.
        </motion.p>
        <motion.button
          onClick={handleGetStarted}
          className="px-8 py-4 rounded-full text-white font-bold bg-gradient-to-r from-blue-700 to-cyan-400 shadow-lg hover:from-blue-600 hover:to-cyan-300 transition-all text-lg"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started Now
        </motion.button>
      </section>
    </div>
  );
};

export default LandingPage;