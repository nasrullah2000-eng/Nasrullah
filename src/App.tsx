/**
 * ============================================================================
 * WEBSITE UNDANGAN DATE RETRO PIXEL-ART 🌸
 * ============================================================================
 * Untuk: Zhaqiela Ainayah ("Ici") - "wanita kesayanganku"
 * Dari: Mas
 * Tanggal Acara: Sabtu, 14 November 2026
 * 
 * CATATAN PENGATURAN:
 * Semua teks, tanggal, jam, lokasi, nomor WhatsApp, foto, dan isi surat
 * dapat diedit dengan sangat mudah di file:
 * -> /src/config.ts
 * ============================================================================
 */

import { useState } from 'react';
import { GAME_CONFIG, CharacterPreset, StoryItem } from './config';
import { TitleScreen } from './components/TitleScreen';
import { GameCanvas } from './game/GameCanvas';
import { StoryModal } from './components/StoryModal';
import { CastleInvitationModal } from './components/CastleInvitationModal';
import { TheEndScreen } from './components/TheEndScreen';
import { PixelConfetti } from './components/PixelConfetti';
import { sound } from './audio/chiptune';

type GameState = 'TITLE' | 'PLAYING' | 'ENDING';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [characterPreset, setCharacterPreset] = useState<CharacterPreset>(GAME_CONFIG.characters[0]);
  const [collectedItemIds, setCollectedItemIds] = useState<number[]>([]);
  const [activeStoryItem, setActiveStoryItem] = useState<StoryItem | null>(null);
  const [isCastleModalOpen, setIsCastleModalOpen] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Start the game from title screen
  const handleStartGame = (preset: CharacterPreset) => {
    setCharacterPreset(preset);
    setGameState('PLAYING');
    sound.startBGM();
  };

  // Open an item dialog
  const handleOpenItem = (item: StoryItem) => {
    // Record as collected
    if (!collectedItemIds.includes(item.id)) {
      setCollectedItemIds(prev => [...prev, item.id]);
    }

    if (item.type === 'chest') {
      sound.playChestFanfare();
    } else {
      sound.playItemCollect();
    }

    setActiveStoryItem(item);
  };

  // Close story dialog
  const handleCloseStoryModal = () => {
    setActiveStoryItem(null);
  };

  // Trigger castle date invitation
  const handleReachCastle = () => {
    setIsCastleModalOpen(true);
  };

  // When Ici clicks "MAU 💖"
  const handleAccepted = () => {
    setIsConfettiActive(true);
  };

  // Go to final "THE END" screen
  const handleGoToEndScreen = () => {
    setIsCastleModalOpen(false);
    setGameState('ENDING');
  };

  // Restart from title screen
  const handleRestart = () => {
    setGameState('TITLE');
    setCollectedItemIds([]);
    setActiveStoryItem(null);
    setIsCastleModalOpen(false);
    setIsConfettiActive(false);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#fce7f3] relative font-dialog">
      {/* 1. Title Screen */}
      {gameState === 'TITLE' && (
        <TitleScreen onStart={handleStartGame} />
      )}

      {/* 2. Active Game Platformer View */}
      {gameState === 'PLAYING' && (
        <GameCanvas
          characterPreset={characterPreset}
          collectedItemIds={collectedItemIds}
          onOpenItem={handleOpenItem}
          onReachCastle={handleReachCastle}
        />
      )}

      {/* 3. Story Item Modal (Letter, Polaroid, Reasons, Chest) */}
      <StoryModal
        item={activeStoryItem}
        onClose={handleCloseStoryModal}
      />

      {/* 4. Castle Date Invitation Modal */}
      <CastleInvitationModal
        isOpen={isCastleModalOpen}
        onAccepted={handleAccepted}
        onGoToEndScreen={handleGoToEndScreen}
      />

      {/* 5. Pixel Flower Confetti Celebration */}
      <PixelConfetti active={isConfettiActive} />

      {/* 6. The End Final Screen */}
      {gameState === 'ENDING' && (
        <TheEndScreen onRestart={handleRestart} />
      )}
    </main>
  );
}
