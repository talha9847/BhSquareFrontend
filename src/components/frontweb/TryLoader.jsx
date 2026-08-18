import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun } from "lucide-react";

/* Cinematic loader: glowing sun rays that resolve into the BHsquare logo */
export default function TryLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setTimeout(() => {
          setGone(true);
          setTimeout(onDone, 900);
        }, 550);
      }
      setProgress(Math.min(p, 100));
    }, 180);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          data-testid="cinematic-loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#0B1220" }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 240,
                height: 240,
                background:
                  "radial-gradient(circle, rgba(255,138,0,0.55), rgba(255,213,74,0.15) 45%, transparent 70%)",
              }}
              animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              initial={{ rotate: 0, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 360, scale: 1, opacity: 1 }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 1 },
                opacity: { duration: 1 },
              }}
            >
              <Sun size={92} weight="fill" color="#FFD54A" />
            </motion.div>
          </div>

          <motion.div
            className="mt-10 font-display text-2xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-white">BH</span>
            <span className="text-gradient-sun">square</span>
            <span className="ml-2 text-sm font-light text-[var(--muted)]">
              SOLAR
            </span>
          </motion.div>

          <div className="mt-8 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg,#FF8A00,#FFD54A)",
                width: `${progress}%`,
              }}
            />
          </div>
          <div className="mt-3 font-display text-xs tracking-[0.3em] text-[var(--muted)]">
            {Math.round(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
