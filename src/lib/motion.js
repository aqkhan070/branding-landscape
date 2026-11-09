import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useCompact = () => useMediaQuery("(max-width: 900px)");

export function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id, { duration = 1.15, ease = "power3.inOut", offsetY = 0 } = {}) {
  const node = document.getElementById(id);
  if (!node) return;
  if (prefersReduced()) {
    node.scrollIntoView();
    return;
  }
  gsap.to(window, {
    duration,
    scrollTo: { y: node, offsetY, autoKill: true },
    ease,
  });
}

/**
 * Tracks scroll progress (0 to 1) of a tall section that holds a sticky stage.
 * The callback always sees the latest closure.
 */
export function useSectionProgress(ref, onProgress) {
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => cb.current(self.progress),
      onRefresh: (self) => cb.current(self.progress),
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      cb.current(trigger.progress);
    });
    cb.current(trigger.progress);
    return () => trigger.kill();
  }, [ref]);
}

/** Map 0–1 progress to a stable index in [0, count). */
export function progressIndex(progress, count) {
  if (count <= 1) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count - 1e-6)));
}

/** Scroll to the middle of step `index` inside a tall sticky section. */
export function jumpToStep(el, count, index, duration = 0.9) {
  if (!el) return;
  const scrollable = el.offsetHeight - window.innerHeight;
  const top = window.scrollY + el.getBoundingClientRect().top;
  const y = scrollable > 0 ? top + (scrollable * (index + 0.5)) / count : top;
  if (prefersReduced()) {
    window.scrollTo({ top: y });
    return;
  }
  gsap.to(window, { duration, scrollTo: { y, autoKill: true }, ease: "power2.inOut", overwrite: "auto" });
}

const STEP_WHEEL_HOLD = 500;
const STEP_WHEEL_THRESHOLD = 16;

function wheelPixels(event) {
  let dy = event.deltaY;
  if (event.deltaMode === 1) dy *= 16;
  else if (event.deltaMode === 2) dy *= window.innerHeight;
  return dy;
}

function innerCanScroll(target, dy) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 2) {
      if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return true;
      if (dy < 0 && el.scrollTop > 2) return true;
    }
    el = el.parentElement;
  }
  return false;
}

function swallowWheel(event) {
  if (event.cancelable) event.preventDefault();
  event.stopImmediatePropagation();
}

/**
 * While a tall section is pinned, one wheel gesture moves exactly one step,
 * then further wheels are ignored for 0.5s so a flick cannot skip to the end.
 * At the first step a wheel up, and at the last step a wheel down, still leaves
 * the section. That exit is blocked only during the hold, so the arrival tween
 * is not cancelled by the rest of the same flick.
 */
export function useStepWheel(ref, { enabled, getIndex, count, onStep, holdMs = STEP_WHEEL_HOLD }) {
  const api = useRef({ getIndex, count, onStep });
  api.current = { getIndex, count, onStep };

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    let holdUntil = 0;
    let acc = 0;

    const onWheel = (event) => {
      if (event.ctrlKey || event.metaKey || prefersReduced()) return;
      const dy = wheelPixels(event);
      if (!dy || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (innerCanScroll(event.target, dy)) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinned = rect.top <= 2 && rect.bottom > vh + 2;
      const now = performance.now();

      if (now < holdUntil) {
        if (rect.top < vh && rect.bottom > 0) swallowWheel(event);
        return;
      }

      const reach = Math.max(Math.abs(dy), 48);
      const enteringDown = dy > 0 && rect.top > 2 && rect.top < vh && rect.top <= reach;
      const enteringUp = dy < 0 && rect.bottom > 0 && rect.bottom < vh - 2 && vh - rect.bottom <= reach;

      if (!pinned && !enteringDown && !enteringUp) {
        acc = 0;
        return;
      }

      const stepCount = api.current.count;
      if (stepCount <= 1) return;

      if (!pinned) {
        swallowWheel(event);
        acc = 0;
        holdUntil = now + holdMs;
        api.current.onStep(enteringDown ? 0 : stepCount - 1);
        return;
      }

      if (acc && Math.sign(acc) !== Math.sign(dy)) acc = 0;
      const projected = acc + dy;
      if (Math.abs(projected) < STEP_WHEEL_THRESHOLD) {
        acc = projected;
        swallowWheel(event);
        return;
      }

      const next = api.current.getIndex() + (projected > 0 ? 1 : -1);
      if (next < 0 || next >= stepCount) {
        acc = 0;
        return;
      }

      acc = 0;
      swallowWheel(event);
      holdUntil = now + holdMs;
      api.current.onStep(next);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [enabled, ref, holdMs]);
}

export function useCount(target, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    if (prefersReduced()) {
      setValue(target);
      return undefined;
    }
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: target,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: () => setValue(Math.round(state.v)),
    });
    return () => tween.kill();
  }, [target, active]);
  return value;
}
