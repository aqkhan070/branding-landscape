import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { features } from "../features";
import ModuleShot from "../platform/ModuleShot";
import { SectionHead } from "./Bits";
import { useReducedMotion, useSectionProgress, progressIndex, jumpToStep, useCompact } from "../lib/motion";

export default function Features() {
  const [active, setActive] = useState(0);
  const jumping = useRef(false);
  const scrolling = useRef(false);
  const scrollIdle = useRef(0);
  const root = useRef(null);
  const listRef = useRef(null);
  const compact = useCompact();
  const reduced = useReducedMotion();
  const feature = features[active];

  useEffect(() => {
    features.forEach((item) => {
      const img = new Image();
      img.src = `/modules/${item.shot}.webp`;
    });
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const onWheel = (event) => {
      const max = list.scrollHeight - list.clientHeight;
      if (max <= 1) return;
      const atTop = list.scrollTop <= 0 && event.deltaY < 0;
      const atBottom = list.scrollTop >= max - 1 && event.deltaY > 0;
      if (atTop || atBottom) return;
      event.preventDefault();
      list.scrollTop += event.deltaY;
    };
    list.addEventListener("wheel", onWheel, { passive: false });
    return () => list.removeEventListener("wheel", onWheel);
  }, [compact]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const reveal = () => {
      const row = list.querySelector(".feat.on");
      if (!row) return;
      const listBox = list.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      if (rowBox.top < listBox.top) list.scrollTop -= listBox.top - rowBox.top;
      else if (rowBox.bottom > listBox.bottom) list.scrollTop += rowBox.bottom - listBox.bottom;
    };
    reveal();
    const timer = window.setTimeout(reveal, 220);
    return () => window.clearTimeout(timer);
  }, [active]);

  useSectionProgress(root, (p) => {
    if (compact || reduced || jumping.current) return;
    scrolling.current = true;
    window.clearTimeout(scrollIdle.current);
    scrollIdle.current = window.setTimeout(() => {
      scrolling.current = false;
    }, 140);
    setActive(progressIndex(p, features.length));
  });

  function select(i, soft = false) {
    if (soft && scrolling.current) return;
    setActive(i);
    if (soft || compact) return;
    jumping.current = true;
    jumpToStep(root.current, features.length, i, 0.42);
    window.setTimeout(() => {
      jumping.current = false;
    }, 460);
  }

  const inner = (
    <>
      <SectionHead index="02 — Features" title="Everything a landscape company runs, in one place." italic={[5, 6, 7, 8]}>
        Hover a row or scroll the section. Each preview is the same module screen from the platform.
      </SectionHead>

      <div className="feat-layout">
        <div className="feat-list" role="tablist" aria-label="Features" ref={listRef}>
          {features.map((item, i) => {
            const on = i === active;
            return (
              <div className={on ? "feat on" : "feat"} key={item.id}>
                <button
                  type="button"
                  role="tab"
                  id={`feat-tab-${item.id}`}
                  aria-selected={on}
                  aria-controls={`feat-panel-${item.id}`}
                  onClick={() => select(i)}
                  onMouseEnter={() => select(i, true)}
                >
                  <span className="feat-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="feat-label">{item.label}</span>
                  <span className="feat-bar" aria-hidden="true">
                    {on && <i className="still" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      className="feat-more"
                      id={`feat-panel-${item.id}`}
                      role="tabpanel"
                      aria-labelledby={`feat-tab-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                      <ul>
                        {item.modules.map((name) => (
                          <li key={name}>{name}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="feat-stage">
          <div className="feat-frame" aria-live="polite">
            <AnimatePresence mode="sync" initial={false}>
              <ModuleShot id={feature.shot} key={feature.shot} quick />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );

  if (compact) {
    return (
      <section className="section features" id="features" ref={root}>
        {inner}
      </section>
    );
  }

  return (
    <section className="features pin" id="features" ref={root} style={{ "--feats": features.length }}>
      <div className="feat-sticky">{inner}</div>
    </section>
  );
}
