import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Leaf, Award, Truck, ArrowRight } from "lucide-react";
import { SITE_URL, getProducts, milkType, featuredImage } from "@/lib/site";
import { generateSlug } from "@/utils/slug";

/*
 * =============================================================================
 * IMPORTANT — before publishing, replace the two placeholders below with facts
 * you can stand behind. Everything else on this page is drawn from copy already
 * live on the site (indigenous cows, bilona method, Chambal valley, grass-fed,
 * FSSAI certified) and is safe as written.
 *
 *   BREED_LINE  — the specific indigenous breed(s) your farmers keep. Naming
 *                 the breed is one of the strongest trust and relevance signals
 *                 on a page like this, but it must be true, so it is left
 *                 generic here rather than invented.
 *   FARM_LINE   — how many farming families you work with, if you know it.
 *
 * Do not add medical claims. "Supports digestion", "boosts immunity" and the
 * like invite both regulatory trouble (FSSAI, ASCI) and Google's YMYL quality
 * scrutiny. Traditional and culinary framing is fine; therapeutic claims are not.
 * =============================================================================
 */
const BREED_LINE = "indigenous Indian cow breeds";
const FARM_LINE = "smallholder farming families along the Chambal";

const process = [
  {
    step: "Milking",
    body: `Milk is collected twice a day from ${BREED_LINE} kept on open grazing, not stall-fed on concentrate. It reaches our unit in Morena within a few hours.`,
  },
  {
    step: "Culturing",
    body: "The whole milk — not separated cream — is set into curd the same evening with a live starter, and left overnight. Curd made from milk that has sat for a day never churns the same way.",
  },
  {
    step: "Hand-churning",
    body: "The curd is churned by hand the next morning until the butter separates and rises. This is the bilona step that gives the method its name, and it is the step every industrial process skips.",
  },
  {
    step: "Slow simmering",
    body: "Only that butter goes into the pan, over a slow flame, until the water cooks off and the milk solids settle golden at the bottom. Rushing this stage is what makes ghee taste flat.",
  },
  {
    step: "Filling",
    body: "Each batch is filtered, lab tested, and filled into glass. Nothing is added at any stage — no palm oil, no vanaspati, no colour, no preservative, no synthetic flavour.",
  },
];

const faqs = [
  {
    q: "What is A2 desi cow ghee?",
    a: "A2 desi cow ghee is ghee made from the milk of indigenous Indian cow breeds, which produce predominantly A2 beta-casein protein. Many high-yield crossbred cattle produce A1 beta-casein instead. 'Desi' refers to the native breed, and when the ghee is also made by the bilona method it means the milk was cultured into curd and hand-churned rather than centrifuged.",
  },
  {
    q: "Is A2 cow ghee better than buffalo ghee?",
    a: "Neither is better in general — they suit different uses. Cow ghee is lighter, more golden, and easier to digest, which makes it the better everyday choice for dal, roti, khichdi and rice. Buffalo ghee is denser and higher in fat, calcium and phosphorus, which suits sweets, deep frying and colder months. Plenty of households keep both.",
  },
  {
    q: "How is bilona cow ghee different from regular cow ghee?",
    a: "Most cow ghee on shelves is made by spinning cream out of milk in a centrifuge and clarifying it — fast and cheap. Bilona ghee takes the longer route: whole milk is cultured into curd overnight, the curd is hand-churned to lift out the butter, and only that butter is slowly simmered. It needs roughly 30 litres of milk per litre of ghee and about four times as long, which is why it costs more and why the aroma and grain are different.",
  },
  {
    q: "How much A2 cow ghee should I use in a day?",
    a: "For most healthy adults, two to three teaspoons a day across meals is a reasonable amount, and that is roughly what traditional Indian cooking already uses. Ghee is calorie dense, so it is not something to add on top of an existing diet without accounting for it. If you have a specific condition or are managing your weight, ask your doctor or dietitian rather than following a general figure.",
  },
  {
    q: "How can I tell if cow ghee is pure?",
    a: "Two things you can check at home. Melt a spoonful in a pan — pure ghee turns to a clear golden liquid almost instantly and leaves no white residue behind. Or chill a little in a glass jar: pure ghee sets as one uniform layer, while ghee cut with vegetable fat separates into distinct layers with different colours.",
  },
  {
    q: "Does A2 cow ghee need refrigeration?",
    a: "No. Keep the jar closed, out of direct sunlight, and always use a dry spoon — moisture is the only thing that will spoil it. Unopened it keeps for 12 months; once opened, use it within about 6 months while the aroma is at its best.",
  },
  {
    q: "Is cow ghee suitable for people who cannot digest milk?",
    a: "Ghee is almost entirely milk fat — the lactose and most of the milk protein are removed with the solids during simmering, so many people who find milk heavy use ghee without trouble. It is not guaranteed to be lactose free, and anyone with a diagnosed dairy allergy should treat it as a dairy product and check with their doctor.",
  },
  {
    q: "Can I cook on high heat with cow ghee?",
    a: "Yes. Ghee has a smoke point around 250°C because the water and milk solids have already been cooked out, so it stays stable at tempering and frying temperatures where many refined oils start to break down.",
  },
];

