import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { phoneScreens } from "../data";
import { Phone } from "./Phone";
import { gsap, jumpToStep, prefersReduced, useCompact, useSectionProgress, progressIndex } from "../lib/motion";

const n = phoneScreens.length;

function Copy({ phone }) {
  return (
    <motion.div
      className="phone-copy"
      key={phone.id}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="kicker">
        {phone.n} · {phone.who}
      </p>
      <h3>{phone.title}</h3>
      <p>{phone.detail}</p>
      <ul>
        {phone.points.map((point, i) => (
          <motion.li key={point} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
            {point}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Mobile() {
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const compact = useCompact();
  const phone = phoneScreens[index];

  useSectionProgress(root, (p) => {
    if (compact) return;
    setIndex(progressIndex(p, n));
  });

  useEffect(() => {
    if (compact || prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: 0.6 },
      });
      tl.fromTo(".ph-main", { yPercent: 40, rotate: 8, opacity: 0.2 }, { yPercent: 0, rotate: 0, opacity: 1 }, 0)
        .fromTo(".ph-side.l", { xPercent: 60, yPercent: 30, opacity: 0 }, { xPercent: 0, yPercent: 0, opacity: 1 }, 0.2)
        .fromTo(".ph-side.r", { xPercent: -60, yPercent: 30, opacity: 0 }, { xPercent: 0, yPercent: 0, opacity: 1 }, 0.2);
    }, root);
    return () => ctx.revert();
  }, [compact]);

  const prev = phoneScreens[(index + n - 1) % n];
  const next = phoneScreens[(index + 1) % n];

  const dots = (
    <div className="phone-dots" role="tablist" aria-label="Phone screens">
      {phoneScreens.map((screen, i) => (
        <button
          key={screen.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          className={i === index ? "on" : ""}
          onClick={() => {
            setIndex(i);
            if (!compact) jumpToStep(root.current, n, i);
          }}
          aria-label={screen.title}
        />
      ))}
    </div>
  );

  return (
    <div className="phone-pin" id="phone" ref={root} style={{ "--n": n }}>
        <div className="phone-sticky">
          <div className="orb orb-a" aria-hidden="true" />
          <div className="orb orb-b" aria-hidden="true" />
          <div className="phone-layout">
            <div className="phone-text">
              <AnimatePresence mode="wait">
                <Copy phone={phone} key={phone.id} />
              </AnimatePresence>
              {dots}
            </div>
            <div className="phone-stage">
              {!compact && (
                <div className="ph-side l" aria-hidden="true">
                  <Phone screen={prev} className="small dim" />
                </div>
              )}
              <div className="ph-main">
                <Phone screen={phone} />
              </div>
              {!compact && (
                <div className="ph-side r" aria-hidden="true">
                  <Phone screen={next} className="small dim" />
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
