# NavPrana Blog Structure — Template & Field Reference

Every blog post must follow this structure. Fields verified against the live DB schema
(`GET https://api.navprana.com/api/v1/blogs/<slug>/`). The public API is **read-only** —
posts are inserted via the Django admin.

## Required fields

| Field | Type | Rules |
|---|---|---|
| `title` | string | Benefit-driven, may include year/hook in parentheses. ~60–75 chars. |
| `slug` | string | kebab-case, keyword-rich, permanent (never change after publish). |
| `excerpt` | string | 1–2 sentences, ~150–250 chars. Shown on blog cards. Must create curiosity + name the benefit. |
| `content` | HTML string | See content structure below. |
| `thumbnail` | image upload | 1200×630 PNG/JPG, named after the slug. Generated from `image_prompt`. |
| `category` | FK | One of: Awareness (5), Ayurveda (4), Clean Eating (3), Food Wisdom (6), Organic Living (2), Our Process (1). |
| `read_time` | string | e.g. `"6 min"` — ~200 words/min. |
| `is_featured` | bool | `true` only for high-priority conversion posts. |
| `meta_title` | string | ≤60 chars, ends with `\| NavPrana`. |
| `meta_description` | string | ≤160 chars, includes primary keyword + hook (e.g. "Free shipping ₹999+"). |
| `image_prompt` | string | AI image-generation prompt for the thumbnail — stored in the draft JSON so the image can be (re)generated anytime. Not a DB field. |

## Content HTML structure (in order)

1. `<h1>` — same as title (one H1 only)
2. **Hook paragraph** — emotional opening, bold the key phrase
3. **"Quick Answer" `<h2>`** — direct 2–3 sentence answer first (AEO: AI assistants quote this)
4. **Comparison/dosage `<table>`** — featured-snippet bait; every post should have one where possible
5. **Body `<h2>` sections** — benefits/steps, `<h3>` subsections, `<ul>` lists
6. **Purity/Bilona section** — always tie back to why the Bilona method matters (brand differentiator)
7. **FAQ `<h2>`** — 3–5 `<h3>` questions with direct-answer-first paragraphs (AEO)
8. **CTA `<h2>`** — closing section with product links + "Free shipping above ₹999"

## Linking rules

- **Internal product links** (site-relative) — link at least 2:
  - `/products/desi-cow-a2-bilona-ghee-500-ml` · `/products/desi-cow-a2-bilona-ghee-1-ltr`
  - `/products/buffalo-a2-bilona-ghee-500-ml` · `/products/buffalo-a2-bilona-ghee-1-ltr`
  - `/products` (collection)
- **Cross-link related blog posts**: `/blog/<slug>`
- Never hard-code the domain in links.

## image_prompt rules

- Photorealistic food/lifestyle photography, 16:9 (1200×630)
- **No text in image** (AI mangles it; blog cards overlay the title)
- Brand palette accents: deep green `#265926` + gold `#f0c442`
- Rustic/organic/Indian-kitchen aesthetic; danedar (grainy) ghee texture when ghee is shown
- Negative prompt: `text, watermark, logo, plastic packaging, artificial colors, cluttered background`

## Draft JSON template

```json
{
  "title": "",
  "slug": "",
  "excerpt": "",
  "category_slug": "",
  "category_id": 0,
  "read_time": "X min",
  "is_featured": false,
  "meta_title": " | NavPrana",
  "meta_description": "",
  "image_prompt": "",
  "content": "<h1>...</h1>..."
}
```

## Existing posts (do not duplicate topics)

1. 10 Powerful Health Benefits of A2 Buffalo Bilona Ghee
2. 10 Signs Your Ghee is Fake
3. Why Authentic Buffalo A2 Bilona Ghee Is More Expensive
4. Why Organic Food Matters
5. Cow Ghee vs Buffalo Ghee — `cow-ghee-vs-buffalo-ghee-which-is-better`
6. Ghee for Babies — `ghee-for-babies-when-to-start-benefits-dosage`
7. Ghee on an Empty Stomach: 30 Days (draft — `blog-3-ghee-empty-stomach-30-days.json`)
8. How Much Ghee Per Day Is Safe? (draft — `blog-4-how-much-ghee-per-day.json`)
9. Ghee vs Butter vs Oil (draft — `blog-5-ghee-vs-butter-vs-oil.json`)
10. Ghee with Warm Milk at Night (draft — `blog-6-ghee-with-warm-milk-at-night.json`)

## Live slugs (for cross-linking)

`health-benefits-of-a2-buffalo-bilona-ghee` · `identify-pure-a2-buffalo-bilona-ghee` ·
`why-buffalo-a2-bilona-ghee-is-expensive` · `why-organic-food-matters` ·
`cow-ghee-vs-buffalo-ghee-which-is-better` · `ghee-for-babies-when-to-start-benefits-dosage`

## High-potential future topics (from July 2026 keyword research)

- How to Check if Your Ghee Is Pure (5 kitchen tests) — overlaps `identify-pure-a2-buffalo-bilona-ghee`, angle it as at-home tests only
- Ghee for Weight Loss: Does It Actually Work?
- Ghee in Pregnancy & After Delivery: Trimester-Wise Guide
- Ghee for Hair & Skin: Nasya, Massage and Overnight Remedies
- A2 vs A1 Milk: What the Protein Difference Actually Means
- How to Store Ghee So It Lasts 12 Months (and why it turns grainy)
