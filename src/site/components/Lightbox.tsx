import { useEffect, useState } from 'react';
import type { ImageAsset } from '../types';
import { Icon } from './Icon';
import { Modal } from './Modal';

export interface LightboxEntry {
  id: string;
  image: ImageAsset | null;
  caption: string;
  meta?: string;
}

/** Lightbox con pie, anterior/siguiente, Escape y control de foco (vía Modal). */
export function Lightbox({
  entries,
  openId,
  onClose,
}: {
  entries: LightboxEntry[];
  openId: string | null;
  onClose: () => void;
}) {
  const [navigation, setNavigation] = useState({ openId: null as string | null, index: 0 });
  const requestedIndex = openId === null ? 0 : entries.findIndex((entry) => entry.id === openId);
  const index = navigation.openId === openId
    ? Math.min(navigation.index, Math.max(entries.length - 1, 0))
    : Math.max(requestedIndex, 0);
  const move = (next: number) => setNavigation({ openId, index: next });

  useEffect(() => {
    if (openId === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setNavigation({ openId, index: (index + 1) % entries.length });
      if (event.key === 'ArrowLeft') setNavigation({ openId, index: (index - 1 + entries.length) % entries.length });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openId, entries.length, index]);

  const current = entries[index];
  if (openId === null || !current) return null;

  return (
    <Modal open onClose={onClose} title={current.caption} size="lg">
      <div className="wf-lightbox">
        <button
          type="button"
          className="wf-lightbox__nav wf-lightbox__nav--prev"
          onClick={() => move((index - 1 + entries.length) % entries.length)}
          aria-label="Imagen anterior"
        >
          <Icon name="arrowLeft" size={22} />
        </button>
        {current.image ? (
          <img
            className="wf-lightbox__image"
            src={current.image.src}
            alt={current.image.alt}
            width={current.image.width}
            height={current.image.height}
          />
        ) : (
          <div className="wf-lightbox__blank" role="presentation" aria-hidden="true" />
        )}
        <button
          type="button"
          className="wf-lightbox__nav wf-lightbox__nav--next"
          onClick={() => move((index + 1) % entries.length)}
          aria-label="Imagen siguiente"
        >
          <Icon name="arrowRight" size={22} />
        </button>
      </div>
      <p className="wf-lightbox__caption">
        {current.meta ? <strong>{current.meta} · </strong> : null}
        {current.caption}
        <span className="wf-lightbox__counter">
          {' '}
          ({index + 1} de {entries.length})
        </span>
      </p>
    </Modal>
  );
}
