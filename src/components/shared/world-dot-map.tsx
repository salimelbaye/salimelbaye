import { LAND, COVERAGE_PINS, pointInPolygon } from '@/lib/geo';

type Props = {
  /** Grid resolution in degrees. Lower = denser dots. */
  step?: number;
  className?: string;
};

/**
 * The site's signature visual: an equirectangular lattice of dots, lit only where
 * land falls, with pulsing pins on live coverage regions.
 *
 * Rendered on the server — the dot grid is deterministic, so there is no layout
 * shift, no client JS, and the whole thing ships as static SVG markup.
 */
export function WorldDotMap({ step = 4.4, className }: Props) {
  const W = 760;
  const H = 380;
  const TOP = 79;
  const BOT = -57;

  const dots: { x: number; y: number; lit: boolean }[] = [];

  for (let lat = TOP, row = 0; lat >= BOT; lat -= step, row++) {
    for (let lon = -180, col = 0; lon <= 180; lon += step, col++) {
      if (!LAND.some((poly) => pointInPolygon(lon, lat, poly))) continue;
      dots.push({
        x: ((lon + 180) / 360) * W,
        y: ((TOP - lat) / (TOP - BOT)) * H,
        // Deterministic scatter so server and client markup always match.
        lit: (row * 31 + col * 17) % 7 === 0,
      });
    }
  }

  const project = (lon: number, lat: number) => ({
    x: ((lon + 180) / 360) * W,
    y: ((TOP - lat) / (TOP - BOT)) * H,
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="World map showing the regions covered by the data platform"
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x.toFixed(1)}
            cy={d.y.toFixed(1)}
            r={1.55}
            fill={d.lit ? 'rgba(120,150,220,0.42)' : 'rgba(148,163,184,0.30)'}
          />
        ))}
      </g>
      <g>
        {COVERAGE_PINS.map((p, i) => {
          const { x, y } = project(p.lon, p.lat);
          return (
            <g key={p.city}>
              <circle
                cx={x.toFixed(1)}
                cy={y.toFixed(1)}
                r={3}
                fill="none"
                stroke="#4F7DF9"
                strokeWidth={1.2}
                className="animate-ripple"
                style={{ animationDelay: `${i * 0.55}s` }}
              />
              <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={2.6} fill="#4F7DF9" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
