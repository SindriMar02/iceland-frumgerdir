import { useEffect, useState } from "react";
import { ALLERGENS, PK, type Product } from "./vorur";
import { KATALOGUR } from "./katalogur";
import {
  genitive,
  joinWords,
  langt,
  leita,
  peanutExplanation,
  productCount,
  skilmali,
  stutt,
} from "./ofnaemi";
import { ScrollArrows } from "./scroll-arrows";
import { pop } from "./popup";

const paths: Record<string, string> = {
  nuts: "M12 3C5 3 3 10 5 16s12 6 14-1S17 3 12 3ZM12 5v14M8 8l8 8",
  peanut:
    "M8 3c-5 0-6 6-2 9-4 5 0 10 4 9 3 0 3-4 5-5 6-2 7-8 3-11-4-4-6 1-10-2ZM7 7l3 2m-3 7 3 1m5-8 2 2",
  milk: "M9 3h6v4l3 4v10H6V11l3-4V3Zm0 4h6M6 12h12",
  gluten:
    "M12 3v18M12 9C6 9 5 6 5 4c5 0 7 2 7 5Zm0 5c6 0 7-3 7-5-5 0-7 2-7 5Zm0 5c-6 0-7-3-7-5 5 0 7 2 7 5Z",
  soy: "M5 19C2 9 10 2 20 4c1 11-5 18-15 15ZM7 17 17 7M9 14l-1-4m4 1 4 1",
  sesame: "M12 3C8 8 5 12 6 16s11 6 12 0S16 8 12 3ZM10 13l-1 3",
  sulphites: "M9 3h6M10 3v6L4 19c-1 2 1 2 8 2s9 0 8-2L14 9V3M7 15h10",
  mustard:
    "M12 3v7M8 6l4 3 4-3M8 12c-5 0-5 8 0 8s5-8 0-8Zm8 0c-5 0-5 8 0 8s5-8 0-8Z",
};
export function AllergenIcon({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[id] || paths.nuts} />
    </svg>
  );
}
export function AllergenBadges({
  p,
  selected = [],
}: {
  p: Product;
  selected?: string[];
}) {
  return (
    <span className="hb-allergenBadges">
      {p.allergens === null ? (
        "Ofnæmisupplýsingar vantar"
      ) : p.allergens.length ? (
        p.allergens.map((a) => (
          <span
            key={a}
            title="Inniheldur"
            className={selected.includes(a) ? "selected" : ""}
          >
            <AllergenIcon id={a} />
            {selected.includes(a) && <span aria-hidden="true">! </span>}
            {langt(a)}
          </span>
        ))
      ) : (
        null
      )}
    </span>
  );
}
export function Ingredients({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/((?<!\p{L})\p{Lu}{2,}(?!\p{L}))/gu)
        .map((s, i) =>
          /^(?:\p{Lu}){2,}$/u.test(s) ? <mark key={i}>{s}</mark> : s,
        )}
    </>
  );
}
const urlIds: Record<string, string> = {
  nuts: "hnetur",
  peanut: "jardhnetur",
  milk: "mjolk",
  gluten: "gluten",
  soy: "soja",
  sesame: "sesam",
  sulphites: "sulfit",
  mustard: "sinnep",
};
function readSelection() {
  const raw =
    new URLSearchParams(window.location.search).get("forðast")?.split(",") ||
    [];
  return ALLERGENS.filter((a) => raw.includes(urlIds[a.id])).map((a) => a.id);
}
export function AllergenSection() {
  const [avoid, setAvoid] = useState<string[]>(readSelection);
  useEffect(() => {
    const restore = () => setAvoid(readSelection());
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const choose = (next: string[]) => {
    setAvoid(next);
    const url = new URL(window.location.href);
    if (next.length)
      url.searchParams.set("forðast", next.map((a) => urlIds[a]).join(","));
    else url.searchParams.delete("forðast");
    window.history.replaceState(window.history.state, "", url);
  };
  const { an, henta, oljost } = leita(avoid);
  const group = (items: Product[], safe: boolean) => (
    <section className={`hb-allergenGroup ${safe ? "safe" : "warning"}`}>
      <h3>
        <span aria-hidden="true">{safe ? "✓" : "⚠"}</span>{" "}
        {safe
          ? `Án ${joinWords(avoid.map((a) => genitive[a]))} samkvæmt innihaldslýsingu`
          : `Inniheldur ${joinWords(avoid.map(stutt), "eða")}`}
      </h3>
      <p>{productCount(items.length)}</p>
      <ul className="hb-allergenResults">
        {items.map((p) => (
          <li key={p.slug}>
            <button
              className="hb-allergenCard"
              onClick={() => pop.open({ k: "vara", slug: p.slug })}
            >
              <span className="hb-allergenPack" style={{ background: p.tint }}>
                <img
                  src={PK(p.slug, "pack", "s")}
                  alt=""
                  width="72"
                  height="80"
                  loading="lazy"
                />
              </span>
              <span className="hb-allergenName">
                <strong>{p.name.is}</strong>
                {!safe && (
                  <span className="hb-allergenContains">
                    Inniheldur:{" "}
                    {joinWords(
                      (p.allergens || [])
                        .filter((a) => avoid.includes(a))
                        .map(langt),
                    )}
                  </span>
                )}
                <AllergenBadges p={p} selected={avoid} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {!items.length && (
        <p>
          {safe
            ? "Engin vara fannst án þessara ofnæmisvalda í innihaldslýsingu."
            : "Engin vara inniheldur valda ofnæmisvalda samkvæmt innihaldslýsingu."}
        </p>
      )}
    </section>
  );
  return (
    <section className="hb-form hb-ofn" id="ofnaemi" aria-labelledby="hb-ofn-t">
      <div className="hb-flipar hb-disp">
        <h2 id="hb-ofn-t" className="hb-disp">
          Ofnæmisvaldar
        </h2>
      </div>
      <div className="hb-formP">
        <div className="hb-quiz">
          <div>
            <p className="hb-quizQ" id="hb-ofn-q">
              Hverju þarftu að forðast?
            </p>
            <p>Þú getur valið fleiri en einn ofnæmisvald.</p>
            <div
              className="hb-allergenChoices"
              role="group"
              aria-labelledby="hb-ofn-q"
            >
              {ALLERGENS.map((a) => (
                <button
                  key={a.id}
                  aria-pressed={avoid.includes(a.id)}
                  onClick={() =>
                    choose(
                      avoid.includes(a.id)
                        ? avoid.filter((x) => x !== a.id)
                        : ALLERGENS.filter(
                            (x) => avoid.includes(x.id) || x.id === a.id,
                          ).map((x) => x.id),
                    )
                  }
                >
                  <AllergenIcon id={a.id} />
                  {a.is}
                  <span aria-hidden="true">
                    {avoid.includes(a.id) ? "✓" : "+"}
                  </span>
                </button>
              ))}
            </div>
            {!!avoid.length && (
              <button className="hb-allergenClear" onClick={() => choose([])}>
                Hreinsa
              </button>
            )}
            <p className="hb-allergenNote">{peanutExplanation}</p>
            <p className="hb-allergenDisclaimer">{skilmali}</p>
            <button
              className="hb-allergenClear"
              onClick={() => pop.open({ k: "ofnaemi" })}
            >
              Sjá allt ofnæmisyfirlitið →
            </button>
            <button className="hb-allergenClear" onClick={() => pop.open({ k: "naering" })}>Sjá næringargildi allra vara</button>
          </div>
          <div className="hb-allergenAnswer">
            {avoid.length ? (
              <>
                <p role="status" className="hb-allergenCount">
                  {productCount(an.length)} án valinna ofnæmisvalda samkvæmt
                  innihaldslýsingu. {productCount(henta.length)} með valda
                  ofnæmisvalda.
                </p>
                <div key={avoid.join(",")} className="hb-allergenFlow">
                  {group(an, true)}
                  {group(henta, false)}
                  {!!oljost.length && (
                    <p>
                      Ofnæmisupplýsingar vantar fyrir{" "}
                      {oljost.map((p) => p.name.is).join(", ")}. Hringdu í 565
                      6500.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="hb-allergenPreview">
                <p>
                  Veldu ofnæmisvald til að sjá hvaða vörur koma til greina
                  samkvæmt innihaldslýsingu.
                </p>
                <p className="hb-smatt">
                  Fjöldi vara sem innihalda hvern ofnæmisvald
                </p>
                <ul>
                  {ALLERGENS.map((a) => (
                    <li key={a.id}>
                      <AllergenIcon id={a.id} />
                      <span>{a.is}</span>
                      <strong>
                        {
                          KATALOGUR.flatMap((g) => g.items).filter((p) =>
                            p.allergens?.includes(a.id),
                          ).length
                        }
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export function AllergenOverview() {
  const [line, setLine] = useState("");
  const groups = KATALOGUR.filter((g) => !line || g.s === line);
  return (
    <>
      <p className="hb-allergenDisclaimer">{skilmali}</p>
      <p>{peanutExplanation}</p>
      <label className="hb-allergenFilter">
        Vörulína
        <select value={line} onChange={(e) => setLine(e.target.value)}>
          <option value="">Allar vörulínur</option>
          {KATALOGUR.map((g) => (
            <option key={g.s} value={g.s}>
              {g.t}
            </option>
          ))}
        </select>
      </label>
      <p>
        ● Inniheldur samkvæmt innihaldslýsingu. ○ Ekki nefnt í innihaldslýsingu.
      </p>
      <ScrollArrows target=".hb-allergenMatrix" />
      <div
        className="hb-allergenMatrix"
        role="region"
        aria-label="Ofnæmisvaldar eftir vörum"
        tabIndex={0}
      >
        <table>
          <caption className="hb-orderSr">
            Ofnæmisvaldar eftir vörulínum og vörum
          </caption>
          <thead>
            <tr>
              <th scope="col">Vara</th>
              {ALLERGENS.map((a) => (
                <th key={a.id} scope="col">
                  {a.is}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.s}>
              <tr>
                <th
                  className="hb-allergenLine"
                  colSpan={ALLERGENS.length + 1}
                  scope="rowgroup"
                >
                  {g.t}
                </th>
              </tr>
              {g.items.map((p) => (
                <tr key={p.slug}>
                  <th scope="row">
                    <button
                      onClick={() => pop.open({ k: "vara", slug: p.slug })}
                    >
                      {p.name.is}
                    </button>
                  </th>
                  {ALLERGENS.map((a) => (
                    <td key={a.id}>
                      <span aria-hidden="true">
                        {p.allergens?.includes(a.id) ? "●" : "○"}
                      </span>
                      <span className="hb-orderSr">
                        {p.allergens?.includes(a.id)
                          ? "Inniheldur"
                          : "Ekki nefnt í innihaldslýsingu"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <div className="hb-allergenMobile">
        {groups.map((g) => (
          <section key={g.s}>
            <h3>{g.t}</h3>
            <ul>
              {g.items.map((p) => (
                <li key={p.slug}>
                  <button onClick={() => pop.open({ k: "vara", slug: p.slug })}>
                    <strong>{p.name.is}</strong>
                    <AllergenBadges p={p} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
