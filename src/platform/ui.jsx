import { useId } from "react";
import { motion } from "framer-motion";
import { useCount } from "../lib/motion";

const EASE = [0.22, 1, 0.36, 1];

const PATHS = {
  home: "M3 11 12 4l9 7v9H15v-6H9v6H3z",
  users: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8",
  briefcase: "M3 8h18v12H3zM8 8V5h8v3M3 13h18",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  file: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6",
  checks: "M10 6h10M10 12h10M10 18h10M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17",
  cart: "M3 4h2l2.5 11h11L21 8H6.5M9 20h.01M18 20h.01",
  route: "M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 17V10a4 4 0 0 1 4-4h6M18 7v7a4 4 0 0 1-4 4H8",
  store: "M3 9l2-5h14l2 5M4 9v11h16V9M3 9h18M9 20v-6h6v6",
  receipt: "M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6",
  truck: "M2 6h12v10H2zM14 10h4l3 3v3h-7M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  hardhat: "M3 18h18M5 18v-3a7 7 0 0 1 14 0v3M10 8V5h4v3",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M21 21l-5-5",
  bell: "M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4",
  menu: "M4 7h16M4 12h16M4 17h16",
  chevron: "m9 6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  down: "M12 4v12m0 0-5-5m5 5 5-5M5 20h14",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  print: "M7 9V3h10v6M6 18H4v-7h16v7h-2M7 14h10v7H7z",
  calendar: "M4 5h16v16H4zM4 10h16M9 3v4M15 3v4",
  pin: "M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  refresh: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
  filter: "M4 5h16l-6 8v6l-4-2v-4z",
};

export function Icon({ name, size = 16, className = "" }) {
  return (
    <svg className={`pf-ico ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, staggerChildren: 0.035, delayChildren: 0.05 } },
};

export function Stagger({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.div>
  );
}

export function I({ children, className = "", style }) {
  return (
    <motion.div className={className} variants={item} style={style}>
      {children}
    </motion.div>
  );
}

export function Card({ title, right, children, className = "", style }) {
  return (
    <I className={`pf-card ${className}`} style={style}>
      {(title || right) && (
        <h3>
          <span>{title}</span>
          {right}
        </h3>
      )}
      {children}
    </I>
  );
}

export function Head({ title, sub, children }) {
  return (
    <I className="pf-head">
      <div>
        <h2>{title}</h2>
        {sub && <small>{sub}</small>}
      </div>
      <div className="pf-head-actions">{children}</div>
    </I>
  );
}

export function Btn({ children, ghost, icon }) {
  return (
    <span className={ghost ? "pf-btn ghost" : "pf-btn"}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

export function Pill({ tone = "", children }) {
  return <span className={`pf-pill ${tone}`}>{children}</span>;
}

export function Seg({ items, active }) {
  return (
    <span className="pf-seg">
      {items.map((label) => (
        <i key={label} className={label === active ? "on" : ""}>
          {label}
        </i>
      ))}
    </span>
  );
}

export function Field({ label, value, w }) {
  return (
    <span className="pf-field" style={{ width: w }}>
      {label && <small>{label}</small>}
      <b>{value}</b>
    </span>
  );
}

export function Count({ to, suffix = "" }) {
  const v = useCount(to);
  return (
    <>
      {v.toLocaleString()}
      {suffix}
    </>
  );
}

export function Stat({ label, value, sub, tone = "", icon, progress, count }) {
  return (
    <I className={`pf-stat ${tone}`}>
      {icon && (
        <span className="pf-stat-ico">
          <Icon name={icon} size={18} />
        </span>
      )}
      <span className="pf-stat-body">
        <small>{label}</small>
        <b>{count != null ? <Count to={count} /> : value}</b>
        {sub && <em>{sub}</em>}
        {progress != null && (
          <span className="pf-bar">
            <motion.i initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: EASE, delay: 0.2 }} />
          </span>
        )}
      </span>
    </I>
  );
}

export function Table({ cols, rows, widths }) {
  return (
    <table className="pf-table">
      {widths && (
        <colgroup>
          {widths.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
      )}
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <motion.tr key={r} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}>
            {row.map((cell, c) => (
              <td key={c}>{cell}</td>
            ))}
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}

export function Bars({ data, labels, h = 140, tone = "", max }) {
  const top = max || Math.max(...data, 1);
  return (
    <div className={`pf-bars ${tone}`} style={{ height: h }}>
      {data.map((v, i) => (
        <span key={i} className="pf-bar-col">
          <motion.i
            initial={{ height: 0 }}
            animate={{ height: `${(v / top) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: EASE }}
          />
          {labels && <small>{labels[i]}</small>}
        </span>
      ))}
    </div>
  );
}

