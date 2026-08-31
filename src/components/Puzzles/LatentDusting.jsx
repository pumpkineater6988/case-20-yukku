import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVIDENCE_CARDS } from '../../data/caseData';
import './LatentDusting.css';

const REVEAL_THRESHOLD = 60; // % to reveal before slider shows

export default function LatentDusting({ onComplete }) {
  const canvasRef       = useRef(null);
  const overlayRef      = useRef(null);
  const [revealPct, setRevealPct]   = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderVal, setSliderVal]   = useState(0);
  const [phase, setPhase]           = useState('dust'); // 'dust' | 'slider' | 'success'
  const isPainting = useRef(false);
  const totalPixels = useRef(0);

  // Initialize canvas
  useEffect(() => {
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    const W = canvas.parentElement.clientWidth;
    const H = Math.min(W * 0.65, 340);
    canvas.width  = W;
    canvas.height = H;
    overlay.width  = W;
    overlay.height = H;

    totalPixels.current = W * H;

    // Draw hidden pattern on canvas (heart + fingerprint lines)
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1A1A35';
    ctx.fillRect(0, 0, W, H);

    // Draw glowing fingerprint arc lines
    ctx.strokeStyle = 'rgba(216,27,96,0.25)';
    ctx.lineWidth = 1.5;
    for (let r = 20; r < 200; r += 12) {
      ctx.beginPath();
      ctx.arc(W / 2, H / 2 + 20, r, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    }

    // Draw heart in centre
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.fillStyle = 'rgba(216,27,96,0.35)';
    ctx.beginPath();
    const s = 60;
    ctx.moveTo(0, -s * 0.3);
    ctx.bezierCurveTo(s * 0.5, -s * 0.8, s, s * 0.1, 0, s * 0.65);
    ctx.bezierCurveTo(-s, s * 0.1, -s * 0.5, -s * 0.8, 0, -s * 0.3);
    ctx.fill();
    ctx.restore();

    // Text watermark
    ctx.font = 'bold 22px "Playfair Display"';
    ctx.fillStyle = 'rgba(244,143,177,0.2)';
    ctx.textAlign = 'center';
    ctx.fillText('Entha Ishtam?', W / 2, H - 24);

    // Overlay — dark cover that user brushes away
    const ovCtx = overlay.getContext('2d');
    ovCtx.fillStyle = '#050510';
    ovCtx.fillRect(0, 0, W, H);
  }, []);

  const reveal = useCallback((x, y) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ovCtx = overlay.getContext('2d');
    const r = 28;
    ovCtx.globalCompositeOperation = 'destination-out';
    const grd = ovCtx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(216,27,96,1)');
    grd.addColorStop(1, 'rgba(216,27,96,0)');
    ovCtx.beginPath();
    ovCtx.arc(x, y, r, 0, Math.PI * 2);
    ovCtx.fillStyle = grd;
    ovCtx.fill();
    ovCtx.globalCompositeOperation = 'source-over';

    // Check reveal percentage
    const imageData = ovCtx.getImageData(0, 0, overlay.width, overlay.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) transparent++;
    }
    const pct = Math.round((transparent / (imageData.data.length / 4)) * 100);
    setRevealPct(pct);
    if (pct >= REVEAL_THRESHOLD && !showSlider) {
      setShowSlider(true);
      setPhase('slider');
    }
  }, [showSlider]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top)  * (canvas.height / rect.height),
    };
  };

  const onPointerDown = (e) => {
    if (phase !== 'dust' && phase !== 'slider') return;
    isPainting.current = true;
    const pos = getPos(e, overlayRef.current);
    reveal(pos.x, pos.y);
  };
  const onPointerMove = (e) => {
    if (!isPainting.current) return;
    e.preventDefault();
    const pos = getPos(e, overlayRef.current);
    reveal(pos.x, pos.y);
  };
  const onPointerUp = () => { isPainting.current = false; };

  const handleSlider = (e) => {
    const val = parseInt(e.target.value);
    setSliderVal(val);
    if (val >= 100) {
      setTimeout(() => setPhase('success'), 300);
    }
  };

  const card = EVIDENCE_CARDS[1];

  return (
    <div className="dust">
      <div className="container">
        <div className="puzzle-header animate-fade-in-up">
          <span className="badge badge-red">🧪 STAGE 02 — FORENSICS</span>
          <h2 className="puzzle-title">Entha Ishtam?</h2>
          <p className="puzzle-desc">
            Latent evidence recovered from the crime scene.{' '}
            <em className="highlight">Drag your finger</em> to dust for prints
            and uncover the hidden evidence. Then measure the emotional density levels.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {(phase === 'dust' || phase === 'slider') && (
            <motion.div key="dust-phase"
              className="dust__panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Hint */}
              <div className="dust__hint text-mono">
                {revealPct < REVEAL_THRESHOLD
                  ? `🔎 Dust the canvas to reveal hidden evidence... (${revealPct}%)`
                  : `✅ ${revealPct}% revealed — now measure affection levels!`
                }
              </div>

              {/* Canvas stack */}
              <div className="dust__canvas-wrap" style={{ position: 'relative', width: '100%' }}>
                <canvas ref={canvasRef} className="dust__canvas" style={{ display: 'block', width: '100%', borderRadius: 12 }} />
                <canvas
                  ref={overlayRef}
                  className="dust__canvas dust__overlay"
                  style={{ position: 'absolute', inset: 0, width: '100%', borderRadius: 12, cursor: 'crosshair', touchAction: 'none' }}
                  onMouseDown={onPointerDown}
                  onMouseMove={onPointerMove}
                  onMouseUp={onPointerUp}
                  onMouseLeave={onPointerUp}
                  onTouchStart={onPointerDown}
                  onTouchMove={onPointerMove}
                  onTouchEnd={onPointerUp}
                />
              </div>

              {/* Slider (shows after threshold) */}
              <AnimatePresence>
                {showSlider && (
                  <motion.div
                    key="slider"
                    className="dust__slider-wrap"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="dust__slider-label text-mono">
                      Affection Density Meter
                    </div>
                    <div className="dust__slider-track">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderVal}
                        onChange={handleSlider}
                        className="dust__slider"
                      />
                      <div className="dust__slider-ticks">
                        {['0%', '250%', '500%', '750%', '1000%'].map(t => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="dust__slider-value" style={{ color: sliderVal >= 100 ? 'var(--gold)' : 'var(--pink-light)' }}>
                      {sliderVal < 100
                        ? `${sliderVal * 10}% — Drag to maximum!`
                        : '🔥 Chaala ante Chaala Ishtam (1000%)!'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div key="success-phase"
              className="dust__panel dust__panel--success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200 } }}
            >
              <div className="bscan__success-icon animate-heartbeat">💞</div>
              <h3 className="bscan__success-title">AFFECTION LEVEL: MAXIMUM</h3>
              <p className="bscan__success-sub">Chaala ante Chaala Ishtam — 1000% Confirmed!</p>

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
