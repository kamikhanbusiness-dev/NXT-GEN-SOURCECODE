/**
 * ─────────────────────────────────────────────────────────────────────────
 *  QUOTE ESTIMATOR PRICING — edit this file to change the online estimate.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  • Every price is a `[min, max]` range in GBP. The estimator adds up all
 *    the mins and all the maxes separately, so the final figure is a range.
 *    Use a wider range where cost genuinely varies (e.g. brand choice).
 *  • Prices are treated as INCLUDING VAT (see `pricesIncludeVat`).
 *  • You can add or remove options in any list — the wizard renders
 *    whatever is defined here. Keep the `id` values stable once live,
 *    because they are stored with each submission.
 *  • The cooling-load figures are a simplified rule of thumb, NOT a
 *    substitute for a proper heat-load survey.
 */

export type Range = readonly [min: number, max: number];

/** Standard indoor unit capacities in kW. A room is matched to the smallest size that covers its load. */
export const unitSizesKw = [2.0, 2.5, 3.5, 5.0, 7.1, 10.0] as const;
export type UnitSizeKw = (typeof unitSizesKw)[number];

export const pricingConfig = {
  currency: "GBP",
  pricesIncludeVat: true,
  /** Final figures are
   *  rounded to the nearest multiple of this (£). */
  roundTo: 50,
  /**
   * Lowest installation price we quote (£). The estimate never shows less than
   * this. Set to 0 to turn the floor off. Client asked for £1,600 (25 Nov 2026).
   */
  minimumInstallPrice: 1600,

  /* ── Cooling-load calculation ───────────────────────────────────────── */
  cooling: {
    /** Base heat gain per cubic metre of room volume (W/m³). ~40 W/m³ ≈ 100 W/m² at 2.4m ceilings. */
    wattsPerCubicMetre: 40,
    /** Sensible heat added per person regularly in the room (W). */
    wattsPerPerson: 100,
    /** The first N occupants are included in the base figure. */
    occupantsIncluded: 2,
    /** Safety margin applied after all multipliers (1.1 = +10%). */
    safetyMargin: 1.1,
    insulation: {
      good: {
        label: "Good",
        hint: "Modern build, double glazing, insulated loft",
        multiplier: 0.85,
      },
      average: {
        label: "Average",
        hint: "Typical 1960s–2000s home",
        multiplier: 1.0,
      },
      poor: {
        label: "Poor",
        hint: "Older property, single glazing, solid walls",
        multiplier: 1.2,
      },
    },
    sunExposure: {
      low: { label: "Low", hint: "North-facing or shaded", multiplier: 0.9 },
      medium: { label: "Medium", hint: "Some direct sun", multiplier: 1.0 },
      high: {
        label: "High",
        hint: "South/west-facing, large windows",
        multiplier: 1.2,
      },
    },
  },

  /** Room types tweak the cooling load (kitchens and glass rooms gain more heat). */
  roomTypes: {
    bedroom: { label: "Bedroom", loadMultiplier: 1.0 },
    living: { label: "Living room", loadMultiplier: 1.0 },
    office: { label: "Office / study", loadMultiplier: 1.1 },
    kitchen: { label: "Kitchen", loadMultiplier: 1.25 },
    loft: { label: "Loft / attic", loadMultiplier: 1.2 },
    conservatory: { label: "Conservatory", loadMultiplier: 1.6 },
    gardenRoom: { label: "Garden room", loadMultiplier: 1.3 },
    openPlan: { label: "Open-plan area", loadMultiplier: 1.1 },
    commercial: { label: "Commercial space", loadMultiplier: 1.15 },
    serverRoom: { label: "Server / comms room", loadMultiplier: 2.0 },
  },

  /* ── Equipment & installation ───────────────────────────────────────── */
  /**
   * `systemBase`  – cost per outdoor unit / system (incl. standard labour,
   *                 commissioning, up to 5m pipework, F-Gas certification).
   * `perIndoorUnit` – cost per indoor unit, keyed by size in kW. Leave a size
   *                 out if that unit type isn't sold at that capacity; the next
   *                 size up will be used instead.
   * `maxIndoorUnitsPerSystem` – how many rooms one outdoor unit can serve.
   *                 1 = every room gets its own system.
   */
  unitTypes: {
    wallSplit: {
      label: "Wall-mounted split",
      description:
        "The most popular choice for homes. One indoor unit per outdoor unit.",
      maxIndoorUnitsPerSystem: 1,
      systemBase: [650, 850] as Range,
      perIndoorUnit: {
        2.0: [750, 1050],
        2.5: [800, 1150],
        3.5: [950, 1350],
        5.0: [1300, 1800],
        7.1: [1850, 2500],
      } as Partial<Record<UnitSizeKw, Range>>,
    },
    multiSplit: {
      label: "Multi-split",
      description:
        "Up to five indoor units running from one outdoor unit — ideal for several rooms.",
      maxIndoorUnitsPerSystem: 5,
      systemBase: [1600, 2200] as Range,
      perIndoorUnit: {
        2.0: [650, 850],
        2.5: [700, 900],
        3.5: [800, 1050],
        5.0: [1000, 1350],
      } as Partial<Record<UnitSizeKw, Range>>,
    },
    ducted: {
      label: "Ducted system",
      description:
        "Hidden in the ceiling void with discreet grilles. Best for new builds and refurbs.",
      maxIndoorUnitsPerSystem: 6,
      systemBase: [3200, 4200] as Range,
      perIndoorUnit: {
        2.5: [900, 1300],
        3.5: [1000, 1400],
        5.0: [1200, 1650],
        7.1: [1500, 2100],
        10.0: [2000, 2800],
      } as Partial<Record<UnitSizeKw, Range>>,
    },
    cassette: {
      label: "Ceiling cassette",
      description:
        "Flush ceiling units that spread air four ways. Common in offices and shops.",
      maxIndoorUnitsPerSystem: 1,
      systemBase: [900, 1200] as Range,
      perIndoorUnit: {
        3.5: [1500, 1950],
        5.0: [1800, 2350],
        7.1: [2300, 3000],
        10.0: [3000, 3900],
      } as Partial<Record<UnitSizeKw, Range>>,
    },
  },

  /** Installation scenario. `perSystem` is added once per outdoor unit; `multiplier` scales equipment + labour. */
  installType: {
    new: {
      label: "New installation",
      hint: "No existing air conditioning",
      perSystem: [0, 0] as Range,
      multiplier: 1.0,
    },
    replacement: {
      label: "Replace an existing system",
      hint: "Includes safe refrigerant recovery & disposal",
      perSystem: [200, 350] as Range,
      multiplier: 0.95,
    },
  },

  /** Pipe run between indoor and outdoor unit. Charged per system. */
  pipework: {
    upTo5: { label: "Up to 5m", perSystem: [0, 0] as Range },
    "6to15": { label: "6 – 15m", perSystem: [250, 450] as Range },
    "16to25": { label: "16 – 25m", perSystem: [550, 900] as Range },
    over25: { label: "25m +", perSystem: [950, 1500] as Range },
    unsure: { label: "Not sure", perSystem: [0, 450] as Range },
  },

  /** Where the outdoor unit is mounted. Charged per system. */
  outdoorMounting: {
    wallLow: {
      label: "Wall-mounted, low (below 2m)",
      perSystem: [0, 0] as Range,
    },
    wallHigh: {
      label: "Wall-mounted, high (2 – 4m)",
      perSystem: [120, 250] as Range,
    },
    ground: { label: "On the ground", perSystem: [60, 140] as Range },
    roof: { label: "Flat roof", perSystem: [250, 500] as Range },
  },

  /** Highest floor the work is on (access, equipment carrying). Charged once per job. */
  floorLevel: {
    ground: { label: "Ground floor", perJob: [0, 0] as Range },
    first: { label: "1st floor", perJob: [0, 100] as Range },
    second: { label: "2nd – 3rd floor", perJob: [150, 350] as Range },
    fourth: { label: "4th floor +", perJob: [350, 700] as Range },
  },

  /** Electrical supply for each outdoor unit. Charged per system. */
  electrics: {
    existing: {
      label: "Spare circuit / spur available",
      perSystem: [0, 0] as Range,
    },
    newCircuit: {
      label: "Needs a new dedicated circuit",
      perSystem: [220, 380] as Range,
    },
    unsure: { label: "Not sure", perSystem: [0, 380] as Range },
  },

  /** Commercial jobs carry extra compliance, access and scheduling costs. */
  propertyMultiplier: {
    domestic: 1.0,
    commercial: 1.12,
  },

  /* ── Add-ons ────────────────────────────────────────────────────────── */
  /**
   * `unit`:
   *  - "perIndoorUnit" | "perSystem" | "perJob" → added to the one-off install price
   *  - "annual" → priced per indoor unit per year, shown separately as a recurring cost
   */
  addOns: {
    wifi: {
      label: "Wi-Fi smart control",
      hint: "Control every unit from your phone",
      unit: "perIndoorUnit",
      price: [60, 120] as Range,
    },
    condensatePump: {
      label: "Condensate pump",
      hint: "Needed where water can't drain by gravity",
      unit: "perIndoorUnit",
      price: [120, 190] as Range,
    },
    extendedWarranty: {
      label: "Extended 7-year warranty",
      hint: "Parts & labour, registered with the manufacturer",
      unit: "perSystem",
      price: [150, 250] as Range,
    },
    maintenancePlan: {
      label: "Annual maintenance plan",
      hint: "Yearly service, filter clean & priority call-outs",
      unit: "annual",
      price: [90, 120] as Range,
    },
  },
} as const;

export type PricingConfig = typeof pricingConfig;
export type InsulationLevel = keyof PricingConfig["cooling"]["insulation"];
export type SunExposure = keyof PricingConfig["cooling"]["sunExposure"];
export type RoomType = keyof PricingConfig["roomTypes"];
export type UnitType = keyof PricingConfig["unitTypes"];
export type InstallType = keyof PricingConfig["installType"];
export type PipeworkBand = keyof PricingConfig["pipework"];
export type OutdoorMounting = keyof PricingConfig["outdoorMounting"];
export type FloorLevel = keyof PricingConfig["floorLevel"];
export type Electrics = keyof PricingConfig["electrics"];
export type AddOn = keyof PricingConfig["addOns"];
export type PropertyType = keyof PricingConfig["propertyMultiplier"];

/** Typed `Object.keys` for the config maps above. */
export const keysOf = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T & string)[];
