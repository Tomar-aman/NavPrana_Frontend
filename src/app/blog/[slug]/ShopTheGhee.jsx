import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { generateSlug } from "@/utils/slug";
import { featuredImage } from "@/lib/site";
import { orderProductsForBlog } from "./orderProducts";
import { familyName } from "@/lib/variants";

/**
 * Server component — a product block appended to every blog post.
 *
 * Blog post bodies live in the Django DB and are read-only from here, so some
 * posts link to products and some link to none (a sample of six found two with
 * zero product links). Rendering this from the route means every post — including
 * ones written later — carries crawlable, descriptively-anchored links into the
 * catalogue without anyone having to remember to add them.
 *
 * Products are ordered by relevance to the post: a post about cow ghee leads
 * with the cow SKUs.
 */
export default function ShopTheGhee({ blog, products = [] }) {
  if (!products.length) return null;

  const shown = orderProductsForBlog(blog, products).slice(0, 4);

  return (
    <aside
      aria-labelledby="shop-the-ghee"
      data-cta-placement="shop_the_ghee"
      className="max-w-3xl mx-auto px-4 pb-14"
    >
      <div className="border-t border-gray-100 pt-8">
        <h2 id="shop-the-ghee" className="text-xl md:text-2xl font-bold mb-1.5">
          The ghee behind this article
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Hand-churned the traditional bilona way in the Chambal valley. Grass-fed,
          FSSAI certified, nothing added.
        </p>

        <ul className="grid sm:grid-cols-2 gap-4">
          {shown.map((product) => {
            const slug = generateSlug(product.name);
            const image = featuredImage(product);
            return (
              <li
                key={product.id}
                className="group relative flex gap-3 bg-white rounded-2xl border border-gray-100 hover:border-primary/40 transition p-3"
              >
                {image && (
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      src={image}
                      alt={`${product.name} — pure bilona ghee by NavPrana Organics`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex flex-col">
                  <h3 className="text-sm font-semibold leading-snug mb-1">
                    <Link
                      href={`/products/${slug}`}
                      className="hover:text-primary transition before:absolute before:inset-0 before:content-['']"
                    >
                      {familyName(product)}
                    </Link>
                  </h3>
                  <span className="text-sm font-bold text-foreground">
                    From ₹{Math.round(Number(product.price))}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
                    View details
                    <ArrowRight size={12} />
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm">
          <Link href="/products" className="text-primary font-medium hover:underline">
            Buy Pure Ghee Online
          </Link>
          <Link
            href="/bilona-ghee"
            className="text-primary font-medium hover:underline"
          >
            Buy Pure Bilona Ghee Online
          </Link>
          <Link
            href="/a2-desi-cow-ghee"
            className="text-primary font-medium hover:underline"
          >
            Buy A2 Desi Cow Ghee
          </Link>
          <Link
            href="/health-benefits"
            className="text-primary font-medium hover:underline"
          >
            Health benefits of bilona ghee
          </Link>
        </div>
      </div>
    </aside>
  );
}
