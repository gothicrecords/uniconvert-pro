/* ============================================================
   data.js – UniConvert Pro | All conversion data
   ============================================================ */

/* ── i18n strings ── */
const I18N = {
  en: {
    search_placeholder: 'type "75 kg to lbs" or "100 miles in km"',
    favorites: 'Saved',
    fav_empty: 'Save conversions here.',
    popular: 'Popular Conversions',
    copy: 'Copy',
    copied: 'Copied!',
    share: 'Share',
    favorite: 'Save',
    unfavorite: 'Remove',
    reverse: 'Reverse',
    decimals: 'Decimals',
    formula: 'Formula',
    install: 'Install App',
    from: 'From', to: 'To', amount: 'Amount', result: 'Result',
    offline: 'Offline ready',
    live_rates: 'Live rates (cached)',
    fallback_rates: 'Fallback rates (Jan 2026)',
    loading: 'Loading…',
    generate: 'Generate',
    encode: 'Encode →',
    decode: '← Decode',
    gen_qr: 'Generate QR',
  },
  it: {
    search_placeholder: 'prova "75 kg in lbs" o "100 miglia in km"',
    favorites: 'Salvati',
    fav_empty: 'Salva le conversioni qui.',
    popular: 'Conversioni Popolari',
    copy: 'Copia',
    copied: 'Copiato!',
    share: 'Condividi',
    favorite: 'Salva',
    unfavorite: 'Rimuovi',
    reverse: 'Inverti',
    decimals: 'Decimali',
    formula: 'Formula',
    install: 'Installa App',
    from: 'Da', to: 'A', amount: 'Importo', result: 'Risultato',
    offline: 'Offline pronto',
    live_rates: 'Tassi live (cache)',
    fallback_rates: 'Tassi statici (Gen 2026)',
    loading: 'Caricamento…',
    generate: 'Genera',
    encode: 'Codifica →',
    decode: '← Decodifica',
    gen_qr: 'Genera QR',
  },
  es: {
    search_placeholder: 'prueba "75 kg a lbs" o "100 millas en km"',
    favorites: 'Guardados',
    fav_empty: 'Guarda conversiones aquí.',
    popular: 'Conversiones Populares',
    copy: 'Copiar',
    copied: '¡Copiado!',
    share: 'Compartir',
    favorite: 'Guardar',
    unfavorite: 'Quitar',
    reverse: 'Invertir',
    decimals: 'Decimales',
    formula: 'Fórmula',
    install: 'Instalar App',
    from: 'De', to: 'A', amount: 'Cantidad', result: 'Resultado',
    offline: 'Sin conexión listo',
    live_rates: 'Tasas en vivo',
    fallback_rates: 'Tasas estáticas',
    loading: 'Cargando…',
    generate: 'Generar',
    encode: 'Codificar →',
    decode: '← Decodificar',
    gen_qr: 'Generar QR',
  },
  de: {
    search_placeholder: 'versuche "75 kg in lbs" oder "100 Meilen in km"',
    favorites: 'Gespeichert',
    fav_empty: 'Umrechnungen hier speichern.',
    popular: 'Beliebte Umrechnungen',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    share: 'Teilen',
    favorite: 'Speichern',
    unfavorite: 'Entfernen',
    reverse: 'Umkehren',
    decimals: 'Dezimalst.',
    formula: 'Formel',
    install: 'App installieren',
    from: 'Von', to: 'Nach', amount: 'Betrag', result: 'Ergebnis',
    offline: 'Offline bereit',
    live_rates: 'Live-Kurse',
    fallback_rates: 'Statische Kurse',
    loading: 'Laden…',
    generate: 'Generieren',
    encode: 'Kodieren →',
    decode: '← Dekodieren',
    gen_qr: 'QR generieren',
  }
};

/* ── CATEGORIES ── */
const CATEGORIES = [
  { id: 'length', label: 'Length' },
  { id: 'weight', label: 'Weight' },
  { id: 'temperature', label: 'Temperature' },
  { id: 'volume', label: 'Volume' },
  { id: 'area', label: 'Area' },
  { id: 'speed', label: 'Speed' },
  { id: 'data', label: 'Data / Storage' },
  { id: 'energy', label: 'Energy' },
  { id: 'pressure', label: 'Pressure' },
  { id: 'power', label: 'Power' },
  { id: 'time', label: 'Time' },
  { id: 'angle', label: 'Angle' },
  { id: 'fuel', label: 'Fuel' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'shoe', label: 'Shoe Size' },
  { id: 'percentage', label: 'Percentage' },
  { id: 'currency', label: 'Currency', special: true },
  { id: 'timezone', label: 'Timezone', special: true },
  { id: 'color', label: 'Color', special: true },
  { id: 'bmi', label: 'BMI', special: true },
  { id: 'age', label: 'Age / Date', special: true },
  { id: 'base', label: 'Hex / Binary', special: true },
  { id: 'roman', label: 'Roman', special: true },
  { id: 'password', label: 'Password', special: true },
  { id: 'base64', label: 'Base64', special: true },
  { id: 'qr', label: 'QR Code', special: true },
];

