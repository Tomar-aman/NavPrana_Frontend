/**
 * Server component — renders in the initial HTML and adds nothing to the client
 * bundle. /products previously carried ~60 words of unique copy, which is far
 * too thin to compete on commercial ghee queries.
 */

const comparison = [
  {
    label: "Texture & colour",
    cow: "Golden, softer, grainier when set",
    buffalo: "Pale ivory, denser, firmer at room temperature",
  },
  {
    label: "Digestibility",
    cow: "Lighter — suits daily cooking and small children",
    buffalo: "Heavier — more sustaining, better for cold months",
  },
  {
    label: "Fat content",
    cow: "Slightly lower, higher in carotene",
    buffalo: "Higher, richer in calcium and phosphorus",
  },
  {
    label: "Best for",
    cow: "Dal, roti, khichdi, rice, ayurvedic use",
    buffalo: "Sweets, halwa, deep frying, laddoo, paratha",
  },
  {
    label: "Ayurvedic note",
    cow: "Considered sattvik and cooling; used in rasayana",
    buffalo: "Valued for strength (bala) and deeper sleep",
  },
];

const faqs = [
  {
    q: "What does A2 actually mean?",
    a: "A2 refers to the type of beta-casein protein in the milk. Indigenous Indian cow breeds and native buffaloes produce predominantly A2 beta-casein, while many high-yield crossbred cattle produce A1. A lot of people who find regular dairy heavy report that A2 sits easier — which is why we source only from native breeds.",
  },
  {
    q: "How long does an order take to arrive?",
    a: "Orders are packed within one to two working days and usually reach metro addresses in three to four days, and the rest of India in five to seven. You get a tracking link by email and SMS the moment the parcel leaves Morena.",
  },
  {
    q: "Which size should I buy first?",
    a: "If you are new to bilona ghee, start with 500 ml. An average family of four using ghee for daily tempering and rotis goes through 500 ml in about six to eight weeks. If you already cook with ghee regularly or bake sweets, the 1 litre jar works out cheaper per 100 ml.",
  },
  {
    q: "Will the glass jar survive shipping?",
    a: "Each jar is sealed, wrapped, and boxed with cushioning before it ships. Breakages are rare, but if a jar arrives damaged send us a photo within 48 hours and we replace it — you do not need to return the broken one.",
  },
  {
    q: "How should I store it, and how long does it keep?",
    a: "Ghee needs no refrigeration. Keep the jar tightly closed, away from direct sunlight, and always use a dry spoon — water is the only thing that will spoil it. Unopened, it keeps for 12 months; once opened, use within 6 months for the best aroma.",
  },
  {
    q: "Does ghee melt in transit during summer?",
    a: "It may soften or melt fully in transit, and that is harmless — ghee is shelf stable and does not spoil from melting. Leave the jar undisturbed for a few hours after it arrives and it sets again. The grain may look different from a jar that never melted; the ghee is unchanged.",
  },
];

export default function BuyingGuide() {
  // FAQPage structured data — makes these questions eligible for rich results
  // and gives AI answer engines something concrete to quote.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="container mx-auto px-4 md:px-15 pb-16 max-w-4xl">
        <div className="prose prose-neutral max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            How to choose your bilona ghee
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Every jar on this page is made the same way — cultured overnight,
            hand-churned, then slow-simmered in small batches at our unit in
            Morena, Madhya Pradesh. The only two decisions you need to make are
            which milk and which size.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We work with farmers along the Chambal river who keep indigenous cow
            breeds and native breed buffaloes on open grazing. Milk is collected
            twice daily and cultured the same evening, because curd made from
            milk more than a few hours old never churns the same way. Nothing is
            added at any stage — no palm oil, no vanaspati, no colour, no
            preservative, no synthetic flavour. Each batch is FSSAI certified and
            lab tested before it is filled.
          </p>
        </div>

        {/* Cow vs buffalo */}
        <div className="mt-10">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            A2 desi cow ghee or A2 buffalo ghee?
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-5">
            Neither is better in general — they behave differently, and plenty of
            households keep both. The short version: cow ghee is the lighter,
            everyday one; buffalo ghee is the richer, heavier one.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-sm min-w-[34rem]">
              <caption className="sr-only">
                A2 desi cow ghee compared with A2 buffalo bilona ghee
              </caption>
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th scope="col" className="px-4 py-3 font-semibold w-40">
                    &nbsp;
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    A2 Desi Cow Ghee
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    A2 Buffalo Ghee
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-foreground align-top"
                    >
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground align-top">
                      {row.cow}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground align-top">
                      {row.buffalo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sizing */}
        <div className="mt-10">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            500 ml or 1 litre?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            A 500 ml jar is the right first purchase — enough to cook with for
            six to eight weeks in a family of four, and small enough to finish
            while the aroma is at its best. The 1 litre jar costs less per 100 ml
            and makes sense once you know which milk you prefer, or if you cook
            sweets and fry regularly. Both sizes come from the same batch; only
            the fill differs.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h3 className="text-xl md:text-2xl font-bold mb-5">
            Questions people ask before ordering
          </h3>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <h4 className="font-semibold text-foreground mb-1.5">{f.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
