import { useId, useRef, useState } from 'react';
import type { TransformationItem } from '../types';
import { Picture } from './primitives';

/**
 * Comparador arrastrable (Pelos, Paz y Amor). Es un `input[type=range]` real,
 * por lo que funciona con teclado, gesto táctil y lector de pantalla.
 */
export function BeforeAfterSlider({ item }: { item: TransformationItem }) {
  const id = useId();
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <figure className="wf-ba wf-ba--slider">
      <div className="wf-ba__frame" ref={frameRef} style={{ '--wf-ba-pos': `${position}%` } as React.CSSProperties}>
        <div className="wf-ba__layer wf-ba__layer--after">
          <Picture image={item.after} />
          <span className="wf-ba__tag wf-ba__tag--after">Después</span>
        </div>
        <div className="wf-ba__layer wf-ba__layer--before">
          <Picture image={item.before} />
          <span className="wf-ba__tag wf-ba__tag--before">Antes</span>
        </div>
        <span className="wf-ba__handle" aria-hidden="true">
          <span className="wf-ba__grip" />
        </span>
        <label className="wf-sr-only" htmlFor={id}>
          Comparador de {item.petName}: desplaza para ver antes y después
        </label>
        <input
          id={id}
          className="wf-ba__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-valuetext={`${position} % de la imagen "después" visible`}
        />
      </div>
      <figcaption className="wf-ba__caption">
        <strong>{item.petName}</strong>
        {/* Sin raza ni servicio, el separador quedaba suelto: « · ». */}
        {[item.breed, item.serviceName].filter(Boolean).length > 0 ? (
          <span>{[item.breed, item.serviceName].filter(Boolean).join(' · ')}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * Comparación partida fija (Peludos & Co.): muestra ambas fotos a la vez, sin
 * control arrastrable, tal y como pide la referencia.
 */
export function BeforeAfterSplit({ item }: { item: TransformationItem }) {
  return (
    <figure className="wf-ba wf-ba--split">
      <div className="wf-ba__pair">
        <div className="wf-ba__half">
          <Picture image={item.before} />
          <span className="wf-ba__tag wf-ba__tag--before">Antes</span>
        </div>
        <div className="wf-ba__half">
          <Picture image={item.after} />
          <span className="wf-ba__tag wf-ba__tag--after">Después</span>
        </div>
      </div>
      <figcaption className="wf-ba__caption">
        <strong>{item.petName}</strong>
        {/* Sin raza ni servicio, el separador quedaba suelto: « · ». */}
        {[item.breed, item.serviceName].filter(Boolean).length > 0 ? (
          <span>{[item.breed, item.serviceName].filter(Boolean).join(' · ')}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