/* ── UNITS (base = 1 SI unit, factor = how many SI per this unit) ── */
const UNITS = {

  length: {
    base: 'm',
    formula: (f, t) => `Multiply value in ${f} by conversion factor to get ${t}`,
    units: {
      'm': { label: 'Meter (m)', f: 1 },
      'km': { label: 'Kilometer (km)', f: 1000 },
      'cm': { label: 'Centimeter (cm)', f: 0.01 },
      'mm': { label: 'Millimeter (mm)', f: 0.001 },
      'um': { label: 'Micrometer (μm)', f: 1e-6 },
      'nm': { label: 'Nanometer (nm)', f: 1e-9 },
      'in': { label: 'Inch (in)', f: 0.0254 },
      'ft': { label: 'Foot (ft)', f: 0.3048 },
      'yd': { label: 'Yard (yd)', f: 0.9144 },
      'mi': { label: 'Mile (mi)', f: 1609.344 },
      'nmi': { label: 'Nautical mile (nmi)', f: 1852 },
      'ly': { label: 'Light-year (ly)', f: 9.461e15 },
      'au': { label: 'Astron. unit (AU)', f: 1.496e11 },
      'pc': { label: 'Parsec (pc)', f: 3.086e16 },
    }
  },

  weight: {
    base: 'kg',
    units: {
      'kg': { label: 'Kilogram (kg)', f: 1 },
      'g': { label: 'Gram (g)', f: 0.001 },
      'mg': { label: 'Milligram (mg)', f: 1e-6 },
      'ug': { label: 'Microgram (μg)', f: 1e-9 },
      't': { label: 'Metric ton (t)', f: 1000 },
      'lb': { label: 'Pound (lb)', f: 0.45359237 },
      'oz': { label: 'Ounce (oz)', f: 0.028349523125 },
      'st': { label: 'Stone (st)', f: 6.35029318 },
      'lt': { label: 'Long ton (lt)', f: 1016.0469 },
      'st2': { label: 'Short ton (sh t)', f: 907.18474 },
      'ct': { label: 'Carat (ct)', f: 0.0002 },
      'gr': { label: 'Grain (gr)', f: 0.00006479891 },
    }
  },

  temperature: {
    base: 'C',
    special: true,
    units: {
      'C': { label: 'Celsius (°C)' },
      'F': { label: 'Fahrenheit (°F)' },
      'K': { label: 'Kelvin (K)' },
      'R': { label: 'Rankine (°R)' },
    }
  },

  volume: {
    base: 'L',
    units: {
      'L': { label: 'Liter (L)', f: 1 },
      'mL': { label: 'Milliliter (mL)', f: 0.001 },
      'cL': { label: 'Centiliter (cL)', f: 0.01 },
      'dL': { label: 'Deciliter (dL)', f: 0.1 },
      'm3': { label: 'Cubic meter (m³)', f: 1000 },
      'cm3': { label: 'Cubic centimeter', f: 0.001 },
      'in3': { label: 'Cubic inch (in³)', f: 0.016387064 },
      'ft3': { label: 'Cubic foot (ft³)', f: 28.316846592 },
      'gal': { label: 'Gallon US (gal)', f: 3.785411784 },
      'galUK': { label: 'Gallon UK (gal)', f: 4.54609 },
      'qt': { label: 'Quart US (qt)', f: 0.946352946 },
      'pt': { label: 'Pint US (pt)', f: 0.473176473 },
      'ptUK': { label: 'Pint UK (pt)', f: 0.56826125 },
      'cup': { label: 'Cup US', f: 0.2365882365 },
      'floz': { label: 'Fl. oz US', f: 0.0295735296 },
      'tbsp': { label: 'Tablespoon (tbsp)', f: 0.0147867648 },
      'tsp': { label: 'Teaspoon (tsp)', f: 0.0049289216 },
      'bbl': { label: 'Oil barrel (bbl)', f: 158.987295 },
    }
  },

  area: {
    base: 'm2',
    units: {
      'm2': { label: 'Sq. meter (m²)', f: 1 },
      'km2': { label: 'Sq. kilometer', f: 1e6 },
      'cm2': { label: 'Sq. centimeter', f: 1e-4 },
      'mm2': { label: 'Sq. millimeter', f: 1e-6 },
      'ha': { label: 'Hectare (ha)', f: 10000 },
      'ac': { label: 'Acre (ac)', f: 4046.8564224 },
      'ft2': { label: 'Sq. foot (ft²)', f: 0.09290304 },
      'in2': { label: 'Sq. inch (in²)', f: 0.00064516 },
      'yd2': { label: 'Sq. yard (yd²)', f: 0.83612736 },
      'mi2': { label: 'Sq. mile (mi²)', f: 2589988.110336 },
    }
  },

  speed: {
    base: 'm/s',
    units: {
      'm/s': { label: 'Meters/sec (m/s)', f: 1 },
      'km/h': { label: 'Km/hour (km/h)', f: 0.27777778 },
      'mph': { label: 'Miles/hour (mph)', f: 0.44704 },
      'kn': { label: 'Knot (kn)', f: 0.51444444 },
      'ft/s': { label: 'Feet/sec (ft/s)', f: 0.3048 },
      'mach': { label: 'Mach (Ma)', f: 340.29 },
      'c': { label: 'Speed of light', f: 299792458 },
    }
  },

  data: {
    base: 'B',
    units: {
      'b': { label: 'Bit (b)', f: 0.125 },
      'B': { label: 'Byte (B)', f: 1 },
      'KB': { label: 'Kilobyte (KB)', f: 1000 },
      'MB': { label: 'Megabyte (MB)', f: 1e6 },
      'GB': { label: 'Gigabyte (GB)', f: 1e9 },
      'TB': { label: 'Terabyte (TB)', f: 1e12 },
      'PB': { label: 'Petabyte (PB)', f: 1e15 },
      'KiB': { label: 'Kibibyte (KiB)', f: 1024 },
      'MiB': { label: 'Mebibyte (MiB)', f: 1048576 },
      'GiB': { label: 'Gibibyte (GiB)', f: 1073741824 },
      'TiB': { label: 'Tebibyte (TiB)', f: 1099511627776 },
    }
  },

  energy: {
    base: 'J',
    units: {
      'J': { label: 'Joule (J)', f: 1 },
      'kJ': { label: 'Kilojoule (kJ)', f: 1000 },
      'MJ': { label: 'Megajoule (MJ)', f: 1e6 },
      'cal': { label: 'Calorie (cal)', f: 4.184 },
      'kcal': { label: 'Kilocalorie (kcal)', f: 4184 },
      'Wh': { label: 'Watt-hour (Wh)', f: 3600 },
      'kWh': { label: 'Kilowatt-h (kWh)', f: 3600000 },
      'eV': { label: 'Electronvolt', f: 1.60218e-19 },
      'BTU': { label: 'BTU', f: 1055.06 },
      'therm': { label: 'Therm (US)', f: 105480400 },
      'ftlbf': { label: 'Foot-pound', f: 1.35582 },
    }
  },

  pressure: {
    base: 'Pa',
    units: {
      'Pa': { label: 'Pascal (Pa)', f: 1 },
      'kPa': { label: 'Kilopascal', f: 1000 },
      'MPa': { label: 'Megapascal', f: 1e6 },
      'bar': { label: 'Bar', f: 100000 },
      'mbar': { label: 'Millibar', f: 100 },
      'atm': { label: 'Atmosphere', f: 101325 },
      'mmHg': { label: 'mmHg / Torr', f: 133.322 },
      'inHg': { label: 'Inch Hg', f: 3386.389 },
      'psi': { label: 'PSI', f: 6894.757 },
    }
  },

  power: {
    base: 'W',
    units: {
      'W': { label: 'Watt (W)', f: 1 },
      'kW': { label: 'Kilowatt (kW)', f: 1000 },
      'MW': { label: 'Megawatt (MW)', f: 1e6 },
      'hp': { label: 'Horsepower (hp)', f: 745.69987 },
      'BTU/h': { label: 'BTU/hour', f: 0.29307107 },
      'cal/s': { label: 'Cal/sec', f: 4.184 },
    }
  },

  time: {
    base: 's',
    units: {
      'ns': { label: 'Nanosecond (ns)', f: 1e-9 },
      'us': { label: 'Microsecond (μs)', f: 1e-6 },
      'ms': { label: 'Millisecond (ms)', f: 0.001 },
      's': { label: 'Second (s)', f: 1 },
      'min': { label: 'Minute (min)', f: 60 },
      'h': { label: 'Hour (h)', f: 3600 },
      'd': { label: 'Day (d)', f: 86400 },
      'wk': { label: 'Week (wk)', f: 604800 },
      'mo': { label: 'Month (30d)', f: 2592000 },
      'yr': { label: 'Year (yr)', f: 31557600 },
      'dec': { label: 'Decade', f: 315576000 },
      'cent': { label: 'Century', f: 3155760000 },
    }
  },

  angle: {
    base: 'deg',
    units: {
      'deg': { label: 'Degree (°)', f: 1 },
      'rad': { label: 'Radian (rad)', f: 180 / Math.PI },
      'grad': { label: 'Gradian', f: 0.9 },
      'arcmin': { label: 'Arcminute', f: 1 / 60 },
      'arcsec': { label: 'Arcsecond', f: 1 / 3600 },
      'turn': { label: 'Turn / Rev', f: 360 },
    }
  },

  fuel: {
    base: 'L/100km',
    special: true,
    units: {
      'L/100km': { label: 'L/100km' },
      'mpg': { label: 'MPG (US)' },
      'mpg_uk': { label: 'MPG (UK)' },
      'km/L': { label: 'km/L' },
      'mi/L': { label: 'mi/L' },
    }
  },

  cooking: {
    base: 'mL',
    units: {
      'mL': { label: 'Milliliter (mL)', f: 1 },
      'L': { label: 'Liter (L)', f: 1000 },
      'tsp': { label: 'Teaspoon (tsp)', f: 4.92892 },
      'tbsp': { label: 'Tablespoon (tbsp)', f: 14.7868 },
      'floz': { label: 'Fl oz', f: 29.5735 },
      'cup': { label: 'Cup (US)', f: 236.588 },
      'pt': { label: 'Pint (US)', f: 473.176 },
      'qt': { label: 'Quart (US)', f: 946.353 },
      'gal': { label: 'Gallon (US)', f: 3785.41 },
      'ml_uk': { label: 'Dessertspoon UK', f: 11.8388 },
    }
  },

  shoe: {
    base: 'cm',
    special: true,
    units: {
      'cm': { label: 'Foot length (cm)' },
      'US_M': { label: 'US Men' },
      'US_W': { label: 'US Women' },
      'EU': { label: 'EU' },
      'UK': { label: 'UK' },
      'JP': { label: 'Japan (cm)' },
    }
  },

  percentage: {
    base: '%',
    special: true,
    units: {
      '%': { label: 'Percent (%)' },
      'dec': { label: 'Decimal' },
      'frac': { label: 'Fraction' },
      'ppm': { label: 'Parts per million (ppm)' },
      'ppb': { label: 'Parts per billion (ppb)' },
    }
  },
};

