import React, { useState, useEffect } from 'react';
import { GAME_CONFIG } from '../config';
import { sound } from '../audio/chiptune';

interface CastleInvitationModalProps {
  isOpen: boolean;
  onAccepted: () => void;
  onGoToEndScreen: () => void;
}

export const CastleInvitationModal: React.FC<CastleInvitationModalProps> = ({
  isOpen,
  onAccepted,
  onGoToEndScreen,
}) => {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [rejectAttempts, setRejectAttempts] = useState(0);
  const [rejectOffset, setRejectOffset] = useState({ x: 0, y: 0 });
  const [rejectMessage, setRejectMessage] = useState<string | null>(null);

  // Live Countdown state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = GAME_CONFIG.event.targetTimestamp - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle runaway "TOLAK" button logic
  const handleRejectDodge = () => {
    sound.playBlip();
    const nextAttempt = rejectAttempts + 1;
    setRejectAttempts(nextAttempt);

    // Random message from config
    const randomMsg = GAME_CONFIG.rejectButtonTexts[nextAttempt % GAME_CONFIG.rejectButtonTexts.length];
    setRejectMessage(randomMsg);

    // Random displacement within a bounding box
    const maxOffset = 110;
    const randomX = (Math.random() - 0.5) * maxOffset * 2;
    const randomY = (Math.random() - 0.5) * 60;
    setRejectOffset({ x: randomX, y: randomY });
  };

  const handleAccept = () => {
    sound.playVictoryFanfare();
    setHasAccepted(true);
    onAccepted();
  };

  const isRejectTransformedToAccept = rejectAttempts >= 5;

  const whatsappUrl = `https://wa.me/${GAME_CONFIG.event.whatsAppNumber}?text=${encodeURIComponent(
    GAME_CONFIG.event.whatsAppMessage
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg pixel-box rounded-xl p-5 sm:p-7 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Crown & Ribbon Header */}
        <div className="relative -top-8 -mx-3 flex flex-col items-center mb-[-10px]">
          <div className="text-3xl mb-1 animate-bounce">👑</div>
          <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-pixel text-xs sm:text-sm px-5 py-2.5 border-3 border-purple-950 shadow-[0_4px_0_#3b0764] rounded-lg text-center flex items-center gap-2">
            <span>💌</span>
            <span>{GAME_CONFIG.castleInvitation.title}</span>
          </div>
        </div>

        {!hasAccepted ? (
          <div className="space-y-4 text-slate-800 mt-2">
            {/* Story Prologue */}
            <div className="bg-pink-50/90 border border-pink-200 rounded-lg p-3 sm:p-4 text-center font-dialog">
              <p className="font-pixel text-[11px] text-pink-600 mb-1">
                {GAME_CONFIG.castleInvitation.greeting}
              </p>
              {GAME_CONFIG.castleInvitation.bodyParagraphs.map((para, i) => (
                <p key={i} className="text-sm sm:text-base text-slate-700 leading-relaxed mb-1 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Event Details Card */}
            <div className="pixel-box-purple rounded-lg p-4 space-y-2.5">
              <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                <span className="text-xl">📅</span>
                <div>
                  <div className="text-[10px] font-pixel text-purple-700">HARI & TANGGAL</div>
                  <div className="font-dialog font-bold text-base sm:text-lg text-purple-950">
                    {GAME_CONFIG.event.dayAndDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                <span className="text-xl">⏰</span>
                <div>
                  <div className="text-[10px] font-pixel text-purple-700">WAKTU PERJALANAN</div>
                  <div className="font-dialog font-bold text-sm sm:text-base text-purple-950">
                    {GAME_CONFIG.event.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                <span className="text-xl">📍</span>
                <div>
                  <div className="text-[10px] font-pixel text-purple-700">LOKASI RAHASIA</div>
                  <div className="font-dialog font-bold text-sm sm:text-base text-purple-950">
                    {GAME_CONFIG.event.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl">👗</span>
                <div>
                  <div className="text-[10px] font-pixel text-purple-700">DRESS CODE</div>
                  <div className="font-dialog text-xs sm:text-sm text-purple-900">
                    {GAME_CONFIG.event.dressCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Countdown Box */}
            <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 border-2 border-purple-900 rounded-lg p-3 text-center">
              <div className="font-pixel text-[10px] text-purple-800 mb-2">
                ⏳ HITUNG MUNDUR HARI-H ⏳
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/90 border border-purple-300 rounded p-1.5 shadow-xs">
                  <div className="font-pixel text-base sm:text-lg text-pink-600 font-bold tabular-nums">
                    {timeLeft.days}
                  </div>
                  <div className="text-[9px] font-pixel text-slate-500">HARI</div>
                </div>
                <div className="bg-white/90 border border-purple-300 rounded p-1.5 shadow-xs">
                  <div className="font-pixel text-base sm:text-lg text-purple-600 font-bold tabular-nums">
                    {timeLeft.hours}
                  </div>
                  <div className="text-[9px] font-pixel text-slate-500">JAM</div>
                </div>
                <div className="bg-white/90 border border-purple-300 rounded p-1.5 shadow-xs">
                  <div className="font-pixel text-base sm:text-lg text-purple-600 font-bold tabular-nums">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-[9px] font-pixel text-slate-500">MENIT</div>
                </div>
                <div className="bg-white/90 border border-purple-300 rounded p-1.5 shadow-xs">
                  <div className="font-pixel text-base sm:text-lg text-pink-600 font-bold tabular-nums">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-[9px] font-pixel text-slate-500">DETIK</div>
                </div>
              </div>
            </div>

            {/* The Big Question */}
            <div className="text-center pt-1">
              <p className="font-pixel text-sm sm:text-base text-purple-950 font-bold animate-pulse">
                {GAME_CONFIG.castleInvitation.question}
              </p>
              {rejectMessage && (
                <div className="inline-block mt-2 font-dialog font-bold text-sm sm:text-base text-rose-600 bg-rose-50 border border-rose-300 px-3 py-1 rounded-full animate-bounce">
                  {rejectMessage}
                </div>
              )}
            </div>

            {/* Choice Buttons Area with Dodge Logic */}
            <div className="relative min-h-[90px] flex items-center justify-center gap-4 pt-2">
              {/* Primary "MAU" Button */}
              <button
                onClick={handleAccept}
                className="pixel-button px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-pixel text-xs sm:text-sm rounded cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
              >
                <span>MAU 💖</span>
              </button>

              {/* Runaway "TOLAK" Button */}
              {!isRejectTransformedToAccept ? (
                <button
                  onMouseEnter={handleRejectDodge}
                  onTouchStart={handleRejectDodge}
                  onClick={handleRejectDodge}
                  style={{
                    transform: `translate(${rejectOffset.x}px, ${rejectOffset.y}px) scale(${Math.max(
                      0.65,
                      1 - rejectAttempts * 0.08
                    )})`,
                    transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  className="pixel-btn-secondary px-5 py-3 bg-slate-200 text-slate-700 font-pixel text-xs sm:text-sm rounded cursor-pointer whitespace-nowrap active:scale-90"
                >
                  TOLAK 🥺
                </button>
              ) : (
                /* Transformed into enthusiastic acceptance after evasions */
                <button
                  onClick={handleAccept}
                  className="pixel-button px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-pixel text-xs sm:text-sm rounded cursor-pointer animate-bounce shadow-lg"
                >
                  MAU BANGET! 💖
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Confirmation State After Clicking "MAU 💖" */
          <div className="space-y-5 text-center mt-3 animate-in zoom-in-95 duration-300">
            <div className="text-5xl animate-bounce">🎉🌸💖</div>

            <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4">
              <h3 className="font-pixel text-sm sm:text-base text-pink-700 font-bold mb-2">
                HOREEE! JAWABAN ICI DITERIMA! 💖
              </h3>
              <p className="font-dialog text-base sm:text-lg text-slate-700 leading-relaxed">
                Terima kasih sudah mau date dengan Mas, wanita kesayanganku! 🤍
                Mas sudah tidak sabar menunggu hari Sabtu, 14 November 2026 tiba.
              </p>
            </div>

            {/* WhatsApp RSVP Action */}
            <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-lg">
              <p className="font-dialog text-xs sm:text-sm text-emerald-900 mb-3 font-semibold">
                Kirim pesan konfirmasi langsung ke WhatsApp Mas:
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="pixel-button inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs sm:text-sm rounded cursor-pointer shadow-md w-full sm:w-auto"
              >
                <span>💬 Kirim Jawaban via WhatsApp</span>
              </a>
            </div>

            {/* Go to Final Ending Screen */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onGoToEndScreen();
                }}
                className="pixel-button px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-pixel text-xs sm:text-sm rounded cursor-pointer hover:opacity-95"
              >
                Lihat Penutup Kisah →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
