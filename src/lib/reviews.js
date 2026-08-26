/**
 * Review helpers shared by the server (catalogue fetch, JSON-LD) and the
 * product page. Kept out of site.js so the client bundle can import them
 * without dragging the server fetch helpers along.
 */

/**
 * Turn a reviewer's email into a public display name ("aman.tomar@x.com" ->
 * "Aman"). The reviews API identifies buyers by email only, and the raw product
 * payload is serialised into the page for the client component — so the address
 * must be replaced before it ever leaves the server, not just hidden in the UI.
 */
export function reviewerName(email) {
  const local = (email || "").split("@")[0];
  if (!local) return "Verified Customer";
  const first = (local.split(".")[0].split("_")[0].split("-")[0] || local).replace(
    /[0-9]+$/,
    "",
  );
  if (first.length < 2) return "Verified Customer";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/** Strip buyer emails out of a product's reviews, leaving a display name. */
export function withSafeReviews(product) {
  if (!product?.reviews?.length) return product;
  return {
    ...product,
    reviews: product.reviews.map(({ user_email, ...review }) => ({
      ...review,
      user_name: review.user_name || reviewerName(user_email),
    })),
  };
}

/**
 * Family key: the product name with its pack size stripped.
 *
 * "Desi Cow A2 Bilona Ghee (1 Ltr)" and "Desi Cow A2 Bilona Ghee (500 ml)"
 * collapse to the same key, so the two sizes pool their reviews — it is the
 * same ghee in a different jar, and splitting the social proof left the 500 ml
 * page showing zero reviews. Cow and buffalo keep separate keys: different
 * milk, different product, reviews must not mix.
 */
export function productFamily(product) {
  return String(product?.name || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

/** "1 Ltr" — the pack size from the product name, for labelling a review. */
export function productSize(product) {
  const match = String(product?.name || "").match(/\(([^)]+)\)/);
  return match ? match[1].trim() : "";
}

/**
 * Every review for a product's family, newest first, each tagged with the pack
 * size it was written for. Deduped by review id because `catalogue` normally
 * contains `product` itself.
 */
export function familyReviews(product, catalogue = []) {
  const family = productFamily(product);
  if (!family) return [];

  const pool = [];
  const seen = new Set();

  for (const p of [product, ...catalogue]) {
    if (!p || productFamily(p) !== family) continue;
    const size = productSize(p);
    (p.reviews || []).forEach((review, i) => {
      const key = review.id != null ? `id:${review.id}` : `${p.id}:${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      pool.push({ ...review, variant_size: size });
    });
  }

  return pool.sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
  );
}

/** Mean rating of a review list, or null when nothing is rated. */
export function averageRating(reviews = []) {
  const rated = reviews.filter((r) => Number(r.rating) > 0);
  if (!rated.length) return null;
  return rated.reduce((total, r) => total + Number(r.rating), 0) / rated.length;
}

/**
 * Attach the pooled family rating and count to every product in a catalogue, so
 * listing cards, the product page and the JSON-LD can never disagree about how
 * many reviews a size variant has.
 */
export function withFamilyRatings(products = []) {
  return products.map((product) => {
    const pooled = familyReviews(product, products);
    const average = averageRating(pooled);
    return {
      ...product,
      family_review_count: pooled.length,
      family_rating: average == null ? null : Number(average.toFixed(1)),
    };
  });
}