/* ── TEMPERATURE conversions ── */
function convertTemperature(val, from, to) {
  if (from === to) return val;
  // to Celsius first
  let c;
  switch (from) {
    case 'C': c = val; break;
    case 'F': c = (val - 32) * 5 / 9; break;
    case 'K': c = val - 273.15; break;
    case 'R': c = (val - 491.67) * 5 / 9; break;
  }
  switch (to) {
    case 'C': return c;
    case 'F': return c * 9 / 5 + 32;
    case 'K': return c + 273.15;
    case 'R': return (c + 273.15) * 9 / 5;
  }
}

/* ── FUEL conversions ── */
function convertFuel(val, from, to) {
  if (from === to) return val;
  // convert to L/100km first
  let lp;
  switch (from) {
    case 'L/100km': lp = val; break;
    case 'mpg': lp = 235.214583 / val; break;
    case 'mpg_uk': lp = 282.481 / val; break;
    case 'km/L': lp = 100 / val; break;
    case 'mi/L': lp = 62.1371 / val; break;
  }
  switch (to) {
    case 'L/100km': return lp;
    case 'mpg': return 235.214583 / lp;
    case 'mpg_uk': return 282.481 / lp;
    case 'km/L': return 100 / lp;
    case 'mi/L': return 62.1371 / lp;
  }
}

