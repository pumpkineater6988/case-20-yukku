import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUSPECT_NICKNAMES, EVIDENCE_CARDS } from '../../data/caseData';
import './CipherMatching.css';

// Build 10 cards (5 pairs) and shuffle
function buildCards() {
  const pairs = SUSPECT_NICKNAMES.map((name, i) => [
    { id: `${i}-a`, pairId: i, label: name, flipped: false, matched: false },
    { id: `${i}-b`, pairId: i, label: name, flipped: false, matched: false },
  ]).flat();
  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export default function CipherMatching({ onComplete }) {
  const [cards, setCards]       = useState(buildCards);
  const [flipped, setFlipped]   = useState([]); // indices of currently face-up unmatched cards
  const [locked, setLocked]     = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [phase, setPhase]       = useState('play'); // 'play' | 'success'

  const flip = useCallback((idx) => {
    if (locked) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;

    const newFlipped = [...flipped, idx];
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      const [a, b] = newFlipped;
      if (cards[a].pairId === cards[b].pairId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, matched: true, flipped: true } : c
          ));
          const newCount = matchCount + 1;
          setMatchCount(newCount);
          setFlipped([]);
          setLocked(false);
          if (newCount === SUSPECT_NICKNAMES.length) {
            setTimeout(() => setPhase('success'), 600);
          }
        }, 500);
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, flipped, locked, matchCount]);

  const card = EVIDENCE_CARDS[2];

  return (
    <div className="cipher">
      <div className="container">
        <div className="puzzle-header animate-fade-in-up">
          <span className="badge badge-red">🔐 STAGE 03 — CRYPTOGRAPHY</span>
          <h2 className="puzzle-title">Nickname Decryption Cipher</h2>
          <p className="puzzle-desc">
            Intercepted encrypted transmissions contain suspect aliases.{' '}
            <em className="highlight">Match all 5 pairs</em> to verify agent clearance
            and decrypt the alias database.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'play' && (
            <motion.div key="play"
              className="cipher__panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Progress */}
              <div className="cipher__progress text-mono">
                Matched: {matchCount} / {SUSPECT_NICKNAMES.length}
                <div className="cipher__progress-bar">
                  <div
                    className="cipher__progress-fill"
                    style={{ width: `${(matchCount / SUSPECT_NICKNAMES.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Cards grid */}
              <div className="cipher__grid">
                {cards.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    className={`cipher-card ${card.flipped || card.matched ? 'cipher-card--face-up' : ''} ${card.matched ? 'cipher-card--matched' : ''}`}
                    onClick={() => flip(idx)}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, rotateY: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <div className="cipher-card__inner">
                      {/* Back */}
                      <div className="cipher-card__back">
                        <span className="cipher-card__back-icon">🔐</span>
                        <span className="cipher-card__back-dots">•••</span>
                      </div>
                      {/* Front */}
                      <div className="cipher-card__front">
                        <span className="cipher-card__label">{card.label}</span>
                        {card.matched && <span className="cipher-card__check">✓</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div key="success"
              className="cipher__panel cipher__panel--success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200 } }}
            >
              <div className="bscan__success-icon animate-heartbeat">🎉</div>
              <h3 className="bscan__success-title">ALL ALIASES DECRYPTED!</h3>
              <p className="bscan__success-sub">
                Agent clearance verified — the suspect's full alias database is now unlocked.
              </p>

              <div className="evidence-card">
                <div className="evidence-card__header">
                  <span className="badge badge-gold">📂 {card.title}</span>
                  <span className="evidence-card__sub">{card.subtitle}</span>
                </div>
                <div className="evidence-card__rows">
                  {card.lines.map((l, i) => (
                    <div key={i} className="evidence-card__row">
                      <span className="evidence-card__label">{l.label}</span>
                      <span className="evidence-card__value">{l.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-gold" onClick={onComplete}>
                📁 &nbsp; File Evidence &amp; Continue →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
