import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, ORDER, TITLES, groupOf } from "./data";
import ModuleShot from "./ModuleShot";
import { Icon } from "./ui";
import { useCompact } from "../lib/motion";

function Sidebar({ current, open, onGroup, onPick, interactive = true }) {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const reveal = () => {
      const node = list.querySelector(".on");
      if (!node) return;
      const listBox = list.getBoundingClientRect();
      const nodeBox = node.getBoundingClientRect();
      if (nodeBox.top < listBox.top) list.scrollTop -= listBox.top - nodeBox.top + 4;
      else if (nodeBox.bottom > listBox.bottom) list.scrollTop += nodeBox.bottom - listBox.bottom + 4;
    };
    reveal();
    const timer = window.setTimeout(reveal, 320);
    return () => window.clearTimeout(timer);
  }, [current, open]);

  return (
    <nav className="pf-side" aria-label="Landscape modules">
      <div className="pf-logo">
        <img className="pf-logo-img" src="/brand/mark.svg" alt="" width={28} height={28} draggable={false} />
        <b>Landscape</b>
      </div>
      <ul ref={listRef}>
        {NAV.map((item) => {
          if (!item.children) {
            const on = current === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`pf-nav ${on ? "on" : ""}`}
                  onClick={() => interactive && onPick(item.id)}
                  onMouseEnter={() => interactive && onPick(item.id, { soft: true })}
                  aria-current={on ? "page" : undefined}
                  tabIndex={interactive ? 0 : -1}
                >
                  {on && <motion.span className="pf-nav-bg" initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} />}
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          }
          const isOpen = open === item.label;
          const inside = item.children.some(([id]) => id === current);
          return (
            <li key={item.label}>
              <button
                type="button"
                className={`pf-nav ${inside ? "in" : ""}`}
                aria-expanded={isOpen}
                onClick={() => interactive && onGroup(item)}
                onMouseEnter={() => {
                  if (!interactive) return;
                  if (!item.children.some(([id]) => id === current)) onPick(item.children[0][0], { soft: true });
                  onGroup(item, { soft: true });
                }}
                tabIndex={interactive ? 0 : -1}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
                <Icon name="chevron" size={12} className={`pf-caret ${isOpen ? "open" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    className="pf-subnav"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {item.children.map(([id, label]) => {
                      const on = current === id;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            className={`pf-subitem ${on ? "on" : ""}`}
                            onClick={() => interactive && onPick(id)}
                            onMouseEnter={() => interactive && onPick(id, { soft: true })}
                            aria-current={on ? "page" : undefined}
                            tabIndex={interactive ? 0 : -1}
                          >
                            {on && <motion.span className="pf-nav-bg" initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} />}
                            <span>{label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Topbar({ current, compact, onPick, interactive = true }) {
  const group = groupOf(current);
  return (
    <header className="pf-top">
      <Icon name="menu" size={18} />
      <span className="pf-crumb">
        {group && <small>{group} /</small>}
        <b>{TITLES[current] || current}</b>
      </span>
      <span className="pf-grow" />
      {compact ? (
        interactive ? (
          <label className="pf-select">
            <select aria-label="Choose a module" value={current} onChange={(e) => onPick(e.target.value)}>
              {ORDER.map((id) => (
                <option key={id} value={id}>
                  {TITLES[id]}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={12} className="pf-caret open" />
          </label>
        ) : null
      ) : (
        <>
          <span className="pf-qb">
            <i /> QuickBooks connected
          </span>
          <span className="pf-company">Landscape</span>
          <span className="pf-top-search">
            <Icon name="search" size={14} />
          </span>
        </>
      )}
      <span className="pf-bell">
        <Icon name="bell" size={16} />
        <i />
      </span>
      <span className="pf-user">
        <span className="pf-avatar">DA</span>
        {!compact && <b>Admin</b>}
      </span>
    </header>
  );
}

/**
 * Fills the laptop screen edge-to-edge (no scaled letterbox).
 * VIP module shot sits in the content pane with a tight 8px inset.
 */
export default function PlatformApp({ current: controlled, onPick: onPickProp, interactive = true, quick = false }) {
  const compact = useCompact();
  const [inner, setInner] = useState(ORDER[0]);
  const [open, setOpen] = useState(null);
  const current = controlled ?? inner;

  useEffect(() => {
    setOpen(groupOf(current));
  }, [current]);

  function pick(id, opts = {}) {
    if (!interactive && opts.soft) return;
    if (controlled == null) setInner(id);
    onPickProp?.(id, opts);
  }

  function toggleGroup(item, opts = {}) {
    if (!interactive) return;
    if (opts.soft) {
      setOpen(item.label);
      return;
    }
    if (open === item.label) {
      setOpen(null);
      return;
    }
    setOpen(item.label);
    if (!item.children.some(([id]) => id === current)) pick(item.children[0][0]);
  }

  return (
    <div className={`pf-viewport ${compact ? "compact" : ""}`}>
      <div className={`pf-app fill ${compact ? "compact" : ""}`}>
        {!compact && <Sidebar current={current} open={open} onGroup={toggleGroup} onPick={pick} interactive={interactive} />}
        <div className="pf-main">
          <Topbar current={current} compact={compact} onPick={pick} interactive={interactive} />
          <div className="pf-content">
            <AnimatePresence mode="sync" initial={false}>
              <ModuleShot id={current} key={current} quick={quick} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
