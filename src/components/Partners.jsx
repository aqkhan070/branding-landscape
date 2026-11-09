import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { partners } from "../data";
import { FadeUp, Reveal } from "./Bits";
import { useReducedMotion } from "../lib/motion";

export default function Partners() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const partner = partners[index];

  return (
    <section className="section partners" id="partners">
      <header className="sec-head">
        <FadeUp className="sec-index">
          <span className="sec-dot" aria-hidden="true" />
          04 — Partners
        </FadeUp>
        <Reveal text="What talks to Landscape, and the two systems that sit on top." italic={[7, 8, 9, 10, 11]} className="sec-title" />
        <FadeUp className="sec-lede" delay={0.12}>
          Click a partner. The page stays where it is.
        </FadeUp>
      </header>

      <div className="partner-layout">
        <div className="partner-list" role="tablist" aria-label="Partners">
          {partners.map((item, i) => {
            const on = i === index;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={on}
                className={on ? "on" : ""}
                onClick={() => setIndex(i)}
              >
                {on && <motion.span layoutId="partnerpill" className="partner-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className="pl-text">
                  {item.name}
                  <small>{item.kind}</small>
                </span>
              </button>
            );
          })}
        </div>

        <div className="partner-stage">
          <article className="partner-detail" role="tabpanel">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                className="partner-copy"
                key={partner.id}
                initial={reduced ? false : { opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: reduced ? 0 : 0.7, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flow">
                  <div className="flow-node">
                    <small>{partner.kind}</small>
                    <strong>{partner.name}</strong>
                  </div>
                  <div className={partner.twoWay ? "flow-track both" : "flow-track"} aria-hidden="true">
                    <i />
                    {partner.twoWay && <i className="rev" />}
                  </div>
                  <div className="flow-node earth">
                    <small>Inside</small>
                    <strong>Landscape</strong>
                  </div>
                  <div className="flow-track back" aria-hidden="true">
                    <i />
                  </div>
                  <div className="flow-node">
                    <small>Seen by</small>
                    <strong>{partner.seen}</strong>
                  </div>
                </div>
                <span className="kicker">{partner.kind}</span>
                <h3>{partner.name}</h3>
                <p>{partner.summary}</p>
                <ul className="moves">
                  {partner.moves.map((move) => (
                    <li key={move}>{move}</li>
                  ))}
                </ul>
                <div className="pair">
                  <div>
                    <h4>Where it shows</h4>
                    <p>{partner.where}</p>
                  </div>
                  <div>
                    <h4>Who sees it</h4>
                    <p>{partner.seen}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </article>
        </div>
      </div>
    </section>
  );
}