/* ── SHOE SIZE conversions (via cm foot length) ── */
function convertShoe(val, from, to) {
  if (from === to) return val;
  let cm;
  switch (from) {
    case 'cm': cm = val; break;
    case 'US_M': cm = (val + 1.5) * 2.54 / 1 * 0.667 + 18.5; break; // approx
    case 'US_W': cm = (val + 0.5) * 2.54 / 1 * 0.667 + 18.5; break;
    case 'EU': cm = (val - 2) * 0.667 * 2.54; break;
    case 'UK': cm = (val + 2) * 2.54 / 1 * 0.667 + 18.5; break;
    case 'JP': cm = val; break;
    default: cm = val;
  }
  switch (to) {
    case 'cm': return cm;
    case 'US_M': return (cm - 18.5) / (0.667 * 2.54) - 1.5;
    case 'US_W': return (cm - 18.5) / (0.667 * 2.54) - 0.5;
    case 'EU': return cm / (0.667 * 2.54) + 2;
    case 'UK': return (cm - 18.5) / (0.667 * 2.54) - 2;
    case 'JP': return cm;
    default: return cm;
  }
}

/* ── PERCENTAGE conversions ── */
function convertPercentage(val, from, to) {
  if (from === to) return val;
  let pct;
  switch (from) {
    case '%': pct = val; break;
    case 'dec': pct = val * 100; break;
    case 'frac': pct = val * 100; break;
    case 'ppm': pct = val / 10000; break;
    case 'ppb': pct = val / 10000000; break;
    default: pct = val;
  }
  switch (to) {
    case '%': return pct;
    case 'dec': return pct / 100;
    case 'frac': return pct / 100;
    case 'ppm': return pct * 10000;
    case 'ppb': return pct * 10000000;
    default: return pct;
  }
}

