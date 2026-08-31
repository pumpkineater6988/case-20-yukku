import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_PHOTOS } from '../data/caseData';
import './PhotoGalleryModal.css';

export default function PhotoGalleryModal({ isOpen, onClose, photos = GALLERY_PHOTOS, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setDirection(0);
    }
  }, [isOpen, initialIndex]);

  // Pause video when switching slides
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
    }
  }, [currentIndex]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos]);

  if (!isOpen) return null;

  const goNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const item = photos[currentIndex];
  const isVideo = item.type === 'video';

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="gallery-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="gallery-modal__bg" onClick={onClose} />
          <button className="gallery-modal__close" onClick={onClose} aria-label="Close gallery">×</button>

          {/* Left nav */}
          <button className="gallery-modal__nav gallery-modal__nav--left" onClick={goPrev} aria-label="Previous">
            ‹
          </button>

          {/* Stage */}
          <div className="gallery-modal__stage">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                className="gallery-modal__frame"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {isVideo ? (
                  <video
                    ref={videoRef}
                    className="gallery-modal__video"
                    src={item.src}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.label}
                    className="gallery-modal__img"
                    draggable={false}
                  />
                )}
                <div className="gallery-modal__caption">{item.label}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right nav */}
          <button className="gallery-modal__nav gallery-modal__nav--right" onClick={goNext} aria-label="Next">
            ›
          </button>

          {/* Counter */}
          <div className="gallery-modal__counter text-mono">
            {currentIndex + 1} / {photos.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
