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

  function add(e: FormEvent) {
    e.preventDefault();
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    setItems((list) => [...list, { id: Date.now(), note: "Custom", cat, amount: n }]);
    setAmount("");
  }

  return (
    <div className="demo demo-mymoney">
      <div className="money-bar">
        <div>
          <span>Spent</span>
          <strong>AED {aed(spent)}</strong>
        </div>
        <div>
          <span>Left of AED {aed(MONTHLY_BUDGET)}</span>
          <strong className={left < 0 ? "is-over" : ""}>AED {aed(left)}</strong>
        </div>
      </div>
      <div className="money-cats">
        {byCat.map((c) => (
          <div key={c.cat}>
            <span>{c.cat}</span>
            <b>AED {aed(c.total)}</b>
          </div>
        ))}
      </div>
      <div className="demo-actions">
        {quickAdds.map((q) => (
          <button
            key={q.note}
            type="button"
            className="demo-chip"
            onClick={() => setItems((list) => [...list, { ...q, id: Date.now() }])}
          >
            <Plus size={14} /> {q.note} · {q.amount}
          </button>
        ))}
      </div>
      <form className="money-form" onSubmit={add}>
        <select value={cat} onChange={(e) => setCat(e.target.value as Cat)}>
          {moneyCats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          inputMode="decimal"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>
      <button type="button" className="demo-reset" onClick={() => setItems(seedExpenses)}>
        <RotateCcw size={13} /> Reset
      </button>
    </div>
  );
}

/* ───────────────────────── AqarBooks: mark a cheque cleared ───────────────────────── */

type Cheque = { id: string; tenant: string; unit: string; amount: number; status: "pending" | "cleared" };

const seedCheques: Cheque[] = [
  { id: "1", tenant: "Sara Al Maktoum", unit: "A-1204", amount: 18500, status: "pending" },
  { id: "2", tenant: "Omar Hassan", unit: "B-305", amount: 12000, status: "cleared" },
  { id: "3", tenant: "Priya Nair", unit: "C-802", amount: 21000, status: "pending" },
];

export function AqarDemo() {
  const [cheques, setCheques] = useState(seedCheques);
  const pending = cheques.filter((c) => c.status === "pending").reduce((s, c) => s + c.amount, 0);
  const cleared = cheques.filter((c) => c.status === "cleared").reduce((s, c) => s + c.amount, 0);

  return (
    <div className="demo demo-aqar">
      <div className="aqar-totals">
        <div>
          <span>Pending collections</span>
          <strong>AED {aed(pending)}</strong>
        </div>
        <div>
          <span>Cleared this month</span>
          <strong>AED {aed(cleared)}</strong>
        </div>
      </div>
      <ul className="aqar-list">
        {cheques.map((c) => (
          <li key={c.id} className={c.status === "cleared" ? "is-cleared" : ""}>
            <div>
              <b>{c.tenant}</b>
              <span>
                {c.unit} · AED {aed(c.amount)}
              </span>
            </div>
            {c.status === "pending" ? (
              <button
                type="button"
                className="demo-chip"
                onClick={() =>
                  setCheques((list) =>
                    list.map((x) => (x.id === c.id ? { ...x, status: "cleared" } : x)),
                  )
                }
              >
                Mark cleared
              </button>
            ) : (
              <span className="aqar-badge">
                <Check size={12} /> Cleared
              </span>
            )}
          </li>
        ))}
      </ul>
      <button type="button" className="demo-reset" onClick={() => setCheques(seedCheques)}>
        <RotateCcw size={13} /> Reset
      </button>
    </div>
  );
}

/* ───────────────────────── Tax Invoice Extractor ───────────────────────── */

export function ExtractorDemo() {
  const [done, setDone] = useState(false);
  return (
    <div className="demo demo-extractor">
      <div className={`extractor-card ${done ? "is-done" : ""}`}>
        <div className="extractor-icon">
          <ScanText size={22} />
        </div>
        <div>
          <b>Sample tax invoice.pdf</b>
          <span>Supplier · TRN · Totals · VAT</span>
        </div>
        {!done ? (
          <Button size="sm" onClick={() => setDone(true)}>
            Extract
          </Button>
        ) : (
          <span className="extractor-ok">
            <Check size={14} /> Extracted
          </span>
        )}
      </div>
      {done && (
        <dl className="extractor-result">
          <div>
            <dt>Supplier</dt>
            <dd>Gulf Trading LLC</dd>
          </div>
          <div>
            <dt>TRN</dt>
            <dd>100234567890003</dd>
          </div>
          <div>
            <dt>Invoice total</dt>
            <dd>AED 12,600.00</dd>
          </div>
          <div>
            <dt>VAT (5%)</dt>
            <dd>AED 600.00</dd>
          </div>
        </dl>
      )}
      <button type="button" className="demo-reset" onClick={() => setDone(false)}>
        <RotateCcw size={13} /> Reset
      </button>
    </div>
  );
}

/* ───────────────────────── AutoKid ───────────────────────── */

const vehicles = [
  { name: "Bus", sound: "Bus!" },
  { name: "Taxi", sound: "Taxi!" },
  { name: "Truck", sound: "Truck!" },
  { name: "Ambulance", sound: "Ambulance!" },
];

export function AutoKidDemo() {
  const [spoken, setSpoken] = useState<string | null>(null);
  return (
    <div className="demo demo-autokid">
      <img src={autoKidImage} alt="Colourful vehicles for children" className="autokid-img" />
      <div className="autokid-grid">
        {vehicles.map((v) => (
          <button
            key={v.name}
            type="button"
            className={`autokid-btn ${spoken === v.name ? "is-active" : ""}`}
            onClick={() => setSpoken(v.name)}
          >
            <Volume2 size={16} />
            {v.name}
          </button>
        ))}
      </div>
      {spoken && (
        <p className="autokid-say" aria-live="polite">
          “{spoken}!”
        </p>
      )}
    </div>
  );
}

/* ───────────────────────── Cheque Printing Format ───────────────────────── */

function amountInWords(n: number): string {
  if (!n || n < 0) return "Zero only";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const toWords = (num: number): string => {
    if (num < 20) return ones[num] ?? "";
    if (num < 100) return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();
    if (num < 1000)
      return `${ones[Math.floor(num / 100)]} Hundred${num % 100 ? ` and ${toWords(num % 100)}` : ""}`;
    if (num < 1000000) {
      const th = Math.floor(num / 1000);
      return `${toWords(th)} Thousand${num % 1000 ? ` ${toWords(num % 1000)}` : ""}`;
    }
    return aed(num);
  };
  const whole = Math.floor(n);
  const fils = Math.round((n - whole) * 100);
  let words = toWords(whole) + " Dirhams";
  if (fils) words += ` and ${toWords(fils)} Fils`;
  return words + " only";
}

export function ChequeDemo() {
  const [payee, setPayee] = useState("Gulf Trading LLC");
  const [amount, setAmount] = useState("12500.00");
  const value = parseFloat(amount) || 0;
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

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
