/**
 * Estudio — quinta familia visual de peluquería canina.
 *
 * Las cuatro templates anteriores resuelven la página con tarjetas y usan la
 * fotografía como relleno de contenedor. Estudio parte del extremo contrario:
 *
 *  · **La tipografía compone.** El titular no acompaña a una foto: ocupa la
 *    pantalla y organiza la retícula. Los tamaños son grandes y el interlineado
 *    cerrado.
 *  · **El filete es el material.** Nada de sombras, nada de tarjetas
 *    redondeadas. La estructura se dibuja con líneas de un píxel.
 *  · **La fotografía puntúa.** Aparece en banda a sangre, recortada o como
 *    miniatura que se asoma al pasar el ratón. Nunca decora un hueco.
 *  · **Servicios como índice, no como catálogo de tarjetas.** Es la prueba de
 *    que la misma información comercial —nombre, descripción, duración, precio
 *    y acción— admite un lenguaje completamente distinto.
 *
 * Consume exactamente los mismos datos que el resto del nicho: `SiteConfig` sin
 * cambios, `BookingForm` real, `BeforeAfterSlider` real.
 */

import { useMemo, useRef, useState } from 'react';
import { useSite } from '../context';
import type { SectionComponent } from '../registry';
import { Container, CtaButton, Picture, SectionShell } from '../components/primitives';
import { Icon } from '../components/Icon';
import { MobileDrawer } from '../components/MobileDrawer';
import { BookingForm } from '../components/BookingForm';
import { BeforeAfterSlider } from '../components/BeforeAfter';
import { useStickyHeader } from '../hooks';

/** Numeración de dos cifras: el recurso que ordena toda la template. */
const num = (index: number) => String(index + 1).padStart(2, '0');

/* ========================================================================== */
/*  Cabecera                                                                  */
/* ========================================================================== */

/**
 * Filete superior, marca en versalitas y navegación numerada. La acción no es
 * un botón sólido sino un enlace subrayado: en un estudio, el botón grita.
 */
