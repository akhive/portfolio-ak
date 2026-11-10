import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  Building2,
  Calculator,
  Car,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Globe,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Printer,
  ScanText,
  Send,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CountUp,
  Cursor,
  HorizontalPin,
  Loader,
  Magnetic,
  Marquee,
  ScrollProgress,
  ScrollProgressVar,
  SplitLetters,
  SplitWords,
  Tilt,
  useActiveSection,
} from "@/components/portfolio/motion";
import { SkillField } from "@/components/portfolio/skill-field";

const EMAIL = "ajmalshajahan@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ajmal Khan — accountant, learner, builder · Dubai" },
      {
        name: "description",
        content:
          "The personal portfolio of Ajmal Khan: five years as an accountant in Dubai, and a quiet learner and builder beyond the ledger.",
      },
      { property: "og:title", content: "Ajmal Khan — accountant. Learner. Builder." },
      {
        property: "og:description",
        content:
          "Not just an accountant. A learner in a world that never stops changing — still learning, still adapting, still becoming.",
      },
      { property: "og:url", content: "https://akbuilts.com" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://akbuilts.com" }],
  }),
  component: Index,
});

/* ───────────────────────── Content ───────────────────────── */

const sections = [
  ["About", "about"],
  ["Work", "work"],
  ["Contact", "contact"],
] as const;
const sectionIds = ["about", "career", "work", "stack", "contact"];

const roles = ["Accountant", "Learner", "Builder", "Explorer"];

const services = [
  {
    title: "Accounting",
    sub: "Books, VAT and reports, kept in balance",
    body: "Five years of day-to-day accounting in Dubai: ledgers, VAT returns, reconciliations and month-end reports. Precise, patient, and dependable with responsibility.",
    tags: ["Bookkeeping", "UAE VAT", "Reporting", "Spreadsheets"],
    icon: Calculator,
  },
  {
    title: "Building",
    sub: "Small tools that make work lighter",
    body: "Websites and practical utilities built with Python and AI-assisted development — accounting, personal finance, real estate, invoice extraction and more.",
    tags: ["Python", "Web apps", "Automation", "AI-assisted"],
    icon: Code2,
  },
];

const career = [
  {
    when: "Now",
    title: "Learning Something New",
    where: "Always",
    body: "Still learning, still adapting, still becoming. Exploring whatever the next useful thing turns out to be.",
  },
  {
    when: "Builder",
    title: "Tools & Websites",
    where: "Self-taught",
    body: "Turning everyday accounting friction into small tools and websites — Finora, MyMoney, AqarBooks and more, built quietly with the help of AI.",
  },
  {
    when: "5 yrs",
    title: "Accountant",
    where: "Dubai, UAE",
    body: "Five years of numbers, reports and responsibilities. The job that taught me precision — and showed me exactly where work gets slow.",
  },
  {
    when: "Curious",
    title: "Exploring Systems",
    where: "Python · Linux · Windows",
    body: "Python, Linux, Ubuntu, Windows and a beginner’s look at ethical hacking. I watch, I absorb, I recreate — and sometimes, I improve.",
  },
];

type Project = {
  name: string;
  kind: string;
  tools: string;
  line: string;
  icon: typeof Globe;
  href?: string;
};

