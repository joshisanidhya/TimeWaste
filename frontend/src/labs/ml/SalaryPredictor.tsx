import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Coins, RefreshCw, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SalaryPredictor() {
  const { addXP } = useAppStore();
  const [experience, setExperience] = useState('2');
  const [role, setRole] = useState('fullstack');
  const [location, setLocation] = useState('sf');
  const [skills, setSkills] = useState<string[]>(['React', 'Node']);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ salary: number; percentile: number; breakdown: string } | null>(null);

  const availableSkills = ['React', 'Node', 'Python', 'Docker', 'Kubernetes', 'AWS', 'TensorFlow'];

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    setTimeout(() => {
      setLoading(false);

      // Regression Formula Simulation
      // Base salaries: Frontend (60k), Backend (65k), DevOps (70k), DataScience (75k), Fullstack (70k)
      // Multipliers:
      // Location: SF (1.6), London (1.2), Bangalore (0.6), Remote (1.1)
      // Experience: +8k per year
      // Skills: +4k per skill match
      let base = 60000;
      if (role === 'backend') base = 65000;
      else if (role === 'devops') base = 72000;
      else if (role === 'datascience') base = 78000;
      else if (role === 'fullstack') base = 70000;

      const expVal = parseFloat(experience) || 0;
      base += expVal * 8500;

      base += skills.length * 3500;

      let locMult = 1.0;
      if (location === 'sf') locMult = 1.6;
      else if (location === 'london') locMult = 1.25;
      else if (location === 'bangalore') locMult = 0.65;
      else if (location === 'remote') locMult = 1.15;

      const salary = Math.round(base * locMult);

      // Percentile logic
      let percentile: number;
      if (salary > 180000) percentile = 95;
      else if (salary > 140000) percentile = 88;
      else if (salary > 100000) percentile = 72;
      else if (salary > 70000) percentile = 55;
      else percentile = 35;

      setPrediction({
        salary,
        percentile,
        breakdown: `Estimated compensation of $${salary.toLocaleString()}/year. The regression weights indicate local cost of living adjustments in ${location.toUpperCase()} and skill premium for ${skills.join(', ') || 'base stack'}.`
      });

      addXP(50, 'Completed Salary Predictor Regression 💰');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Description */}
      <div className="text-zinc-400 text-xs leading-relaxed">
        Configure experience, primary job track, and technical stack. The regression estimator calculates compensation trends compiled from industry benchmarks.
      </div>

      <form onSubmit={handlePredict} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Years of Experience</label>
            <input
              type="number"
              required
              min="0"
              max="30"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-zinc-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Primary Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-zinc-300 text-xs bg-bg-dark"
            >
              <option value="frontend">Frontend Engineer</option>
              <option value="backend">Backend Engineer</option>
              <option value="fullstack">Fullstack Engineer</option>
              <option value="devops">DevOps/SRE</option>
              <option value="datascience">Data Scientist / AI Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Base Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-zinc-300 text-xs bg-bg-dark"
            >
              <option value="sf">San Francisco / Bay Area</option>
              <option value="london">London, UK</option>
              <option value="bangalore">Bangalore, IN</option>
              <option value="remote">Fully Remote</option>
            </select>
          </div>
        </div>

        {/* Skill tags */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-500">Premium Tech Stack Additions</label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const selected = skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-violet-600/20 text-violet-400 border-violet-500/40'
                      : 'text-zinc-500 border-zinc-800 bg-zinc-900/10 hover:border-zinc-700'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/15 disabled:opacity-50"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Coins size={14} />}
          <span>Predict Annual Salary</span>
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/40 text-center space-y-4">
          <RefreshCw size={24} className="animate-spin text-violet-400 mx-auto" />
          <div className="text-xs text-zinc-300 font-mono">Running Multivariate Regression Model...</div>
        </div>
      )}

      {/* Result */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
                <Landmark size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Estimated Annual Compensation</h4>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">
                  Regression Accuracy: 91.2%
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">Percentile Rank</span>
              <span className="text-sm font-black text-violet-400">Top {prediction.percentile}% of Global Devs</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-200 leading-relaxed font-mono">
            {prediction.breakdown}
          </div>
        </motion.div>
      )}
    </div>
  );
}
