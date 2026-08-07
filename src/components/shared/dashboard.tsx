import { BarChart3, Check, Download, LayoutGrid, MapPin, Search, Settings } from 'lucide-react';

const ROWS = [
  ['Zahnarztpraxis Mitte', '+49 30 285…', '4.8'],
  ['Dental Clinic Prenzlauer', '+49 30 440…', '4.6'],
  ['Praxis Dr. Neumann', '+49 30 617…', '4.9'],
  ['Kreuzberg Zahnmedizin', '+49 30 693…', '4.4'],
  ['Smile Studio Charlottenburg', '+49 30 318…', '4.7'],
] as const;

const Verified = () => (
  <span className="vbadge">
    <Check strokeWidth={3.4} /> Verified
  </span>
);

/**
 * The flagship product as live DOM rather than a screenshot: sharp at any density,
 * weighs nothing, and never goes stale when the real UI changes. Sizing comes from
 * the `--u` container unit in globals.css, so it scales with the laptop.
 */
export function Dashboard() {
  return (
    <div
      className="dash"
      role="img"
      aria-label="Google Maps Data Platform dashboard: 2,481 verified business records collected for dentists in Berlin, ready to export"
    >
      <nav className="drail" aria-hidden>
        <span className="logo">SE</span>
        {[LayoutGrid, MapPin, BarChart3, Settings].map((Icon, i) => (
          <i key={i} className={i === 0 ? 'on' : undefined}>
            <Icon />
          </i>
        ))}
      </nav>

      <div className="dmain">
        <div className="dtop">
          <span className="dsearch">
            <Search />
            Dentists · Berlin, DE
            <em>⌘K</em>
          </span>
          <span className="dexport">
            <Download /> Export
          </span>
          <span className="davatar">SE</span>
        </div>

        <div className="dbody">
          <div className="dkpis">
            <div className="dkpi">
              <div className="kt">Records</div>
              <div className="kv">2,481</div>
              <svg className="spark" viewBox="0 0 60 14" preserveAspectRatio="none" aria-hidden>
                <path d="M0 12 L10 10 L20 11 L30 7 L40 8 L50 4 L60 2 L60 14 L0 14 Z" fill="rgba(79,125,249,.16)" />
                <path d="M0 12 L10 10 L20 11 L30 7 L40 8 L50 4 L60 2" fill="none" stroke="#4F7DF9" strokeWidth={1.4} strokeLinecap="round" />
              </svg>
            </div>
            <div className="dkpi">
              <div className="kt">Verified</div>
              <div className="kv">98%</div>
              <div className="kd">▲ 4.2% this run</div>
            </div>
            <div className="dkpi">
              <div className="kt">Runtime</div>
              <div className="kv">4m 12s</div>
              <div className="kd">▲ 12× faster</div>
            </div>
          </div>

          <div className="dprog">
            <span className="pl">
              <span>Collecting listings</span>
              <span>2,481 / 3,000</span>
            </span>
            <span className="dtrack">
              <i />
            </span>
          </div>

          <div className="dtable">
            <div className="dhead">
              <span>Business</span>
              <span>Phone</span>
              <span>Rating</span>
              <span>Status</span>
            </div>
            {ROWS.map(([name, phone, rating]) => (
              <div key={name} className="drow">
                <b>{name}</b>
                <span>{phone}</span>
                <span className="stars">{rating}</span>
                <Verified />
              </div>
            ))}
          </div>

          <div className="dfoot">
            <span>12 fields per record · deduped</span>
            <span className="dsync">
              <i /> Synced 2 min ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
