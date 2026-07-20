import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, Brain, Dices, ChevronRight, Terminal } from 'lucide-react';
import { LAB_CATEGORIES } from '@/labs/registry';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as any } }
  };

  const handleStart = () => {
    if (user) {
      navigate('/labs');
    } else {
      navigate('/auth');
    }
  };

  const faqItems = [
    {
      q: 'What is Playorithm?',
      a: 'Playorithm is an open-source, AI-powered Developer Entertainment and Productivity platform designed to combine machine learning, code logic, game theory, and developer-centric roasts into a single interactive playground.'
    },
    {
      q: 'How do the machine learning predictors work?',
      a: 'Unlike basic projects that use random generators, Playorithm uses authentic scikit-learn models (such as Random Forest Classifier and Linear Regression) trained on developer datasets. They are served via an isolated Python FastAPI microservice.'
    },
    {
      q: 'Can I add custom labs?',
      a: 'Absolutely! Playorithm is built with a registry-based plug-and-play architecture. Each Lab is completely isolated in its own directory. You can create a new Lab, add its metadata to our registry registry.ts, and it will immediately render and work.'
    }
  ];

  return (
    <div className="relative space-y-24 py-8">
      {/* Hero Section */}
      <section className="text-center relative max-w-4xl mx-auto py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs font-semibold mb-6 tracking-wide animate-float"
        >
          <Sparkles size={14} className="animate-spin" />
          <span>Announcing Playorithm v1.0.0 (Phase 1)</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none"
        >
          Where Developers Play <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
            with Intelligence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-base md:text-xl max-w-2xl mt-6 leading-relaxed"
        >
          Steam for developer mini-apps. A beautiful sandbox uniting AI coding roasts, mathematical probability playgrounds, machine learning career predictors, and diagnostic developer tests.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 z-10"
        >
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{user ? 'Go to Dashboard' : 'Explore Platform'}</span>
            <ChevronRight size={16} />
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>Star on GitHub</span>
          </a>
        </motion.div>
      </section>

      {/* Feature Categories Grid */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Explore the Labs</h2>
          <p className="text-zinc-500 text-sm mt-2">Seven specialized environments custom built for engineering excellence and fun.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {LAB_CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              onClick={() => navigate(`/labs?category=${category.id}`)}
              className="p-6 rounded-2xl glass-panel glass-panel-hover cursor-pointer relative overflow-hidden group"
            >
              <div 
                className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: category.glowClass }}
              ></div>
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.colorClass} flex items-center justify-center mb-6 border border-white/10 shadow-lg`}>
                {category.id === 'ai' && <Sparkles className="text-white" size={22} />}
                {category.id === 'ml' && <Brain className="text-white" size={22} />}
                {category.id === 'probability' && <Dices className="text-white" size={22} />}
                {category.id !== 'ai' && category.id !== 'ml' && category.id !== 'probability' && (
                  <Terminal className="text-white" size={22} />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-zinc-100 group-hover:text-violet-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                {category.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Release Roadmap */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Development Roadmap</h2>
          <p className="text-zinc-500 text-sm mt-2">Our staged releases paving the way to becoming the ultimate developer station.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:left-4 sm:before:left-1/2 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
          {[
            { phase: 'Phase 1', title: 'Foundation MVP', desc: 'Core dynamic architecture, persisted user sessions, gamification XP hooks, and 8 flagship active labs (roasters, simulators, utilities).', status: 'Active Release' },
            { phase: 'Phase 2', title: 'ML Models & AI Roasts', desc: 'Pre-training regression and classifier models for career path predictors, skill gaps, and LinkedIn roaster modules.', status: 'Up Next' },
            { phase: 'Phase 3', title: 'Visualizers & Speed Games', desc: 'Real-time algorithm visualizers (Sorting, graph traversal) and typing speeds using full programming syntax code bases.', status: 'Planned' },
            { phase: 'Phase 4', title: 'Social & Streaks', desc: 'Persistent DB profiles, daily developer challenges, dynamic badges/achievements, and GitHub Wrapped templates.', status: 'Planned' }
          ].map((step, idx) => (
            <div key={idx} className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
              <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-violet-500 border-4 border-bg-dark -translate-x-1.5 sm:-translate-x-2"></div>
              
              <div className={`w-full sm:w-1/2 pl-10 sm:pl-0 sm:pr-8 text-left sm:text-right ${idx % 2 !== 0 && 'sm:order-2 sm:text-left sm:pl-8 sm:pr-0'}`}>
                <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 bg-violet-400/5 border border-violet-400/20 px-2 py-0.5 rounded">
                  {step.phase}
                </span>
                <h4 className="text-lg font-bold text-zinc-100 mt-2">{step.title}</h4>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{step.desc}</p>
                <div className="text-zinc-500 text-[10px] mt-1 font-semibold">{step.status}</div>
              </div>
              <div className="hidden sm:block w-1/2"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
              <h4 className="text-base font-semibold text-zinc-100">{item.q}</h4>
              <p className="text-zinc-400 text-xs mt-2.5 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center p-12 rounded-3xl border border-border-dark glass-panel relative overflow-hidden max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 blur-3xl rounded-full"></div>
        <h3 className="text-3xl font-bold text-white relative z-10">Ready to test your code wits?</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mt-4 relative z-10">Join other developers pushing code intelligence to its extreme limit in our sandbox.</p>
        <button
          onClick={handleStart}
          className="mt-8 px-8 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-sm transition-all relative z-10 hover:scale-105 active:scale-95"
        >
          {user ? 'Enter Dashboard' : 'Claim Guest Handle'}
        </button>
      </section>
    </div>
  );
};
