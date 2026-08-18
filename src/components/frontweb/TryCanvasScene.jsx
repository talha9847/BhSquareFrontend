import { useEffect, useRef } from "react";

/* Fixed cinematic canvas: starfield + volumetric sun + drifting energy particles.
   The sun scales/shifts based on scroll progress to simulate the camera
   travelling from the Sun toward Earth. Pure canvas 2D for performance. */
export default function TryCanvasScene() {
  const ref = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h, dpr;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const stars = [];
    const particles = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();

    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 * dpr + 0.2,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.004,
      });
    }
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 * dpr + 0.6,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        vy: -(Math.random() * 0.4 + 0.1) * dpr,
        life: Math.random(),
      });
    }

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();

    let t = 0;
    const draw = () => {
      t += 0.01;
      const p = scrollRef.current; // 0..1 whole page
      ctx.clearRect(0, 0, w, h);

      // Background deep-space fade -> lighter as we approach earth/day
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      const dayMix = Math.min(Math.max((p - 0.45) * 2.2, 0), 1);
      bg.addColorStop(
        0,
        `rgb(${11 + dayMix * 6}, ${18 + dayMix * 10}, ${32 + dayMix * 14})`,
      );
      bg.addColorStop(1, `rgb(${8}, ${12}, ${22})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Stars (fade out as day approaches)
      const starAlpha = 1 - dayMix * 0.85;
      stars.forEach((s) => {
        s.tw += s.sp;
        const a = (0.4 + Math.abs(Math.sin(s.tw)) * 0.6) * starAlpha;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Sun position/scale driven by scroll (hero region 0..0.16)
      const local = Math.min(p / 0.18, 1);
      const sunX = w * (0.62 - local * 0.15);
      const sunY = h * (0.42 + local * 0.1);
      const baseR =
        Math.min(w, h) * (0.28 + (reduce ? 0 : Math.sin(t) * 0.006));
      const sunR = baseR * (1 - local * 0.55);

      // Corona glow
      const glow = ctx.createRadialGradient(
        sunX,
        sunY,
        sunR * 0.2,
        sunX,
        sunY,
        sunR * 2.6,
      );
      glow.addColorStop(0, "rgba(255,213,74,0.9)");
      glow.addColorStop(0.25, "rgba(255,138,0,0.55)");
      glow.addColorStop(0.55, "rgba(255,106,0,0.18)");
      glow.addColorStop(1, "rgba(255,106,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Sun core
      const core = ctx.createRadialGradient(
        sunX - sunR * 0.2,
        sunY - sunR * 0.2,
        sunR * 0.1,
        sunX,
        sunY,
        sunR,
      );
      core.addColorStop(0, "#FFF3C4");
      core.addColorStop(0.5, "#FFD54A");
      core.addColorStop(1, "#FF8A00");
      ctx.beginPath();
      ctx.fillStyle = core;
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Solar flare rays
      if (!reduce) {
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(t * 0.15);
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2;
          const len = sunR * (1.5 + Math.sin(t * 2 + i) * 0.25);
          const grad = ctx.createLinearGradient(
            0,
            0,
            Math.cos(ang) * len,
            Math.sin(ang) * len,
          );
          grad.addColorStop(0, "rgba(255,180,60,0.35)");
          grad.addColorStop(1, "rgba(255,138,0,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * sunR * 0.9, Math.sin(ang) * sunR * 0.9);
          ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Drifting energy particles
      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.003;
        if (pt.y < -10 || pt.life <= 0) {
          pt.x = Math.random() * w;
          pt.y = h + 10;
          pt.life = 1;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,${170 + Math.random() * 40},60,${pt.life * 0.5})`;
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-testid="cinematic-canvas"
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
