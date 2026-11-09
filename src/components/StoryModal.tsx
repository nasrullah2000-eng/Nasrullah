import React from 'react';
import { StoryItem } from '../config';
import { sound } from '../audio/chiptune';
import { PixelPolaroidArt } from './PixelPolaroidArt';

interface StoryModalProps {
  item: StoryItem | null;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md pixel-box-purple rounded-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ribbon Header */}
        <div className="relative -top-7 -mx-2 flex justify-center mb-[-12px]">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-pixel text-xs sm:text-sm px-4 py-2 border-2 border-purple-950 shadow-[0_3px_0_#3b0764] rounded text-center flex items-center gap-2">
            <span>{item.icon}</span>
            <span className="tracking-wide">{item.title}</span>
          </div>
        </div>

        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-8 h-8 bg-pink-100 hover:bg-pink-200 border-2 border-purple-950 text-purple-950 font-pixel text-xs flex items-center justify-center rounded cursor-pointer transition-transform active:scale-90"
          aria-label="Tutup Jendela"
        >
          ✕
        </button>

        {/* Modal Body Content */}
        <div className="mt-3">
          {/* 1. Letter Type */}
          {item.type === 'letter' && item.content && (
            <div className="space-y-3 font-dialog text-slate-800 text-base sm:text-lg leading-relaxed bg-white/90 p-4 rounded border border-pink-200 shadow-inner">
              <div className="text-center font-pixel text-xs text-pink-600 pb-1 border-b border-pink-100">
                💌 Surat Rahasia untuk Ici
              </div>
              {item.content.map((paragraph, idx) => (
                <p key={idx} className="text-slate-700">
                  {paragraph}
                </p>
              ))}
              <div className="text-right pt-2 font-pixel text-xs text-purple-700">
                - Dengan tulus, Mas 🌸
              </div>
            </div>
          )}

          {/* 2. Photo / Polaroid Type */}
          {item.type === 'photo' && (
            <div className="flex flex-col items-center">
              {/* Polaroid Frame */}
              <div className="w-full bg-white p-3 pb-4 rounded shadow-md border-2 border-slate-300 relative">
                {/* Washi tape on top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-pink-300/80 -rotate-2 border border-pink-400"></div>

                <PixelPolaroidArt type={item.photoType} customUrl={item.photoCustomUrl} />

                {/* Caption below photo */}
                <div className="mt-3 text-center font-dialog text-slate-800 text-base sm:text-lg italic px-2">
                  "{item.caption}"
                </div>
              </div>
            </div>
          )}

          {/* 3. Reasons to Love */}
          {item.type === 'reasons' && item.reasons && (
            <div className="space-y-3">
              <div className="bg-white/95 p-4 rounded border border-pink-200 shadow-inner space-y-2.5">
                {item.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-pink-50/70 rounded border border-pink-100">
                    <span className="text-xl shrink-0">{r.icon}</span>
                    <p className="font-dialog text-slate-800 text-sm sm:text-base leading-snug">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* 5-Star Rating badge */}
              <div className="bg-gradient-to-r from-amber-100 via-pink-100 to-purple-100 border-2 border-purple-900 p-2.5 rounded text-center">
                <p className="font-pixel text-[10px] sm:text-xs text-purple-950 font-bold">
                  {item.ratingText || "Rating: 5/5 Bintang Tak Terhingga ⭐⭐⭐⭐⭐"}
                </p>
              </div>
            </div>
          )}

          {/* 4. Chest Type */}
          {item.type === 'chest' && item.content && (
            <div className="space-y-3 bg-white/95 p-4 rounded border-2 border-amber-300 shadow-inner text-center">
              <div className="text-4xl animate-bounce my-1">
                💎✨🎁
              </div>
              <h4 className="font-pixel text-xs text-amber-700 tracking-wider">
                PETI HARTA DIBUKA!
              </h4>
              <div className="space-y-2 font-dialog text-slate-700 text-base sm:text-lg leading-relaxed text-left">
                {item.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Button */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={handleClose}
            className="pixel-button px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-pixel text-xs sm:text-sm rounded cursor-pointer flex items-center gap-2 hover:opacity-95"
          >
            <span>Lanjutkan Perjalanan</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
