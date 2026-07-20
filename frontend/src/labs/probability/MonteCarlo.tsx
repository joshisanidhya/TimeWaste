import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TrendingUp, RefreshCw, Play } from 'lucide-react';

export default function MonteCarlo() {
  const { addXP } = useAppStore();
  const [samples, setSamples] = useState(1000);
  const [running, setRunning] = useState(false);
  const [totalInCircle, setTotalInCircle] = useState(0);
  const [totalSampled, setTotalSampled] = useState(0);
  const [estimatedPi, setEstimatedPi] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const startSimulation = () => {
    if (running) return;
    
    setRunning(true);
    setTotalInCircle(0);
    setTotalSampled(0);
    setEstimatedPi(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw boundary circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.stroke();

    let count = 0;
    let inCircle = 0;
    const batchSize = Math.max(1, Math.round(samples / 100)); // distribute over frames

    const runStep = () => {
      if (count >= samples) {
        setRunning(false);
        addXP(50, `Completed Monte Carlo Simulation of ${samples} samples! 🎲`);
        return;
      }

      const width = canvas.width;
      const radius = width / 2;

      for (let i = 0; i < batchSize && count < samples; i++) {
        // Random coords between -1 and 1 relative to center
        const rx = Math.random() * 2 - 1;
        const ry = Math.random() * 2 - 1;
        
        const distSquared = rx * rx + ry * ry;
        const isInside = distSquared <= 1;

        if (isInside) {
          inCircle++;
        }
        count++;

        // Draw dot on canvas
        const cx = (rx + 1) * radius;
        const cy = (ry + 1) * radius;
        ctx.fillStyle = isInside ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(cx, cy, 2, 2);
      }

      setTotalSampled(count);
      setTotalInCircle(inCircle);
      setEstimatedPi(4 * (inCircle / count));

      animationRef.current = requestAnimationFrame(runStep);
    };

    runStep();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Description */}
      <div className="text-zinc-400 text-xs leading-relaxed">
        Simulate random coordinates to approximate the ratio of the area of a circle to a square, estimating the value of Pi (π).
      </div>

      {/* Inputs */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Number of Samples</label>
          <select
            value={samples}
            onChange={(e) => setSamples(Number(e.target.value))}
            disabled={running}
            className="px-4 py-2 rounded-xl glass-input text-zinc-300 text-xs bg-bg-dark"
          >
            <option value="500">500 Samples (Fast)</option>
            <option value="2500">2,500 Samples</option>
            <option value="10000">10,000 Samples (High Accuracy)</option>
          </select>
        </div>

        <button
          onClick={startSimulation}
          disabled={running}
          className="mt-6 px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/15 disabled:opacity-50"
        >
          {running ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
          <span>Run Simulation</span>
        </button>
      </div>

      {/* Simulator view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        {/* Canvas drawing board */}
        <div className="aspect-square bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-full h-full max-w-[300px] rounded-xl"
          />
        </div>

        {/* Live results */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp size={16} className="text-indigo-400" />
            <span>Simulation Parameters</span>
          </h4>

          <div className="space-y-2.5 text-xs font-mono text-zinc-400">
            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span>Total Points Sampled</span>
              <span className="text-zinc-200 font-bold">{totalSampled} / {samples}</span>
            </div>
            
            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span>Points Inside Circle</span>
              <span className="text-emerald-400 font-bold">{totalInCircle}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span>Points Outside Circle</span>
              <span className="text-rose-400 font-bold">{totalSampled - totalInCircle}</span>
            </div>

            <div className="flex justify-between py-2 mt-4 bg-zinc-950/60 px-3 rounded-lg border border-zinc-900">
              <span className="font-sans text-zinc-400 font-bold">Estimated π Value</span>
              <span className="text-violet-400 font-bold text-sm">
                {estimatedPi !== null ? estimatedPi.toFixed(5) : '0.00000'}
              </span>
            </div>
            
            <div className="text-[10px] text-zinc-500 font-sans leading-normal pt-2">
              Formula: π ≈ 4 * (Points inside) / (Total sampled)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
