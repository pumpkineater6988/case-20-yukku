import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import ImageWithFallback from './ImageWithFallback';
import PhotoGalleryModal from './PhotoGalleryModal';
import { LOVE_LETTER, MEMORY_WALL_CAPTIONS, CASE_INFO, GALLERY_PHOTOS, ART_US_PHOTOS, WORDS_FOR_YU } from '../data/caseData';
import './CelebrationModal.css';

/** Launch confetti with hearts */
function launchConfetti() {
  const colors = ['#D81B60', '#F48FB1', '#FFD700', '#FF80AB', '#CE93D8'];

  // Burst from centre
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors,
    shapes: ['circle', 'square'],
    scalar: 1.2,
  });

  // Side bursts
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
  }, 300);

  // Continuous gentle shower
  let i = 0;
  const shower = setInterval(() => {
    confetti({
      particleCount: 6,
      spread: 90,
      origin: { x: Math.random(), y: -0.1 },
      colors,
      gravity: 0.6,
    });
    if (++i > 20) clearInterval(shower);
  }, 250);
}

/** Typewriter hook */
function useTypewriter(text, speed = 28, startDelay = 800) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let idx = 0;
    setDisplayed('');
    const t0 = setTimeout(() => {
      const iv = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t0);
  }, [text, speed, startDelay]);
  return displayed;
}

const TOP_PHOTOS = [
  { key: 'left',   src: '/assets/Left.jpeg',   label: MEMORY_WALL_CAPTIONS.left,   style: { '--tilt': '-3deg' } },
  { key: 'puzzle', src: '/assets/Puzzle.jpeg', label: MEMORY_WALL_CAPTIONS.puzzle, style: { '--tilt': '0deg' } },
  { key: 'right',  src: '/assets/Right.jpeg',  label: MEMORY_WALL_CAPTIONS.right,  style: { '--tilt': '3deg' } },
];