const projects: Project[] = [
  {
    name: "Finora",
    kind: "Accounting",
    tools: "Ledgers, VAT, Invoices, Reports",
    line: "Everyday books for small UAE businesses, kept in balance without the late evenings.",
    icon: Landmark,
    href: "https://finora-demo.akbuilts.com",
  },
  {
    name: "MyMoney",
    kind: "Personal finance",
    tools: "Expenses, Budgets, Categories",
    line: "A tracker for the money that never makes it into a ledger.",
    icon: Wallet,
    href: "https://mymoney.akbuilts.com",
  },
  {
    name: "AqarBooks",
    kind: "Real estate",
    tools: "Units, Tenants, Rent, Cheques",
    line: "Units, tenants, rent and cheques in one register, so nothing slips through the month.",
    icon: Building2,
    href: "https://aqarbooks.akbuilts.com",
  },
  {
    name: "Tax Invoice Extractor",
    kind: "Python / AI",
    tools: "Python, Automation, AI",
    line: "Pulls supplier, TRN, totals and VAT out of invoice PDFs and photos.",
    icon: ScanText,
    href: "https://extractor.akbuilts.com",
  },
  {
    name: "AutoKid",
    kind: "Learning & play",
    tools: "Web app, Education",
    line: "A little world of vehicles for little learners to tap, hear and name.",
    icon: Car,
    href: "https://autokid.akbuilts.com",
  },
  {
    name: "Cheque Printing",
    kind: "Office tool",
    tools: "Windows, Office, Automation",
    line: "Cheque layouts that print right the first time, amount in words included.",
    icon: Printer,
  },
];

const stack = [
  "Accounting",
  "UAE VAT",
  "Excel",
  "Python",
  "Linux",
  "Ubuntu",
  "Windows",
  "HTML & CSS",
  "React",
  "Automation",
  "AI tools",
  "Security basics",
];

/* ───────────────────────── Shared bits ───────────────────────── */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? ({ transitionDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

function DubaiTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Dubai",
      }).format(new Date());
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return <time>{time || "--:--"}</time>;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Roles that roll in and out vertically. */
function RoleRoll() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), 2400);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="role-roll" aria-label={roles.join(", ")}>
      {roles.map((r, n) => (
        <span
          key={r}
          aria-hidden="true"
          className={
            n === i ? "is-in" : n === (i - 1 + roles.length) % roles.length ? "is-out" : ""
          }
        >
          {r}
        </span>
      ))}
    </span>
  );
}

/* ───────────────────────── Page ───────────────────────── */

