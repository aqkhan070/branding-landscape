import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { steps, partners } from "../data";
import { ORDER } from "../platform/data";
import PlatformApp from "../platform/PlatformApp";
import { Reveal, FadeUp } from "./Bits";
import { gsap, prefersReduced, useCompact, useStepWheel, ScrollTrigger } from "../lib/motion";

/** Three notes for the active laptop screen. The middle one is the screen. A partner flag is a separate third-party popup. */
const SCREEN_CARDS = {
  dashboard: [
    { label: "Monthly goals", meta: "What is left this month", tag: "Goal" },
    { label: "Dashboard", meta: "Requests and estimates in motion", tag: "Home" },
    { label: "Upcoming events", meta: "The week beside the work", tag: "Today" },
  ],
  crm: [
    { label: "Open activities", meta: "How the week is tracking", tag: "Week" },
    { label: "CRM Dashboard", meta: "Pipeline health in one view", tag: "CRM" },
    { label: "Timeframe", meta: "Week, month, or year", tag: "View" },
  ],
  activities: [
    { label: "Tasks and events", meta: "Tied to the company or the deal", tag: "Open" },
    { label: "Activities", meta: "Calls and meetings on the account", tag: "Log" },
    { label: "Next visit", meta: "On the calendar before the estimate", tag: "Next" },
  ],
  pipelines: [
    { label: "Gmail", meta: "The thread stays on the opportunity", tag: "Mail", tone: "info", partner: true },
    { label: "Pipelines", meta: "Opportunities move through stages", tag: "Board" },
    { label: "QuickBooks", meta: "A won stage can create the customer", tag: "Sync", tone: "info", partner: true },
  ],
  scorecard: [
    { label: "This week", meta: "A miss shows before the month closes", tag: "Week" },
    { label: "BD Scorecard", meta: "Goals next to what the CRM produced", tag: "Goals" },
    { label: "From the CRM", meta: "The numbers are the pipeline", tag: "Source" },
  ],
  estimator: [
    { label: "Pricing output", meta: "The monthly bid from the measure", tag: "Price" },
    { label: "Maintenance Estimator", meta: "Recurring maintenance, priced here", tag: "Bid" },
    { label: "SiteRecon", meta: "Order a measure. Status and credit", tag: "Order", tone: "info", partner: true },
  ],
  kpis: [
    { label: "Materials", meta: "Cost tracking beside invoice totals", tag: "Cost" },
    { label: "KPIs", meta: "The operating month on one screen", tag: "Month" },
    { label: "Before the books close", meta: "A soft month shows up here", tag: "Watch" },
  ],
  sr: [
    { label: "Assign and close", meta: "The visit against the property", tag: "Open" },
    { label: "Service requests", meta: "Open work the office and the crew share", tag: "Field" },
    { label: "On the map", meta: "The same visit is a place, not only a row", tag: "Pin" },
  ],
  estimates: [
    { label: "Pending", meta: "Waiting on the customer", tag: "Draft" },
    { label: "Proposal PDF", meta: "Preview it, then send for approval", tag: "Ready" },
    { label: "Approved", meta: "Becomes a job, an invoice, or billing", tag: "Won" },
  ],
  treemap: [
    { label: "Marked trees", meta: "Placed on the property", tag: "Site" },
    { label: "Tree map", meta: "The plan carries into the estimate", tag: "Map" },
    { label: "The crew", meta: "Inherits the same picture of the site", tag: "Field" },
  ],
  punchlist: [
    { label: "Still open", meta: "Close items as the crew finishes", tag: "Open" },
    { label: "Punch list", meta: "What is left on the property", tag: "List" },
    { label: "Preview", meta: "The office can send it", tag: "Send" },
  ],
  po: [
    { label: "Vendor", meta: "The bill follows this order", tag: "Vendor" },
    { label: "Purchase order", meta: "Raised for the work", tag: "PO" },
    { label: "From the shop", meta: "A fleet work order can raise one", tag: "Shop" },
  ],
  routes: [
    { label: "The week", meta: "Visits laid into a route", tag: "Route" },
    { label: "Route scheduler", meta: "The phone follows that order", tag: "Dispatch" },
    { label: "Crew and truck", meta: "Each row is a foreman on a route", tag: "Crew" },
  ],
  bills: [
    { label: "From a PO", meta: "A bill can start from the order", tag: "PO" },
    { label: "Bills", meta: "What the company owes", tag: "Due" },
    { label: "QuickBooks", meta: "Synced beside the money you bill", tag: "Sync", tone: "info", partner: true },
  ],
  invoices: [
    { label: "Balance", meta: "Stays on the customer", tag: "Due" },
    { label: "Invoice", meta: "The approved work, ready to send", tag: "Open" },
    { label: "QuickBooks", meta: "The invoice goes through the sync", tag: "Sync", tone: "info", partner: true },
  ],
  fleet: [
    { label: "On the road", meta: "What needs attention in the yard", tag: "Yard" },
    { label: "Fleet dashboard", meta: "Trucks, equipment, and status", tag: "Fleet" },
    { label: "Samsara", meta: "The truck list syncs in", tag: "Live", tone: "info", partner: true },
  ],
  pm: [
    { label: "Due this week", meta: "Before it becomes a breakdown", tag: "Due" },
    { label: "PM scheduler", meta: "Preventive service on a calendar", tag: "PM" },
    { label: "Intervals", meta: "Miles and days, by truck class", tag: "Plan" },
  ],
  jobcal: [
    { label: "Foreman", meta: "The week of who is on site", tag: "Crew" },
    { label: "Job calendar", meta: "The day of work, by person", tag: "Dated" },
    { label: "Schedule", meta: "A day here is a crew on the property", tag: "Set" },
  ],
};

