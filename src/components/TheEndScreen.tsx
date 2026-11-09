import React from 'react';
import { GAME_CONFIG } from '../config';
import { sound } from '../audio/chiptune';

interface TheEndScreenProps {
  onRestart: () => void;
}

export const TheEndScreen: React.FC<TheEndScreenProps> = ({ onRestart }) => {
  const whatsappUrl = `https://wa.me/${GAME_CONFIG.event.whatsAppNumber}?text=${encodeURIComponent(
    GAME_CONFIG.event.whatsAppMessage
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-sky-300 via-pink-200 to-amber-100 overflow-y-auto">
      {/* Decorative Floating Sakura Petals & Sparkles in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-400 opacity-70 animate-bounce"
            style={{
              left: `${(i * 17) % 95}%`,
              top: `${(i * 23) % 90}%`,
              animationDuration: `${3 + (i % 4)}s`,
              fontSize: `${12 + (i % 10)}px`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg pixel-box rounded-2xl p-6 sm:p-8 text-center space-y-6 bg-white/95 shadow-2xl">
        {/* Castle & Sakura Icon */}
        <div className="flex items-center justify-center gap-3 text-4xl">
          <span>🌸</span>
          <span>🏰</span>
          <span>✨</span>
        </div>

        {/* Big Retro "THE END" */}
        <div>
          <h1 className="font-pixel text-2xl sm:text-4xl text-purple-950 font-bold tracking-widest drop-shadow-[0_3px_0_#f472b6]">
            THE END
          </h1>
          <div className="h-1 w-28 mx-auto bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 mt-2"></div>
        </div>

        {/* Message to Ici */}
        <div className="font-dialog text-slate-800 text-lg sm:text-xl leading-relaxed space-y-3 bg-pink-50/80 p-5 rounded-xl border border-pink-200">
          <p className="font-bold text-pink-700">
            "Sampai jumpa Sabtu ini, wanita kesayanganku 🤍"
          </p>
          <p className="text-base sm:text-lg text-slate-600">
            Terima kasih sudah namatin game lucu ini ya! Sampai ketemu di hari Sabtu, 14 November 2026.
          </p>
          <div className="pt-2 font-pixel text-xs text-purple-800 font-semibold">
            - Dari Mas, dengan sepenuh hati -
          </div>
        </div>

        {/* Quick WhatsApp Reminder */}
        <div className="pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="pixel-button inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded cursor-pointer shadow-md w-full sm:w-auto"
          >
            <span>💬 Buka WhatsApp Mas</span>
          </a>
        </div>

        {/* Play Again Button */}
        <div>
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="pixel-btn-secondary px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-900 font-pixel text-xs rounded cursor-pointer flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95"
          >
            <span>🔄 Main Lagi dari Awal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
