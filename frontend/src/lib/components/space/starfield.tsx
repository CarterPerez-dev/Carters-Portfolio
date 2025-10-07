// ===========================
// Starfield Background
// ©AngelaMos | 2025
// ===========================

import { useEffect, useRef } from 'react';
import styles from './starfield.module.scss';

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
}

export const Starfield = (): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null || canvas === undefined) return;

    const ctx = canvas.getContext('2d');
    if (ctx === null || ctx === undefined) return;

    const setCanvasSize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const stars: Star[] = [];
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() < 0.8 ? 1 : 2,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }

    const drawStars = (): void => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness.toString()})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
    };

    let animationFrame: number;
    const animate = (): void => {
      drawStars();

      stars.forEach((star) => {
        if (Math.random() > 0.99) {
          star.brightness = Math.random() * 0.5 + 0.5;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = (): void => {
      setCanvasSize();
      stars.forEach((star) => {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrame !== 0 && animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.starfield}
    />
  );
};
