const frames = [
  { hour: 0, top: '#0d1424', middle: '#18243a', bottom: '#344354', brightness: .38, warmth: 0, opacity: .25, stars: .85, sun: 0, moon: .85 },
  { hour: 4.5, top: '#172039', middle: '#353d54', bottom: '#777086', brightness: .48, warmth: .05, opacity: .28, stars: .55, sun: 0, moon: .45 },
  { hour: 6, top: '#a2a5bc', middle: '#dcc7c8', bottom: '#f5d8b8', brightness: .95, warmth: .18, opacity: .65, stars: 0, sun: .45, moon: 0 },
  { hour: 8, top: '#dde4e8', middle: '#edf0ef', bottom: '#faf6ed', brightness: 1.05, warmth: .04, opacity: .82, stars: 0, sun: .3, moon: 0 },
  { hour: 12, top: '#e0e7eb', middle: '#f0f2f1', bottom: '#fafaf6', brightness: 1.07, warmth: 0, opacity: .86, stars: 0, sun: .18, moon: 0 },
  { hour: 15.5, top: '#dce2e5', middle: '#eeebe5', bottom: '#f5e9d8', brightness: 1.02, warmth: .06, opacity: .78, stars: 0, sun: .3, moon: 0 },
  { hour: 17.5, top: '#b5b4c6', middle: '#e3c5b8', bottom: '#f6c995', brightness: .97, warmth: .25, opacity: .65, stars: 0, sun: .65, moon: 0 },
  { hour: 19, top: '#41455f', middle: '#696078', bottom: '#ba8c88', brightness: .62, warmth: .18, opacity: .36, stars: .15, sun: .05, moon: .25 },
  { hour: 20.5, top: '#141d32', middle: '#253148', bottom: '#47526a', brightness: .43, warmth: 0, opacity: .26, stars: .75, sun: 0, moon: .8 },
  { hour: 24, top: '#0d1424', middle: '#18243a', bottom: '#344354', brightness: .38, warmth: 0, opacity: .25, stars: .85, sun: 0, moon: .85 },
];

export const SKY_PRESETS = [
  { value: 'live', label: 'Local time', hour: null },
  { value: 'morning', label: 'Morning', hour: 7.5 },
  { value: 'day', label: 'Daylight', hour: 12 },
  { value: 'evening', label: 'Evening', hour: 17.75 },
  { value: 'night', label: 'Night', hour: 23 },
];

export function normalizeHour(hour) {
  if (!Number.isFinite(hour)) return 12;
  return ((hour % 24) + 24) % 24;
}

export function localHour(date = new Date()) {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
}

function rgb(hex) {
  return [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
}

export function luminance(color) {
  const linear = color.map(value => {
    const channel = value / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}

export function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

function readableInk(background) {
  // Prefer soft charcoal by day; use stronger ink during the short twilight crossover.
  const charcoal = rgb('#30302e');
  if (contrast(charcoal, background) >= 7) {
    const secondary = rgb('#62625f');
    return { ink: charcoal, muted: contrast(secondary, background) >= 4.5 ? secondary : charcoal, dark: false };
  }
  const white = [255, 255, 255];
  const black = [0, 0, 0];
  const dark = contrast(white, background) > contrast(black, background);
  return { ink: dark ? white : black, muted: dark ? white : black, dark };
}

export function skyPeriod(hour) {
  const h = normalizeHour(hour);
  if (h < 5 || h >= 20.5) return 'night';
  if (h < 7) return 'dawn';
  if (h < 11) return 'morning';
  if (h < 16.5) return 'day';
  if (h < 18.5) return 'evening';
  return 'dusk';
}

// Full photographic skies blend through the day, independently of the fixed office board.
export function getSkySceneWeights(hour) {
  const h = normalizeHour(hour);
  const stops = [
    [0, 'night'], [4.5, 'night'], [6, 'morning'], [9, 'day'],
    [15.5, 'day'], [17.5, 'evening'], [20.5, 'night'], [24, 'night'],
  ];
  const index = stops.findIndex((stop, i) => i < stops.length - 1 && h >= stop[0] && h < stops[i + 1][0]);
  const from = stops[index];
  const to = stops[index + 1];
  const t = (h - from[0]) / (to[0] - from[0]);
  const blend = t * t * (3 - 2 * t);
  const weights = { morning: 0, day: 0, evening: 0, night: 0 };
  weights[from[1]] += 1 - blend;
  weights[to[1]] += blend;
  return weights;
}

export function getSkyState(hour) {
  const h = normalizeHour(hour);
  const index = frames.findIndex((frame, i) => i < frames.length - 1 && h >= frame.hour && h < frames[i + 1].hour);
  const from = frames[Math.max(0, index)];
  const to = frames[Math.max(0, index) + 1];
  const progress = (h - from.hour) / (to.hour - from.hour);
  const eased = progress * progress * (3 - 2 * progress);
  const mix = (a, b) => a + (b - a) * eased;
  const color = key => rgb(from[key]).map((value, i) => Math.round(mix(value, rgb(to[key])[i])));
  const top = color('top');
  const middle = color('middle');
  const bottom = color('bottom');
  const { ink, muted, dark } = readableInk(middle);
  const sceneWeights = getSkySceneWeights(h);
  const twilightProtection = (1 - Math.min(1, Math.abs(luminance(middle) - .18) / .12)) * .98;
  const haze = Math.max(dark ? .84 : .32, twilightProtection);
  const cssColor = values => `rgb(${values.join(', ')})`;
  return {
    hour: h,
    period: skyPeriod(h),
    dark,
    colors: { top, middle, bottom, ink, muted },
    style: {
      '--scene-morning': sceneWeights.morning,
      '--scene-day': sceneWeights.day,
      '--scene-evening': sceneWeights.evening,
      '--scene-night': sceneWeights.night,
      '--sky-haze': haze.toFixed(3),
      '--sky-top': cssColor(top),
      '--sky-middle': cssColor(middle),
      '--sky-bottom': cssColor(bottom),
      '--sky-middle-channels': middle.join(', '),
      '--sky-ink': cssColor(ink),
      '--sky-muted': cssColor(muted),
      '--sky-surface-alpha': dark ? .12 : .65,
      '--sky-border-alpha': dark ? .24 : .85,
      '--cloud-brightness': mix(from.brightness, to.brightness).toFixed(3),
      '--cloud-warmth': mix(from.warmth, to.warmth).toFixed(3),
      '--cloud-opacity': mix(from.opacity, to.opacity).toFixed(3),
      '--star-opacity': mix(from.stars, to.stars).toFixed(3),
      '--sun-opacity': mix(from.sun, to.sun).toFixed(3),
      '--moon-opacity': mix(from.moon, to.moon).toFixed(3),
    },
  };
}

export function formatHour(hour) {
  const minutes = Math.floor(normalizeHour(hour) * 60 + 1e-6) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
