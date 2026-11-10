import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  Plus,
  Minus,
  Check,
  Copy,
  Mail,
  MapPin,
  Clock,
  Search,
  Calculator,
  Wallet,
  Building2,
  ScanText,
  Car,
  Printer,
  Globe,
  Terminal,
  Monitor,
  Command,
  Cpu,
  Sparkles,
  Shield,
  FileSpreadsheet,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AqarDemo,
  AutoKidDemo,
  ChequeDemo,
  ExtractorDemo,
  FinoraDemo,
  MyMoneyDemo,
  SiteDemo,
} from "@/components/portfolio/demos";

const EMAIL = "ajmalshajahan@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ajmal Khan — accountant in Dubai who builds his own tools" },
      {
        name: "description",
        content:
          "Ajmal Khan: accountant in Dubai and quiet builder. Try live demos of Finora, MyMoney, AqarBooks, the Tax Invoice Extractor and more, right on the page.",
      },
      { property: "og:title", content: "Ajmal Khan — accountant. Learner. Builder." },
      {
        property: "og:description",
        content:
          "Accounting, personal finance and real estate software, built quietly in Dubai. Every project has a live demo you can play with.",
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

type Project = {
  id: string;
  name: string;
  kind: string;
  icon: ComponentType<{ size?: number }>;
  summary: string;
  stack: string[];
  href?: string;
  linkLabel?: string;
  demo: ComponentType;
};

const projects: [Project, ...Project[]] = [
  {
    id: "finora",
    name: "Finora",
    kind: "Accounting software",
    icon: Landmark,
    demo: FinoraDemo,
    summary:
      "Everyday books for small businesses in the UAE: sales, purchases, VAT and reports, kept in balance without the late evenings. Post an entry below and watch the trial balance hold.",
    stack: ["Ledgers", "VAT", "Invoices", "Reports"],
    href: "https://finora-demo.akbuilts.com",
    linkLabel: "Open the Finora demo",
  },
  {
    id: "mymoney",
    name: "MyMoney",
    kind: "Personal finance tracker",
    icon: Wallet,
    demo: MyMoneyDemo,
    summary:
      "A personal finance tracker for the money that never makes it into a ledger: groceries, taxis, bills, the karak on the way home. Log an expense and see what’s left of the month.",
    stack: ["Expenses", "Budgets", "Categories", "Monthly view"],
    href: "https://mymoney.akbuilts.com",
    linkLabel: "Open MyMoney",
  },
  {
    id: "aqarbooks",
    name: "AqarBooks",
    kind: "Real estate software",
    icon: Building2,
    demo: AqarDemo,
    summary:
      "Units, tenants, rent and cheques in one register, so nothing slips through the month. Mark a cheque as cleared and the collections update.",
    stack: ["Property", "Rent", "Tenants", "Cheques"],
    href: "https://aqarbooks.akbuilts.com",
    linkLabel: "Open AqarBooks",
  },
  {
    id: "extractor",
    name: "Tax Invoice Extractor",
    kind: "Productivity tool",
    icon: ScanText,
    demo: ExtractorDemo,
    summary:
      "Pulls supplier, TRN, totals and VAT from invoice PDFs and photos, turning an afternoon of typing into a few clicks. Run it on the sample invoice.",
    stack: ["Python", "Automation", "AI"],
    href: "https://extractor.akbuilts.com",
    linkLabel: "Open the Extractor",
  },
  {
    id: "autokid",
    name: "AutoKid",
    kind: "Learning & play",
    icon: Car,
    demo: AutoKidDemo,
    summary:
      "A little world of vehicles for little learners. Children tap, hear and learn the names of the things that drive past their window.",
    stack: ["Education", "Web app"],
    href: "https://autokid.akbuilts.com",
    linkLabel: "Open AutoKid",
  },
  {
    id: "cheque",
    name: "Cheque Printing Format",
    kind: "Office tool",
    icon: Printer,
    demo: ChequeDemo,
    summary:
      "Cheque layouts that print right the first time, with the amount written out in words. Type an amount and watch it fill in.",
    stack: ["Windows", "Office tools", "Automation"],
  },
  {
    id: "akbuilts",
    name: "akbuilts.com",
    kind: "This website",
    icon: Globe,
    demo: SiteDemo,
    summary: "This quiet corner of the internet, built to be myself.",
    stack: ["React", "TanStack", "Tailwind"],
    href: "https://akbuilts.com",
    linkLabel: "You’re here",
  },
];

const tapeStart = [
  { label: "Years in accounting, Dubai", value: "5" },
  { label: "Tools & products built", value: String(projects.length) },
  { label: "Industries served", value: "2" },
  { label: "Hours spent on social media", value: "0" },
];

const worlds = [
  { label: "Python", icon: Terminal },
  { label: "Linux & Ubuntu", icon: Monitor },
  { label: "Windows", icon: Command },
  { label: "Ledgers & VAT", icon: Calculator },
  { label: "Spreadsheets", icon: FileSpreadsheet },
  { label: "Automation", icon: Cpu },
  { label: "AI-assisted building", icon: Sparkles },
  { label: "Security basics", icon: Shield },
];

const toolkit = [
  {
    group: "Numbers",
    items: [
      ["Accounting systems", "Ledgers, VAT, invoices and the daily rhythm of books"],
      ["Spreadsheets & reports", "Data made readable, reports made in minutes"],
      ["Personal finance", "Budgets and tracking for the money outside the office"],
    ],
  },
  {
    group: "Code",
    items: [
      ["Python", "Scripts, automation and useful little utilities"],
      ["Web building", "Simple ideas turned into useful pages and apps"],
      ["AI-assisted building", "A quiet partner in learning and making"],
    ],
  },
  {
    group: "Systems",
    items: [
      ["Linux & Ubuntu", "Command lines, servers and everyday exploration"],
      ["Windows", "Office workflows and hands-on problem solving"],
      ["Ethical hacking", "A beginner’s curiosity about security and privacy"],
    ],
  },
];

const sections = [
  ["About", "about"],
  ["Work", "work"],
  ["Toolkit", "toolkit"],
  ["Contact", "contact"],
] as const;

/* ───────────────────────── Shared bits ───────────────────────── */

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
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
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
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
  return <time>{time}</time>;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ───────────────────────── Page ───────────────────────── */

function Index() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState(projects[0].id);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openProject(id: string) {
    setActive(id);
    scrollToId("work");
  }

  return (
    <div className="portfolio">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header onSearch={() => setPaletteOpen(true)} />
      <main id="main">
        <Hero onProject={openProject} />
        <About />
        <Work active={active} setActive={setActive} />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
      <Palette open={paletteOpen} setOpen={setPaletteOpen} onProject={openProject} />
    </div>
  );
}

