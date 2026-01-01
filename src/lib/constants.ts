// Design Tokens - Flux Real Brand
export const COLORS = {
  background: '#050505',
  gold: '#FFD700',
  goldDim: '#B8860B',
  white: '#FFFFFF',
} as const;

export const TIMING = {
  autoAdvanceDelay: 2000,  // Auto-advance from stage 4 to 5
  ctaFadeIn: 500,
} as const;

// Stage labels
export const STAGE_LABELS: Record<number, string> = {
  0: 'BEGIN 2026',
  1: 'ALIGN VISION',
  2: 'ACCELERATE GROWTH',
  3: 'LAUNCH TOGETHER',
  4: 'LAUNCH TOGETHER',
  5: '',
};

// CTA Configuration
export const CTA = {
  header: 'FLUX REAL // H1 2026',
  title: 'Conversational AI Agents & The Future of UX',
  events: [
    { name: 'ME PropTech Connect', location: 'Dubai', dates: 'Feb 4–5' },
    { name: 'Arabian Travel Market', location: 'Dubai', dates: 'May 4–7' },
  ],
  tagline: 'Accelerating Global Momentum',
  cta: "LET'S BUILD THE EXTRAORDINARY.",
  button: {
    text: 'SCHEDULE A 2026 SYNC',
    url: 'https://calendar.app.google/j8KygZHUKC8Lsv2w7',
  },
} as const;
