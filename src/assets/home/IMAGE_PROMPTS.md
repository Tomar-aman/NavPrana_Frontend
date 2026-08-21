# Homepage image prompts

Two sets:

- **Set A — five bilona process graphics** (illustrations). For the "Why it costs
  what it costs" section.
- **Set B — two ghee comparison photos.** For the "Cow ghee or buffalo ghee"
  section. These stay photographic on purpose — see the note in that section.

---

# Read this before generating Set A

## The hard part is consistency, not quality

Any generator will give you five decent illustrations. It will not give you five
that look like they came from the same illustrator — the line weight drifts, the
palette drifts, the amount of detail drifts. That is the whole game here, because
these five sit side by side in one grid where any mismatch is obvious.

Three rules:

1. **Paste the STYLE ANCHOR block verbatim into every one of the five prompts.**
   Do not paraphrase it, do not shorten it for the easy ones. Identical text.
2. **Generate #3 (churning) first.** It is the hardest and the most important —
   it is the step that defines the brand. Iterate until you have one you actually
   like, then feed that image back as a style reference / image prompt for the
   other four. If your tool has "style reference", "character reference", `--sref`,
   or an image-prompt slot, this is what it is for.
3. **Fix the seed** if your tool exposes one, and generate all five in a single
   session. Coming back tomorrow with the same prompt gives a different look.

Before accepting the set, put all five side by side at the same size and check:
same line weight, same palette, same level of detail, same margin around the
subject. If one is busier than the rest, regenerate that one.

## STYLE ANCHOR — paste into every Set A prompt

```
flat vector editorial illustration, modern Indian folk-art influence, bold simple
geometric shapes with minimal internal detail, uniform 3px dark outline in deep
forest green #163320, flat fills with no gradients and no realistic shading, one
subtle paper-grain texture overlay across the whole image, restricted five-colour
palette only — deep forest green #163320, forest green #388547, warm gold #C99C4A,
amber #F19512, and warm cream #FBF7EF — single centred subject with generous even
margin on all four sides, isolated on a flat warm cream #FBF7EF background, no
scene depth, no perspective, no cast shadows, 1:1 square aspect ratio
```

## NEGATIVE — paste into every Set A prompt

```
text, letters, words, numbers, watermark, logo, signature, label text, lettering,
brand marks, barcode, photorealistic, 3D render, realistic shading, gradient mesh,
drop shadow, bevel, glossy highlight, lens blur, depth of field, busy background,
scene background, landscape background, multiple subjects, cropped subject, subject
touching frame edge, human faces, plastic packaging, stainless steel machinery,
modern electrical appliance, neon colours, pastel colours, purple, blue, pink
```

Note what the negative is doing: killing every cue that would make one image read
as a *photo* while the others read as *drawings*, and locking out colours outside
the brand palette so the set cannot drift.

## Save settings — Set A

| Setting | Value |
|---|---|
| Generate at | 1024 × 1024 |
| Save for web at | **512 × 512** |
| Format | **PNG** |
| Background | Flat cream `#FBF7EF` — or transparent if your tool does it cleanly |
| Target size | **under 60 KB each** after resize |

If you get transparent backgrounds, use them — the illustration then sits on any
card colour. If transparency comes out with fringing or grey halos (common), take
the flat cream background instead and say so; the card background gets set to the
same cream so it looks seamless.

---

# Set A — the five prompts

Each block below is **subject text + STYLE ANCHOR + NEGATIVE**. The subject text
is the only part that changes.

## A1 · `bilona-01-milking.png`

**Step 01 — Milked twice a day**
**Alt text:** Indigenous humped cows on open grazing, milked twice a day

> **Watch for this:** generators default to the Holstein-Friesian — the black-and-white
> European dairy cow. Our copy says *indigenous* breeds. The shoulder hump and the
> hanging dewlap are the two features that make it read as an Indian zebu. If the
> output has no hump, reject it, however nice it looks.