function Header({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="page-width header-inner">
        <a href="#" className="wordmark" aria-label="akbuilts, back to top">
          akbuilts<span>.</span>
        </a>
        <nav aria-label="Main" className="desktop-nav">
          {sections.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-side">
          <span className="header-time">
            <Clock size={14} /> Dubai <DubaiTime />
          </span>
          <button
            type="button"
            className="search-trigger"
            onClick={onSearch}
            aria-label="Search the site (Ctrl or Command + K)"
          >
            <Search size={15} />
            <span>Jump to…</span>
            <kbd>⌘K</kbd>
          </button>
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
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile">
          {sections.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* Hero — an adding-machine tape that prints who I am. Visitors can add lines to it. */
function Hero({ onProject }: { onProject: (id: string) => void }) {
  const [added, setAdded] = useState<string[]>([]);
  const toggle = (label: string) =>
    setAdded((list) => (list.includes(label) ? list.filter((l) => l !== label) : [...list, label]));
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="page-width hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="live-dot" /> Accountant by day. Builder by curiosity.
          </p>
          <h1 id="hero-title">
            Ajmal
            <br />
            Khan
          </h1>
          <p className="hero-lede">
            Five years keeping books in Dubai taught me where the work gets slow. So I build the
            tools that make it lighter — accounting, personal finance, real estate, and the small
            things in between.
          </p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => scrollToId("work")}>
              Try the live demos
            </Button>
            <Button size="lg" variant="outline" onClick={() => onProject("mymoney")}>
              <Wallet /> New: MyMoney
            </Button>
          </div>
          <div className="hero-portrait">
            <img
              src="/ajmal-profile.jpg"
              alt="Ajmal Khan"
              width={1024}
              height={1024}
              fetchPriority="high"
            />
            <p>
              Not just an accountant.
              <br />
              <strong>A learner. A builder. Me.</strong>
            </p>
          </div>
        </div>

        <div className="tape-wrap">
          <div
            className="tape"
            role="log"
            aria-label="A running tape of who I am"
            aria-live="polite"
          >
            <div className="tape-roll">
              <p className="tape-head">
                akbuilts — balance of me
                <br />
                <span>Dubai, UAE</span>
              </p>
              {tapeStart.map((row, i) => (
                <p
                  key={row.label}
                  className="tape-row is-intro"
                  style={{ animationDelay: `${0.35 + i * 0.28}s` }}
                >
                  <span>{row.label}</span>
                  <b>{row.value}</b>
                </p>
              ))}
              {added.map((label) => (
                <p key={label} className="tape-row is-added">
                  <span>+ {label}</span>
                  <b>1</b>
                </p>
              ))}
              <p className="tape-rule" style={{ animationDelay: "1.55s" }} />
              <p className="tape-row tape-total" style={{ animationDelay: "1.75s" }}>
                <span>Worlds explored</span>
                <b>{added.length ? `${added.length} + ∞` : "∞"}</b>
              </p>
              <p className="tape-row tape-total" style={{ animationDelay: "1.95s" }}>
                <span>Balance</span>
                <b>Still becoming</b>
              </p>
            </div>
          </div>
          <div className="tape-keys">
            <p>Add to the tape — the worlds I’ve wandered into:</p>
            <div className="keys">
              {worlds.map((w) => (
                <button
                  key={w.label}
                  type="button"
                  className="key"
                  aria-pressed={added.includes(w.label)}
                  onClick={() => toggle(w.label)}
                >
                  <w.icon size={15} /> {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="about" className="section about">
      <div className="page-width about-grid">
        <Reveal className="about-title">
          <h2>There’s more than one side to my ledger.</h2>
          <dl className="about-facts">
            <div>
              <dt>
                <MapPin size={14} /> Based in
              </dt>
              <dd>Dubai, UAE</dd>
            </div>
            <div>
              <dt>
                <Calculator size={14} /> Day job
              </dt>
              <dd>Accountant, 5 years</dd>
            </div>
            <div>
              <dt>
                <Sparkles size={14} /> Current balance
              </dt>
              <dd>Still becoming</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal className="about-story">
          <p className="story-open">
            If you came here looking for just an accountant… you may not fully find me.
          </p>
          <p>
            Yes, I have spent five years working as an accountant in Dubai. Numbers, reports and
            responsibilities — I know them well. But this page is not about my profession. This is
            about me, the inner me.
          </p>
          <p>
            I am a learner in a world that never stops changing. I watch, I absorb, I recreate — and
            sometimes, I improve. Some may call it copying. I call it evolving.
          </p>
          {expanded && (
            <div id="full-story" className="story-more">
              <p>
                In a time where technology shifts every day, I believe the real skill is not in
                knowing one thing deeply, but in being willing to learn anything quickly.
              </p>
              <p>
                I have touched many worlds — Python, Linux, Windows, Ubuntu, a little ethical
                hacking, building websites, and creating small tools that make work lighter.
              </p>
              <p>
                I do not enjoy the noise of social media. I do not wish to live in front of cameras
                or create videos. I prefer to stay behind the scenes — quietly simplifying,
                improving and building.
              </p>
              <p>
                This is not a professional profile. This is simply me… still learning, still
                adapting, still becoming.
              </p>
            </div>
          )}
          <button
            type="button"
            className="story-toggle"
            aria-expanded={expanded}
            aria-controls="full-story"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <Minus size={16} /> : <Plus size={16} />}
            {expanded ? "Show less" : "Read the rest"}
          </button>
          <p className="signature">
            Quietly learning. Always becoming.<span>— Ajmal</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* Work — a workbench: pick a project on the left, use it on the right. */
function Work({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  const project = projects.find((p) => p.id === active) ?? projects[0];
  const listRef = useRef<HTMLDivElement>(null);
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = projects.findIndex((p) => p.id === active);
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? i + 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? i - 1
          : null;
    if (next === null) return;
    e.preventDefault();
    const target = projects[(next + projects.length) % projects.length]!;
    setActive(target.id);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-id="${target.id}"]`)?.focus();
  }
  return (
    <section id="work" className="section work">
      <div className="page-width">
        <Reveal className="section-head">
          <h2>Things I’ve made. Go ahead, use them.</h2>
          <p>
            Every project below has a working demo. Pick one, click around, then open the real
            thing.
          </p>
        </Reveal>
        <div className="bench">
          <div
            className="bench-list"
            role="tablist"
            aria-label="Projects"
            aria-orientation="vertical"
            ref={listRef}
            onKeyDown={onKeyDown}
          >
            {projects.map((p) => (
              <button
                key={p.id}
                data-id={p.id}
                type="button"
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={p.id === active}
                aria-controls="bench-panel"
                tabIndex={p.id === active ? 0 : -1}
                className="bench-tab"
                onClick={() => setActive(p.id)}
              >
                <p.icon size={18} />
                <span>
                  <b>{p.name}</b>
                  <small>{p.kind}</small>
                </span>
                {p.id === "mymoney" && <em>New</em>}
              </button>
            ))}
          </div>
          <article
            id="bench-panel"
            role="tabpanel"
            aria-labelledby={`tab-${project.id}`}
            className="bench-panel"
            key={project.id}
          >
            <header className="panel-head">
              <div>
                <p className="panel-kind">{project.kind}</p>
                <h3>{project.name}</h3>
              </div>
              {project.href && project.id !== "akbuilts" ? (
                <Button asChild>
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    {project.linkLabel}
                    <ArrowUpRight />
                  </a>
                </Button>
              ) : project.id === "cheque" ? (
                <Button variant="outline" onClick={() => scrollToId("contact")}>
                  Ask me about it
                </Button>
              ) : null}
            </header>
            <p className="panel-summary">{project.summary}</p>
            <ul className="panel-stack" aria-label="Built with">
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="panel-demo">
              <project.demo />
            </div>
            {project.href && project.id !== "akbuilts" && (
              <p className="panel-url">
                <Globe size={13} /> {project.href.replace("https://", "")}
              </p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section id="toolkit" className="section toolkit">
      <div className="page-width">
        <Reveal className="section-head">
          <h2>Curiosity doesn’t stay in one lane.</h2>
          <p>
            No expert labels, no progress bars. Just the worlds I’ve touched and keep exploring.
          </p>
        </Reveal>
        <div className="toolkit-grid">
          {toolkit.map((g) => (
            <Reveal key={g.group} className="toolkit-col">
              <h3>{g.group}</h3>
              <ul>
                {g.items.map(([name, detail]) => (
                  <li key={name}>
                    <b>{name}</b>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <p className="toolkit-note">The most useful skill? Being willing to learn the next one.</p>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [prepared, setPrepared] = useState(false);
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
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Hello Ajmal — from ${name}`)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }
  return (
    <section id="contact" className="section contact">
      <div className="page-width contact-grid">
        <Reveal>
          <h2>Have a thought? Say hello.</h2>
          <p className="contact-lede">
            I stay away from the social noise. But a good email is always welcome, and I usually
            reply within a day.
          </p>
          <div className="email-row">
            <Mail size={18} />
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyEmail}
              aria-label={copied ? "Email copied" : "Copy email address"}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          <p role="status" className="copy-status">
            {copied
              ? "Email copied."
              : copyFailed
                ? "Copying didn’t work here. Select the address above and copy it."
                : ""}
          </p>
          <p className="contact-place">
            <MapPin size={15} /> Dubai, UAE
          </p>
        </Reveal>
        <Reveal>
          <form onSubmit={sendMessage} className="contact-form">
            <div className="form-pair">
              <label>
                Your name
                <input
                  name="name"
                  placeholder="What should I call you?"
                  required
                  autoComplete="name"
                />
              </label>
              <label>
                Your email
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </label>
            </div>
            <label>
              Message
              <textarea
                name="message"
                placeholder="An idea, a question, or just a hello…"
                rows={5}
                required
              />
            </label>
            <Button type="submit" size="lg">
              Write the email
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
      <div className="page-width footer-inner">
        <a href="#" className="wordmark">
          akbuilts<span>.</span>
        </a>
        <p>© {new Date().getFullYear()} Ajmal Khan. Built quietly, with curiosity.</p>
        <a href="#" className="back-top">
          Back to top
        </a>
      </div>
    </footer>
  );
}

function Palette({
  open,
  setOpen,
  onProject,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  onProject: (id: string) => void;
}) {
  const run = (fn: () => void) => {
    setOpen(false);
    window.setTimeout(fn, 60);
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search projects, sections, actions…" />
      <CommandList>
        <CommandEmpty>Nothing matches that. Try “Finora” or “contact”.</CommandEmpty>
        <CommandGroup heading="Try a demo">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`demo ${p.name} ${p.kind}`}
              onSelect={() => run(() => onProject(p.id))}
            >
              <p.icon size={16} /> {p.name}
              <span className="cmd-hint">{p.kind}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Open live">
          {projects
            .filter((p) => p.href && p.id !== "akbuilts")
            .map((p) => (
              <CommandItem
                key={p.id}
                value={`open ${p.name} ${p.href}`}
                onSelect={() => run(() => window.open(p.href, "_blank", "noopener"))}
              >
                <ArrowUpRight size={16} /> {p.href!.replace("https://", "")}
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandGroup heading="Go to">
          {sections.map(([label, id]) => (
            <CommandItem key={id} value={`go ${label}`} onSelect={() => run(() => scrollToId(id))}>
              {label}
            </CommandItem>
          ))}
          <CommandItem
            value="copy email address"
            onSelect={() =>
              run(() => {
                void navigator.clipboard?.writeText(EMAIL);
              })
            }
          >
            <Copy size={16} /> Copy email address
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
