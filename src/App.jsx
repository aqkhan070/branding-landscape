import { useEffect, useRef, useState } from "react";
import Nav, { NAV } from "./components/Nav";
import Hero from "./components/Hero";
import Showcase, { Marquee } from "./components/Showcase";
// 02 Features is parked. Restore the import and the tag below the platform to bring it back.
// import Features from "./components/Features";
import { StoryReel } from "./components/Story";
import Workflow from "./components/Workflow";
import Partners from "./components/Partners";
import Mobile from "./components/Mobile";
import LiveTrack from "./components/LiveTrack";
import FlowMap from "./components/FlowMap";
import Cta from "./components/Cta";
import { gsap, scrollToId, ScrollTrigger } from "./lib/motion";
import "./styles.css";

const SECTION_IDS = ["top", ...NAV.map(([id]) => id), "booth"];

export default function App() {
  const [active, setActive] = useState("top");
  const cursorRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
      let current = SECTION_IDS[0];
      SECTION_IDS.forEach((id) => {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top - window.innerHeight * 0.35 <= 0) current = id;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cursor = cursorRef.current;
    if (!fine || reduce || !cursor) return undefined;
    const x = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    const onMove = (event) => {
      x(event.clientX);
      y(event.clientY);
      cursor.classList.add("live");
      const hot = event.target instanceof Element && event.target.closest("a, button, input, label");
      cursor.classList.toggle("hot", Boolean(hot));
    };
    const onLeave = () => cursor.classList.remove("live");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <a
        className="skip"
        href="#platform"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("platform");
        }}
      >
        Skip to content
      </a>
      <div className="cursor" ref={cursorRef} aria-hidden="true" />
      <div className="progress" aria-hidden="true" />
      <Nav active={active} />

      <main>
        <Hero />
        <div className="sheet">
          <Marquee />
          <Showcase />
          {/* 02 Features — parked
          <Features />
          */}
        </div>
        <Mobile />
        <LiveTrack />
        <FlowMap />
        <Partners />
        <Workflow />
        <StoryReel />
        <Cta />
      </main>
    </>
  );
}
