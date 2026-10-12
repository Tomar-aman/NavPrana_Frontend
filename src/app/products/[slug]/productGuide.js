/**
 * Product-specific copy for the cow and buffalo ghee pages.
 *
 * Search Console showed the product pages ranking 30–50 for "bilona ghee",
 * "bilona desi ghee" and "cow bilona ghee". Most of their text was shared
 * template (trust badges, comparison grid), so there was little on each page
 * that was about *this* ghee. This gives each one its own content, and the
 * FAQ doubles as FAQPage JSON-LD in ./layout.js.
 *
 * Facts here must stay consistent with /a2-desi-cow-ghee, the BuyingGuide on
 * /products and public/llms.txt — no claims that aren't made elsewhere.
 */

const SHARED_SIZE = {
  heading: "Which size should I buy?",
  body: "New to bilona ghee? Start with 500 ml — a family of four cooking with ghee every day usually finishes it in six to eight weeks. If ghee is already part of every meal, or you make sweets at home, the 1 litre jar works out better value.",
};

const SHARED_STORAGE = {
  heading: "How to store it",
  body: "No refrigeration needed. Keep the jar closed, out of direct sunlight, and always use a dry spoon — moisture is the only thing that spoils ghee. Unopened it keeps for 12 months; once opened, use it within about 6 months while the aroma is at its best. It can melt in summer transit and set again; that is harmless.",
};

const SHARED_DELIVERY_FAQ = {
  q: "How long does delivery take?",
  a: "Orders are packed within one to two working days. Metro addresses usually receive them in three to four days and the rest of India in five to seven, with a tracking link sent by email and SMS. Shipping is free on orders above ₹999.",
};

