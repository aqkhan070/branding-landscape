import { useEffect, useRef } from "react";
import { company } from "../data";
import Media from "./Media";
import { Button, FadeUp, Leaf, Reveal } from "./Bits";
import { gsap, prefersReduced, scrollToId } from "../lib/motion";

export default function Cta() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-media .media",
        { scale: 1.25, yPercent: -6 },
        { scale: 1.02, yPercent: 6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } }
      );
      gsap.fromTo(
        ".cta-card",
        { rotateX: 14, y: 80, opacity: 0.4 },
        { rotateX: 0, y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 15%", scrub: true } }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cta" id="booth" ref={root}>
      <div className="cta-media">
        <Media poster="/video/garden.jpg" alt="A flagship commercial landscape" />
        <div className="story-veil strong" aria-hidden="true" />
      </div>

      <div className="cta-inner">
        <div className="cta-copy">
          <FadeUp className="sec-index on-dark">
            <span className="sec-dot" aria-hidden="true" />
            06 — Booth
          </FadeUp>
          <Reveal text="Leave them with a next step." italic={[2, 3, 4]} className="cta-title" />
          <FadeUp className="cta-lede" delay={0.15}>
            If they only have a minute: scroll the eight steps. If they have five: scroll the phone, then open Fleet, the BD Scorecard, and QuickBooks. The copy on each card is the explanation.
          </FadeUp>
          <FadeUp className="cta-actions" delay={0.25}>
            <Button variant="solid" onClick={() => scrollToId("walk")}>
              Back to the walk
            </Button>
            <Button variant="glass" onClick={() => scrollToId("partners")}>
              Show the partners
            </Button>
          </FadeUp>
        </div>

        <article className="cta-card">
          <p className="kicker">Booth card</p>
          <h3>{company.name}</h3>
          <p>Ask for the eight-step walk, then the module you care about.</p>
          <dl>
            <dt>Booth</dt>
            <dd>Eazisols</dd>
            <dt>Phone</dt>
            <dd><a href="tel:+923138484008">+92 313 8484008</a></dd>
            <dt>Email</dt>
            <dd><a href="mailto:info@eazisols.com">info@eazisols.com</a></dd>
          </dl>
        </article>
      </div>

      <footer className="footer">
        <span className="footer-mark">
          <Leaf size={22} />
          <b>Landscape</b>
        </span>
        <p>
          {company.name}. This page is an exhibition tour of the product. Photography and footage are samples.
        </p>
      </footer>
    </section>
  );
}
