'use client';

import { useState, type ReactNode } from 'react';

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
  const photo = photos[index];
  const change = (step: number) =>
    setIndex((current) => (current + step + photos.length) % photos.length);
  return (
    <figure
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
