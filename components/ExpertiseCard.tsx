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

function ExpertiseIllustration({ id }: { id: ExpertiseCardId }) {
  if (id === "artificial-intelligence") {
    return (
      <svg viewBox="0 0 180 112" className="expertise-illustration-svg" focusable="false">
        <path className="expertise-illustration-track" d="M20 34 52 54 72 25 103 47 137 25 160 43" />
        <path className="expertise-illustration-track expertise-illustration-path--animated" d="M20 78 50 58 76 84 108 61 137 78 160 58" />
        <path className="expertise-illustration-secondary" d="M52 54 50 58M103 47 108 61M137 25 137 78" />
        {[
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
        ].map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className={index % 3 === 0 ? "expertise-illustration-node expertise-illustration-node--secondary" : "expertise-illustration-node"}
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 4 : 3}
          />
        ))}
      </svg>
    );
  }

  if (id === "data-science") {
    return (
      <svg viewBox="0 0 180 112" className="expertise-illustration-svg" focusable="false">
        <path className="expertise-illustration-track" d="M18 91H164M24 22V91" />
        <path className="expertise-illustration-bar" d="M40 91V63M65 91V46M90 91V70M115 91V35M140 91V54" />
        <path className="expertise-illustration-track expertise-illustration-path--animated" d="M25 74 53 61 78 66 105 42 132 51 160 27" />
        {[53, 78, 105, 132, 160].map((cx, index) => (
          <circle key={cx} className={index % 2 === 0 ? "expertise-illustration-node" : "expertise-illustration-node--secondary"} cx={cx} cy={[61, 66, 42, 51, 27][index]} r="3" />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 112" className="expertise-illustration-svg" focusable="false">
      <path className="expertise-illustration-track" d="M23 56H52M128 56H157M90 28V42M90 70V84" />
      <rect className="expertise-illustration-block" x="52" y="40" width="76" height="32" rx="8" />
      <rect className="expertise-illustration-block expertise-illustration-block--secondary" x="70" y="14" width="40" height="24" rx="6" />
      <rect className="expertise-illustration-block" x="70" y="74" width="40" height="24" rx="6" />
      <path className="expertise-illustration-secondary" d="M67 56h10m16 0h10m-13-8v16" />
      <circle className="expertise-illustration-node" cx="23" cy="56" r="4" />
      <circle className="expertise-illustration-node expertise-illustration-node--secondary" cx="157" cy="56" r="4" />
    </svg>
  );
}

export default function ExpertiseCard({ card }: { card: ExpertiseCardData }) {
  const Icon = iconById[card.id];

  return (
    <article className="expertise-card group relative overflow-hidden rounded-xl border border-outline-default bg-surface-elevated/40 p-5 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-glow-primary/10 sm:p-6">
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
    </article>
  );
}
