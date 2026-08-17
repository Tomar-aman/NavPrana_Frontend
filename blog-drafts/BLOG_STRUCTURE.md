# NavPrana Blog Structure — Template, Voice & Sourcing Standard

Every blog post must follow this structure. Fields verified against the live DB schema
(`GET https://api.navprana.com/api/v1/blogs/<slug>/`). The public API is **read-only** —
posts are inserted via the Django admin.

Three things decide whether a post ranks and converts, in this order:
**(1)** it reads like a person wrote it, **(2)** every factual claim is traceable to a real source,
**(3)** it contains something only NavPrana could have written. Structure comes fourth.

---

## Required fields

| Field | Type | Rules |
|---|---|---|
| `title` | string | Benefit-driven, may include year/hook in parentheses. ~60–75 chars. |
| `slug` | string | kebab-case, keyword-rich, permanent (never change after publish). |
| `excerpt` | string | 1–2 sentences, ~150–250 chars. Shown on blog cards. Must create curiosity + name the benefit. |
| `content` | HTML string | See content structure below. |
| `thumbnail` | image upload | 1200×630 PNG/JPG, named after the slug. Real photo preferred — see image rules. |
| `category` | FK | One of: Awareness (5), Ayurveda (4), Clean Eating (3), Food Wisdom (6), Organic Living (2), Our Process (1). |
| `read_time` | string | e.g. `"6 min"` — ~200 words/min. |
| `is_featured` | bool | `true` only for high-priority conversion posts. |
| `meta_title` | string | ≤60 chars, ends with `\| NavPrana`. |
| `meta_description` | string | ≤160 chars, includes primary keyword + hook (e.g. "Free shipping ₹999+"). |
| `image_prompt` | string | AI image-generation prompt for the thumbnail — stored in the draft JSON so the image can be (re)generated anytime. Not a DB field. |
| `sources` | list | Draft-JSON only (not a DB field). Every external URL cited in the post, with what it backs up. See sourcing rules. |
| `author` | string | Draft-JSON only until the DB adds the field. Real human name + credential. Never "Admin" or "Team". |

---

## Content HTML structure (in order)

1. `<h1>` — same as title (one H1 only)
2. **Hook paragraph** — a specific situation, not a generic statement. Bold the key phrase.
3. **"Quick Answer" `<h2>`** — direct 2–3 sentence answer first (AEO: AI assistants quote this)
4. **Comparison/dosage `<table>`** — featured-snippet bait; every post should have one where possible
5. **Body `<h2>` sections** — benefits/steps, `<h3>` subsections, `<ul>` lists
6. **One honest limitation** — a "this won't work if…" / "what ghee cannot do" passage. Non-negotiable; see why below.
7. **Purity/Bilona section** — always tie back to why the Bilona method matters (brand differentiator)
8. **FAQ `<h2>`** — 3–5 `<h3>` questions with direct-answer-first paragraphs (AEO)
9. **CTA `<h2>`** — closing section with product links + "Free shipping above ₹999"
10. **Disclaimer `<p><em>`** — required on any post giving dosage, pregnancy, baby or medical-adjacent guidance

---

## Voice: how to not sound like AI

