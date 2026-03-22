/**
 * Maps ISO alpha-2 country codes → continent name
 * (matching continents[] names in src/data/continents.js)
 */
const COUNTRY_CONTINENT = {
  // Europe
  gr: 'Europe', fr: 'Europe', de: 'Europe', it: 'Europe', es: 'Europe',
  pt: 'Europe', gb: 'Europe', nl: 'Europe', be: 'Europe', ch: 'Europe',
  at: 'Europe', pl: 'Europe', cz: 'Europe', hu: 'Europe', ro: 'Europe',
  hr: 'Europe', me: 'Europe', mk: 'Europe', al: 'Europe', ba: 'Europe',
  rs: 'Europe', si: 'Europe', sk: 'Europe', bg: 'Europe', no: 'Europe',
  se: 'Europe', dk: 'Europe', fi: 'Europe', ee: 'Europe', lv: 'Europe',
  lt: 'Europe', ie: 'Europe', is: 'Europe', cy: 'Europe', mt: 'Europe',
  lu: 'Europe', mc: 'Europe', li: 'Europe', ad: 'Europe', sm: 'Europe',
  va: 'Europe', ua: 'Europe', by: 'Europe', md: 'Europe',
  ru: 'Europe', // or Asia — list as Europe for simplicity

  // Asia
  jp: 'Asia', cn: 'Asia', kr: 'Asia', vn: 'Asia', th: 'Asia',
  id: 'Asia', my: 'Asia', sg: 'Asia', ph: 'Asia', mm: 'Asia',
  kh: 'Asia', la: 'Asia', bn: 'Asia', in: 'Asia', pk: 'Asia',
  bd: 'Asia', lk: 'Asia', np: 'Asia', bt: 'Asia', mn: 'Asia',
  kz: 'Asia', uz: 'Asia', tm: 'Asia', tj: 'Asia', kg: 'Asia',
  af: 'Asia', ir: 'Asia', iq: 'Asia', sy: 'Asia', lb: 'Asia',
  jo: 'Asia', il: 'Asia', ps: 'Asia', tr: 'Asia',
  am: 'Asia', az: 'Asia', ge: 'Asia',

  // Middle East
  sa: 'Middle East', ae: 'Middle East', qa: 'Middle East', kw: 'Middle East',
  bh: 'Middle East', om: 'Middle East', ye: 'Middle East',

  // North America
  us: 'North America', ca: 'North America', mx: 'North America',
  gt: 'North America', bz: 'North America', hn: 'North America',
  sv: 'North America', ni: 'North America', cr: 'North America',
  pa: 'North America', cu: 'North America', jm: 'North America',
  ht: 'North America', do: 'North America', tt: 'North America',
  bb: 'North America', bs: 'North America', lc: 'North America',
  vc: 'North America', gd: 'North America', ag: 'North America',
  dm: 'North America', kn: 'North America',

  // South America
  br: 'South America', ar: 'South America', cl: 'South America',
  co: 'South America', ve: 'South America', pe: 'South America',
  ec: 'South America', bo: 'South America', py: 'South America',
  uy: 'South America', gy: 'South America', sr: 'South America',
  gf: 'South America',

  // Africa
  eg: 'Africa', za: 'Africa', ng: 'Africa', ke: 'Africa',
  gh: 'Africa', tz: 'Africa', et: 'Africa', ma: 'Africa',
  tn: 'Africa', dz: 'Africa', ly: 'Africa', sd: 'Africa',
  ao: 'Africa', mz: 'Africa', mg: 'Africa', cm: 'Africa',
  ci: 'Africa', ml: 'Africa', bf: 'Africa', ne: 'Africa',
  sn: 'Africa', gn: 'Africa', rw: 'Africa', ug: 'Africa',
  zm: 'Africa', zw: 'Africa', bw: 'Africa', na: 'Africa',
  ls: 'Africa', sz: 'Africa', dj: 'Africa', er: 'Africa',
  so: 'Africa', lr: 'Africa', sl: 'Africa', cd: 'Africa',
  cg: 'Africa', ga: 'Africa', gq: 'Africa', st: 'Africa',
  cv: 'Africa', mu: 'Africa', sc: 'Africa', km: 'Africa',
  bi: 'Africa', mw: 'Africa',

  // Oceania
  au: 'Oceania', nz: 'Oceania', pg: 'Oceania', fj: 'Oceania',
  sb: 'Oceania', vu: 'Oceania', ws: 'Oceania', ki: 'Oceania',
  to: 'Oceania', fm: 'Oceania', pw: 'Oceania', mh: 'Oceania',
  nr: 'Oceania', tv: 'Oceania',
};

/**
 * Geocodes a place name using Nominatim (OpenStreetMap).
 * Returns { country: string, continent: string } or null.
 */
export const geocodePlace = async (placeName) => {
  if (!placeName.trim()) return null;

  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(placeName.trim())}` +
    `&format=json&addressdetails=1&limit=1`;

  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'TravelApp/1.0 (school project)',
    },
  });

  if (!response.ok) throw new Error('Geocoding request failed');

  const results = await response.json();
  if (!results.length) return null;

  const { address } = results[0];
  const country = address.country ?? null;
  const code    = address.country_code?.toLowerCase() ?? null;
  const continent = COUNTRY_CONTINENT[code] ?? null;

  return { country, continent };
};
