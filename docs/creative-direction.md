# LØV — Creative Direction

**The concept: "One long take of a slow morning."**

Most premium sites are cinematic the way trailers are cinematic: fast cuts, big sound, things flying in. LØV should feel cinematic the way a Kogonada or Hirokazu Kore-eda film does: a locked-off camera, natural light, and the patience to let you watch steam rise. The luxury here is *time*. Every motion decision answers one question: **does this slow the visitor down in a way that feels good?**

This builds on the v1 design system (cream, matcha, Fraunces, Work Sans) and deepens it. It doesn't replace it.

---

## 1. Atmosphere

| Feels like | Never feels like |
| --- | --- |
| 08:10 on a Tuesday, first customer, the room still cool | A product launch |
| Linen, oak, unglazed ceramic, paper menus | Glass, chrome, gradients, glow |
| The pause between whisking and the first sip | A countdown |
| A handwritten note left on the counter | A notification |

**Three words:** hushed, tactile, luminous.

**Texture:** a barely visible paper grain (2–3% noise, a static SVG filter rather than animated) over cream surfaces, so the screen reads as *material*, not pixels. Photography carries all the colour; the interface stays quiet.

## 2. Colour: "The day, in five tones"

The v1 palette is kept. Two tones are added for depth, and one colour is used only in photography.

| Token | Hex | Role |
| --- | --- | --- |
| `cream` | `#F7F5EF` | Paper, morning light. The default surface |
| `cream-2` | `#EFEBE0` | Linen, for alternating sections |
| `foam` *(new)* | `#E4E8D6` | The palest matcha froth. The booking and menu "card" surfaces |
| `matcha` | `#4A5D3A` | Primary actions, emphasis |
| `uji` *(new)* | `#27301F` | Deep tea-field green. The one "dark room" chapter on the page |
| `ink` | `#1E2119` | Text |
| `oak` *(photography only)* | `#C8B596` | Wood tone the photos are graded toward. Never used for UI text |

**Living palette (signature detail):** the page's warmth follows Maastricht's clock, driven by the existing `cafeNow()`. Before 10:00 the cream leans warmer (+2% yellow). In the afternoon it cools slightly toward foam. After closing, the hero dims to `uji` and the headline reads *"We're asleep. Back at 08:00."* It's subtle enough that most visitors never consciously notice, and those who do remember it.

Any new pairing has to pass `npm run check:contrast` before it ships.

## 3. Typography

- **Fraunces as a variable font.** Load it with its `opsz`, `SOFT` and `WONK` axes rather than fixed weights (in `next/font`, drop `weight` and pass `axes: ["opsz", "SOFT", "WONK"]`).
  - Display sizes: `opsz 144`, `SOFT 100`. Big, soft, almost buttery letterforms.
  - The single italic word in each headline (*unhurried*, *leaf*, *making*) uses `WONK 1`. It's the brand's handwriting: one crooked, human word per page.
- **Work Sans** stays for all reading text, at 17px with 1.65 line height. It's calm and never compressed.
- **Numerals:** old-style, proportional figures in running text; lining, tabular figures for prices and times. The menu should read like a well-set wine list.
- **Scale:** the extremes are dramatic (display at `clamp(3rem, 9vw, 8.5rem)`, body at 17px) and there's almost nothing in between. That contrast is what makes it feel editorial rather than templated.
- **Rules:** no all-caps display type. Eyebrows are the only uppercase, small and tracked.

## 4. Visual language

- **Framing:** photographs sit in generous cream margins, like prints on a gallery wall. Full-bleed is reserved for two moments only (the opening shot and the dark "tea field" chapter), so it keeps its power.
- **Composition:** asymmetric twelve-column grid; text often sits on columns 2–6 against images on 8–12, leaving a deliberate empty column as "air".
- **Shape:** 8px radius everywhere, as now. The only curve with meaning is the **Ø**. The slash in the wordmark is reused as a quiet graphic device: a section divider, the loading mark, the booking stamp.
- **Photography direction:** natural window light only, shot between 08:00 and 10:00. Top-down and 3/4 angles, shallow depth of field, hands always in frame (whisking, tearing a bun, pouring). Grade warm and slightly lifted. No people looking at the camera, no styled flat-lays with scattered ingredients.
- **Motion grammar:** things *settle*, they don't *arrive*. Easing is `cubic-bezier(0.2, 0.7, 0.2, 1)` at 700–1200ms. Movement never goes further than 16px. Nothing bounces, spins, or follows the cursor aggressively.

## 5. Storytelling: the page as a morning

The home page is structured as five chapters of a single morning, each tied to a time of day shown in a small running timestamp at the edge of the screen (`08:00 → 12:30`) that advances as you scroll.

