// Frame configuration for each stage
export const FRAME_CONFIG = {
  0: { folder: 'stage-0', count: 30, loop: true, fps: 18 },
  1: { folder: 'stage-1', count: 30, loop: false, fps: 18 },
  2: { folder: 'stage-2', count: 30, loop: false, fps: 12 },
  3: { folder: 'stage-3', count: 30, loop: false, fps: 18 },
  4: { folder: 'stage-4', count: 30, loop: false, fps: 18 },
} as const;

export type StageKey = keyof typeof FRAME_CONFIG;

// Helper to get frame path
export function getFramePath(stage: StageKey, frameIndex: number): string {
  const config = FRAME_CONFIG[stage];
  const frameNum = String(frameIndex + 1).padStart(4, '0');
  return `/frames/${config.folder}/${frameNum}.webp`;
}
