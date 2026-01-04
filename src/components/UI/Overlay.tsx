'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePeakStore } from '@/store/peakStore';
import { CTA, STAGE_LABELS, TIMING } from '@/lib/constants';

// Progress breadcrumb indicator - line style
function ProgressIndicator() {
  const currentStage = usePeakStore((s) => s.currentStage);
  const totalStages = 4; // Stages 0-3 have interactions, 4 auto-advances

  if (currentStage >= 4) return null;

  return (
    <motion.div
      className="absolute top-6 left-8 right-8 md:left-12 md:right-12 flex items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {[...Array(totalStages)].map((_, index) => (
        <motion.div
          key={index}
          className="relative flex-1 h-[2px] overflow-hidden rounded-full"
          style={{ background: 'rgba(255,255,255,0.2)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
        >
          {/* Filled portion */}
          <motion.div
            className="absolute inset-0 rounded-full origin-left"
            style={{
              background: index <= currentStage
                ? '#F5A623'
                : 'transparent',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index <= currentStage ? 1 : 0 }}
            transition={{ duration: 0.5, delay: index <= currentStage ? 0.2 : 0 }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Stage label display
function StageLabel() {
  const currentStage = usePeakStore((s) => s.currentStage);
  const label = STAGE_LABELS[currentStage];

  if (currentStage >= 5 || !label) return null;

  // Split label into words for staggered animation
  const words = label.split(' ');

  return (
    <motion.div
      key={currentStage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-1/3 left-8 md:left-12 text-left pointer-events-none"
    >
      <div className="flex flex-col gap-1">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="text-3xl md:text-5xl font-light tracking-[0.2em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {word}
          </motion.span>
        ))}
      </div>
      {/* Animated accent line */}
      <div className="relative mt-4 h-[2px] w-20 overflow-hidden">
        {/* Base line */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#F5A623] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          style={{ transformOrigin: 'left' }}
        />
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            width: '50%',
          }}
          animate={{ x: ['-100%', '250%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1,
          }}
        />
        {/* Glowing end dot */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{
            background: '#F5A623',
            boxShadow: '0 0 8px #F5A623',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

// Sparkle effect on touch
interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotation: number;
}

const SPARKLE_COLORS = ['#F5A623', '#E8883A', '#FFC966', '#FFB347'];

function TouchSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const idRef = useRef(0);

  const createSparkle = useCallback((clientX: number, clientY: number) => {
    const newSparkles: Sparkle[] = [];
    // Create 8-12 sparkles per touch with varied properties
    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: idRef.current++,
        x: clientX + (Math.random() - 0.5) * 30,
        y: clientY + (Math.random() - 0.5) * 30,
        size: 8 + Math.random() * 10,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        duration: 0.5 + Math.random() * 0.4,
        delay: Math.random() * 0.1,
        rotation: Math.random() * 360,
      });
    }
    setSparkles(prev => [...prev, ...newSparkles]);

    // Remove sparkles after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 1000);
  }, []);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      Array.from(e.touches).forEach(touch => {
        createSparkle(touch.clientX, touch.clientY);
      });
    };

    const handleClick = (e: MouseEvent) => {
      createSparkle(e.clientX, e.clientY);
    };

    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleClick);
    };
  }, [createSparkle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {sparkles.map((sparkle) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 30 + Math.random() * 50;
          return (
            <motion.div
              key={sparkle.id}
              className="absolute"
              style={{
                left: sparkle.x,
                top: sparkle.y,
                width: sparkle.size,
                height: sparkle.size,
              }}
              initial={{ scale: 0, opacity: 0, rotate: sparkle.rotation }}
              animate={{
                scale: [0, 1.2, 0.8, 0],
                opacity: [0, 1, 0.8, 0],
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance - 30,
                rotate: sparkle.rotation + 180,
              }}
              transition={{
                duration: sparkle.duration,
                delay: sparkle.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 12 12">
                <path
                  d="M6 0L7.2 4.2L12 6L7.2 7.8L6 12L4.8 7.8L0 6L4.8 4.2L6 0Z"
                  fill={sparkle.color}
                  style={{ filter: `drop-shadow(0 0 ${sparkle.size/3}px ${sparkle.color})` }}
                />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Minimal swipe slider component
function SwipeSlider({ onComplete }: { onComplete: () => void }) {
  const currentStage = usePeakStore((s) => s.currentStage);
  const x = useMotionValue(0);
  const sliderWidth = 200;
  const thumbSize = 44;
  const maxDrag = sliderWidth - thumbSize;

  // Transforms
  const progressWidth = useTransform(x, [0, maxDrag], [thumbSize, sliderWidth]);
  const thumbGlow = useTransform(x, [0, maxDrag], [0.4, 0.8]);

  // Reset when stage changes
  useEffect(() => {
    animate(x, 0, { duration: 0.3 });
  }, [currentStage, x]);

  const handleDragEnd = () => {
    if (x.get() >= maxDrag * 0.8) {
      animate(x, maxDrag, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
          }
          setTimeout(onComplete, 150);
        }
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  if (currentStage >= 4) return null;

  return (
    <motion.div
      className="absolute bottom-12 left-8 md:left-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      {/* Label with subtle glow - darker on stage 0 for bright background */}
      <motion.p
        className="text-[10px] tracking-[0.3em] mb-3 font-semibold uppercase"
        style={{
          color: currentStage === 0 ? 'rgba(5,5,5,0.7)' : 'rgba(245,213,168,0.6)',
          textShadow: currentStage === 0 ? '0 1px 2px rgba(255,255,255,0.3)' : 'none',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {currentStage === 0 ? 'Slide to begin' : 'Slide to continue'}
      </motion.p>

      {/* Slider container */}
      <div className="relative">
        {/* Ambient glow behind slider */}
        <motion.div
          className="absolute -inset-2 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.15) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Slider track */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: sliderWidth,
            height: thumbSize,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(245,166,35,0.15)',
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(245,166,35,0.1) 50%, transparent 100%)',
            }}
            animate={{ x: [-sliderWidth, sliderWidth] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />

          {/* Progress fill */}
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: progressWidth,
              background: 'linear-gradient(90deg, rgba(245,166,35,0.1) 0%, rgba(245,166,35,0.25) 100%)',
            }}
          />

          {/* Arrow hints that travel */}
          <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: thumbSize + 8 }}
                animate={{
                  x: [0, sliderWidth - thumbSize - 30],
                  opacity: [0, 0.4, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut",
                }}
              >
                <span style={{ color: 'rgba(245,166,35,0.5)', fontSize: 10 }}>→</span>
              </motion.div>
            ))}
          </div>

          {/* Draggable thumb */}
          <motion.div
            className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
            style={{ x, width: thumbSize, height: thumbSize }}
            drag="x"
            dragConstraints={{ left: 0, right: maxDrag }}
            dragElastic={0.02}
            onDragEnd={handleDragEnd}
          >
            {/* Thumb glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(245,166,35,0.4) 0%, transparent 70%)',
                scale: 1.8,
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Thumb button */}
            <motion.div
              className="relative w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #F5A623 0%, #E8883A 100%)',
              }}
              animate={{
                boxShadow: [
                  '0 2px 15px rgba(245,166,35,0.4)',
                  '0 4px 25px rgba(245,166,35,0.6)',
                  '0 2px 15px rgba(245,166,35,0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="text-base font-medium"
                style={{ color: '#050505' }}
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Final CTA screen
function CTAOverlay() {
  const currentStage = usePeakStore((s) => s.currentStage);

  if (currentStage !== 5) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Flux Real 2026',
          text: 'Check out this interactive New Year experience!',
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  // Smooth easing curve
  const smoothEase = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
    >
      <div className="max-w-lg">
        {/* Header with reveal animation */}
        <div className="overflow-hidden mb-6">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="flex items-center gap-3"
          >
            <span
              className="text-sm md:text-base font-semibold tracking-[0.25em]"
              style={{ color: '#F5D5A8' }}
            >
              FLUX REAL
            </span>
            <span style={{ color: 'rgba(245,166,35,0.4)' }}>{'//'}</span>
            <span
              className="text-sm md:text-base font-light tracking-[0.2em]"
              style={{ color: '#F5A623' }}
            >
              H1 2026
            </span>
          </motion.div>
        </div>

        {/* Animated accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: smoothEase }}
          className="h-px w-24 mb-10 origin-left"
          style={{ background: 'linear-gradient(90deg, #F5A623 0%, transparent 100%)' }}
        />

        {/* Main title */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: smoothEase }}
            className="text-2xl md:text-3xl lg:text-4xl font-extralight text-white leading-[1.3] tracking-tight"
          >
            {CTA.title}
            <br />
            <span style={{ color: '#F5A623' }}>{CTA.titleHighlight}</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <div className="overflow-hidden mb-8">
          <motion.p
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: smoothEase }}
            className="text-xs md:text-sm tracking-[0.15em] font-light leading-relaxed"
            style={{ color: 'rgba(245,213,168,0.7)' }}
          >
            {CTA.subtitle}
            <br />
            {CTA.subtitleHighlight}
          </motion.p>
        </div>

        {/* Events with staggered reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-10 space-y-3"
        >
          {CTA.events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.08, ease: smoothEase }}
              className="flex items-start gap-2"
            >
              <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#F5A623' }} />
              <div className="flex flex-col">
                <span className="text-white/90 font-light text-xs md:text-sm">{event.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {event.location && (
                    <>
                      <span className="text-white/50 text-[10px] md:text-xs">{event.location}</span>
                      <span style={{ color: 'rgba(245,166,35,0.4)' }} className="text-[10px]">•</span>
                    </>
                  )}
                  <span style={{ color: '#F5A623' }} className="font-medium text-[10px] md:text-xs">{event.dates}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tagline */}
        <div className="overflow-hidden mb-8">
          <motion.p
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: smoothEase }}
            className="text-base md:text-lg tracking-[0.15em] font-light leading-relaxed"
            style={{ color: 'rgba(245,213,168,0.7)' }}
          >
            {CTA.tagline}
            <br />
            <span style={{ color: '#F5A623' }}>{CTA.taglineHighlight}</span>
          </motion.p>
        </div>

        {/* CTA statement */}
        <div className="overflow-hidden mb-10">
          <motion.p
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease: smoothEase }}
            className="text-xl md:text-2xl font-semibold tracking-[0.1em]"
            style={{
              color: '#F5A623',
              textShadow: '0 0 40px rgba(245,166,35,0.3)',
            }}
          >
            {CTA.cta}
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: smoothEase }}
        >
          <motion.a
            href={CTA.button.url}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm md:text-base font-semibold tracking-[0.1em] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #F5A623 0%, #E8883A 100%)',
              color: '#050505',
              boxShadow: '0 4px 30px rgba(245,166,35,0.3)',
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 8px 40px rgba(245,166,35,0.5)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {CTA.button.text}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Share button */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mt-6"
          >
            <motion.button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm tracking-wider transition-all duration-300"
              style={{ color: 'rgba(245,213,168,0.5)' }}
              whileHover={{ color: 'rgba(245,213,168,0.8)', x: 4 }}
            >
              <span>Share experience</span>
              <span>↗</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-8 md:left-16 text-xs tracking-[0.2em]"
        style={{ color: 'rgba(245,166,35,0.3)' }}
      >
        © 2026 FLUX REAL
      </motion.div>
    </motion.div>
  );
}

