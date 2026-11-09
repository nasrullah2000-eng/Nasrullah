import React, { useState } from 'react';
import { GAME_CONFIG, CharacterPreset } from '../config';
import { sound } from '../audio/chiptune';

interface TitleScreenProps {
  onStart: (selectedPreset: CharacterPreset) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const [selectedPreset, setSelectedPreset] = useState<CharacterPreset>(
    GAME_CONFIG.characters[0]
  );

  const handleStartGame = () => {
    sound.startBGM();
    sound.playClick();
    onStart(selectedPreset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-sky-200 via-pink-200 to-amber-100 overflow-y-auto">
      {/* Pixel Clouds in Background */}
      <div className="absolute top-6 left-8 opacity-60 pointer-events-none text-3xl">☁️</div>
      <div className="absolute top-16 right-12 opacity-60 pointer-events-none text-4xl">☁️</div>
      <div className="absolute bottom-20 left-10 opacity-70 pointer-events-none text-2xl">🌸</div>
      <div className="absolute bottom-24 right-16 opacity-70 pointer-events-none text-2xl">🌷</div>

      <div className="relative z-10 w-full max-w-lg pixel-box rounded-2xl p-5 sm:p-7 text-center space-y-5 bg-white/95 shadow-2xl my-auto">
        {/* Crown & Subtitle Kicker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-2xl">
            <span>🌸</span>
            <span>🎮</span>
            <span>🌸</span>
          </div>
          <div className="font-pixel text-[10px] text-pink-600 tracking-wider">
            KHUSUS UNTUK WANITA KESAYANGANKU
          </div>
          {/* Main Title Logo */}
          <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-purple-950 font-bold leading-tight drop-shadow-[0_2px_0_#f472b6]">
            Jalan Menuju Kastil 🏰
          </h1>
          <p className="font-dialog font-bold text-base sm:text-lg text-purple-800">
            Game Lucu Menuju Sabtu, 14 November 2026 ✨
          </p>
        </div>

        {/* Character Customizer Selection */}
        <div className="bg-pink-50/90 border-2 border-pink-200 rounded-xl p-3 sm:p-4 space-y-3">
          <div className="font-pixel text-[11px] text-purple-900 font-bold">
            PILIH TAMPILAN KARAKTER ICI:
          </div>

          <div className="grid grid-cols-3 gap-2">
            {GAME_CONFIG.characters.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedPreset(preset);
                  }}
                  className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-purple-900 bg-white shadow-[0_3px_0_#581c87] scale-105'
                      : 'border-transparent bg-pink-100/60 hover:bg-pink-100 opacity-80'
                  }`}
                >
                  {/* Miniature Pixel Doll Preview */}
                  <div
                    className="w-10 h-10 rounded border border-purple-800 flex items-center justify-center relative overflow-hidden shadow-inner"
                    style={{ backgroundColor: preset.dressColor }}
                  >
                    <div
                      className="w-6 h-6 rounded-full absolute -top-1"
                      style={{ backgroundColor: preset.hairColor }}
                    />
                    <div
                      className="w-4 h-4 rounded-full absolute top-1 bg-amber-100 border border-amber-300"
                    />
                    <div
                      className="w-2 h-1 rounded absolute top-0"
                      style={{ backgroundColor: preset.flowerCrownColor }}
                    />
                  </div>
                  <span className="font-pixel text-[9px] text-purple-950 font-semibold leading-tight line-clamp-1">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="font-dialog text-xs text-purple-800 italic">
            {selectedPreset.description}
          </p>
        </div>

        {/* Controls Instructions Card */}
        <div className="bg-purple-50/80 border border-purple-200 rounded-lg p-2.5 text-left text-xs font-dialog text-slate-700 space-y-1">
          <div className="font-pixel text-[9px] text-purple-900 font-bold mb-1">
            🎮 PANDUAN KONTROL:
          </div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] bg-white px-1.5 py-0.5 rounded border border-purple-300">HP</span>
            <span>Gunakan tombol layar di bawah atau ketuk layar untuk jalan & buka item.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] bg-white px-1.5 py-0.5 rounded border border-purple-300">Laptop</span>
            <span>Gunakan tombol panah / WASD untuk jalan, SPASI untuk lompat, dan [E] untuk buka.</span>
          </div>
        </div>

        {/* Start Game Action Button */}
        <div>
          <button
            onClick={handleStartGame}
            className="pixel-button w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-pixel text-xs sm:text-sm rounded-xl cursor-pointer hover:opacity-95 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="pixel-blink">▶</span>
            <span className="tracking-wider">MULAI GAME LUCU INI</span>
            <span className="pixel-blink">◀</span>
          </button>
        </div>

        {/* Music indicator & sweet note */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-pink-100/80 px-3 py-1 rounded-full text-[11px] font-dialog text-purple-900 border border-pink-300">
            <span>🎵</span>
            <span>Musik: <b>I See the Light</b> - Mandy Moore</span>
          </div>
          <p className="font-dialog text-xs text-slate-500">
            Game lucu santai yang Mas bikin khusus buat Ici 🌸
          </p>
        </div>
      </div>
    </div>
  );
};
