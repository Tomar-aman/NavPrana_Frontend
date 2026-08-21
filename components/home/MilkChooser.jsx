import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { generateSlug } from "@/utils/slug";
import { milkType, featuredImage } from "@/lib/site";

/**
 * Server component — helps a first-time visitor pick between the two milks.
 *
 * The homepage sold both cow and buffalo ghee but gave no help choosing, which
 * is the most common reason someone leaves a two-variant catalogue. It also
 * puts both keyword clusters ("a2 desi cow ghee", "a2 buffalo ghee") into the
 * homepage's visible copy with real links behind them.
 */

const COPY = {
  cow: {
    label: "A2 Desi Cow Ghee",
    tag: "The everyday one",
    blurb:
      "Lighter, deep golden, easier to digest. This is the jar that sits by the stove and goes into everything.",
    picks: [
      "Daily cooking — dal, roti, khichdi, rice",
      "Lighter on the stomach; suits small children",
      "Ayurvedic and ritual use",
      "If you are buying ghee for the first time",
    ],
    href: "/a2-desi-cow-ghee",
    hrefLabel: "Read about A2 desi cow ghee",
  },
  buffalo: {
    label: "A2 Buffalo Ghee",
    tag: "The richer one",
    blurb:
      "Denser, pale ivory, higher in fat and minerals. More sustaining, and it holds up to heavy cooking.",
    picks: [
      "Sweets, halwa, laddoo, deep frying",
      "Higher in calcium and phosphorus",
      "Cold months and physically active days",
      "If you already cook with ghee regularly",
    ],
    href: "/products",
    hrefLabel: "See buffalo ghee sizes",
  },
};

function priceRange(items) {
  const prices = items
    .map((p) => Number(p.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!prices.length) return null;
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return lo === hi ? `₹${lo}` : `₹${lo} – ₹${hi}`;
}

function Column({ kind, items }) {
  const copy = COPY[kind];
  const image = featuredImage(items[0]);
  const range = priceRange(items);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="relative w-full h-44 md:h-48 bg-gray-50">
          <Image
            src={image}
            alt={`${copy.label} by NavPrana Organics`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/95 text-foreground shadow-sm">
            {copy.tag}
          </span>
        </div>
      )}

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="text-lg md:text-xl font-bold">{copy.label}</h3>
          {range && (
            <span className="text-sm font-bold text-foreground shrink-0">
              {range}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {copy.blurb}
        </p>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2.5">
          Pick this if
        </p>
        <ul className="space-y-1.5 mb-5">
          {copy.picks.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-muted-foreground">
              <Check size={15} className="text-primary shrink-0 mt-0.5" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {/* Direct links to the actual SKUs — crawlable, with the size as anchor text */}
        <div className="mt-auto space-y-2">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/products/${generateSlug(p.name)}`}
              className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition text-sm font-medium"
            >
              <span>{p.size || p.name}</span>
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                ₹{p.price}
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
          <Link
            href={copy.href}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline pt-1"
          >
            {copy.hrefLabel}
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MilkChooser({ products = [] }) {
  const cow = products.filter((p) => milkType(p) === "cow");
  const buffalo = products.filter((p) => milkType(p) === "buffalo");

  // Nothing to compare if the catalogue only carries one milk.
  if (!cow.length || !buffalo.length) return null;

  return (
    <section
      id="choose"
      aria-labelledby="choose-heading"
      className="py-12 md:py-16 md:px-15 bg-background"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Which one
          </div>
          <h2
            id="choose-heading"
            className="text-3xl md:text-5xl font-bold mb-3 md:mb-4"
          >
            Cow ghee or <span className="text-gradient">buffalo ghee</span>?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Neither is better in general — they behave differently in the pan.
            Plenty of households keep both.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <Column kind="cow" items={cow} />
          <Column kind="buffalo" items={buffalo} />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Still deciding?{" "}
          <Link
            href="/blog/cow-ghee-vs-buffalo-ghee-which-is-better"
            className="text-primary font-medium hover:underline"
          >
            Read the full comparison
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
