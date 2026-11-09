/**
 * Pixel Art Procedural Canvas Renderer & Sprites
 * Pure canvas drawing routines for crisp 16-bit retro aesthetics.
 */

import { CharacterPreset, StoryItem } from '../config';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'petal' | 'sparkle' | 'confetti';
  rotation?: number;
  rotSpeed?: number;
}

export class SpriteRenderer {
  // Draw pixel rectangle helper
  public static drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
  }

  // Draw 4-point retro sparkle star
  public static drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
    ctx.save();
    ctx.fillStyle = color;
    const px = Math.floor(x);
    const py = Math.floor(y);
    const r = Math.floor(radius);

    // Center
    ctx.fillRect(px - 1, py - 1, 3, 3);
    // Vertical beam
    ctx.fillRect(px, py - r, 1, r * 2 + 1);
    // Horizontal beam
    ctx.fillRect(px - r, py, r * 2 + 1, 1);
    ctx.restore();
  }

  // Draw Sakura Blossom Petal
  public static drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.rotation !== undefined) {
      ctx.rotate(p.rotation);
    }
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    // Cute small pixel petal shape
    ctx.fillRect(-2, -3, 4, 6);
    ctx.fillRect(-3, -2, 6, 4);
    ctx.fillStyle = '#ffe4e6';
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  }

  // Draw Confetti Piece
  public static drawConfetti(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.rotation !== undefined) {
      ctx.rotate(p.rotation);
    }
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
    ctx.restore();
  }

  // Draw Cloud
  public static drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number = 1) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));
    ctx.scale(scale, scale);

    // Fluffy cloud layers (shadow and highlight)
    const baseColor = '#ffffff';
    const shadowColor = '#fbcfe8';

    // Cloud shadow/body
    ctx.fillStyle = shadowColor;
    ctx.fillRect(6, 14, 52, 14);
    ctx.fillRect(12, 8, 40, 20);
    ctx.fillRect(20, 2, 24, 26);

    // Cloud white highlights
    ctx.fillStyle = baseColor;
    ctx.fillRect(8, 12, 48, 12);
    ctx.fillRect(14, 6, 36, 18);
    ctx.fillRect(22, 0, 20, 24);

    ctx.restore();
  }

  // Draw Butterfly
  public static drawButterfly(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, color: string) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));
    const wingFlap = Math.sin(frame * 0.2) > 0 ? 0 : 2;

    // Wings
    ctx.fillStyle = color;
    ctx.fillRect(-4 + wingFlap, -4, 3, 4);
    ctx.fillRect(1 - wingFlap, -4, 3, 4);
    ctx.fillRect(-5 + wingFlap, -2, 4, 3);
    ctx.fillRect(1 - wingFlap, -2, 4, 3);

    // Body
    ctx.fillStyle = '#4a044e';
    ctx.fillRect(-1, -3, 2, 5);

    ctx.restore();
  }

  // Draw Big Sakura Tree
  public static drawSakuraTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, time: number) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(groundY));

    const sway = Math.sin(time * 0.002) * 2;

    // Tree Trunk
    ctx.fillStyle = '#5c2c16';
    ctx.fillRect(-18, -130, 36, 130);
    ctx.fillRect(-28, -25, 56, 25); // base roots

    // Trunk shading / bark texture
    ctx.fillStyle = '#3f1d0b';
    ctx.fillRect(-14, -120, 8, 110);
    ctx.fillRect(6, -110, 8, 100);

    // Branches
    ctx.fillStyle = '#5c2c16';
    ctx.fillRect(-55, -115 + sway * 0.3, 40, 14);
    ctx.fillRect(15, -120 - sway * 0.3, 45, 14);
    ctx.fillRect(-40, -145 + sway * 0.5, 30, 12);
    ctx.fillRect(10, -150 - sway * 0.5, 35, 12);

    // Sakura Canopy Puff Clusters
    const drawFoliageCluster = (cx: number, cy: number, r: number, shadeColor: string, lightColor: string) => {
      ctx.fillStyle = shadeColor;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Flower petals detail on edge
      ctx.fillStyle = '#fff1f2';
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5 + time * 0.001;
        const fx = cx + Math.cos(ang) * (r * 0.65);
        const fy = cy + Math.sin(ang) * (r * 0.65);
        ctx.fillRect(fx - 2, fy - 2, 4, 4);
      }
    };

    // Draw multiple overlapping blossom puff clusters
    drawFoliageCluster(-50 + sway, -140, 48, '#fb7185', '#fda4af');
    drawFoliageCluster(50 - sway, -145, 50, '#fb7185', '#fda4af');
    drawFoliageCluster(-20 + sway * 0.5, -180, 56, '#f43f5e', '#fecdd3');
    drawFoliageCluster(25 - sway * 0.5, -175, 54, '#f43f5e', '#fecdd3');
    drawFoliageCluster(0 + sway * 0.8, -210, 50, '#fda4af', '#fff1f2');

    // Fallen petals on ground
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-60, -4, 8, 4);
    ctx.fillRect(-40, -3, 6, 3);
    ctx.fillRect(30, -4, 8, 4);
    ctx.fillRect(50, -3, 6, 3);
    ctx.fillRect(80, -4, 7, 4);

    ctx.restore();
  }

  // Draw Fairy-Tale Pastel Castle
  public static drawCastle(ctx: CanvasRenderingContext2D, x: number, groundY: number, time: number) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(groundY));

    // Castle Base & Main Walls (Soft lavender-cream stone)
    ctx.fillStyle = '#f5e8ff';
    ctx.fillRect(-110, -220, 220, 220);

    // Wall stone details
    ctx.fillStyle = '#e9d5ff';
    for (let row = 0; row < 7; row++) {
      const yPos = -200 + row * 26;
      for (let col = 0; col < 6; col++) {
        const xPos = -95 + col * 34 + (row % 2 === 0 ? 0 : 16);
        ctx.fillRect(xPos, yPos, 22, 10);
      }
    }

    // Battlements / Crenellations on main wall
    ctx.fillStyle = '#e9d5ff';
    for (let c = -110; c <= 90; c += 25) {
      ctx.fillRect(c, -235, 16, 15);
    }

    // Left Tower
    ctx.fillStyle = '#fae8ff';
    ctx.fillRect(-160, -280, 60, 280);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(-165, -295, 70, 15);
    // Left Tower Cone Roof (Pink)
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(-130, -380);
    ctx.lineTo(-175, -295);
    ctx.lineTo(-85, -295);
    ctx.closePath();
    ctx.fill();
    // Left Tower Spire & Banner
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-132, -410, 4, 30);
    ctx.fillStyle = '#ec4899';
    const waveL = Math.sin(time * 0.005) * 4;
    ctx.beginPath();
    ctx.moveTo(-128, -408);
    ctx.lineTo(-105 + waveL, -398);
    ctx.lineTo(-128, -388);
    ctx.closePath();
    ctx.fill();

    // Right Tower
    ctx.fillStyle = '#fae8ff';
    ctx.fillRect(100, -280, 60, 280);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(95, -295, 70, 15);
    // Right Tower Cone Roof (Pink)
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(130, -380);
    ctx.lineTo(85, -295);
    ctx.lineTo(175, -295);
    ctx.closePath();
    ctx.fill();
    // Right Tower Spire & Banner
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(128, -410, 4, 30);
    ctx.fillStyle = '#ec4899';
    const waveR = Math.sin(time * 0.005 + 1) * 4;
    ctx.beginPath();
    ctx.moveTo(132, -408);
    ctx.lineTo(155 + waveR, -398);
    ctx.lineTo(132, -388);
    ctx.closePath();
    ctx.fill();

    // Center Grand Tower (Tallest)
    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(-50, -340, 100, 140);
    ctx.fillStyle = '#d8b4fe';
    ctx.fillRect(-55, -355, 110, 15);
    // Center Roof
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.moveTo(0, -460);
    ctx.lineTo(-65, -355);
    ctx.lineTo(65, -355);
    ctx.closePath();
    ctx.fill();
    // Center Golden Heart Spire
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3, -485, 6, 25);
    this.drawSparkle(ctx, 0, -490, 8, '#fef08a');

    // Windows with warm romantic glow
    const drawWindow = (wx: number, wy: number) => {
      ctx.fillStyle = '#4c1d95';
      ctx.fillRect(wx - 8, wy - 16, 16, 24);
      ctx.beginPath();
      ctx.arc(wx, wy - 16, 8, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = '#fef08a'; // glowing glass
      ctx.fillRect(wx - 6, wy - 14, 12, 20);
      ctx.beginPath();
      ctx.arc(wx, wy - 14, 6, Math.PI, 0);
      ctx.fill();

      // Window cross
      ctx.fillStyle = '#4c1d95';
      ctx.fillRect(wx - 1, wy - 18, 2, 26);
      ctx.fillRect(wx - 6, wy - 5, 12, 2);
    };

    drawWindow(-130, -240);
    drawWindow(130, -240);
    drawWindow(0, -280);

    // Castle Grand Arched Gate
    const gateGlow = 0.7 + Math.sin(time * 0.004) * 0.25;
    ctx.save();
    ctx.shadowColor = '#fbcfe8';
    ctx.shadowBlur = 20 * gateGlow;

    // Outer Gate Arch Border
    ctx.fillStyle = '#d8b4fe';
    ctx.fillRect(-45, -95, 90, 95);
    ctx.beginPath();
    ctx.arc(0, -95, 45, Math.PI, 0);
    ctx.fill();

    // Inner Glowing Light Portal
    ctx.fillStyle = `rgba(254, 240, 138, ${gateGlow})`;
    ctx.fillRect(-36, -92, 72, 92);
    ctx.beginPath();
    ctx.arc(0, -92, 36, Math.PI, 0);
    ctx.fill();
    ctx.restore();

    // Floating Sparkles around Castle Gate
    for (let i = 0; i < 4; i++) {
      const spAng = time * 0.002 + (i * Math.PI) / 2;
      const spX = Math.cos(spAng) * 45;
      const spY = -90 + Math.sin(spAng * 1.5) * 40;
      this.drawSparkle(ctx, spX, spY, 5, '#ffffff');
    }

    // Ribbon over Gate: "WELCOME ICI 🌸"
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(-70, -170, 140, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('KASTIL IMPIAN', 0, -155);

    ctx.restore();
  }

  // Draw Floating Platform
  public static drawPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number = 24) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    // Platform Wood Top
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(0, 0, width, 6);

    // Platform Wood Body
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 6, width, height - 6);

    // Wood Planks vertical lines
    ctx.fillStyle = '#78350f';
    for (let px = 20; px < width; px += 28) {
      ctx.fillRect(px, 0, 2, height);
    }

    // Grass / Moss on top
    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, 0, width, 3);
    for (let mx = 4; mx < width - 4; mx += 10) {
      ctx.fillRect(mx, 3, 4, 3);
    }

    // Cute ivy hanging
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(12, height, 4, 10);
    ctx.fillRect(10, height + 4, 8, 3);
    ctx.fillRect(width - 24, height, 4, 14);
    ctx.fillRect(width - 27, height + 6, 8, 4);

    ctx.restore();
  }

  // Draw Pixel Lamp Post
  public static drawLampPost(ctx: CanvasRenderingContext2D, x: number, groundY: number, time: number) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(groundY));

    // Post
    ctx.fillStyle = '#334155';
    ctx.fillRect(-3, -70, 6, 70);
    ctx.fillRect(-8, -6, 16, 6); // base
    ctx.fillRect(-6, -72, 12, 4);

    // Lantern Lantern frame
    ctx.fillRect(-10, -96, 20, 4);
    ctx.fillRect(-8, -76, 16, 4);
    ctx.fillRect(-10, -96, 3, 20);
    ctx.fillRect(7, -96, 3, 20);

    // Glowing warm bulb
    const glow = 0.8 + Math.sin(time * 0.005) * 0.2;
    ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
    ctx.fillRect(-7, -92, 14, 16);

    // Sparkle star
    this.drawSparkle(ctx, 0, -84, 4, '#ffffff');

    ctx.restore();
  }

  // Draw Flowers on Ground
  public static drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, type: number) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));

    // Stem
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-1, -8, 2, 8);
    ctx.fillRect(-3, -4, 2, 2);

    if (type === 0) {
      // Red/Pink Rose
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-4, -13, 8, 6);
      ctx.fillStyle = '#ffe4e6';
      ctx.fillRect(-2, -11, 4, 2);
    } else if (type === 1) {
      // Daisy (White with yellow center)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -14, 10, 6);
      ctx.fillRect(-3, -16, 6, 10);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-2, -12, 4, 4);
    } else if (type === 2) {
      // Purple Tulip
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-4, -14, 8, 7);
      ctx.fillStyle = '#fae8ff';
      ctx.fillRect(-2, -13, 4, 3);
    } else {
      // Golden Sunflower
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-5, -14, 10, 8);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, -11, 4, 4);
    }

    ctx.restore();
  }

  // Draw Wooden Fence
  public static drawFence(ctx: CanvasRenderingContext2D, x: number, groundY: number) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(groundY));

    ctx.fillStyle = '#d97706';
    // Horizontal rails
    ctx.fillRect(0, -22, 50, 4);
    ctx.fillRect(0, -10, 50, 4);

    // Vertical pickets with pointed tops
    for (let px = 4; px <= 44; px += 18) {
      ctx.fillRect(px, -28, 6, 28);
      ctx.fillRect(px + 1, -31, 4, 3);
      ctx.fillRect(px + 2, -33, 2, 2);
    }

    ctx.restore();
  }

  // Draw Story Item on Map (Envelope, Photo, Flower, Chest)
  public static drawStoryItem(
    ctx: CanvasRenderingContext2D,
    item: StoryItem,
    isCollected: boolean,
    time: number
  ) {
    ctx.save();
    const bob = Math.sin(time * 0.004 + item.id) * 6;
    const yPos = 370 + bob;

    ctx.translate(Math.floor(item.xPosition), Math.floor(yPos));

    // Floating aura circle
    ctx.fillStyle = isCollected ? 'rgba(167, 243, 208, 0.4)' : 'rgba(253, 224, 71, 0.45)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles around item
    if (!isCollected) {
      for (let s = 0; s < 3; s++) {
        const ang = time * 0.003 + (s * Math.PI * 2) / 3;
        const sx = Math.cos(ang) * 20;
        const sy = Math.sin(ang) * 20;
        this.drawSparkle(ctx, sx, sy, 4, '#ffffff');
      }
    }

    // Specific Item Drawing
    if (item.type === 'letter') {
      // Golden/White Envelope
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-14, -10, 28, 20);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-12, -8, 24, 16);
      // Envelope flap
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-14, -10);
      ctx.lineTo(0, 2);
      ctx.lineTo(14, -10);
      ctx.closePath();
      ctx.fill();
      // Heart seal
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-3, -1, 6, 5);
      ctx.fillRect(-2, -2, 4, 7);
    } else if (item.type === 'photo') {
      // Polaroid Frame
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-14, -16, 28, 32);
      // Photo window
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-11, -13, 22, 19);
      // Mountain/sun inside photo
      ctx.fillStyle = '#fde047';
      ctx.fillRect(4, -10, 4, 4);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(-9, -2, 18, 8);
    } else if (item.type === 'reasons') {
      // Crystal Magic Flower
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-12, -12, 24, 24);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(-8, -8, 16, 16);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -4, 8, 8);
    } else if (item.type === 'chest') {
      // Treasure Chest
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -6, 32, 20); // bottom
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-18, -16, 36, 12); // rounded lid
      // Gold bands
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-16, -16, 4, 30);
      ctx.fillRect(12, -16, 4, 30);
      // Keyhole
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-3, -2, 6, 6);
      ctx.fillStyle = '#000000';
      ctx.fillRect(-1, 0, 2, 3);
    }

    // Callout Bubble if not collected
    if (!isCollected) {
      const bubbleBob = Math.sin(time * 0.008) * 3;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-26, -42 + bubbleBob, 52, 18);
      // Border
      ctx.strokeStyle = '#4a044e';
      ctx.lineWidth = 2;
      ctx.strokeRect(-26, -42 + bubbleBob, 52, 18);

      // Arrow
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-4, -24 + bubbleBob);
      ctx.lineTo(4, -24 + bubbleBob);
      ctx.lineTo(0, -19 + bubbleBob);
      ctx.closePath();
      ctx.fill();

      // Text
      ctx.fillStyle = '#db2777';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BUKA 💌', 0, -30 + bubbleBob);
    } else {
      // Checkmark if collected
      ctx.fillStyle = '#10b981';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✓', 0, -25);
    }

    ctx.restore();
  }

  // Draw Cute Pixel Companion (White Bunny)
  public static drawBunny(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    facingRight: boolean,
    isHopping: boolean,
    time: number
  ) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    const earWiggle = Math.sin(time * 0.006) * 2;
    const hopY = isHopping ? -6 : 0;

    // Bunny Body (Fluffy white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -14 + hopY, 20, 14);

    // Head
    ctx.fillRect(-2, -22 + hopY, 14, 12);

    // Fluffy round cheeks & nose
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(8, -17 + hopY, 3, 3); // cute nose
    ctx.fillRect(4, -14 + hopY, 3, 2); // cheek blush

    // Eye
    ctx.fillStyle = '#374151';
    ctx.fillRect(6, -19 + hopY, 2, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7, -19 + hopY, 1, 1); // eye sparkle

    // Bunny Ears
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, -34 + earWiggle + hopY, 4, 14);
    ctx.fillRect(5, -32 - earWiggle + hopY, 4, 12);
    // Inside Ears (Pink)
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(1, -32 + earWiggle + hopY, 2, 10);
    ctx.fillRect(6, -30 - earWiggle + hopY, 2, 8);

    // Red Bowtie / Flower behind ear
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-3, -21 + hopY, 4, 4);

    // Fluffy tail
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(-13, -10 + hopY, 4, 5);

    // Paws
    ctx.fillStyle = '#e5e7eb';
    if (isHopping) {
      ctx.fillRect(-6, -2, 5, 4);
      ctx.fillRect(4, -2, 5, 4);
    } else {
      ctx.fillRect(-7, -2, 6, 2);
      ctx.fillRect(3, -2, 6, 2);
    }

    ctx.restore();
  }

  // Draw Player Character ("wanita kesayanganku")
  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    facingRight: boolean,
    isMoving: boolean,
    isGrounded: boolean,
    frame: number,
    preset: CharacterPreset,
    time: number
  ) {
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    // Animation calculations
    const walkCycle = Math.floor(frame / 6) % 4;
    const bob = isGrounded && isMoving ? (walkCycle % 2 === 0 ? -2 : 0) : Math.sin(time * 0.005) * 1;
    const legOffset = isMoving && isGrounded ? (walkCycle === 0 ? 3 : walkCycle === 2 ? -3 : 0) : 0;
    const jumpLegs = !isGrounded;

    // 1. Long Flowing Hair (Back layer)
    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-12, -48 + bob, 24, 32);
    ctx.fillRect(-14, -36 + bob, 28, 22);
    // Hair sway
    const hairSway = isMoving ? (facingRight ? -3 : 3) : Math.sin(time * 0.004) * 2;
    ctx.fillRect(-16 + hairSway, -24 + bob, 14, 16);

    // 2. Dress & Body
    // Dress base
    ctx.fillStyle = preset.dressColor;
    ctx.fillRect(-10, -28 + bob, 20, 24);
    ctx.fillRect(-13, -12 + bob, 26, 12); // wide flared skirt
    // Dress accent / frill
    ctx.fillStyle = preset.dressAccent;
    ctx.fillRect(-13, 0 + bob, 26, 3); // lace hem
    ctx.fillRect(-6, -28 + bob, 12, 6); // cute collar

    // 3. Legs & Shoes
    ctx.fillStyle = '#fce7f3'; // skin/tights
    if (jumpLegs) {
      ctx.fillRect(-6, 3 + bob, 4, 5);
      ctx.fillRect(2, 3 + bob, 4, 5);
      // Shoes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-7, 7 + bob, 6, 4);
      ctx.fillRect(1, 7 + bob, 6, 4);
    } else {
      ctx.fillRect(-6 - legOffset, 2 + bob, 4, 8);
      ctx.fillRect(2 + legOffset, 2 + bob, 4, 8);
      // Shoes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-7 - legOffset, 8 + bob, 6, 4);
      ctx.fillRect(1 + legOffset, 8 + bob, 6, 4);
    }

    // 4. Arms & Hands
    ctx.fillStyle = '#fed7aa'; // skin
    const armSwing = isMoving ? (walkCycle === 0 ? 3 : walkCycle === 2 ? -3 : 0) : 0;
    ctx.fillRect(-12, -26 + bob + armSwing, 4, 12);
    ctx.fillRect(8, -26 + bob - armSwing, 4, 12);

    // 5. Head & Face
    ctx.fillStyle = '#fed7aa'; // face skin
    ctx.fillRect(-9, -46 + bob, 18, 18);

    // Rosy Blush Cheeks
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(-7, -35 + bob, 4, 2);
    ctx.fillRect(3, -35 + bob, 4, 2);

    // Beautiful Smiling Eyes
    ctx.fillStyle = '#374151';
    ctx.fillRect(-5, -40 + bob, 3, 4);
    ctx.fillRect(2, -40 + bob, 3, 4);
    // Eye sparkle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -40 + bob, 1, 2);
    ctx.fillRect(3, -40 + bob, 1, 2);

    // Sweet Smile
    ctx.fillStyle = '#db2777';
    ctx.fillRect(-2, -33 + bob, 4, 2);

    // 6. Hair Front / Bangs
    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-10, -50 + bob, 20, 7);
    ctx.fillRect(-10, -45 + bob, 5, 8);
    ctx.fillRect(5, -45 + bob, 5, 8);

    // 7. Flower Crown
    ctx.fillStyle = preset.flowerCrownColor;
    ctx.fillRect(-8, -52 + bob, 4, 4);
    ctx.fillRect(-2, -53 + bob, 4, 4);
    ctx.fillRect(4, -52 + bob, 4, 4);
    // Leaves in crown
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(-5, -51 + bob, 3, 2);
    ctx.fillRect(2, -51 + bob, 3, 2);

    ctx.restore();
  }
}
