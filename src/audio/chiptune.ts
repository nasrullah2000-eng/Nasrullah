/**
 * Web Audio API Chiptune Synthesizer
 * Feature: "I See the Light" - Mandy Moore (Tangled)
 * Procedural 16-bit retro arrangement + HTML5 audio fallback support.
 */

import { GAME_CONFIG } from '../config';

interface NoteItem {
  note: number; // frequency in Hz (0 for rest)
  dur: number;  // duration in 16th steps (1 = ~175ms)
  bass?: number;
  harmony?: number;
}

// Frequency constants
const C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, B3 = 246.94;
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private audioEl: HTMLAudioElement | null = null;
  private playbackTimeout: number | null = null;
  private currentNoteIndex: number = 0;

  // "I See the Light" - Mandy Moore
  // Melodic transcription of Verse and iconic Chorus
  private seeTheLightSong: NoteItem[] = [
    // --- INTRO / VERSE 1: "All those days watching from the windows..." ---
    { note: C4, dur: 2, bass: C3, harmony: G3 },
    { note: E4, dur: 2, bass: C3, harmony: G3 },
    { note: G4, dur: 4, bass: C3, harmony: E4 },
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: F4, dur: 2, bass: F3, harmony: C4 },
    { note: E4, dur: 2, bass: F3, harmony: C4 },
    { note: D4, dur: 2, bass: G3, harmony: B3 },
    { note: C4, dur: 4, bass: C3, harmony: G3 },

    // "All those years outside looking in..."
    { note: C4, dur: 2, bass: C3, harmony: G3 },
    { note: E4, dur: 2, bass: C3, harmony: G3 },
    { note: G4, dur: 4, bass: C3, harmony: E4 },
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: F4, dur: 2, bass: F3, harmony: C4 },
    { note: E4, dur: 2, bass: F3, harmony: C4 },
    { note: D4, dur: 2, bass: G3, harmony: B3 },
    { note: C4, dur: 4, bass: C3, harmony: G3 },

    // "All that time never even knowing..."
    { note: C4, dur: 2, bass: A3, harmony: E4 },
    { note: E4, dur: 2, bass: A3, harmony: C4 },
    { note: G4, dur: 2, bass: A3, harmony: C4 },
    { note: A4, dur: 2, bass: A3, harmony: E4 },
    { note: G4, dur: 2, bass: G3, harmony: D4 },
    { note: F4, dur: 2, bass: F3, harmony: C4 },
    { note: E4, dur: 2, bass: C3, harmony: G3 },
    { note: D4, dur: 4, bass: G3, harmony: B3 },

    // "Just how blind I've been..."
    { note: D4, dur: 2, bass: G3, harmony: B3 },
    { note: E4, dur: 2, bass: G3, harmony: C4 },
    { note: F4, dur: 4, bass: F3, harmony: D4 },
    { note: E4, dur: 2, bass: C3, harmony: G3 },
    { note: D4, dur: 2, bass: G3, harmony: B3 },
    { note: C4, dur: 6, bass: C3, harmony: G3 },
    { note: 0,  dur: 2, bass: C3 },

    // --- THE ICONIC CHORUS: "And at last I see the light..." ---
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: A4, dur: 2, bass: C3, harmony: E4 },
    { note: C5, dur: 6, bass: C3, harmony: G4 },
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: F4, dur: 2, bass: F3, harmony: C4 },
    { note: E4, dur: 4, bass: F3, harmony: C4 },

    // "And it's like the fog has lifted..."
    { note: C4, dur: 2, bass: F3, harmony: A3 },
    { note: D4, dur: 2, bass: F3, harmony: A3 },
    { note: E4, dur: 4, bass: C3, harmony: G3 },
    { note: F4, dur: 2, bass: G3, harmony: B3 },
    { note: E4, dur: 2, bass: G3, harmony: C4 },
    { note: D4, dur: 4, bass: G3, harmony: B3 },

    // "And at last I see the light..."
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: A4, dur: 2, bass: C3, harmony: E4 },
    { note: C5, dur: 6, bass: C3, harmony: G4 },
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: F4, dur: 2, bass: F3, harmony: C4 },
    { note: E4, dur: 4, bass: F3, harmony: C4 },

    // "And it's like the sky is new..."
    { note: C4, dur: 2, bass: F3, harmony: A3 },
    { note: D4, dur: 2, bass: F3, harmony: A3 },
    { note: E4, dur: 2, bass: C3, harmony: G3 },
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: F4, dur: 2, bass: G3, harmony: D4 },
    { note: D4, dur: 2, bass: G3, harmony: B3 },
    { note: C4, dur: 6, bass: C3, harmony: G3 },
    { note: 0,  dur: 2, bass: C3 },

    // "And it's warm and real and bright..."
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: A4, dur: 2, bass: C3, harmony: E4 },
    { note: C5, dur: 2, bass: C3, harmony: G4 },
    { note: D5, dur: 2, bass: C3, harmony: G4 },
    { note: E5, dur: 4, bass: E3, harmony: G4 },
    { note: D5, dur: 2, bass: E3, harmony: G4 },
    { note: C5, dur: 4, bass: A3, harmony: E4 },

    // "And the world has somehow shifted..."
    { note: A4, dur: 2, bass: A3, harmony: E4 },
    { note: B4, dur: 2, bass: A3, harmony: E4 },
    { note: C5, dur: 2, bass: F3, harmony: A4 },
    { note: D5, dur: 2, bass: F3, harmony: A4 },
    { note: C5, dur: 4, bass: F3, harmony: A4 },
    { note: B4, dur: 2, bass: G3, harmony: D4 },
    { note: A4, dur: 4, bass: G3, harmony: D4 },

    // "All at once everything is different..."
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: A4, dur: 2, bass: C3, harmony: E4 },
    { note: C5, dur: 2, bass: C3, harmony: G4 },
    { note: D5, dur: 2, bass: C3, harmony: G4 },
    { note: E5, dur: 4, bass: E3, harmony: G4 },
    { note: F5, dur: 2, bass: F3, harmony: A4 },
    { note: E5, dur: 4, bass: F3, harmony: G4 },

    // "Now that I see you..."
    { note: C5, dur: 3, bass: G3, harmony: E4 },
    { note: D5, dur: 3, bass: G3, harmony: F4 },
    { note: C5, dur: 8, bass: C3, harmony: G4 },

    // Romantic lantern arpeggio outro before loop
    { note: G4, dur: 2, bass: C3, harmony: E4 },
    { note: C5, dur: 2, bass: C3, harmony: G4 },
    { note: E5, dur: 4, bass: C3, harmony: C5 },
    { note: 0,  dur: 4, bass: C3 },
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
  }

  // Play gentle synth tone
  private playTone(freq: number, type: OscillatorType, duration: number, gainValue: number) {
    if (this.isMuted || freq <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Soft warm lowpass filter (gives that magical Disney Tangled chime feeling)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, this.ctx.currentTime);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Attack & decay
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainValue, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext safe catch
    }
  }

  // Play next note in "I See the Light"
  private playNextSongNote = () => {
    if (this.isMuted || !this.isMusicPlaying) return;

    const item = this.seeTheLightSong[this.currentNoteIndex];
    const stepDurationMs = 185; // 1 step = ~185ms
    const noteDurationSec = (item.dur * stepDurationMs) / 1000;

    // Melody: sweet gentle triangle/sine wave
    if (item.note > 0) {
      this.playTone(item.note, 'triangle', noteDurationSec * 0.95, 0.05);
    }

    // Harmony / Arpeggio chime
    if (item.harmony && item.harmony > 0) {
      this.playTone(item.harmony, 'sine', noteDurationSec * 0.8, 0.025);
    }

    // Bass note: warm sine warmth
    if (item.bass && item.bass > 0) {
      this.playTone(item.bass, 'sine', noteDurationSec * 1.1, 0.035);
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.seeTheLightSong.length;

    // Schedule next note
    this.playbackTimeout = window.setTimeout(
      this.playNextSongNote,
      item.dur * stepDurationMs
    );
  };

  public startBGM() {
    if (this.isMuted) return;
    if (this.isMusicPlaying) return;

    this.initCtx();
    this.isMusicPlaying = true;

    // 1. If user supplied an external MP3 in GAME_CONFIG.music.audioCustomUrl
    if (GAME_CONFIG.music?.audioCustomUrl) {
      if (!this.audioEl) {
        this.audioEl = new Audio(GAME_CONFIG.music.audioCustomUrl);
        this.audioEl.loop = true;
      }
      this.audioEl.play().catch(() => {
        // Fallback to procedural synth if audio file fails
        this.currentNoteIndex = 0;
        this.playNextSongNote();
      });
      return;
    }

    // 2. Play Web Audio API synthesized "I See the Light"
    this.currentNoteIndex = 0;
    this.playNextSongNote();
  }

  public stopBGM() {
    this.isMusicPlaying = false;
    if (this.playbackTimeout !== null) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }

  // SFX: Character Jump
  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // Ignore
    }
  }

  // SFX: Item Collect / Open
  public playItemCollect() {
    if (this.isMuted) return;
    const notes = [587.33, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.18, 0.05);
      }, idx * 65);
    });
  }

  // SFX: Treasure Chest Open Chime
  public playChestFanfare() {
    if (this.isMuted) return;
    const chords = [
      [523.25, 659.25],
      [659.25, 783.99],
      [783.99, 1046.50],
      [1046.50, 1318.51, 1567.98]
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(f => this.playTone(f, 'sine', 0.35, 0.04));
      }, i * 110);
    });
  }

  // SFX: Dialog blip sound
  public playBlip() {
    if (this.isMuted) return;
    this.playTone(880 + Math.random() * 80, 'square', 0.04, 0.02);
  }

  // SFX: Button Click
  public playClick() {
    if (this.isMuted) return;
    this.playTone(600, 'triangle', 0.08, 0.04);
  }

  // SFX: Celebration / Acceptance Fanfare
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const fanfareNotes = [
      { f: 523.25, d: 120 },
      { f: 659.25, d: 120 },
      { f: 783.99, d: 120 },
      { f: 1046.50, d: 280 },
      { f: 880.00, d: 120 },
      { f: 1046.50, d: 450 },
      { f: 1318.51, d: 650 },
    ];

    let delay = 0;
    fanfareNotes.forEach(({ f, d }) => {
      setTimeout(() => {
        this.playTone(f, 'triangle', d / 1000, 0.07);
        this.playTone(f * 0.5, 'sine', d / 1000, 0.05);
      }, delay);
      delay += d;
    });
  }
}

export const sound = new SoundEngine();