// Sound toggle - minimal
function SoundToggle() {
  const soundEnabled = usePeakStore((s) => s.soundEnabled);
  const toggleSound = usePeakStore((s) => s.toggleSound);

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleSound();
      }}
      className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center z-50"
      aria-label={soundEnabled ? 'Mute' : 'Unmute'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M11 5L6 9H2v6h4l5 4V5z"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={soundEnabled ? 'rgba(245,166,35,0.3)' : 'none'}
        />
        {soundEnabled ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="rgba(245,166,35,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18.07 5.93a9 9 0 0 1 0 12.14" stroke="rgba(245,166,35,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <path d="M23 9l-6 6m0-6l6 6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </svg>
    </motion.button>
  );
}

// Main overlay container
export default function Overlay() {
  const currentStage = usePeakStore((s) => s.currentStage);
  const advance = usePeakStore((s) => s.advance);

  // Auto-advance from stage 4 to 5 after animation completes
  useEffect(() => {
    if (currentStage === 4) {
      const timer = setTimeout(() => {
        advance();
      }, TIMING.autoAdvanceDelay + 3000); // Wait for fireworks + delay
      return () => clearTimeout(timer);
    }
  }, [currentStage, advance]);

  return (
    <div className="absolute inset-0 z-10">
      <TouchSparkles />
      <ProgressIndicator />
      <SoundToggle />

      <AnimatePresence mode="wait">
        <StageLabel key={`label-${currentStage}`} />
      </AnimatePresence>

      <SwipeSlider onComplete={advance} />
      <CTAOverlay />
    </div>
  );
}