/* ── CURRENCY fallback rates (base: USD, Jan 2026) ── */
const CURRENCY_FALLBACK = {
  USD: 1, EUR: 0.9234, GBP: 0.7891, JPY: 149.82, CHF: 0.8945,
  CAD: 1.3612, AUD: 1.5234, NZD: 1.6712, CNY: 7.2341, HKD: 7.7832,
  SGD: 1.3412, NOK: 10.5821, SEK: 10.3124, DKK: 6.8821, PLN: 4.0123,
  CZK: 22.8412, HUF: 362.12, RON: 4.5921, BGN: 1.8062, HRK: 6.9521,
  TRY: 32.4512, RUB: 89.2341, INR: 83.2541, BRL: 4.9821, MXN: 17.1234,
  ZAR: 18.5421, KRW: 1312.34, THB: 35.1234, MYR: 4.6834, IDR: 15632.1,
  PHP: 55.2341, PKR: 278.23, EGP: 30.8521, AED: 3.6725, SAR: 3.7512,
  ILS: 3.7121, QAR: 3.6412, KWD: 0.3081, BHD: 0.3770, OMR: 0.3851,
  ARG: 835.12, CLP: 945.23, COP: 3912.41, PEN: 3.7412, VND: 24342.1,
  BTC: 0.0000227, ETH: 0.000321, BNB: 0.00153, XRP: 1.8234, SOL: 0.00832,
  USDT: 1.0001, USDC: 1.0000, ADA: 2.3412,
};

