import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { roles } from "../data";
import Media from "./Media";
import { FadeUp, Reveal } from "./Bits";
import { gsap, prefersReduced, scrollToId } from "../lib/motion";

/* ------------------------------------------------------------------ */
/* Roles                                                               */
/* ------------------------------------------------------------------ */

function tilt(event) {
  if (prefersReduced()) return;
  const el = event.currentTarget;
  const box = el.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
  el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(0)}%`);
  el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(0)}%`);
}

function untilt(event) {
  event.currentTarget.style.setProperty("--rx", "0deg");
  event.currentTarget.style.setProperty("--ry", "0deg");
}

export function Roles() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".roles-media .media",
        { scale: 1.3, yPercent: -8 },
        { scale: 1.02, yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="roles-sec" id="roles" ref={root}>
      <div className="roles-media">
        <Media poster="/video/meadow.jpg" alt="A commercial lawn and mature trees" />
        <div className="story-veil" aria-hidden="true" />
      </div>
      <div className="roles-inner">
        <header className="sec-head dark">
          <FadeUp className="sec-index">
            <span className="sec-dot" aria-hidden="true" />
            06 — People
          </FadeUp>
          <Reveal text="Four people. The same property." italic={[3, 4]} className="sec-title" />
          <FadeUp className="sec-lede" delay={0.15}>
            Tap a module they open and jump to the platform.
          </FadeUp>
        </header>
        <div className="roles">
          {roles.map((role, index) => (
            <motion.article
              className="role"
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.8, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={tilt}
              onMouseLeave={untilt}
            >
              <span className="role-n" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{role.title}</h3>
              <p>{role.day}</p>
              <div className="chips">
                {role.opens.map((name) => (
                  <button key={name} className="chip" type="button" onClick={() => scrollToId("platform")}>
                    {name}
                  </button>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