Google does not penalise AI assistance — it penalises unhelpful, unoriginal content
([Google's own guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).
But readers bounce off AI-flavoured prose within two paragraphs, and bounce rate does affect rankings.
The tells below are what make writing *feel* machine-made.

### Banned words and constructions

Never use: *delve, moreover, furthermore, landscape, testament to, unlock, elevate, harness,
navigate (figuratively), realm, tapestry, embark, crucial to note, it's important to note,
in today's fast-paced world, when it comes to, let's dive in, the bottom line is.*

Never use these sentence shapes:

- **"It's not just X, it's Y."** — the single most recognisable AI construction.
- **"X isn't about A. It's about B."**
- Rule-of-three lists in prose (*"lighter, cleaner, purer"*) more than once per post.
- Opening a paragraph with *"But here's the thing"* or *"Here's what most people don't realise"* more than once per post.

### Rhythm rules

- **Em dashes: maximum 1 per 300 words.** Heavy em-dash use is the strongest statistical AI tell.
  Replace with commas, full stops, or brackets. Rewrite the sentence if neither fits.
- **Vary sentence length deliberately.** Every post needs a few sentences under six words.
  *"That is the whole recipe."* *"Measure it once."* Uniform 20-word sentences read as generated.
- **Vary paragraph length.** One-line paragraphs are allowed and good. Not every section needs 3 paragraphs.
- **Break bullet parallelism.** If every bullet is `<strong>Bold phrase.</strong> One sentence.`,
  rewrite at least a third of them into a different shape. Perfect parallelism is a tell.
- **Do not restate the article in the conclusion.** End on the action, not a summary.
- Cap the words *genuinely, actually, honest, simply, truly* at two uses each per post.

### The read-aloud test

Read the draft out loud before publishing. Anywhere you run out of breath, or hear a rhythm
repeating from the previous paragraph, rewrite that passage. This catches more than any AI detector.

### Why the "honest limitation" section is mandatory

A post that only sells is transparently promotional and readers discount all of it.
A post that says *"ghee will not burn fat"* or *"there is no evidence ghee eases labour"*
earns trust for every other claim in it — and it captures the sceptical searcher who typed
*"does ghee actually work"*, which is often the higher-intent query.
`blog-7` (weight loss) and `blog-8` (pregnancy) already do this. Keep the pattern.

---

## Sourcing: every claim must be traceable

Health content sits in Google's YMYL ("Your Money or Your Life") category, judged hardest
on E-E-A-T. Unsourced health claims are the fastest way to lose these rankings.

### Rules

1. **2–4 external citations per post**, placed inside the body where the claim is made — not in a footer.
2. Link to **primary sources only**: government bodies, peer-reviewed research, university/hospital sites.
   Never cite other ghee brands, content farms, or listicle blogs.
3. Use `target="_blank" rel="noopener nofollow"` on outbound links.
4. Attribute in the sentence, not just the link: *"ICMR-NIN's Dietary Guidelines for Indians put the
   visible-fat ceiling at …"* — naming the body is what carries the authority signal.
5. **Verify every URL resolves before publishing.** Government sites reorganise constantly.
   `curl -s -o /dev/null -L -w "%{http_code}" "<url>"` — anything other than 200, find the new path.
6. Record all citations in the draft JSON's `sources` array so they can be re-checked later.
7. Never invent a study, a statistic, a percentage or a "research shows". If it cannot be sourced,
   soften it to traditional-use language (*"Ayurveda holds that…"*) or cut it.

### Verified source library (all checked 200 OK, 18 Aug 2026)

| Source | URL | Use it for |
|---|---|---|
| WHO — trans fat fact sheet | `https://www.who.int/news-room/fact-sheets/detail/trans-fat` | Vanaspati / trans-fat harm claims — the strongest citation we have |
| WHO — REPLACE trans fat | `https://www.who.int/teams/nutrition-and-food-safety/replace-trans-fat` | Global elimination targets, adulteration context |
| ICMR-NIN — Dietary Guidelines for Indians | `https://www.nin.res.in/dietaryguidelines/index.html` · PDF: `https://www.nin.res.in/downloads/DietaryGuidelinesforNINwebsite.pdf` | Daily fat limits, Indian-specific intake numbers. **Pull the exact figure from the PDF — do not quote from memory.** |
| FSSAI | `https://www.fssai.gov.in/` | Ghee standards, labelling, certification claims |
| FSSAI — food safety regulations | `https://www.fssai.gov.in/cms/food-safety-and-standards-regulations.php` | Legal definition/standard of ghee |
| FSSAI — DART (rapid adulteration tests) | `https://www.fssai.gov.in/cms/detect-adulteration-with-rapid-test.php` | **The single best citation for the fake-ghee and kitchen-test posts** |
| Eat Right India (FSSAI) | `https://eatrightindia.gov.in/` | Consumer-facing food safety guidance |
| USDA FoodData Central | `https://fdc.nal.usda.gov/` | Calories and fat per tsp/100 g. Search "ghee" — cite the entry, not a rounded guess. |
| PubMed | `https://pubmed.ncbi.nlm.nih.gov/` | Study lookups (CLA, butyric acid, saturated fat) |
| PMC (full text) | `https://www.ncbi.nlm.nih.gov/pmc/` | Free full-text papers to read before citing |
| Ministry of Ayush | `https://www.ayush.gov.in/` | Classical Ayurvedic positioning of ghrita |
| CCRAS | `https://ccras.nic.in/` | Ayurvedic research citations |

### Claims in our existing posts that still need a citation

These are already published or drafted and are **currently unsourced**. Fix on next edit:

| Claim | Where | Action |
|---|---|---|
| Ghee smoke point ~250°C | `blog-5` | Sources vary between 232°C and 250°C. Write "around 250°C" or give the range; cite USDA or a food-science source. |
| 25–30 litres of milk per litre of ghee | `blog-1`, `blog-4`, `why-buffalo-a2-bilona-ghee-is-expensive` | **First-party claim — measure it in our own kitchen and state it as ours.** "In our Chambal facility it takes N litres…" That is stronger than any external link. |
| CLA supports fat metabolism | `blog-1`, `blog-7` | PubMed. Keep the wording modest — evidence is mixed. `blog-7` already labels it "overstated"; match that everywhere. |
| Butyric acid fuels colon cells | `blog-3`, `blog-6`, `blog-7` | Well supported. Cite one PMC review. |
| "60% of the brain is fat" | `blog-2`, `blog-8` | Commonly cited; find a primary source or soften to "a large proportion". |
| Ghee is virtually lactose/casein-free | `blog-2`, `blog-5`, `blog-8` | Keep "virtually/trace" hedging. Never write "lactose-free" — that is a regulated term. |
| Trans fat linked to heart risk | `blog-4`, `blog-5`, `blog-7`, `blog-8` | Cite the WHO fact sheet. Easy win, do it everywhere. |
| Timeline tables ("3–7 nights", "2–3 weeks") | `blog-3`, `blog-6` | Traditional-use and anecdotal. Keep the existing *"timelines are typical, not guaranteed"* italic note — do not present as clinical. |

---

## Uniqueness: what only NavPrana can write

Any competitor can publish "10 benefits of ghee". Nobody else can publish our kitchen.
**Every post needs at least two first-party specifics.** This is the strongest ranking lever we have
and the one thing an AI cannot fabricate.

Assets to gather once and reuse across all posts:

- **The farm**: village/district in the Chambal valley, breeds kept, number of farmer families, herd size.
- **The process, measured**: litres of milk per litre of ghee, churning time, batch size,
  simmering temperature and duration, how many jars a batch yields.
- **The people**: name and quote from the person who churns, or from the founder, on one specific decision.
- **Real customer questions**: pull actual WhatsApp/support questions and answer them verbatim in the FAQ.
  *"A customer in Pune asked us why her jar turned grainy in December…"* — unfakeable, and it targets a real long-tail query.
- **Seasonal reality**: how winter and summer change the ghee's texture, colour, yield.
- **What we got wrong**: a batch we rejected, a change we made. One paragraph of this outranks a page of adjectives.

Rule: if a paragraph could appear on any ghee website unchanged, it is not earning its place.

---

## Traffic: keyword and AEO rules

### Keyword placement

- Primary keyword in: `title`, `slug`, `meta_title`, `meta_description`, `<h1>`, first 100 words, and one `<h2>`.
- Never repeat it mechanically. Two to four natural uses in the body is plenty.
- Put the **exact search query as an `<h3>` FAQ question**, worded the way people type it.

### Hindi and Hinglish variants — do not skip this

A large share of our audience searches in Hinglish. Work these in naturally, usually in the FAQ:

*ghee khane ke fayde · khali pet ghee khane ke fayde · desi ghee ke fayde · ghee kitna khana chahiye ·
raat ko doodh me ghee · pregnancy me ghee · bacho ko ghee kab dena chahiye · asli ghee ki pehchan ·
ghee se weight badhta hai kya*

Keep Indian food vocabulary untranslated — *tadka, makkhan, danedar, khichdi, panjiri, gond ke laddoo,
haldi doodh, sonth, jaiphal*. It reads native and it captures those exact searches.

### Research the queries before writing

- Google Trends: `https://trends.google.com/trends/` — compare topic interest, filter to India.
- **Harvest "People Also Ask"** from the live SERP for the target keyword. Those become the FAQ `<h3>`s verbatim.
- Read the autocomplete suggestions for the query and the "Related searches" block at the page bottom.
- Check what already ranks. If the top three all say the same thing, our angle is whatever they all omit.

### Schema markup (add in the template, not the content field)

- `Article` with real `author`, `datePublished`, `dateModified` — `https://schema.org/Article`
- `FAQPage` for the FAQ block — `https://developers.google.com/search/docs/appearance/structured-data/faqpage`
- Recipe/HowTo where a post has numbered steps (e.g. `blog-6`).
- A visible author byline and last-updated date on the page. Both are direct E-E-A-T signals.

### Internal linking

Every new post links to **3+ existing posts**, and at least one older post gets updated to link back.
One-way links build no cluster. Current clusters:

- **Purity**: `identify-pure-a2-buffalo-bilona-ghee` ↔ `why-buffalo-a2-bilona-ghee-is-expensive` ↔ `why-organic-food-matters`
- **Dosage & routine**: `blog-3` ↔ `blog-4` ↔ `blog-6` ↔ `blog-7`
- **Family & life stage**: `blog-2` ↔ `blog-8`
- **Cooking**: `blog-1` ↔ `blog-5`

---

## Linking rules

- **Internal product links** (site-relative) — link at least 2:
  - `/products/desi-cow-a2-bilona-ghee-500-ml` · `/products/desi-cow-a2-bilona-ghee-1-ltr`
  - `/products/buffalo-a2-bilona-ghee-500-ml` · `/products/buffalo-a2-bilona-ghee-1-ltr`
  - `/products` (collection)
- **Cross-link related blog posts**: `/blog/<slug>`
- Never hard-code the domain in internal links.
- External links: `rel="noopener nofollow"`, `target="_blank"`.
- Verify all internal slugs before publishing — a 404 in the body wastes the crawl and the reader.

---

## Image rules

**Prefer real photographs of our own process and product** for the purity, process and comparison posts.
Original imagery is an E-E-A-T signal; a generic AI food render is not, and reverse image search
increasingly flags them. Use AI thumbnails for conceptual/lifestyle posts where no real photo exists.

Either way:

- 1200×630, 16:9
- **Descriptive alt text with the keyword** — required, and an easy image-search traffic source
- Filename = slug (`ghee-during-pregnancy-benefits-dosage.jpg`)
- Compress to under 200 KB; WebP if the CMS accepts it

### `image_prompt` rules (AI fallback)

- Photorealistic food/lifestyle photography, 16:9 (1200×630)
- **No text in image** (AI mangles it; blog cards overlay the title)
- Brand palette accents: deep green `#265926` + gold `#f0c442`
- Rustic/organic/Indian-kitchen aesthetic; danedar (grainy) ghee texture when ghee is shown
- Negative prompt: `text, watermark, logo, plastic packaging, artificial colors, cluttered background`

---

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
  "author": "",
  "meta_title": " | NavPrana",
  "meta_description": "",
  "image_prompt": "",
  "sources": [
    { "claim": "", "url": "", "verified": "YYYY-MM-DD" }
  ],
  "content": "<h1>...</h1>..."
}
```

---

## Pre-publish checklist

Structure

- [ ] One `<h1>`, matches `title`
- [ ] Quick Answer within the first screen
- [ ] At least one comparison/dosage table
- [ ] Purity/Bilona section present
- [ ] 3–5 FAQ `<h3>`s, answer-first
- [ ] CTA with 2+ product links and the free-shipping line
- [ ] Disclaimer present if the post gives dosage or medical-adjacent advice

Voice

- [ ] Em dashes ≤ 1 per 300 words
- [ ] No banned words or "not just X, it's Y" constructions
- [ ] Read aloud, start to finish
- [ ] At least three very short sentences
- [ ] Bullet shapes vary
- [ ] One honest limitation stated plainly

Trust

- [ ] 2–4 external citations, in-body, all returning 200
- [ ] Every statistic traceable; no invented research
- [ ] 2+ first-party NavPrana specifics
- [ ] Real author byline and date

Traffic

- [ ] Primary keyword in all required positions
- [ ] Hinglish variants worked into the FAQ
- [ ] PAA questions harvested from the live SERP
- [ ] 3+ internal blog links out, 1 older post updated to link back
- [ ] All internal slugs verified
- [ ] Alt text written, image under 200 KB
- [ ] `Article` + `FAQPage` schema

---

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
11. Ghee for Weight Loss (draft — `blog-7-ghee-for-weight-loss.json`)
12. Ghee During Pregnancy (draft — `blog-8-ghee-during-pregnancy.json`)

**Retrofit needed:** drafts 1–8 were written before this voice and sourcing standard existed.
They are structurally sound but they all need: em-dash reduction, external citations added,
first-party NavPrana specifics inserted, and an author byline. Do this before publishing each one,
starting with `blog-3` and `blog-4` (the rest link to them).

## Live slugs (for cross-linking)

`health-benefits-of-a2-buffalo-bilona-ghee` · `identify-pure-a2-buffalo-bilona-ghee` ·
`why-buffalo-a2-bilona-ghee-is-expensive` · `why-organic-food-matters` ·
`cow-ghee-vs-buffalo-ghee-which-is-better` · `ghee-for-babies-when-to-start-benefits-dosage`

## High-potential future topics

- How to Check if Your Ghee Is Pure (5 kitchen tests) — overlaps `identify-pure-a2-buffalo-bilona-ghee`; angle as at-home tests only, and cite FSSAI DART
- Ghee for Hair & Skin: Nasya, Massage and Overnight Remedies
- A2 vs A1 Milk: What the Protein Difference Actually Means
- How to Store Ghee So It Lasts 12 Months (and why it turns grainy)
- Inside Our Bilona Kitchen: One Batch, Start to Finish — **highest-value post we are not writing.**
  Pure first-party content, own photos, feeds every other post's purity section.
