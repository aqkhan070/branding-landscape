import { useEffect, useRef, useState } from "react";
import { useCompact, useReducedMotion } from "../lib/motion";

function saveData() {
  const conn = typeof navigator !== "undefined" ? navigator.connection : null;
  return Boolean(conn && conn.saveData);
}

/**
 * Full-bleed media. Plays a muted, looped video on capable screens and
 * falls back to the poster image on phones, tablets, reduced-motion and
 * data-saver. The video only loads when it is near the viewport and
 * pauses when it leaves.
 */
export default function Media({ video, poster, alt = "", eager = false, className = "", loopEnd = null }) {
  const reduced = useReducedMotion();
  const compact = useCompact();
  const allowVideo = Boolean(video) && !reduced && !compact && !saveData();
  const wrap = useRef(null);
  const vid = useRef(null);
  const [near, setNear] = useState(eager);
  const [ready, setReady] = useState(false);
  const trim = typeof loopEnd === "number" && loopEnd > 0;

  useEffect(() => {
    if (!allowVideo || !wrap.current) return undefined;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        const node = vid.current;
        if (!node) return;
        if (entry.isIntersecting) node.play().catch(() => {});
        else node.pause();
      },
      { rootMargin: "400px 0px" }
    );
    watcher.observe(wrap.current);
    return () => watcher.disconnect();
  }, [allowVideo, near]);

  useEffect(() => {
    const node = vid.current;
    if (!node || !trim) return undefined;
    const restart = () => {
      if (node.currentTime >= loopEnd) {
        node.currentTime = 0.05;
        node.play().catch(() => {});
      }
    };
    node.addEventListener("timeupdate", restart);
    return () => node.removeEventListener("timeupdate", restart);
  }, [trim, loopEnd, near, ready]);

  return (
    <div className={`media ${className}`} ref={wrap} aria-hidden={alt ? undefined : "true"}>
      <img src={poster} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
      {allowVideo && near && (
        <video
          ref={vid}
          className={ready ? "ready" : ""}
          src={video}
          poster={poster}
          muted
          loop={!trim}
          playsInline
          autoPlay
          preload="auto"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
