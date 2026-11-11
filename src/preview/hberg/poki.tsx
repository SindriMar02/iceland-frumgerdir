import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import { KATALOGUR } from "./katalogur";
import { pop } from "./popup";
import { PK, PRODUCTS, productBySlug, type Product } from "./vorur";
import {
  cleanLines,
  forgetRemember,
  readRemember,
  repeatOrder,
  saveRemember,
  validKennitala,
  type OrderLine,
  type Remembered,
} from "./ordering-core.mjs";
import { AllergenBadges } from "./allergen-ui";
import {
  countWord,
  formatKennitala,
  orderTotals,
  buildOrderText,
  nextAmountSlug,
  nextWorkingDays,
  lineDescription,
} from "./ordering-core.mjs";
import { MOTION } from "./experience-style";
import { ORDER_CSS } from "./ordering-style";

export type PokaLina = OrderLine;
const units = (p: Product) => [
  "pokar",
  "kassar",
  ...(p.bulkWeight ? [`pokar af ${p.bulkWeight}`] : []),
  "annad",
];
const normalize = (v: unknown) =>
  cleanLines(v).filter((l) => {
    const p = productBySlug(l.slug);
    return p && units(p).includes(l.unit);
  });
let lines: PokaLina[] = [];
try {
  lines = normalize(
    JSON.parse(sessionStorage.getItem("hb-poki") || "[]").map(
      (l: PokaLina) => ({ ...l, unit: l.unit || "kassar" }),
    ),
  );
} catch {
  /* Storage is optional. */
}
let opid = false;
let opening: { trigger: HTMLElement | null; keyboard: boolean } = {
  trigger: null,
  keyboard: false,
};
const subs = new Set<() => void>();
const emit = () => {
  try {
    sessionStorage.setItem("hb-poki", JSON.stringify(lines));
  } catch {
    /* Storage is optional. */
  }
  subs.forEach((f) => f());
};
const sub = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};
export const poki = {
  add(slug: string) {
    const l = lines.find((l) => l.slug === slug);
    this.set(slug, (l?.magn || 0) + 1);
  },
  set(slug: string, magn: number, unit?: string, other?: string) {
    if (!productBySlug(slug) || !Number.isFinite(magn)) return;
    const old = lines.find((l) => l.slug === slug);
    const next = {
      slug,
      magn: Math.min(9999, Math.max(0, Math.floor(magn))),
      unit: unit || old?.unit || "kassar",
      other: other ?? old?.other ?? "",
    };
    lines = next.magn
      ? old
        ? lines.map((l) => (l.slug === slug ? next : l))
        : [...lines, next]
      : lines.filter((l) => l.slug !== slug);
    emit();
  },
  replace(v: PokaLina[]) {
    lines = normalize(v);
    emit();
  },
  open(
    v: boolean,
    event?: Pick<MouseEvent<HTMLElement>, "detail" | "currentTarget">,
  ) {
    if (v && !opid) {
      opening = {
        trigger:
          event?.currentTarget ||
          (document.activeElement as HTMLElement | null),
        keyboard: event
          ? event.detail === 0
          : document.documentElement.dataset.input === "key",
      };
      pop.close();
    }
    opid = v;
    emit();
  },
  clear() {
    lines = [];
    emit();
  },
};
const snapLines = () => lines;
const snapOpen = () => opid;
export const usePoki = () => useSyncExternalStore(sub, snapLines, snapLines);
export const POKA_CSS = ORDER_CSS;

