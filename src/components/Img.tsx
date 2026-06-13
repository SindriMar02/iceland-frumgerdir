import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'

interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Gradient shown if the remote image fails to load */
  fallbackClassName?: string
  /** Lowercase DOM attribute — React 18 has no camelCase fetchPriority prop */
  fetchpriority?: 'high' | 'low' | 'auto'
}

/**
 * Unsplash-backed image with a graceful gradient fallback so a dead
 * placeholder URL never breaks the prototype layout.
 */
export function Img({ className, fallbackClassName, alt = '', fetchpriority, ...rest }: ImgProps) {
  // One silent retry before surrendering to the gradient — a transient
  // network blip shouldn't cost the hero image for the whole session.
  const [attempt, setAttempt] = useState(0)
  const failed = attempt > 1

  if (failed) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`${className ?? ''} ${fallbackClassName ?? 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-700'}`}
      />
    )
  }

  return (
    <img
      key={attempt}
      loading="lazy"
      decoding="async"
      alt={alt}
      className={className}
      onError={() => setAttempt((a) => a + 1)}
      {...(fetchpriority ? { fetchpriority } : {})}
      {...rest}
    />
  )
}