const relatedReading = [
  {
    href: "/blog/cow-ghee-vs-buffalo-ghee-which-is-better",
    title: "Cow ghee vs buffalo ghee: which one should you buy?",
  },
  {
    href: "/blog/how-much-ghee-per-day-is-safe",
    title: "How much ghee per day is actually safe?",
  },
  {
    href: "/blog/ghee-vs-butter-vs-oil-which-is-healthier",
    title: "Ghee vs butter vs oil — which is healthier?",
  },
  {
    href: "/blog/ghee-on-empty-stomach-benefits-30-days",
    title: "Ghee on an empty stomach: what 30 days actually does",
  },
];

function cowProducts(products) {
  return products.filter((p) => milkType(p) === "cow");
}

export async function generateMetadata() {
  const products = cowProducts(await getProducts());
  const prices = products
    .map((p) => Number(p.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  const from = prices.length ? Math.min(...prices) : null;

  const title = "A2 Desi Cow Ghee — Pure Bilona Cow Ghee";
  const description =
    `Buy A2 desi cow ghee made the traditional bilona way from ${BREED_LINE} in the Chambal valley.` +
    (from ? ` 500 ml and 1 litre, from ₹${from}.` : "") +
    " Grass-fed, FSSAI certified, nothing added.";

  return {
    title,
    description,
    openGraph: { title, description, url: "/a2-desi-cow-ghee", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: "/a2-desi-cow-ghee" },
  };
}

export default async function Page() {
  const all = await getProducts();
  const products = cowProducts(all);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "A2 Desi Cow Ghee",
        item: `${SITE_URL}/a2-desi-cow-ghee`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-background mt-20">
        <main className="container mx-auto px-4 md:px-15 py-10 max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-muted-foreground mb-8">
            <ol className="flex items-center gap-2.5">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li className="text-foreground font-semibold" aria-current="page">
                A2 Desi Cow Ghee
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              <Leaf size={14} />
              Bilona Method
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-[1.1]">
              A2 Desi Cow Ghee, churned by hand
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Made from the milk of {BREED_LINE} kept on open grazing along the
              Chambal river. Cultured overnight, hand-churned the next morning,
              then slow-simmered in small batches at our unit in Morena, Madhya
              Pradesh. One ingredient, and nothing else.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                { icon: Leaf, label: "Grass-fed, indigenous breeds" },
                { icon: Award, label: "FSSAI certified" },
                { icon: Truck, label: "Free shipping above ₹999" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  <item.icon size={13} />
                  {item.label}
                </span>
              ))}
            </div>
          </header>

          {/* Products — the conversion point, and real crawlable links */}
          {products.length > 0 && (
            <section className="mb-14" aria-labelledby="buy">
              <h2 id="buy" className="text-2xl md:text-3xl font-bold mb-5">
                Buy A2 desi cow ghee
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {products.map((product) => {
                  const slug = generateSlug(product.name);
                  const image = featuredImage(product);
                  return (
                    <div
                      key={product.id}
                      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
                    >
                      {image && (
                        <div className="relative w-full h-52 bg-gray-50">
                          <Image
                            src={image}
                            alt={`${product.name} — pure A2 desi cow bilona ghee`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold leading-tight mb-2">
                          <Link
                            href={`/products/${slug}`}
                            className="hover:text-primary transition before:absolute before:inset-0 before:content-['']"
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-xl font-bold">₹{product.price}</span>
                          {product.max_price &&
                            Number(product.max_price) > Number(product.price) && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.max_price}
                              </span>
                            )}
                          {product.size && (
                            <span className="text-xs text-muted-foreground ml-auto bg-gray-50 px-2 py-0.5 rounded">
                              {product.size}
                            </span>
                          )}
                        </div>
                        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                          View details
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* What A2 means */}
          <section className="mb-12" aria-labelledby="what-a2">
            <h2 id="what-a2" className="text-2xl md:text-3xl font-bold mb-4">
              What &ldquo;A2&rdquo; actually means
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Cow&apos;s milk carries beta-casein protein in one of two
                variants, A1 or A2, depending on the animal&apos;s genetics.
                Indigenous Indian breeds produce predominantly A2. Many of the
                high-yield crossbred cattle that supply industrial dairy produce
                A1 instead, because those breeds were selected for volume rather
                than for what the milk carries.
              </p>
              <p>
                A lot of people who find ordinary dairy heavy report that A2
                sits easier on them. The research on why is still being argued
                over, and we are not going to overstate it — what we can say is
                that A2 is the milk Indian households cooked with for
                generations, and it is the only milk we buy.
              </p>
              <p>
                &ldquo;Desi&rdquo; is the other half of the label. It refers to
                the breed being native rather than crossbred. A jar marked A2
                desi cow ghee should mean both things: native breed, and milk
                that carries A2 beta-casein.
              </p>
            </div>
          </section>

          {/* How it's made */}
          <section className="mb-12" aria-labelledby="how-made">
            <h2 id="how-made" className="text-2xl md:text-3xl font-bold mb-3">
              How our bilona cow ghee is made
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Roughly 30 litres of milk go into one litre of ghee, and the whole
              cycle takes about four times as long as the industrial route. That
              is the entire reason bilona ghee costs what it does.
            </p>
            <ol className="space-y-4">
              {process.map((item, i) => (
                <li
                  key={item.step}
                  className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-5"
                >
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.step}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-sm text-muted-foreground leading-relaxed mt-5">
              We buy from {FARM_LINE}, which is why batches are small and why
              stock occasionally runs out rather than being topped up from
              somewhere else.
            </p>
          </section>

          {/* Cow vs buffalo */}
          <section className="mb-12" aria-labelledby="cow-vs-buffalo">
            <h2 id="cow-vs-buffalo" className="text-2xl md:text-3xl font-bold mb-4">
              Cow ghee or buffalo ghee?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              We make both, and we will not pretend one is simply better. They
              behave differently in the pan and on the plate.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
              <table className="w-full text-sm min-w-[32rem]">
                <caption className="sr-only">
                  A2 desi cow ghee compared with A2 buffalo bilona ghee
                </caption>
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th scope="col" className="px-4 py-3 font-semibold w-36">&nbsp;</th>
                    <th scope="col" className="px-4 py-3 font-semibold">A2 Desi Cow Ghee</th>
                    <th scope="col" className="px-4 py-3 font-semibold">A2 Buffalo Ghee</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Colour", "Deep golden", "Pale ivory, almost white"],
                    ["Texture", "Softer, grainy when set", "Denser, firmer at room temperature"],
                    ["Weight on the stomach", "Lighter, easier to digest", "Heavier, more sustaining"],
                    ["Fat content", "Slightly lower; more carotene", "Higher; more calcium and phosphorus"],
                    ["Cooks best", "Dal, roti, khichdi, rice", "Halwa, laddoo, sweets, deep frying"],
                    ["Traditionally used for", "Daily cooking, ayurvedic preparations", "Strength, cold weather, festive food"],
                  ].map(([label, cow, buffalo]) => (
                    <tr key={label} className="border-t border-gray-100">
                      <th scope="row" className="px-4 py-3 font-medium text-foreground align-top">
                        {label}
                      </th>
                      <td className="px-4 py-3 text-muted-foreground align-top">{cow}</td>
                      <td className="px-4 py-3 text-muted-foreground align-top">{buffalo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Want the buffalo one instead?{" "}
              <Link href="/products" className="text-primary font-medium hover:underline">
                See the full range
              </Link>
              .
            </p>
          </section>

          {/* Using it */}
          <section className="mb-12" aria-labelledby="using">
            <h2 id="using" className="text-2xl md:text-3xl font-bold mb-4">
              Using it, and keeping it
            </h2>
            <ul className="space-y-3">
              {[
                "A spoon into hot dal or over rice just before serving — this is where cow ghee is at its best, and where the aroma actually comes through.",
                "For tempering, let the ghee melt fully and shimmer before the seeds go in. It handles the heat; it just should not be smoking.",
                "Brush it on rotis and parathas straight off the tawa rather than into the dough — you use less and taste more.",
                "Store the jar closed, away from sunlight, and always use a dry spoon. Water is the only thing that spoils ghee.",
                "No refrigeration needed. Unopened it keeps 12 months; opened, use within about 6 months while it is aromatic.",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-muted-foreground leading-relaxed">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-1" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section className="mb-12" aria-labelledby="faq">
            <h2 id="faq" className="text-2xl md:text-3xl font-bold mb-5">
              A2 desi cow ghee: common questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-foreground mb-1.5">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related reading — pushes authority from the blog into this page */}
          <section aria-labelledby="reading" className="mb-6">
            <h2 id="reading" className="text-xl font-bold mb-4">
              Read next
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {relatedReading.map((post) => (
                <li key={post.href}>
                  <Link
                    href={post.href}
                    className="block bg-white rounded-xl border border-gray-100 p-4 text-sm font-medium hover:border-primary/40 hover:text-primary transition"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-xs text-muted-foreground leading-relaxed border-t border-gray-100 pt-5">
            Nothing on this page is medical advice. Ghee is a food, and how much
            of it suits you depends on your own diet and health — talk to a
            doctor or dietitian for anything specific to you.
          </p>
        </main>
      </div>
    </>
  );
}
