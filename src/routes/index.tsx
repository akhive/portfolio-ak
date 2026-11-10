import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type FormEvent } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, Menu, X, Plus, Minus, Terminal, Globe, Cpu, Shield, Monitor, Sparkles, FileText, Check, Copy, Mail, MapPin, Calculator, FileSpreadsheet, Building2, KeyRound, Home, Clock, TrendingUp, Landmark, Zap, Blocks, Command, ScanText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import autoKidImage from '@/assets/autokid-vehicles.jpg';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Ajmal Khan — Behind the numbers. Beyond the ordinary.' },
      { name: 'description', content: 'Ajmal Khan: accountant in Dubai, curious learner, and quiet builder. Accounting and real estate software, everyday tools, and the person behind akbuilts.com.' },
      { property: 'og:title', content: 'Ajmal Khan — Accountant. Learner. Builder.' },
      { property: 'og:description', content: 'Behind the numbers, a curious mind. Accounting software, real estate software, and quiet little tools built by Ajmal Khan.' },
      { property: 'og:url', content: 'https://akbuilts.com' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://akbuilts.com' }],
  }),
  component: Index,
});

const navigation = [ ['About', '#about'], ['Skills', '#skills'], ['Projects', '#projects'], ['Contact', '#contact'] ];
const skills = [
  { icon: Terminal, title: 'Python', detail: 'Scripts, automation & useful little utilities', category: '01 / CODE' },
  { icon: Monitor, title: 'Linux & Ubuntu', detail: 'Command lines, systems & everyday exploration', category: '02 / SYSTEMS' },
  { icon: Command, title: 'Windows Systems', detail: 'Office workflows, tools & hands-on problem solving', category: '03 / WORKFLOW' },
  { icon: Globe, title: 'Web Building', detail: 'Simple ideas turned into useful digital spaces', category: '04 / CREATE' },
  { icon: Cpu, title: 'Automation & Tools', detail: 'Less repetitive work. More room to think.', category: '05 / SIMPLIFY' },
  { icon: Sparkles, title: 'AI-Assisted Building', detail: 'A quiet partner in learning and making', category: '06 / EXPLORE' },
  { icon: Shield, title: 'Ethical Hacking', detail: 'A beginner’s curiosity about security & privacy', category: '07 / DISCOVER' },
  { icon: Calculator, title: 'Accounting Systems', detail: 'Ledgers, VAT, invoices & the daily rhythm of books', category: '08 / LEDGERS' },
  { icon: FileSpreadsheet, title: 'Spreadsheets & Reports', detail: 'Data made readable. Reports made in minutes.', category: '09 / REPORTS' },
];
const ticker = [
  { label: 'Python', icon: Terminal },
  { label: 'Linux & Ubuntu', icon: Monitor },
  { label: 'Windows', icon: Command },
  { label: 'Spreadsheets', icon: FileSpreadsheet },
  { label: 'Ledgers & VAT', icon: Calculator },
  { label: 'Automation', icon: Zap },
  { label: 'AI assistance', icon: Sparkles },
  { label: 'Web tools', icon: Globe },
  { label: 'Security basics', icon: Shield },
  { label: 'Real estate books', icon: Building2 },
];
const stats = [
  { icon: Calculator, value: '05', detail: 'Years keeping books in Dubai' },
  { icon: Blocks, value: '06', detail: 'Tools & products built quietly' },
  { icon: Building2, value: '02', detail: 'Industries served — accounting & real estate' },
  { icon: Sparkles, value: '∞', detail: 'Things still left to learn' },
];

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { element.classList.add('is-visible'); observer.unobserve(element); }
    }, { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Index() {
  return <div className="portfolio"><Header /><main><Hero /><Ticker /><Stats /><About /><Projects /><Skills /><Contact /></main><Footer /></div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="page-width header-inner">
      <a href="#" aria-label="akbuilts home" className="wordmark">akbuilts<span className="text-primary">.</span><span className="wordmark-sub">BY AJMAL KHAN</span></a>
      <nav aria-label="Main navigation" className="desktop-nav">{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="header-side">
        <span className="header-clock"><Clock size={13} /> DUBAI <span id="dubai-time" /></span>
        <Button asChild variant="outline" className="header-contact"><a href="mailto:ajmalshajahan@gmail.com">Let’s talk <ArrowUpRight /></a></Button>
      </div>
      <Button variant="ghost" size="icon" className="mobile-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={20} /></a>)}</nav>}
  </header>;
}

function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-portrait"><img src="/ajmal-profile.jpg" alt="Ajmal Khan, with a world of numbers and code" width={1024} height={1024} fetchPriority="high" /><div className="portrait-shade" /></div>
    <div className="page-width hero-inner">
      <div className="hero-topline"><span className="status-dot" /><span>A CURIOUS MIND. ALWAYS IN PROGRESS.</span></div>
      <div className="hero-copy"><p className="hero-intro">Accountant by day. Builder by curiosity.</p>
        <h1 id="hero-title">Ajmal<br /><span>Khan<span className="text-primary">.</span></span></h1>
        <p className="hero-description">Behind the numbers,<br />there’s a lot more to the story.</p>
        <div className="hero-actions"><Button asChild size="lg"><a href="#projects">Explore my work <ArrowUpRight /></a></Button><a href="#about" className="text-link">Meet the person <ArrowRight size={17} /></a></div>
        <div className="hero-chips"><span><Zap size={13} /> Automation</span><span><Calculator size={13} /> Accounting software</span><span><Building2 size={13} /> Real estate software</span><span><ScanText size={13} /> Document tools</span></div>
      </div>
      <div className="photo-caption"><span className="caption-cross">+</span><span>NOT JUST AN ACCOUNTANT.<br /><strong>A LEARNER. A BUILDER. ME.</strong></span></div>
      <div className="hero-bottom"><a href="#about" className="scroll-link"><ArrowDown size={17} /> SCROLL TO DISCOVER</a><span className="location"><MapPin size={14} /> DUBAI, UAE <span className="text-primary">↗</span></span></div>
    </div>
  </section>;
}

function Ticker() {
  return <div className="ticker" aria-label="Tools and worlds I work with">
    <div className="ticker-track">{ticker.map(item => <span key={item.label} className="ticker-item"><item.icon size={15} /> {item.label}</span>)}</div>
    <div className="ticker-track" aria-hidden="true">{ticker.map(item => <span key={item.label} className="ticker-item"><item.icon size={15} /> {item.label}</span>)}</div>
  </div>;
}

function Stats() {
  return <section className="section stats-section" aria-label="A few numbers"><div className="page-width"><div className="stats">{stats.map(stat => <Reveal key={stat.detail}><div className="stat"><div className="stat-top"><span className="stat-index">{stat.value}</span><stat.icon size={20} /></div><p>{stat.detail}</p></div></Reveal>)}</div></div></section>;
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span className="text-primary">{number}</span><span>{children}</span><Plus size={15} /></div>;
}

function About() {
  const [expanded, setExpanded] = useState(false);
  return <section id="about" className="section about-section"><div className="page-width">
    <SectionLabel number="01">THE PERSON BEHIND THE NUMBERS</SectionLabel>
    <div className="about-grid"><Reveal><h2>There’s more<br />than one side<br />to my <span className="text-primary">ledger.</span></h2><p className="about-aside">Accountant by profession.<br />Learner by nature. Builder by choice.</p>
      <div className="identity-ledger"><div><span><MapPin size={12} /> BASED IN</span><strong>Dubai, UAE</strong></div><div><span><Clock size={12} /> EXPERIENCE</span><strong>5 years in accounting</strong></div><div><span><Sparkles size={12} /> CURRENT BALANCE</span><strong className="text-primary">Still becoming ↗</strong></div></div>
    </Reveal>
    <Reveal className="about-story"><p className="story-opening">If you came here looking for just an Accountant… you may not fully find me.</p>
      <p>Yes, I have spent five years working as an Accountant in Dubai. Numbers, reports, and responsibilities — I know them well.</p>
      <p>But this page is not about my profession.<br /><span className="text-foreground">This is about me. The inner me.</span></p>
      <p>I am a learner in a world that never stops changing. I watch, I absorb, I recreate — and sometimes, I improve. Some may call it copying. <span className="text-primary">I call it evolving.</span></p>
      {expanded && <div id="full-story" className="expanded-story"><p>In a time where technology shifts every day, I believe the real skill is not in knowing one thing deeply, but in being willing to learn anything quickly.</p><p>I have touched many worlds — Python, Linux, Windows, Ubuntu, a little ethical hacking, building websites, and creating small tools that make work lighter.</p><p>I do not enjoy the noise of social media. I do not wish to live in front of cameras or create videos. I prefer to stay behind the scenes — quietly simplifying, improving, and building.</p><p>This is not a professional profile. This is simply me… still learning, still adapting, still becoming.</p></div>}
      <Button variant="ghost" className="story-toggle" aria-expanded={expanded} aria-controls="full-story" onClick={() => setExpanded(!expanded)}>{expanded ? 'A little less' : 'A little more about me'}{expanded ? <Minus /> : <Plus />}</Button>
      <div className="story-signature">Quietly learning. Always becoming.<span>— Ajmal</span></div>
    </Reveal></div>
  </div></section>;
}

function InvoicePreview() {
  return <div className="invoice-preview" aria-hidden="true"><div className="preview-toolbar"><span><FileText size={15} /> invoice.pdf</span><span className="preview-status"><Check size={12} /> Extracted</span></div><div className="invoice-content"><div className="invoice-paper"><span className="mini-label">TAX INVOICE</span><div className="paper-line long" /><div className="paper-line" /><div className="paper-table">{Array.from({length: 4}, (_, i) => <div key={i}><span /><span /><span /></div>)}</div><div className="paper-line short" /></div><div className="extract-arrow"><ArrowRight /></div><div className="invoice-result"><span className="mini-label">STRUCTURED DATA</span><div><span>Document</span><strong>Tax invoice</strong></div><div><span>Fields</span><strong className="text-primary">Identified ✓</strong></div><div><span>Output</span><strong>Ready to use</strong></div><div className="result-footer"><Check size={12} /> Less typing. More doing.</div></div></div></div>;
}

function FinoraPreview() {
  const nav = ['Sales', 'Purchases', 'VAT', 'Expenses'];
  const bars = ['34%', '52%', '41%', '68%', '57%', '84%'];
  return <div className="app-preview" aria-hidden="true"><div className="preview-toolbar"><span><Landmark size={15} /> finora — books</span><span className="preview-status"><Check size={12} /> Balanced</span></div><div className="app-content"><div className="app-side"><span className="mini-label">LEDGER</span>{nav.map((row, i) => <span key={row} className={`app-nav${i === 0 ? ' is-active' : ''}`}><i />{row}</span>)}</div><div className="app-main"><div className="app-kpis"><div><span>IN</span><strong>42,800</strong></div><div><span>OUT</span><strong>18,240</strong></div><div><span>NET</span><strong className="text-primary">24,560</strong></div></div><div className="app-chart">{bars.map((h, i) => <i key={i} style={{ '--h': h } as CSSProperties} />)}</div><div className="app-foot"><TrendingUp size={12} /> Books closed in minutes, not evenings.</div></div></div></div>;
}

function AqarPreview() {
  const skyline = ['46%', '72%', '58%', '88%', '64%', '80%', '52%'];
  const units = [
    { unit: 'A-101', detail: 'Rent · AED 4,200', paid: true },
    { unit: 'B-204', detail: 'Rent · AED 3,600', paid: false },
    { unit: 'C-307', detail: 'Rent · AED 5,100', paid: true },
  ];
  return <div className="estate-preview" aria-hidden="true"><div className="estate-head"><span><Building2 size={15} /> aqarbooks</span><span>rent register</span></div><div className="estate-body"><div className="estate-skyline">{skyline.map((h, i) => <i key={i} style={{ '--h': h } as CSSProperties} />)}</div><div className="estate-rows">{units.map(u => <div key={u.unit} className="estate-row"><span className="estate-unit"><Home size={11} /> {u.unit}</span><span className="estate-detail">{u.detail}</span><span className={`estate-chip ${u.paid ? 'is-paid' : 'is-due'}`}>{u.paid ? <Check size={10} /> : <Clock size={10} />}{u.paid ? 'Paid' : 'Due'}</span></div>)}</div><div className="estate-foot"><KeyRound size={12} /> Every unit, tenant and cheque in one book.</div></div></div>;
}

function Projects() {
  return <section id="projects" className="section projects-section"><div className="page-width"><SectionLabel number="02">A FEW THINGS I’VE MADE</SectionLabel>
    <Reveal className="section-heading"><h2>Small ideas.<br /><span className="text-muted-foreground">Real-world purpose.</span></h2><p>Not built to make noise.<br />Built to make something a little better.</p></Reveal>
    <div className="project-grid">
      <Reveal><article className="project"><div className="project-visual invoice-visual"><span className="visual-label">LESS MANUAL WORK. MORE MOMENTUM.</span><InvoicePreview /></div><div className="project-meta"><span><ScanText size={11} /> 01 / PRODUCTIVITY</span><span>PYTHON · AUTOMATION · AI</span></div><h3>Tax Invoice Extractor</h3><p>A practical tool that pulls text from documents and images, turning repetitive manual work into a few quick clicks.</p><Button asChild variant="link" className="project-link"><a href="https://extractor.akbuilts.com" target="_blank" rel="noopener noreferrer">View Project <ArrowUpRight /></a></Button></article></Reveal>
      <Reveal><article className="project"><div className="project-visual autokid-visual"><img src={autoKidImage} alt="Playful toy car, bus and scooter for AutoKid vehicle learning" width={1536} height={1024} loading="lazy" /><span className="autokid-label">AutoKid<span>Little minds. Big discoveries.</span></span></div><div className="project-meta"><span><Sparkles size={11} /> 02 / LEARNING & PLAY</span><span>EDUCATION · WEB TOOL</span></div><h3>AutoKid</h3><p>A little world of vehicles for little learners. A playful tool that helps children discover and learn vehicle names.</p><Button asChild variant="link" className="project-link"><a href="https://autokid.akbuilts.com" target="_blank" rel="noopener noreferrer">View Project <ArrowUpRight /></a></Button></article></Reveal>
      <Reveal><article className="project"><div className="project-visual app-visual"><span className="visual-label">BOOKS THAT BALANCE THEMSELVES.</span><FinoraPreview /></div><div className="project-meta"><span><Calculator size={11} /> 03 / ACCOUNTING SOFTWARE</span><span>LEDGERS · VAT · INVOICES · REPORTS</span></div><h3>Finora</h3><p>Accounting software for the everyday books — sales, purchases, VAT and reports, kept tidy without the late evenings.</p><Button asChild variant="link" className="project-link"><a href="https://finora.akbuilts.com" target="_blank" rel="noopener noreferrer">View Project <ArrowUpRight /></a></Button></article></Reveal>
      <Reveal><article className="project"><div className="project-visual estate-visual"><span className="visual-label">ONE BOOK FOR EVERY UNIT.</span><AqarPreview /></div><div className="project-meta"><span><Building2 size={11} /> 04 / REAL ESTATE SOFTWARE</span><span>PROPERTY · RENT · TENANTS · CHEQUES</span></div><h3>AqarBooks</h3><p>Real estate software that keeps units, tenants, rent and cheques in one quiet register — nothing slips through the month.</p><Button asChild variant="link" className="project-link"><a href="https://aqarbooks.akbuilts.com" target="_blank" rel="noopener noreferrer">View Project <ArrowUpRight /></a></Button></article></Reveal>
    </div>
    <Reveal className="other-projects"><article><span className="text-primary">05</span><div><h3>Cheque Printing Format</h3><p>Thoughtful cheque layouts. Smoother payment workflows.</p><span className="small-tags"><PrinterIcon /> WINDOWS / OFFICE TOOLS / AUTOMATION</span></div><Button asChild variant="ghost" size="icon"><a href="#contact" aria-label="View Project: Cheque Printing Format"><ArrowUpRight /></a></Button></article><article><span className="text-primary">06</span><div><h3>akbuilts.com</h3><p>This quiet corner of the internet. Built to be myself.</p><span className="small-tags"><Globe size={9} /> REACT / TAILWIND / TANSTACK</span></div><Button asChild variant="ghost" size="icon"><a href="https://akbuilts.com" target="_blank" rel="noopener noreferrer" aria-label="View Project: akbuilts.com"><ArrowUpRight /></a></Button></article></Reveal>
  </div></section>;
}

function PrinterIcon() {
  return <span className="tag-dot" aria-hidden="true" />;
}

function Skills() {
  return <section id="skills" className="section skills-section"><div className="page-width"><SectionLabel number="03">MY EVER-GROWING TOOLKIT</SectionLabel><Reveal className="section-heading"><h2>Curiosity doesn’t<br />stay in <span className="text-primary">one lane.</span></h2><p>No expert labels. No progress bars.<br />Just worlds I’ve touched and keep exploring.</p></Reveal><div className="skill-grid">{skills.map(skill => <Reveal key={skill.title}><article className="skill-item"><div className="skill-top"><span>{skill.category}</span><skill.icon size={22} /></div><h3>{skill.title}</h3><p>{skill.detail}</p></article></Reveal>)}</div><Reveal className="learning-note"><span className="status-dot" />The most useful skill? Being willing to learn the next one.<ArrowUpRight size={20} /></Reveal></div></section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [prepared, setPrepared] = useState(false);
  async function copyEmail() {
    try { await navigator.clipboard.writeText('ajmalshajahan@gmail.com'); setCopied(true); setCopyFailed(false); window.setTimeout(() => setCopied(false), 2500); }
    catch { setCopyFailed(true); }
  }
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `${String(data.get('message'))}\n\nFrom: ${String(data.get('name'))}\nEmail: ${String(data.get('email'))}`;
    window.location.href = `mailto:ajmalshajahan@gmail.com?subject=${encodeURIComponent(`Hello Ajmal — from ${String(data.get('name'))}`)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }
  return <section id="contact" className="section contact-section"><div className="page-width"><SectionLabel number="04">GOOD CONVERSATIONS START SOMEWHERE</SectionLabel><div className="contact-grid"><Reveal><h2>Have a thought?<br /><span className="text-primary">Say hello.</span><ArrowUpRight className="contact-arrow" /></h2><p className="contact-description">I stay away from the social noise.<br />But a good email? Always welcome.</p><div className="email-row"><Mail size={18} /><a href="mailto:ajmalshajahan@gmail.com">ajmalshajahan@gmail.com</a><Button size="icon" variant="ghost" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email'} title={copied ? 'Copied' : 'Copy email'}>{copied ? <Check /> : <Copy />}</Button></div><span role="status" className="copy-status">{copied ? 'Email copied.' : copyFailed ? 'Please select and copy the email address above.' : ''}</span><p className="contact-location"><MapPin size={15} /> Dubai, UAE <span> / </span> Open to a good conversation</p><ul className="contact-next"><li><Mail size={14} /> Your message lands in my inbox</li><li><Clock size={14} /> A reply, usually within a day</li><li><Sparkles size={14} /> No calls, unless you ask for one</li></ul></Reveal><Reveal><form onSubmit={sendMessage} className="contact-form"><div className="form-pair"><div><label htmlFor="name">YOUR NAME</label><input id="name" name="name" placeholder="What should I call you?" required autoComplete="name" /></div><div><label htmlFor="email">YOUR EMAIL</label><input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></div></div><div><label htmlFor="message">WHAT’S ON YOUR MIND?</label><textarea id="message" name="message" placeholder="An idea, a question, or just a hello…" rows={4} required /></div><Button type="submit" size="lg" className="send-button">Let’s start a conversation <ArrowUpRight /></Button>{prepared && <p role="status" className="form-status">Your message is ready in your email app. Send it there to reach me.</p>}</form></Reveal></div></div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="page-width footer-inner"><a href="#" className="wordmark">akbuilts<span className="text-primary">.</span></a><p>© {new Date().getFullYear()} Ajmal Khan. Built quietly. With curiosity.</p><a href="#" className="back-top">BACK TO TOP <ArrowUpRight size={16} /></a></div></footer>;
}
