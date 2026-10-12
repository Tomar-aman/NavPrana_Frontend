import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCT_GUIDE } from "./productGuide";

/**
 * Cow- or buffalo-specific content for the product page: how it is made,
 * taste, uses, sizing, storage and an FAQ. Rendered open (not in an
 * accordion) so the text is visible on load. The same FAQ is emitted as
 * FAQPage JSON-LD by ./layout.js.
 */
export default function ProductGuide({ milk }) {
  const guide = PRODUCT_GUIDE[milk];
  if (!guide) return null;

  return (
    <section aria-labelledby="product-guide" className="mt-14 max-w-4xl mx-auto">
      <h2
        id="product-guide"
        className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-4"
      >
        {guide.title}
      </h2>
      <p className="text-base text-gray-600 leading-relaxed mb-8">{guide.intro}</p>

      <div className="grid md:grid-cols-2 gap-5">
        {guide.sections.map((s) => (
          <div key={s.heading} className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{s.heading}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {guide.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            {l.label} <ArrowRight size={12} />
          </Link>
        ))}
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mt-12 mb-5">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
        {guide.faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-gray-900">
              <h3 className="text-base">{f.q}</h3>
              <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
