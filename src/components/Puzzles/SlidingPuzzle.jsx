import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SlidingPuzzle.css';

const GRID = 3; // 3x3 = 8 tiles + 1 empty
const EMPTY_ID = GRID * GRID - 1; // 8

/** Generate solvable state by doing N random moves from solved */
function buildSolvable(moves = 80) {
  const tiles = Array.from({ length: GRID * GRID }, (_, i) => i);
  let emptyIdx = EMPTY_ID;

  for (let n = 0; n < moves; n++) {
    const row = Math.floor(emptyIdx / GRID);
    const col = emptyIdx % GRID;
    const neighbors = [];
    if (row > 0) neighbors.push(emptyIdx - GRID);
    if (row < GRID - 1) neighbors.push(emptyIdx + GRID);
    if (col > 0) neighbors.push(emptyIdx - 1);
    if (col < GRID - 1) neighbors.push(emptyIdx + 1);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIdx], tiles[pick]] = [tiles[pick], tiles[emptyIdx]];
    emptyIdx = pick;
  }
  return tiles;
}

function isSolved(tiles) {
  return tiles.every((t, i) => t === i);
}

export default function SlidingPuzzle({ onComplete }) {
  const [tiles, setTiles]         = useState(() => buildSolvable());
  const [moves, setMoves]         = useState(0);
  const [solved, setSolved]       = useState(false);
  const [imageOk, setImageOk]     = useState(false);
  const [tileSize, setTileSize]   = useState(100);
  const imgRef = useRef(null);
  const [imgAspect, setImgAspect] = useState(1); // width/height

  // Detect viewport size for responsive tile size
  useEffect(() => {
    const calc = () => {
      const maxW = Math.min(window.innerWidth - 64, 420);
      setTileSize(Math.floor(maxW / GRID));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const handleImageLoad = () => {
    setImageOk(true);
    if (imgRef.current) {
      setImgAspect(imgRef.current.naturalWidth / imgRef.current.naturalHeight);
    }
  };

  const move = useCallback((idx) => {
    if (solved) return;
    const emptyIdx = tiles.indexOf(EMPTY_ID);
    const row = Math.floor(idx / GRID), col = idx % GRID;
    const eRow = Math.floor(emptyIdx / GRID), eCol = emptyIdx % GRID;
    const adjacent = (Math.abs(row - eRow) + Math.abs(col - eCol)) === 1;
    if (!adjacent) return;

    const newTiles = [...tiles];
    [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
    setTiles(newTiles);
    setMoves(m => m + 1);

    if (isSolved(newTiles)) {
      setSolved(true);
      setTimeout(onComplete, 1500);
    }
  }, [tiles, solved, onComplete]);

  const boardW = tileSize * GRID;
  const boardH = tileSize * GRID;
  const gap = 3;

  // For the background image: we want to "cover" the square board
  // If image is wider than tall (landscape), we size by height and crop sides
  // background-size should cover the board square
  const bgSize = imgAspect >= 1
    ? `auto ${boardH}px`   // landscape: fit height, crop width
    : `${boardW}px auto`;  // portrait: fit width, crop height

  // Center the crop
  const bgPosBase = '50% 50%';

  // Each tile's background offset relative to its original position in the solved grid
  const tileBgPos = (tileId) => {
    const origCol = tileId % GRID;
    const origRow = Math.floor(tileId / GRID);
    // We need to shift background so that this tile shows the correct slice
    // Using percentage-based positioning for center-cropped images
    const xPct = origCol * (100 / (GRID - 1));
    const yPct = origRow * (100 / (GRID - 1));
    return `${xPct}% ${yPct}%`;
  };

  return (
    <div className="spuzzle">
      <div className="container">
        <div className="puzzle-header animate-fade-in-up">
          <span className="badge badge-red">🧩 FINAL STAGE — CLASSIFIED PHOTO RECOVERY</span>
          <h2 className="puzzle-title">Recover the Evidence Photo</h2>
          <p className="puzzle-desc">
            A classified photograph has been scrambled by the system.{' '}
            <em className="highlight">Rearrange the tiles</em> to restore the image
            and unlock the final vault.
          </p>
        </div>

        <div className="spuzzle__panel">
          {/* Preload image silently */}
          <img
            ref={imgRef}
            src="/assets/Puzzle.jpeg"
            alt=""
            className="spuzzle__preload"
            onLoad={handleImageLoad}
            onError={() => setImageOk(false)}
          />

          {/* Move counter */}
          <div className="spuzzle__info text-mono">
            <span>Moves: {moves}</span>
            {!imageOk && <span className="spuzzle__photo-hint">📷 Add Puzzle.jpeg to public/assets/</span>}
          </div>

          {/* Board — uses CSS Grid */}
          <div
            className={`spuzzle__board ${solved ? 'spuzzle__board--solved' : ''}`}
            style={{
              width: boardW + gap * (GRID - 1),
              height: boardH + gap * (GRID - 1),
              gridTemplateColumns: `repeat(${GRID}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${GRID}, ${tileSize}px)`,
              gap: `${gap}px`,
            }}
          >
            {tiles.map((tileId, gridPos) => {
              if (tileId === EMPTY_ID) {
                return (
                  <div key="empty" className="spuzzle__tile spuzzle__tile--empty" />
                );
              }
              return (
                <div
                  key={tileId}
                  className="spuzzle__tile"
                  style={{
                    backgroundImage: imageOk ? 'url(/assets/Puzzle.jpeg)' : 'none',
                    backgroundSize: imageOk ? `${boardW + gap * (GRID - 1)}px ${boardH + gap * (GRID - 1)}px` : undefined,
                    backgroundPosition: imageOk ? tileBgPos(tileId) : undefined,
                    backgroundColor: imageOk ? 'transparent' : `hsl(${(tileId * 40 + 320) % 360}, 50%, 42%)`,
                  }}
                  onClick={() => move(gridPos)}
                >
                  {!imageOk && (
                    <span className="spuzzle__tile-num">{tileId + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Solved overlay */}
          <AnimatePresence>
            {solved && (
              <motion.div
                className="spuzzle__solved-banner"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 250 } }}
              >
                <div className="animate-heartbeat" style={{ fontSize: '2.5rem' }}>💑</div>
                <div>Photo Restored! Solved in {moves} moves.</div>
                <div className="spuzzle__loading text-mono">Opening vault...</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shuffle button */}
          {!solved && (
            <button className="btn btn-ghost" onClick={() => { setTiles(buildSolvable()); setMoves(0); }}>
              🔀 Shuffle Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
