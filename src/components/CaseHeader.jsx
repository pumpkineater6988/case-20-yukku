import './CaseHeader.css';
import { CASE_INFO, STAGES } from '../data/caseData';

export default function CaseHeader({ completed, audio, onBoardClick }) {
  const doneCount = completed.filter(Boolean).length;
  const pct = Math.round((doneCount / STAGES.length) * 100);

  return (
    <header className="case-header">
      <div className="case-header__inner">
        {/* Left: case badge */}
        <button className="case-header__logo" onClick={onBoardClick} title="Back to Investigation Board">
          <span className="case-header__icon">🕵️</span>
          <div>
            <div className="case-header__code">{CASE_INFO.caseCode}</div>
            <div className="case-header__sub">Investigation Board</div>
          </div>
        </button>

        {/* Centre: progress */}
        <div className="case-header__progress-wrap">
          <div className="case-header__progress-label">
            <span className="badge badge-red">
              <span className="dot-pulse" />
              ACTIVE
            </span>
            <span className="case-header__pct">{pct}% COMPLETE</span>
          </div>
          <div className="case-header__progress-bar">
            <div
              className="case-header__progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Right: music toggle */}
        <div className="case-header__right">
          {audio.isAvailable && (
            <button
              className={`case-header__audio-btn ${audio.isPlaying ? 'playing' : ''}`}
              onClick={audio.toggle}
              title={audio.isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {audio.isPlaying ? '🔊' : '🔇'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
