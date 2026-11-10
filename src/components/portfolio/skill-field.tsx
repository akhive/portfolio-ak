import { useEffect, useRef } from "react";

/* Skills as glowing bubbles that fall into a pile, bump into each other and
   scatter when the pointer pushes or drags them. The real list is rendered as
   text for screen readers and no-motion visitors. */

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label: string;
  hue: number;
};

export function SkillField({ skills }: { skills: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let balls: Ball[] = [];
    let raf = 0;
    let running = false;
    let started = false;
    const pointer = { x: -999, y: -999, px: -999, py: -999, down: false, grab: -1 };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = Math.max(40, Math.min(74, w / 15));
      balls = skills.map((label, i) => {
        const r = base * (0.8 + ((label.length * 7) % 10) / 22);
        return {
          x: r + Math.random() * Math.max(1, w - 2 * r),
          y: reduced ? h - r - (i % 3) * r * 1.8 : -r - i * 70 - Math.random() * 120,
          vx: (Math.random() - 0.5) * 4,
          vy: 0,
          r,
          label,
          hue: 262 + ((i * 17) % 40) - 20,
        };
      });
      if (reduced) settle(400);
    };

    const step = () => {
      const g = 0.38;
      for (const b of balls) {
        b.vy += g;
        if (pointer.grab >= 0 && balls[pointer.grab] === b) {
          b.vx = (pointer.x - b.x) * 0.3;
          b.vy = (pointer.y - b.y) * 0.3;
        } else {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const d = Math.hypot(dx, dy);
          const reach = b.r + 60;
          if (d < reach && d > 0.01) {
            const pv = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
            const f = (1 - d / reach) * (1.2 + Math.min(pv, 40) * 0.08);
            b.vx += (dx / d) * f;
            b.vy += (dy / d) * f;
          }
        }
        b.vx *= 0.992;
        b.vy *= 0.992;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.r) {
          b.x = b.r;
          b.vx *= -0.6;
        }
        if (b.x > w - b.r) {
          b.x = w - b.r;
          b.vx *= -0.6;
        }
        if (b.y > h - b.r) {
          b.y = h - b.r;
          b.vy *= -0.45;
          b.vx *= 0.96;
        }
      }
      for (let k = 0; k < 3; k++) {
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i]!;
            const c = balls[j]!;
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const d = Math.hypot(dx, dy) || 0.01;
            const min = a.r + c.r + 2;
            if (d < min) {
              const push = (min - d) / 2;
              const nx = dx / d;
              const ny = dy / d;
              a.x -= nx * push;
              a.y -= ny * push;
              c.x += nx * push;
              c.y += ny * push;
              const rel = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
              if (rel < 0) {
                const imp = rel * 0.8;
                a.vx += nx * imp * 0.5;
                a.vy += ny * imp * 0.5;
                c.vx -= nx * imp * 0.5;
                c.vy -= ny * imp * 0.5;
              }
            }
          }
        }
      }
      pointer.px = pointer.x;
      pointer.py = pointer.y;
    };

    const settle = (n: number) => {
      for (let i = 0; i < n; i++) step();
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of balls) {
        const grd = ctx.createRadialGradient(
          b.x - b.r * 0.35,
          b.y - b.r * 0.4,
          b.r * 0.1,
          b.x,
          b.y,
          b.r,
        );
        grd.addColorStop(0, `hsl(${b.hue} 90% 82%)`);
        grd.addColorStop(0.55, `hsl(${b.hue} 70% 58%)`);
        grd.addColorStop(1, `hsl(${b.hue} 65% 30%)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.shadowColor = `hsl(${b.hue} 90% 65% / .55)`;
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#0a080d";
        const size = Math.max(11, Math.min(16, b.r / 3.6));
        ctx.font = `600 ${size}px Geist, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const words = b.label.split(" ");
        if (words.length > 1 && ctx.measureText(b.label).width > b.r * 1.6) {
          const mid = Math.ceil(words.length / 2);
          ctx.fillText(words.slice(0, mid).join(" "), b.x, b.y - size * 0.6);
          ctx.fillText(words.slice(mid).join(" "), b.x, b.y + size * 0.6);
        } else {
          ctx.fillText(b.label, b.x, b.y);
        }
      }
    };

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const local = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => local(e);
    const onDown = (e: PointerEvent) => {
      local(e);
      pointer.grab = balls.findIndex((b) => Math.hypot(b.x - pointer.x, b.y - pointer.y) < b.r);
      if (pointer.grab >= 0) canvas.setPointerCapture(e.pointerId);
    };
    const onUp = () => {
      pointer.grab = -1;
    };
    const onLeave = () => {
      pointer.x = pointer.y = pointer.px = pointer.py = -999;
    };

    build();
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        if (!started) {
          started = true;
          build();
        }
        play();
      } else pause();
    });
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      if (started || reduced) build();
    });
    ro.observe(wrap);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [skills]);

  return (
    <div ref={wrapRef} className="skill-field">
      <canvas ref={canvasRef} aria-hidden="true" />
      <ul className="sr-only">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
