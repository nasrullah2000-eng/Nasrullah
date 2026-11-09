import React from 'react';

interface PixelPolaroidArtProps {
  type?: 'sunset_picnic' | 'flower_cafe' | 'custom';
  customUrl?: string;
}

export const PixelPolaroidArt: React.FC<PixelPolaroidArtProps> = ({ type = 'sunset_picnic', customUrl }) => {
  if (customUrl) {
    return (
      <div className="w-full h-48 bg-pink-100 overflow-hidden rounded border-2 border-purple-900">
        <img
          src={customUrl}
          alt="Foto Kenangan"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (type === 'sunset_picnic') {
    return (
      <div className="w-full h-48 relative overflow-hidden rounded border-2 border-purple-900 bg-gradient-to-b from-sky-200 via-pink-200 to-amber-100 flex flex-col justify-end p-2">
        {/* Sun in pixel art style */}
        <div className="absolute top-4 right-8 w-12 h-12 bg-amber-300 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)] border-2 border-amber-400"></div>
        {/* Soft pastel clouds */}
        <div className="absolute top-6 left-4 w-16 h-6 bg-white/80 rounded-full"></div>
        <div className="absolute top-10 left-12 w-20 h-5 bg-white/70 rounded-full"></div>

        {/* Silhouette Hills */}
        <div className="absolute bottom-10 left-0 right-0 h-16 bg-gradient-to-t from-purple-300 to-pink-200 rounded-t-3xl"></div>

        {/* Picnic Mat & silhouettes */}
        <div className="relative z-10 flex items-end justify-center gap-4 pb-2">
          {/* Mat */}
          <div className="absolute bottom-0 w-32 h-6 bg-red-400/90 rounded-sm border border-red-600 flex items-center justify-around px-2">
            <span className="text-[10px]">🧺</span>
            <span className="text-[10px]">🍓</span>
            <span className="text-[10px]">🧃</span>
          </div>

          {/* Couple Pixel Silhouette Characters */}
          <div className="relative z-20 flex items-center gap-6 pb-2">
            <div className="flex flex-col items-center">
              <span className="text-xl">🧑‍🦱</span>
              <span className="text-[9px] font-pixel text-purple-950 font-bold bg-white/80 px-1 rounded">Mas</span>
            </div>
            <div className="text-sm animate-bounce">💖</div>
            <div className="flex flex-col items-center">
              <span className="text-xl">👧</span>
              <span className="text-[9px] font-pixel text-pink-900 font-bold bg-white/80 px-1 rounded">Ici</span>
            </div>
          </div>
        </div>

        {/* Sparkles */}
        <div className="absolute top-2 left-6 text-yellow-300 text-xs animate-pulse">✨</div>
        <div className="absolute top-14 right-24 text-pink-400 text-xs animate-ping">🌸</div>
      </div>
    );
  }

  // flower_cafe
  return (
    <div className="w-full h-48 relative overflow-hidden rounded border-2 border-purple-900 bg-gradient-to-b from-purple-200 via-pink-100 to-emerald-100 flex flex-col justify-end p-2">
      {/* Cafe Awning */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-pink-400 flex">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-full ${i % 2 === 0 ? 'bg-pink-400' : 'bg-white'}`}
          />
        ))}
      </div>

      {/* Flower decorations */}
      <div className="absolute top-10 left-3 flex gap-1 text-sm">
        <span>🌷</span>
        <span>🌸</span>
        <span>🌻</span>
      </div>
      <div className="absolute top-10 right-3 flex gap-1 text-sm">
        <span>🌼</span>
        <span>🌹</span>
        <span>🌺</span>
      </div>

      {/* Cafe Table with drinks and couple */}
      <div className="relative z-10 flex items-end justify-center gap-4 pb-2">
        <div className="flex flex-col items-center">
          <span className="text-2xl">☕</span>
          <span className="text-[9px] font-pixel text-purple-900 bg-white/90 px-1 rounded mt-1">Coffee Date</span>
        </div>
        <div className="text-base animate-pulse">🍰</div>
        <div className="flex flex-col items-center">
          <span className="text-2xl">🧋</span>
          <span className="text-[9px] font-pixel text-pink-900 bg-white/90 px-1 rounded mt-1">Sweet Tea</span>
        </div>
      </div>

      {/* Little hearts */}
      <div className="absolute bottom-2 left-4 text-xs">✨</div>
      <div className="absolute bottom-3 right-5 text-xs">🍓</div>
    </div>
  );
};
