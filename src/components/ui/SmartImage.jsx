import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'

// Image with a shimmer while loading and a branded fallback if it fails.
export default function SmartImage({ src, alt, className = '', imgClassName = '', priority = false }) {
  const { t } = useLang()
  const [state, setState] = useState('loading')
  return (
    <div className={`relative overflow-hidden bg-navy-100 ${className}`}>
      {state === 'loading' && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-navy-100 to-teal-50" />}
      {state === 'error' ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy-800 to-teal-700 text-navy-100"
          role="img"
          aria-label={alt}
        >
          <ImageOff className="h-7 w-7 opacity-70" />
          <span className="text-xs opacity-80">{t('common.imageFallback')}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`h-full w-full object-cover transition-opacity duration-500 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  )
}