/* ── TIMEZONES (list of major world cities) ── */
const TIMEZONES = [
  { tz: 'America/New_York', label: '🇺🇸 New York (EST/EDT)' },
  { tz: 'America/Chicago', label: '🇺🇸 Chicago (CST/CDT)' },
  { tz: 'America/Denver', label: '🇺🇸 Denver (MST/MDT)' },
  { tz: 'America/Los_Angeles', label: '🇺🇸 Los Angeles (PST/PDT)' },
  { tz: 'America/Anchorage', label: '🇺🇸 Anchorage (AKST)' },
  { tz: 'Pacific/Honolulu', label: '🇺🇸 Honolulu (HST)' },
  { tz: 'America/Toronto', label: '🇨🇦 Toronto (EST/EDT)' },
  { tz: 'America/Vancouver', label: '🇨🇦 Vancouver (PST/PDT)' },
  { tz: 'America/Mexico_City', label: '🇲🇽 Mexico City (CST)' },
  { tz: 'America/Sao_Paulo', label: '🇧🇷 São Paulo (BRT)' },
  { tz: 'America/Argentina/Buenos_Aires', label: '🇦🇷 Buenos Aires (ART)' },
  { tz: 'America/Bogota', label: '🇨🇴 Bogota (COT)' },
  { tz: 'America/Lima', label: '🇵🇪 Lima (PET)' },
  { tz: 'Atlantic/Reykjavik', label: '🇮🇸 Reykjavik (GMT)' },
  { tz: 'Europe/London', label: '🇬🇧 London (GMT/BST)' },
  { tz: 'Europe/Dublin', label: '🇮🇪 Dublin (GMT/IST)' },
  { tz: 'Europe/Lisbon', label: '🇵🇹 Lisbon (WET)' },
  { tz: 'Europe/Madrid', label: '🇪🇸 Madrid (CET)' },
  { tz: 'Europe/Paris', label: '🇫🇷 Paris (CET)' },
  { tz: 'Europe/Berlin', label: '🇩🇪 Berlin (CET)' },
  { tz: 'Europe/Rome', label: '🇮🇹 Rome (CET)' },
  { tz: 'Europe/Amsterdam', label: '🇳🇱 Amsterdam (CET)' },
  { tz: 'Europe/Brussels', label: '🇧🇪 Brussels (CET)' },
  { tz: 'Europe/Vienna', label: '🇦🇹 Vienna (CET)' },
  { tz: 'Europe/Zurich', label: '🇨🇭 Zurich (CET)' },
  { tz: 'Europe/Warsaw', label: '🇵🇱 Warsaw (CET)' },
  { tz: 'Europe/Prague', label: '🇨🇿 Prague (CET)' },
  { tz: 'Europe/Budapest', label: '🇭🇺 Budapest (CET)' },
  { tz: 'Europe/Bucharest', label: '🇷🇴 Bucharest (EET)' },
  { tz: 'Europe/Athens', label: '🇬🇷 Athens (EET)' },
  { tz: 'Europe/Helsinki', label: '🇫🇮 Helsinki (EET)' },
  { tz: 'Europe/Stockholm', label: '🇸🇪 Stockholm (CET)' },
  { tz: 'Europe/Oslo', label: '🇳🇴 Oslo (CET)' },
  { tz: 'Europe/Copenhagen', label: '🇩🇰 Copenhagen (CET)' },
  { tz: 'Europe/Kiev', label: '🇺🇦 Kyiv (EET)' },
  { tz: 'Europe/Moscow', label: '🇷🇺 Moscow (MSK)' },
  { tz: 'Europe/Istanbul', label: '🇹🇷 Istanbul (TRT)' },
  { tz: 'Africa/Cairo', label: '🇪🇬 Cairo (EET)' },
  { tz: 'Africa/Lagos', label: '🇳🇬 Lagos (WAT)' },
  { tz: 'Africa/Nairobi', label: '🇰🇪 Nairobi (EAT)' },
  { tz: 'Africa/Johannesburg', label: '🇿🇦 Johannesburg (SAST)' },
  { tz: 'Africa/Casablanca', label: '🇲🇦 Casablanca (WET)' },
  { tz: 'Asia/Dubai', label: '🇦🇪 Dubai (GST)' },
  { tz: 'Asia/Riyadh', label: '🇸🇦 Riyadh (AST)' },
  { tz: 'Asia/Tehran', label: '🇮🇷 Tehran (IRST)' },
  { tz: 'Asia/Karachi', label: '🇵🇰 Karachi (PKT)' },
  { tz: 'Asia/Kolkata', label: '🇮🇳 Mumbai/Delhi (IST)' },
  { tz: 'Asia/Dhaka', label: '🇧🇩 Dhaka (BST)' },
  { tz: 'Asia/Colombo', label: '🇱🇰 Colombo (IST)' },
  { tz: 'Asia/Bangkok', label: '🇹🇭 Bangkok (ICT)' },
  { tz: 'Asia/Singapore', label: '🇸🇬 Singapore (SGT)' },
  { tz: 'Asia/Shanghai', label: '🇨🇳 Shanghai/Beijing (CST)' },
  { tz: 'Asia/Hong_Kong', label: '🇭🇰 Hong Kong (HKT)' },
  { tz: 'Asia/Taipei', label: '🇹🇼 Taipei (CST)' },
  { tz: 'Asia/Seoul', label: '🇰🇷 Seoul (KST)' },
  { tz: 'Asia/Tokyo', label: '🇯🇵 Tokyo (JST)' },
  { tz: 'Asia/Jakarta', label: '🇮🇩 Jakarta (WIB)' },
  { tz: 'Asia/Manila', label: '🇵🇭 Manila (PHT)' },
  { tz: 'Asia/Kuala_Lumpur', label: '🇲🇾 Kuala Lumpur (MYT)' },
  { tz: 'Asia/Calcutta', label: '🇮🇳 Kolkata (IST)' },
  { tz: 'Australia/Perth', label: '🇦🇺 Perth (AWST)' },
  { tz: 'Australia/Adelaide', label: '🇦🇺 Adelaide (ACST)' },
  { tz: 'Australia/Sydney', label: '🇦🇺 Sydney (AEST)' },
  { tz: 'Pacific/Auckland', label: '🇳🇿 Auckland (NZST)' },
  { tz: 'Pacific/Fiji', label: '🇫🇯 Suva (FJT)' },
  { tz: 'UTC', label: '🌐 UTC (Universal)' },
];

