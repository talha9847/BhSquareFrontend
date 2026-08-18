import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

/* Masked line-by-line reveal used for hero + section headings */
export const MaskText = ({ lines, className = "", delay = 0, testId }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <span ref={ref} data-testid={testId} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="hero-mask-line">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export const Reveal = ({ children, delay = 0, y = 28, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

/* Magnetic wrapper for buttons */
export const Magnetic = ({
  children,
  strength = 0.4,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CountUp = ({
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  testId,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} data-testid={testId} className={className}>
      {prefix}
      {val.toLocaleString("en-IN", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

/* mouse-follow spotlight for glass cards */
export const useSpotlight = () => {
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };
  const background = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(340px circle at ${x}% ${y}%, rgba(255,138,0,0.15), transparent 70%)`,
  );
  return { onMove, background };
};
