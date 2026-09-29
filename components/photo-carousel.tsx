'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export type CarouselPhoto = {
  id: string;
  src: string;
  srcSet?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export function PhotoCarousel({
  photos,
  lang,
  children,
}: {
  photos: CarouselPhoto[];
  lang: 'en' | 'zh';
  children?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLElement>(null);
  const photo = photos[index];
  const change = (step: number) =>
    setIndex((current) => (current + step + photos.length) % photos.length);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || typeof window.matchMedia !== 'function') return;

    let motion: MediaQueryList | undefined;
    let frame = 0;
    let lastScale = '';

    const update = () => {
      frame = 0;
      const bounds = carousel.getBoundingClientRect();
      const documentTop = bounds.top + window.scrollY;
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(1, documentTop + bounds.height)),
      );
      // Transform the picture layer, leaving each image's existing crop intact.
      const scale = (1 + 0.03 * (1 - progress)).toFixed(5);
      if (scale !== lastScale) {
        carousel.style.setProperty('--cover-photo-scale', scale);
        lastScale = scale;
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const stop = () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastScale = '';
      carousel.style.removeProperty('--cover-photo-scale');
    };
    const syncMotion = () => {
      stop();
      if (!motion?.matches) return;
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      window.addEventListener('pageshow', schedule);
      update();
    };

    const cleanup = () => {
      stop();
      motion?.removeEventListener?.('change', syncMotion);
    };

    try {
      motion = window.matchMedia(
        '(min-width: 901px) and (prefers-reduced-motion: no-preference)',
      );
      motion.addEventListener('change', syncMotion);
      syncMotion();
    } catch {
      // An unavailable enhancement must leave the photograph at its CSS default.
      cleanup();
    }
    return cleanup;
  }, []);

  return (
    <figure
      ref={carouselRef}
      className="hero-figure photo-carousel"
      data-photo={photo.id}
      aria-roledescription={lang === 'en' ? 'carousel' : '轮播'}
      aria-label={lang === 'en' ? 'Personal photographs' : '个人照片'}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          change(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
    >
      <div className="portrait-frame">
        <div className="portrait-viewport">
          <picture key={photo.id}>
            {photo.srcSet && (
              <source
                type="image/webp"
                srcSet={photo.srcSet}
                sizes="(max-width: 640px) 100vw, 76vw"
              />
            )}
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              className={index === 0 ? undefined : 'carousel-added'}
            />
          </picture>
        </div>
      </div>
      {children}
      <figcaption className="cover-bottom container">
        <div className="cover-caption" aria-live="polite" aria-atomic="true">
          <span>{photo.caption}</span>
          <span>
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(photos.length).padStart(2, '0')}
          </span>
        </div>
        <div
          className="carousel-controls"
          role="group"
          aria-label={lang === 'en' ? 'Choose a photo' : '切换照片'}
        >
          <button
            type="button"
            onClick={() => change(-1)}
            aria-label={lang === 'en' ? 'Previous photo' : '上一张'}
            className="carousel-arrow"
          >
            ←
          </button>
          <div className="carousel-dots">
            {photos.map((item, position) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`${lang === 'en' ? 'Photo' : '照片'} ${position + 1}: ${item.caption}`}
                aria-pressed={index === position}
              >
                <span />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => change(1)}
            aria-label={lang === 'en' ? 'Next photo' : '下一张'}
            className="carousel-arrow"
          >
            →
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
