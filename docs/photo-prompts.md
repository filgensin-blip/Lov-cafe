# Image-generator prompts

Art-directed prompts for every photo slot on the site (see `data/photos.ts`),
for tools like Midjourney, Adobe Firefly, DALL·E or Imagen. Save results with
the file names below in `public/photos/`, and they replace the current stock
stand-ins on the next build.

**Use generated images for atmosphere, not for dishes.** The tea field, the
light, and the ritual close-ups are fine to generate. For menu items, guests
expect to see what they'll actually be served, so photograph the real food
(even a phone photo by the window at 9am will do) rather than generating it.

## Shared style (add to the end of every prompt)

> natural window light, early morning, soft shadows, shallow depth of field,
> 35mm film photograph, muted greens and warm cream tones, pale oak and linen,
> unglazed ceramics, Scandinavian minimal cafe, calm, editorial, no text,
> no logos, no people facing camera

Midjourney: append `--style raw --v 7` and the aspect ratio shown.

## Prompts

| File | Aspect | Prompt |
| --- | --- | --- |
| `hero.jpg` | 16:9 (`--ar 16:9`) | A quiet corner of a small Copenhagen-style cafe at 8am, a handmade ceramic bowl of frothy matcha on a pale oak table by a tall window, low golden sunlight falling across the table, a wisp of steam, lots of empty calm space on the left side of the frame |
| `ritual-sift.jpg` | 4:5 | Top-down close-up of bright ceremonial matcha powder being sifted through a small fine-mesh sieve into a matte cream ceramic bowl, a soft haze of green powder in the light |
| `ritual-pour.jpg` | 4:5 | Three-quarter view of hot water pouring in a thin stream from a small black gooseneck kettle into a ceramic matcha bowl, steam catching the window light |
| `ritual-whisk.jpg` | 4:5 | Close-up of a bamboo chasen whisk moving through glossy, fine jade-green matcha foam in a rough stoneware bowl, slight motion blur on the whisk, hands just in frame |
| `tea-field.jpg` | 16:9 | Rows of shaded Japanese tea bushes under black shade cloth, soft morning mist, deep muted greens, very low contrast, quiet and cinematic, room for text over the image |
| `about-bar.jpg` | 4:5 | Hands whisking matcha at a pale wooden cafe bar, linen apron, soft side light from a window, calm and unhurried, face out of frame |
| `interior.jpg` | 4:3 | Interior of a small minimal Scandinavian cafe, window seat with oak tables and linen cushions, a few ceramic cups, plants, soft morning light, nobody in the room |

## After generating

- Check hands, steam and ceramics closely; generators often get fingers and
  whisks wrong. Regenerate anything that looks off.
- Keep file size reasonable: about 2400px on the long edge for `hero.jpg` and
  `tea-field.jpg`, 1600px for the rest, JPG quality around 80.
- Update the `alt` text in `data/photos.ts` so it describes the new image, and
  note the source in `public/photos/README.md`.
- Check the terms of the tool you used. Most allow commercial use on paid
  plans, but not all do.
