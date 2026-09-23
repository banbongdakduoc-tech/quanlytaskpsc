import confetti from 'canvas-confetti';

export function formatVND(amount) {
  if (amount === undefined || amount === null) return '0 đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatCompactVND(amount) {
  if (!amount) return '0 đ';
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} tr đ`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)} k đ`;
  }
  return `${amount} đ`;
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#22C55E', '#84CC16', '#06B6D4', '#FFFFFF'],
    });
  } catch (e) {
    console.error('Confetti error', e);
  }
}

// Sporty success chime via Web Audio API (no external file required)
export function playChime(type = 'success') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch {
    // Audio might be disabled or blocked before first interaction
  }
}

// ----------------------------------------------------
// Distinct Program Color Palette for Dark Sporty Theme
// ----------------------------------------------------
export const PROGRAM_COLOR_PALETTE = [
  {
    id: 'emerald',
    name: 'Emerald Neon',
    border: 'border-emerald-500/40 hover:border-emerald-400',
    cardBg: 'bg-emerald-950/15',
    tagBg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    glow: 'shadow-emerald-500/10'
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    border: 'border-cyan-500/40 hover:border-cyan-400',
    cardBg: 'bg-cyan-950/15',
    tagBg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400',
    glow: 'shadow-cyan-500/10'
  },
  {
    id: 'purple',
    name: 'Vibrant Violet',
    border: 'border-purple-500/40 hover:border-purple-400',
    cardBg: 'bg-purple-950/15',
    tagBg: 'bg-purple-500/15',
    text: 'text-purple-400',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dot: 'bg-purple-400',
    glow: 'shadow-purple-500/10'
  },
  {
    id: 'amber',
    name: 'Sporty Amber',
    border: 'border-amber-500/40 hover:border-amber-400',
    cardBg: 'bg-amber-950/15',
    tagBg: 'bg-amber-500/15',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    glow: 'shadow-amber-500/10'
  },
  {
    id: 'rose',
    name: 'Neon Rose',
    border: 'border-rose-500/40 hover:border-rose-400',
    cardBg: 'bg-rose-950/15',
    tagBg: 'bg-rose-500/15',
    text: 'text-rose-400',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
    glow: 'shadow-rose-500/10'
  },
  {
    id: 'blue',
    name: 'Sky Blue',
    border: 'border-blue-500/40 hover:border-blue-400',
    cardBg: 'bg-blue-950/15',
    tagBg: 'bg-blue-500/15',
    text: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dot: 'bg-blue-400',
    glow: 'shadow-blue-500/10'
  },
  {
    id: 'lime',
    name: 'Lime Spark',
    border: 'border-lime-500/40 hover:border-lime-400',
    cardBg: 'bg-lime-950/15',
    tagBg: 'bg-lime-500/15',
    text: 'text-lime-400',
    badge: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
    dot: 'bg-lime-400',
    glow: 'shadow-lime-500/10'
  },
  {
    id: 'orange',
    name: 'Tangerine Orange',
    border: 'border-orange-500/40 hover:border-orange-400',
    cardBg: 'bg-orange-950/15',
    tagBg: 'bg-orange-500/15',
    text: 'text-orange-400',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    dot: 'bg-orange-400',
    glow: 'shadow-orange-500/10'
  },
];

export function getProgramColor(programId, title = '') {
  if (!programId) {
    return {
      id: 'default',
      name: 'Ngoài Chương Trình',
      border: 'border-white/10 hover:border-white/25',
      cardBg: 'bg-[#141C1E]',
      tagBg: 'bg-white/5',
      text: 'text-slate-400',
      badge: 'bg-white/5 text-slate-300 border-white/10',
      dot: 'bg-slate-500',
      glow: 'shadow-none'
    };
  }
  let hash = 0;
  const str = String(programId) + String(title);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PROGRAM_COLOR_PALETTE.length;
  return PROGRAM_COLOR_PALETTE[index];
}
