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
  title: 'Experiential Design:',
  titleSub: 'Powered by',
  titleHighlight: 'Conversational AI',
  subtitle: 'PropTech · Expos & Events',
  subtitleHighlight: 'Hospitality',
  events: [
    { name: 'PcVue Smart City Conference', location: 'Dubai', dates: 'Jan 21' },
    { name: 'ME PropTech Connect', location: 'Dubai', dates: 'Feb 4–5' },
    { name: 'EuroShop Trade Fair', location: 'Düsseldorf', dates: 'Feb 22–26' },
    { name: 'Arabian Travel Market', location: 'Dubai', dates: 'May 4–7' },
  ],
  tagline: 'Accelerating Global',
  taglineHighlight: 'Momentum',
  cta: "LET'S BUILD THE EXTRAORDINARY.",
  button: {
    text: 'SCHEDULE A 2026 SYNC',
    url: 'https://calendar.app.google/j8KygZHUKC8Lsv2w7',
  },
} as const;
