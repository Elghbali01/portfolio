"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BarChart3, Blocks, BrainCircuit } from "lucide-react";

export type ExpertiseCardId =
  | "artificial-intelligence"
  | "data-science"
  | "software-engineering";

export interface ExpertiseCardData {
  id: ExpertiseCardId;
  title: string;
  description: string;
  badges: readonly string[];
}

const iconById = {
  "artificial-intelligence": BrainCircuit,
  "data-science": BarChart3,
  "software-engineering": Blocks,
} satisfies Record<ExpertiseCardId, typeof BrainCircuit>;

const diagramDelay = (order: number, intervalMs: number): CSSProperties =>
  ({ "--diagram-delay": `${order * intervalMs}ms` }) as CSSProperties;

function ExpertiseIllustration({ id }: { id: ExpertiseCardId }) {
  if (id === "artificial-intelligence") {
    const networkPath = "M20 78 50 58 76 84 108 61 137 78 160 58";
    const nodes = [
      [20, 34],
      [52, 54],
      [72, 25],
      [103, 47],
      [137, 25],
      [160, 43],
      [20, 78],
      [50, 58],
      [76, 84],
      [108, 61],
      [137, 78],
      [160, 58],
    ];

    return (
      <svg viewBox="0 0 180 112" className="expertise-illustration-svg" focusable="false">
        <path className="expertise-illustration-track" d="M20 34 52 54 72 25 103 47 137 25 160 43" />
        <path
          className="expertise-illustration-track expertise-illustration-path--animated"
          d={networkPath}
          pathLength={1}
        />
        <path
          className="expertise-illustration-signal"
          d={networkPath}
          pathLength={1}
        />
        <path className="expertise-illustration-secondary" d="M52 54 50 58M103 47 108 61M137 25 137 78" />
        {nodes.map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className={index % 3 === 0 ? "expertise-illustration-node expertise-illustration-node--secondary" : "expertise-illustration-node"}
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 4 : 3}
            style={diagramDelay(index, 42)}
          />
        ))}
      </svg>
    );
  }

  if (id === "data-science") {
    const bars = [
      { x: 40, y: 63 },
      { x: 65, y: 46 },
      { x: 90, y: 70 },
      { x: 115, y: 35 },
      { x: 140, y: 54 },
    ];
    const points = [
      { x: 53, y: 61 },
      { x: 78, y: 66 },
      { x: 105, y: 42 },
      { x: 132, y: 51 },
      { x: 160, y: 27 },
    ];

    return (
      <svg viewBox="0 0 180 112" className="expertise-illustration-svg" focusable="false">
        <path className="expertise-illustration-track" d="M18 91H164M24 22V91" />
        {bars.map(({ x, y }, index) => (
          <path
            key={x}
            className="expertise-illustration-bar"
            d={`M${x} 91V${y}`}
            style={diagramDelay(index, 90)}
          />
        ))}
        <path
          className="expertise-illustration-track expertise-illustration-path--animated"
          d="M25 74 53 61 78 66 105 42 132 51 160 27"
          pathLength={1}
        />
        {points.map(({ x, y }, index) => (
          <circle
            key={x}
            className={index % 2 === 0 ? "expertise-illustration-node" : "expertise-illustration-node expertise-illustration-node--secondary"}
            cx={x}
            cy={y}
            r="3"
            style={diagramDelay(index, 42)}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 112" className="expertise-illustration-svg" focusable="false">
      <path className="expertise-illustration-track expertise-architecture-link" d="M23 56H52" pathLength={1} style={diagramDelay(0, 120)} />
      <path className="expertise-illustration-track expertise-architecture-link" d="M128 56H157" pathLength={1} style={diagramDelay(3, 120)} />
      <path className="expertise-illustration-track expertise-architecture-link" d="M90 28V42" pathLength={1} style={diagramDelay(1, 120)} />
      <path className="expertise-illustration-track expertise-architecture-link" d="M90 70V84" pathLength={1} style={diagramDelay(2, 120)} />
      <rect className="expertise-illustration-block expertise-architecture-component expertise-architecture-component--core" x="52" y="40" width="76" height="32" rx="8" style={diagramDelay(0, 160)} />
      <rect className="expertise-illustration-block expertise-illustration-block--secondary expertise-architecture-component" x="70" y="14" width="40" height="24" rx="6" style={diagramDelay(1, 160)} />
      <rect className="expertise-illustration-block expertise-architecture-component" x="70" y="74" width="40" height="24" rx="6" style={diagramDelay(2, 160)} />
      <path className="expertise-illustration-secondary" d="M67 56h10m16 0h10m-13-8v16" />
      <circle className="expertise-illustration-node" cx="23" cy="56" r="4" />
      <circle className="expertise-illustration-node expertise-illustration-node--secondary" cx="157" cy="56" r="4" />
    </svg>
  );
}

export default function ExpertiseCard({
  card,
  revealDelay = 0,
}: {
  card: ExpertiseCardData;
  revealDelay?: number;
}) {
  const Icon = iconById[card.id];
  const cardRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.18 });
  const shouldReduceMotion = useReducedMotion() === true;
  const isVisible = shouldReduceMotion || isInView;

  return (
    <motion.article
      ref={cardRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.48, delay: shouldReduceMotion ? 0 : revealDelay, ease: [0.22, 1, 0.36, 1] }}
      data-visible={isVisible ? "true" : "false"}
      className="expertise-card group relative overflow-hidden rounded-xl border border-outline-default bg-surface-elevated/40 p-5 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 ease-out motion-safe:hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-glow-primary/10 sm:p-6"
    >
      <span aria-hidden="true" className="expertise-card-light" />
      <div className="relative z-[1] grid gap-5 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center">
        <div className="min-w-0">
          <div className="mb-4 flex items-start gap-3">
            <span className="expertise-icon-shell flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-surface text-accent">
              <Icon aria-hidden="true" className="expertise-icon h-5 w-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-accent transition-colors duration-300 group-hover:text-accent-secondary">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-content-secondary">{card.description}</p>
            </div>
          </div>

          <ul className="flex flex-wrap gap-2">
            {card.badges.map((badge) => (
              <li key={badge} className="expertise-badge rounded-full border border-outline-default bg-surface px-2.5 py-1 text-[0.68rem] font-medium tracking-wide text-content-strong transition-colors duration-200 group-hover:border-accent/60 group-hover:text-content-primary">
                {badge}
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden="true" className="expertise-illustration flex min-h-20 items-center justify-center sm:justify-self-end">
          <ExpertiseIllustration id={card.id} />
        </div>
      </div>
    </motion.article>
  );
}