/* ── POPULAR conversions shown on homepage ── */
const POPULAR_CONVERSIONS = [
  { cat: 'weight', from: 'kg', to: 'lb', val: 75, label: 'kg → lb' },
  { cat: 'length', from: 'km', to: 'mi', val: 1, label: 'km → mi' },
  { cat: 'length', from: 'cm', to: 'in', val: 180, label: 'cm → in' },
  { cat: 'temperature', from: 'C', to: 'F', val: 100, label: '°C → °F' },
  { cat: 'data', from: 'GB', to: 'MB', val: 1, label: 'GB → MB' },
  { cat: 'speed', from: 'km/h', to: 'mph', val: 100, label: 'km/h → mph' },
  { cat: 'volume', from: 'L', to: 'gal', val: 1, label: 'L → gal' },
  { cat: 'length', from: 'mi', to: 'km', val: 1, label: 'mi → km' },
  { cat: 'weight', from: 'lb', to: 'kg', val: 150, label: 'lb → kg' },
  { cat: 'length', from: 'in', to: 'cm', val: 6, label: 'in → cm' },
  { cat: 'temperature', from: 'F', to: 'C', val: 98.6, label: '°F → °C' },
  { cat: 'data', from: 'MB', to: 'GB', val: 1024, label: 'MB → GB' },
  { cat: 'energy', from: 'kcal', to: 'kJ', val: 2000, label: 'kcal → kJ' },
  { cat: 'speed', from: 'mph', to: 'km/h', val: 60, label: 'mph → km/h' },
  { cat: 'pressure', from: 'psi', to: 'bar', val: 30, label: 'psi → bar' },
  { cat: 'volume', from: 'cup', to: 'mL', val: 1, label: 'cup → mL' },
  { cat: 'weight', from: 'oz', to: 'g', val: 1, label: 'oz → g' },
  { cat: 'time', from: 'h', to: 'min', val: 8, label: 'hrs → min' },
  { cat: 'data', from: 'GB', to: 'GiB', val: 1, label: 'GB → GiB' },
  { cat: 'area', from: 'm2', to: 'ft2', val: 100, label: 'm² → ft²' },
];

