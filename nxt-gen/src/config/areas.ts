/**
 * Service areas. Each entry generates a page at /areas/[slug] and appears
 * on the Areas Covered page, the home page and in structured data.
 * `intro` should be unique per area — duplicate copy hurts local SEO.
 */
export type Area = {
  slug: string;
  name: string;
  postcodes: string[];
  driveTime: string;
  intro: string;
  highlights: string[];
};

export const areas: Area[] = [
  {
    slug: "nottingham",
    name: "Nottingham City",
    postcodes: ["NG1", "NG2", "NG3", "NG5", "NG7", "NG8"],
    driveTime: "Our home patch",
    intro:
      "From Victorian terraces in Sneinton to city-centre apartments in the Lace Market, we fit quiet, efficient split systems that suit Nottingham homes — including flats where outdoor unit space is tight.",
    highlights: ["Apartment & flat specialists", "Same-week surveys", "Listed-building friendly pipe routes"],
  },
  {
    slug: "west-bridgford",
    name: "West Bridgford",
    postcodes: ["NG2"],
    driveTime: "10 minutes",
    intro:
      "Loft conversions and south-facing extensions in West Bridgford can overheat quickly in summer. We size systems properly so you get steady comfort without an oversized, noisy unit.",
    highlights: ["Loft & extension cooling", "Neat, colour-matched trunking", "Efficient heating for winter"],
  },
  {
    slug: "beeston",
    name: "Beeston",
    postcodes: ["NG9"],
    driveTime: "15 minutes",
    intro:
      "Home offices, rental properties and small businesses around Beeston and Chilwell choose us for tidy installs and straightforward, fixed pricing.",
    highlights: ["Home office installs", "Landlord packages", "Annual servicing plans"],
  },
  {
    slug: "arnold",
    name: "Arnold & Mapperley",
    postcodes: ["NG5", "NG3"],
    driveTime: "15 minutes",
    intro:
      "Many semi-detached homes in Arnold and Mapperley have bedrooms that trap heat overnight. A single wall-mounted unit or a multi-split can cool every bedroom from one outdoor unit.",
    highlights: ["Bedroom cooling", "Multi-split systems", "Ultra-quiet night modes"],
  },
  {
    slug: "carlton",
    name: "Carlton & Gedling",
    postcodes: ["NG4"],
    driveTime: "15 minutes",
    intro:
      "We install, service and repair air conditioning across Carlton, Gedling and Netherfield, for homes and the shops and offices along the high streets.",
    highlights: ["Retail & shop units", "Fast repair call-outs", "Domestic & commercial"],
  },
  {
    slug: "hucknall",
    name: "Hucknall",
    postcodes: ["NG15"],
    driveTime: "20 minutes",
    intro:
      "Newer-build estates in Hucknall are well insulated, which keeps heat in during summer too. We'll recommend the right capacity for your rooms rather than a one-size-fits-all unit.",
    highlights: ["New-build specialists", "Efficient A+++ units", "Clean, dust-free installs"],
  },
  {
    slug: "long-eaton",
    name: "Long Eaton",
    postcodes: ["NG10"],
    driveTime: "20 minutes",
    intro:
      "Conservatories and garden rooms in Long Eaton and Sandiacre are some of the hardest spaces to keep comfortable. Our systems cool in summer and heat efficiently in winter.",
    highlights: ["Conservatory cooling", "Garden office installs", "Year-round heating & cooling"],
  },
  {
    slug: "mansfield",
    name: "Mansfield",
    postcodes: ["NG18", "NG19"],
    driveTime: "30 minutes",
    intro:
      "We cover Mansfield and the surrounding villages for installations, servicing and maintenance contracts for homes, offices and light-industrial units.",
    highlights: ["Commercial maintenance contracts", "Server-room cooling", "Planned servicing"],
  },
  {
    slug: "derby",
    name: "Derby (East)",
    postcodes: ["DE1", "DE21", "DE72"],
    driveTime: "30 minutes",
    intro:
      "Our engineers regularly work across the east side of Derby, including Borrowash and Spondon, offering the same fixed-price installs we provide in Nottingham.",
    highlights: ["Fixed-price installs", "Commercial cassette units", "Breakdown repairs"],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
