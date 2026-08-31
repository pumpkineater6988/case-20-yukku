import { useState } from 'react';
import { motion } from 'framer-motion';
import { VAULT_CODE } from '../../data/caseData';
import './VaultKeypad.css';

const KEYS = ['1','2','3','4','5','6','7','8','9','⌫','0','✓'];

export default function VaultKeypad({ onComplete }) {
  const [digits, setDigits] = useState('');
  const [shake, setShake]   = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'error' | 'success'

  const press = (key) => {
    if (status === 'success') return;
    if (key === '⌫') {
      setDigits(d => d.slice(0, -1));
      return;
    }
    if (key === '✓') {
      if (digits === VAULT_CODE) {
        setStatus('success');
        setTimeout(onComplete, 1200);
      } else {
        setShake(true);
        setStatus('error');
        setTimeout(() => { setShake(false); setStatus('idle'); setDigits(''); }, 700);
      }
      return;
    }
    if (digits.length >= 4) return;
    const newDigits = digits + key;
    setDigits(newDigits);
    if (newDigits.length === 4) {
      if (newDigits === VAULT_CODE) {
        setStatus('success');
        setTimeout(onComplete, 1200);
      } else {
        setShake(true);
        setStatus('error');
        setTimeout(() => { setShake(false); setStatus('idle'); setDigits(''); }, 700);
      }
    }
  };

  return (
    <div className="vault">
      <div className="container">
        <div className="puzzle-header animate-fade-in-up">
          <span className="badge badge-red">🔒 STAGE 04 — VAULT ACCESS</span>
          <h2 className="puzzle-title">Classified Vault</h2>
          <p className="puzzle-desc">
            Enter the <em className="highlight">4-digit clearance code</em> to access
            the Final Evidence Dossier. Authorized personnel only.
          </p>
        </div>

        <motion.div
          className={`vault__panel ${shake ? 'vault--shake' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Vault door decoration */}
          <div className="vault__door">
            <div className={`vault__dial ${status === 'success' ? 'vault__dial--open' : ''}`}>
              {status === 'success' ? '🔓' : '🔒'}
            </div>
            <div className="vault__door-bolts">
              {[0,1,2].map(i => (
                <div key={i} className={`vault__bolt ${status === 'success' ? 'vault__bolt--open' : ''}`} />
              ))}
            </div>
          </div>

          {/* Display */}
          <div className={`vault__display ${status === 'error' ? 'vault__display--error' : ''} ${status === 'success' ? 'vault__display--success' : ''}`}>
            {status === 'success' ? (
              <span style={{ color: '#81C784', letterSpacing: '0.1em' }}>ACCESS GRANTED ✓</span>
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className={`vault__digit ${i < digits.length ? 'vault__digit--filled' : ''}`}>
                  {i < digits.length ? '●' : '○'}
                </span>
              ))
            )}
          </div>

          {status === 'error' && (
            <div className="vault__error text-mono">⚠ INCORRECT CODE — TRY AGAIN</div>
          )}

          {/* Keypad */}
          <div className="vault__keypad">
            {KEYS.map(key => (
              <button
                key={key}
                className={`vault__key ${key === '✓' ? 'vault__key--confirm' : ''} ${key === '⌫' ? 'vault__key--back' : ''}`}
                onClick={() => press(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <p className="vault__hint text-mono">
            Hint: Two dates. Two people. One code. 💕
          </p>
        </motion.div>
      </div>
    </div>
  );
}
