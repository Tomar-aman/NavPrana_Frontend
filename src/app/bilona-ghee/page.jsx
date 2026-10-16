import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Leaf, Award, Truck, ArrowRight, XCircle } from "lucide-react";
import { SITE_URL, getProducts, milkType, featuredImage } from "@/lib/site";
import { generateSlug } from "@/utils/slug";
import { fetchPricingServer } from "@/lib/pricing";

/*
 * =============================================================================
 * Commercial landing page for "bilona ghee", "pure bilona ghee", "best bilona
 * ghee" and "bilona ghee price". Search Console showed these queries landing on
 * individual 500 ml / 1 litre product pages at positions 30-50 — Google ranks a
 * category page for a category query, and the site had none for bilona.
 *
 * Facts here must stay consistent with /a2-desi-cow-ghee, productGuide.js and
 * public/llms.txt. Same rule as there: no medical claims.
 * =============================================================================
 */

const checklist = [
  {
    title: "It starts from curd, not cream",
    body: "Real bilona ghee is made from whole milk set into curd. If a brand cannot tell you that the milk was cultured before churning, it is most likely cream ghee with a bilona label.",
  },
  {
    title: "The price makes sense",
    body: "Roughly 30 litres of milk go into one litre of bilona ghee. A litre selling at the price of ordinary dairy ghee cannot have been made this way — the milk alone costs more than that.",
  },
  {
    title: "The source is named",
    body: "A good bilona ghee tells you which animal the milk came from (desi cow or buffalo) and where. 'Pure ghee' with no source is a marketing phrase, not information.",
  },
  {
    title: "Nothing is added",
    body: "The ingredient list should read one thing: ghee, or the milk fat it came from. No vanaspati, palm oil, colour, flavour or preservative.",
  },
  {
    title: "It is certified and lab tested",
    body: "FSSAI licensing is the legal minimum. Ask for batch lab reports too — a maker who tests will show them.",
  },
  {
    title: "It passes the home tests",
    body: "Melted, it should turn clear almost at once with no white residue. Chilled in a glass, it should set as one even layer. Ghee cut with vegetable fat separates.",
  },
];

const faqs = [
  {
    q: "What is bilona ghee?",
    a: "Bilona ghee is ghee made by the traditional curd-churn method. Whole milk is boiled and set into curd overnight, the curd is churned with a wooden bilona to separate the makkhan (butter), and only that butter is slowly simmered into ghee. Most ghee on shelves skips the curd and churning and is made from cream separated by a centrifuge.",
  },
  {
    q: "Which is the best bilona ghee?",
    a: "The best bilona ghee is the one you can verify: made from curd rather than cream, with the milk source and region named, nothing added, FSSAI certified and lab tested, and priced in line with the 30 or so litres of milk it takes. Use the checklist on this page to judge any brand, including ours.",
  },
  {
    q: "Why is bilona ghee so expensive?",
    a: "Because of the milk and the time. Bilona needs roughly 30 litres of milk for one litre of ghee and takes about four times as long as the cream route, with an overnight culture, hand-churning and slow simmering. Cheaper ghee is cheaper because it skips those steps.",
  },
  {
    q: "Is all bilona ghee A2?",
    a: "No. A2 depends on the animal, not the method. Bilona ghee from indigenous Indian cow breeds or native buffaloes is A2; bilona ghee from crossbred cattle is not. Look for both words — bilona for the method, A2 desi for the milk.",
  },
  {
    q: "Cow bilona ghee or buffalo bilona ghee — which should I buy?",
    a: "Cow bilona ghee is golden, lighter and the usual choice for everyday dal, roti, rice and for elders and children. Buffalo bilona ghee is white to pale cream, denser and richer, and suits sweets, deep frying and winter cooking. Many households keep both.",
  },
  {
    q: "Is 'bilona' a protected or certified term?",
    a: "No. There is no legal definition of bilona ghee in India, so any brand can print the word. That is why the method, the milk source, the lab report and the price matter more than the label.",
  },
  {
    q: "How long does bilona ghee last?",
    a: "Unopened, 12 months. Once opened, use it within about 6 months while the aroma is at its best. It needs no refrigeration — keep the jar closed, away from sunlight, and always use a dry spoon.",
  },
  {
    q: "Bilona ghee kya hota hai aur asli bilona ghee kaise pehchane?",
    a: "Bilona ghee dahi ko mathkar nikle makkhan se banta hai, cream se nahi. Asli pehchanne ke liye: brand doodh ka source aur area bataye, ingredient me sirf ghee ho, FSSAI aur lab report ho, aur ek chammach garam karne par turant saaf pighle aur koi safed residue na chhode.",
  },
];

