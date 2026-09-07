import { useCallback, useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

/**
 * Carrusel manual: sin autoavance, operable con teclado, gesto táctil nativo
 * (scroll-snap) y botones visibles. Anuncia la posición sin ruido continuo.
 */
export function Carousel({
  items,
  visible = 1,
  label,
  className,
  showDots = true,
  renderItem,
}: {
  items: { id: string }[];
  visible?: number;
  label: string;
  className?: string;
  showDots?: boolean;
  renderItem: (item: { id: string }, index: number) => ReactNode;
}) {
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, items.length - visible);
  const activeIndex = Math.min(index, maxIndex);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), maxIndex);
      setIndex(clamped);
      const track = trackRef.current;
      if (!track) return;
      const child = track.children[clamped] as HTMLElement | undefined;
      if (child) {
        track.scrollTo({
          left: child.offsetLeft - track.offsetLeft,
          behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
      }
    },
    [maxIndex],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const showControls = items.length > visible;

  return (
    <div className={`wf-carousel${className ? ` ${className}` : ''}`} role="group" aria-roledescription="carrusel" aria-label={label}>
      <div
        ref={trackRef}
        className="wf-carousel__track"
        style={{ '--wf-carousel-visible': visible } as React.CSSProperties}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-live="polite"
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="wf-carousel__slide"
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${items.length}`}
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {showControls ? (
        <div className="wf-carousel__controls">
          <button
            type="button"
            className="wf-carousel__arrow"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-controls={id}
            aria-label={`Anterior de ${label}`}
          >
            <Icon name="arrowLeft" size={18} />
          </button>
          {showDots ? (
            <div className="wf-carousel__dots">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`wf-carousel__dot${i === activeIndex ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Ir a la posición ${i + 1} de ${maxIndex + 1}`}
                  aria-current={i === activeIndex}
                />
              ))}
            </div>
          ) : null}
          <button
            type="button"
            className="wf-carousel__arrow"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === maxIndex}
            aria-controls={id}
            aria-label={`Siguiente de ${label}`}
          >
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
