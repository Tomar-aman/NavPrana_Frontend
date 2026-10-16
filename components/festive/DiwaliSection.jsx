import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { generateSlug } from "@/utils/slug";
import { milkType } from "@/lib/site";
import { primaryVariants } from "@/lib/variants";
import FestiveSky from "./FestiveSky";

/**
 * Homepage Diwali block. Rendered only while activeFestival() is Diwali (see
 * src/app/page.js). Copy stays to culinary and traditional use — no health
 * claims, and no discount unless one is actually running.
 */

function Diya({ width = 40, height = 30 }) {
  return (
    <svg viewBox="0 0 64 48" width={width} height={height} aria-hidden="true">
      <path className="np-flame" d="M32 4 C26 14 27 20 32 24 C37 20 38 14 32 4 Z" fill="#f59e0b" />
      <path className="np-flame" d="M32 11 C29 16 30 19 32 21 C34 19 35 16 32 11 Z" fill="#fde68a" />
      <path d="M6 28 C10 42 54 42 58 28 Z" fill="#b45309" />
      <path d="M6 28 L58 28" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="34" r="1.6" fill="#fde68a" />
      <circle cx="32" cy="36" r="1.6" fill="#fde68a" />
      <circle cx="44" cy="34" r="1.6" fill="#fde68a" />
    </svg>
  );
}

export default function DiwaliSection({ products = [], festival }) {
  const families = primaryVariants(products);
  const href = (milk) => {
    const p = families.find((x) => milkType(x) === milk);
    return p ? `/products/${generateSlug(p.name)}` : "/products";
  };

  const cards = [
    {
      title: "For Diwali sweets",
      product: "A2 Buffalo Bilona Ghee",
      body: "Dense and rich, the traditional choice for besan laddoo, halwa, barfi and anything fried. Sweets made in real ghee keep their aroma for days.",
      href: href("buffalo"),
    },
    {
      title: "For puja and diyas",
      product: "A2 Desi Cow Bilona Ghee",
      body: "Golden, light and fragrant. Desi cow ghee is what families have traditionally lit diyas and offered at puja with, and it is the one for the festive thali too.",
      href: href("cow"),
    },
    {
      title: "For gifting",
      product: "500 ml & 1 litre glass jars",
      body: "A jar of hand-churned bilona ghee is a gift that actually gets used — in every meal of the season. Send one home, or to family who are far away.",
      href: "/products",
    },
  ];

  return (
    <section
      aria-labelledby="diwali"
      className="relative overflow-hidden pt-8 pb-12 md:pt-10 md:pb-16"
      // Inline so the backdrop holds even before the stylesheet does.
      style={{ background: "#ffffff" }}
    >
      <FestiveSky />
      <div className="relative container mx-auto px-4 md:px-15 max-w-6xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="np-diya-glow"><Diya width={40} height={30} /></span>
            <span className="font-semibold tracking-wider text-base" style={{ color: "#b45309" }}>
              शुभ दीपावली
            </span>
            <span className="np-diya-glow"><Diya width={40} height={30} /></span>
          </div>
          <h2 id="diwali" className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-foreground">
            This Diwali, make it with{" "}
            <span style={{ color: "#c2410c" }}>real bilona ghee</span>
          </h2>
          <p className="max-w-2xl mx-auto leading-relaxed text-muted-foreground">
            Mithai, diyas and the festive thali — the season runs on ghee.
            Ours is hand-churned from curd in the Chambal valley, with nothing
            added.
          </p>
        </div>

        <ul className="grid md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <li
              key={c.title}
              className="group relative bg-white rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition p-6 flex flex-col"
              style={{ border: "1px solid #fcd34d" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                {c.title}
              </span>
              <h3 className="text-lg font-bold mb-2">
                <Link
                  href={c.href}
                  className="hover:text-primary transition before:absolute before:inset-0 before:content-['']"
                >
                  {c.product}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.body}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Shop now
                <ArrowRight size={14} />
              </span>
            </li>
          ))}
        </ul>

        {festival?.orderBy && (
          <p className="text-center text-sm mt-8" style={{ color: "#92400e" }}>
            🪔 Order by <strong>{festival.orderBy}</strong> for delivery before
            Diwali in most of India.
          </p>
        )}

        {/* a row of lit diyas along the foot of the section */}
        <div aria-hidden="true" className="flex justify-center gap-5 md:gap-10 mt-8">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="np-diya-glow" style={{ "--glow-delay": `${i * 0.3}s` }}>
              <Diya width={34} height={26} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
