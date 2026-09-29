'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export type CarouselPhoto = {
  id: string;
  src: string;
  srcSet?: string;
  sizes?: string;
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
  const [requested, setRequested] = useState(0);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const failedTarget = useRef(0);
  const carouselRef = useRef<HTMLElement>(null);
  const photo = photos[index];
  const choose = (position: number) => {
    setFailed(false);
    setRequested(position);
  };
  const change = (step: number) => {
    setFailed(false);
    setRequested((current) => (current + step + photos.length) % photos.length);
  };
  useEffect(() => {
    // The eager image can fail before hydration attaches its error handler.
    const initial = carouselRef.current?.querySelector('img');
    if (initial?.complete && initial.naturalWidth === 0) setFailed(true);
  }, []);
  useEffect(() => {
    if (requested === index && retry === 0) return;
    // Keep the current image, caption and selected dot together until the next
    // resource has decoded. Only a user-requested photograph is fetched.
    let cancelled = false;
    const next = photos[requested];
    const image = new Image();
    const fail = () => {
      if (cancelled) return;
      cancelled = true;
      failedTarget.current = requested;
      setFailed(true);
      setRequested(index);
      setRetry(0);
    };
    const timer = window.setTimeout(fail, 12000);
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        fail();
        return;
      }
      if (cancelled) return;
      window.clearTimeout(timer);
      setIndex(requested);
      setFailed(false);
      setRetry(0);
    };
    image.onerror = fail;
    if (next.srcSet) {
      image.sizes = next.sizes ?? '(max-width: 900px) 100vw, 76vw';
      image.srcset = next.srcSet;
    }
    image.src = next.src;
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
    };
  }, [requested, index, photos, retry]);

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
    >
      <div className="portrait-frame">
        <div className="portrait-viewport">
          <picture key={`${photo.id}-${retry}`}>
            {photo.srcSet && (
              <source
                type="image/webp"
                srcSet={photo.srcSet}
                sizes={photo.sizes ?? '(max-width: 900px) 100vw, 76vw'}
              />
            )}
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading="eager"
              decoding="async"
              className={index === 0 ? undefined : 'carousel-added'}
              onError={() => {
                failedTarget.current = index;
                setFailed(true);
              }}
            />
          </picture>
        </div>
      </div>
      <svg
        className="cover-network"
        viewBox="0 0 164 74"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <g className="cover-network-full">
          <path d="M8 43 31 14 80 28 112 8 156 30 128 60 80 28 53 58 8 43" />
          {[
            [8, 43],
            [31, 14],
            [53, 58],
            [112, 8],
            [128, 60],
            [156, 30],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
          ))}
          <circle className="cover-network-accent" cx="80" cy="28" r="4" />
        </g>
        <g className="cover-network-mobile">
          <path d="M12 24 82 54 148 18" />
          <circle cx="12" cy="24" r="5" />
          <circle className="cover-network-accent" cx="82" cy="54" r="5" />
          <circle cx="148" cy="18" r="5" />
        </g>
      </svg>
      {children}
      <div
        className="carousel-status container"
        role="status"
        aria-live="polite"
      >
        {failed ? (
          <>
            <span>
              {lang === 'en'
                ? 'Photo could not load. Try again or choose another.'
                : '照片加载失败，请重试或选择其他照片。'}
            </span>
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setRequested(failedTarget.current);
                setRetry((value) => value + 1);
              }}
            >
              {lang === 'en' ? 'Retry' : '重试'}
            </button>
          </>
        ) : requested !== index ? (
          lang === 'en' ? (
            'Loading photo…'
          ) : (
            '照片加载中…'
          )
        ) : null}
      </div>
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
          aria-busy={requested !== index}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              change(event.key === 'ArrowLeft' ? -1 : 1);
            }
          }}
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
                onClick={() => choose(position)}
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