const Header: SectionComponent = () => {
  const { config, runCta } = useSite();
  const solid = useStickyHeader(40);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const items = config.navigation.items.filter((item) => item.enabled);

  return (
    <header className="es-header" data-solid={solid}>
      <Container className="es-header__inner">
        <button
          type="button"
          className="es-header__mark"
          onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}
        >
          {/* Ambas líneas son elementos reales: un nodo de texto suelto no
              forma su propia fila dentro de la rejilla y el descriptor
              acababa colocándose al lado del nombre. */}
          <span className="es-header__name">{config.business.name}</span>
          {config.business.descriptor ? (
            <span className="es-header__descriptor">{config.business.descriptor}</span>
          ) : null}
        </button>

        <nav className="es-header__nav" aria-label="Principal">
          {items.slice(0, 6).map((item, index) => (
            <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
              <i aria-hidden="true">{num(index)}</i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="es-header__actions">
          <button
            type="button"
            className="es-header__cta"
            onClick={() => runCta(config.navigation.primaryCta)}
          >
            {config.navigation.primaryCta.label}
          </button>
          <button
            type="button"
            className="es-header__burger"
            ref={burger}
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </Container>
      <MobileDrawer open={open} onClose={() => setOpen(false)} items={items} triggerRef={burger} />
    </header>
  );
};

/* ========================================================================== */
/*  Hero                                                                      */
/* ========================================================================== */

/**
 * El titular manda: ocupa dos tercios de la composición y se lee antes que
 * ninguna imagen. La fotografía entra después, recortada en banda ancha y baja,
 * como un corte de página. No hay rectángulo lateral.
 */
const Hero: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;
  const facts = hero.microBenefits.filter(Boolean).slice(0, 4);

  return (
    <SectionShell anchor={section.anchor} className="es-hero">
      <Container>
        <div className="es-hero__top">
          {config.business.tagline ? (
            <span className="es-hero__eyebrow" data-wf-entry="line-grow">
              {config.business.tagline}
            </span>
          ) : null}
          <h1 className="es-hero__title" data-wf-entry="mask-up">
            {hero.title}
          </h1>
        </div>

        <div className="es-hero__meta">
          <p data-wf-entry="mask-up">{hero.paragraph}</p>
          <div className="es-hero__actions" data-wf-entry="mask-up">
            <CtaButton cta={hero.primaryCta} variant="primary" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="link" /> : null}
          </div>
        </div>
      </Container>

      {hero.image ? (
        <div className="es-hero__cut" data-wf-entry="mask-right">
          <Picture image={hero.image} sizes="100vw" loading="eager" />
        </div>
      ) : null}

      {facts.length > 0 ? (
        <Container>
          <dl className="es-hero__facts">
            {facts.map((fact, index) => (
              <div key={fact.id} data-wf-entry="mask-up" style={{ ['--es-i' as string]: index }}>
                <dt>{num(index)}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      ) : null}
    </SectionShell>
  );
};

/* ========================================================================== */
/*  Servicios — índice editorial                                              */
/* ========================================================================== */

/**
 * Tabla, no tarjetas.
 *
 * Cada servicio es una fila: número, nombre, resumen, duración y precio
 * alineado a la derecha. Al pasar el ratón la fila se tiñe y **asoma la
 * miniatura** del servicio, que es la única aparición de fotografía aquí. La
 * fila entera es el disparador de la acción, de modo que el contrato comercial
 * —incluido el CTA— se mantiene sin dibujar un botón por fila.
 */
const Services: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const services = config.services
    .filter((service) => service.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;

  const heading = config.content.headings.services;
  const [active, setActive] = useState<string | null>(null);

  const priceOf = (service: (typeof services)[number]) =>
    service.priceFromEur !== null ? `${service.priceFromEur} €` : 'A consultar';

  return (
    <SectionShell anchor={section.anchor} className="es-services">
      <Container>
        <div className="es-sec-head">
          <span data-wf-entry="line-grow">{heading?.eyebrow || 'Servicios'}</span>
          <h2 data-wf-entry="mask-up">{heading?.title || 'Lo que hacemos'}</h2>
        </div>

        <div className="es-index" onMouseLeave={() => setActive(null)}>
          <div className="es-index__legend" aria-hidden="true">
            <span>Servicio</span>
            <span>Duración</span>
            <span>Desde</span>
          </div>

          <ul className="es-index__rows">
            {services.slice(0, 8).map((service, index) => (
              <li
                key={service.id}
                data-active={active === service.id}
                onMouseEnter={() => setActive(service.id)}
                data-wf-entry="mask-up"
                style={{ ['--es-i' as string]: index }}
              >
                <button type="button" onClick={() => runCta(config.navigation.primaryCta)}>
                  <i className="es-index__num" aria-hidden="true">{num(index)}</i>

                  <span className="es-index__name">
                    {service.name}
                    <em>{service.shortDescription}</em>
                  </span>

                  <span className="es-index__time">
                    {service.durationMinutes > 0 ? `${service.durationMinutes} min` : '—'}
                  </span>

                  <span className="es-index__price">{priceOf(service)}</span>

                  <span className="es-index__go" aria-hidden="true">
                    <Icon name="arrowRight" size={16} />
                  </span>
                </button>

                {/* Miniatura que se asoma: la fotografía como puntuación. */}
                {service.image ? (
                  <span className="es-index__peek" aria-hidden="true">
                    <Picture image={service.image} sizes="220px" />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  Resultados — antes y después a página completa                            */
/* ========================================================================== */

/**
 * Una sola comparación, grande, partida por el tirador. Sin marco y sin
 * tarjeta: la imagen llega al borde de la retícula y el índice de la derecha
 * permite cambiar de caso sin multiplicar comparadores pequeños.
 */
const Results: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = useMemo(
    () =>
      config.transformations
        .filter((item) => item.enabled && item.before && item.after)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [config.transformations],
  );
  const [current, setCurrent] = useState(0);
  if (items.length === 0) return null;

  const heading = config.content.headings.transformations;
  const item = items[Math.min(current, items.length - 1)]!;

  return (
    <SectionShell anchor={section.anchor} className="es-results" surface="dark">
      <Container>
        <div className="es-sec-head es-sec-head--inverse">
          <span data-wf-entry="line-grow">{heading?.eyebrow || 'Antes / Después'}</span>
          <h2 data-wf-entry="mask-up">{heading?.title || 'El trabajo, sin retoques'}</h2>
        </div>

        <div className="es-results__grid">
          <figure className="es-results__stage" data-wf-entry="mask-right">
            <BeforeAfterSlider item={item} />
          </figure>

          {items.length > 1 ? (
            <ol className="es-results__index">
              {items.slice(0, 6).map((entry, index) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    data-active={index === current}
                    onClick={() => setCurrent(index)}
                    aria-pressed={index === current}
                  >
                    <i aria-hidden="true">{num(index)}</i>
                    <span>{entry.petName}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  Galería — hoja de contactos                                               */
/* ========================================================================== */

/**
 * Archivo visual: retícula estricta, sin bordes redondeados, cada pieza con su
 * número de registro. Se parece a una hoja de contactos de laboratorio, no a
 * una colección de tarjetas.
 */
const Gallery: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.gallery
    .filter((item) => item.enabled && item.image)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  const heading = config.content.headings.gallery;

  return (
    <SectionShell anchor={section.anchor} className="es-archive">
      <Container>
        <div className="es-sec-head">
          <span data-wf-entry="line-grow">{heading?.eyebrow || 'Archivo'}</span>
          <h2 data-wf-entry="mask-up">{heading?.title || 'Trabajos recientes'}</h2>
        </div>

        <div className="es-archive__sheet">
          {items.slice(0, 8).map((item, index) => (
            <figure key={item.id} data-wf-entry="mask-up" style={{ ['--es-i' as string]: index }}>
              <Picture image={item.image!} sizes="(max-width: 720px) 45vw, 24vw" />
              <figcaption>
                <i aria-hidden="true">{num(index)}</i>
                {item.caption || item.serviceName}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  Opiniones — citas editoriales                                             */
/* ========================================================================== */

/**
 * Sin estrellas, sin avatar y sin tarjeta. Una cita manda a tamaño de titular y
 * las demás quedan en columnas de filete. La valoración numérica se conserva
 * como dato al pie, que es donde un estudio la pondría.
 */
const Testimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.testimonials
    .filter((item) => item.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  const [lead, ...rest] = items;
  const heading = config.content.headings.testimonials;
  const average = items.reduce((total, item) => total + item.rating, 0) / items.length;

  return (
    <SectionShell anchor={section.anchor} className="es-quotes" surface="alternative">
      <Container>
        <div className="es-sec-head">
          <span data-wf-entry="line-grow">{heading?.eyebrow || 'Opiniones'}</span>
        </div>

        <figure className="es-quotes__lead" data-wf-entry="mask-up">
          <blockquote>{lead!.text}</blockquote>
          <figcaption>
            <i aria-hidden="true">{num(0)}</i>
            {lead!.author}
          </figcaption>
        </figure>

        {rest.length > 0 ? (
          <div className="es-quotes__rest">
            {rest.slice(0, 3).map((item, index) => (
              <figure key={item.id} data-wf-entry="mask-up" style={{ ['--es-i' as string]: index }}>
                <blockquote>{item.text}</blockquote>
                <figcaption>
                  <i aria-hidden="true">{num(index + 1)}</i>
                  {item.author}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}

        <p className="es-quotes__score">
          Valoración media <strong>{average.toFixed(1)}</strong> sobre {items.length} opiniones
          verificadas.
        </p>
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  Reserva — formulario de papel                                             */
/* ========================================================================== */

/**
 * Nada de tarjeta elevada. Enunciado a la izquierda con los datos del salón en
 * filetes y, a la derecha, el formulario real del proyecto revestido con campos
 * de línea inferior.
 */
const Booking: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const business = config.business;
  const heading = config.content.headings.booking;

  return (
    <SectionShell anchor={section.anchor} className="es-booking">
      <Container className="es-booking__grid">
        <div className="es-booking__aside">
          <span className="es-booking__eyebrow" data-wf-entry="line-grow">
            {heading?.eyebrow || 'Reserva'}
          </span>
          <h2 data-wf-entry="mask-up">{heading?.title || 'Pide cita'}</h2>
          <p>{heading?.subtitle || 'Cuéntanos qué necesita tu perro y confirmamos el hueco.'}</p>

          <dl>
            {business.phone ? (
              <div>
                <dt>Teléfono</dt>
                <dd>{business.phone}</dd>
              </div>
            ) : null}
            {business.email ? (
              <div>
                <dt>Correo</dt>
                <dd>{business.email}</dd>
              </div>
            ) : null}
            {business.address.line1 ? (
              <div>
                <dt>Estudio</dt>
                <dd>
                  {business.address.line1}
                  <br />
                  {business.address.postalCode} {business.address.city}
                </dd>
              </div>
            ) : null}
            {business.openingHours.slice(0, 2).map((slot) => (
              <div key={slot.label}>
                <dt>{slot.label}</dt>
                <dd>{slot.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="es-booking__form" data-wf-entry="mask-up">
          <BookingForm layout="grid-2" submitLabel="Solicitar cita" />
        </div>
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  Pie                                                                       */
/* ========================================================================== */

/**
 * El pie cierra con la marca a tamaño de cartel. Es el último gesto
 * tipográfico y evita el bloque genérico de cuatro columnas grises.
 */
const Footer: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;
  const items = config.navigation.items.filter((item) => item.enabled);

  return (
    <footer className="es-footer" id={section.anchor}>
      <Container>
        <div className="es-footer__cols">
          <div>
            <h3>Contacto</h3>
            <p>{business.phone}</p>
            <p>{business.email}</p>
          </div>
          <div>
            <h3>Navegación</h3>
            {items.slice(0, 5).map((item) => (
              <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
                {item.label}
              </button>
            ))}
          </div>
          <div>
            <h3>Legal</h3>
            <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: '/aviso-legal' })}>
              Aviso legal
            </button>
            <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>
              Privacidad
            </button>
            <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>
              Cookies
            </button>
          </div>
          <div>
            <h3>Dónde</h3>
            <p>
              {business.address.line1}
              <br />
              {business.address.postalCode} {business.address.city}
            </p>
          </div>
        </div>

        <p className="es-footer__mark" aria-hidden="true">
          {business.name}
        </p>

        <p className="es-footer__legal">
          © {new Date().getFullYear()} {business.legalName}. {config.content.legal.copyrightNote}
        </p>
      </Container>
    </footer>
  );
};

/* -------------------------------------------------------------------------- */

export const ESTUDIO_SECTIONS: Record<string, SectionComponent> = {
  'es-header-01': Header,
  'es-hero-01': Hero,
  'es-services-01': Services,
  'es-results-01': Results,
  'es-gallery-01': Gallery,
  'es-testimonials-01': Testimonials,
  'es-booking-01': Booking,
  'es-footer-01': Footer,
};
