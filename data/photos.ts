// Photography manifest — the site's shot list.
//
// Every photo slot on the site is listed here with its file path, alt text,
// and an art-direction brief for the photographer (or for choosing a
// licensed stock stand-in). Drop a file at `public<src>` and the slot shows
// it automatically on the next build; until then a labelled placeholder is
// shown. Menu item photos live at /photos/menu/<item-id>.jpg (see menuPhoto).
//
// House style for every image (see docs/creative-direction.md §4):
// natural window light, shot 08:00–10:00, hands in frame, shallow depth of
// field, warm and slightly lifted grade, no faces looking at camera.
// Recommended size: 2400px on the long edge, JPG quality ~82.
//
// Current files are licensed Unsplash stand-ins (see public/photos/README.md)
// until the cafe's own shoot replaces them. Alt text describes the file that
// is actually there — update it when a photo changes.

export type PhotoSlot = {
  src: string;
  alt: string;
  /** What the shot should show — the brief. Also the placeholder label. */
  brief: string;
};

export const photos = {
  hero: {
    src: "/photos/hero.jpg",
    alt: "A small round table by a tall window, set with a French press and cups among plants",
    brief: "Hero — morning light across an oak table, steam rising from a matcha bowl. Wide, landscape, lots of quiet space top-left for the headline.",
  },
  ritualSift: {
    src: "/photos/ritual-sift.jpg",
    alt: "Bright green matcha powder and a small spoon on dark wood",
    brief: "Sifting matcha into a bowl — top-down, fine sieve, a haze of green powder.",
  },
  ritualPour: {
    src: "/photos/ritual-pour.jpg",
    alt: "Hot water poured from a gooseneck kettle, steam in the light",
    brief: "Pouring water from a kettle — 3/4 angle, a thin stream, steam catching the light.",
  },
  ritualWhisk: {
    src: "/photos/ritual-whisk.jpg",
    alt: "A matcha latte with leaf-shaped latte art in a white cup",
    brief: "Bamboo whisk, glossy foam — close, slight motion blur on the whisk.",
  },
  teaField: {
    src: "/photos/tea-field.jpg",
    alt: "Rows of shaded tea bushes disappearing into morning mist",
    brief: "Shaded tea rows in morning mist — wide, low contrast, deep greens. Sits behind cream text, so keep it calm.",
  },
  aboutPortrait: {
    src: "/photos/about-bar.jpg",
    alt: "A calm cafe room with long wooden tables",
    brief: "Hands whisking matcha at the bar — portrait 4:5, pale wood, soft window light.",
  },
  interior: {
    src: "/photos/interior.jpg",
    alt: "A bright cafe counter with pendant lights, open shelves and an espresso machine",
    brief: "Interior — window seat, oak tables, linen, nobody rushing. Portrait 4:5.",
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoKey = keyof typeof photos;

/** Photo slot for a menu item, by its id in data/menu.ts. */
export function menuPhoto(item: { id: string; name: string; description: string }): PhotoSlot {
  return {
    src: `/photos/menu/${item.id}.jpg`,
    alt: item.name,
    brief: item.name,
  };
}
