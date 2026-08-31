import { useState, useEffect } from 'react';
import './IntroScreen.css';

const LINES = [
  '🔴  CLASSIFIED FILE DETECTED',
  '⠀',
  '  CASE CODE  :  #CASE-20-YUKKU',
  '  STATUS     :  TOP SECRET',
  '  CLEARANCE  :  EYES ONLY',
  '⠀',
  '  Lead Investigator : Agent Akkulu',
  '  Primary Suspect   : The Girl with the Cutest',
  '                      "Pongu Buggalu"',
  '⠀',
  '  MISSION OBJECTIVE :',
  '  Investigate classified evidence to uncover',
  '  the Ultimate Classified Secret Dossier.',
  '⠀',
  '⠀',
  '  >>> OPEN DOSSIER TO BEGIN <<<',
];

export default function IntroScreen({ onStart }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showBtn, setShowBtn]           = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= LINES.length) {
        clearInterval(iv);
        setTimeout(() => setShowBtn(true), 400);
      }
    }, 100);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="intro">
      {/* Scan line */}
      <div className="intro__scanline" />

      <div className="intro__terminal">
        <div className="intro__terminal-bar">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
          <span className="intro__terminal-title">CLASSIFIED_DOSSIER.exe</span>
        </div>

        <div className="intro__output">
          {LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="intro__line">
              {line === '⠀' ? <br /> : line}
              {i === visibleLines - 1 && <span className="intro__cursor">█</span>}
            </div>
          ))}
        </div>

        {showBtn && (
          <button
            className="btn btn-primary intro__cta animate-scale-in"
            onClick={onStart}
          >
            🗂️ &nbsp; Open Dossier
          </button>
        )}
      </div>

      {/* Corner decorations */}
      <div className="intro__corner intro__corner--tl">◤</div>
      <div className="intro__corner intro__corner--tr">◥</div>
      <div className="intro__corner intro__corner--bl">◣</div>
      <div className="intro__corner intro__corner--br">◢</div>
    </div>
  );
}
