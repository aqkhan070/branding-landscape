import { Fragment, useEffect, useRef } from "react";
import { company } from "../data";
import Media from "./Media";
import { gsap, prefersReduced, scrollToId } from "../lib/motion";

const SIGNALS = ["Eight steps, lead to invoice", "Web for the office", "Phone for the crew", "One property record"];

export default function Hero() {
  const root = useRef(null);
  const enterRef = useRef(null);
  const entering = useRef(false);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.set(".hero-curtain", { scaleY: 1 });
      gsap.set(".hero-media img, .hero-media video", { scale: 1.08, transformOrigin: "62% 50%" });
      gsap.set(".hero-brand-letter", { yPercent: 110, opacity: 0 });
      gsap.set(".hero-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".hero-mark-sub, .hero-deck, .hero-signals, .hero-enter", { opacity: 0, y: 22 });
      gsap.set(".h-word", { yPercent: 110, opacity: 0 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(".hero-curtain", { scaleY: 0, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(
          ".hero-media img, .hero-media video",
          { scale: 1, duration: 2.6, ease: "power2.out" },
          0.05
        )
        .to(".hero-brand-letter", { yPercent: 0, opacity: 1, duration: 1, stagger: 0.04 }, 0.3)
        .to(".hero-rule", { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0.8)
        .to(".hero-mark-sub", { opacity: 1, y: 0, duration: 0.7 }, 0.85)
        .to(".h-word", { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.055 }, 0.95)
        .to(".hero-deck", { opacity: 1, y: 0, duration: 0.75 }, 1.2)
        .to(".hero-signals", { opacity: 1, y: 0, duration: 0.7 }, 1.35)
        .to(".hero-enter", { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" }, 1.55);

      gsap.to(".hero-media img, .hero-media video", {
        yPercent: 6,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-copy", {
        yPercent: -8,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "85% top", scrub: true },
      });
      gsap.to(".hero-enter", {
        y: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "12% top", end: "55% top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const handleEnter = () => {
    if (entering.current) return;
    entering.current = true;

    const go = () => {
      scrollToId("platform", { duration: 1.55, ease: "power2.inOut" });
      window.setTimeout(() => {
        entering.current = false;
      }, 1600);
    };

    if (prefersReduced() || !enterRef.current) {
      go();
      return;
    }

    const btn = enterRef.current;
    const icon = btn.querySelector(".hero-enter-icon");
    const tl = gsap.timeline({ onComplete: go });
    tl.to(btn, { scale: 0.88, duration: 0.14, ease: "power2.in" })
      .to(icon, { y: 10, opacity: 0.25, duration: 0.38, ease: "power2.out" }, 0)
      .to(btn, { scale: 1.05, opacity: 0.35, duration: 0.3, ease: "power2.out" }, 0.1);
  };

  const brand = company.mark.split("");
  const lines = company.line.split(". ").map((part) => part.replace(/\.$/, ""));

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-media" aria-hidden="true">
        <div className="hero-media-frame">
          <Media video="/video/crew.mp4" poster="/video/crew.jpg" eager />
        </div>
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-curtain" aria-hidden="true" />

      <div className="hero-copy">
        <p className="hero-brand" aria-label={company.mark}>
          <span className="hero-brand-row" aria-hidden="true">
            {brand.map((ch, i) => (
              <span className="hero-brand-mask" key={`${ch}-${i}`}>
                <span className="hero-brand-letter">{ch}</span>
              </span>
            ))}
          </span>
          <span className="hero-rule" aria-hidden="true" />
          <span className="hero-mark-sub">Commercial Landscape</span>
        </p>

        <h1 aria-label={company.line}>
          {lines.map((line, i) => (
            <span className={i === 1 ? "h-line em" : "h-line"} key={line} aria-hidden="true">
              {line.split(" ").map((word, w, all) => (
                <Fragment key={`${word}-${w}`}>
                  <span className="h-mask">
                    <span className="h-word">{word}</span>
                  </span>
                  {w < all.length - 1 ? " " : ""}
                </Fragment>
              ))}
              <span className="h-dot">.</span>
            </span>
          ))}
        </h1>

        <p className="hero-deck">
          Sales, the office, and the crew share one record of the property, the work, and the money.
        </p>

        <ul className="hero-signals" aria-label="What this exhibition covers">
          {SIGNALS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <button
        className="hero-enter"
        type="button"
        ref={enterRef}
        onClick={handleEnter}
        aria-label="Enter the exhibition"
      >
        <svg className="hero-enter-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 6v16.5m0 0-6.5-6.5M16 22.5l6.5-6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
