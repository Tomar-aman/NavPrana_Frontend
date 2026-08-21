import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, ShieldCheck, FlaskConical, MapPin } from "lucide-react";

/*
 * =============================================================================
 * IMPORTANT — replace FSSAI_LICENCE below with your real licence number before
 * this ships. It is not in the codebase anywhere, so it is left blank on
 * purpose: the block simply hides that row when the value is empty rather than
 * displaying an invented number. A fake licence number on a food site is a
 * regulatory problem, not a cosmetic one.
 *
 * Same for LAB_REPORT_HREF — point it at a real report (a PDF in /public, or a
 * page) or leave it empty and the row will say "on request" instead of linking.
 * =============================================================================
 */
const FSSAI_LICENCE = "";
const LAB_REPORT_HREF = "";

/**
 * Server component — three latest posts plus a proof block.
 *
 * This replaces the slot the hardcoded <Testimonials /> component used to
 * occupy. That component shipped six invented customers with invented quotes,
 * including a fabricated doctor endorsement making a digestive-health claim.
 * Fake testimonials breach the Consumer Protection Act 2019 and CCPA
 * misleading-advertisement guidelines, so it stays out. When you have real
 * reviews, they belong here — sourced from the API, not typed into a file.
 */
export default function BlogPreviewAndProof({ blogs = [] }) {
  const posts = blogs.slice(0, 3);

  const proof = [
    {
      icon: ShieldCheck,
      title: "FSSAI certified",
      body: FSSAI_LICENCE
        ? `Licence ${FSSAI_LICENCE}. Every batch is produced under it.`
        : "Every batch is produced under our FSSAI licence.",
    },
    {
      icon: FlaskConical,
      title: "Lab tested per batch",
      body: LAB_REPORT_HREF
        ? "Purity and adulteration testing on every batch."
        : "Purity and adulteration testing on every batch — reports on request.",
      href: LAB_REPORT_HREF || null,
      hrefLabel: "See a report",
    },
    {
      icon: MapPin,
      title: "Made in Morena, MP",
      body: "L-232, Old H.B Colony, Morena, Madhya Pradesh 476001. Not a white-label brand.",
      href: "/about",
      hrefLabel: "About us",
    },
  ];

  return (
    <>
      {/* ---------- Proof ---------- */}
      <section
        aria-labelledby="proof-heading"
        className="py-12 md:py-14 md:px-15 bg-background"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2
            id="proof-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-8"
          >
            What we can <span className="text-gradient">actually prove</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {proof.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    {item.hrefLabel}
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Blog ---------- */}
      {posts.length > 0 && (
        <section
          aria-labelledby="reading-heading"
          className="py-12 md:py-16 md:px-15 bg-gray-50/80"
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  From the blog
                </div>
                <h2
                  id="reading-heading"
                  className="text-2xl md:text-4xl font-bold"
                >
                  Straight answers about <span className="text-gradient">ghee</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline shrink-0"
              >
                All articles
                <ArrowRight size={15} />
              </Link>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <li
                  key={post.id ?? post.slug}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  {post.thumbnail && (
                    <div className="relative w-full h-40 bg-gray-50">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 mb-2 text-[11px] text-muted-foreground">
                      {post.category?.name && (
                        <span className="font-semibold text-primary">
                          {post.category.name}
                        </span>
                      )}
                      {post.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {post.read_time}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold leading-snug mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary transition before:absolute before:inset-0 before:content-['']"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-center mt-7 sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                All articles
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
