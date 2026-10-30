import test from 'node:test';
import assert from 'node:assert/strict';
import { contrast, formatHour, getSkyState, getSkySceneWeights, localHour, normalizeHour, skyPeriod, SKY_PRESETS } from './time.js';

test('uses the visitor’s local clock, including minutes and seconds', () => {
  assert.equal(localHour(new Date(2026, 9, 30, 17, 30, 0)), 17.5);
  assert.equal(localHour(new Date(2026, 9, 30, 0, 0, 30)), 30 / 3600);
});

test('wraps correctly at midnight and formats a 24-hour clock', () => {
  assert.equal(normalizeHour(24), 0);
  assert.equal(normalizeHour(-1), 23);
  assert.equal(formatHour(0), '00:00');
  assert.equal(formatHour(17.75), '17:45');
  assert.equal(formatHour(23 + 59 / 60), '23:59');
  assert.equal(formatHour(24), '00:00');
  assert.equal(formatHour(NaN), '12:00');
});

test('covers all time periods and every preview preset', () => {
  assert.equal(skyPeriod(2), 'night');
  assert.equal(skyPeriod(6), 'dawn');
  assert.equal(skyPeriod(8), 'morning');
  assert.equal(skyPeriod(12), 'day');
  assert.equal(skyPeriod(17.5), 'evening');
  assert.equal(skyPeriod(19), 'dusk');
  for (const preset of SKY_PRESETS) {
    if (preset.hour !== null) assert.ok(getSkyState(preset.hour).style['--sky-top']);
  }
});

test('keeps normal-text contrast at or above 4.5:1 for every minute of the day', () => {
  for (let minute = 0; minute < 1440; minute++) {
    const { colors } = getSkyState(minute / 60);
    assert.ok(contrast(colors.ink, colors.middle) >= 4.5, `Main text contrast at ${formatHour(minute / 60)}`);
    assert.ok(contrast(colors.muted, colors.middle) >= 4.5, `Secondary text contrast at ${formatHour(minute / 60)}`);
  }
});

test('has no color jump at midnight or at palette boundaries', () => {
  for (const boundary of [0, 4.5, 6, 8, 12, 15.5, 17.5, 19, 20.5, 24]) {
    const before = getSkyState(boundary - .001);
    const after = getSkyState(boundary + .001);
    for (const key of ['top', 'middle', 'bottom']) {
      before.colors[key].forEach((value, index) => assert.ok(Math.abs(value - after.colors[key][index]) <= 1));
    }
  }
});

test('night skies have moonlight and stars; daylight skies do not', () => {
  const night = getSkyState(23);
  const day = getSkyState(12);
  assert.equal(night.dark, true);
  assert.ok(Number(night.style['--star-opacity']) > .7);
  assert.ok(Number(night.style['--moon-opacity']) > .7);
  assert.equal(day.dark, false);
  assert.equal(Number(day.style['--star-opacity']), 0);
  assert.equal(Number(day.style['--moon-opacity']), 0);
});


test('photographic scene weights blend continuously and cover the full day', () => {
  for (let minute = 0; minute < 1440; minute++) {
    const weights = getSkySceneWeights(minute / 60);
    const values = Object.values(weights);
    assert.ok(values.every(value => value >= 0 && value <= 1));
    assert.ok(Math.abs(values.reduce((total, value) => total + value, 0) - 1) < 1e-9);
  }
  assert.equal(getSkySceneWeights(6).morning, 1);
  assert.equal(getSkySceneWeights(12).day, 1);
  assert.equal(getSkySceneWeights(17.5).evening, 1);
  assert.equal(getSkySceneWeights(23).night, 1);
  assert.deepEqual(getSkySceneWeights(0), getSkySceneWeights(24));
});