export function Line({ points, h = 140, labels, fill = true }) {
  const w = 100;
  const top = Math.max(...points, 1);
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, 92 - (p / top) * 80]);
  const d = xy.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = xy[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`;
  }, "");
  const clip = `pf-clip-${useId().replace(/:/g, "")}`;
  return (
    <div className="pf-line" style={{ height: h }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <clipPath id={clip}>
            <motion.rect x="-2" y="-10" height="120" initial={{ width: 0 }} animate={{ width: 104 }} transition={{ duration: 1.4, ease: EASE }} />
          </clipPath>
        </defs>
        {[20, 45, 70, 92].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} />
        ))}
        <g clipPath={`url(#${clip})`}>
          {fill && <path className="area" d={`${d} L100,100 L0,100Z`} />}
          <path className="stroke" d={d} />
        </g>
      </svg>
      {labels && (
        <div className="pf-line-labels">
          {labels.map((l) => (
            <small key={l}>{l}</small>
          ))}
        </div>
      )}
    </div>
  );
}

export function Donut({ parts, center, sub, size = 120 }) {
  const total = parts.reduce((s, p) => s + p.v, 0) || 1;
  let acc = 0;
  return (
    <div className="pf-donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.9" className="track" />
        {parts.map((p) => {
          const len = (p.v / total) * 100;
          const off = 25 - acc;
          acc += len;
          return (
            <motion.circle
              key={p.label}
              cx="21"
              cy="21"
              r="15.9"
              style={{ stroke: p.color }}
              strokeDashoffset={off}
              initial={{ strokeDasharray: `0 100` }}
              animate={{ strokeDasharray: `${len} ${100 - len}` }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            />
          );
        })}
      </svg>
      <span>
        <b>{center}</b>
        <small>{sub}</small>
      </span>
    </div>
  );
}

export function Gauge({ pct = 0, label, tone = "" }) {
  const r = 40;
  const len = Math.PI * r;
  return (
    <div className={`pf-gauge ${tone}`}>
      <svg viewBox="0 0 100 56">
        <path d="M10 50a40 40 0 0 1 80 0" className="track" />
        <motion.path
          d="M10 50a40 40 0 0 1 80 0"
          className="val"
          strokeDasharray={len}
          initial={{ strokeDashoffset: len }}
          animate={{ strokeDashoffset: len - (len * pct) / 100 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <motion.line
          x1="50"
          y1="50"
          x2="50"
          y2="18"
          className="needle"
          style={{ originX: 0.5, originY: 1 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + (180 * pct) / 100 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <circle cx="50" cy="50" r="3.4" className="hub" />
      </svg>
      {label && <small>{label}</small>}
    </div>
  );
}

const WEEK_MON = ["M", "T", "W", "T", "F", "S", "S"];

/** October 2026 mini calendar (the 1st is a Thursday). */
export function MiniCal({ today = 29, dots = [] }) {
  const cells = [...Array(3).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  return (
    <div className="pf-mini">
      <div className="pf-mini-top">
        <b>October 2026</b>
        <span>
          <Icon name="chevron" size={12} className="flip" />
          <Icon name="chevron" size={12} />
        </span>
      </div>
      <div className="pf-mini-grid">
        {WEEK_MON.map((d, i) => (
          <small key={i}>{d}</small>
        ))}
        {cells.map((d, i) => (
          <span key={i} className={d === today ? "today" : ""}>
            {d}
            {d && dots.includes(d) && <i />}
          </span>
        ))}
      </div>
    </div>
  );
}
