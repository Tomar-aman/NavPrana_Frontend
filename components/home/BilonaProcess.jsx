import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BILONA_ICONS } from "./BilonaIcons";

/**
 * Server component — the five bilona steps, on the homepage.
 *
 * This is the price answer. A visitor sees ₹799 for 500 ml next to ₹300 shelf
 * ghee and leaves, because nothing on the homepage explained that bilona means
 * ~30 litres of milk per litre of ghee and roughly four times the work. The
 * facts here are the same ones already published on /a2-desi-cow-ghee.
 */

const STEPS = [
  {
    n: "01",
    title: "Milked twice a day",
    body: "From indigenous cows and native breed buffaloes on open grazing, not stall-fed on concentrate. Milk reaches our unit in Morena within hours.",
  },
  {
    n: "02",
    title: "Cultured overnight",
    body: "The whole milk — not separated cream — is set into curd the same evening with a live starter. Curd from day-old milk never churns the same way.",
  },
  {
    n: "03",
    title: "Churned by hand",
    body: "Next morning the curd is churned until the butter separates and rises. This is the bilona step, and it is the one every industrial process skips.",
  },
  {
    n: "04",
    title: "Simmered slowly",
    body: "Only that butter goes into the pan, over a low flame, until the water cooks off and the milk solids settle golden at the bottom.",
  },
  {
    n: "05",
    title: "Tested and filled",
    body: "Each batch is filtered, lab tested, and filled into glass. Nothing added at any stage — no palm oil, no vanaspati, no colour, no preservative.",
  },
];

const FACTS = [
  { figure: "~30 L", label: "milk per litre of ghee" },
  { figure: "4×", label: "the time of centrifuge ghee" },
  { figure: "1", label: "ingredient, and nothing else" },
];

export default function BilonaProcess() {
  return (
    <section
      id="how-its-made"
      aria-labelledby="bilona-heading"
      className="py-12 md:py-16 md:px-15 bg-gray-50/80"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            The bilona method
          </div>
          <h2
            id="bilona-heading"
            className="text-3xl md:text-5xl font-bold mb-3 md:mb-4"
          >
            Why it costs <span className="text-gradient">what it costs</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Most ghee is made by spinning cream out of milk in a centrifuge — fast
            and cheap. Bilona takes the long road, and there is no shortcut in it.
          </p>
        </div>

        {/* The three numbers that explain the price */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 text-center"
            >
              <div className="text-2xl md:text-4xl font-bold text-gradient mb-1 tabular-nums">
                {f.figure}
              </div>
              <div className="text-[11px] md:text-sm text-muted-foreground leading-snug">
                {f.label}
              </div>
            </div>
          ))}
        </div>

        {/* Ordered list — the sequence is real information, not decoration */}
        <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((step, i) => {
            const Icon = BILONA_ICONS[i];
            return (
              <li
                key={step.n}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-primary/40 tabular-nums">
                    {step.n}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground leading-snug mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm"
          >
            Shop the ghee
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
