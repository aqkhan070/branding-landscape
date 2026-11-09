import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { modules } from "../data";
import { SectionHead } from "./Bits";

const ORDER = ["Across the office", "Win the work", "Run the field", "Fleet and people", "Get paid"];

function stagesFrom(list) {
  const seen = new Set(ORDER);
  const extra = [];
  list.forEach((mod) => {
    if (!seen.has(mod.group)) {
      seen.add(mod.group);
      extra.push(mod.group);
    }
  });
  return [...ORDER, ...extra].map((group) => ({
    group,
    items: list.filter((mod) => mod.group === group),
  })).filter((stage) => stage.items.length);
}

export default function FlowMap() {
  const stages = stagesFrom(modules);
  const boardRef = useRef(null);
  const anchor = useRef(null);
  const tipRef = useRef(null);
  const hideTimer = useRef(0);
  const [tip, setTip] = useState(null);
  const [box, setBox] = useState(null);
  const active = tip ? modules.find((mod) => mod.name === tip.name) : null;

  useLayoutEffect(() => {
    if (!tip) return undefined;
    let frame = 0;
    function place() {
      const el = anchor.current;
      const node = tipRef.current;
      if (!el || !node) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 40 || rect.top > window.innerHeight - 8) {
        setTip(null);
        return;
      }
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      const gap = 14;
      let left = rect.left + rect.width / 2 - width / 2;
      left = Math.max(10, Math.min(left, window.innerWidth - width - 10));
      let top = rect.bottom + gap;
      let flip = false;
      if (top + height > window.innerHeight - 10 && rect.top - height - gap > 10) {
        top = rect.top - height - gap;
        flip = true;
      }
      top = Math.max(10, Math.min(top, window.innerHeight - height - 10));
      const arrow = Math.max(16, Math.min(width - 16, rect.left + rect.width / 2 - left));
      setBox({ name: tip.name, left, top, arrow, flip });
    }
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        place();
      });
    }
    place();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [tip]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  useEffect(() => {
    const root = boardRef.current;
    if (!root) return undefined;
    let lastWidth = -1;
    function layout(force) {
      const width = root.clientWidth;
      if (!force && width === lastWidth) return;
      lastWidth = width;
      const links = [...root.querySelectorAll(".fmap-link")];
      links.forEach((link) => link.classList.remove("wrap"));
      for (let pass = 0; pass < 8; pass += 1) {
        let changed = false;
        links.forEach((link) => {
          if (link.classList.contains("wrap")) return;
          const next = link.parentElement?.nextElementSibling;
          const pair = link.parentElement;
          if (!next || !pair) return;
          if (next.getBoundingClientRect().top > pair.getBoundingClientRect().top + 8) {
            link.classList.add("wrap");
            changed = true;
          }
        });
        if (!changed) break;
      }
    }
    layout(true);
    document.fonts?.ready.then(() => layout(true));
    const observer = new ResizeObserver(() => layout(false));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!tip) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setTip(null);
    }
    function onDown(event) {
      if (event.target instanceof Element && event.target.closest(".fmap-name, .fmap-tip")) return;
      setTip(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [tip]);

  function show(mod, el) {
    window.clearTimeout(hideTimer.current);
    anchor.current = el;
    setTip((current) => (current?.name === mod.name ? current : { name: mod.name, pinned: false }));
  }

  function hide() {
    setTip((current) => (current?.pinned ? current : null));
  }

  function hideSoon() {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(hide, 90);
  }

  function pin(mod, el) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    anchor.current = el;
    setTip((current) => (current?.name === mod.name && current.pinned ? null : { name: mod.name, pinned: true }));
  }

  return (
    <section className="section fmap" id="flow">
      <SectionHead index="03 — The flow" title="Every module, and the direction it moves." italic={[4, 5, 6]}>
        {modules.length} modules. Hover a name to read it. The line runs from the office to a paid invoice.
      </SectionHead>

      <div className="fmap-board" ref={boardRef}>
        {stages.map((stage, index) => (
          <div className="fmap-stage" key={stage.group}>
            <div className="fmap-spine" aria-hidden="true">
              <span className="fmap-dot" />
              {index < stages.length - 1 && (
                <span className="fmap-stem">
                  <i style={{ animationDelay: `${index * 0.28}s` }} />
                </span>
              )}
            </div>
            <div className="fmap-lane">
              <header className="fmap-head">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{stage.group}</h3>
              </header>
              <div className="fmap-rail" aria-hidden="true">
                <span className="fmap-line" />
                <b />
              </div>
              <div className="fmap-nodes">
                {stage.items.map((mod, itemIndex) => (
                  <span
                    className="fmap-pair"
                    key={mod.name}
                    onPointerEnter={(event) => {
                      const button = event.currentTarget.querySelector("button");
                      if (button) show(mod, button);
                    }}
                    onPointerLeave={hideSoon}
                  >
                    <button
                      type="button"
                      className={tip?.name === mod.name ? "fmap-name on" : "fmap-name"}
                      aria-describedby={tip?.name === mod.name ? "flow-tip" : undefined}
                      onFocus={(event) => show(mod, event.currentTarget)}
                      onBlur={hide}
                      onClick={(event) => pin(mod, event.currentTarget)}
                    >
                      {mod.name}
                    </button>
                    {itemIndex < stage.items.length - 1 && (
                      <span className="fmap-link" aria-hidden="true">
                        <i style={{ animationDelay: `${(itemIndex % 6) * 0.12}s` }} />
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
          <div
            ref={tipRef}
            id="flow-tip"
            role="tooltip"
            className={box?.flip ? "fmap-tip flip" : "fmap-tip"}
            onPointerEnter={() => window.clearTimeout(hideTimer.current)}
            onPointerLeave={hideSoon}
            style={{
              left: box?.name === active.name ? box.left : -9999,
              top: box?.name === active.name ? box.top : 0,
              opacity: box?.name === active.name ? 1 : 0,
            }}
          >
            <i className="fmap-caret" style={{ left: box?.arrow ?? 24 }} />
            <span className="fmap-tip-k">{active.group}</span>
            <strong>{active.name}</strong>
            <p>{active.summary}</p>
          </div>
        )}
    </section>
  );
}
