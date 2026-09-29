'use client';

import { useRef, useState, type ReactNode } from 'react';

type ResearchGraphItem = { id: string; title: string };
type Point = readonly [number, number];

// A fixed illustrative network, not a chart of research results or affiliations.
const clusters = [
  {
    id: 'artificial-intelligence',
    points: [
      [126, 99],
      [76, 63],
      [67, 146],
      [161, 46],
      [177, 149],
    ],
    label: [122, -12],
  },
  {
    id: 'computational-social-science',
    points: [
      [379, 111],
      [323, 60],
      [445, 67],
      [460, 163],
      [356, 184],
    ],
    label: [390, -12],
  },
  {
    id: 'ai-governance',
    points: [
      [263, 270],
      [191, 227],
      [200, 322],
      [332, 321],
      [327, 228],
    ],
    label: [264, 358],
  },
] as const;

const connections = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 3],
  [2, 4],
] as const;
const center: Point = [259, 157];
const segment = (a: Point, b: Point) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;

function labelLines(title: string) {
  const lines: string[] = [];
  for (const word of title.split(' ')) {
    const previous = lines.at(-1);
    if (previous && previous.length + word.length + 1 <= 15) {
      lines[lines.length - 1] = `${previous} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}

export function ResearchGraph({
  items,
  activeId,
  compact = false,
}: {
  items: ResearchGraphItem[];
  activeId?: string | null;
  compact?: boolean;
}) {
  return (
    <svg
      className={`research-graph${compact ? ' research-graph--compact is-compact' : ''}`}
      viewBox={compact ? '40 35 450 300' : '0 -40 540 425'}
      aria-hidden="true"
      focusable="false"
      data-active-research={activeId || undefined}
      fill="none"
    >
      {clusters.map((cluster) => {
        const item = items.find(({ id }) => id === cluster.id);
        if (!item) return null;
        const hub = cluster.points[0];
        const titleLines = labelLines(item.title);
        return (
          <g
            key={cluster.id}
            className="research-graph-group"
            data-research-group={cluster.id}
          >
            <path className="research-graph-bridge" d={segment(center, hub)} />
            <path
              className="research-graph-secondary"
              d={segment(center, cluster.points[4])}
            />
            {connections.map(([a, b]) => (
              <path
                key={`${a}-${b}`}
                className="research-graph-edge"
                d={segment(cluster.points[a], cluster.points[b])}
              />
            ))}
            <circle
              className="research-graph-ring"
              cx={hub[0]}
              cy={hub[1]}
              r="17"
            />
            {cluster.points.map(([x, y], index) => (
              <circle
                key={`${x}-${y}`}
                className={
                  index === 0
                    ? 'research-graph-node research-graph-hub'
                    : 'research-graph-node'
                }
                cx={x}
                cy={y}
                r={index === 0 ? 7 : index === 4 ? 4.5 : 3.5}
              />
            ))}
            {!compact && (
              <text
                className="research-graph-label"
                x={cluster.label[0]}
                y={cluster.label[1]}
                textAnchor="middle"
              >
                {titleLines.map((line, index) => (
                  <tspan
                    key={index}
                    x={cluster.label[0]}
                    dy={index === 0 ? 0 : 24}
                  >
                    {line}
                    {index < titleLines.length - 1 ? ' ' : null}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );
      })}
      <circle
        className="research-graph-center-ring"
        cx={center[0]}
        cy={center[1]}
        r="20"
      />
      <circle
        className="research-graph-center"
        cx={center[0]}
        cy={center[1]}
        r="7"
      />
    </svg>
  );
}

function linkedResearchId(target: EventTarget | null, root: HTMLElement) {
  if (!(target instanceof Element)) return null;
  const link = target.closest<HTMLAnchorElement>('a[href][data-research-id]');
  if (!link || !root.contains(link)) return null;
  const id = link.dataset.researchId;
  return clusters.some((cluster) => cluster.id === id) ? id! : null;
}

export function ResearchShowcase({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const hoveredId = useRef<string | null>(null);
  const focusedId = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const highlightPointer = (target: EventTarget | null, root: HTMLElement) => {
    hoveredId.current = linkedResearchId(target, root);
    setActiveId(hoveredId.current ?? focusedId.current);
  };
  return (
    <div
      className={`research-showcase ${className}`.trim()}
      data-active-research={activeId ?? undefined}
      onPointerOver={(event) => {
        if (event.pointerType !== 'touch')
          highlightPointer(event.target, event.currentTarget);
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'touch')
          highlightPointer(event.target, event.currentTarget);
      }}
      onPointerOut={(event) => {
        if (event.pointerType !== 'touch')
          highlightPointer(event.relatedTarget, event.currentTarget);
      }}
      onPointerLeave={() => {
        hoveredId.current = null;
        setActiveId(focusedId.current);
      }}
      onFocusCapture={(event) => {
        focusedId.current = linkedResearchId(event.target, event.currentTarget);
        setActiveId(focusedId.current ?? hoveredId.current);
      }}
      onBlurCapture={(event) => {
        focusedId.current = linkedResearchId(
          event.relatedTarget,
          event.currentTarget,
        );
        setActiveId(focusedId.current ?? hoveredId.current);
      }}
    >
      {children}
    </div>
  );
}
