import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useAudio }          from './hooks/useAudio';
import CaseHeader            from './components/CaseHeader';
import IntroScreen           from './components/IntroScreen';
import InvestigationBoard    from './components/InvestigationBoard';
import BiometricScan         from './components/Puzzles/BiometricScan';
import LatentDusting         from './components/Puzzles/LatentDusting';
import CipherMatching        from './components/Puzzles/CipherMatching';
import VaultKeypad           from './components/Puzzles/VaultKeypad';
import SlidingPuzzle         from './components/Puzzles/SlidingPuzzle';
import CandleSequence        from './components/CandleSequence';
import CelebrationModal      from './components/CelebrationModal';

/* ──────────────────────────────────────────────
   STAGE MAP
   0 = Intro / Mission Briefing
   1 = Board  (stages visible, stage 1 unlocked)
   2 = Playing Stage 1  (BiometricScan)
   3 = Playing Stage 2  (LatentDusting)
   4 = Playing Stage 3  (CipherMatching)
   5 = Playing Stage 4  (VaultKeypad → unlocks puzzle)
   6 = SlidingPuzzle    (couple photo)
   7 = CandleSequence   (blow the candle)
   8 = CelebrationModal (🎉 Happy Birthday!)
────────────────────────────────────────────── */

const pageVariants = {
  initial:  { opacity: 0, y: 24 },
  animate:  { opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit:     { opacity: 0, y: -24, transition: { duration: 0.3 } },
};

export default function App() {
  const [screen, setScreen] = useState(0);
  // Which board stages are completed
  const [completed, setCompleted] = useState([false, false, false, false]);
  const audio = useAudio();

  const completeStage = useCallback((stageIdx) => {
    setCompleted(prev => {
      const next = [...prev];
      next[stageIdx] = true;
      return next;
    });
  }, []);

  // Board: stages 1-4 are clickable once unlocked sequentially
  const stageUnlocked = (idx) => idx === 0 || completed[idx - 1];

  const handleIntroStart = () => {
    audio.markInteracted();
    setScreen(1);
  };

  const goToBoard = () => setScreen(1);

  const playStage = (stageId) => {
    // stageId is 1-based
    if (!stageUnlocked(stageId - 1)) return;
    setScreen(stageId + 1); // screen 2=stage1, 3=stage2, 4=stage3, 5=stage4
  };

  const handleStage1Done = () => {
    completeStage(0);
    setScreen(1);
  };
  const handleStage2Done = () => {
    completeStage(1);
    setScreen(1);
  };
  const handleStage3Done = () => {
    completeStage(2);
    setScreen(1);
  };
  const handleStage4Done = () => {
    completeStage(3);
    setScreen(6); // → Sliding Puzzle directly
  };
  const handlePuzzleDone  = () => setScreen(7); // → Candle
  const handleCandleDone  = () => setScreen(8); // → Celebration

  const showHeader = screen >= 1 && screen <= 5;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', position: 'relative', overflowX: 'hidden' }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 30%, rgba(216,27,96,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(136,14,79,0.05) 0%, transparent 60%)',
      }} />

      {showHeader && (
        <CaseHeader
          completed={completed}
          audio={audio}
          onBoardClick={goToBoard}
        />
      )}

      <AnimatePresence mode="wait">
        {screen === 0 && (
          <motion.div key="intro" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <IntroScreen onStart={handleIntroStart} />
          </motion.div>
        )}

        {screen === 1 && (
          <motion.div key="board" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <InvestigationBoard
              completed={completed}
              stageUnlocked={stageUnlocked}
              onPlayStage={playStage}
            />
          </motion.div>
        )}

        {screen === 2 && (
          <motion.div key="s1" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <BiometricScan onComplete={handleStage1Done} />
          </motion.div>
        )}

        {screen === 3 && (
          <motion.div key="s2" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <LatentDusting onComplete={handleStage2Done} />
          </motion.div>
        )}

        {screen === 4 && (
          <motion.div key="s3" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <CipherMatching onComplete={handleStage3Done} />
          </motion.div>
        )}

        {screen === 5 && (
          <motion.div key="s4" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <VaultKeypad onComplete={handleStage4Done} />
          </motion.div>
        )}

        {screen === 6 && (
          <motion.div key="puzzle" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <SlidingPuzzle onComplete={handlePuzzleDone} />
          </motion.div>
        )}

        {screen === 7 && (
          <motion.div key="candle" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <CandleSequence onComplete={handleCandleDone} />
          </motion.div>
        )}

        {screen === 8 && (
          <motion.div key="celebration" {...pageVariants} style={{ position: 'relative', zIndex: 1 }}>
            <CelebrationModal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