function FloatSlot({ place, card, screen }) {
  return (
    <div className={`float float-${place}${screen ? " is-screen" : ""}${card.partner ? " is-partner" : ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${card.label}-${card.meta}`}
          className="float-copy"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {card.partner ? <span className="pulse" /> : <span className="float-mark" aria-hidden="true" />}
          <span>
            <b>{card.label}</b>
            <small>{card.meta}</small>
          </span>
          <em className={`tag ${card.tone || "live"}`}>{card.tag}</em>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Fraction of the pin used only to settle the laptop — modules start after this. */
const OPEN = 0.08;

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-set" key={copy}>
            {steps.map((item) => (
              <span key={`${copy}-${item.id}`}>
                <i /> {item.n} {item.screen}
              </span>
            ))}
            {partners.map((item) => (
              <span key={`${copy}-${item.id}`}>
                <i /> {item.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Laptop({ current, onPick }) {
  return (
    <div className="lap" aria-label="Laptop showing Landscape modules">
      <div className="lap-lid">
        <div className="lap-bezel">
          <span className="lap-cam" aria-hidden="true" />
          <div className="lap-screen">
            <div className="browser-bar" aria-hidden="true">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="url">app.landscape · demo workspace</span>
            </div>
            <PlatformApp current={current} onPick={onPick} />
          </div>
        </div>
      </div>
      <div className="lap-base" aria-hidden="true">
        <i />
      </div>
      <div className="lap-shadow" aria-hidden="true" />
    </div>
  );
}

export default function Showcase() {
  const root = useRef(null);
  const compact = useCompact();
  const [current, setCurrent] = useState(ORDER[0]);
  const lockScroll = useRef(false);
  const pickGen = useRef(0);
  const scrolling = useRef(false);
  const scrollIdle = useRef(0);

  useEffect(() => {
    if (compact || prefersReduced()) return undefined;
    const el = root.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      // One-shot open — not scrubbed, so the LCD stays still while modules change
      let opened = false;
      const openLap = () => {
        if (opened) return;
        opened = true;
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(".lap-lid", { rotateX: 0, duration: 1.2 }, 0)
          .to(".lap", { yPercent: 0, duration: 1.2 }, 0)
          .to(".float", { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.4);
      };

      gsap.set(".lap-lid", { rotateX: 62, transformOrigin: "50% 100%" });
      gsap.set(".lap", { yPercent: 8 });
      gsap.set(".float", { opacity: 0, y: 28 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        once: true,
        onEnter: openLap,
      });
      if (el.getBoundingClientRect().top < window.innerHeight * 0.7) openLap();

      // Scrub only drives which module is shown — laptop stays pinned via CSS sticky
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        onUpdate: (self) => {
          if (lockScroll.current) return;
          scrolling.current = true;
          window.clearTimeout(scrollIdle.current);
          scrollIdle.current = window.setTimeout(() => {
            scrolling.current = false;
          }, 140);
          const p = self.progress;
          if (p <= OPEN) {
            setCurrent((c) => (c === ORDER[0] ? c : ORDER[0]));
            return;
          }
          const t = Math.min(1, Math.max(0, (p - OPEN) / (1 - OPEN)));
          const index = Math.min(ORDER.length - 1, Math.max(0, Math.floor(t * ORDER.length - 1e-6)));
          setCurrent((c) => (c === ORDER[index] ? c : ORDER[index]));
        },
        onRefresh: (self) => {
          if (lockScroll.current) return;
          const p = self.progress;
          if (p <= OPEN) {
            setCurrent(ORDER[0]);
            return;
          }
          const t = Math.min(1, Math.max(0, (p - OPEN) / (1 - OPEN)));
          const index = Math.min(ORDER.length - 1, Math.max(0, Math.floor(t * ORDER.length - 1e-6)));
          setCurrent(ORDER[index]);
        },
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [compact]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  function jump(node) {
    pickGen.current += 1;
    lockScroll.current = false;
    gsap.killTweensOf(window);
    if (!node) return;
    if (prefersReduced()) {
      node.scrollIntoView();
      return;
    }
    gsap.to(window, {
      duration: 0.9,
      scrollTo: { y: node, autoKill: false },
      ease: "power3.inOut",
      overwrite: "auto",
    });
  }

  function skip(dir) {
    const here = root.current;
    if (dir === "up") {
      jump(document.getElementById("top"));
      return;
    }
    jump(here?.nextElementSibling || here?.parentElement?.nextElementSibling);
  }

  function pick(id, opts = {}) {
    if (opts.soft && scrolling.current) return;
    setCurrent(id);
    if (opts.soft || compact || prefersReduced() || !root.current) return;
    const index = ORDER.indexOf(id);
    if (index < 0) return;
    const token = ++pickGen.current;
    lockScroll.current = true;
    const el = root.current;
    const scrollable = el.offsetHeight - window.innerHeight;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const openEnd = top + scrollable * OPEN;
    const moduleSpan = scrollable * (1 - OPEN);
    const y = openEnd + (moduleSpan * (index + 0.5)) / ORDER.length;
    // Stay locked through the glide and the scrub lag so a fast flick cannot
    // write a later module back onto the screen. The wheel itself is free again after 0.5s.
    window.setTimeout(() => {
      if (pickGen.current === token) lockScroll.current = false;
    }, 1500);
    gsap.to(window, {
      duration: 0.75,
      scrollTo: { y, autoKill: true },
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }

  useStepWheel(root, {
    enabled: !compact,
    getIndex: () => ORDER.indexOf(current),
    count: ORDER.length,
    onStep: (index) => pick(ORDER[index]),
  });

  return (
    <section className="showcase" id="platform" ref={root} style={{ "--mods": ORDER.length }}>
      <div className="showcase-sticky">
        <div className="showcase-head">
          <div className="showcase-kicker">
            <FadeUp className="sec-index">
              <span className="sec-dot" aria-hidden="true" />
              01 — The platform
            </FadeUp>
            <div className="platform-jumps">
              <button type="button" className="platform-skip" onClick={() => skip("up")}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 16V6M6 10l4-4 4 4" />
                </svg>
                
              </button>
              <button type="button" className="platform-skip" onClick={() => skip("down")}>
                
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 4v10M6 10l4 4 4-4" />
                </svg>
              </button>
            </div>
          </div>
          <Reveal text="The whole company, on one screen." italic={[3, 4, 5]} className="sec-title" />
        </div>

        <div className="showcase-stage">
          <div className="lap-slot">
            {(SCREEN_CARDS[current] || SCREEN_CARDS.dashboard).map((card, index) => (
              <FloatSlot key={"abc"[index]} place={"abc"[index]} card={card} screen={index === 1} />
            ))}
            <Laptop current={current} onPick={pick} />
          </div>
        </div>
      </div>
    </section>
  );
}
