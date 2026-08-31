import { motion } from 'framer-motion';
import { STAGES, EVIDENCE_CARDS } from '../data/caseData';
import './InvestigationBoard.css';

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  }),
};

export default function InvestigationBoard({ completed, stageUnlocked, onPlayStage }) {
  return (
    <div className="board">
      <div className="container">
        {/* Header */}
        <div className="board__header animate-fade-in-up">
          <div className="badge badge-red" style={{ marginBottom: 12 }}>
            🔴 ACTIVE INVESTIGATION
          </div>
          <h1 className="board__title">Investigation Board</h1>
          <p className="board__subtitle">
            Complete all 4 stages to unlock the classified secret vault.
          </p>
        </div>

        {/* Stage Cards */}
        <div className="board__grid">
          {STAGES.map((stage, i) => {
            const isUnlocked  = stageUnlocked(i);
            const isDone      = completed[i];
            const isAvailable = isUnlocked && !isDone;

            return (
              <motion.div
                key={stage.id}
                className={`stage-card ${isDone ? 'stage-card--done' : ''} ${isAvailable ? 'stage-card--available' : ''} ${!isUnlocked ? 'stage-card--locked' : ''}`}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                {/* Top row */}
                <div className="stage-card__top">
                  <span className="badge badge-red stage-card__badge">{stage.badge}</span>
                  {isDone && <span className="badge badge-green">✓ CLEARED</span>}
                  {!isUnlocked && <span className="badge" style={{background:'rgba(255,255,255,0.05)',color:'var(--text-muted)',border:'1px solid rgba(255,255,255,0.1)'}}>🔒 LOCKED</span>}
                </div>

                {/* Icon & title */}
                <div className="stage-card__body">
                  <div className="stage-card__icon">{stage.icon}</div>
                  <div>
                    <div className="stage-card__code text-mono">{stage.code}</div>
                    <h3 className="stage-card__title">{stage.title}</h3>
                    <p className="stage-card__subtitle">{stage.subtitle}</p>
                    <p className="stage-card__desc">{stage.description}</p>
                  </div>
                </div>

                {/* Evidence preview (if done) */}
                {isDone && EVIDENCE_CARDS[i] && (
                  <div className="stage-card__evidence">
                    <div className="evidence-mini">
                      {EVIDENCE_CARDS[i].lines.slice(0, 2).map((l, j) => (
                        <div key={j} className="evidence-mini__row">
                          <span className="evidence-mini__label">{l.label}</span>
                          <span className="evidence-mini__value">{l.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                {isAvailable && (
                  <button
                    className="btn btn-primary stage-card__btn"
                    onClick={() => onPlayStage(stage.id)}
                  >
                    🔍 Begin Investigation
                  </button>
                )}
                {isDone && (
                  <button
                    className="btn btn-ghost stage-card__btn"
                    onClick={() => onPlayStage(stage.id)}
                  >
                    📂 Review Evidence
                  </button>
                )}
                {!isUnlocked && (
                  <div className="stage-card__locked-hint">
                    Complete Stage {stage.id - 1} to unlock
                  </div>
                )}

                {/* Number watermark */}
                <div className="stage-card__watermark">{stage.id}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer hint */}
        <motion.p
          className="board__footer-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          🔐 All 4 stages cleared → Vault Access Unlocked
        </motion.p>
      </div>
    </div>
  );
}
