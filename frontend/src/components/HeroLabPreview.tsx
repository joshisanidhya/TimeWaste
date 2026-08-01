import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  sublabel: string;
  category: string;
  x: number; // percentage
  y: number; // percentage
  color: string;
}

const NODES: Node[] = [
  {
    id: 'ai',
    label: 'AI',
    sublabel: '3 LABS',
    category: 'ai',
    x: 50,
    y: 20,
    color: 'var(--cat-ai)',
  },
  {
    id: 'ml',
    label: 'ML',
    sublabel: '2 LABS',
    category: 'ml',
    x: 80,
    y: 45,
    color: 'var(--cat-ml)',
  },
  {
    id: 'probability',
    label: 'PROBABILITY',
    sublabel: '1 LAB',
    category: 'probability',
    x: 68,
    y: 78,
    color: 'var(--cat-probability)',
  },
  {
    id: 'fun',
    label: 'FUN',
    sublabel: '1 LAB',
    category: 'fun',
    x: 32,
    y: 78,
    color: 'var(--cat-fun)',
  },
  {
    id: 'utility',
    label: 'UTILITY',
    sublabel: '1 LAB',
    category: 'utility',
    x: 20,
    y: 45,
    color: 'var(--cat-utility)',
  },
];

const CENTER = { x: 50, y: 50 };

export const ExperimentEngine: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReduced || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPointer({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    [prefersReduced]
  );

  // Parallax offset for nodes based on mouse
  const getOffset = (nodeX: number, nodeY: number) => {
    if (prefersReduced) return { dx: 0, dy: 0 };
    const distFromCenter = Math.sqrt(
      Math.pow(nodeX - CENTER.x, 2) + Math.pow(nodeY - CENTER.y, 2)
    );
    const factor = distFromCenter / 100;
    return {
      dx: (pointer.x - 0.5) * factor * 18,
      dy: (pointer.y - 0.5) * factor * 18,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full select-none"
      style={{ height: '360px' }}
    >
      {/* SVG connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0.35 }}
      >
        {NODES.map((node) => {
          const offset = getOffset(node.x, node.y);
          const nx = node.x + offset.dx * 0.01 * 100;
          const ny = node.y + offset.dy * 0.01 * 100;
          const isHovered = hoveredNode === node.id;
          return (
            <line
              key={node.id}
              x1={`${CENTER.x}%`}
              y1={`${CENTER.y}%`}
              x2={`${nx}%`}
              y2={`${ny}%`}
              stroke={isHovered ? node.color : 'var(--border-strong)'}
              strokeWidth={isHovered ? '0.4' : '0.2'}
              strokeDasharray={isHovered ? 'none' : '1.5 1.5'}
              style={{ transition: 'all 0.2s ease' }}
            />
          );
        })}
      </svg>

      {/* Center node: PLAYORITHM */}
      <motion.div
        className="absolute"
        style={{
          left: `${CENTER.x}%`,
          top: `${CENTER.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: prefersReduced ? 0 : (pointer.x - 0.5) * 6,
          y: prefersReduced ? 0 : (pointer.y - 0.5) * 6,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.5 }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-full"
          style={{
            width: 96,
            height: 96,
            border: '1px solid var(--border-signal)',
            background: 'var(--bg-surface)',
            boxShadow: '0 0 40px rgba(199, 255, 61, 0.08)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--signal-text)',
            }}
          >
            CORE
          </span>
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              marginTop: 2,
            }}
          >
            PLAYORITHM
          </span>
        </div>
      </motion.div>

      {/* Category nodes */}
      {NODES.map((node) => {
        const offset = getOffset(node.x, node.y);
        const isHovered = hoveredNode === node.id;

        return (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              x: prefersReduced ? 0 : offset.dx,
              y: prefersReduced ? 0 : offset.dy,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 18, mass: 0.5 }}
            onHoverStart={() => setHoveredNode(node.id)}
            onHoverEnd={() => setHoveredNode(null)}
            onClick={() => navigate(`/labs?category=${node.category}`)}
          >
            <motion.div
              animate={{
                borderColor: isHovered ? node.color : 'var(--border-default)',
                boxShadow: isHovered
                  ? `0 0 24px ${node.color}28`
                  : '0 0 0px transparent',
              }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded"
              style={{
                background: isHovered
                  ? `color-mix(in srgb, ${node.color} 8%, var(--bg-elevated))`
                  : 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                minWidth: 72,
              }}
            >
              <span
                style={{
                  fontWeight: 900,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.06em',
                  color: isHovered ? node.color : 'var(--text-primary)',
                  transition: 'color 0.18s ease',
                }}
              >
                {node.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-tertiary)',
                }}
              >
                {node.sublabel}
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Instruction label */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          paddingBottom: '0.25rem',
        }}
      >
        CLICK A NODE TO EXPLORE CATEGORY
      </div>
    </div>
  );
};
