import { useEffect, useMemo, useState } from 'react';
import { formatHour, getSkyState, localHour, SKY_PRESETS } from './time.js';
import './sky.css';

const stars = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 37 + 19) % 97,
  y: (i * 17 + 7) % 58,
  size: i % 6 === 0 ? 2 : 1,
}));

const scenes = ['morning', 'day', 'evening', 'night'];
const cloudLayers = [
  { top: '10%', width: '75%', duration: '155s', delay: '-40s', opacity: .38, blur: '8px', rest: '-25vw' },
  { top: '40%', width: '100%', duration: '130s', delay: '-78s', opacity: .46, blur: '12px', rest: '20vw' },
  { top: '68%', width: '120%', duration: '105s', delay: '-22s', opacity: .6, blur: '6px', rest: '-60vw' },
];

export function useLivingSky() {
  const [now, setNow] = useState(() => new Date());
  const [mode, setMode] = useState('live');
  const [paused, setPaused] = useState(() => document.hidden);

  useEffect(() => {
    let interval;
    const sync = () => {
      window.clearInterval(interval);
      setPaused(document.hidden);
      if (!document.hidden) {
        setNow(new Date());
        interval = window.setInterval(() => setNow(new Date()), 30000);
      }
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pageshow', sync);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pageshow', sync);
    };
  }, []);

  const preset = SKY_PRESETS.find(item => item.value === mode) ?? SKY_PRESETS[0];
  const hour = preset.hour ?? localHour(now);
  const sky = useMemo(() => getSkyState(hour), [hour]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', sky.style['--sky-top']);
  }, [sky]);

  return { ...sky, paused, mode, setMode, time: formatHour(hour) };
}

export function SkyControls({ sky }) {
  return (
    <div className="sky-controls">
      <span className="sky-clock pixel" aria-label={`${sky.time}, ${sky.mode === 'live' ? 'your local time' : 'sky preview'}`}>
        <span className="sky-clock-dot" aria-hidden="true" />{sky.time}
      </span>
      <span className="sky-control-divider" aria-hidden="true" />
      <label className="sky-mode-label">
        <span className="sr-only">Sky lighting</span>
        <select value={sky.mode} onChange={event => sky.setMode(event.target.value)}>
          {SKY_PRESETS.map(preset => <option key={preset.value} value={preset.value}>{preset.label}</option>)}
        </select>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </label>
    </div>
  );
}

export default function LivingSky() {
  return (
    <div className="living-sky" aria-hidden="true">
      <div className="sky-gradient" />
      <div className="sky-scenes">
        {scenes.map(scene => (
          <div key={scene} className={`sky-scene sky-scene-${scene}`}>
            <img src={`/assets/sky-${scene}.png`} alt="" width="1536" height="1024" decoding="async" />
          </div>
        ))}
      </div>
      <div className="sky-sun-glow" />
      <div className="sky-stars">
        {stars.map((star, i) => <i key={i} style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }} />)}
      </div>
      <div className="sky-moon" />
      <div className="hero-cloud-atmosphere">
        {cloudLayers.map((layer, index) => (
          <div key={index} className="hero-cloud-layer" style={{
            '--layer-top': layer.top,
            '--layer-width': layer.width,
            '--layer-duration': layer.duration,
            '--layer-delay': layer.delay,
            '--layer-opacity': layer.opacity,
            '--layer-blur': layer.blur,
            '--layer-rest': layer.rest,
          }}>
            <img src="/assets/cloud-bank.png" alt="" width="2172" height="724" decoding="async" />
          </div>
        ))}
        <div className="hero-mist" />
      </div>
      <div className="sky-reading-haze" />
    </div>
  );
}