```
SUBJECT: a single side-on indigenous Indian zebu cow standing calmly, with a
clearly pronounced rounded shoulder hump, a long hanging dewlap under the neck,
gently curved upward horns and a tufted tail, a simple wide-mouthed steel milking
pail set on the ground beside its front legs, three small stylised milk droplets
arcing into the pail, two or three flat blades of grass under its hooves

[paste STYLE ANCHOR]

[paste NEGATIVE], Holstein, Friesian, Jersey cow, black and white spotted cow,
hornless cow, humpless cow, European cattle, cartoon eyes, anthropomorphic
```

## A2 · `bilona-02-culturing.png`

**Step 02 — Cultured overnight**
**Alt text:** Whole milk set into curd overnight in a clay pot

```
SUBJECT: a wide round terracotta clay pot seen slightly from above so the opening
reads as an ellipse, filled to the brim with flat undisturbed white set curd, a
folded muslin cloth draped over one side of the rim, and a small simple crescent
moon and two four-pointed stars floating in the upper corner to signal that this
step happens overnight, matte unglazed clay surface

[paste STYLE ANCHOR]

[paste NEGATIVE], yogurt cup, glass jar, metal pot, refrigerator, full moon,
realistic night sky, stars scattered everywhere
```

## A3 · `bilona-03-churning.png`

**Step 03 — Churned by hand · GENERATE THIS ONE FIRST**
**Alt text:** Curd hand-churned with a wooden bilona until the butter separates

This is the signature image. Everything else in the set gets matched to it.

```
SUBJECT: a tall traditional wooden bilona churner standing upright inside a wide
terracotta clay pot of white curd, the churner shown as a straight vertical wooden
shaft with a four-bladed paddle at its base visible through the curd, a coiled
rope wound twice around the middle of the shaft with both ends extending outward,
two curved motion arrows on either side of the shaft indicating back-and-forth
rotation, and five or six small pale butter granules gathered on the surface of
the curd, weathered flat wood grain marks on the shaft

[paste STYLE ANCHOR]

[paste NEGATIVE], electric mixer, blender, food processor, stand mixer, whisk,
hand drill, motor, plug, cable, hands, arms, fingers, person
```

## A4 · `bilona-04-simmering.png`

**Step 04 — Simmered slowly**
**Alt text:** Butter simmering slowly into ghee in a heavy iron kadhai

```
SUBJECT: a heavy round-bottomed cast iron Indian kadhai seen from the side with
two small round side handles, half filled with flat golden liquid ghee, five small
circular bubbles along the surface line and three darker specks of settled milk
solids resting at the very bottom of the bowl, three simple stylised flame shapes
directly beneath the kadhai, and two thin curling steam lines rising from the
surface

[paste STYLE ANCHOR]

[paste NEGATIVE], non-stick pan, frying pan, saucepan, induction cooktop, gas
stove knobs, stainless steel pot, roaring fire, large flames, smoke, burnt black
residue, food in the pan
```

## A5 · `bilona-05-filling.png`

**Step 05 — Tested and filled**
**Alt text:** Ghee filtered and filled into plain glass jars in small batches

> **Watch for this:** generators love putting invented brand text on jars. The
> negative list blocks it, but check the output — any lettering at all means reject.

```
SUBJECT: a wide-mouthed cylindrical clear glass jar with a short neck and a flat
lid resting tilted against its side, the jar two-thirds filled with golden ghee
showing six small circular granules to suggest a grainy danedar set, a simple
conical mesh strainer floating directly above the jar opening with a short straight
pour stream of golden ghee running from the strainer tip into the jar, the front
face of the jar left completely blank and unlabelled

[paste STYLE ANCHOR]

[paste NEGATIVE], label, printed label, sticker, ribbon, plastic bottle, squeeze
bottle, tin can, bottle cap, cork, straw, spoon, multiple jars
```

---

# Set B — the two comparison photos

