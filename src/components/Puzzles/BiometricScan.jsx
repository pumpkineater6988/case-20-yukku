import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVIDENCE_CARDS } from '../../data/caseData';
import './BiometricScan.css';

// Quiz options — only D is correct
const QUIZ_OPTIONS = [
  { id: 'A', label: 'Pongu Buggalu' },
  { id: 'B', label: 'Boori Buggalu' },
  { id: 'C', label: 'Option A and B' },
  { id: 'D', label: 'All of the Above 💖' },
];

const TAUNT_MESSAGES = [
  'Nice try Yukkulu! 😏 Akku loves EVERYTHING! Think harder...',
  'That\'s cute but... not quite right 🐵 Try again!',
  'Hmm, really?? Akku\'s heart is bigger than that! 💕',
  'Kottesta! 😤 Wrong answer! Try again!',
];

// HUD stat rows shown after scan
const HUD_STATS = [
  { label: 'Cuteness Level',          value: '∞ Infinity',   delay: 0.1 },
  { label: 'Pongu Buggalu Softness',  value: '∞ Infinity',   delay: 0.25 },
  { label: 'Dumb',                    value: 'Konchem 🤏',   delay: 0.4 },
  { label: 'Monkey Traits',           value: '∞ Infinity 🐒', delay: 0.55 },
];

export default function BiometricScan({ onComplete }) {
  // phases: 'camera' → 'scanning' → 'hud' → 'quiz' → 'success'
  const [phase, setPhase]         = useState('camera');
  const [scanPct, setScanPct]     = useState(0);
  const [tauntIdx, setTauntIdx]   = useState(0);
  const [showTaunt, setShowTaunt] = useState(false);
  const [wrongId, setWrongId]     = useState(null);
  const videoRef                  = useRef(null);
  const streamRef                 = useRef(null);

  // Start camera
  useEffect(() => {
    let mounted = true;
    if (phase === 'camera') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then(stream => {
          if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch(() => { /* user denied — fallback to emoji face */ });
    }
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [phase]);

  const startScan = () => {
    setPhase('scanning');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 9 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        // Stop camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        setTimeout(() => setPhase('hud'), 600);
      }
      setScanPct(Math.round(p));
    }, 80);
  };

  const proceedToQuiz = () => setPhase('quiz');

  const handleAnswer = (optId) => {
    if (optId === 'D') {
      setPhase('success');
      return;
    }
    setWrongId(optId);
    const nextIdx = (tauntIdx + 1) % TAUNT_MESSAGES.length;
    setTauntIdx(nextIdx);
    setShowTaunt(true);
    setTimeout(() => { setShowTaunt(false); setWrongId(null); }, 2000);
  };

  const card = EVIDENCE_CARDS[0];

  return (
    <div className="bscan">
      <div className="container">
        {/* Stage label */}
        <div className="puzzle-header animate-fade-in-up">
          <span className="badge badge-red">🔬 STAGE 01 — BIOMETRICS</span>
          <h2 className="puzzle-title">Nee Muthi Analysis</h2>
          <p className="puzzle-desc">
            Facial verification of the suspect known for her{' '}
            <em className="highlight">"Pongu Buggalu"</em>. Target often threatens the
            investigator with{' '}
            <em className="highlight">"Kottesta!"</em> when teased.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── PHASE: camera + scan ── */}
          {(phase === 'camera' || phase === 'scanning') && (
            <motion.div key="scan-phase"
              className="bscan__panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Live camera / face area */}
              <div className="bscan__face-wrap">
                <div className="bscan__face-ring bscan__face-ring--outer" />
                <div className="bscan__face-ring bscan__face-ring--middle" />
                <div className="bscan__face">
                  {/* Live video — hidden if camera unavailable */}
                  <video
                    ref={videoRef}
                    className="bscan__camera-video"
                    muted
                    playsInline
                    autoPlay
                  />
                  {/* Fallback face emoji (shown when video is blank) */}
                  <div className="bscan__face-icon">🧑‍💻</div>

                  {/* Scan beam */}
                  {phase === 'scanning' && (
                    <div className="bscan__scan-beam" style={{ top: `${scanPct}%` }} />
                  )}
                </div>
                <div className="bscan__face-corners">
                  <span className="fc tl" /><span className="fc tr" />
                  <span className="fc bl" /><span className="fc br" />
                </div>
              </div>

              {/* Progress bar */}
              {phase === 'scanning' && (
                <div className="bscan__progress-wrap">
                  <div className="bscan__progress-bar">
                    <div className="bscan__progress-fill" style={{ width: `${scanPct}%` }} />
                  </div>
                  <div className="bscan__progress-text text-mono">
                    SCANNING... {scanPct}%
                  </div>
                </div>
              )}

              {phase === 'camera' && (
                <button className="btn btn-primary" onClick={startScan}>
                  🔍 &nbsp; Begin Facial Scan
                </button>
              )}
            </motion.div>
          )}

          {/* ── PHASE: HUD stats ── */}
          {phase === 'hud' && (
            <motion.div key="hud-phase"
              className="bscan__panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bscan__alert text-mono">
                ✅ Scan Complete — Biometric Profile Logged
              </div>

              <div className="bscan__hud-grid">
                {HUD_STATS.map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="bscan__hud-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stat.delay, duration: 0.4 }}
                  >
                    <span className="bscan__hud-label">{stat.label}</span>
                    <span className="bscan__hud-value">{stat.value}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="btn btn-primary"
                onClick={proceedToQuiz}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                🔐 &nbsp; Proceed to Identity Verification →
              </motion.button>
            </motion.div>
          )}

          {/* ── PHASE: quiz ── */}
          {phase === 'quiz' && (
            <motion.div key="quiz-phase"
              className="bscan__panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bscan__alert text-mono">
                🔐 Identity Challenge — Answer to Unlock
              </div>

              <p className="bscan__quiz-question">
                What does Akku Like Most in Yukku?
              </p>

              <div className="bscan__quiz-options">
                {QUIZ_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.id}
                    className={`bscan__quiz-btn ${wrongId === opt.id ? 'bscan__quiz-btn--wrong' : ''}`}
                    onClick={() => handleAnswer(opt.id)}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span className="bscan__quiz-letter">{opt.id}.</span>
                    <span>{opt.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Taunt message */}
              <AnimatePresence>
                {showTaunt && (
                  <motion.div
                    className="bscan__taunt"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {TAUNT_MESSAGES[tauntIdx]}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── PHASE: success ── */}
          {phase === 'success' && (
            <motion.div key="success-phase"
              className="bscan__panel bscan__panel--success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200 } }}
            >
              <div className="bscan__success-icon animate-heartbeat">💖</div>
              <h3 className="bscan__success-title">IDENTITY CONFIRMED</h3>
              <p className="bscan__success-sub">Biometric match: 100% — Dangerously cute smile detected.</p>

              {/* Evidence card */}
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
                📁 &nbsp; File Evidence & Continue →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
