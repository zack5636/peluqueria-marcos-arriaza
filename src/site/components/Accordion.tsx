import { useId, useState } from 'react';
import { Icon } from './Icon';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Acordeón accesible. `single` mantiene una sola respuesta abierta (Peludos
 * Felices); `multiple` permite varias y conserva el estado (Pelos, Paz y Amor).
 */
export function Accordion({
  items,
  mode = 'single',
  defaultOpenId,
  icon = 'plusminus',
  className,
}: {
  items: AccordionItem[];
  mode?: 'single' | 'multiple';
  defaultOpenId?: string;
  icon?: 'plusminus' | 'chevron';
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const isOpen = prev.includes(id);
      if (mode === 'single') return isOpen ? [] : [id];
      return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  return (
    <div className={`wf-accordion${className ? ` ${className}` : ''}`}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;
        return (
          <div key={item.id} className={`wf-accordion__item${isOpen ? ' is-open' : ''}`}>
            <h3 className="wf-accordion__h">
              <button
                type="button"
                id={buttonId}
                className="wf-accordion__button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.question}</span>
                {icon === 'plusminus' ? (
                  <Icon name={isOpen ? 'minus' : 'plus'} size={20} />
                ) : (
                  <Icon name="chevronDown" size={20} className="wf-accordion__chevron" />
                )}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="wf-accordion__panel"
              aria-hidden={!isOpen}
            >
              <div className="wf-accordion__panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