export function PokaHnappur() {
  const l = usePoki();
  return (
    <button
      className="hb-pokiH"
      onClick={(e) => poki.open(true, e)}
      aria-label={`Pöntunarlisti, ${l.length} vörur`}
    >
      <span className="hb-pokiO">Pöntunarlisti</span>
      <b>{l.length}</b>
    </button>
  );
}
export function SettIPoka({ slug }: { slug: string }) {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(t);
  }, [added]);
  return (
    <button
      type="button"
      className={`hb-sett${added ? " komid" : ""}`}
      onClick={() => {
        poki.add(slug);
        setAdded(true);
      }}
      aria-label={`Setja ${productBySlug(slug)?.name.is} á pöntunarlistann`}
    >
      <span aria-hidden="true">{added ? "✓" : "+"}</span>{" "}
      {added ? "Komið á listann" : "Á listann"}
    </button>
  );
}
function Trash() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
    </svg>
  );
}
function panelAmounts(input: HTMLInputElement, source: string) {
  return [
    ...(input
      .closest(".hb-order")
      ?.querySelectorAll<HTMLInputElement>("input[data-amount-source]") || []),
  ].filter((x) => x.dataset.amountSource === source);
}
function Amount({
  p,
  line,
  source,
}: {
  p: Product;
  line?: PokaLina;
  source: string;
}) {
  const [text, setText] = useState<string | null>(null);
  const value = line?.magn || 0;
  const numberInput = useRef<HTMLInputElement>(null);
  const prior = useRef(value);
  useEffect(() => {
    if (
      prior.current !== value &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      numberInput.current?.animate(
        [
          { opacity: 0.45, transform: "translateY(2px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: MOTION.fast, easing: MOTION.out },
      );
    prior.current = value;
  }, [value]);
  const chosen = line?.unit || "kassar";
  const options = units(p);
  const detail =
    chosen === "pokar"
      ? p.weight
        ? `Neytendapakkning · ${p.weight}`
        : "Neytendapakkningar"
      : chosen === "kassar"
        ? p.iKassa
          ? `${p.iKassa} pakkningar í kassa`
          : "Fjöldi í kassa staðfestur við pöntun"
        : chosen === "annad"
          ? "Lýstu pakkningu eða samsetningu"
          : `Stærri pakkning · ${p.bulkWeight}`;
  return (
    <div className="hb-amountUnit">
      <div className="hb-magn">
        <button
          type="button"
          aria-label={`Fækka ${p.name.is}`}
          disabled={!value}
          onClick={() => poki.set(p.slug, value - 1)}
        >
          −
        </button>
        <input
          ref={numberInput}
          aria-label={`Magn ${p.name.is}`}
          id={`${source}-${p.slug}`}
          className="hb-magnN"
          inputMode="numeric"
          enterKeyHint="next"
          data-amount-source={source}
          data-product={p.slug}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const inputs = [...panelAmounts(e.currentTarget, source)];
            const next = nextAmountSlug(
              inputs.map((x) => x.dataset.product!),
              p.slug,
              e.shiftKey,
            );
            inputs.find((x) => x.dataset.product === next)?.focus();
          }}
          pattern="[0-9]*"
          value={text ?? (value || "")}
          placeholder="0"
          onChange={(e) => {
            const s = e.target.value.replace(/\D/g, "").slice(0, 4);
            setText(s);
            poki.set(p.slug, Number(s));
          }}
          onBlur={() => setText(null)}
        />
        <button
          type="button"
          aria-label={`Fjölga ${p.name.is}`}
          onClick={() => poki.set(p.slug, value + 1)}
        >
          +
        </button>
      </div>
      <div
        className="hb-unit"
        style={
          {
            "--unit-count": options.length,
            "--unit-index": options.indexOf(chosen),
          } as CSSProperties
        }
        role="radiogroup"
        aria-label={`Eining ${p.name.is}`}
        onKeyDown={(e) => {
          if (
            ![
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
            ].includes(e.key)
          )
            return;
          e.preventDefault();
          const all = units(p);
          const current = all.indexOf(line?.unit || "kassar");
          const next =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? all.length - 1
                : (current +
                    (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) +
                    all.length) %
                  all.length;
          poki.set(p.slug, value || 1, all[next]);
          e.currentTarget
            .querySelectorAll<HTMLButtonElement>("button")
            [next]?.focus();
        }}
      >
        <span className="hb-unitPill" aria-hidden="true" />
        {options.map((u) => (
          <button
            type="button"
            key={u}
            role="radio"
            tabIndex={(line?.unit || "kassar") === u ? 0 : -1}
            aria-checked={(line?.unit || "kassar") === u}
            onClick={() => poki.set(p.slug, value || 1, u)}
          >
            {u === "annad"
              ? "Annað"
              : u === "pokar"
                ? "Pokar"
                : u === "kassar"
                  ? "Kassar"
                  : "Stærri pakkning"}
          </button>
        ))}
      </div>
      <small className="hb-unitDetail">{detail}</small>
      {chosen === "annad" && (
        <label className="hb-other" htmlFor={`${source}-other-${p.slug}`}>
          Hvernig viltu fá þessa vöru?
          <input
            id={`${source}-other-${p.slug}`}
            maxLength={240}
            value={line?.other || ""}
            placeholder="Til dæmis blandað í kassa"
            onChange={(e) =>
              poki.set(p.slug, value || 1, "annad", e.target.value)
            }
          />
        </label>
      )}
    </div>
  );
}
const fields = [
  { key: "company", label: "Fyrirtæki", required: true, auto: "organization" },
  {
    key: "kt",
    label: "Kennitala",
    required: true,
    inputMode: "numeric" as const,
  },
  { key: "contact", label: "Tengiliður", auto: "name" },
  { key: "phone", label: "Sími", type: "tel", auto: "tel" },
  {
    key: "email",
    label: "Netfang",
    required: true,
    type: "email",
    auto: "email",
  },
  { key: "address", label: "Afhendingarstaður", auto: "street-address" },
  { key: "date", label: "Óskuð afhending", type: "date" },
];
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const productTitle = (p: Product) =>
  `${p.name.is}${p.weight && !p.name.is.toLowerCase().replace(/\s/g, "").includes(p.weight.toLowerCase().replace(/\s/g, "")) ? ` ${p.weight}` : ""}`;
const orderText = (
  company: Record<string, string>,
  l: PokaLina[],
  note: string,
) =>
  buildOrderText(
    company,
    l,
    Object.fromEntries(PRODUCTS.map((p) => [p.slug, productTitle(p)])),
    fields,
    note,
  );

export function Poki() {
  const rawLines = usePoki(),
    l = KATALOGUR.flatMap((g) => g.items).flatMap((p) =>
      rawLines.filter((x) => x.slug === p.slug),
    ),
    on = useSyncExternalStore(sub, snapOpen, snapOpen);
  // Speed (Claude 11-11): the closed window used to build ~1,300 elements at page load, half the page.
  // Its contents mount on first open, or when the browser is idle after load so the first open stays instant.
  const everOpened = useRef(false);
  if (on) everOpened.current = true;
  const [idleReady, setIdleReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) { const id = w.requestIdleCallback(() => setIdleReady(true), { timeout: 5000 }); return () => w.cancelIdleCallback?.(id); }
    const t = window.setTimeout(() => setIdleReady(true), 3000); return () => window.clearTimeout(t);
  }, []);
  const panel = useRef<HTMLDivElement | null>(null),
    helpPanel = useRef<HTMLDivElement>(null),
    helpButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [search, setSearch] = useState(""),
    [step, setStep] = useState<"products" | "company" | "receipt">("products");
  const [expanded, setExpanded] = useState(false),
    [help, setHelp] = useState(false),
    [confirm, setConfirm] = useState(false);
  const [undo, setUndo] = useState<PokaLina[] | null>(null),
    [message, setMessage] = useState("");
  const [company, setCompany] = useState<Record<string, string>>({}),
    [errors, setErrors] = useState<Record<string, string>>({});
  const [remember, setRemember] = useState(false),
    [saved, setSaved] = useState<Remembered | null>(null);
  const [activeCategory, setActiveCategory] = useState(KATALOGUR[0].s);
  const [receipt, setReceipt] = useState("");
  const [receiptOrder, setReceiptOrder] = useState<{
    company: Record<string, string>;
    lines: PokaLina[];
    note: string;
  }>({ company: {}, lines: [], note: "" });
  const [onlyOrdered, setOnlyOrdered] = useState(false);
  const [orderNote, setOrderNote] = useState(() => {
    try {
      return sessionStorage.getItem("hb-order-note") || "";
    } catch {
      return "";
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem("hb-order-note", orderNote);
    } catch {
      /* Optional draft. */
    }
  }, [orderNote]);
  const [leaving, setLeaving] = useState(false);
  const stepTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(stepTimer.current), []);
  const [helpShown, setHelpShown] = useState(false);
  useEffect(() => {
    if (help) {
      setHelpShown(true);
      return;
    }
    const timer = setTimeout(
      () => setHelpShown(false),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : MOTION.ui,
    );
    return () => clearTimeout(timer);
  }, [help]);
  const helpOpen = useRef(false);
  helpOpen.current = help;
  useEffect(() => {
    if (!on) return;
    let remembered: Remembered | null = null;
    try {
      remembered = readRemember(localStorage);
    } catch {
      /* Storage may be blocked. */
    }
    setSaved(remembered);
    setRemember(!!remembered);
    if (remembered) setCompany({ ...remembered.company, date: "", note: "" });
    setConfirm(false);
    setHelp(false);
    setExpanded(false);
    const p = panel.current!;
    const root = document.documentElement,
      body = document.body;
    const oldOverflow = root.style.overflow,
      oldBodyOverflow = body.style.overflow;
    const scrollY = window.scrollY;
    const oldBody = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    const lenis = (
      window as unknown as {
        __hbLenis?: { stop: () => void; start: () => void };
      }
    ).__hbLenis;
    lenis?.stop();
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    const siblings = [...p.parentElement!.children].filter(
      (el) =>
        el !== p &&
        !el.classList.contains("hb-pokiBak") &&
        !el.hasAttribute("inert"),
    );
    siblings.forEach((el) => el.setAttribute("inert", ""));
    const viewport = () => {
      const v = window.visualViewport;
      p.style.setProperty(
        "--order-height",
        `${v?.height || window.innerHeight}px`,
      );
      p.style.setProperty("--order-top", `${v?.offsetTop || 0}px`);
    };
    viewport();
    window.visualViewport?.addEventListener("resize", viewport);
    window.visualViewport?.addEventListener("scroll", viewport);
    window.addEventListener("resize", viewport);
    const t = window.setTimeout(
      () =>
        (opening.keyboard ? p.querySelector<HTMLElement>("button") : p)?.focus({
          preventScroll: true,
        }),
      30,
    );
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (helpOpen.current) {
          setHelp(false);
          helpButton.current?.focus();
        } else poki.open(false);
        return;
      }
      if (e.key !== "Tab") return;
      const scope = helpOpen.current ? helpPanel.current! : p;
      const controls = [
        ...scope.querySelectorAll<HTMLElement>(
          "button,a[href],input,select,textarea,summary",
        ),
      ].filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          el.tabIndex >= 0 &&
          el.getClientRects().length &&
          getComputedStyle(el).visibility !== "hidden" &&
          !el.closest("[hidden]"),
      );
      const first = controls[0],
        last = controls[controls.length - 1];
      if (!first) {
        e.preventDefault();
        scope.focus();
        return;
      }
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !controls.includes(document.activeElement as HTMLElement))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !scope.contains(document.activeElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", key, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", key, true);
      window.visualViewport?.removeEventListener("resize", viewport);
      window.visualViewport?.removeEventListener("scroll", viewport);
      window.removeEventListener("resize", viewport);
      siblings.forEach((el) => el.removeAttribute("inert"));
      root.style.overflow = oldOverflow;
      body.style.overflow = oldBodyOverflow;
      Object.assign(body.style, oldBody);
      window.scrollTo(0, scrollY);
      lenis?.start();
      if (
        opening.trigger?.isConnected &&
        opening.trigger.getClientRects().length
      )
        opening.trigger.focus({ preventScroll: true });
      else
        document
          .querySelector<HTMLElement>(".hb-braud")
          ?.focus({ preventScroll: true });
    };
  }, [on]);
  useEffect(() => {
    if (help && helpShown) helpPanel.current?.focus({ preventScroll: true });
  }, [help, helpShown]);
  useEffect(() => {
    if (!on) return;
    const p = panel.current;
    p?.querySelector(".hb-orderMain")?.scrollTo(0, 0);
  }, [step, on]);
  const go = (s: typeof step) => {
    clearTimeout(stepTimer.current);
    setLeaving(true);
    panel.current?.focus({ preventScroll: true });
    stepTimer.current = setTimeout(
      () => {
        setStep(s);
        setLeaving(false);
        setExpanded(false);
        setConfirm(false);
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : MOTION.fast,
    );
  };
  const repeat = (order: Remembered["orders"][number]) => {
    poki.replace(
      repeatOrder(
        order,
        PRODUCTS.map((p) => p.slug),
      ),
    );
    go("products");
    setMessage("Fyrri pöntun komin á listann. Þú getur breytt henni.");
    setUndo(null);
  };
  const remove = (slug: string) => {
    setUndo(l.filter((x) => x.slug === slug).map((x) => ({ ...x })));
    poki.set(slug, 0);
    setMessage("Vara fjarlægð af listanum.");
  };
  const forget = () => {
    let ok = false;
    try {
      ok = forgetRemember(localStorage);
    } catch {
      /* Optional storage. */
    }
    setSaved(null);
    setRemember(false);
    setCompany({});
    setMessage(
      ok
        ? "Upplýsingum hefur verið eytt úr þessu tæki."
        : "Ekki tókst að eyða vistuðum upplýsingum. Athugaðu stillingar vafrans.",
    );
    setUndo(null);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!company.company?.trim()) next.company = "Skrifaðu nafn fyrirtækisins.";
    if (!validKennitala(company.kt || ""))
      next.kt = "Skrifaðu gilda kennitölu með 10 tölustöfum.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email?.trim() || ""))
      next.email = "Skrifaðu gilt netfang.";
    if (
      company.date &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(company.date) || company.date < today())
    )
      next.date = "Veldu dag í dag eða síðar.";
    if (!l.length) {
      go("products");
      setMessage("Veldu að minnsta kosti eina vöru.");
      return;
    }
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const brief = orderText(company, l, orderNote);
    if (remember) {
      let stored: Remembered | null = null;
      try {
        stored = saveRemember(
          localStorage,
          { ...company, date: "", note: "" },
          l,
        );
      } catch {
        /* Optional storage. */
      }
      setSaved(stored);
      setMessage(stored ? "" : "Vafrinn leyfir ekki vistun á þessu tæki.");
    } else {
      try {
        forgetRemember(localStorage);
      } catch {
        /* Optional storage. */
      }
      setSaved(null);
    }
    setReceipt(brief);
    setReceiptOrder({
      company: { ...company },
      lines: l.map((x) => ({ ...x })),
      note: orderNote,
    });
    window.location.href = `mailto:pantanir@hberg.is?subject=${encodeURIComponent(`Pöntun · ${company.company.trim()}`)}&body=${encodeURIComponent(brief)}`;
    go("receipt");
  };
  const fold = (s: string) =>
    s
      .toLocaleLowerCase("is")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ð/g, "d")
      .replace(/þ/g, "th")
      .replace(/æ/g, "ae");
  const groups = KATALOGUR.map((g) => ({
    ...g,
    items: g.items.filter(
      (p) =>
        fold(`${p.name.is} ${g.t}`).includes(fold(search.trim())) &&
        (!onlyOrdered || l.some((x) => x.slug === p.slug)),
    ),
  })).filter((g) => g.items.length);
  if (!on && !everOpened.current && !idleReady) return null;
  return (
    <>
      <div
        className={`hb-pokiBak${on ? " on" : ""}`}
        onClick={() => poki.open(false)}
        aria-hidden="true"
      />
      <div
        ref={(el) => {
          panel.current = el;
          el?.toggleAttribute("inert", !on);
        }}
        tabIndex={-1}
        className={`hb-order${on ? " on" : ""}`}
        role="dialog"
        aria-modal={on ? true : undefined}
        aria-labelledby={`${id}-title`}
        aria-hidden={!on}
        data-lenis-prevent=""
      >
        <header className="hb-orderHead">
          <div>
            <span className="hb-orderEyebrow">H-Berg fyrir fyrirtæki</span>
            <h2 id={`${id}-title`}>
              {step === "receipt" ? "Pöntunin er tilbúin" : "Pöntunarlistinn"}
            </h2>
          </div>
          <nav className="hb-orderSteps" aria-label="Skref pöntunar">
            {(["products", "company", "receipt"] as const).map((s, i) => {
              const current = ["products", "company", "receipt"].indexOf(step);
              return (
                <button
                  key={s}
                  disabled={i >= current}
                  aria-current={s === step ? "step" : undefined}
                  onClick={() => go(s)}
                >
                  <span aria-hidden="true">{i < current ? "✓" : i + 1}</span>
                  {["Vörur", "Upplýsingar", "Staðfesting"][i]}
                </button>
              );
            })}
          </nav>
          <button
            className="hb-orderIcon"
            aria-label="Loka pöntun"
            onClick={() => poki.open(false)}
          >
            ×
          </button>
        </header>
        <div
          className={`hb-orderLayout${step !== "products" ? " is-details" : ""}`}
        >
          {step === "products" && (
            <nav className="hb-orderRail" aria-label="Vöruflokkar">
              {KATALOGUR.map((g) => (
                <button
                  key={g.s}
                  aria-current={activeCategory === g.s ? "location" : undefined}
                  onClick={() => {
                    setSearch("");
                    requestAnimationFrame(() =>
                      document
                        .getElementById(`${id}-group-${g.s}`)
                        ?.scrollIntoView({
                          block: "start",
                          behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)",
                          ).matches
                            ? "instant"
                            : "smooth",
                        }),
                    );
                  }}
                >
                  {g.t}
                  {l.some((x) => g.items.some((p) => p.slug === x.slug)) && (
                    <b className="hb-orderCategoryCount">
                      {
                        l.filter((x) => g.items.some((p) => p.slug === x.slug))
                          .length
                      }
                      <span className="hb-orderSr"> pantaðar vörur</span>
                    </b>
                  )}
                </button>
              ))}
            </nav>
          )}
          <main
            key={step}
            className={`hb-orderMain${leaving ? " step-leaving" : ""}`}
            onScroll={(e) => {
              if (step !== "products") return;
              const root = e.currentTarget;
              const top = root.getBoundingClientRect().top;
              const sections = [
                ...root.querySelectorAll<HTMLElement>(".hb-orderGroup"),
              ];
              const inView = sections.find(
                (el) => el.getBoundingClientRect().bottom > top + 60,
              );
              if (inView) setActiveCategory(inView.id.split("-group-")[1]);
            }}
          >
            {step !== "receipt" && (
              <div className="hb-orderIntro">
                <p>
                  Þetta pöntunarform er eingöngu fyrir fyrirtæki: verslanir,
                  veitingastaði, mötuneyti, hótel og aðra endursöluaðila.
                </p>
                <p>
                  Einstaklingar kaupa H-Berg í verslunum.{" "}
                  <button
                    className="hb-orderLink"
                    onClick={() => {
                      poki.open(false);
                      window.setTimeout(() => pop.open({ k: "hvar" }), 0);
                    }}
                  >
                    Hvar fæst H-Berg?
                  </button>
                </p>
              </div>
            )}
            {step === "products" && (
              <>
                {!!saved?.orders.length && (
                  <section
                    className="hb-orderRemember"
                    aria-label="Fyrri pantanir"
                  >
                    <h3>Pantað áður</h3>
                    <ul className="hb-orderPrevious">
                      {repeatOrder(
                        {
                          date: "",
                          lines: cleanLines(
                            saved.orders.flatMap((o) => o.lines),
                          ),
                        },
                        PRODUCTS.map((p) => p.slug),
                      ).map((x) => (
                        <li key={x.slug}>
                          <span>
                            <strong>{productBySlug(x.slug)!.name.is}</strong>
                            <small>{lineDescription(x)}</small>
                          </span>
                          <button
                            className="hb-orderLink"
                            onClick={() => {
                              poki.set(x.slug, x.magn, x.unit, x.other);
                              setMessage(
                                "Vara komin á listann eins og síðast.",
                              );
                            }}
                          >
                            Sama og síðast
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="hb-hnappur"
                      onClick={() => repeat(saved.orders[0])}
                    >
                      Panta það sama aftur
                    </button>
                    <ul>
                      {saved.orders.map((o, i) => (
                        <li key={`${o.date}-${i}`}>
                          <span>
                            {new Intl.DateTimeFormat("is-IS", {
                              day: "numeric",
                              month: "short",
                            }).format(new Date(o.date))}{" "}
                            · {o.lines.length}{" "}
                            {countWord(o.lines.length, "vara", "vörur")}
                          </span>
                          <button
                            className="hb-orderLink"
                            onClick={() => repeat(o)}
                          >
                            Nota aftur
                            <span className="hb-orderSr">
                              {" "}
                              pöntun frá {o.date.slice(0, 10)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button className="hb-orderLink" onClick={forget}>
                      Gleyma mér
                    </button>
                  </section>
                )}
                <div className="hb-orderSearch">
                  <label htmlFor={`${id}-search`}>Leita að vöru</label>
                  <div className="hb-orderSearchBox">
                    <input
                      id={`${id}-search`}
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Nafn vöru"
                    />
                    {!!search && (
                      <button
                        className="hb-orderIcon"
                        aria-label="Hreinsa leit"
                        onClick={() => {
                          setSearch("");
                          document.getElementById(`${id}-search`)?.focus();
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <button
                    className="hb-orderFilter"
                    aria-pressed={onlyOrdered}
                    onClick={() => setOnlyOrdered((v) => !v)}
                  >
                    <span aria-hidden="true">{onlyOrdered ? "✓" : "+"}</span>{" "}
                    Aðeins í pöntun
                  </button>
                  <button
                    ref={helpButton}
                    className="hb-orderLink"
                    aria-haspopup="dialog"
                    aria-expanded={help}
                    aria-controls={`${id}-help`}
                    onClick={() => setHelp(true)}
                  >
                    Hvernig skrifa ég magnið? <span aria-hidden="true">ⓘ</span>
                  </button>
                </div>
                {!groups.length && (
                  <div className="hb-orderEmpty" role="status">
                    <h3>Engin vara fannst</h3>
                    <p>Prófaðu annað orð eða skoðaðu allar vörurnar.</p>
                    <button
                      className="hb-orderLink"
                      onClick={() => {
                        setSearch("");
                        setOnlyOrdered(false);
                      }}
                    >
                      Sýna allar vörur
                    </button>
                  </div>
                )}
                {groups.map((g) => (
                  <section
                    key={g.s}
                    id={`${id}-group-${g.s}`}
                    className="hb-orderGroup"
                  >
                    <h3>{g.t}</h3>
                    <ul>
                      {g.items.map((p) => {
                        const line = l.find((x) => x.slug === p.slug);
                        return (
                          <li
                            key={p.slug}
                            className={`hb-orderRow${line ? " has-order" : ""}`}
                            style={{ "--row-tint": p.tint } as CSSProperties}
                          >
                            <img
                              src={PK(p.slug, "pack", "s")}
                              alt=""
                              width={72}
                              height={80}
                              style={{ background: p.tint }}
                              loading="lazy"
                            />
                            <div className="hb-orderName">
                              <strong>{p.name.is}</strong>
                              {(p.weight || p.iKassa) && (
                                <small>
                                  {p.weight}
                                  {p.iKassa
                                    ? ` · ${p.iKassa} pokar í kassa`
                                    : ""}
                                </small>
                              )}
                              <AllergenBadges p={p} />
                              <span
                                className="hb-orderTick"
                                aria-label={
                                  line ? "Á pöntunarlista" : undefined
                                }
                              >
                                {line && (
                                  <span key={line.slug}>
                                    ✓{" "}
                                    <span className="hb-orderSr">
                                      Á listanum
                                    </span>
                                  </span>
                                )}
                              </span>
                            </div>
                            <Amount
                              p={p}
                              line={line}
                              source={`${id}-catalog`}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </>
            )}
            {step === "company" && (
              <form
                id={`${id}-form`}
                className="hb-orderForm"
                noValidate
                onSubmit={submit}
              >
                <button
                  type="button"
                  className="hb-orderLink"
                  onClick={() => go("products")}
                >
                  ← Aftur í vörur
                </button>
                <h3>Upplýsingar um fyrirtæki</h3>
                <p>Reitir merktir * eru nauðsynlegir.</p>
                <div className="hb-orderFields">
                  {fields.map((f) => (
                    <label key={f.key} htmlFor={`${id}-${f.key}`}>
                      {f.label}
                      {f.required ? " *" : ""}
                      <input
                        id={`${id}-${f.key}`}
                        name={f.key}
                        type={f.type || "text"}
                        autoComplete={f.auto}
                        inputMode={f.inputMode}
                        required={f.required}
                        min={f.type === "date" ? today() : undefined}
                        value={
                          f.key === "kt"
                            ? formatKennitala(company.kt || "")
                            : company[f.key] || ""
                        }
                        maxLength={f.key === "kt" ? 11 : undefined}
                        aria-invalid={!!errors[f.key]}
                        aria-describedby={
                          errors[f.key] ? `${id}-${f.key}-error` : undefined
                        }
                        onChange={(e) => {
                          setCompany((c) => ({
                            ...c,
                            [f.key]:
                              f.key === "kt"
                                ? formatKennitala(e.target.value)
                                : e.target.value,
                          }));
                          setErrors((old) => {
                            const n = { ...old };
                            delete n[f.key];
                            return n;
                          });
                        }}
                      />
                      {f.key === "date" && (
                        <span className="hb-dateChips">
                          {nextWorkingDays(today()).map((date) => (
                            <button
                              type="button"
                              key={date}
                              aria-pressed={company.date === date}
                              onClick={() => {
                                setCompany((c) => ({ ...c, date }));
                                setErrors((old) => {
                                  const n = { ...old };
                                  delete n.date;
                                  return n;
                                });
                              }}
                            >
                              {new Intl.DateTimeFormat("is-IS", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              }).format(new Date(`${date}T12:00:00`))}
                            </button>
                          ))}
                        </span>
                      )}
                      {f.key === "kt" && validKennitala(company.kt || "") && (
                        <span className="hb-orderValid">✓ Gild kennitala</span>
                      )}
                      {errors[f.key] && (
                        <span
                          className="hb-orderError"
                          id={`${id}-${f.key}-error`}
                          role="alert"
                        >
                          {errors[f.key]}
                        </span>
                      )}
                    </label>
                  ))}
                  <label className="hb-orderWide" htmlFor={`${id}-note`}>
                    Athugasemd um afhendingu
                    <textarea
                      id={`${id}-note`}
                      rows={3}
                      placeholder="Til dæmis inngangur eða tengiliður við móttöku"
                      value={company.note || ""}
                      onChange={(e) =>
                        setCompany((c) => ({ ...c, note: e.target.value }))
                      }
                    />
                  </label>
                </div>
                <label className="hb-orderCheck">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => {
                      setRemember(e.target.checked);
                      if (!e.target.checked) {
                        try {
                          forgetRemember(localStorage);
                        } catch {
                          /* Optional storage. */
                        }
                        setSaved(null);
                      }
                    }}
                  />
                  Muna eftir mér á þessu tæki
                </label>
                <p className="hb-smatt">
                  Upplýsingar um fyrirtækið og síðustu fimm pantanir eru
                  vistaðar í þessum vafra ef þú velur að muna eftir þér.
                </p>
                {saved && (
                  <button
                    type="button"
                    className="hb-orderLink"
                    onClick={forget}
                  >
                    Gleyma mér
                  </button>
                )}
                <p>
                  Pöntunin opnast í tölvupóstforritinu þínu. Þar sendir þú hana
                  til pantanir@hberg.is.
                </p>
                <button className="hb-hnappur" type="submit">
                  Opna pöntun í tölvupósti
                </button>
              </form>
            )}
            {step === "receipt" && (
              <section className="hb-orderReceipt">
                <span aria-hidden="true">✓</span>
                <h3>Takk fyrir pöntunina</h3>
                <p>
                  Pöntunin er tilbúin í tölvupóstforritinu þínu. Mundu að senda
                  póstinn. H-Berg staðfestir magn, pakkningar og afhendingu
                  þegar pöntunin berst.
                </p>
                <p>
                  Ef tölvupóstforritið opnaðist ekki geturðu opnað póstinn aftur
                  eða afritað textann hér fyrir neðan.
                </p>
                <a
                  className="hb-hnappur"
                  href={`mailto:pantanir@hberg.is?subject=${encodeURIComponent("Pöntun til H-Berg")}&body=${encodeURIComponent(receipt)}`}
                >
                  Opna tölvupóst aftur
                </a>
                <div className="hb-orderReceiptActions">
                  <button
                    className="hb-orderLink"
                    onClick={() => window.print()}
                  >
                    Prenta
                  </button>
                  <button
                    className="hb-orderLink"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(receipt);
                        setMessage("Pöntun afrituð.");
                      } catch {
                        setMessage(
                          "Opnaðu texta pöntunar hér fyrir neðan til að afrita.",
                        );
                      }
                    }}
                  >
                    Afrita pöntun
                  </button>
                </div>
                <div className="hb-orderReceiptSlip">
                  <h4>Pöntun til H-Berg</h4>
                  <dl>
                    {[
                      ...fields,
                      { key: "note", label: "Athugasemd um afhendingu" },
                    ].map((f) => (
                      <div key={f.key}>
                        <dt>{f.label}</dt>
                        <dd>
                          {receiptOrder.company[f.key] || "Ekki tilgreint"}
                        </dd>
                      </div>
                    ))}
                    {receiptOrder.note && (
                      <div>
                        <dt>Óskir um pöntun</dt>
                        <dd>{receiptOrder.note}</dd>
                      </div>
                    )}
                  </dl>
                  <ul>
                    {receiptOrder.lines.map((x) => (
                      <li key={x.slug}>
                        <strong>{productTitle(productBySlug(x.slug)!)}</strong>
                        <span>{lineDescription(x)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <details>
                  <summary>Texti pöntunar til að afrita</summary>
                  <pre>{receipt}</pre>
                </details>
                <button className="hb-orderLink" onClick={() => go("company")}>
                  ← Aftur í upplýsingar
                </button>
                <button
                  className="hb-orderLink"
                  onClick={() => {
                    poki.clear();
                    setReceipt("");
                    setOrderNote("");
                    go("products");
                  }}
                >
                  Ný pöntun
                </button>
              </section>
            )}
          </main>
          {step !== "receipt" && (
            <aside
              className={`hb-orderSlip${expanded ? " expanded" : ""}`}
              aria-label="Pöntunin þín"
            >
              <button
                className="hb-orderBar"
                aria-expanded={expanded}
                aria-controls={`${id}-slip`}
                onClick={() => setExpanded((v) => !v)}
              >
                Pöntun · {l.length} {countWord(l.length, "vara", "vörur")}{" "}
                <span aria-hidden="true">{expanded ? "⌄" : "⌃"}</span>
              </button>
              <div className="hb-orderSlipBody">
                <div id={`${id}-slip`} className="hb-orderSlipInner">
                  <div className="hb-orderSlipTitle">
                    <h3>Pöntunin þín</h3>
                    <button
                      className="hb-orderIcon"
                      disabled={!l.length}
                      aria-label="Hreinsa pöntun"
                      title="Hreinsa pöntun"
                      onClick={() => setConfirm(true)}
                    >
                      <Trash />
                    </button>
                  </div>
                  {confirm && (
                    <div className="hb-orderConfirm">
                      <p>Hreinsa alla pöntunina?</p>
                      <button
                        className="hb-orderLink"
                        onClick={() => {
                          setUndo(l.map((x) => ({ ...x })));
                          poki.clear();
                          setConfirm(false);
                          setMessage("Pöntun hreinsuð.");
                        }}
                      >
                        Hreinsa pöntun
                      </button>
                      <button
                        className="hb-orderLink"
                        onClick={() => setConfirm(false)}
                      >
                        Hætta við
                      </button>
                    </div>
                  )}
                  {!l.length && (
                    <p>
                      Listinn er tómur. Skrifaðu magn við vörurnar sem þú vilt
                      panta.
                    </p>
                  )}
                  <div className="hb-orderSummaryGroups">
                    {KATALOGUR.map((g) => {
                      const selected = l.filter((x) =>
                        g.items.some((p) => p.slug === x.slug),
                      );
                      return (
                        <section key={g.s}>
                          <h4>{g.t}</h4>
                          <SummaryLines
                            lines={selected}
                            source={`${id}-slip`}
                            remove={remove}
                          />
                        </section>
                      );
                    })}
                  </div>
                  <p className="hb-orderTotals">{orderTotals(l)}</p>
                  {step === "products" && (
                    <label
                      className="hb-orderNote"
                      htmlFor={`${id}-order-note`}
                    >
                      Eitthvað sérstakt við pöntunina?
                      <textarea
                        id={`${id}-order-note`}
                        rows={3}
                        maxLength={2000}
                        value={orderNote}
                        placeholder="Til dæmis hafið samband ef vara er ekki til"
                        onChange={(e) => setOrderNote(e.target.value)}
                      />
                    </label>
                  )}
                  {step === "company" && orderNote && (
                    <p className="hb-orderNotePreview">
                      <strong>Óskir um pöntun</strong>
                      {orderNote}
                    </p>
                  )}
                  <div className="hb-orderNotice" role="status">
                    {message}
                    {undo && (
                      <button
                        className="hb-orderLink"
                        onClick={() => {
                          poki.replace([
                            ...l,
                            ...undo.filter(
                              (old) =>
                                !l.some((current) => current.slug === old.slug),
                            ),
                          ]);
                          setUndo(null);
                          setMessage("Pöntun endurheimt.");
                        }}
                      >
                        Afturkalla
                      </button>
                    )}
                  </div>
                  <button
                    className="hb-hnappur"
                    disabled={!l.length}
                    onClick={() =>
                      go(step === "company" ? "products" : "company")
                    }
                  >
                    {step === "company"
                      ? "Breyta vörum"
                      : "Áfram í upplýsingar"}
                  </button>
                  {!l.length && (
                    <p className="hb-smatt">Veldu vörur til að halda áfram.</p>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
        <footer className="hb-orderFooter">
          {step !== "receipt" && (
            <button
              type="button"
              className="hb-orderFootCount"
              aria-expanded={expanded}
              aria-controls={`${id}-slip`}
              onClick={() => setExpanded((v) => !v)}
            >
              Pöntun · {l.length} {countWord(l.length, "vara", "vörur")}{" "}
              <span aria-hidden="true">{expanded ? "⌄" : "⌃"}</span>
            </button>
          )}
          <span className="hb-orderFootHint">
            {step === "products"
              ? "Veldu magn og pakkningu"
              : step === "company"
                ? "H-Berg staðfestir pöntunina þegar hún berst"
                : "Mundu að senda tölvupóstinn"}
          </span>
          <button className="hb-orderLink hb-orderFootClose" onClick={() => poki.open(false)}>
            Loka
          </button>
          {step === "products" && (
            <button
              className="hb-hnappur"
              disabled={!l.length}
              onClick={() => go("company")}
            >
              Áfram
            </button>
          )}
        </footer>
        {step === "receipt" && message && <p role="status">{message}</p>}
        {helpShown && (
          <div
            aria-hidden={!help}
            ref={(el) => el?.toggleAttribute("inert", !help)}
            className={`hb-orderHelpBack${help ? " on" : ""}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setHelp(false);
                helpButton.current?.focus();
              }
            }}
          >
            <div
              id={`${id}-help`}
              className="hb-orderHelp"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-help-title`}
              ref={helpPanel}
              tabIndex={-1}
            >
              <button
                className="hb-orderIcon"
                aria-label="Loka magnhjálp"
                onClick={() => {
                  setHelp(false);
                  helpButton.current?.focus();
                }}
              >
                ×
              </button>
              <h3 id={`${id}-help-title`}>Hvernig skrifa ég magnið?</h3>
              <p>Skrifaðu fjöldann í reitinn og veldu einingu við hliðina.</p>
              <ul>
                <li>
                  Pokar: fjöldi neytendapakkninga, þyngd birtist þegar hún er
                  þekkt.
                </li>
                <li>
                  Kassar: fjöldi heilla kassa, fjöldi í kassa staðfestur við
                  pöntun.
                </li>
                <li>Stærri pakkning: aðeins í boði þegar stærð er staðfest.</li>
                <li>
                  Annað: skrifaðu hvernig þú vilt fá vöruna í textareitinn.
                </li>
              </ul>
              <p>
                Pakkningar eru mismunandi eftir vörum. Þyngd birtist þegar hún
                er þekkt. H-Berg staðfestir pakkningar og fjölda poka í kassa
                þegar pöntunin berst.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SummaryLines({
  lines,
  source,
  remove,
}: {
  lines: PokaLina[];
  source: string;
  remove: (slug: string) => void;
}) {
  const [shown, setShown] = useState(lines);
  const signature = JSON.stringify(lines);
  useEffect(() => {
    setShown((previous) => [
      ...lines,
      ...previous.filter((x) => !lines.some((n) => n.slug === x.slug)),
    ]);
    const timer = setTimeout(
      () => setShown(lines),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : MOTION.ui,
    );
    return () => clearTimeout(timer);
  }, [signature]);
  return (
    <ul className="hb-orderLines">
      {shown.map((x) => {
        const p = productBySlug(x.slug)!,
          exiting = !lines.some((n) => n.slug === x.slug);
        return (
          <li
            className={`hb-summaryPresence${exiting ? " exiting" : ""}`}
            key={x.slug}
            ref={(el) => el?.toggleAttribute("inert", exiting)}
            aria-hidden={exiting || undefined}
          >
            <div className="hb-summaryClip">
              <div className="hb-summaryRow">
                <img
                  src={PK(p.slug, "pack", "s")}
                  alt=""
                  width={40}
                  height={48}
                  style={{ background: p.tint }}
                />
                <div>
                  <strong>{p.name.is}</strong>
                  <small>{lineDescription(x)}</small>
                </div>
                <button
                  className="hb-orderIcon"
                  aria-label={`Fjarlægja ${p.name.is}`}
                  onClick={() => remove(x.slug)}
                >
                  <Trash />
                </button>
                <Amount p={p} line={x} source={source} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
