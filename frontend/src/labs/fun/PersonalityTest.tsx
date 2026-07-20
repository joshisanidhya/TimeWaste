import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { RefreshCw, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizQuestion {
  q: string;
  options: { text: string; type: 'vim' | 'copier' | 'rockstar' | 'fanboy' }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    q: 'How do you exit Vim?',
    options: [
      { text: 'Type :wq and hit Enter.', type: 'vim' },
      { text: 'Close the terminal window completely.', type: 'copier' },
      { text: 'Reboot the entire system.', type: 'rockstar' },
      { text: 'I do not, I use VSCode.', type: 'fanboy' },
    ]
  },
  {
    q: 'A bug is discovered in production at 4:55 PM on Friday. What do you do?',
    options: [
      { text: 'Run git blame, figure out who did it, and assign the ticket.', type: 'vim' },
      { text: 'Copy the error code directly into StackOverflow.', type: 'copier' },
      { text: 'Rewrite the entire application in Rust over the weekend.', type: 'rockstar' },
      { text: 'Deploy a hotfix directly to Vercel and pretend nothing happened.', type: 'fanboy' },
    ]
  },
  {
    q: 'What is your primary programming fuel?',
    options: [
      { text: 'Black coffee, strictly no sugar.', type: 'vim' },
      { text: 'Ultra Blue Monster Energy drink.', type: 'copier' },
      { text: 'Specialty single-origin espresso.', type: 'rockstar' },
      { text: 'Matcha Latte with Oat Milk.', type: 'fanboy' },
    ]
  },
  {
    q: 'How do you structure your projects?',
    options: [
      { text: 'Standard directories, Makefile, fully manual.', type: 'vim' },
      { text: 'Whatever structure came in the create-react-app zip file.', type: 'copier' },
      { text: 'Clean architectural layers with fully decoupled microservices.', type: 'rockstar' },
      { text: 'Next.js app router with everything in page.tsx.', type: 'fanboy' },
    ]
  }
];

const ARCHETYPES = {
  vim: {
    name: 'Vim Purist / Old School Sage',
    desc: 'You believe IDEs are bloated and that true coding is done in raw terminals. You can navigate files faster than light but struggle to communicate with humans. You have a Makefile for everything.',
    stat: 'Indie Dev Score: 98%'
  },
  copier: {
    name: 'StackOverflow Copy-Paster',
    desc: 'Why write code when someone else already did? You are a master compiler of snippets. You don\'t know how the state machine works, but it runs, and that is all that matters to your boss.',
    stat: 'Google search skills: 99%'
  },
  rockstar: {
    name: '10x Rockstar Architect',
    desc: 'You rewrite standard tools because they are not optimized enough. You dream in assembly and binary trees. You love talking about CPU instruction caches but rarely ship basic product features on time.',
    stat: 'Ego factor: 10/10'
  },
  fanboy: {
    name: 'Modern Vercel / Next.js Fanboy',
    desc: 'You love UI/UX, glassmorphism, and tailwind. If a framework can\'t be initialized with one npx script, you won\'t use it. You spend 4 hours adjusting button margins to look premium.',
    stat: 'Aesthetic standards: Max'
  }
};

export default function PersonalityTest() {
  const { addXP } = useAppStore();
  const [curQ, setCurQ] = useState(0);
  const [scores, setScores] = useState({ vim: 0, copier: 0, rockstar: 0, fanboy: 0 });
  const [result, setResult] = useState<keyof typeof ARCHETYPES | null>(null);

  const handleSelectAnswer = (type: 'vim' | 'copier' | 'rockstar' | 'fanboy') => {
    const updatedScores = { ...scores, [type]: scores[type] + 1 };
    setScores(updatedScores);

    if (curQ < QUESTIONS.length - 1) {
      setCurQ(prev => prev + 1);
    } else {
      // Find highest score
      let highestKey: keyof typeof ARCHETYPES = 'vim';
      let maxScore = -1;
      (Object.keys(updatedScores) as (keyof typeof ARCHETYPES)[]).forEach((key) => {
        if (updatedScores[key] > maxScore) {
          maxScore = updatedScores[key];
          highestKey = key;
        }
      });

      setResult(highestKey);
      addXP(50, `Finished Personality Test: ${ARCHETYPES[highestKey].name} 🎭`);
    }
  };

  const handleReset = () => {
    setCurQ(0);
    setScores({ vim: 0, copier: 0, rockstar: 0, fanboy: 0 });
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Description */}
      <div className="text-zinc-400 text-xs leading-relaxed">
        Answer our short diagnostic quiz to reveal your true engineering archetype.
      </div>

      {!result ? (
        /* Quiz Window */
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-6">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>Question {curQ + 1} of {QUESTIONS.length}</span>
            <span>Progress {Math.round(((curQ) / QUESTIONS.length) * 100)}%</span>
          </div>

          <h3 className="text-sm font-bold text-white leading-relaxed">{QUESTIONS[curQ].q}</h3>

          <div className="flex flex-col gap-3">
            {QUESTIONS[curQ].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt.type)}
                className="w-full text-left px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/40 text-xs hover:border-violet-500/40 hover:bg-violet-600/5 text-zinc-300 hover:text-white transition-all flex items-center justify-between"
              >
                <span>{opt.text}</span>
                <ChevronRight size={14} className="text-zinc-600" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/10 text-center space-y-6"
        >
          <div className="w-12 h-12 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/20">
            <Award size={24} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Your Archetype</span>
            <h3 className="text-xl font-black text-white">{ARCHETYPES[result].name}</h3>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
            {ARCHETYPES[result].desc}
          </p>

          <div className="inline-block px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs font-bold text-violet-400">
            {ARCHETYPES[result].stat}
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw size={12} />
              <span>Test Again</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
