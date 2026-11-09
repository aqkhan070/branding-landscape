import { motion } from "framer-motion";
import { Leaf } from "./Bits";
import { modules } from "../data";

const SIDE = [
  ["Win the work", ["CRM Dashboard", "Pipelines", "Estimates"]],
  ["Run the field", ["Customers", "Job calendar", "Punch list"]],
  ["Get paid", ["Invoices", "Bills", "Aging report"]],
  ["Fleet and people", ["Fleet dashboard", "Work orders", "PM scheduler"]],
];

const known = new Set(modules.map((m) => m.name));

function Skel({ w = "100%", h = 8, tone = "" }) {
  return <i className={`skel ${tone}`} style={{ width: w, height: h }} />;
}

function Tag({ children, tone }) {
  return <em className={`tag ${tone || ""}`}>{children}</em>;
}

const tagTone = (tag) =>
  ({ Alert: "warn", Open: "info", Live: "live", Due: "warn", Field: "info", Ready: "live", Sent: "info" })[tag] || "";

/* ---------- per-step bodies, built only from the exhibit's own rows ---------- */

function Kanban({ rows }) {
  return (
    <div className="sv-kanban">
      {[
        ["Qualify", [rows[0]]],
        ["Propose", []],
        ["Won", []],
      ].map(([name, cards], col) => (
        <div className="sv-col" key={name}>
          <header>
            <b>{name}</b>
            <span>{cards.length || ""}</span>
          </header>
          {cards.map((card) => (
            <motion.div
              className="sv-card lift"
              key={card.label}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + col * 0.1 }}
            >
              <b>{card.label}</b>
              <small>{card.meta}</small>
              <div className="sv-foot">
                <span className="avatar">{rows[2].tag.slice(0, 1)}</span>
                <Tag tone="info">{card.tag}</Tag>
              </div>
            </motion.div>
          ))}
          {col > 0 && (
            <div className="sv-card ghost">
              <Skel w="70%" />
              <Skel w="45%" h={6} />
            </div>
          )}
        </div>
      ))}
      <div className="sv-strip">
        <span className="dot" />
        <b>{rows[1].label}</b>
        <small>{rows[1].meta}</small>
        <Tag tone="live">{rows[1].tag}</Tag>
      </div>
    </div>
  );
}

function Lines({ rows }) {
  return (
    <div className="sv-lines">
      <div className="sv-head">
        <span>Line item</span>
        <span>Status</span>
      </div>
      {rows.map((row, i) => (
        <motion.div
          className="sv-line"
          key={row.label}
          initial={{ x: -14, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.09 }}
        >
          <span>
            <b>{row.label}</b>
            <small>{row.meta}</small>
          </span>
          <Tag tone={tagTone(row.tag)}>{row.tag}</Tag>
        </motion.div>
      ))}
      <div className="sv-line ghost">
        <Skel w="38%" />
        <Skel w="14%" />
      </div>
    </div>
  );
}

