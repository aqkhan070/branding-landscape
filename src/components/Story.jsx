import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Media from "./Media";
import { story } from "../features";
import { gsap, prefersReduced, useCompact, useSectionProgress } from "../lib/motion";

const words = (text) =>
  text.split(" ").map((w, i) => (
    <span className="sw" key={`${w}-${i}`}>
      {w}{" "}
    </span>
  ));

/* ---------- 1. Ground: scrubbed statement over soil footage ---------- */
export function StoryGround() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReduced()) {
      root.current?.classList.add("static");
      return undefined;
    }
    const ctx = gsap.context(() => {
      const trigger = { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.5 };
      gsap.to(".sw", { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { ...trigger, end: "bottom 85%" } });
      gsap.fromTo(".story-ground .media", { scale: 1.05 }, { scale: 1.3, ease: "none", scrollTrigger: trigger });
      gsap.fromTo(".sg-eyebrow", { yPercent: 0 }, { yPercent: -120, ease: "none", scrollTrigger: trigger });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="story-ground" ref={root} aria-label="Every property starts as ground">
      <div className="story-sticky">
        <Media poster="/video/soil.jpg" alt="Fresh soil and a new planting, where every property starts" />
        <div className="story-veil" aria-hidden="true" />
        <div className="sg-copy">
          <p className="sg-eyebrow">
            <span className="sec-dot" aria-hidden="true" /> Built from the ground up
          </p>
          <p className="sg-text">
            {words("Every property starts as ground.")} <em>{words("Every visit leaves a record.")}</em>{" "}
            {words("Nothing is retyped later.")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. Image sequence with wipe transitions ---------- */
export function StoryReel() {
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const compact = useCompact();

  useSectionProgress(root, (p) => {
    if (compact) return;
    setIndex(Math.min(story.length - 1, Math.floor(p * story.length * 0.999)));
  });

  useEffect(() => {
    if (compact || prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      const n = story.length;
      gsap.set(".reel-layer", { clipPath: (i) => (i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)") });
      for (let i = 0; i < n; i += 1) {
        const at = i / n;
        if (i > 0) tl.fromTo(`.reel-layer:nth-child(${i + 1})`, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7 / n }, at - 0.7 / n * 0.5);
        tl.fromTo(`.reel-layer:nth-child(${i + 1}) img`, { scale: 1.3, yPercent: 6 }, { scale: 1.02, yPercent: -4, duration: 1 / n }, at - (i > 0 ? 0.35 / n : 0));
      }
      tl.fromTo(".reel-frame", { scale: 0.92, borderRadius: 56 }, { scale: 1, borderRadius: 28, duration: 0.12 }, 0);
    }, root);
    return () => ctx.revert();
  }, [compact]);

  const caption = story[index];

  if (compact) {
    return (
      <section className="story-reel stacked" ref={root} aria-label="From the field">
        {story.map((item) => (
          <figure key={item.src}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            <figcaption>
              <small>{item.tag}</small>
              {item.line}
            </figcaption>
          </figure>
        ))}
      </section>
    );
  }

  return (
    <section className="story-reel" ref={root} aria-label="From the field" style={{ "--n": story.length }}>
      <div className="story-sticky">
        <div className="reel-frame">
          {story.map((item, i) => (
            <div className="reel-layer" key={item.src}>
              <img src={item.src} alt={i === index ? item.alt : ""} loading="lazy" />
            </div>
          ))}
          <div className="reel-shade" aria-hidden="true" />
          <div className="reel-caption" aria-live="polite">
            <span className="reel-count">
              {String(index + 1).padStart(2, "0")} <i>/ {String(story.length).padStart(2, "0")}</i>
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={caption.line}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <small>{caption.tag}</small>
                {caption.line}
              </motion.p>
            </AnimatePresence>
          </div>
          <ol className="reel-ticks" aria-hidden="true">
            {story.map((item, i) => (
              <li key={item.tag} className={i === index ? "on" : i < index ? "done" : ""} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Meadow: mask reveal into the phone section ---------- */
export function StoryMeadow() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.fromTo(
        ".sm-frame",
        { clipPath: "inset(16% 24% 16% 24% round 56px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.4, ease: "power2.inOut" },
        0
      )
        .fromTo(".sm-frame .media", { scale: 1.35 }, { scale: 1.05, duration: 1 }, 0)
        .fromTo(".sm-line", { yPercent: 120 }, { yPercent: 0, duration: 0.18, stagger: 0.07, ease: "power3.out" }, 0.3)
        .fromTo(".sm-sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.55)
        .to(".sm-copy", { yPercent: -30, opacity: 0, duration: 0.25 }, 0.78);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="story-meadow" ref={root} aria-label="The phone is the same company in the field">
      <div className="story-sticky">
        <div className="sm-frame">
          <Media poster="/video/meadow.jpg" alt="A commercial lawn and mature trees, the field the crew maintains" />
          <div className="story-veil soft" aria-hidden="true" />
        </div>
        <div className="sm-copy">
          <h2 aria-label="Web is the office. The phone is the same company in the field.">
            {["Web is the office.", "The phone is the field."].map((line, i) => (
              <span className="sm-mask" key={line} aria-hidden="true">
                <span className={i ? "sm-line em" : "sm-line"}>{line}</span>
              </span>
            ))}
          </h2>
          <p className="sm-sub">
            The visit, the close-out, irrigation, a price, CRM, the scorecard, the fleet, and the shift. The same company, wherever the crew is standing.
          </p>
        </div>
      </div>
    </section>
  );
}
