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

/* ── Paragraph whose words ink in one by one as it scrolls through the view. ── */
export function ScrollInk({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".ink-word"));
    if (reduced) {
      spans.forEach((s) => s.classList.add("is-inked"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)));
      const count = Math.round(progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle("is-inked", i < count));
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
  }, [reduced, text]);
  return (
    <p ref={ref} className={`scroll-ink ${className}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="ink-word">{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

/* ── Exposes how far an element has scrolled through the view as --p (0 → 1). ── */
export function ScrollProgressVar({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.6 - rect.top) / rect.height));
      el.style.setProperty("--p", p.toFixed(4));
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
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ── Custom cursor: a dot plus a trailing ring that grows over links (fine pointers only). ── */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    let tx = -100;
    let ty = -100;
    let x = tx;
    let y = ty;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      const target = e.target as Element | null;
      const hot = target?.closest("a, button, [role='tab'], input, textarea, label, .cursor-grow");
      ring.classList.toggle("is-hot", !!hot);
      dot.classList.add("is-on");
      ring.classList.add("is-on");
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      dot.classList.remove("is-on");
      ring.classList.remove("is-on");
    };
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);
  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/* ── Brief intro loader: a counting pill over a marquee of roles. Skippable, and
      skipped entirely for reduced motion, so it never blocks reading for long. ── */
export function Loader({ words }: { words: string[] }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    document.documentElement.classList.add("is-loading");
    let raf = 0;
    const start = performance.now();
    const total = 1500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setPct(Math.round(100 * (1 - Math.pow(1 - t, 2))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);
  useEffect(() => {
    if (!done) return;
    document.documentElement.classList.remove("is-loading");
    const id = window.setTimeout(() => setGone(true), 900);
    return () => window.clearTimeout(id);
  }, [done]);
  if (gone) return null;
  return (
    <div
      className={`loader ${done ? "is-done" : ""}`}
      aria-hidden="true"
      onClick={() => setDone(true)}
    >
      <div className="loader-marquee">
        <div className="loader-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {words.map((w) => (
                <Fragment key={w}>
                  {w}
                  <i>•</i>
                </Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="loader-pill">
        <span>Loading</span>
        <b>{pct}%</b>
      </div>
    </div>
  );
}

/* ── Pins a section and turns vertical scroll into horizontal travel of its track. ── */
export function HorizontalPin({ children, label }: { children: ReactNode; label: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;
    const wide = window.matchMedia("(min-width: 861px)");
    let distance = 0;
    let raf = 0;
    const measure = () => {
      if (reduced || !wide.matches) {
        setHeight(null);
        track.style.transform = "";
        distance = 0;
        return;
      }
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      setHeight(distance + window.innerHeight);
    };
    const update = () => {
      raf = 0;
      if (!distance) return;
      const top = outer.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / distance));
      track.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
      outer.style.setProperty("--hp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
  return (
    <div
      ref={outerRef}
      className={`hpin ${height ? "is-pinned" : ""}`}
      style={height ? { height } : undefined}
    >
      <div className="hpin-sticky">
        <div ref={trackRef} className="hpin-track" role="list" aria-label={label}>
          {children}
        </div>
        <div className="hpin-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
