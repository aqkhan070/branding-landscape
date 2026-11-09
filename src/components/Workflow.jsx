import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { steps } from "../data";
import ModuleShot from "../platform/ModuleShot";
import { Reveal, FadeUp, SectionHead } from "./Bits";
import { useCompact, useReducedMotion } from "../lib/motion";

/** How long each step stays before the list advances on its own. */
const DWELL = 12000;

const SHOTS = {
  lead: "pipelines",
  price: "estimator",
  send: "estimates",
  win: "crm",
  place: "jobcal",
  field: "punchlist",
  yard: "fleet",
  paid: "invoices",
};

export default function Workflow() {
  const [step, setStep] = useState(0);
  const rootRef = useRef(null);
  const compact = useCompact();
  const reduced = useReducedMotion();
  const current = steps[step];
  const shot = SHOTS[current.id] || "dashboard";

  useEffect(() => {
    const node = rootRef.current;
    if (!node || compact) return undefined;
    const from = step / steps.length;
    const to = (step + 1) / steps.length;
    if (reduced) {
      node.style.setProperty("--p", to.toFixed(4));
      node.style.setProperty("--t", "1");
      return undefined;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DWELL);
      node.style.setProperty("--p", (from + (to - from) * t).toFixed(4));
      node.style.setProperty("--t", t.toFixed(4));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const id = window.setTimeout(() => {
      setStep((index) => (index + 1) % steps.length);
    }, DWELL);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(id);
    };
  }, [compact, reduced, step]);

  if (compact) {
    return (
      <section className="section walk stacked" id="walk">
        <SectionHead index="05 — How it works" title="Scroll. The job moves with you." italic={[2, 3, 4, 5]} tone="light" />
        <ol className="walk-stack">
          {steps.map((item) => (
            <FadeUp as="li" key={item.id} className="walk-card">
              <header>
                <b className="ghost-n" aria-hidden="true">
                  {item.n}
                </b>
                <span>
                  <small>{item.kicker}</small>
                  <h3>{item.title}</h3>
                </span>
              </header>
              <div className="walk-window">
                <ModuleShot id={SHOTS[item.id] || "dashboard"} />
              </div>
              <p>{item.note}</p>
            </FadeUp>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="walk" id="walk" ref={rootRef}>
      <div className="walk-sticky">
        <div className="walk-top">
          <div>
            <div className="sec-index">
              <span className="sec-dot" aria-hidden="true" />
              05 — How it works
            </div>
            <Reveal text="Scroll. The job moves with you." italic={[2, 3, 4, 5]} className="sec-title sm" />
          </div>
          <div className="scrub-wrap">
            <span>
              {current.n} <i>/ 0{steps.length}</i>
            </span>
            <div className="scrub" aria-hidden="true">
              <i />
            </div>
          </div>
        </div>

        <div className="walk-layout">
          <div className="step-list" role="tablist" aria-label="Job walkthrough">
            <span className="step-rail" aria-hidden="true">
              <i />
            </span>
            {steps.map((item, index) => (
              <button
                key={item.id}
                className={index === step ? "step-btn on" : index < step ? "step-btn done" : "step-btn"}
                type="button"
                role="tab"
                aria-selected={index === step}
                onClick={() => setStep(index)}
              >
                <span className="n">{item.n}</span>
                <span className="step-copy">
                  <b>{item.title}</b>
                  <small>{item.screen}</small>
                </span>
                {index === step && <i className="step-timer" aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className="walk-right">
            <div className="walk-frame" aria-live="polite">
              <AnimatePresence initial={false}>
                <motion.div
                  key={shot}
                  className="walk-iris"
                  initial={reduced ? false : { clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(78% at 50% 50%)" }}
                  exit={{ opacity: 0 }}
                  transition={{
                    clipPath: { duration: reduced ? 0 : 0.72, ease: [0.45, 0.05, 0.2, 1] },
                    opacity: { duration: 0.01, delay: reduced ? 0 : 0.72 },
                  }}
                >
                  <ModuleShot id={shot} still />
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                className="walk-note"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <b>{current.kicker}.</b> {current.note}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
