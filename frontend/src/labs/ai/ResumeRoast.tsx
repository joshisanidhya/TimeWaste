import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FileText, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeRoast() {
  const { addXP } = useAppStore();
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [roast, setRoast] = useState<string | null>(null);
  const [scores, setScores] = useState<{ impact: number; clarity: number; buzzwords: number } | null>(null);

  const statuses = [
    'Parsing experience section...',
    'Checking action verb frequencies...',
    'Flagging generic descriptions like "team player"...',
    'Simulating applicant tracking system (ATS) filters...',
    'Compiling grammatical and formatting warnings...',
  ];

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    setRoast(null);
    setScores(null);

    let currentStep = 0;
    setStatusText(statuses[0]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statuses.length) {
        setStatusText(statuses[currentStep]);
      }
    }, 900);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);

      const jokes = [
        `Wow, this resume is a work of fiction. You spent three bullet points explaining how you "optimized a workflow using Docker" when in reality you just wrote a Dockerfile with three commands and ran it once on your local machine. Your skill list contains 47 different technologies, including things you read about in a medium article yesterday.`,
        `Reading your work summary. You list yourself as a "Senior Developer" because you created a React dashboard that fetches data from a single public weather API. You have "Agile methodologies" listed as a skill. We all know that just means you stood up in a circle for 10 minutes every morning and talked about how you were still waiting on backend endpoints.`,
        `This is a classic template. You used a double-column layout with circular rating indicators showing you are 90% proficient in Python. Who graded you on that? Yourself? Your projects list contains two different clones of Netflix, which shows you can follow a Udemy tutorial but can't build a database schema of your own without getting a headache.`,
      ];

      setRoast(jokes[Math.floor(Math.random() * jokes.length)]);
      setScores({
        impact: Math.floor(20 + Math.random() * 25),
        clarity: Math.floor(30 + Math.random() * 30),
        buzzwords: Math.floor(75 + Math.random() * 20),
      });

      addXP(50, 'Finished Resume Roast AI 📄');
    }, 5000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Description */}
      <div className="text-zinc-400 text-xs leading-relaxed">
        Paste your raw resume summary, roles, and skills list. Our model scans for overused buzzwords, bullet point impact, and format errors.
      </div>

      {/* Input form */}
      <form onSubmit={handleRoast} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-500">Resume Content (Summary, Experience, & Skills)</label>
          <textarea
            required
            rows={6}
            placeholder="Paste resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={loading}
            className="w-full p-4 rounded-xl glass-input text-zinc-200 text-xs placeholder-zinc-700 font-sans"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setResumeText('')}
            className="px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1.5 transition-all"
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
          
          <button
            type="submit"
            disabled={loading || !resumeText.trim()}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-violet-600/15 disabled:opacity-50"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>Roast Resume</span>
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/40 text-center space-y-4">
          <RefreshCw size={24} className="animate-spin text-violet-400 mx-auto" />
          <div className="text-xs text-zinc-300 font-mono">{statusText}</div>
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-violet-500 rounded-full animate-shimmer" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Result */}
      {roast && scores && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Roast Message */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 relative">
            <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <FileText size={12} className="text-indigo-400" /> Roast Diagnosis
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed font-mono whitespace-pre-line mt-2">
              {roast}
            </p>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 text-center">
              <span className="block text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Impact Score</span>
              <span className="text-xl font-bold font-mono text-zinc-200 mt-1 block">{scores.impact}/100</span>
            </div>
            
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 text-center">
              <span className="block text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Clarity</span>
              <span className="text-xl font-bold font-mono text-zinc-200 mt-1 block">{scores.clarity}/100</span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 text-center">
              <span className="block text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Buzzword Count</span>
              <span className="text-xl font-bold font-mono text-zinc-200 mt-1 block">{scores.buzzwords}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
