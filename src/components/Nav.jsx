import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf } from "./Bits";
import { scrollToId } from "../lib/motion";

export const NAV = [
  ["platform", "Platform"],
  ["phone", "Phone"],
  ["flow", "Flow"],
  ["partners", "Partners"],
  ["walk", "The walk"],
];

export default function Nav({ active, light }) {
  const [open, setOpen] = useState(false);

  function go(event, id) {
    event.preventDefault();
    setOpen(false);
    scrollToId(id);
  }

  return (
    <header className={light ? "nav is-light" : "nav"}>
      <div className="nav-bar">
        <a className="brand" href="#top" onClick={(e) => go(e, "top")} aria-label="Landscape, back to top">
          <span className="brand-mark">
            <Leaf size={20} />
          </span>
          <span className="brand-text">
            <b>Landscape</b>
            <small>Services</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Sections">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "on" : ""} onClick={(e) => go(e, id)}>
              {active === id && <motion.span layoutId="navpill" className="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <a className="nav-cta" href="#booth" onClick={(e) => go(e, "booth")}>
          Booth card
        </a>

        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? "bars x" : "bars"} aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="sr">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Sections"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            {[...NAV, ["booth", "Booth card"]].map(([id, label], i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={(e) => go(e, id)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                {label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
