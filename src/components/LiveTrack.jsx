import { SectionHead } from "./Bits";

const ROUTE = "48,548 175,492 310,432 430,378 500,348 552,318 598,352 528,388 640,318 810,188 948,112";

const STEPS = [
  {
    n: "01",
    title: "Shift on",
    text: "Tracking runs after the foreman starts the shift. It does not watch the crew all day on its own.",
    phase: "s1",
  },
  {
    n: "02",
    title: "Inside the radius",
    text: "Arrival at the property writes a check-in for the foreman and the crew on that job.",
    phase: "s2",
  },
  {
    n: "03",
    title: "Outside the radius",
    text: "Leaving the circle writes the check-out. The loop keeps going until the shift ends.",
    phase: "s3",
  },
];

export default function LiveTrack() {
  return (
    <section className="section live-track" id="tracking">
      <SectionHead index="On the shift" title="The radius writes the time." italic={[1]}>
        A shift has to be on. Then the phone reads the job site. Inside the radius, the crew is checked in. Outside it, they are checked out.
      </SectionHead>

      <div className="lt-layout">
        <ol className="lt-steps">
          {STEPS.map((step) => (
            <li className={`lt-step ${step.phase}`} key={step.n}>
              <span>{step.n}</span>
              <div>
                <b>{step.title}</b>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
          
        </ol>

        <div className="lt-board">
          <svg className="lt-svg" viewBox="0 0 1000 640" role="img" aria-label="A crew marker driving into a job-site radius, then leaving it.">
            <rect width="1000" height="640" fill="#d5e3c4" />
            <path fill="#b7d098" d="M0 0h1000v78C720 128 380 36 0 96Z" />
            <path fill="#a9c888" d="M0 640V548c280 48 640-20 1000 36V640Z" />
            <ellipse cx="150" cy="168" rx="108" ry="62" fill="#9ebe78" />
            <ellipse cx="880" cy="500" rx="130" ry="72" fill="#a3c482" />
            <ellipse cx="118" cy="575" rx="78" ry="34" fill="#c9d8c0" />

            {BLOCKS.map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="3" fill="#e7efe0" stroke="#c5d4b4" strokeWidth="1" />
            ))}

            <g fill="none" stroke="#efe8d4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-10 210C180 190 260 250 420 220S700 160 1010 200" strokeWidth="14" />
              <path d="M-10 470C200 440 340 510 560 470S820 430 1010 460" strokeWidth="12" />
              <path d="M250 40c18 140 8 250-6 420" strokeWidth="10" />
              <path d="M760 70c-16 150 10 280-8 460" strokeWidth="10" />
            </g>

            <polyline points={ROUTE} fill="none" stroke="#c9bfa6" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={ROUTE} fill="none" stroke="#f7f3e6" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <polyline className="lt-dashes" points={ROUTE} fill="none" stroke="#d7c56a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 14" />

            <circle className="lt-zone" cx="552" cy="332" r="112" />

            <g className="lt-pin" transform="translate(552 318)">
              <path d="M0 18c-12-12-22-22-22-34a22 22 0 1 1 44 0c0 12-10 22-22 34Z" fill="#0f3320" />
              <circle cy="-16" r="7" fill="#1f6b3f" />
            </g>
            <text className="lt-label" x="678" y="300">
              Job site
            </text>
          </svg>

          <div className="lt-crew" aria-hidden="true">
            <b>Crew</b>
            <i />
          </div>

          <div className="lt-status" aria-hidden="true">
            <span className="route">En route</span>
            <span className="in">Checked in</span>
            <span className="out">Checked out</span>
          </div>

          <span className="lt-live">
            <i /> Live shift
          </span>

          <aside className="lt-slip" aria-hidden="true">
            <small>Checked out</small>
            <strong>1h 24m</strong>
            <p>9:14 in · 10:38 out</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

const BLOCKS = [
  [70, 230, 46, 32],
  [130, 228, 38, 28],
  [188, 236, 42, 30],
  [70, 280, 52, 34],
  [140, 286, 40, 26],
  [300, 250, 48, 30],
  [360, 246, 36, 34],
  [640, 200, 44, 28],
  [700, 206, 50, 32],
  [820, 230, 42, 30],
  [880, 236, 48, 26],
  [80, 390, 50, 30],
  [150, 400, 40, 28],
  [700, 400, 46, 32],
  [760, 408, 38, 26],
  [860, 360, 44, 30],
  [470, 430, 40, 28],
  [530, 448, 48, 26],
  [300, 500, 46, 24],
  [820, 120, 40, 26],
];
