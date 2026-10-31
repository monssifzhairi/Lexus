export type Vehicle = {
  id: string;
  index: string;
  name: string;
  model: string;
  code: string;
  year: string;
  eyebrow: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  finish: string;
  specs: { label: string; value: string; unit?: string }[];
  notes: { label: string; value: string }[];
};

export const vehicles: Vehicle[] = [
  {
    id: "vanta",
    index: "01",
    name: "VANTA",
    model: "N—01",
    code: "VNT—001",
    year: "2026",
    eyebrow: "Grand Tourer",
    tagline: "Absence, engineered.",
    description:
      "A study in restraint. Vanta's satin carbon body swallows light, leaving only geometry to speak: a low, wide stance, one uninterrupted shoulder line, and nothing that does not serve speed.",
    image: "/images/car-vanta.jpg",
    imageAlt:
      "Matte black NOIR Vanta hypercar lit by a single overhead light bar in a dark studio",
    finish: "Obsidian Satin",
    specs: [
      { label: "Power", value: "920", unit: "HP" },
      { label: "0—100", value: "2.7", unit: "S" },
      { label: "V-Max", value: "338", unit: "KM/H" },
    ],
    notes: [
      { label: "Chassis", value: "Carbon monocoque" },
      { label: "Drivetrain", value: "V8 Hybrid · RWD" },
      { label: "Mass", value: "1,412 kg" },
      { label: "Commission", value: "18 units" },
    ],
  },
  {
    id: "spectre",
    index: "02",
    name: "SPECTRE",
    model: "N—02",
    code: "SPC—002",
    year: "2026",
    eyebrow: "Track Prototype",
    tagline: "Titanium skin. Phantom intent.",
    description:
      "Machined from a single philosophy of lightness, Spectre trades mass for momentum. Its liquid-metal surface shifts with every degree of light — a body that seems to disappear the moment it moves.",
    image: "/images/car-spectre.jpg",
    imageAlt:
      "Titanium silver NOIR Spectre hypercar in side profile cut by a blade of light",
    finish: "Liquid Titanium",
    specs: [
      { label: "Power", value: "1,040", unit: "HP" },
      { label: "0—100", value: "2.4", unit: "S" },
      { label: "V-Max", value: "352", unit: "KM/H" },
    ],
    notes: [
      { label: "Chassis", value: "Titanium-aluminium" },
      { label: "Drivetrain", value: "V12 Hybrid · AWD" },
      { label: "Mass", value: "1,298 kg" },
      { label: "Commission", value: "12 units" },
    ],
  },
  {
    id: "eclipse",
    index: "03",
    name: "ECLIPSE",
    model: "N—03",
    code: "ECL—003",
    year: "2027",
    eyebrow: "Limited Commission",
    tagline: "The dark, made luminous.",
    description:
      "Our most theatrical commission. A halo of crimson light frames a silhouette that refuses to be fully seen — hybrid power without compromise, a presence you feel before you see.",
    image: "/images/car-eclipse.jpg",
    imageAlt:
      "Deep black NOIR Eclipse hypercar silhouetted inside a glowing crimson ring of light",
    finish: "Eclipse Violet",
    specs: [
      { label: "Power", value: "1,120", unit: "HP" },
      { label: "0—100", value: "2.3", unit: "S" },
      { label: "V-Max", value: "365", unit: "KM/H" },
    ],
    notes: [
      { label: "Chassis", value: "Carbon monocoque" },
      { label: "Drivetrain", value: "V12 Hybrid · AWD" },
      { label: "Mass", value: "1,356 kg" },
      { label: "Commission", value: "8 units" },
    ],
  },
];

export const performanceSpecs = [
  { label: "Power", value: 1000, unit: "HP", index: "01", note: "Hybrid V12" },
  {
    label: "0—100 KM/H",
    value: 2.5,
    unit: "SEC",
    index: "02",
    note: "Launch mode",
    decimals: 1,
  },
  {
    label: "Top speed",
    value: 350,
    unit: "KM/H",
    index: "03",
    note: "Aerodynamic ceiling",
  },
];

export const principles = [
  {
    index: "01",
    title: "Reduction",
    body: "Every surface must earn its place. What remains is intention — nothing decorative survives the wind tunnel.",
  },
  {
    index: "02",
    title: "Proportion",
    body: "Tension held in stillness. A ratio of mass to void that is felt long before it is understood.",
  },
  {
    index: "03",
    title: "Material",
    body: "Carbon, titanium, light. Honest substances, finished until they feel inevitable to the hand.",
  },
];

export const navItems = [
  { label: "Collection", href: "#collection" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Engineering", href: "#engineering" },
];
