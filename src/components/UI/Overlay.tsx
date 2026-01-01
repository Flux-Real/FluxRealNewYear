'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePeakStore } from '@/store/peakStore';
import { CTA, STAGE_LABELS, TIMING } from '@/lib/constants';

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
      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="h-[2px] w-16 bg-gradient-to-r from-yellow-400 to-transparent mt-4 origin-left"
      />
    </motion.div>
  );
}

// Sparkle effect on touch
interface Sparkle {
  id: number;
  x: number;
  y: number;
}

function TouchSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const idRef = useRef(0);

  const createSparkle = useCallback((clientX: number, clientY: number) => {
    const newSparkles: Sparkle[] = [];
    // Create 6-8 sparkles per touch
    const count = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: idRef.current++,
        x: clientX + (Math.random() - 0.5) * 20,
        y: clientY + (Math.random() - 0.5) * 20,
      });
    }
    setSparkles(prev => [...prev, ...newSparkles]);

    // Remove sparkles after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 800);
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
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{ left: sparkle.x, top: sparkle.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              x: (Math.random() - 0.5) * 60,
              y: (Math.random() - 0.5) * 60 - 20,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
                fill="#F5A623"
                style={{ filter: 'drop-shadow(0 0 4px #F5A623)' }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Minimal swipe slider component
function SwipeSlider({ onComplete }: { onComplete: () => void }) {
  const currentStage = usePeakStore((s) => s.currentStage);
  const x = useMotionValue(0);
  const sliderWidth = 180;
  const thumbSize = 40;
  const maxDrag = sliderWidth - thumbSize;

  // Transforms
  const progressWidth = useTransform(x, [0, maxDrag], [thumbSize, sliderWidth]);

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
      {/* Label */}
      <motion.p
        className="text-[10px] tracking-[0.25em] mb-2 font-medium uppercase"
        style={{ color: 'rgba(255,255,255,0.5)' }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {currentStage === 0 ? 'Slide' : 'Continue'}
      </motion.p>

      {/* Minimal slider track */}
      <div
        className="relative rounded-full"
        style={{
          width: sliderWidth,
          height: thumbSize,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: progressWidth,
            background: 'rgba(245,166,35,0.15)',
          }}
        />

        {/* Subtle arrow hint */}
        <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
          <motion.span
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.2)' }}
            animate={{ x: [0, 3, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
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
          <motion.div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #F5A623 0%, #E8883A 100%)',
              boxShadow: '0 2px 12px rgba(245,166,35,0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm" style={{ color: '#050505' }}>→</span>
          </motion.div>
        </motion.div>
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

        {/* Main title with character stagger */}
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: smoothEase }}
            className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white leading-[1.2] tracking-tight"
          >
            Conversational AI Agents
            <br />
            <span className="font-light">&amp; The Future of</span>{' '}
            <span style={{ color: '#F5A623' }}>UX</span>
          </motion.h1>
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
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1, ease: smoothEase }}
              className="flex items-center gap-3 text-sm md:text-base"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F5A623' }} />
              <span className="text-white/80 font-light">{event.name}</span>
              <span style={{ color: 'rgba(245,166,35,0.3)' }}>—</span>
              <span className="text-white/50">{event.location}</span>
              <span style={{ color: 'rgba(245,166,35,0.3)' }}>—</span>
              <span style={{ color: '#F5A623' }} className="font-medium">{event.dates}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tagline */}
        <div className="overflow-hidden mb-8">
          <motion.p
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: smoothEase }}
            className="text-base md:text-lg tracking-[0.15em] font-light"
            style={{ color: 'rgba(245,213,168,0.7)' }}
          >
            {CTA.tagline}
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

// Sound toggle
function SoundToggle() {
  const soundEnabled = usePeakStore((s) => s.soundEnabled);
  const toggleSound = usePeakStore((s) => s.toggleSound);
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSound();
      }}
      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center
                 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
      aria-label={soundEnabled ? 'Mute' : 'Unmute'}
    >
      <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
    </button>
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
      <SoundToggle />

      <AnimatePresence mode="wait">
        <StageLabel key={`label-${currentStage}`} />
      </AnimatePresence>

      <SwipeSlider onComplete={advance} />
      <CTAOverlay />
    </div>
  );
}
