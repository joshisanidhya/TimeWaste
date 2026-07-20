import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AlertTriangle, Clipboard, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JsonFormatter() {
  const { addXP } = useAppStore();
  const [input, setInput] = useState('{"name":"Playorithm","status":"active","labs":["github-roast","placement-predictor"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = (spaces: number) => {
    try {
      setError(null);
      const parsed = JSON.parse(input.trim());
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutput(formatted);
      addXP(25, 'Formatted JSON payload 🛠️');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON syntax detected.');
    }
  };

  const handleMinify = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input.trim());
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      addXP(25, 'Minified JSON payload 🛠️');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON syntax detected.');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Description */}
      <div className="text-zinc-400 text-xs leading-relaxed">
        Paste raw JSON payloads. Support beautification (2/4 spaces indent), compact minification, and real-time syntax checking.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input area */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-500">Raw JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder='{"key": "value"}'
            className="w-full p-4 rounded-xl glass-input text-zinc-200 text-xs font-mono placeholder-zinc-800"
          />
        </div>

        {/* Output area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-zinc-500">Processed JSON Output</label>
            {output && (
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold flex items-center gap-1 transition-all"
              >
                {copied ? <Check size={10} className="text-emerald-400" /> : <Clipboard size={10} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            rows={10}
            placeholder="Processed output will render here..."
            className="w-full p-4 rounded-xl glass-input text-zinc-300 text-xs font-mono bg-zinc-950/40"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border-dark pt-4">
        <button
          onClick={() => handleFormat(2)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg text-xs transition-colors"
        >
          Format (2 Spaces)
        </button>
        
        <button
          onClick={() => handleFormat(4)}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-xs transition-colors border border-zinc-700"
        >
          Format (4 Spaces)
        </button>

        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-xs transition-colors border border-zinc-700"
        >
          Minify JSON
        </button>

        <button
          onClick={() => {
            setInput('');
            setOutput('');
            setError(null);
          }}
          className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 font-bold rounded-lg text-xs transition-colors border border-zinc-900"
        >
          Clear Fields
        </button>
      </div>

      {/* Validation warning */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-rose-950 bg-rose-950/10 flex items-start gap-3"
        >
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
          <div>
            <h5 className="text-xs font-bold text-rose-400">JSON Syntax Parsing Crash</h5>
            <p className="text-[10px] text-zinc-400 font-mono mt-1">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
