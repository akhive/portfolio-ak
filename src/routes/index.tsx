import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Code2,
  FileText,
  Github,
  Globe,
  Layers,
  Layout,
  Mail,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

const siteUrl = "https://akbuilts.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ajmal Khan — Learner, Builder, Accountant" },
      {
        name: "description",
        content:
          "Personal page of Ajmal Khan. Accountant by profession, learner by nature, builder by choice. Behind-the-scenes work with Python, Linux, web tools, and AI.",
      },
      { property: "og:title", content: "Ajmal Khan — Learner, Builder, Accountant" },
      {
        property: "og:description",
        content:
          "Personal page of Ajmal Khan. Accountant by profession, learner by nature, builder by choice.",
      },
      { property: "og:url", content: siteUrl },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Ajmal Khan — Learner, Builder, Accountant" },
      {
        name: "twitter:description",
        content:
          "Personal page of Ajmal Khan. Accountant by profession, learner by nature, builder by choice.",
      },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
  }),
  component: Index,
});

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const skills = [
  {
    icon: Terminal,
    title: "Python",
    description: "Scripting, automation, and small utilities that make repetitive work disappear.",
  },
  {
    icon: Server,
    title: "Linux & Ubuntu",
    description: "Comfortable on the command line, from system setup to daily workflows.",
  },
  {
    icon: Layout,
    title: "Windows Systems",
    description: "Years of hands-on experience with Windows tools, formats, and office workflows.",
  },
  {
    icon: Globe,
    title: "Web Building",
    description: "Creating simple, useful websites and digital spaces like this one.",
  },
  {
    icon: Zap,
    title: "Automation & Tools",
    description: "Building small tools that speed up real work — faster, smoother, better.",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Building",
    description: "Using AI as a quiet partner to learn faster, code better, and ship sooner.",
  },
  {
    icon: Shield,
    title: "Ethical Hacking",
    description: "A curious beginner's exploration of security, privacy, and how systems work.",
  },
];

const projects = [
  {
    title: "Text Extractor",
    description:
      "A tool I built at the office to pull text from documents and images, turning slow manual work into a few quick clicks.",
    tags: ["Python", "Automation", "AI"],
    href: "#contact",
  },
  {
    title: "Cheque Printing Format",
    description:
      "A custom cheque layout generator built to streamline payment processing and reduce errors at work.",
    tags: ["Windows", "Office Tools", "Automation"],
    href: "#contact",
  },
  {
    title: "akbuilts.com",
    description:
      "This site — a quiet corner of the internet to share who I am, what I learn, and what I build behind the scenes.",
    tags: ["React", "Tailwind", "TanStack"],
    href: "https://akbuilts.com",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
          AK<span className="text-primary">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 md:inline-flex"
        >
          Say Hello <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-indigo-mid/30 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Accountant · Learner · Builder</span>
            </div>
            <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Hi, I'm <span className="text-gradient">Ajmal Khan</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              I spend my days with numbers, and my nights exploring code. I stay behind the scenes —
              quietly simplifying work with Python, Linux, small tools, and a little help from AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
              >
                Explore My Work <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-accent"
              >
                Say Hello
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-lg">
              {/* Decorative code card */}
              <div className="absolute -left-8 top-8 rounded-2xl border border-border bg-card/80 p-5 shadow-xl backdrop-blur-sm glow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <pre className="mt-4 text-xs text-muted-foreground">
                  <code>{`while (true) {
  learn();
  build();
  improve();
}`}</code>
                </pre>
              </div>

              {/* Decorative stats card */}
              <div className="absolute -right-4 bottom-12 rounded-2xl border border-border bg-card/80 p-5 shadow-xl backdrop-blur-sm glow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-bold text-foreground">5+</p>
                    <p className="text-sm text-muted-foreground">Years learning by doing</p>
                  </div>
                </div>
              </div>

              {/* Central glow orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border border-border bg-card/90 shadow-2xl glow">
                  <Layers className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">About Me</p>
        <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          If you came here looking for just an Accountant… you may not fully find me.
        </h2>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            Yes, I have spent five years working as an Accountant in Dubai. Numbers, reports, and
            responsibilities — I know them well.
          </p>
          <p>But this page is not about my profession. This is about me. The inner me.</p>
          <p>
            I am a learner in a world that never stops changing. I watch, I absorb, I recreate — and
            sometimes, I improve. Some may call it copying. I call it evolving.
          </p>
          <p>
            In a time where technology shifts every day, I believe the real skill is not in knowing
            one thing deeply, but in being willing to learn anything quickly.
          </p>
          <p>
            I have touched many worlds — Python, Linux, Windows, Ubuntu, a little ethical hacking,
            building websites, and creating small tools that make work lighter.
          </p>
          <p>
            At my office, I built a Text Extractor and cheque printing formats, not because I was
            asked to, but because I wanted the work to move faster, smoother, better. Most of it,
            with the quiet help of AI.
          </p>
          <p>
            I do not enjoy the noise of social media. I do not wish to live in front of cameras or
            create videos. I prefer to stay behind the scenes — quietly simplifying, improving, and
            building.
          </p>
          <p className="text-foreground">
            This is not a professional profile. This is simply me… still learning, still adapting,
            still becoming.
          </p>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative border-y border-border/50 bg-card/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Skills</p>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Worlds I have touched.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Not an expert in any single label — just curious enough to keep learning.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-accent hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <skill.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">{skill.title}</h3>
              <p className="mt-2 text-muted-foreground">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Projects</p>
            <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Things I built quietly.
            </h2>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <Github className="h-4 w-4" /> View all on GitHub
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-indigo-deep">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-indigo-mid/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {project.title === "Text Extractor" ? (
                    <FileText className="h-12 w-12 text-primary/40" />
                  ) : project.title === "Cheque Printing Format" ? (
                    <Layout className="h-12 w-12 text-primary/40" />
                  ) : (
                    <Globe className="h-12 w-12 text-primary/40" />
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground">{project.title}</h3>
                <p className="mt-3 flex-1 text-muted-foreground">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.href}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-foreground"
                >
                  View Project <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative border-t border-border/50 bg-card/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
            <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Say hello.
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              I keep my distance from social noise, but email always reaches me. If something here
              resonated, feel free to write.
            </p>
            <div className="mt-8 space-y-4">
              <a
                href="mailto:ajmalshajahan@gmail.com"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span>ajmalshajahan@gmail.com</span>
              </a>
            </div>
          </div>

          <form
            action="mailto:ajmalshajahan@gmail.com"
            method="post"
            encType="text/plain"
            className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell me what's on your mind..."
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              Send Message <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ajmal Khan. Built quietly with curiosity.
        </p>
        <div className="flex gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
