import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/* Motion primitives for the portfolio. Everything here respects
   prefers-reduced-motion: large movement stops, content stays readable. */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/* ── Floating ledger glyphs: a canvas of numbers and symbols drifting
      upward, pushed aside by the pointer and linked when close. ── */
const GLYPHS = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "7",
  "9",
  "+",
  "−",
  "=",
  "%",
  "∑",
  "Dr",
  "Cr",
  "AED",
  "÷",
  "×",
  "{ }",
  "</>",
  "$_",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  r: number;
  spin: number;
  g: string;
  hot: number;
};

export function GlyphField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let parts: Particle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let visible = true;

    const make = (anyY = true): Particle => ({
      x: Math.random() * w,
      y: anyY ? Math.random() * h : h + 30,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.15 + Math.random() * 0.45),
      z: 0.35 + Math.random() * 0.9,
      r: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.01,
      g: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!,
      hot: 0,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, Math.max(28, (w * h) / 16000)));
      parts = Array.from({ length: count }, () => make(true));
    };

    const draw = (step: boolean) => {
      const primary = css.getPropertyValue("--primary").trim() || "#f0544f";
      const fg = css.getPropertyValue("--muted-foreground").trim() || "#97a7bd";
      ctx.clearRect(0, 0, w, h);

      // links between near neighbours
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i]!;
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const alpha = (1 - Math.sqrt(d2) / 120) * 0.12 * Math.min(a.z, b.z);
            ctx.strokeStyle = fg;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of parts) {
        if (step) {
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < 150 && d > 0.01) {
              const f = (1 - d / 150) * 1.4;
              p.vx += (dx / d) * f * 0.35;
              p.vy += (dy / d) * f * 0.35;
              p.hot = 1;
            }
          }
          p.vx *= 0.96;
          p.vy = p.vy * 0.96 + -(0.2 * p.z) * 0.04;
          p.x += p.vx * p.z;
          p.y += p.vy * p.z;
          p.r += p.spin;
          p.hot *= 0.97;
          if (p.y < -40 || p.x < -60 || p.x > w + 60) Object.assign(p, make(false));
        }
        const size = 11 + p.z * 13;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.r) * 0.35);
        ctx.font = `500 ${size}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = 0.1 + p.z * 0.16 + p.hot * 0.5;
        ctx.fillStyle = p.hot > 0.15 ? primary : fg;
        ctx.fillText(p.g, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (visible && !document.hidden) draw(true);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y > -50 && mouse.y < h + 50;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
    });
    io.observe(canvas);

    if (reduced) {
      draw(false);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={`glyph-field ${className}`} aria-hidden="true" />;
}

/* ── Soft glow that trails the pointer across the page (fine pointers only). ── */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);
  return <div ref={ref} className="spotlight" aria-hidden="true" />;
}

/* ── Reading progress line under the header. ── */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

/* ── Letters that rise in one by one and bounce on hover. ── */
export function SplitLetters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="split-letters" aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="letter"
          style={{ "--i": i, "--d": `${delay}s` } as CSSProperties}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/* ── Headline whose words slide up into place when scrolled into view. ── */
export function SplitWords({
  text,
  as: Tag = "h2",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={`split-words ${seen ? "is-in" : ""} ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <span className="word" style={{ "--i": i } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ── A word that types itself, pauses, erases and moves to the next. ── */
export function TypeWords({ words }: { words: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(words[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
      return () => window.clearInterval(id);
    }
    const word = words[index] ?? "";
    let delay = deleting ? 38 : 75;
    if (!deleting && shown === word) delay = 1800;
    if (deleting && shown === "") delay = 250;
    const id = window.setTimeout(() => {
      if (!deleting && shown === word) setDeleting(true);
      else if (deleting && shown === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setShown(deleting ? word.slice(0, shown.length - 1) : word.slice(0, shown.length + 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [shown, deleting, index, words, reduced]);

  const text = reduced ? (words[index] ?? "") : shown;
  return (
    <span className="type-words">
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}

/* ── Endless ticker band; speeds up briefly while the page scrolls. ── */
export function Marquee({
  children,
  reverse = false,
  speed = 40,
  label,
}: {
  children: ReactNode;
  reverse?: boolean;
  speed?: number;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;
    let x = 0;
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    let hovering = false;
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    track.addEventListener("pointerenter", enter);
    track.addEventListener("pointerleave", leave);
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost = Math.min(12, boost * 0.92 + dy * 0.15);
      const half = track.scrollWidth / 2;
      const v = (hovering ? 0.25 : 1) * speed * (1 + boost);
      x = (x + v * dt) % half;
      track.style.transform = `translate3d(${reverse ? x - half : -x}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("pointerenter", enter);
      track.removeEventListener("pointerleave", leave);
    };
  }, [reduced, reverse, speed]);
  return (
    <div className="marquee" role="group" aria-label={label}>
      <div ref={trackRef} className="marquee-track">
        <div className="marquee-set">{children}</div>
        <div className="marquee-set" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Number that counts up once it scrolls into view. ── */
export function CountUp({
  to,
  suffix = "",
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.5);
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration, reduced]);
  return (
    <span ref={ref} className="count-up">
      {value}
      {suffix}
    </span>
  );
}

/* ── Card that tilts toward the pointer with a moving sheen. ── */
export function Tilt({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
        el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        el.classList.add("is-tilting");
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.classList.remove("is-tilting");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, max]);
  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}

/* ── Wrapper that pulls its child toward the pointer. ── */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, strength]);
  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}

/* ── Element that drifts slightly against the scroll for depth. ── */
export function Parallax({
  children,
  speed = 0.12,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${-center * speed}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, speed]);
  return (
    <div ref={ref} className={`parallax ${className}`}>
      {children}
    </div>
  );
}

/* ── Highlights the nav link of the section currently in view. ── */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
