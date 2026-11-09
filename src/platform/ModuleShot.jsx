import { forwardRef } from "react";
import { motion } from "framer-motion";
import { TITLES } from "./data";

const EASE = [0.22, 1, 0.36, 1];

/** Module screenshot. It stays whole and sits in the center of the LCD. */
const ModuleShot = forwardRef(function ModuleShot({ id, className = "", quick = false, still = false }, ref) {
  const title = TITLES[id] || id;
  if (still) {
    return (
      <figure ref={ref} className={`mod-shot shot-${id} ${className}`.trim()}>
        <img src={`/modules/${id}.webp`} alt={`${title} module`} draggable={false} />
      </figure>
    );
  }
  return (
    <motion.figure
      ref={ref}
      className={`mod-shot shot-${id} ${className}`.trim()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: quick ? 0.16 : 0.35, ease: EASE }}
    >
      <img src={`/modules/${id}.webp`} alt={`${title} module`} draggable={false} />
    </motion.figure>
  );
});

export default ModuleShot;