function Doc({ rows }) {
  return (
    <div className="sv-doc">
      <div className="sv-page">
        <div className="sv-page-top">
          <Leaf size={16} />
          <Skel w="30%" h={6} />
        </div>
        <Skel w="62%" h={12} />
        <Skel w="90%" />
        <Skel w="84%" />
        <Skel w="72%" />
        <div className="sv-page-map" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="sv-doc-side">
        {rows.map((row, i) => (
          <motion.div
            className="sv-chip"
            key={row.label}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <b>{row.label}</b>
            <small>{row.meta}</small>
            <Tag tone={tagTone(row.tag)}>{row.tag}</Tag>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Handoff({ rows }) {
  return (
    <div className="sv-flow">
      {rows.map((row, i) => (
        <motion.div
          className="sv-flow-node"
          key={row.label}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12 + i * 0.16, type: "spring", stiffness: 260, damping: 22 }}
        >
          <span className="num">{i + 1}</span>
          <span>
            <b>{row.label}</b>
            <small>{row.meta}</small>
          </span>
          <Tag tone={tagTone(row.tag)}>{row.tag}</Tag>
        </motion.div>
      ))}
    </div>
  );
}

function Week({ rows }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const placed = [
    [0, 1, 2],
    [2, 3, 1],
    [3, 4, 2],
  ];
  return (
    <div className="sv-week">
      <div className="sv-days">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="sv-grid">
        {days.map((d) => (
          <i key={d} />
        ))}
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className={`sv-event e${i}`}
            style={{ gridColumn: `${placed[i][0] + 1} / span ${placed[i][2]}`, gridRow: placed[i][1] }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.14, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <b>{row.label}</b>
            <small>{row.meta}</small>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Checks({ rows }) {
  return (
    <div className="sv-checks">
      {rows.map((row, i) => (
        <motion.div
          className="sv-check"
          key={row.label}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.12 }}
        >
          <span className={i === 0 ? "box on" : "box"}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3 8.5 3.2 3L13 4.5" />
            </svg>
          </span>
          <span>
            <b>{row.label}</b>
            <small>{row.meta}</small>
          </span>
          <Tag tone={tagTone(row.tag)}>{row.tag}</Tag>
        </motion.div>
      ))}
    </div>
  );
}

function Fleet({ rows }) {
  return (
    <div className="sv-fleet">
      {rows.map((row, i) => (
        <motion.div
          className={`sv-unit ${row.tag === "Alert" ? "alert" : ""}`}
          key={row.label}
          initial={{ x: 18, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.1 }}
        >
          <span className="pulse" aria-hidden="true" />
          <span>
            <b>{row.label}</b>
            <small>{row.meta}</small>
          </span>
          <Tag tone={tagTone(row.tag)}>{row.tag}</Tag>
        </motion.div>
      ))}
      <div className="sv-road" aria-hidden="true">
        <i />
      </div>
    </div>
  );
}

function Ledger({ rows }) {
  return (
    <div className="sv-ledger">
      <div className="sv-bars" aria-hidden="true">
        {[34, 58, 44, 72, 52, 86, 64].map((h, i) => (
          <motion.i
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <div className="sv-ledger-rows">
        {rows.map((row) => (
          <div className="sv-line" key={row.label}>
            <span>
              <b>{row.label}</b>
              <small>{row.meta}</small>
            </span>
            <Tag tone={tagTone(row.tag)}>{row.tag}</Tag>
          </div>
        ))}
      </div>
    </div>
  );
}

const BODIES = {
  lead: Kanban,
  price: Lines,
  send: Doc,
  win: Handoff,
  place: Week,
  field: Checks,
  yard: Fleet,
  paid: Ledger,
};

export function ScreenBody({ step }) {
  const Body = BODIES[step.id] || Lines;
  return <Body rows={step.rows} />;
}

const ACTIVE = {
  lead: "Pipelines",
  price: "Estimates",
  send: "Estimates",
  win: "Pipelines",
  place: "Job calendar",
  field: "Punch list",
  yard: "Fleet dashboard",
  paid: "Invoices",
};

/** App chrome: sidebar from the real module names, top bar, and a screen body. */
export function AppShell({ step, compact = false }) {
  const active = ACTIVE[step.id];
  return (
    <div className={compact ? "app compact" : "app"}>
      {!compact && (
        <aside className="app-side" aria-hidden="true">
          <div className="app-logo">
            <Leaf size={18} /> EarthCo
          </div>
          {SIDE.map(([group, names]) => (
            <div className="app-group" key={group}>
              <small>{group}</small>
              {names
                .filter((n) => known.has(n))
                .map((name) => (
                  <span key={name} className={name === active ? "on" : ""}>
                    {name}
                  </span>
                ))}
            </div>
          ))}
        </aside>
      )}
      <div className="app-main">
        <div className="app-top">
          <span className="crumb">
            {step.kicker} <i>/</i> <b>{step.screen}</b>
          </span>
          <span className="app-search" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13.5 13.5 3.5 3.5" />
            </svg>
            Search records
          </span>
          <Tag tone="info">Sample</Tag>
        </div>
        <div className="app-body">
          <h4>{step.title}</h4>
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ScreenBody step={step} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
