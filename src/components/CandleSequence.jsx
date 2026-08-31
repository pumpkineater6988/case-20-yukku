import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CandleSequence.css';

/** Synthesize a matchstick strike sound via Web Audio API */
function playMatchSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = Math.floor(ctx.sampleRate * 0.25);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.12));
      data[i] = (Math.random() * 2 - 1) * decay * 0.6;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (_) { /* silently fail */ }
}

/** Synthesize a blow/whoosh sound */
function playBlowSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = Math.floor(ctx.sampleRate * 0.5);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.exp(-i / (bufferSize * 0.3)) * Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.4;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    // Low-pass filter for wind effect
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (_) { /* silently fail */ }
}

const CANDLE_COUNT = 5;

export default function CandleSequence({ onComplete }) {
  // 'dark'  — pitch black screen, "Light the Candles" button
  // 'lighting' — match sound, cake fades in
  // 'lit'   — candles burning, "Blow" button
  // 'blowing' — flames animate out
  // 'blown' — smoke, then transition to celebration
  const [phase, setPhase] = useState('dark');

  useEffect(() => {
    if (phase === 'lighting') {
      playMatchSound();
      const t = setTimeout(() => setPhase('lit'), 1400);
      return () => clearTimeout(t);
    }
    if (phase === 'blown') {
      const t = setTimeout(onComplete, 1600);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const handleLight = () => setPhase('lighting');

  const handleBlow = () => {
    if (phase !== 'lit') return;
    playBlowSound();
    setPhase('blowing');
    setTimeout(() => setPhase('blown'), 900);
  };

  return (
    <motion.div
      className="candle-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      {/* Dark background */}
      <div className="candle-scene__bg" />

      {/* Stars */}
      <div className="candle-scene__stars">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${(i * 37.3) % 100}%`,
              top:  `${(i * 19.7) % 60}%`,
              animationDelay: `${(i * 0.37) % 3}s`,
              animationDuration: `${2 + (i % 3)}s`,
              width:  (i % 3) + 1 + 'px',
              height: (i % 3) + 1 + 'px',
            }}
          />
        ))}
      </div>

      {/* ── DARK phase: light the candles button ── */}
      <AnimatePresence>
        {phase === 'dark' && (
          <motion.div
            className="candle-scene__dark-overlay"
            key="dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <motion.div
              className="candle-scene__dark-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="candle-scene__dark-icon">🕯️</div>
              <p className="candle-scene__dark-text">The room is dark…</p>
              <motion.button
                className="btn btn-candle-light"
                onClick={handleLight}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                🔥 &nbsp; Light The Candles
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CAKE (visible once lighting starts) ── */}
      <AnimatePresence>
        {phase !== 'dark' && (
          <motion.div
            key="cake-content"
            className="candle-scene__content"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Cake */}
            <div className="cake">
              {/* Candles row */}
              <div className="cake__candles">
                {Array.from({ length: CANDLE_COUNT }).map((_, i) => (
                  <div key={i} className="candle">
                    <div className="candle__body" style={{ background: `hsl(${i * 50}, 80%, 60%)` }} />
                    <div className="candle__wick" />
                    <AnimatePresence>
                      {(phase === 'lit' || phase === 'lighting') && (
                        <motion.div
                          className="candle__flame-wrap"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ delay: i * 0.12, duration: 0.3 }}
                        >
                          <div className="candle__flame-outer" />
                          <div className="candle__flame-inner" />
                        </motion.div>
                      )}
                      {phase === 'blowing' && (
                        <motion.div
                          key="blowing"
                          className="candle__flame-wrap"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0, x: [0, 20, -10, 0], scaleX: [1, 2, 0] }}
                          transition={{ delay: i * 0.08, duration: 0.5 }}
                        />
                      )}
                    </AnimatePresence>
                    {phase === 'blown' && (
                      <div className="candle__smoke" style={{ animationDelay: `${i * 0.05}s` }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Cake body */}
              <div className="cake__top-tier">
                <span className="cake__text">✦ ✦ ✦</span>
              </div>
              <div className="cake__mid-tier">
                <span className="cake__big-text">20</span>
              </div>
              <div className="cake__bottom-tier">
                <span className="cake__text">🎂 ✦ 🎂</span>
              </div>
              <div className="cake__plate" />
            </div>

            {/* Hint + blow button */}
            <AnimatePresence>
              {phase === 'lit' && (
                <>
                  <motion.p
                    className="candle-scene__hint"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Make a wish and…
                  </motion.p>
                  <motion.button
                    className="btn btn-primary candle-scene__blow-btn"
                    onClick={handleBlow}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 250, delay: 0.7 } }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🌬️ &nbsp; Blow the Candles!
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {phase === 'blown' && (
              <motion.p
                className="candle-scene__hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✨ Wish granted… opening your surprise!
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