function Index() {
  return (
    <div className="portfolio">
      <Loader words={["Accountant", "Learner", "Builder", "Dubai"]} />
      <Cursor />
      <div className="edge-glow edge-glow-tl" aria-hidden="true" />
      <div className="edge-glow edge-glow-r" aria-hidden="true" />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <aside className="side-rail" aria-label="Quick contact">
        <a href={`mailto:${EMAIL}`} aria-label="Email Ajmal">
          <Mail size={20} />
        </a>
        <span className="side-rail-line" aria-hidden="true" />
      </aside>
      <p className="corner-clock">
        Dubai <DubaiTime />
      </p>
      <main id="main">
        <Hero />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const current = useActiveSection(sectionIds);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#" className="initials" aria-label="Ajmal Khan, back to top">
          AK
        </a>
        <a href={`mailto:${EMAIL}`} className="header-email">
          {EMAIL}
        </a>
        <nav aria-label="Main" className="desktop-nav">
          {sections.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={current === id ? "is-current" : ""}
              aria-current={current === id ? "location" : undefined}
            >
              <span data-text={label}>{label}</span>
            </a>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="mobile-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      <ScrollProgress />
      {open && (
        <nav className="mobile-nav" aria-label="Mobile">
          {sections.map(([label, id], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              style={{ "--i": i } as CSSProperties}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-left">
          <p className="hero-hello">Hello! I’m</p>
          <h1 id="hero-title" aria-label="Ajmal Khan">
            <SplitLetters text="AJMAL" delay={1.7} />
            <br />
            <SplitLetters text="KHAN" delay={1.95} />
          </h1>
        </div>
        <div className="hero-portrait">
          <div className="hero-halo" aria-hidden="true" />
          <img
            src="/ajmal-profile.jpg"
            alt="Ajmal Khan"
            width={1024}
            height={1024}
            fetchPriority="high"
          />
        </div>
        <div className="hero-right">
          <p className="hero-an">Dubai-based</p>
          <p className="hero-role">
            <RoleRoll />
          </p>
          <p className="hero-sub">…and still becoming.</p>
        </div>
      </div>
      <div className="hero-band">
        <Marquee label="What I am" speed={40}>
          {["Accountant", "Learner", "Builder", "Dubai", "Python", "Linux", "Still becoming"].map(
            (w) => (
              <span key={w} className="hero-band-word">
                {w}
                <i aria-hidden="true">•</i>
              </span>
            ),
          )}
        </Marquee>
      </div>
      <button type="button" className="scroll-hint" onClick={() => scrollToId("about")}>
        <span>Scroll</span>
        <ChevronDown size={16} />
      </button>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about">
      <div className="page-width about-grid">
        <Reveal className="about-visual">
          <Tilt className="about-photo" max={8}>
            <img src="/ajmal-profile.jpg" alt="" width={1024} height={1024} loading="lazy" />
            <span className="about-photo-glow" aria-hidden="true" />
          </Tilt>
        </Reveal>
        <div className="about-text">
          <p className="kicker">About me</p>
          <Reveal>
            <p className="about-lead">
              If you came here looking for just an accountant… you may not fully find me. I have
              spent five years as an accountant in Dubai — numbers, reports and responsibilities, I
              know them well. But I am also a learner in a world that never stops changing. I watch,
              I absorb, I recreate, and sometimes I improve. I prefer to stay behind the scenes,
              quietly simplifying, improving and building.
            </p>
          </Reveal>
          <dl className="about-stats">
            <div>
              <dd>
                <CountUp to={5} />
              </dd>
              <dt>years in accounting</dt>
            </div>
            <div>
              <dd>
                <CountUp to={projects.length} />
              </dd>
              <dt>tools & websites built</dt>
            </div>
            <div>
              <dd>
                <CountUp to={0} />
              </dd>
              <dt>hours on social media</dt>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function WhatIDo() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section what" aria-labelledby="what-title">
      <div className="page-width what-grid">
        <h2 id="what-title" className="what-title">
          <span>What</span>
          <span>I do</span>
        </h2>
        <div className="what-cards">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={s.title} delay={i * 0.12}>
                <article className={`what-card ${isOpen ? "is-open" : ""}`}>
                  <span className="corner tl" aria-hidden="true" />
                  <span className="corner tr" aria-hidden="true" />
                  <span className="corner bl" aria-hidden="true" />
                  <span className="corner br" aria-hidden="true" />
                  <button
                    type="button"
                    className="what-head"
                    aria-expanded={isOpen}
                    aria-controls={`what-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <s.icon size={22} className="what-icon" />
                    <span>
                      <b>{s.title}</b>
                      <small>{s.sub}</small>
                    </span>
                    <ChevronDown className="what-chev" size={20} />
                  </button>
                  <div id={`what-${i}`} className="what-body">
                    <div>
                      <p>{s.body}</p>
                      <ul>
                        {s.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Career() {
  return (
    <section id="career" className="section career" aria-labelledby="career-title">
      <div className="page-width">
        <h2 id="career-title" className="center-title">
          <SplitWords as="span" text="My journey &" />
          <SplitWords as="span" text="experience" className="is-violet" />
        </h2>
        <ScrollProgressVar className="career-list">
          <span className="career-line" aria-hidden="true">
            <span />
          </span>
          {career.map((c, i) => (
            <Reveal key={c.title} className="career-row" delay={i * 0.05}>
              <div className="career-role">
                <h3>{c.title}</h3>
                <p>{c.where}</p>
              </div>
              <p className="career-when">{c.when}</p>
              <span className="career-dot" aria-hidden="true" />
              <p className="career-body">{c.body}</p>
            </Reveal>
          ))}
        </ScrollProgressVar>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="page-width">
        <h2 id="work-title" className="work-title">
          <SplitWords as="span" text="My" />{" "}
          <SplitWords as="span" text="Work" className="is-violet" />
        </h2>
      </div>
      <HorizontalPin label="Projects">
        {projects.map((p, i) => (
          <article key={p.name} className="work-card" role="listitem">
            <header className="work-card-head">
              <span className="work-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="work-meta">
                <b>{p.name}</b>
                <small>{p.kind}</small>
              </span>
            </header>
            <p className="work-tools-label">Tools and features</p>
            <p className="work-tools">{p.tools}</p>
            <Tilt className="work-preview" max={6}>
              <span className="work-preview-grid" aria-hidden="true" />
              <p.icon size={44} />
              <b>{p.name}</b>
              <span>{p.line}</span>
            </Tilt>
            {p.href ? (
              <a className="work-link" href={p.href} target="_blank" rel="noopener noreferrer">
                Live demo <ArrowUpRight size={18} />
                <span className="sr-only"> of {p.name} (opens in a new tab)</span>
              </a>
            ) : (
              <button type="button" className="work-link" onClick={() => scrollToId("contact")}>
                Ask me about it <ArrowUpRight size={18} />
              </button>
            )}
          </article>
        ))}
        <div className="work-card work-more" role="listitem">
          <h3>Want to know more?</h3>
          <p>Every tool started as a problem at work. Ask me about any of them.</p>
          <Magnetic>
            <Button className="violet-btn" onClick={() => scrollToId("contact")}>
              Get in touch →
            </Button>
          </Magnetic>
        </div>
      </HorizontalPin>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" className="section stack" aria-labelledby="stack-title">
      <div className="page-width">
        <h2 id="stack-title" className="center-title stack-title">
          <SplitWords as="span" text="TOOLKIT" />
        </h2>
        <p className="stack-hint">Push them around — they don’t mind.</p>
        <SkillField skills={stack} />
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [flying, setFlying] = useState(false);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyFailed(true);
    }
  }
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name"));
    const body = `${String(data.get("message"))}\n\nFrom: ${name}\nEmail: ${String(data.get("email"))}`;
    setFlying(true);
    window.setTimeout(() => setFlying(false), 1400);
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Hello Ajmal — from ${name}`)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }
  return (
    <section id="contact" className="section contact">
      <div className="page-width contact-grid">
        <div>
          <h2 className="contact-title">
            <SplitWords as="span" text="Let’s" />
            <SplitWords as="span" text="talk." className="is-violet" />
          </h2>
          <p className="contact-lede">
            I stay away from the social noise, but a good email is always welcome. I usually reply
            within a day.
          </p>
          <div className="contact-lines">
            <p>
              <span>Email</span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <button
                type="button"
                className="copy-btn"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </p>
            <p>
              <span>Based in</span>
              <b>
                <MapPin size={15} /> Dubai, UAE
              </b>
            </p>
          </div>
          <p role="status" className="copy-status">
            {copied
              ? "Email copied."
              : copyFailed
                ? "Copying didn’t work here. Select the address above and copy it."
                : ""}
          </p>
        </div>
        <Reveal>
          <form onSubmit={sendMessage} className="contact-form">
            <label>
              <span>Your name</span>
              <input
                name="name"
                placeholder="What should I call you?"
                required
                autoComplete="name"
              />
            </label>
            <label>
              <span>Your email</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>
            <label>
              <span>Message</span>
              <textarea
                name="message"
                placeholder="An idea, a question, or just a hello…"
                rows={4}
                required
              />
            </label>
            <Button type="submit" className="violet-btn send-btn">
              Write the email
              <Send className={flying ? "plane is-flying" : "plane"} />
            </Button>
            <p role="status" className="form-status">
              {prepared
                ? "Your message is ready in your email app. Send it from there to reach me."
                : "This opens your email app with the message filled in."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width">
        <p className="footer-name" aria-hidden="true">
          AJMAL KHAN
        </p>
        <div className="footer-row">
          <p>
            Designed and built by <span>Ajmal Khan</span>
            <br />
            <small>© {new Date().getFullYear()} · Quietly learning. Always becoming.</small>
          </p>
          <a href="#" className="back-top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
