import { Fragment } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/** Word-by-word masked text reveal driven by Framer Motion. */
export function Reveal({ as = "h2", text, className = "", delay = 0, italic = [] }) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      className={`reveal-text ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="rt-mask" aria-hidden="true">
            <motion.span
              className={italic.includes(index) ? "rt-word em" : "rt-word"}
              variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.85, ease: EASE } } }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}

export function FadeUp({ children, delay = 0, className = "", as = "div", y = 28 }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export function SectionHead({ index, title, italic, children, tone = "light" }) {
  return (
    <header className={`sec-head ${tone}`}>
      <FadeUp className="sec-index">
        <span className="sec-dot" aria-hidden="true" />
        {index}
      </FadeUp>
      <Reveal text={title} italic={italic} className="sec-title" />
      {children && <FadeUp className="sec-lede" delay={0.15}>{children}</FadeUp>}
    </header>
  );
}

/** Magnetic button with a Framer Motion spring. */
export function Button({ as = "button", variant = "solid", children, className = "", ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={`btn ${variant} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      {...rest}
    >
      <span>{children}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" />
      </svg>
    </Tag>
  );
}

export function Leaf({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="leaf">
      <path
        d="M10 52c0-22 14-40 46-42 0 28-12 42-34 42-4 0-8 0-12 0Z"
        fill="currentColor"
      />
      <path d="M12 50C26 36 38 26 50 16" stroke="#0b2415" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
