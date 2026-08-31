import { useState } from 'react';
import './ImageWithFallback.css';

/**
 * ImageWithFallback — Shows the real image if it exists in /public/assets/
 * otherwise renders a beautiful styled placeholder.
 * When the user drops the file in with the correct name, it auto-shows on refresh.
 *
 * Props:
 *   src        — path like "/assets/left.jpg"
 *   alt        — image description (shown in placeholder)
 *   label      — short label shown in placeholder (e.g. "left.jpg")
 *   className  — extra CSS class
 *   style      — inline styles
 */
export default function ImageWithFallback({ src, alt, label, className = '', style = {}, ...rest }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`img-placeholder ${className}`} style={style} title={`Add ${label || alt} to public/assets/`}>
        <div className="img-placeholder__icon">📷</div>
        <div className="img-placeholder__name">{label || alt}</div>
        <div className="img-placeholder__hint">Add to public/assets/</div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
