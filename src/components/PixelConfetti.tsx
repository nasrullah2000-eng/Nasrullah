import React, { useEffect, useRef } from 'react';

interface PixelConfettiProps {
  active: boolean;
}

export const PixelConfetti: React.FC<PixelConfettiProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface ConfettiPiece {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotSpeed: number;
      shape: 'square' | 'heart' | 'petal' | 'star';
    }

    const colors = ['#f43f5e', '#ec4899', '#f472b6', '#a855f7', '#fbbf24', '#fde047', '#38bdf8', '#ffffff'];
    const shapes: ('square' | 'heart' | 'petal' | 'star')[] = ['square', 'heart', 'petal', 'star'];

    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3.5,
        size: 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'heart') {
          // Pixel heart shape
          ctx.fillRect(-4, -6, 4, 4);
          ctx.fillRect(0, -6, 4, 4);
          ctx.fillRect(-6, -2, 12, 4);
          ctx.fillRect(-4, 2, 8, 4);
          ctx.fillRect(-2, 6, 4, 2);
        } else if (p.shape === 'star') {
          ctx.fillRect(-p.size / 2, -1, p.size, 2);
          ctx.fillRect(-1, -p.size / 2, 2, p.size);
        } else {
          // Petal
          ctx.fillRect(-3, -5, 6, 10);
          ctx.fillRect(-5, -3, 10, 6);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-60 pointer-events-none w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
