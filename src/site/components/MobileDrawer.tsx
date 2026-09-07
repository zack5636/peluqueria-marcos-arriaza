import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSite } from '../context';
import type { NavItem } from '../types';
import { Icon } from './Icon';

/**
 * Drawer de navegación móvil compartido: bloquea el scroll de fondo, cierra con
 * botón, Escape, clic exterior y selección, y devuelve el foco al disparador.
 */
export function MobileDrawer({
  open,
  onClose,
  items,
  activeId,
  triggerRef,
  tone = 'light',
  footer,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeId?: string | null;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  tone?: 'light' | 'dark';
  footer?: React.ReactNode;
}) {
  const { runCta, config } = useSite();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button, a')?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
      trigger?.focus({ preventScroll: true });
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div
      className={`wf-drawer wf-drawer--${tone}`}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="wf-drawer__panel" role="dialog" aria-modal="true" aria-label="Menú de navegación" ref={panelRef}>
        <div className="wf-drawer__head">
          <span className="wf-drawer__brand">{config.business.name}</span>
          <button type="button" className="wf-drawer__close" onClick={onClose} aria-label="Cerrar menú">
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav className="wf-drawer__nav" aria-label="Navegación principal (móvil)">
          <ul>
            {items
              .filter((item) => item.enabled)
              .map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={activeId === item.id ? 'is-active' : undefined}
                    aria-current={activeId === item.id ? 'page' : undefined}
                    onClick={() => {
                      onClose();
                      window.setTimeout(() => runCta(item.cta), 60);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
          </ul>
        </nav>
        <div className="wf-drawer__contact">
          <a href={`tel:${config.business.phone.replace(/\s/g, '')}`}>
            <Icon name="phone" size={16} /> {config.business.phone}
          </a>
          <a href={`mailto:${config.business.email}`}>
            <Icon name="mail" size={16} /> {config.business.email}
          </a>
          <span>
            <Icon name="pin" size={16} /> {config.business.address.line1}, {config.business.address.city}
          </span>
        </div>
        {footer ? <div className="wf-drawer__footer">{footer}</div> : null}
      </div>
    </div>,
    document.querySelector('.wf-site') ?? document.body,
  );
}