export const PRODUCT_GUIDE = {
  cow: {
    title: "About NavPrana A2 Desi Cow Bilona Ghee",
    intro:
      "This is A2 desi cow ghee made the bilona way. Milk from indigenous Indian cow breeds, raised by smallholder farming families along the Chambal, is boiled and set into curd overnight. The curd is churned with a wooden bilona to lift out the makkhan, and only that butter is slow-simmered into ghee. Roughly 30 litres of milk go into every litre — which is why bilona cow ghee tastes and costs different from ghee made from separated cream.",
    sections: [
      {
        heading: "Taste, colour and texture",
        body: "Golden yellow, light on the palate, with a warm nutty aroma. As it cools it sets with a natural grain (danedar). If you receive it melted, let the jar rest for a few hours and the grain comes back.",
      },
      {
        heading: "What it is best for",
        body: "Everyday cooking — dal, roti, khichdi and rice, a tadka of jeera or hing, or a spoon stirred into warm milk at night. Cow ghee is the lighter of the two, which is why most families choose it for daily meals, for elders, and as one of a baby's first foods once the doctor says it is time.",
      },
      SHARED_SIZE,
      SHARED_STORAGE,
    ],
    links: [
      { href: "/a2-desi-cow-ghee", label: "What makes A2 desi cow ghee different" },
      { href: "/blog/what-is-bilona-ghee-method-explained", label: "The bilona method, step by step" },
      { href: "/blog/best-ghee-for-babies-how-to-choose", label: "Choosing ghee for babies" },
      { href: "/blog/cow-ghee-vs-buffalo-ghee-which-is-better", label: "Cow ghee vs buffalo ghee" },
    ],
    faqs: [
      {
        q: "What is bilona cow ghee?",
        a: "Bilona cow ghee is ghee made from whole-milk curd rather than separated cream. The curd is churned to lift out butter (makkhan), and that butter is slow-simmered until the water cooks off and the milk solids settle. It is the traditional Indian way of making ghee, and it takes far more milk and time than the cream-separation method most factory ghee uses.",
      },
      {
        q: "Is this A2 ghee?",
        a: "Yes. It is made only from the milk of indigenous Indian cow breeds, which produce predominantly A2 beta-casein protein. Many high-yield crossbred cattle produce A1 beta-casein instead.",
      },
      {
        q: "How is it different from the cow ghee sold in supermarkets?",
        a: "Most packaged cow ghee is made by spinning cream out of milk in a centrifuge and clarifying it — quick and cheap. Bilona ghee cultures the whole milk into curd first and churns it by hand, which changes the aroma and the grain and needs about 30 litres of milk per litre of ghee.",
      },
      {
        q: "Should I buy cow ghee or buffalo ghee?",
        a: "Cow ghee is lighter and more golden, and is the usual choice for everyday dal, roti and rice. Buffalo ghee is denser and richer, and suits sweets, deep frying and the colder months. Many households keep both.",
      },
      {
        q: "How can I check that ghee is pure?",
        a: "Melt a spoonful in a pan: pure ghee turns into a clear golden liquid almost at once and leaves no white residue. Or chill a little in a glass — pure ghee sets as one even layer, while ghee mixed with vegetable fat separates into layers.",
      },
      SHARED_DELIVERY_FAQ,
    ],
  },

  buffalo: {
    title: "About NavPrana A2 Buffalo Bilona Ghee",
    intro:
      "This is buffalo ghee made the bilona way. Milk from grass-fed desi buffaloes in the Chambal valley is set into curd overnight, the curd is hand-churned to lift out the makkhan, and only that butter is slow-simmered into ghee. Nothing is added — no colour, no flavour, no preservative.",
    sections: [
      {
        heading: "Taste, colour and texture",
        body: "Naturally white to pale cream — buffalo milk carries almost none of the beta-carotene that turns cow ghee yellow, so a white colour is a sign of buffalo milk, not of bleaching. It sets dense and creamy with a bold aroma and a rich grain.",
      },
      {
        heading: "What it is best for",
        body: "Indian sweets — halwa, laddoo, barfi — deep frying, parathas and winter cooking. Buffalo ghee is higher in fat, calcium and phosphorus than cow ghee, which is why it is often chosen for growing children, active adults and anyone trying to gain healthy weight.",
      },
      SHARED_SIZE,
      SHARED_STORAGE,
    ],
    links: [
      { href: "/blog/why-is-buffalo-ghee-white", label: "Why buffalo ghee is white" },
      { href: "/blog/why-buffalo-a2-bilona-ghee-is-expensive", label: "Why bilona ghee costs more" },
      { href: "/blog/identify-pure-a2-buffalo-bilona-ghee", label: "How to identify pure buffalo ghee" },
      { href: "/blog/cow-ghee-vs-buffalo-ghee-which-is-better", label: "Cow ghee vs buffalo ghee" },
    ],
    faqs: [
      {
        q: "Why is buffalo ghee white?",
        a: "Buffalo milk contains almost no beta-carotene, the natural pigment that gives cow ghee its yellow colour. So pure buffalo ghee is white to pale cream. A strongly yellow 'buffalo ghee' is worth asking questions about.",
      },
      {
        q: "Is buffalo ghee A2?",
        a: "Native Indian buffaloes produce predominantly A2 beta-casein, the same protein type found in the milk of indigenous Indian cow breeds.",
      },
      {
        q: "Why is bilona buffalo ghee more expensive than regular ghee?",
        a: "Because of the milk it takes. Bilona ghee is made from whole-milk curd rather than separated cream, and roughly 30 litres of milk go into each litre of ghee, along with hours of churning and slow simmering.",
      },
      {
        q: "Should I buy buffalo ghee or cow ghee?",
        a: "Buffalo ghee is denser and richer, and suits sweets, frying and cold weather. Cow ghee is lighter and is the usual everyday choice for dal, roti and rice. Many households keep both.",
      },
      {
        q: "How can I check that ghee is pure?",
        a: "Melt a spoonful in a pan: pure ghee melts clear almost at once and leaves no residue. Or chill a little in a glass — pure ghee sets as one even layer, while ghee mixed with vegetable fat separates into layers.",
      },
      SHARED_DELIVERY_FAQ,
    ],
  },
};