**These stay photographic.** The entire job of that section is showing that cow
ghee is deep golden and grainy while buffalo ghee is pale ivory and dense. In flat
vector those become two colour swatches, which convinces nobody. Food also sells
on appetite, and a drawing has none.

**Best option: shoot these yourself.** Two bowls of your own ghee, near a window,
phone camera, shot straight down. That is genuinely enough for food, it costs
nothing, and it is more honest than a generated photo of someone else's ghee. Use
the prompts below only as a fallback.

Whichever route you take, the two images must be shot or generated **the same way**
— same bowl, same surface, same light, same angle — so the only thing that differs
between them is the ghee itself. That difference is the point.

## Save settings — Set B

| Setting | Value |
|---|---|
| Size | 1200 × 900 (4:3) |
| Format | **JPG**, quality 80–85 |
| Target size | **under 250 KB each** |

## B1 · `milk-cow-ghee.jpg`

**Alt text:** A2 desi cow ghee — deep golden and grainy when set
**This is the WARM, GOLDEN, GRAINY one.**

```
Warm overhead still-life photography, a shallow brass bowl of set A2 desi cow ghee
in a deep saturated golden yellow with a visibly coarse grainy danedar crystalline
texture, a small wooden spoon lifting one scoop to show the granular break, a torn
roti and a bowl of yellow dal placed loosely nearby out of focus, on a warm
terracotta surface, soft diffused daylight, strong emphasis on the deep golden
colour, earthy NavPrana brand palette of deep forest green #163320, forest green
#388547 and warm gold #C99C4A with amber #F19512 highlights, shallow depth of
field, honest documentary food aesthetic, 4:3 aspect ratio. Negative: text,
watermark, logo, label text, lettering, fake brand marks, pale white ghee, butter
stick, margarine, melted liquid oil, plastic packaging, artificial colors,
cluttered background
```

## B2 · `milk-buffalo-ghee.jpg`

**Alt text:** A2 buffalo ghee — pale ivory, denser and firmer at room temperature
**This is the PALE, IVORY, DENSE one.**

```
Warm overhead still-life photography, a shallow brass bowl of set A2 buffalo ghee
in a pale creamy off-white ivory tone, noticeably firmer and denser than golden cow
ghee, a small wooden spoon pressed into the surface leaving a clean firm edge
rather than a crumble, a plate of besan laddoo and a few almonds placed loosely
nearby out of focus, on a warm terracotta surface, soft diffused daylight, strong
emphasis on the pale ivory colour and dense firm texture, earthy NavPrana brand
palette of deep forest green #163320, forest green #388547 and warm gold #C99C4A
with amber #F19512 highlights, shallow depth of field, honest documentary food
aesthetic, 4:3 aspect ratio. Negative: text, watermark, logo, label text,
lettering, fake brand marks, deep golden yellow ghee, grainy crumbly texture,
butter stick, margarine, melted liquid oil, plastic packaging, artificial colors,
cluttered background
```

---

# What NOT to generate, at all

Photos or illustrations of our **actual** Morena unit, our **actual** farmers, our
FSSAI certificate, or a lab report. Those depict claims about the business. A
generated image captioned as our facility is a fabricated claim, not a stylistic
choice — the same problem as the fake testimonials sitting unused in
`components/Testimonials.jsx`. Those slots need real photographs or they stay as
icons, which is why the proof block on the homepage uses icons today.

---

# When the files land here

Drop them in this folder (`src/assets/home/`) with exactly the filenames above,
then say the word and both components get wired up — correct `sizes`, lazy loading
below the fold, and the card background matched to the illustration background:

- `components/home/BilonaProcess.jsx` — currently renders the hand-drawn SVG icons
  in `components/home/BilonaIcons.jsx`. Set A replaces those. The SVG file can stay
  as a fallback or be deleted.
- `components/home/MilkChooser.jsx` — currently uses the product pack shots from
  the API. Set B becomes the main image, with the pack shot kept as a small badge.
