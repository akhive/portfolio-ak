import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { Check, Clock, FileText, Home, RotateCcw, ScanText, Volume2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import autoKidImage from "@/assets/autokid-vehicles.jpg";

const aed = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

/* ───────────────────────── Finora: post a transaction, watch the books balance ───────────────────────── */

type JournalLine = { account: string; dr: number; cr: number };
type Txn = { id: string; label: string; lines: JournalLine[] };

const finoraTxns: [Txn, ...Txn[]] = [
  {
    id: "sale",
    label: "Cash sale, AED 10,000 + VAT",
    lines: [
      { account: "Cash", dr: 10500, cr: 0 },
      { account: "Sales", dr: 0, cr: 10000 },
      { account: "VAT payable", dr: 0, cr: 500 },
    ],
  },
  {
    id: "bill",
    label: "Supplier bill, AED 4,000 + VAT",
    lines: [
      { account: "Purchases", dr: 4000, cr: 0 },
      { account: "VAT recoverable", dr: 200, cr: 0 },
      { account: "Supplier", dr: 0, cr: 4200 },
    ],
  },
  {
    id: "rent",
    label: "Office rent paid, AED 3,000",
    lines: [
      { account: "Rent expense", dr: 3000, cr: 0 },
      { account: "Bank", dr: 0, cr: 3000 },
    ],
  },
];

export function FinoraDemo() {
  const [posted, setPosted] = useState<Txn[]>([finoraTxns[0]]);
  const lines = posted.flatMap((t) => t.lines);
  const dr = lines.reduce((s, l) => s + l.dr, 0);
  const cr = lines.reduce((s, l) => s + l.cr, 0);
  const vatOut = lines.filter((l) => l.account === "VAT payable").reduce((s, l) => s + l.cr, 0);
  const vatIn = lines.filter((l) => l.account === "VAT recoverable").reduce((s, l) => s + l.dr, 0);
  const recent = posted
    .slice(-2)
    .flatMap((t, ti) => t.lines.map((l, li) => ({ ...l, key: `${posted.length}-${ti}-${li}` })));

  return (
    <div className="demo demo-finora">
      <div className="demo-actions" role="group" aria-label="Post a transaction">
        {finoraTxns.map((t) => (
          <button
            key={t.id}
            type="button"
            className="demo-chip"
            onClick={() => setPosted((p) => [...p, t])}
          >
            <Plus size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div className="finora-grid">
        <div className="finora-journal">
          <div className="journal-head">
            <span>Account</span>
            <span>Debit</span>
            <span>Credit</span>
          </div>
          {recent.map((l) => (
            <div key={l.key} className="journal-row">
              <span className={l.cr ? "is-credit" : ""}>{l.account}</span>
              <span>{l.dr ? aed(l.dr) : ""}</span>
              <span>{l.cr ? aed(l.cr) : ""}</span>
            </div>
          ))}
        </div>
        <div className="finora-tb">
          <div>
            <span>Total debits</span>
            <strong>{aed(dr)}</strong>
          </div>
          <div>
            <span>Total credits</span>
            <strong>{aed(cr)}</strong>
          </div>
          <div>
            <span>VAT due to FTA</span>
            <strong>{aed(vatOut - vatIn)}</strong>
          </div>
          <p className={`tb-status ${dr === cr ? "is-ok" : ""}`}>
            <Check size={14} />{" "}
            {dr === cr
              ? `Trial balance agrees across ${posted.length} ${posted.length === 1 ? "entry" : "entries"}`
              : "Out of balance"}
          </p>
        </div>
      </div>
      <button type="button" className="demo-reset" onClick={() => setPosted([finoraTxns[0]])}>
        <RotateCcw size={13} /> Reset
      </button>
    </div>
  );
}

/* ───────────────────────── MyMoney: add an expense, see the month change ───────────────────────── */

const moneyCats = ["Groceries", "Transport", "Bills", "Eating out", "Other"] as const;
type Cat = (typeof moneyCats)[number];
type Expense = { id: number; note: string; cat: Cat; amount: number };
const MONTHLY_BUDGET = 6000;
const seedExpenses: Expense[] = [
  { id: 1, note: "Weekly groceries", cat: "Groceries", amount: 640 },
  { id: 2, note: "Metro top-up", cat: "Transport", amount: 150 },
  { id: 3, note: "Phone + internet", cat: "Bills", amount: 389 },
  { id: 4, note: "Friday dinner", cat: "Eating out", amount: 210 },
];
const quickAdds: Omit<Expense, "id">[] = [
  { note: "Karak & snacks", cat: "Eating out", amount: 18 },
  { note: "Taxi home", cat: "Transport", amount: 42 },
  { note: "DEWA bill", cat: "Bills", amount: 420 },
];

export function MyMoneyDemo() {
  const [items, setItems] = useState<Expense[]>(seedExpenses);
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<Cat>("Groceries");
  const spent = items.reduce((s, e) => s + e.amount, 0);
  const left = MONTHLY_BUDGET - spent;
  const byCat = moneyCats.map((c) => ({
    cat: c,
    total: items.filter((e) => e.cat === c).reduce((s, e) => s + e.amount, 0),
  }));
  const max = Math.max(...byCat.map((b) => b.total), 1);

  function add(e: Omit<Expense, "id">) {
    setItems((list) => [{ ...e, id: Date.now() }, ...list]);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    add({ note: cat, cat, amount: Math.round(value * 100) / 100 });
    setAmount("");
  }

  return (
    <div className="demo demo-money">
      <div className="money-summary">
        <div>
          <span>Spent this month</span>
          <strong>AED {aed(spent)}</strong>
        </div>
        <div>
          <span>Left of {aed(MONTHLY_BUDGET)} budget</span>
          <strong className={left < 0 ? "is-over" : "is-left"}>AED {aed(left)}</strong>
        </div>
      </div>
      <div className="money-meter" aria-hidden="true">
        <i style={{ "--w": `${Math.min(spent / MONTHLY_BUDGET, 1) * 100}%` } as CSSProperties} />
      </div>
      <div className="money-bars">
        {byCat.map((b) => (
          <div key={b.cat} className="money-bar">
            <span>{b.cat}</span>
            <i style={{ "--w": `${(b.total / max) * 100}%` } as CSSProperties} />
            <strong>{aed(b.total)}</strong>
          </div>
        ))}
      </div>
      <form className="money-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="mm-amount">
          Amount in AED
        </label>
        <input
          id="mm-amount"
          inputMode="decimal"
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label className="sr-only" htmlFor="mm-cat">
          Category
        </label>
        <select id="mm-cat" value={cat} onChange={(e) => setCat(e.target.value as Cat)}>
          {moneyCats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Button type="submit" size="sm">
          Add expense
        </Button>
      </form>
      <div className="demo-actions" role="group" aria-label="Quick add">
        {quickAdds.map((q) => (
          <button key={q.note} type="button" className="demo-chip" onClick={() => add(q)}>
            <Plus size={14} /> {q.note} · {q.amount}
          </button>
        ))}
      </div>
      <button type="button" className="demo-reset" onClick={() => setItems(seedExpenses)}>
        <RotateCcw size={13} /> Reset
      </button>
    </div>
  );
}

/* ───────────────────────── AqarBooks: mark rent received ───────────────────────── */

const seedUnits = [
  { unit: "A-101", rent: 4200, paid: true },
  { unit: "B-204", rent: 3600, paid: false },
  { unit: "C-307", rent: 5100, paid: true },
  { unit: "D-410", rent: 3900, paid: false },
];

export function AqarDemo() {
  const [units, setUnits] = useState(seedUnits);
  const expected = units.reduce((s, u) => s + u.rent, 0);
  const collected = units.filter((u) => u.paid).reduce((s, u) => s + u.rent, 0);
  return (
    <div className="demo demo-aqar">
      <p className="demo-hint">Tap a unit to mark its rent cheque as cleared.</p>
      <ul className="aqar-units">
        {units.map((u, i) => (
          <li key={u.unit}>
            <button
              type="button"
              aria-pressed={u.paid}
              onClick={() =>
                setUnits((list) => list.map((x, j) => (j === i ? { ...x, paid: !x.paid } : x)))
              }
            >
              <span className="aqar-unit">
                <Home size={14} /> {u.unit}
              </span>
              <span className="aqar-rent">AED {aed(u.rent)}</span>
              <span className={`aqar-chip ${u.paid ? "is-paid" : "is-due"}`}>
                {u.paid ? <Check size={12} /> : <Clock size={12} />}
                {u.paid ? "Cleared" : "Due"}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="aqar-total">
        <span>Collected this month</span>
        <strong>
          AED {aed(collected)} <small>of {aed(expected)}</small>
        </strong>
        <div className="money-meter" aria-hidden="true">
          <i style={{ "--w": `${(collected / expected) * 100}%` } as CSSProperties} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Tax Invoice Extractor: scan a sample invoice ───────────────────────── */

const invoiceFields = [
  ["Supplier", "Al Noor Trading LLC"],
  ["TRN", "100 2345 6789 0003"],
  ["Invoice no.", "INV-2026-0418"],
  ["Date", "04 Nov 2026"],
  ["Subtotal", "AED 8,400.00"],
  ["VAT 5%", "AED 420.00"],
  ["Total", "AED 8,820.00"],
] as const;

export function ExtractorDemo() {
  const [found, setFound] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (found >= invoiceFields.length) {
      setRunning(false);
      return;
    }
    const id = window.setTimeout(() => setFound((n) => n + 1), 260);
    return () => window.clearTimeout(id);
  }, [running, found]);
  return (
    <div className="demo demo-extract">
      <div className={`extract-paper ${running ? "is-scanning" : ""}`} aria-hidden="true">
        <span className="paper-title">
          <FileText size={14} /> Tax invoice
        </span>
        {Array.from({ length: 7 }, (_, i) => (
          <i
            key={i}
            className={`paper-line ${i < found ? "is-read" : ""}`}
            style={{ "--len": `${55 + ((i * 37) % 40)}%` } as CSSProperties}
          />
        ))}
        <span className="scan-beam" />
      </div>
      <div className="extract-out">
        <dl>
          {invoiceFields.map(([k, v], i) => (
            <div key={k} className={i < found ? "is-found" : ""}>
              <dt>{k}</dt>
              <dd>{i < found ? v : "—"}</dd>
            </div>
          ))}
        </dl>
        <Button
          size="sm"
          onClick={() => {
            setFound(0);
            setRunning(true);
          }}
          disabled={running}
        >
          <ScanText /> {found === invoiceFields.length ? "Extract again" : "Extract fields"}
        </Button>
      </div>
    </div>
  );
}

/* ───────────────────────── AutoKid: hear the vehicle names ───────────────────────── */

const vehicles = ["Car", "Bus", "Scooter"];

export function AutoKidDemo() {
  const [word, setWord] = useState("Car");
  const [canSpeak, setCanSpeak] = useState(false);
  useEffect(() => {
    setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);
  function say(w: string) {
    setWord(w);
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w);
    u.rate = 0.85;
    u.pitch = 1.2;
    window.speechSynthesis.speak(u);
  }
  return (
    <div className="demo demo-autokid">
      <img
        src={autoKidImage}
        alt="Toy car, bus and scooter from AutoKid"
        width={1536}
        height={1024}
        loading="lazy"
      />
      <div className="autokid-panel">
        <strong key={word} className="autokid-word">
          {word}
        </strong>
        <div className="demo-actions" role="group" aria-label="Vehicle names">
          {vehicles.map((v) => (
            <button
              key={v}
              type="button"
              className={`demo-chip ${v === word ? "is-active" : ""}`}
              onClick={() => say(v)}
            >
              {canSpeak && <Volume2 size={14} />} {v}
            </button>
          ))}
        </div>
        <p className="demo-hint">
          {canSpeak
            ? "Tap a name to hear it, the way a child would in the app."
            : "Tap a name to see it, the way a child would in the app."}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── Cheque printing: amount in words ───────────────────────── */

const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function below1000(n: number): string {
  const h = Math.floor(n / 100),
    r = n % 100;
  const rest = r < 20 ? ones[r] : `${tens[Math.floor(r / 10)]}${r % 10 ? "-" + ones[r % 10] : ""}`;
  return [h ? `${ones[h]} hundred` : "", rest].filter(Boolean).join(" and ");
}
function toWords(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  const scales: [number, string][] = [
    [1e9, "billion"],
    [1e6, "million"],
    [1e3, "thousand"],
  ];
  for (const [size, name] of scales) {
    if (n >= size) {
      parts.push(`${below1000(Math.floor(n / size))} ${name}`);
      n %= size;
    }
  }
  if (n) parts.push(below1000(n));
  return parts.join(" ");
}
function amountInWords(value: number) {
  const dirhams = Math.floor(value);
  const fils = Math.round((value - dirhams) * 100);
  const text = `${toWords(dirhams)} dirham${dirhams === 1 ? "" : "s"}${fils ? ` and ${toWords(fils)} fils` : ""} only`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function ChequeDemo() {
  const [payee, setPayee] = useState("Al Noor Trading LLC");
  const [amount, setAmount] = useState("12500.50");
  const value = Math.min(Math.max(Number(amount) || 0, 0), 999999999);
  const date = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Dubai",
      }).format(new Date()),
    [],
  );
  return (
    <div className="demo demo-cheque">
      <div className="cheque" aria-live="polite">
        <div className="cheque-top">
          <span className="cheque-bank">Bank of the Gulf</span>
          <span className="cheque-date">
            Date <b>{date}</b>
          </span>
        </div>
        <div className="cheque-line">
          <span>Pay</span>
          <b>{payee || " "}</b>
        </div>
        <div className="cheque-line">
          <span>Dirhams</span>
          <b className="cheque-words">{amountInWords(value)}</b>
        </div>
        <div className="cheque-bottom">
          <span className="cheque-box">AED {aed(value, 2)}</span>
          <span className="cheque-sign">Authorised signatory</span>
        </div>
      </div>
      <div className="cheque-inputs">
        <label>
          Payee
          <input value={payee} onChange={(e) => setPayee(e.target.value)} maxLength={48} />
        </label>
        <label>
          Amount (AED)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

/* ───────────────────────── akbuilts.com: retint the site you're on ───────────────────────── */

const inks: [{ name: string; value: string }, ...{ name: string; value: string }[]] = [
  { name: "Red ink", value: "#f0544f" },
  { name: "Dubai brass", value: "#e0b45e" },
  { name: "Ledger green", value: "#4cc59b" },
  { name: "Creek blue", value: "#5aa9f0" },
];

let chosenInk = inks[0].value;

export function SiteDemo() {
  const [ink, setInk] = useState(chosenInk);
  useEffect(() => {
    chosenInk = ink;
    document.documentElement.style.setProperty("--primary", ink);
  }, [ink]);
  return (
    <div className="demo demo-site">
      <p>
        You’re looking at it. Built with React, TanStack and Tailwind, and written to stay out of
        your way. Change the pen colour for the whole page:
      </p>
      <div className="ink-swatches" role="radiogroup" aria-label="Accent colour">
        {inks.map((i) => (
          <button
            key={i.value}
            type="button"
            role="radio"
            aria-checked={ink === i.value}
            onClick={() => setInk(i.value)}
          >
            <i style={{ background: i.value }} />
            {i.name}
          </button>
        ))}
      </div>
    </div>
  );
}