export default function CelebrationModal() {
  const letterText = useTypewriter(LOVE_LETTER, 22, 1200);
  const launched   = useRef(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState(GALLERY_PHOTOS);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const openGallery = (photos, index = 0) => {
    setGalleryPhotos(photos);
    setGalleryInitialIndex(index);
    setIsGalleryOpen(true);
  };

  useEffect(() => {
    if (!launched.current) {
      launched.current = true;
      launchConfetti();
    }
  }, []);

  return (
    <div className="celeb">
      <PhotoGalleryModal 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        photos={galleryPhotos}
        initialIndex={galleryInitialIndex}
      />
      {/* Floating hearts background */}
      <div className="celeb__hearts" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: `${5 + (i * 5.5) % 92}%`,
              animationDelay: `${(i * 0.4) % 6}s`,
              animationDuration: `${6 + (i % 4)}s`,
              fontSize: `${1 + (i % 3) * 0.5}rem`,
            }}
          >
            💖
          </div>
        ))}
      </div>

      <div className="container">
        {/* Case Closed banner */}
        <motion.div
          className="celeb__banner"
          initial={{ opacity: 0, scale: 0.6, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <div className="celeb__stamp">CASE CLOSED</div>
          <div className="celeb__case-code text-mono">{CASE_INFO.caseCode}</div>
          <div className="celeb__verdict">
            Found Guilty of Stealing Hearts 💖 — Sentenced to Eternal Cuteness
          </div>
        </motion.div>

        {/* Birthday heading */}
        <motion.div
          className="celeb__bday"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="celeb__bday-title">
            🎂 Happy {CASE_INFO.age}<sup>th</sup> Birthday!
          </h1>
          <p className="celeb__bday-sub">
            01 September 2006 &nbsp;→&nbsp; 01 September 2026
          </p>
          <p className="celeb__bday-name">
            <span className="font-telugu">అందాల రాక్షసి</span> · Yukkulu · Ammulu · Kannamma 💕
          </p>
        </motion.div>

        {/* Photo Memory Wall */}
        <motion.section
          className="celeb__wall"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="celeb__section-title">📸 Memory Wall</h2>
          <div className="celeb__photos">
            {TOP_PHOTOS.map((photo, i) => (
              <motion.div
                key={photo.key}
                className={`polaroid celeb__polaroid ${photo.key === 'puzzle' ? 'celeb__polaroid--middle' : ''}`}
                style={{ ...photo.style, cursor: 'pointer' }}
                initial={{ opacity: 0, y: 40, rotate: -8 }}
                animate={{
                  opacity: 1, y: 0,
                  rotate: parseFloat(photo.style['--tilt']),
                  transition: { delay: 1 + i * 0.18, type: 'spring', stiffness: 150 }
                }}
                onClick={() => openGallery(TOP_PHOTOS, i)}
              >
                <div className="tape" />
                <ImageWithFallback
                  src={photo.src}
                  alt={MEMORY_WALL_CAPTIONS[photo.key]}
                  label={photo.label}
                  className="polaroid-img"
                />
                <div className="polaroid-caption">
                  {MEMORY_WALL_CAPTIONS[photo.key]}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Three Folders */}
        <motion.div
          className="celeb__folders-row"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 150 }}
        >
          {/* Folder 1 — Our Album (memories) */}
          <div className="celeb__folder celeb__folder--yellow" onClick={() => openGallery(GALLERY_PHOTOS, 0)}>
            <div className="celeb__folder-back" />
            <div className="celeb__folder-front">
              <span className="celeb__folder-text">Our Album</span>
              <span className="celeb__folder-count">{GALLERY_PHOTOS.length} photos</span>
            </div>
            <div className="celeb__folder-photos">
              <div className="celeb__folder-photo celeb__folder-photo--1" />
              <div className="celeb__folder-photo celeb__folder-photo--2" />
            </div>
          </div>

          {/* Folder 2 — Art & Us */}
          <div className="celeb__folder celeb__folder--blue" onClick={() => openGallery(ART_US_PHOTOS, 0)}>
            <div className="celeb__folder-back celeb__folder-back--blue" />
            <div className="celeb__folder-front celeb__folder-front--blue">
              <span className="celeb__folder-text">Art &amp; Us</span>
              <span className="celeb__folder-count">{ART_US_PHOTOS.length} photos</span>
            </div>
            <div className="celeb__folder-photos">
              <div className="celeb__folder-photo celeb__folder-photo--1" />
              <div className="celeb__folder-photo celeb__folder-photo--2" />
            </div>
          </div>

          {/* Folder 3 — My Words For Yu */}
          <div className="celeb__folder celeb__folder--pink" onClick={() => openGallery(WORDS_FOR_YU, 0)}>
            <div className="celeb__folder-back celeb__folder-back--pink" />
            <div className="celeb__folder-front celeb__folder-front--pink">
              <span className="celeb__folder-text">My Words For Yu</span>
              <span className="celeb__folder-count">{WORDS_FOR_YU.length} items</span>
            </div>
            <div className="celeb__folder-photos">
              <div className="celeb__folder-photo celeb__folder-photo--1" />
              <div className="celeb__folder-photo celeb__folder-photo--2" />
            </div>
          </div>
        </motion.div>

        {/* Love Letter */}
        <motion.section
          className="celeb__letter-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <h2 className="celeb__section-title">✉️ A Letter for You</h2>
          <div className="celeb__letter-card">
            <div className="celeb__letter-seal">💌</div>
            <pre className="celeb__letter-text">
              {letterText}
              {letterText.length < LOVE_LETTER.length && (
                <span className="intro__cursor">█</span>
              )}
            </pre>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          className="celeb__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <div className="celeb__footer-hearts animate-heartbeat">💖 💕 💖</div>
          <p className="celeb__footer-text">
            End of Dossier · {CASE_INFO.caseCode} · Filed: {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