const relatedReading = [
  {
    href: "/blog/what-is-bilona-ghee-method-explained",
    title: "What is bilona ghee? The method, step by step",
  },
  {
    href: "/blog/why-buffalo-a2-bilona-ghee-is-expensive",
    title: "Why bilona ghee costs more than regular ghee",
  },
  {
    href: "/blog/identify-pure-a2-buffalo-bilona-ghee",
    title: "How to identify pure bilona ghee at home",
  },
  {
    href: "/blog/cow-ghee-vs-buffalo-ghee-which-is-better",
    title: "Cow ghee vs buffalo ghee: which one should you buy?",
  },
];

function priceFrom(products) {
  const prices = products
    .map((p) => Number(p.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  return prices.length ? Math.min(...prices) : null;
}

export async function generateMetadata() {
  const from = priceFrom(await getProducts());

  const title = "Pure Bilona Ghee — Hand-Churned A2 Cow & Buffalo Ghee";
  const description =
    "Buy pure bilona ghee, made from curd and hand-churned in the Chambal valley. A2 desi cow and buffalo," +
    (from ? ` from ₹${from}.` : ".") +
    " FSSAI certified, lab tested, nothing added.";

  return {
    title,
    description,
    openGraph: { title, description, url: "/bilona-ghee", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: "/bilona-ghee" },
  };
}

export default async function Page() {
  const [all, pricing] = await Promise.all([getProducts(), fetchPricingServer()]);
  // Cow first: it is the larger search market and the everyday pick.
  const products = [...all].sort(
    (a, b) => (milkType(a) === "cow" ? 0 : 1) - (milkType(b) === "cow" ? 0 : 1),
  );

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
        name: "Bilona Ghee",
        item: `${SITE_URL}/bilona-ghee`,
      },
    ],
  };

  const itemListJsonLd = products.length > 0 && {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NavPrana bilona ghee",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/products/${generateSlug(p.name)}`,
      name: p.name,
    })),
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
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

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
                Bilona Ghee
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              <Leaf size={14} />
              Traditional Curd-Churn Method
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-[1.1]">
              Pure Bilona Ghee, made from curd and churned by hand
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Whole milk from grass-fed desi cows and buffaloes in the Chambal
              valley, set into curd overnight, hand-churned with a wooden
              bilona, and slow-simmered in small batches at our unit in Morena,
              Madhya Pradesh. Around 30 litres of milk in every litre, and
              nothing else.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                { icon: Leaf, label: "A2 desi cow & buffalo milk" },
                { icon: Award, label: "FSSAI certified, lab tested" },
                { icon: Truck, label: `Free shipping above ₹${Math.round(pricing.free_shipping_threshold)}` },
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
                Buy bilona ghee online
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {products.map((product) => {
                  const slug = generateSlug(product.name);
                  const image = featuredImage(product);
                  const kind =
                    milkType(product) === "cow"
                      ? "A2 desi cow bilona ghee"
                      : "A2 buffalo bilona ghee";
                  return (
                    <div
                      key={product.id}
                      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
                    >
                      {image && (
                        <div className="relative w-full h-52 bg-gray-50">
                          <Image
                            src={image}
                            alt={`${product.name} — pure ${kind}`}
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

          {/* What bilona means */}
          <section className="mb-12" aria-labelledby="what-bilona">
            <h2 id="what-bilona" className="text-2xl md:text-3xl font-bold mb-4">
              What makes ghee &ldquo;bilona&rdquo;
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A bilona is the wooden churning staff Indian households used to
                turn curd into makkhan. Bilona ghee is ghee made that way: milk
                is cultured into curd first, the curd is churned until the
                butter lifts out, and only that butter is simmered down.
              </p>
              <p>
                Most packaged ghee takes a shortcut. Cream is spun out of milk
                in a centrifuge and heated straight into ghee — no curd, no
                churning. It is quicker and far cheaper, and it is perfectly
                legal to sell. It just is not the same product, and the aroma,
                the grain and the price all show it.
              </p>
              <p>
                One thing worth knowing before you buy: the word
                &ldquo;bilona&rdquo; has no legal definition in India, so any
                brand can print it. The checklist below is how to tell the
                difference.
              </p>
            </div>
          </section>

          {/* Bilona vs regular */}
          <section className="mb-12" aria-labelledby="bilona-vs-regular">
            <h2 id="bilona-vs-regular" className="text-2xl md:text-3xl font-bold mb-4">
              Bilona ghee vs regular ghee
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
              <table className="w-full text-sm min-w-[32rem]">
                <caption className="sr-only">
                  Bilona ghee compared with regular cream-based ghee
                </caption>
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th scope="col" className="px-4 py-3 font-semibold w-36">&nbsp;</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Bilona ghee</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Regular (cream) ghee</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Starts from", "Whole milk set into curd", "Cream separated by centrifuge"],
                    ["Butter made by", "Churning curd with a bilona", "No churning — cream heated directly"],
                    ["Milk per litre", "About 30 litres", "Far less"],
                    ["Time taken", "Overnight culture + churning + slow simmer", "A few hours"],
                    ["Texture", "Natural grain (danedar) when set", "Often smooth and uniform"],
                    ["Aroma", "Deep, slightly tangy, nutty", "Milder"],
                    ["Price", "Higher — reflects the milk", "Lower"],
                  ].map(([label, bilona, regular]) => (
                    <tr key={label} className="border-t border-gray-100">
                      <th scope="row" className="px-4 py-3 font-medium text-foreground align-top">
                        {label}
                      </th>
                      <td className="px-4 py-3 text-muted-foreground align-top">{bilona}</td>
                      <td className="px-4 py-3 text-muted-foreground align-top">{regular}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Buyer's checklist — targets "best / pure bilona ghee" */}
          <section className="mb-12" aria-labelledby="choose">
            <h2 id="choose" className="text-2xl md:text-3xl font-bold mb-3">
              How to choose the best pure bilona ghee
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Six things to check on any jar — ours included.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {checklist.map((item) => (
                <li
                  key={item.title}
                  className="bg-white rounded-2xl border border-gray-100 p-5"
                >
                  <h3 className="flex items-start gap-2 font-semibold text-foreground mb-1.5">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3 rounded-2xl bg-amber-50 border border-amber-100 p-5 text-sm text-amber-900 leading-relaxed">
              <XCircle size={18} className="shrink-0 mt-0.5" />
              <p>
                Be wary of &ldquo;bilona&rdquo; ghee priced like ordinary ghee,
                labels that do not say which animal the milk came from, and
                strongly yellow &ldquo;buffalo&rdquo; ghee — buffalo milk has
                almost no beta-carotene, so pure buffalo ghee is white.
              </p>
            </div>
          </section>

          {/* Cow vs buffalo */}
          <section className="mb-12" aria-labelledby="cow-or-buffalo">
            <h2 id="cow-or-buffalo" className="text-2xl md:text-3xl font-bold mb-4">
              Cow bilona ghee or buffalo bilona ghee?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-foreground mb-2">A2 desi cow bilona ghee</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Golden, lighter, with a warm nutty aroma. The everyday choice
                  for dal, roti, khichdi and rice, and the one most families
                  pick for elders and children.
                </p>
                <Link href="/a2-desi-cow-ghee" className="text-sm text-primary font-medium hover:underline">
                  More about A2 desi cow ghee
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-foreground mb-2">A2 buffalo bilona ghee</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  White to pale cream, dense and rich, higher in fat, calcium
                  and phosphorus. Best for halwa, laddoo, deep frying and
                  winter cooking.
                </p>
                <Link
                  href="/blog/cow-ghee-vs-buffalo-ghee-which-is-better"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Compare cow and buffalo ghee
                </Link>
              </div>
            </div>
          </section>

          {/* Price */}
          <section className="mb-12" aria-labelledby="price">
            <h2 id="price" className="text-2xl md:text-3xl font-bold mb-4">
              Bilona ghee price: why it costs what it does
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The price of a litre of bilona ghee is mostly the price of
                about 30 litres of milk, plus a day and a half of culturing,
                churning and simmering. Cream ghee needs a fraction of the milk
                and a fraction of the time, which is why it sells for a
                fraction of the price.
              </p>
              <p>
                We buy from smallholder farming families along the Chambal and
                make in small batches, so stock occasionally runs out rather
                than being topped up from somewhere else. Current prices for
                each jar are listed above; shipping is free on orders above
                ₹{Math.round(pricing.free_shipping_threshold)}.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12" aria-labelledby="faq">
            <h2 id="faq" className="text-2xl md:text-3xl font-bold mb-5">
              Bilona ghee: common questions
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