1. **08:00, First light.** The opening shot. The room before anyone arrives.
2. **08:20, The ritual.** How matcha is made here: the craft chapter.
3. **09:00, The table.** Featured food and pastries. Appetite.
4. **10:30, The tea field.** A dark, full-bleed interlude on origin and ingredients. The one change of key.
5. **12:30, Your seat.** Hours, location and the invitation to book.

The story isn't told with copy. It's told with light, pacing and that ticking clock.

## 6. Signature moments

### ① First light (arrival)
The page opens on a cream veil that lifts like a linen blind (900ms). Behind it, a locked-off 10-second loop: morning light moving slowly across an oak table, steam rising from a bowl. The headline sets word by word in Fraunces (*Matcha, slow mornings,* ***Maastricht.***), each word easing its `SOFT` axis from 0 to 100 as it appears, as if the letters are warming up.
*Reduced motion:* the still frame and headline appear together with a single fade.

### ② The whisk (scroll-scrubbed ritual)
A pinned section where scrolling *is* the preparation: an image sequence of about 48 frames drawn to `<canvas>`. Sifted powder, then the pour, then the zig-zag whisk, then foam. Three facts fade in beside it at the right frames, set large in Fraunces: **2g. 80°C. Thirty seconds.** The visitor spends 30 seconds of scroll making a matcha. That is the brand in one gesture.
*Reduced motion / mobile fallback:* three still photographs with the same three captions.

### ③ The paper menu
`/menu` is set like a printed card on `foam` with paper grain, dotted leaders, and prices in tabular lining figures. On desktop, resting on an item for 400ms reveals a small photograph beside the cursor, slightly offset and softly faded, like glancing at the next table's plate. On touch devices, a tap expands a thumbnail inline.

### ④ The tea field (the one dark room)
A full-bleed `uji` chapter with slow parallax between two photographic layers (tea rows, mist), capped at 40px of travel. The copy is a single sentence in large cream italic. It exists to make the return to cream afterwards feel like stepping back into daylight.

### ⑤ Writing in the book (booking)
The reservation form is styled as the cafe's physical reservations book: ruled lines, fields that read as blank lines to write on. On confirmation, a small circular **LØV · reserved** stamp presses onto the page (scale 1.06 → 1, 250ms, with a faint ink-bleed blur settling). The confirmation below it reads like a paper ticket with date, time and party. It's the most tactile moment on the site, placed exactly where the visitor has just committed.

### ⑥ Closing hours
Visit after closing and the whole site acknowledges it. The hero dims, the booking CTA changes to "Book for tomorrow morning", and the running clock rests at the next opening time.

## 7. Emotional journey

| Stage | Visitor feels | Driven by |
| --- | --- | --- |
| Arrival | *Hush.* "Oh, this is calm." | Veil lift, first-light loop, silence |
| Curiosity | *Respect for craft.* | The whisk sequence, precise numbers |
| Appetite | *Hunger.* | Close, warm food photography; the paper menu |
| Depth | *Trust.* | The tea-field chapter: origin, care |
| Commitment | *Ease.* | A short, beautiful form that asks for little |
| Afterglow | *Anticipation.* | The stamp, the ticket, a warm confirmation email |

## 8. Sound

Off by default and never autoplayed. There's a single small toggle in the footer: *"Hear the room"*. It plays a 60-second ambient loop recorded in the actual cafe (whisk, cups, low murmur) at low volume. The toggle state is remembered per visitor.

## 9. What I'd deliberately *not* do

- No custom cursor, magnetic buttons, preloaders with percentages, or scroll-jacking. Native scroll stays native (the pinned whisk section uses `position: sticky`, not a scroll library).
- No WebGL shaders, 3D cups or particle steam. They'd make it look like every other award site and undercut the handmade feel.
- No motion that runs when the visitor isn't doing anything, except the hero loop, which can be paused.

## 10. Craft & performance guardrails

- **Every signature moment has a reduced-motion equivalent** that tells the same story with stills.
- **Budget:** LCP under 2.0s on 4G. Hero loop ≤ 1.5 MB (AV1 with H.264 fallback, poster frame as the LCP image). Whisk sequence ≤ 1.2 MB as AVIF frames, lazy-loaded when within one viewport.
- **Tech:** CSS scroll-driven animations (`animation-timeline: view()`) with the existing IntersectionObserver as fallback. No new animation dependency needed.
- **Accessibility:** the timestamp rail is decorative (`aria-hidden`); the stamp animation announces "Reservation confirmed" via the existing live region.

## 11. What this needs from you

1. **A half-day morning shoot** in the real space: the first-light loop, 48-frame whisk sequence, food close-ups, hands at work, plus a tea-field image (licensed or from your supplier).
2. **A 60-second room recording** if you want the sound toggle.
3. **Approval of the direction**, then build it in phases:
   1. Type, texture and the living palette (no new assets needed)
   2. Paper menu and booking stamp (no new assets needed)
   3. First light, the whisk and the tea field (need the shoot)
