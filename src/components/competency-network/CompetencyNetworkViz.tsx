import { motion } from 'motion/react';

export interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

export interface NetworkEdge {
  from: string;
  to: string;
  label: 'assumes' | 'extends' | 'matches';
}

export const NETWORK_NODES: NetworkNode[] = [
  { id: 'methods', label: 'Methods', x: 80, y: 50, color: '#0a4da2' },
  { id: 'functions', label: 'Functions', x: 80, y: 150, color: '#0a4da2' },
  { id: 'recursion', label: 'Recursion', x: 280, y: 100, color: '#5538d1' },
  { id: 'mergesort', label: 'Merge Sort', x: 480, y: 50, color: '#7c3aed' },
  { id: 'sorting', label: 'Sorting', x: 600, y: 50, color: '#7c3aed' },
  { id: 'trees', label: 'Tree Traversal', x: 480, y: 155, color: '#9b5dfa' },
];

export const NETWORK_EDGES: NetworkEdge[] = [
  { from: 'methods', to: 'functions', label: 'matches' },
  { from: 'recursion', to: 'methods', label: 'assumes' },
  { from: 'mergesort', to: 'recursion', label: 'assumes' },
  { from: 'trees', to: 'recursion', label: 'assumes' },
  { from: 'mergesort', to: 'sorting', label: 'extends' },
];

export const EDGE_COLORS: Record<string, string> = {
  assumes: '#0a4da2',
  extends: '#7c3aed',
  matches: '#10b981',
};

export interface CompetencyNetworkVizProps {
  showTitle?: boolean;
  animated?: boolean;
  floatingNodes?: boolean;
  className?: string;
  idPrefix?: string;
}

export function CompetencyNetworkViz({
  showTitle = true,
  animated = true,
  floatingNodes = true,
  className = '',
  idPrefix = 'network',
}: CompetencyNetworkVizProps) {
  const nodeMap = Object.fromEntries(NETWORK_NODES.map(n => [n.id, n]));

  // Animation helpers
  const lineAnimation = animated
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } };

  const textAnimation = animated
    ? { initial: { opacity: 0 }, animate: { opacity: 0.6 } }
    : { initial: { opacity: 0.6 }, animate: { opacity: 0.6 } };

  const nodeAnimation = (i: number) =>
    animated
      ? {
          initial: { opacity: 0, scale: 0 },
          animate: {
            opacity: 1,
            scale: 1,
            ...(floatingNodes && { y: [0, -3, 0, 3, 0] }),
          },
          transition: {
            opacity: { delay: 0.15 + i * 0.07, duration: 0.35 },
            scale: { delay: 0.15 + i * 0.07, duration: 0.35 },
            ...(floatingNodes && {
              y: {
                delay: 1 + i * 0.2,
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut' as const,
              },
            }),
          },
        }
      : {
          initial: { opacity: 1, scale: 1 },
          animate: {
            opacity: 1,
            scale: 1,
            ...(floatingNodes && { y: [0, -3, 0, 3, 0] }),
          },
          transition: floatingNodes
            ? {
                y: {
                  delay: i * 0.2,
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                },
              }
            : undefined,
        };

  return (
    <div
      className={`relative rounded-2xl border border-[#0a4da2]/20 bg-gradient-to-br from-blue-50/90 via-white/80 to-indigo-50/70 p-5 shadow-[0_8px_30px_-10px_rgba(7,30,84,0.15)] overflow-hidden ${className}`}
    >
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Competency Network Preview
          </span>
        </div>
      )}
      <svg viewBox="0 0 640 200" className="w-full h-auto">
        <defs>
          <marker
            id={`${idPrefix}-arrow-assumes`}
            viewBox="0 0 10 6"
            refX="9"
            refY="3"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,3 L0,6" fill="#0a4da2" fillOpacity="0.5" />
          </marker>
          <marker
            id={`${idPrefix}-arrow-extends`}
            viewBox="0 0 10 6"
            refX="9"
            refY="3"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,3 L0,6" fill="#7c3aed" fillOpacity="0.5" />
          </marker>
          <filter
            id={`${idPrefix}-node-shadow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#0a4da2"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        {}
        {NETWORK_EDGES.map((edge, i) => {
          const from = nodeMap[edge.from]!;
          const to = nodeMap[edge.to]!;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          const isDirectional =
            edge.label === 'assumes' || edge.label === 'extends';
          const markerId =
            edge.label === 'extends'
              ? `url(#${idPrefix}-arrow-extends)`
              : `url(#${idPrefix}-arrow-assumes)`;

          // Shorten line so arrowhead sits on circle edge, not behind it
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const r = 34; // node radius + small margin
          const x1 = from.x + (dx / len) * r;
          const y1 = from.y + (dy / len) * r;
          const x2 = to.x - (dx / len) * r;
          const y2 = to.y - (dy / len) * r;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={EDGE_COLORS[edge.label] ?? '#94a3b8'}
                strokeWidth={1.5}
                strokeOpacity={0.4}
                markerEnd={isDirectional ? markerId : undefined}
                {...lineAnimation}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              />
              <motion.text
                x={edge.label === 'matches' ? mx - 30 : mx}
                y={my - (edge.label === 'matches' ? 0 : 10)}
                textAnchor="middle"
                fill={EDGE_COLORS[edge.label] ?? '#94a3b8'}
                fontSize={9}
                fontWeight={600}
                fontFamily="Geist, system-ui, sans-serif"
                opacity={0.6}
                {...textAnimation}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
              >
                {edge.label}
              </motion.text>
            </g>
          );
        })}

        {}
        {NETWORK_NODES.map((node, i) => (
          <motion.g key={node.id} {...nodeAnimation(i)}>
            <circle
              cx={node.x}
              cy={node.y}
              r={32}
              fill="white"
              stroke={node.color}
              strokeWidth={2}
              filter={`url(#${idPrefix}-node-shadow)`}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={node.color}
              fontSize={9}
              fontWeight={700}
              fontFamily="Geist, system-ui, sans-serif"
            >
              {node.label.includes(' ') ? (
                <>
                  <tspan x={node.x} dy="-0.5em">
                    {node.label.split(' ')[0]}
                  </tspan>
                  <tspan x={node.x} dy="1.1em">
                    {node.label.split(' ').slice(1).join(' ')}
                  </tspan>
                </>
              ) : (
                node.label
              )}
            </text>
          </motion.g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mt-3 md:mt-4 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-[#0a4da2] bg-white shadow-sm" />
          Competency
        </span>
        <div className="hidden sm:block h-3.5 w-px bg-slate-300/80 rounded-full" />
        <span className="flex items-center gap-1.5">
          <div className="flex items-center">
            <span
              className="inline-block h-[2px] w-3.5 sm:w-4"
              style={{ background: EDGE_COLORS.assumes }}
            />
            <span
              className="inline-block w-0 h-0 border-y-[4px] border-y-transparent border-l-[5px]"
              style={{ borderLeftColor: EDGE_COLORS.assumes }}
            />
          </div>
          Assumes
        </span>
        <span className="flex items-center gap-1.5">
          <div className="flex items-center">
            <span
              className="inline-block h-[2px] w-3.5 sm:w-4"
              style={{ background: EDGE_COLORS.extends }}
            />
            <span
              className="inline-block w-0 h-0 border-y-[4px] border-y-transparent border-l-[5px]"
              style={{ borderLeftColor: EDGE_COLORS.extends }}
            />
          </div>
          Extends
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-[2px] w-5 sm:w-6"
            style={{ background: EDGE_COLORS.matches }}
          />
          Matches
        </span>
      </div>
    </div>
  );
}
