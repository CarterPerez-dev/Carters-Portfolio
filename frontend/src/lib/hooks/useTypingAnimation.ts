// ===========================
// Typing Animation Hook
// ©AngelaMos | 2025
// ===========================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUIStore } from '@/lib/store/ui.store';

interface UseTypingAnimationOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  skipOnRevisit?: boolean;
}

export const useTypingAnimation = ({
  text,
  speed = 60,
  delay = 0,
  onComplete,
  skipOnRevisit = true,
}: UseTypingAnimationOptions): {
  displayText: string;
  isTyping: boolean;
  skipAnimation: () => void;
} => {
  const { hasAnimationPlayed, markAnimationPlayed } = useUIStore();
  const animationId = `typing_${text.substring(0, 30).replace(/\s+/g, '_')}`;

  const alreadyPlayed = skipOnRevisit && hasAnimationPlayed(animationId);

  const [displayText, setDisplayText] = useState(alreadyPlayed ? text : '');
  const [isTyping, setIsTyping] = useState(!alreadyPlayed);
  const [shouldSkip, setShouldSkip] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const completedRef = useRef(alreadyPlayed);

  useEffect(() => {
    if (alreadyPlayed && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [alreadyPlayed, onComplete]);

  useEffect(() => {
    if (alreadyPlayed) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion || shouldSkip) {
      setDisplayText(text);
      setIsTyping(false);
      onComplete?.();
      if (skipOnRevisit) {
        markAnimationPlayed(animationId);
      }
      return;
    }

    setDisplayText('');
    setIsTyping(true);

    let currentIndex = 0;
    let lastUpdateTime = 0;

    const animate = (timestamp: number): void => {
      if (lastUpdateTime === 0) lastUpdateTime = timestamp;

      const elapsed = timestamp - lastUpdateTime;
      const currentChar = text[currentIndex - 1];
      const pauseTime = ['.', ',', '!', '?'].includes(currentChar)
        ? speed * 2
        : speed;

      if (elapsed >= pauseTime) {
        if (currentIndex < text.length && !shouldSkip) {
          currentIndex++;
          setDisplayText(text.substring(0, currentIndex));
          lastUpdateTime = timestamp;
        } else {
          setIsTyping(false);
          if (skipOnRevisit) {
            markAnimationPlayed(animationId);
          }
          onComplete?.();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    timeoutRef.current = window.setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    const timeoutId = timeoutRef.current;
    const animationFrameId = animationFrameRef.current;

    return () => {
      if (timeoutId !== null && timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      if (animationFrameId !== null && animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    text,
    speed,
    delay,
    onComplete,
    shouldSkip,
    skipOnRevisit,
    animationId,
    markAnimationPlayed,
    alreadyPlayed,
  ]);

  const skipAnimation = useCallback(() => {
    setShouldSkip(true);
    setDisplayText(text);
    setIsTyping(false);
    onComplete?.();
  }, [text, onComplete]);

  return {
    displayText,
    isTyping,
    skipAnimation,
  };
};