/* ── NL PARSE PATTERNS – "to/in" is optional so "75 kg lbs" also works ── */
const SEP = /\s*(?:to|in|into|=|->|→|a|en|nach|vers)?\s*/i;
const NL_PATTERNS = [
  // Weight
  { re: new RegExp(`^([\\d.,]+)\\s*(?:kg|kilogram[s]?)${SEP.source}(?:lb[s]?|pound[s]?)`, 'i'), cat: 'weight', from: 'kg', to: 'lb' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:lb[s]?|pound[s]?)${SEP.source}(?:kg|kilogram[s]?)`, 'i'), cat: 'weight', from: 'lb', to: 'kg' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:oz|ounce[s]?)${SEP.source}(?:g|gram[s]?)`, 'i'), cat: 'weight', from: 'oz', to: 'g' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:g|gram[s]?)${SEP.source}(?:oz|ounce[s]?)`, 'i'), cat: 'weight', from: 'g', to: 'oz' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:kg|kilogram[s]?)${SEP.source}(?:g|gram[s]?)`, 'i'), cat: 'weight', from: 'kg', to: 'g' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:st|stone[s]?)${SEP.source}(?:kg|kilogram[s]?)`, 'i'), cat: 'weight', from: 'st', to: 'kg' },
  // Length
  { re: new RegExp(`^([\\d.,]+)\\s*(?:km|kilometer[s]?)${SEP.source}(?:mi(?:le[s]?)?)`, 'i'), cat: 'length', from: 'km', to: 'mi' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:mi(?:le[s]?)?)${SEP.source}(?:km|kilometer[s]?)`, 'i'), cat: 'length', from: 'mi', to: 'km' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:cm|centimeter[s]?)${SEP.source}(?:in(?:ch(?:es)?)?|inch(?:es)?|")`, 'i'), cat: 'length', from: 'cm', to: 'in' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:in(?:ch(?:es)?)?|inch(?:es)?)${SEP.source}(?:cm|centimeter[s]?)`, 'i'), cat: 'length', from: 'in', to: 'cm' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:ft|feet|foot)${SEP.source}(?:m|meter[s]?)`, 'i'), cat: 'length', from: 'ft', to: 'm' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:m|meter[s]?)${SEP.source}(?:ft|feet|foot)`, 'i'), cat: 'length', from: 'm', to: 'ft' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:mm|millimeter[s]?)${SEP.source}(?:in(?:ch(?:es)?)?|inch(?:es)?)`, 'i'), cat: 'length', from: 'mm', to: 'in' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:m|meter[s]?)${SEP.source}(?:km|kilometer[s]?)`, 'i'), cat: 'length', from: 'm', to: 'km' },
  // Temperature
  { re: new RegExp(`^([\\d.,]+)\\s*(?:°?c|celsius|centigrad)${SEP.source}(?:°?f|fahrenheit|fahr)`, 'i'), cat: 'temperature', from: 'C', to: 'F' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:°?f|fahrenheit|fahr)${SEP.source}(?:°?c|celsius|centigrad)`, 'i'), cat: 'temperature', from: 'F', to: 'C' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:°?c|celsius)${SEP.source}(?:k|kelvin)`, 'i'), cat: 'temperature', from: 'C', to: 'K' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:k|kelvin)${SEP.source}(?:°?c|celsius)`, 'i'), cat: 'temperature', from: 'K', to: 'C' },
  // Data
  { re: new RegExp(`^([\\d.,]+)\\s*(?:gb|gigabyte[s]?)${SEP.source}(?:mb|megabyte[s]?)`, 'i'), cat: 'data', from: 'GB', to: 'MB' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:mb|megabyte[s]?)${SEP.source}(?:gb|gigabyte[s]?)`, 'i'), cat: 'data', from: 'MB', to: 'GB' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:tb|terabyte[s]?)${SEP.source}(?:gb|gigabyte[s]?)`, 'i'), cat: 'data', from: 'TB', to: 'GB' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:gb|gigabyte[s]?)${SEP.source}(?:tb|terabyte[s]?)`, 'i'), cat: 'data', from: 'GB', to: 'TB' },
  // Speed
  { re: new RegExp(`^([\\d.,]+)\\s*(?:mph)${SEP.source}(?:km\\/h|kmh|kph)`, 'i'), cat: 'speed', from: 'mph', to: 'km/h' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:km\\/h|kmh|kph)${SEP.source}(?:mph)`, 'i'), cat: 'speed', from: 'km/h', to: 'mph' },
  // Volume
  { re: new RegExp(`^([\\d.,]+)\\s*(?:liter[s]?|litre[s]?|litr[o]?|l)${SEP.source}(?:gal(?:lon[s]?)?)`, 'i'), cat: 'volume', from: 'L', to: 'gal' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:cup[s]?)${SEP.source}(?:ml|milliliter[s]?|millilitre[s]?)`, 'i'), cat: 'volume', from: 'cup', to: 'mL' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:ml|milliliter[s]?)${SEP.source}(?:cup[s]?)`, 'i'), cat: 'volume', from: 'mL', to: 'cup' },
  // Energy / Pressure / Area
  { re: new RegExp(`^([\\d.,]+)\\s*(?:kcal|calorie[s]?)${SEP.source}(?:kj|kilojoule[s]?)`, 'i'), cat: 'energy', from: 'kcal', to: 'kJ' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:psi)${SEP.source}(?:bar)`, 'i'), cat: 'pressure', from: 'psi', to: 'bar' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:bar)${SEP.source}(?:psi)`, 'i'), cat: 'pressure', from: 'bar', to: 'psi' },
  { re: new RegExp(`^([\\d.,]+)\\s*(?:ha|hectare[s]?)${SEP.source}(?:ac(?:re[s]?)?)`, 'i'), cat: 'area', from: 'ha', to: 'ac' },
];
