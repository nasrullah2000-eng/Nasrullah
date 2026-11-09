import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GAME_CONFIG, CharacterPreset, StoryItem } from '../config';
import { SpriteRenderer, Particle } from './sprites';
import { sound } from '../audio/chiptune';

interface GameCanvasProps {
  characterPreset: CharacterPreset;
  collectedItemIds: number[];
  onOpenItem: (item: StoryItem) => void;
  onReachCastle: () => void;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  characterPreset,
  collectedItemIds,
  onOpenItem,
  onReachCastle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound mute state
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Input states
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean; interact: boolean }>({
    left: false,
    right: false,
    jump: false,
    interact: false,
  });

  const tapTargetXRef = useRef<number | null>(null);

  // Player physics state
  const playerRef = useRef({
    x: 80,
    y: 380,
    vx: 0,
    vy: 0,
    w: 24,
    h: 44,
    facingRight: true,
    isGrounded: true,
    lastSafeX: 80,
    lastSafeY: 380,
    frame: 0,
  });

  // Bunny companion state
  const bunnyRef = useRef({
    x: 40,
    y: 380,
    facingRight: true,
    isHopping: false,
    hopTimer: 0,
  });

  // World configuration
  const WORLD_WIDTH = 3400;
  const GROUND_Y = 400;

  // Floating platforms
  const platforms: Platform[] = [
    { x: 1080, y: 320, w: 140, h: 22 },
    { x: 1280, y: 250, w: 130, h: 22 },
    { x: 1440, y: 260, w: 160, h: 22 }, // Item 3 here
    { x: 1680, y: 320, w: 130, h: 22 },
    { x: 1940, y: 270, w: 160, h: 22 }, // Item 4 here
    { x: 2160, y: 330, w: 130, h: 22 },
  ];

  // Pits in ground to make floating platforms fun
  const pits = [
    { startX: 1100, endX: 1800 },
    { startX: 1960, endX: 2250 },
  ];

  // Particles system
  const particlesRef = useRef<Particle[]>([]);

  // Camera X
  const cameraXRef = useRef<number>(0);

  // Helper: check if near any item
  const getNearbyItem = useCallback((px: number) => {
    return GAME_CONFIG.storyItems.find(item => Math.abs(item.xPosition - px) < 46);
  }, []);

  // Initialize petals and sparkles
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * GROUND_Y,
        vx: 0.4 + Math.random() * 0.8,
        vy: 0.3 + Math.random() * 0.6,
        size: 3 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#fbcfe8' : '#fda4af',
        alpha: 0.6 + Math.random() * 0.4,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 200,
        type: 'petal',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Start audio on first user key interaction
      sound.startBGM();

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
        tapTargetXRef.current = null;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
        tapTargetXRef.current = null;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        keysRef.current.jump = true;
      }
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        keysRef.current.interact = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') keysRef.current.jump = false;
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') keysRef.current.interact = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch on Canvas to walk to location
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    sound.startBGM();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickRatioX = (clientX - rect.left) / rect.width;
    const clickedWorldX = cameraXRef.current + clickRatioX * canvas.width;

    // Check if clicked directly on an item
    const clickedItem = GAME_CONFIG.storyItems.find(
      item => Math.abs(item.xPosition - clickedWorldX) < 50
    );
    if (clickedItem) {
      if (Math.abs(playerRef.current.x - clickedItem.xPosition) < 70) {
        onOpenItem(clickedItem);
        return;
      }
    }

    // Otherwise walk towards clicked target
    tapTargetXRef.current = Math.max(50, Math.min(WORLD_WIDTH - 80, clickedWorldX));
  };

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(loop);
        return;
      }

      // Responsive canvas resolution matching screen aspect ratio
      const desiredHeight = 480;
      const desiredWidth = Math.min(960, Math.max(360, Math.floor(window.innerWidth * (desiredHeight / window.innerHeight))));
      if (canvas.width !== desiredWidth || canvas.height !== desiredHeight) {
        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
      }

      const p = playerRef.current;
      const keys = keysRef.current;

      // 1. Process Horizontal Movement
      const moveSpeed = 190; // pixels per sec
      let isMoving = false;

      // Tap-to-move logic
      if (tapTargetXRef.current !== null) {
        const diff = tapTargetXRef.current - p.x;
        if (Math.abs(diff) > 8) {
          p.vx = (diff > 0 ? 1 : -1) * moveSpeed;
          p.facingRight = diff > 0;
          isMoving = true;
        } else {
          p.vx = 0;
          tapTargetXRef.current = null;
        }
      } else {
        if (keys.left && !keys.right) {
          p.vx = -moveSpeed;
          p.facingRight = false;
          isMoving = true;
        } else if (keys.right && !keys.left) {
          p.vx = moveSpeed;
          p.facingRight = true;
          isMoving = true;
        } else {
          p.vx = 0;
        }
      }

      // 2. Process Jumping
      const gravity = 850;
      const jumpStrength = -390;

      if (keys.jump && p.isGrounded) {
        p.vy = jumpStrength;
        p.isGrounded = false;
        sound.playJump();
        // Jump dust sparkles
        for (let j = 0; j < 5; j++) {
          particlesRef.current.push({
            x: p.x + (Math.random() - 0.5) * 16,
            y: p.y,
            vx: (Math.random() - 0.5) * 40,
            vy: -20 - Math.random() * 30,
            size: 2,
            color: '#fbcfe8',
            alpha: 1,
            life: 0,
            maxLife: 30,
            type: 'sparkle',
          });
        }
      }

      // Apply Gravity
      p.vy += gravity * dt;

      // Apply Velocity
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Bounds
      p.x = Math.max(30, Math.min(WORLD_WIDTH - 60, p.x));

      // 3. Platform & Ground Collisions
      p.isGrounded = false;

      // Check floating platforms (one-way top landing)
      for (const plat of platforms) {
        if (
          p.x + 8 >= plat.x &&
          p.x - 8 <= plat.x + plat.w &&
          p.y >= plat.y &&
          p.y - p.vy * dt <= plat.y + 12
        ) {
          p.y = plat.y;
          p.vy = 0;
          p.isGrounded = true;
          p.lastSafeX = p.x;
          p.lastSafeY = p.y;
          break;
        }
      }

      // Check Ground if not landed on platform
      if (!p.isGrounded) {
        // Is player over a pit?
        const isOverPit = pits.some(pit => p.x >= pit.startX && p.x <= pit.endX);

        if (!isOverPit) {
          if (p.y >= GROUND_Y) {
            p.y = GROUND_Y;
            p.vy = 0;
            p.isGrounded = true;
            p.lastSafeX = p.x;
            p.lastSafeY = GROUND_Y;
          }
        } else {
          // If falling into pit below bottom, safe bounce back!
          if (p.y > desiredHeight + 60) {
            // Gentle fairy sparkle float back
            p.x = p.lastSafeX;
            p.y = p.lastSafeY;
            p.vx = 0;
            p.vy = -180;
            // Spawn recovery sparkles
            for (let s = 0; s < 12; s++) {
              particlesRef.current.push({
                x: p.x,
                y: p.y - 20,
                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 80,
                size: 3,
                color: '#fef08a',
                alpha: 1,
                life: 0,
                maxLife: 40,
                type: 'sparkle',
              });
            }
          }
        }
      }

      // Animation frame
      if (isMoving) {
        p.frame++;
      } else {
        p.frame = 0;
      }

      // 4. Update Bunny Companion
      const b = bunnyRef.current;
      const targetBunnyX = p.x - (p.facingRight ? 36 : -36);
      const bunnyDiff = targetBunnyX - b.x;

      if (Math.abs(bunnyDiff) > 8) {
        b.x += (bunnyDiff > 0 ? 1 : -1) * (moveSpeed * 0.95) * dt;
        b.facingRight = bunnyDiff > 0;
        b.hopTimer += dt * 10;
        b.isHopping = Math.sin(b.hopTimer) > 0.2;
      } else {
        b.isHopping = false;
      }
      b.y = p.y; // sits on same surface

      // 5. Update Camera
      const targetCamX = p.x - canvas.width * 0.4;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.1;
      cameraXRef.current = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, cameraXRef.current));
      const camX = cameraXRef.current;

      // 6. Check Item Proximity & Castle Arrival
      if (keys.interact) {
        const item = getNearbyItem(p.x);
        if (item) {
          onOpenItem(item);
          keys.interact = false;
        }
      }

      // Check Castle Door Arrival (X >= 3050)
      if (p.x >= 3040) {
        onReachCastle();
      }

      // 7. Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
        if (pt.rotation !== undefined && pt.rotSpeed !== undefined) {
          pt.rotation += pt.rotSpeed;
        }

        // Loop petals
        if (pt.type === 'petal') {
          if (pt.y > GROUND_Y + 40 || pt.x > WORLD_WIDTH) {
            pt.x = camX - 40 + Math.random() * (canvas.width + 100);
            pt.y = -20;
          }
        } else {
          // Sparkles fade out
          pt.alpha = Math.max(0, 1 - pt.life / pt.maxLife);
          if (pt.life >= pt.maxLife) {
            particlesRef.current.splice(i, 1);
          }
        }
      }

      // ==========================================
      // RENDER PASS
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // A. Pastel Sunset Sky Gradient (Bright, cheerful, pastel)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, desiredHeight);
      skyGrad.addColorStop(0, '#bae6fd');   // light sky blue
      skyGrad.addColorStop(0.35, '#fbcfe8'); // soft pink
      skyGrad.addColorStop(0.7, '#fed7aa');  // warm peach
      skyGrad.addColorStop(1, '#fef08a');    // pastel golden yellow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // B. Warm Golden Sun with soft pixel aura
      const sunScreenX = 400 - camX * 0.05;
      const sunScreenY = 130;
      // Soft outer sun glow
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.beginPath();
      ctx.arc(sunScreenX, sunScreenY, 52, 0, Math.PI * 2);
      ctx.fill();
      // Sun body
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(sunScreenX, sunScreenY, 36, 0, Math.PI * 2);
      ctx.fill();

      // C. Parallax Layer 1: Distant Pastel Clouds
      const cloudSpeed = currentTime * 0.008;
      for (let c = 0; c < 8; c++) {
        const cx = (c * 420 - camX * 0.15 + cloudSpeed) % (WORLD_WIDTH * 0.5);
        const cy = 40 + (c % 3) * 35;
        SpriteRenderer.drawPixelCloud(ctx, cx, cy, 1.2);
      }

      // D. Parallax Layer 2: Sparkling Turquoise Sea Horizon
      const seaY = 280;
      const seaGrad = ctx.createLinearGradient(0, seaY, 0, GROUND_Y);
      seaGrad.addColorStop(0, '#7dd3fc');
      seaGrad.addColorStop(1, '#a5b4fc');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, seaY, canvas.width, GROUND_Y - seaY);

      // Sea sparkle ripples
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let s = 0; s < 18; s++) {
        const rippleX = ((s * 73 - camX * 0.18 + currentTime * 0.02) % canvas.width + canvas.width) % canvas.width;
        const rippleY = seaY + 12 + (s % 6) * 16;
        ctx.fillRect(rippleX, rippleY, 12, 2);
      }

      // E. Parallax Layer 3: Rolling Pastel Hills
      ctx.fillStyle = '#ddd6fe'; // lilac distant hill
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      for (let x = 0; x <= canvas.width; x += 40) {
        const hillX = x + camX * 0.25;
        const hillY = 320 + Math.sin(hillX * 0.003) * 35;
        ctx.lineTo(x, hillY);
      }
      ctx.lineTo(canvas.width, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#bbf7d0'; // soft sage green middle hill
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      for (let x = 0; x <= canvas.width; x += 40) {
        const hillX = x + camX * 0.45;
        const hillY = 350 + Math.sin(hillX * 0.004 + 2) * 25;
        ctx.lineTo(x, hillY);
      }
      ctx.lineTo(canvas.width, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      // ==========================================
      // MAIN WORLD LAYER (CamX applied)
      // ==========================================
      ctx.save();
      ctx.translate(-Math.floor(camX), 0);

      // 1. Draw Ground (with pits for platforming)
      const drawGroundSegment = (startX: number, endX: number) => {
        // Lush green grass top
        ctx.fillStyle = '#86efac';
        ctx.fillRect(startX, GROUND_Y, endX - startX, 8);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(startX, GROUND_Y + 8, endX - startX, 14);

        // Rich dirt/earth layer
        ctx.fillStyle = '#b45309';
        ctx.fillRect(startX, GROUND_Y + 22, endX - startX, desiredHeight - GROUND_Y - 22);

        // Dark bedrock
        ctx.fillStyle = '#78350f';
        ctx.fillRect(startX, GROUND_Y + 50, endX - startX, desiredHeight - GROUND_Y - 50);

        // Grass blades
        ctx.fillStyle = '#22c55e';
        for (let gx = startX + 6; gx < endX - 6; gx += 16) {
          ctx.fillRect(gx, GROUND_Y - 4, 3, 4);
          ctx.fillRect(gx + 2, GROUND_Y - 6, 2, 6);
        }
      };

      // Ground segments between pits
      drawGroundSegment(0, 1100);
      drawGroundSegment(1800, 1960);
      drawGroundSegment(2250, WORLD_WIDTH);

      // 2. Draw Decorative Elements (Fences, Flowers, Lamps)
      // Flowers on ground
      for (let fx = 40; fx < WORLD_WIDTH - 200; fx += 55) {
        const isOverPit = pits.some(pit => fx >= pit.startX && fx <= pit.endX);
        if (!isOverPit) {
          const flowerType = Math.floor(fx / 55) % 4;
          SpriteRenderer.drawFlower(ctx, fx, GROUND_Y, flowerType);
        }
      }

      // Wooden fences
      SpriteRenderer.drawFence(ctx, 320, GROUND_Y);
      SpriteRenderer.drawFence(ctx, 370, GROUND_Y);
      SpriteRenderer.drawFence(ctx, 800, GROUND_Y);
      SpriteRenderer.drawFence(ctx, 2450, GROUND_Y);
      SpriteRenderer.drawFence(ctx, 2500, GROUND_Y);

      // Lamp posts
      SpriteRenderer.drawLampPost(ctx, 280, GROUND_Y, currentTime);
      SpriteRenderer.drawLampPost(ctx, 680, GROUND_Y, currentTime);
      SpriteRenderer.drawLampPost(ctx, 1440, 260, currentTime);
      SpriteRenderer.drawLampPost(ctx, 2400, GROUND_Y, currentTime);
      SpriteRenderer.drawLampPost(ctx, 2880, GROUND_Y, currentTime);

      // 3. Draw The Great Sakura Tree at the start
      SpriteRenderer.drawSakuraTree(ctx, 130, GROUND_Y, currentTime);

      // Introductory Speech Bubble under Sakura Tree
      if (p.x < 360) {
        const bubbleY = GROUND_Y - 145 + Math.sin(currentTime * 0.005) * 3;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(180, bubbleY, 190, 48);
        ctx.strokeStyle = '#4a044e';
        ctx.lineWidth = 2;
        ctx.strokeRect(180, bubbleY, 190, 48);

        // Arrow pointer
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(172, bubbleY + 20);
        ctx.lineTo(180, bubbleY + 14);
        ctx.lineTo(180, bubbleY + 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#db2777';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText('HELLO ICI! 🌸', 190, bubbleY + 16);
        ctx.fillStyle = '#374151';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText('Ada game lucu buat', 190, bubbleY + 28);
        ctx.fillText('wanita kesayanganku →', 190, bubbleY + 38);

        // Blinking yellow guide arrow pointing right
        const arrowBlink = Math.sin(currentTime * 0.008) * 8;
        ctx.fillStyle = '#facc15';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillText('→', 390 + arrowBlink, bubbleY + 30);
      }

      // 4. Draw Floating Platforms
      for (const plat of platforms) {
        SpriteRenderer.drawPlatform(ctx, plat.x, plat.y, plat.w, plat.h);
      }

      // 5. Draw Story Items on Map
      for (const item of GAME_CONFIG.storyItems) {
        const isCollected = collectedItemIds.includes(item.id);
        SpriteRenderer.drawStoryItem(ctx, item, isCollected, currentTime);
      }

      // 6. Draw Fairy-Tale Pastel Castle at the end
      SpriteRenderer.drawCastle(ctx, 3140, GROUND_Y, currentTime);

      // 7. Draw Petals and Particles in world
      for (const pt of particlesRef.current) {
        if (pt.type === 'petal') {
          SpriteRenderer.drawPetal(ctx, pt);
        } else if (pt.type === 'sparkle') {
          SpriteRenderer.drawSparkle(ctx, pt.x, pt.y, pt.size, pt.color);
        }
      }

      // 8. Draw Cute Companion (White Bunny)
      SpriteRenderer.drawBunny(
        ctx,
        b.x,
        b.y,
        b.facingRight,
        b.isHopping,
        currentTime
      );

      // 9. Draw Player Character ("wanita kesayanganku")
      SpriteRenderer.drawPlayer(
        ctx,
        p.x,
        p.y,
        p.facingRight,
        isMoving,
        p.isGrounded,
        p.frame,
        characterPreset,
        currentTime
      );

      ctx.restore();

      // ==========================================
      // FOREGROUND HUD & CONTROLS (Screen space)
      // ==========================================
      // Item Progress Counter (Top Left)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(12, 12, 175, 34);
      ctx.strokeStyle = '#4a044e';
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, 175, 34);

      ctx.fillStyle = '#db2777';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText(
        `🌸 ITEM: ${collectedItemIds.length}/${GAME_CONFIG.storyItems.length}`,
        20,
        28
      );
      ctx.fillStyle = '#6b7280';
      ctx.font = '7px "Press Start 2P", monospace';
      const distanceToCastle = Math.max(0, Math.floor((3040 - p.x) / 30));
      ctx.fillText(`Kastil: ${distanceToCastle}m lagi`, 20, 39);

      // Interaction prompt if near an item
      const nearItem = getNearbyItem(p.x);
      if (nearItem) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(canvas.width / 2 - 110, 16, 220, 32);
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 2 - 110, 16, 220, 32);

        ctx.fillStyle = '#9d174d';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✨ KETUK / TEKAN [E] / BUKA ✨', canvas.width / 2, 35);
        ctx.textAlign = 'start';
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [characterPreset, collectedItemIds, getNearbyItem, onOpenItem, onReachCastle]);

  // Mobile On-Screen Touch Controls Handlers
  const handleTouchControl = (action: 'left' | 'right' | 'jump' | 'interact', isDown: boolean) => {
    sound.startBGM();
    tapTargetXRef.current = null;
    if (action === 'left') keysRef.current.left = isDown;
    if (action === 'right') keysRef.current.right = isDown;
    if (action === 'jump') keysRef.current.jump = isDown;
    if (action === 'interact') {
      keysRef.current.interact = isDown;
      if (isDown) {
        const item = getNearbyItem(playerRef.current.x);
        if (item) {
          onOpenItem(item);
        }
      }
    }
  };

  const toggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden touch-none">
      {/* Sound Toggle & Now Playing Badge Top Right */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2 pointer-events-auto">
        <div className="hidden sm:flex items-center gap-1.5 bg-white/90 px-2.5 py-1.5 rounded-lg border-2 border-pink-300 text-[11px] font-dialog font-bold text-purple-950 shadow-xs">
          <span className="text-pink-500 animate-pulse">🎵</span>
          <span>{GAME_CONFIG.music.title} - {GAME_CONFIG.music.artist}</span>
        </div>
        <button
          onClick={toggleSound}
          className="pixel-button bg-white/90 px-3 py-2 text-xs font-pixel text-purple-900 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-white active:scale-95"
          title="Bisukan / Nyalakan Musik"
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
          <span className="hidden md:inline">{isMuted ? 'Bisu' : 'Musik'}</span>
        </button>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-pointer max-w-[1200px]"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* On-Screen Mobile Controller Bar (Always visible & responsive for touch) */}
      <div className="absolute bottom-2 left-0 right-0 z-20 px-4 py-2 flex items-center justify-between max-w-lg mx-auto pointer-events-none">
        {/* D-Pad Left & Right */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onPointerDown={() => handleTouchControl('left', true)}
            onPointerUp={() => handleTouchControl('left', false)}
            onPointerLeave={() => handleTouchControl('left', false)}
            className="pixel-button w-14 h-14 bg-pink-100 active:bg-pink-300 text-purple-950 font-pixel text-lg rounded-xl flex items-center justify-center cursor-pointer shadow-lg active:scale-90"
            aria-label="Jalan Kiri"
          >
            ◀
          </button>
          <button
            onPointerDown={() => handleTouchControl('right', true)}
            onPointerUp={() => handleTouchControl('right', false)}
            onPointerLeave={() => handleTouchControl('right', false)}
            className="pixel-button w-14 h-14 bg-pink-100 active:bg-pink-300 text-purple-950 font-pixel text-lg rounded-xl flex items-center justify-center cursor-pointer shadow-lg active:scale-90"
            aria-label="Jalan Kanan"
          >
            ▶
          </button>
        </div>

        {/* Action & Jump Buttons */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onPointerDown={() => handleTouchControl('interact', true)}
            onPointerUp={() => handleTouchControl('interact', false)}
            className="pixel-button w-14 h-14 bg-amber-100 active:bg-amber-300 text-purple-950 font-pixel text-xs rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-lg active:scale-90"
            aria-label="Buka Item"
          >
            <span className="text-base">💌</span>
            <span className="text-[8px] font-pixel">BUKA</span>
          </button>

          <button
            onPointerDown={() => handleTouchControl('jump', true)}
            onPointerUp={() => handleTouchControl('jump', false)}
            className="pixel-button w-16 h-16 bg-gradient-to-t from-pink-500 to-rose-400 text-white font-pixel text-sm rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-xl active:scale-90"
            aria-label="Lompat"
          >
            <span className="text-lg">⬆️</span>
            <span className="text-[9px] font-pixel">LOMPAT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
