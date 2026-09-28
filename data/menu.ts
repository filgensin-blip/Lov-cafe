// Menu content. Edit names, descriptions and prices here — the menu page,
// home-page featured strip and any future views all read from this file.
// Prices are in euros as numbers; formatting (e.g. "€4.50") is handled by formatPrice().
// ⚠️ PLACEHOLDER PRICES — confirm before launch.

export type MenuItem = {
  /** Stable id, used for keys and to pick featured items. */
  id: string;
  name: string;
  description: string;
  price: number;
  /** Optional dietary note shown after the description, e.g. "vg" for vegan. */
  tags?: ("vg" | "v" | "gf")[];
};

export type MenuCategory = {
  category: string;
  /** Optional one-line intro under the category heading. */
  note?: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    category: "Matcha & Drinks",
    note: "Oat milk is our default. Ask for whole or almond milk.",
    items: [
      {
        id: "ceremonial-matcha-latte",
        name: "Ceremonial Matcha Latte",
        description: "Stone-ground ceremonial matcha, steamed oat milk, lightly sweetened.",
        price: 5.5,
        tags: ["vg"],
      },
      {
        id: "iced-matcha",
        name: "Iced Matcha",
        description: "Whisked to order and poured over ice and cold oat milk. Bright and grassy.",
        price: 5.75,
        tags: ["vg"],
      },
      {
        id: "hojicha-latte",
        name: "Hojicha Latte",
        description: "Roasted green tea with a toasty, caramel warmth. Low in caffeine.",
        price: 5.25,
        tags: ["vg"],
      },
      {
        id: "filter-coffee",
        name: "Filter Coffee",
        description: "A rotating single origin, brewed by hand one cup at a time.",
        price: 3.75,
        tags: ["vg"],
      },
      {
        id: "oat-cortado",
        name: "Oat Cortado",
        description: "A double shot cut with an equal measure of silky oat milk.",
        price: 3.9,
        tags: ["vg"],
      },
      {
        id: "fresh-mint-tea",
        name: "Fresh Mint Tea",
        description: "A generous handful of fresh mint leaves, a slice of lemon, honey on the side.",
        price: 3.5,
        tags: ["v"],
      },
    ],
  },
  {
    category: "Morning",
    note: "Served until 11:30.",
    items: [
      {
        id: "overnight-oats",
        name: "Overnight Oats",
        description: "Oats soaked in oat milk and chia, stewed apple, cinnamon, toasted hazelnuts.",
        price: 7.5,
        tags: ["vg"],
      },
      {
        id: "yogurt-granola-bowl",
        name: "Yogurt & Granola Bowl",
        description: "Thick Greek yogurt, house buckwheat granola, seasonal fruit, a drizzle of honey.",
        price: 8.5,
        tags: ["v", "gf"],
      },
      {
        id: "avocado-toast",
        name: "Avocado Toast",
        description: "Smashed avocado on sourdough, lemon, chilli flakes, pickled shallot, sesame.",
        price: 10.5,
        tags: ["vg"],
      },
      {
        id: "soft-scrambled-eggs",
        name: "Soft Scrambled Eggs on Sourdough",
        description: "Slow-cooked free-range eggs, cultured butter, chives, flaky salt.",
        price: 11,
        tags: ["v"],
      },
    ],
  },
  {
    category: "Bowls & Light Bites",
    items: [
      {
        id: "green-goddess-bowl",
        name: "Green Goddess Bowl",
        description: "Quinoa, charred broccoli, edamame, cucumber, herbs and a bright tahini-herb dressing.",
        price: 13.5,
        tags: ["vg", "gf"],
      },
      {
        id: "miso-soba-salad",
        name: "Miso Soba Salad",
        description: "Buckwheat noodles, white miso and ginger, crunchy greens, toasted sesame.",
        price: 13,
        tags: ["vg"],
      },
      {
        id: "roasted-vegetable-bowl",
        name: "Roasted Vegetable Bowl",
        description: "Seasonal roasted vegetables, lentils, whipped feta, dukkah, soft herbs.",
        price: 13.5,
        tags: ["v", "gf"],
      },
    ],
  },
  {
    category: "Pastries",
    note: "Baked every morning. When they're gone, they're gone.",
    items: [
      {
        id: "cardamom-bun",
        name: "Cardamom Bun",
        description: "Our Scandinavian classic: buttery, knotted and fragrant with fresh-ground cardamom.",
        price: 4,
        tags: ["v"],
      },
      {
        id: "matcha-croissant",
        name: "Matcha Croissant",
        description: "Flaky laminated dough, filled with a light matcha cream.",
        price: 4.5,
        tags: ["v"],
      },
      {
        id: "almond-financier",
        name: "Almond Financier",
        description: "Brown butter and almond, crisp at the edges, tender in the middle.",
        price: 3.25,
        tags: ["v", "gf"],
      },
      {
        id: "sourdough-loaf",
        name: "Sourdough Loaf (to take home)",
        description: "A slow-fermented country loaf with a deep crust. Best with good butter.",
        price: 6.5,
        tags: ["vg"],
      },
    ],
  },
  {
    category: "Extras",
    items: [
      {
        id: "alt-milk",
        name: "Oat or almond milk",
        description: "For any drink that isn't already oat-based.",
        price: 0.5,
      },
      {
        id: "extra-shot",
        name: "Extra shot",
        description: "Espresso, or an extra half-teaspoon of matcha.",
        price: 0.75,
      },
      {
        id: "honey",
        name: "Honey",
        description: "Local wildflower honey from Limburg.",
        price: 0.5,
      },
    ],
  },
];

/** Items shown on the home page, in this order. */
export const featuredItemIds = [
  "ceremonial-matcha-latte",
  "green-goddess-bowl",
  "cardamom-bun",
  "avocado-toast",
];

export const tagLabels: Record<NonNullable<MenuItem["tags"]>[number], string> = {
  vg: "Vegan",
  v: "Vegetarian",
  gf: "Gluten-free",
};

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a price consistently as "€4.50". */
export function formatPrice(price: number): string {
  return euro.format(price);
}

export function getFeaturedItems(): MenuItem[] {
  const all = menu.flatMap((c) => c.items);
  return featuredItemIds
    .map((id) => all.find((item) => item.id === id))
    .filter((item): item is MenuItem => Boolean(item));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
