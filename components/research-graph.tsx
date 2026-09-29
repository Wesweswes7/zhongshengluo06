'use client';

import { useRef, useState, type ReactNode } from 'react';

type ResearchGraphItem = { id: string; title: string; href?: string };
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
const navigationCenter: Point = [
  (clusters[0].points[0][0] + clusters[1].points[0][0]) / 2,
  center[1],
];
const segment = (a: Point, b: Point) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
const navigationPosition = (point: Point) => {
  const [x, y] = point;
  const cluster = clusters.find((group) =>
    group.points.some((candidate) => candidate === point),
  );
  // Keep lower satellites clear of fixed-size HTML labels. The same projection
  // is used for each circle and line endpoint; illustrative SVGs stay unchanged.
  const projectedY =
    cluster && point !== cluster.points[0] && y > cluster.points[0][1]
      ? 32 + cluster.points[0][1] * 0.72 + 74
      : 32 + y * 0.72;
  return {
    x: `${(x / 540) * 100}%`,
    y: `${(projectedY / 320) * 100}%`,
  };
};

function GraphConnection({
  from,
  to,
  className,
  navigation,
  supplemental = false,
}: {
  from: Point;
  to: Point;
  className: string;
  navigation: boolean;
  supplemental?: boolean;
}) {
  // Percentage coordinates keep navigation targets aligned at every aspect
  // ratio, while circles and strokes retain their natural CSS pixel size.
  if (navigation) {
    const a = navigationPosition(from);
    const b = navigationPosition(to);
    return (
      <line
        className={className}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        data-graph-supplemental={supplemental || undefined}
      />
    );
  }
  return <path className={className} d={segment(from, to)} />;
}

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
  navigation = false,
  label,
}: {
  items: ResearchGraphItem[];
  activeId?: string | null;
  compact?: boolean;
  navigation?: boolean;
  label?: string;
}) {
  const position = (point: Point) =>
    navigation ? navigationPosition(point) : { x: point[0], y: point[1] };
  const graphCenter = navigation ? navigationCenter : center;
  const centerPosition = position(graphCenter);
  const graph = (
    <svg
      className={`research-graph${compact ? ' research-graph--compact is-compact' : ''}`}
      viewBox={
        navigation ? undefined : compact ? '40 35 450 300' : '0 -40 540 425'
      }
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
            <GraphConnection
              className="research-graph-bridge"
              from={graphCenter}
              to={hub}
              navigation={navigation}
            />
            <GraphConnection
              className="research-graph-secondary"
              from={graphCenter}
              to={cluster.points[4]}
              navigation={navigation}
              supplemental
            />
            {connections.map(([a, b], index) => (
              <GraphConnection
                key={`${a}-${b}`}
                className="research-graph-edge"
                from={cluster.points[a]}
                to={cluster.points[b]}
                navigation={navigation}
                supplemental={index > 1}
              />
            ))}
            {!navigation && (
              <circle
                className="research-graph-ring"
                cx={hub[0]}
                cy={hub[1]}
                r="17"
              />
            )}
            {cluster.points.map((point, index) => {
              if (navigation && index === 0) return null;
              const location = position(point);
              return (
                <circle
                  key={`${point[0]}-${point[1]}`}
                  className={
                    index === 0
                      ? 'research-graph-node research-graph-hub'
                      : 'research-graph-node'
                  }
                  cx={location.x}
                  cy={location.y}
                  r={index === 0 ? 7 : index === 4 ? 4.5 : 3.5}
                  data-graph-supplemental={
                    navigation && index > 2 ? true : undefined
                  }
                />
              );
            })}
            {!compact && !navigation && (
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
        cx={centerPosition.x}
        cy={centerPosition.y}
        r="20"
      />
      <circle
        className="research-graph-center"
        cx={centerPosition.x}
        cy={centerPosition.y}
        r="7"
      />
    </svg>
  );

  if (!navigation) return graph;

  return (
    <nav className="research-graph-navigation" aria-label={label}>
      {graph}
      {clusters.map((cluster) => {
        const item = items.find(({ id }) => id === cluster.id);
        if (!item?.href) return null;
        const hub = navigationPosition(cluster.points[0]);
        return (
          <a
            className="research-node-link"
            key={item.id}
            href={item.href}
            data-research-id={item.id}
            style={{ left: hub.x, top: hub.y }}
          >
            <span className="research-node-marker" aria-hidden="true" />
            <span className="research-node-label">
              {item.title}
              <svg
                className="research-node-arrow"
                aria-hidden="true"
                focusable="false"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </a>
        );
      })}
    </nav>
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
