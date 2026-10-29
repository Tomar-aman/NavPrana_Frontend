/**
 * Topic-aware wording for the blog product cards.
 *
 * Almost all organic traffic lands on informational posts ("ghee in milk at
 * night", "ghee for babies"), and the old card said the same generic line on
 * every one of them. A reader is far more likely to click a product that is
 * pitched for the exact thing they came to read about.
 *
 * Copy stays factual: no health claims, nothing that is not already said on
 * the product pages.
 */
const TOPICS = [
  // First match wins, so the narrower topics come first ("ghee-diya-for-diwali"
  // is about puja, not sweets).
  {
    test: /diya|puja|deepak/,
    milk: "cow",
    eyebrow: "For diyas and puja",
    line: "Pure A2 desi cow bilona ghee, the traditional choice for the mandir.",
  },
  {
    test: /sweet|mithai|laddoo|ladoo|laddu|halwa|diwali|gift|baking|weight-gain|weight gain/,
    milk: "buffalo",
    eyebrow: "For laddoo, halwa and festive cooking",
    line: "Rich A2 buffalo bilona ghee that sets firm. One ingredient, nothing added.",
  },
  {
    test: /bab(y|ies)|infant|toddler|kids|children|bacch|bach/,
    milk: "cow",
    eyebrow: "For your baby's first foods",
    line: "Single-ingredient bilona ghee. Nothing on the label to second-guess.",
  },
  {
    test: /milk|doodh|dudh|night|raat|sleep|haldi|warm-water|warm water/,
    milk: "cow",
    eyebrow: "For your nightly glass of milk",
    line: "One spoon of hand-churned A2 cow ghee. Nothing else in the jar.",
    hi: {
      eyebrow: "रात के दूध के लिए",
      line: "हाथ से मथा A2 देसी गाय का बिलोना घी। जार में घी के सिवा कुछ नहीं।",
    },
  },
  {
    test: /elderly|old-age|old age|senior|parents/,
    milk: "cow",
    eyebrow: "Light, everyday ghee for parents",
    line: "A2 desi cow bilona ghee. Golden, light, one ingredient.",
  },
  {
    test: /cough|cold|winter|sardi/,
    milk: "cow",
    eyebrow: "For haldi doodh and winter khichdi",
    line: "Hand-churned A2 bilona ghee from the Chambal valley.",
  },
  {
    test: /skin|hair|face|massage/,
    milk: "cow",
    eyebrow: "The same pure ghee, kitchen to skincare",
    line: "Single-ingredient A2 bilona ghee. Nothing added.",
  },
  {
    test: /pure|identify|asli|pehchan|fake|price|expensive|a2|bilona|buying|choose/,
    milk: null,
    eyebrow: "Bilona ghee with nothing to hide",
    line: "Curd-churned, FSSAI certified, one ingredient.",
    hi: {
      eyebrow: "असली बिलोना घी, कुछ छुपाने को नहीं",
      line: "दही से मथा, FSSAI प्रमाणित, सिर्फ़ एक सामग्री।",
    },
  },
];

const DEFAULT_COPY = {
  milk: null,
  eyebrow: "Made the way this article describes",
  line: "Hand-churned bilona · Grass-fed · FSSAI certified",
};

function haystack(blog) {
  return `${blog?.slug || ""} ${blog?.title || ""}`.toLowerCase();
}

// Hindi posts (Devanagari titles) get Hindi card copy where a topic has it.
const isHindi = (blog) => /[\u0900-\u097F]/.test(blog?.title || "");

const UI = {
  en: { shop: "Shop now", save: "Save" },
  hi: { shop: "अभी खरीदें", save: "बचत" },
};

/**
 * { eyebrow, line, milk, ui } for this post. `milk` is the ghee to lead with,
 * or null; `ui` holds the button and badge labels in the post's language.
 */
export function blogCtaCopy(blog) {
  const text = haystack(blog);
  const topic = TOPICS.find((t) => t.test.test(text)) || DEFAULT_COPY;
  const hindi = isHindi(blog) && topic.hi;
  return {
    milk: topic.milk,
    eyebrow: hindi ? topic.hi.eyebrow : topic.eyebrow,
    line: hindi ? topic.hi.line : topic.line,
    ui: hindi ? UI.hi : UI.en,
  };
}

/** Real saving from the catalogue's MRP, or null when there is none. */
export function savings(product) {
  const price = Number(product?.price);
  const mrp = Number(product?.max_price);
  if (!(price > 0) || !(mrp > price)) return null;
  return { mrp: Math.round(mrp), pct: Math.round(((mrp - price) / mrp) * 100) };
}
