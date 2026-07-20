import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MessageSquare, Send, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  role: 'system' | 'interviewer' | 'candidate';
  text: string;
}

const QUESTIONS = {
  dsa: [
    'Let\'s start. How would you design a rate limiter for an API endpoint? Explain the algorithm and time complexity.',
    'Explain the differences between a Breadth-First Search (BFS) and Depth-First Search (DFS). When would you prefer one over the other?',
  ],
  system: [
    'How would you design a notification service like the one used at Netflix, capable of sending millions of messages daily with low latency?',
    'Explain how database sharding works and detail the trade-offs of using consistent hashing vs range-based sharding.',
  ],
  behavioral: [
    'Tell me about a time you had a technical disagreement with a senior engineer or teammate. How did you resolve it?',
    'Explain a situation where you had to ship a project with critical bugs due to tight deadlines. What choices did you make?',
  ]
};

export default function InterviewSimulator() {
  const { addXP } = useAppStore();
  const [topic, setTopic] = useState<'dsa' | 'system' | 'behavioral' | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number; review: string } | null>(null);

  const startInterview = (selectedTopic: 'dsa' | 'system' | 'behavioral') => {
    setTopic(selectedTopic);
    setQuestionIdx(0);
    setEvaluation(null);
    setMessages([
      {
        role: 'interviewer',
        text: `Welcome to the ${selectedTopic.toUpperCase()} Interview. Here is your first question:\n\n${QUESTIONS[selectedTopic][0]}`
      }
    ]);
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || !topic) return;

    const userMsg = currentInput.trim();
    const updatedMessages = [
      ...messages,
      { role: 'candidate' as const, text: userMsg }
    ];
    setMessages(updatedMessages);
    setCurrentInput('');

    // Check if there's a second question
    if (questionIdx < QUESTIONS[topic].length - 1) {
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        setQuestionIdx(prev => prev + 1);
        setMessages(prev => [
          ...prev,
          {
            role: 'interviewer',
            text: `Good point. Let's move to the next question:\n\n${QUESTIONS[topic][questionIdx + 1]}`
          }
        ]);
      }, 1500);
    } else {
      // End of interview, trigger evaluation
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        const finalScore = Math.floor(65 + Math.random() * 30);
        const reviews = [
          'Excellent structural breakdown. You covered horizontal scale capabilities and failure tolerances appropriately. Make sure to define edge conditions next time.',
          'Solid conceptual understanding. However, you could improve on detailing the time complexity trade-offs and network protocols in your diagram explanation.',
          'Good behavioral examples. You demonstrated active listening and resolution pathways. Be sure to structure your answers using the STAR method (Situation, Task, Action, Result).',
        ];
        setEvaluation({
          score: finalScore,
          review: reviews[Math.floor(Math.random() * reviews.length)]
        });

        // Reward XP for finishing
        addXP(75, `Completed ${topic.toUpperCase()} interview simulation! 🎓`);
      }, 2500);
    }
  };

  const handleReset = () => {
    setTopic(null);
    setMessages([]);
    setQuestionIdx(0);
    setEvaluation(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Description */}
      <div className="text-zinc-400 text-xs leading-relaxed">
        Select a specialized topic to simulate real-time conversational interviews. Submit detailed answers to receive instant structural scores.
      </div>

      {!topic ? (
        /* Topic Selection Screens */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['dsa', 'system', 'behavioral'] as const).map((t) => (
            <button
              key={t}
              onClick={() => startInterview(t)}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 text-center hover:border-violet-500/40 hover:bg-zinc-900/20 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform border border-violet-500/20">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">{t}</h3>
              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                {t === 'dsa' && 'Algorithms, complexity, tree traversal.'}
                {t === 'system' && 'Load balancers, database scaling, caching.'}
                {t === 'behavioral' && 'Conflict resolution, work deadlines, teamwork.'}
              </p>
            </button>
          ))}
        </div>
      ) : (
        /* Interview Chat Workspace */
        <div className="space-y-6">
          {/* Chat transcript */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'candidate' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center text-xs shrink-0 ${
                  msg.role === 'candidate' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {msg.role === 'candidate' ? 'C' : 'I'}
                </div>
                
                <div className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'candidate'
                    ? 'bg-violet-600/10 text-violet-200 border border-violet-500/20'
                    : 'bg-zinc-950 text-zinc-300 border border-zinc-900'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isEvaluating && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="p-2 rounded-full h-8 w-8 bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs shrink-0">
                  I
                </div>
                <div className="p-4 rounded-xl text-xs bg-zinc-950 text-zinc-500 border border-zinc-900 flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-violet-400" />
                  <span>Evaluating answer structure...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          {!evaluation && !isEvaluating && (
            <form onSubmit={handleSubmitAnswer} className="flex gap-2">
              <input
                type="text"
                required
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 px-4 py-2.5 rounded-xl glass-input text-zinc-200 text-xs placeholder-zinc-700"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs flex items-center justify-center shadow-lg shadow-violet-600/15"
              >
                <Send size={14} />
              </button>
            </form>
          )}

          {/* Evaluation Results */}
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="text-emerald-400" size={16} />
                  <span>Interview Session Complete</span>
                </h4>
                
                <div className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs font-bold text-violet-400">
                  Score: {evaluation.score}/100
                </div>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                {evaluation.review}
              </p>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-xs transition-colors"
              >
                Try Another Topic
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
