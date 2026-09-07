/**
 * Tres familias visuales separadas: Premium, Minimalista y Convencional.
 *
 * No son la misma composición con otra paleta. Cada familia tiene su propia
 * estructura, proporciones, jerarquía y tratamiento de imagen, tomando como
 * referencia lo que da personalidad a las plantillas históricas de Web Factory:
 *
 *  · **Premium** — la fotografía manda. Hero a sangre con velo, titular en
 *    display sobre la imagen, servicios en filas editoriales alternadas con
 *    numeración grande. Composición asimétrica y aire intencionado.
 *
 *  · **Minimalista** — el tipo manda. Hero sin fotografía dominante: titular
 *    enorme en rejilla, filete, un chip de imagen desplazado y una fila de
 *    datos. Servicios como tabla con separadores finos y precio a la derecha.
 *
 *  · **Convencional** — la conversión manda. Hero partido 50/50 con lista de
 *    ventajas y doble llamada, barra de confianza debajo, servicios en tarjetas
 *    de tres con precio y acción propia.
 *
 * Ninguna se mezcla con otra: cada variante declara un único `visualProfiles`.
 */

import { useSite } from '../../context';
import type { SectionComponent } from '../../registry';
import { Container, CtaButton, IconBadge, Picture, SectionShell, StarRating } from '../../components/primitives';
import { Icon } from '../../components/Icon';
import { Accordion } from '../../components/Accordion';
import { MobileDrawer } from '../../components/MobileDrawer';
import { useStickyHeader } from '../../hooks';
import { useRef, useState } from 'react';

/**
 * ¿Aporta algo la línea secundaria, o repite la principal?
 *
 * Mientras no haya redactor, la descripción de una ventaja es literalmente su
 * título. El contrato de la variante exige que exista, pero pintarla debajo en
 * gris hace que la web parezca rota. Se compara sin distinguir tildes ni
 * puntuación final porque el eco puede llegar con una coma de más.
 */
function sinEco(principal: string, secundaria: string | undefined): boolean {
  if (!secundaria) return false;
  const limpiar = (texto: string) =>
    texto
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  return limpiar(principal) !== limpiar(secundaria);
}

/* ========================================================================== */
/*  PREMIUM                                                                   */
/* ========================================================================== */

/** Cabecera translúcida que se integra en la fotografía del hero. */
const PremiumHeader: SectionComponent = () => {
  const { config, runCta } = useSite();
  const solid = useStickyHeader(60);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const items = config.navigation.items.filter((item) => item.enabled);

  return (
    <header className="pf2-header" data-solid={solid}>
      <Container className="pf2-header__inner">
        <button type="button" className="pf2-header__mark" onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}>
          {config.business.name}
        </button>
        <nav className="pf2-header__nav" aria-label="Principal">
          {items.slice(0, 6).map((item) => (
            <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pf2-header__actions">
          <CtaButton cta={config.navigation.primaryCta} variant="primary" size="sm" />
          <button type="button" className="pf2-header__burger" ref={burger} onClick={() => setOpen(true)} aria-label="Abrir menú">
            <Icon name="menu" size={20} />
          </button>
        </div>
      </Container>
      <MobileDrawer open={open} onClose={() => setOpen(false)} items={items} triggerRef={burger} />
    </header>
  );
};

/** Hero a sangre: la imagen ocupa la pantalla y el texto vive encima. */
const PremiumHero: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;

  return (
    <SectionShell anchor={section.anchor} className="pf2-hero" surface="image">
      <div className="pf2-hero__media">
        {hero.image ? <Picture image={hero.image} sizes="100vw" loading="eager" /> : null}
        <span className="pf2-hero__veil" aria-hidden="true" />
      </div>
      <Container className="pf2-hero__inner">
        <div className="pf2-hero__copy" data-wf-entry="reveal-up">
          {config.business.tagline ? <span className="pf2-hero__eyebrow">{config.business.tagline}</span> : null}
          <h1>{hero.title}</h1>
          <span className="pf2-hero__rule" aria-hidden="true" />
          <p>{hero.paragraph}</p>
          <div className="pf2-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" size="lg" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="ghost" size="lg" /> : null}
          </div>
        </div>
        {hero.microBenefits.length > 0 ? (
          <ul className="pf2-hero__marks">
            {hero.microBenefits.slice(0, 3).map((benefit) => (
              <li key={benefit.id}>{benefit.label}</li>
            ))}
          </ul>
        ) : null}
      </Container>
    </SectionShell>
  );
};

/** Servicios como filas editoriales alternadas con numeración grande. */
const PremiumServices: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const services = config.services.filter((service) => service.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;
  const heading = config.content.headings.services;

  return (
    <SectionShell anchor={section.anchor} className="pf2-services">
      <Container>
        <div className="pf2-section-head">
          <span>{heading?.eyebrow || 'Servicios'}</span>
          <h2>{heading?.title || 'Lo que hacemos'}</h2>
        </div>
        <div className="pf2-services__rows">
          {services.slice(0, 5).map((service, index) => (
            <article key={service.id} className="pf2-row" data-flip={index % 2 === 1} data-wf-entry="blur-in">
              <div className="pf2-row__media" data-wf-media-frame>
                {service.image ? (
                  <Picture image={service.image} sizes="(max-width: 900px) 90vw, 45vw" />
                ) : (
                  <span className="pf2-row__num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                )}
              </div>
              <div className="pf2-row__body">
                <span className="pf2-row__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.name}</h3>
                <p>{service.shortDescription}</p>
                {service.includes.length > 0 ? (
                  <ul>
                    {service.includes.slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {service.priceFromEur !== null ? (
                  <span className="pf2-row__price">Desde {service.priceFromEur} €</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Cierre editorial sobre superficie oscura. */
const PremiumFinalCta: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const cta = config.content.finalCta;

  return (
    <SectionShell anchor={section.anchor} className="pf2-final" surface="dark">
      <Container className="pf2-final__inner">
        <div data-wf-entry="rise">
          <h2>{cta.title}</h2>
          {cta.subtitle ? <p>{cta.subtitle}</p> : null}
        </div>
        <CtaButton cta={cta.cta} variant="primary" size="lg" />
      </Container>
    </SectionShell>
  );
};

const PremiumFooter: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;

  return (
    <footer className="pf2-footer" id={section.anchor}>
      <Container>
        <div className="pf2-footer__top">
          <span className="pf2-footer__mark">{business.name}</span>
          <p>{business.tagline}</p>
        </div>
        <div className="pf2-footer__cols">
          <div>
            <h3>Contacto</h3>
            <p>{business.phone}</p>
            <p>{business.email}</p>
            {business.address.city ? <p>{business.address.line1}, {business.address.city}</p> : null}
            {business.serviceArea ? <p>{business.serviceArea}</p> : null}
          </div>
          <div>
            <h3>Horario</h3>
            {business.openingHours.slice(0, 4).map((entry) => (
              <p key={entry.label}>{entry.label}: {entry.value}</p>
            ))}
          </div>
          <div>
            <h3>Legal</h3>
            <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: '/aviso-legal' })}>Aviso legal</button>
            <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>Privacidad</button>
            <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>Cookies</button>
          </div>
        </div>
        <p className="pf2-footer__legal">© {new Date().getFullYear()} {business.legalName}. {config.content.legal.copyrightNote}</p>
      </Container>
    </footer>
  );
};

/* ========================================================================== */
/*  MINIMALISTA                                                               */
/* ========================================================================== */

const MinimalHeader: SectionComponent = () => {
  const { config, runCta } = useSite();
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const items = config.navigation.items.filter((item) => item.enabled);

  return (
    <header className="mn2-header">
      <Container className="mn2-header__inner">
        <button type="button" className="mn2-header__mark" onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}>
          {config.business.name}
        </button>
        <nav aria-label="Principal">
          {items.slice(0, 6).map((item) => (
            <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button type="button" className="mn2-header__cta" onClick={() => runCta(config.navigation.primaryCta)}>
          {config.navigation.primaryCta.label}
          <Icon name="arrowRight" size={14} />
        </button>
        <button type="button" className="mn2-header__burger" ref={burger} onClick={() => setOpen(true)} aria-label="Abrir menú">
          <Icon name="menu" size={20} />
        </button>
      </Container>
      <MobileDrawer open={open} onClose={() => setOpen(false)} items={items} triggerRef={burger} />
    </header>
  );
};

/**
 * Hero dirigido por la tipografía: titular grande en rejilla, filete, un chip
 * de imagen desplazado y una fila de datos. Sin fotografía dominante, pero sin
 * huecos muertos.
 */
const MinimalHero: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;
  const facts = hero.microBenefits.slice(0, 3);

  return (
    <SectionShell anchor={section.anchor} className="mn2-hero">
      <Container className="mn2-hero__grid">
        <div className="mn2-hero__copy" data-wf-entry="fade">
          <h1>{hero.title}</h1>
          <p>{hero.paragraph}</p>
          <div className="mn2-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="ghost" /> : null}
          </div>
        </div>
        {hero.image ? (
          <div className="mn2-hero__chip" data-wf-entry="fade-down">
            <Picture image={hero.image} sizes="(max-width: 900px) 90vw, 34vw" />
          </div>
        ) : null}
      </Container>
      {facts.length > 0 ? (
        <Container>
          <dl className="mn2-hero__facts">
            {facts.map((fact) => (
              <div key={fact.id}>
                <dt>{fact.label}</dt>
                {sinEco(fact.label, fact.description) ? <dd>{fact.description}</dd> : null}
              </div>
            ))}
          </dl>
        </Container>
      ) : null}
    </SectionShell>
  );
};

/** Servicios como tabla: filete, nombre, resumen y precio alineado. */
const MinimalServices: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const services = config.services.filter((service) => service.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;
  const heading = config.content.headings.services;

  return (
    <SectionShell anchor={section.anchor} className="mn2-services" surface="alternative">
      <Container>
        <div className="mn2-section-head">
          <h2>{heading?.title || 'Servicios'}</h2>
          {heading?.subtitle ? <p>{heading.subtitle}</p> : null}
        </div>
        <ul className="mn2-services__table">
          {services.map((service) => (
            <li key={service.id} data-wf-entry="fade-up">
              <button type="button" onClick={() => runCta(config.navigation.primaryCta)}>
                <span className="mn2-services__name">{service.name}</span>
                <span className="mn2-services__desc">{service.shortDescription}</span>
                <span className="mn2-services__price">
                  {service.priceFromEur !== null ? `${service.priceFromEur} €` : 'A consultar'}
                </span>
                <Icon name="arrowRight" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

const MinimalFinalCta: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const cta = config.content.finalCta;

  return (
    <SectionShell anchor={section.anchor} className="mn2-final">
      <Container className="mn2-final__inner">
        <h2>{cta.title}</h2>
        <CtaButton cta={cta.cta} variant="primary" />
      </Container>
    </SectionShell>
  );
};

const MinimalFooter: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;

  return (
    <footer className="mn2-footer" id={section.anchor}>
      <Container className="mn2-footer__inner">
        <div>
          <span className="mn2-footer__mark">{business.name}</span>
          <p>{business.phone} · {business.email}</p>
        </div>
        <div className="mn2-footer__links">
          <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: '/aviso-legal' })}>Aviso legal</button>
          <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>Privacidad</button>
          <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>Cookies</button>
        </div>
      </Container>
      <Container>
        <p className="mn2-footer__legal">© {new Date().getFullYear()} {business.legalName}</p>
      </Container>
    </footer>
  );
};

/* ========================================================================== */
/*  CONVENCIONAL                                                              */
/* ========================================================================== */

/** Cabecera de dos filas: barra de utilidad arriba, navegación y CTA abajo. */
const ConventionalHeader: SectionComponent = () => {
  const { config, runCta } = useSite();
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const items = config.navigation.items.filter((item) => item.enabled);
  const business = config.business;

  return (
    <header className="cv2-header">
      <div className="cv2-header__utility">
        <Container className="cv2-header__utility-inner">
          <button type="button" onClick={() => runCta({ label: business.phone, kind: 'tel', target: business.phone })}>
            <Icon name="phone" size={14} /> {business.phone}
          </button>
          {business.openingHours[0] ? (
            <span>{business.openingHours[0].label}: {business.openingHours[0].value}</span>
          ) : null}
          {business.serviceArea ? <span>{business.serviceArea}</span> : null}
        </Container>
      </div>
      <div className="cv2-header__main">
        <Container className="cv2-header__main-inner">
          <button type="button" className="cv2-header__mark" onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}>
            {business.name}
          </button>
          <nav aria-label="Principal">
            {items.slice(0, 6).map((item) => (
              <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
                {item.label}
              </button>
            ))}
          </nav>
          <CtaButton cta={config.navigation.primaryCta} variant="primary" />
          <button type="button" className="cv2-header__burger" ref={burger} onClick={() => setOpen(true)} aria-label="Abrir menú">
            <Icon name="menu" size={20} />
          </button>
        </Container>
      </div>
      <MobileDrawer open={open} onClose={() => setOpen(false)} items={items} triggerRef={burger} />
    </header>
  );
};

/** Hero partido: copy con ventajas y doble acción, tarjeta de imagen al lado. */
const ConventionalHero: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;
  const benefits = hero.microBenefits.slice(0, 4);

  return (
    <SectionShell anchor={section.anchor} className="cv2-hero">
      <Container className="cv2-hero__grid">
        <div className="cv2-hero__copy" data-wf-entry="slide-right">
          <h1>{hero.title}</h1>
          <p>{hero.paragraph}</p>
          {benefits.length > 0 ? (
            <ul className="cv2-hero__benefits">
              {benefits.map((benefit) => (
                <li key={benefit.id}>
                  <Icon name="check" size={16} /> {benefit.label}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="cv2-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" size="lg" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="secondary" size="lg" /> : null}
          </div>
        </div>
        <div className="cv2-hero__media" data-wf-entry="zoom-in">
          {hero.image ? <Picture image={hero.image} sizes="(max-width: 900px) 90vw, 45vw" /> : null}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Barra de confianza: cifras y garantías, siempre debajo del hero. */
const ConventionalTrust: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const benefits = config.content.benefits.filter((benefit) => benefit.enabled).slice(0, 4);
  if (benefits.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="cv2-trust" surface="brand">
      <Container>
        <ul className="cv2-trust__row">
          {benefits.map((benefit) => (
            <li key={benefit.id} data-wf-entry="fade-up">
              <Icon name="shield" size={20} />
              <strong>{benefit.title}</strong>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

/** Servicios en tarjetas de tres, con precio y acción propia. */
const ConventionalServices: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const services = config.services.filter((service) => service.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;
  const heading = config.content.headings.services;

  return (
    <SectionShell anchor={section.anchor} className="cv2-services" surface="alternative">
      <Container>
        <div className="cv2-section-head">
          <h2>{heading?.title || 'Nuestros servicios'}</h2>
          <p>{heading?.subtitle || 'Elige el que necesitas y reserva en un minuto.'}</p>
        </div>
        <div
          className="cv2-services__grid"
          data-wf-card-row
          data-wf-card-aligned="true"
          style={{ ['--wf-card-row-columns' as string]: 3 }}
        >
          {services.slice(0, 6).map((service) => (
            <article key={service.id} data-wf-card data-wf-entry="fade-up">
              {/* La banda de imagen se pinta siempre, con foto o sin ella: si una
                  tarjeta se la salta, su texto sube y la fila deja de alinearse. */}
              <div data-wf-card-media className="cv2-services__media" data-empty={!service.image}>
                {service.image ? (
                  <Picture image={service.image} sizes="(max-width: 720px) 90vw, 30vw" />
                ) : (
                  <Icon name="sparkle" size={28} />
                )}
              </div>
              <div data-wf-card-body>
                <h3>{service.name}</h3>
                <p>{service.shortDescription}</p>
                {service.includes.length > 0 ? (
                  <ul>
                    {service.includes.slice(0, 3).map((item) => (
                      <li key={item}>
                        <Icon name="check" size={13} /> {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div data-wf-card-actions className="cv2-services__actions">
                {service.priceFromEur !== null ? <strong>Desde {service.priceFromEur} €</strong> : <strong>A consultar</strong>}
                <button type="button" className="wf-btn wf-btn--primary wf-btn--sm" data-wf-button onClick={() => runCta(config.navigation.primaryCta)}>
                  {config.navigation.primaryCta.label}
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

const ConventionalFinalCta: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const cta = config.content.finalCta;
  const business = config.business;

  return (
    <SectionShell anchor={section.anchor} className="cv2-final" surface="brand">
      <Container className="cv2-final__inner">
        <div>
          <h2>{cta.title}</h2>
          {cta.subtitle ? <p>{cta.subtitle}</p> : null}
        </div>
        <div className="cv2-final__actions">
          <CtaButton cta={cta.cta} variant="secondary" size="lg" />
          <button type="button" className="cv2-final__phone" onClick={() => window.open(`tel:${business.phone}`)}>
            <Icon name="phone" size={18} /> {business.phone}
          </button>
        </div>
      </Container>
    </SectionShell>
  );
};

const ConventionalFooter: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;
  const items = config.navigation.items.filter((item) => item.enabled);

  return (
    <footer className="cv2-footer" id={section.anchor}>
      <Container className="cv2-footer__cols">
        <div>
          <span className="cv2-footer__mark">{business.name}</span>
          <p>{business.tagline}</p>
          <p className="cv2-footer__contact">
            <Icon name="phone" size={14} /> {business.phone}
          </p>
          <p className="cv2-footer__contact">{business.email}</p>
        </div>
        <div>
          <h3>Navegación</h3>
          {items.slice(0, 6).map((item) => (
            <button key={item.id} type="button" onClick={() => runCta(item.cta)}>{item.label}</button>
          ))}
        </div>
        <div>
          <h3>Dónde estamos</h3>
          {business.address.city ? <p>{business.address.line1}</p> : null}
          {business.address.city ? <p>{business.address.postalCode} {business.address.city}</p> : null}
          {business.serviceArea ? <p>{business.serviceArea}</p> : null}
        </div>
        <div>
          <h3>Legal</h3>
          <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: '/aviso-legal' })}>Aviso legal</button>
          <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>Privacidad</button>
          <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>Cookies</button>
        </div>
      </Container>
      <div className="cv2-footer__legal">
        <Container>
          <p>© {new Date().getFullYear()} {business.legalName}. {config.content.legal.copyrightNote}</p>
        </Container>
      </div>
    </footer>
  );
};

/* ========================================================================== */
/*  SEGUNDA ONDA: el cuerpo de la página                                      */
/* ========================================================================== */
/*
 * La primera onda cubrió la columna vertebral —cabecera, hero, servicios,
 * cierre y pie—. Sin esta segunda, el centro de las tres propuestas seguía
 * saliendo de la misma biblioteca compartida y volvía a igualarlas justo donde
 * el cliente pasa más tiempo mirando.
 *
 * También cubre los dos huecos que dejó al descubierto la retirada del tier
 * `basic`: `contact` y `faq` se quedaron literalmente sin una sola variante
 * utilizable en los cuatro nichos.
 */

/* ------------------------------- PREMIUM ---------------------------------- */

/** Proceso en escalera: cada paso baja un peldaño respecto al anterior. */
const PremiumProcess: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const steps = config.content.processSteps.filter((step) => step.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (steps.length === 0) return null;
  const heading = config.content.headings.process;

  return (
    <SectionShell anchor={section.anchor} className="pf2-process" surface="alternative">
      <Container>
        <div className="pf2-section-head">
          <span>{heading?.eyebrow || 'Cómo trabajamos'}</span>
          <h2>{heading?.title || 'El proceso, paso a paso'}</h2>
        </div>
        <ol className="pf2-process__stair">
          {steps.slice(0, 5).map((step, index) => (
            <li key={step.id} style={{ ['--pf2-step' as string]: index }} data-wf-entry="reveal-up">
              <span className="pf2-process__num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
};

/** Una sola reseña a gran tamaño, tratada como cita editorial. */
const PremiumTestimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const list = config.testimonials.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (list.length === 0) return null;
  const [lead, ...rest] = list;

  return (
    <SectionShell anchor={section.anchor} className="pf2-quotes" surface="dark">
      <Container>
        <figure className="pf2-quotes__lead" data-wf-entry="blur-in">
          <blockquote>{lead!.text}</blockquote>
          <figcaption>
            <StarRating rating={lead!.rating} size={14} />
            <span>{lead!.author}</span>
          </figcaption>
        </figure>
        {rest.length > 0 ? (
          <ul className="pf2-quotes__rest">
            {rest.slice(0, 2).map((item) => (
              <li key={item.id} data-wf-entry="fade-up">
                <p>{item.text}</p>
                <span>{item.author}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </SectionShell>
  );
};

/** Galería en mosaico irregular: la primera imagen ocupa el doble. */
const PremiumGallery: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.gallery.filter((item) => item.enabled && item.image).sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;
  const heading = config.content.headings.gallery;

  return (
    <SectionShell anchor={section.anchor} className="pf2-gallery">
      <Container>
        <div className="pf2-section-head">
          <span>{heading?.eyebrow || 'Trabajos'}</span>
          <h2>{heading?.title || 'Una muestra'}</h2>
        </div>
        <div className="pf2-gallery__mosaic">
          {items.slice(0, 7).map((item, index) => (
            <figure key={item.id} data-wide={index === 0} data-wf-entry="fade" data-wf-media-frame>
              <Picture image={item.image!} sizes={index === 0 ? '(max-width: 900px) 90vw, 60vw' : '(max-width: 900px) 45vw, 28vw'} />
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Preguntas en dos columnas: enunciado a la izquierda, acordeón a la derecha. */
const PremiumFaq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const faqs = config.faqs.filter((faq) => faq.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (faqs.length === 0) return null;
  const heading = config.content.headings.faq;

  return (
    <SectionShell anchor={section.anchor} className="pf2-faq">
      <Container className="pf2-faq__grid">
        <div className="pf2-faq__aside">
          <span>{heading?.eyebrow || 'Dudas'}</span>
          <h2>{heading?.title || 'Antes de empezar'}</h2>
          {heading?.subtitle ? <p>{heading.subtitle}</p> : null}
        </div>
        <Accordion
          className="pf2-faq__list"
          mode="single"
          icon="plusminus"
          items={faqs.slice(0, 10).map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
        />
      </Container>
    </SectionShell>
  );
};

/** Contacto sobre superficie oscura, con los datos como fichas tipográficas. */
const PremiumContact: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;
  const hours = business.openingHours.slice(0, 4);

  return (
    <SectionShell anchor={section.anchor} className="pf2-contact" surface="dark">
      <Container className="pf2-contact__grid">
        <div data-wf-entry="reveal-up">
          <h2>{config.content.headings.contact?.title || 'Hablemos'}</h2>
          <p>{config.content.headings.contact?.subtitle || business.serviceArea}</p>
          {config.contact.mapLinkUrl ? (
            <CtaButton
              cta={{ label: 'Cómo llegar', kind: 'external', target: config.contact.mapLinkUrl }}
              variant="ghost"
              size="md"
            />
          ) : null}
        </div>
        <dl className="pf2-contact__facts">
          {business.phone ? (
            <div>
              <dt>Teléfono</dt>
              <dd>
                <button type="button" onClick={() => runCta({ label: business.phone, kind: 'tel', target: business.phone })}>
                  {business.phone}
                </button>
              </dd>
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
              <dt>Dirección</dt>
              <dd>{business.address.line1}, {business.address.postalCode} {business.address.city}</dd>
            </div>
          ) : null}
          {hours.length > 0 ? (
            <div>
              <dt>Horario</dt>
              <dd>
                {hours.map((slot) => (
                  <span key={slot.label}>{slot.label}: {slot.value}</span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </Container>
    </SectionShell>
  );
};

/* ----------------------------- MINIMALISTA -------------------------------- */

/** Proceso como línea numerada horizontal, sin iconos ni tarjetas. */
const MinimalProcess: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const steps = config.content.processSteps.filter((step) => step.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (steps.length === 0) return null;
  const heading = config.content.headings.process;

  return (
    <SectionShell anchor={section.anchor} className="mn2-process">
      <Container>
        <h2 className="mn2-heading">{heading?.title || 'El proceso'}</h2>
        <ol className="mn2-process__line">
          {steps.slice(0, 5).map((step, index) => (
            <li key={step.id} data-wf-entry="fade-up">
              <span aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
};

/** Reseñas como columnas de texto separadas por filetes. Sin estrellas ni fotos. */
const MinimalTestimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const list = config.testimonials.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (list.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="mn2-quotes" surface="alternative">
      <Container>
        <h2 className="mn2-heading">{config.content.headings.testimonials?.title || 'Lo que dicen'}</h2>
        <div className="mn2-quotes__cols">
          {list.slice(0, 3).map((item) => (
            <figure key={item.id} data-wf-entry="fade">
              <blockquote>{item.text}</blockquote>
              <figcaption>{item.author}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Galería en rejilla regular y muda: sin pies, sin sombras, sin bordes. */
const MinimalGallery: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.gallery.filter((item) => item.enabled && item.image).sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="mn2-gallery">
      <Container>
        <h2 className="mn2-heading">{config.content.headings.gallery?.title || 'Galería'}</h2>
        <div className="mn2-gallery__grid">
          {items.slice(0, 8).map((item) => (
            <figure key={item.id} data-wf-entry="fade">
              <Picture image={item.image!} sizes="(max-width: 720px) 45vw, 24vw" />
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Preguntas como lista de filetes a ancho completo. */
const MinimalFaq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const faqs = config.faqs.filter((faq) => faq.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (faqs.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="mn2-faq">
      <Container>
        <h2 className="mn2-heading">{config.content.headings.faq?.title || 'Preguntas'}</h2>
        <Accordion
          className="mn2-faq__list"
          mode="multiple"
          icon="chevron"
          items={faqs.slice(0, 12).map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
        />
      </Container>
    </SectionShell>
  );
};

/** Contacto como ficha de datos: etiquetas pequeñas, valores grandes. */
const MinimalContact: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;

  return (
    <SectionShell anchor={section.anchor} className="mn2-contact">
      <Container>
        <h2 className="mn2-heading">{config.content.headings.contact?.title || 'Contacto'}</h2>
        <dl className="mn2-contact__rows">
          {business.phone ? (
            <div>
              <dt>Teléfono</dt>
              <dd>
                <button type="button" onClick={() => runCta({ label: business.phone, kind: 'tel', target: business.phone })}>
                  {business.phone}
                </button>
              </dd>
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
              <dt>Dirección</dt>
              <dd>{business.address.line1} · {business.address.postalCode} {business.address.city}</dd>
            </div>
          ) : null}
          {business.openingHours.slice(0, 3).map((slot) => (
            <div key={slot.label}>
              <dt>{slot.label}</dt>
              <dd>{slot.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </SectionShell>
  );
};

/* ---------------------------- CONVENCIONAL -------------------------------- */

/** Proceso en tarjetas numeradas de cuatro, con conector entre ellas. */
const ConventionalProcess: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const steps = config.content.processSteps.filter((step) => step.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (steps.length === 0) return null;
  const heading = config.content.headings.process;

  return (
    <SectionShell anchor={section.anchor} className="cv2-process" surface="alternative">
      <Container>
        <div className="cv2-section-head">
          <h2>{heading?.title || 'Así lo hacemos'}</h2>
          <p>{heading?.subtitle || 'Cuatro pasos, sin sorpresas.'}</p>
        </div>
        <ol className="cv2-process__grid">
          {steps.slice(0, 4).map((step, index) => (
            <li key={step.id} data-wf-card data-wf-entry="fade-up">
              <span className="cv2-process__badge">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
};

/** Reseñas en tarjetas con estrellas y nota media destacada. */
const ConventionalTestimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const list = config.testimonials.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (list.length === 0) return null;
  const average = list.reduce((total, item) => total + item.rating, 0) / list.length;

  return (
    <SectionShell anchor={section.anchor} className="cv2-quotes">
      <Container>
        <div className="cv2-section-head">
          <h2>{config.content.headings.testimonials?.title || 'Opiniones de clientes'}</h2>
          <p className="cv2-quotes__score">
            <StarRating rating={Math.round(average)} size={18} />
            <strong>{average.toFixed(1)}</strong> sobre {list.length} opiniones
          </p>
        </div>
        <div className="cv2-quotes__grid" data-wf-card-row data-wf-card-aligned="true" style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {list.slice(0, 6).map((item) => (
            <article key={item.id} data-wf-card data-wf-entry="fade-up">
              <div data-wf-card-body>
                <StarRating rating={item.rating} size={14} />
                <p>{item.text}</p>
                <strong>{item.author}</strong>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Galería en tarjetas con pie visible y nombre del servicio. */
const ConventionalGallery: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.gallery.filter((item) => item.enabled && item.image).sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="cv2-gallery" surface="alternative">
      <Container>
        <div className="cv2-section-head">
          <h2>{config.content.headings.gallery?.title || 'Trabajos recientes'}</h2>
        </div>
        <div className="cv2-gallery__grid" data-wf-card-row data-wf-card-aligned="true" style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {items.slice(0, 6).map((item) => (
            <figure key={item.id} data-wf-card data-wf-entry="zoom-in">
              <div data-wf-card-media>
                <Picture image={item.image!} sizes="(max-width: 720px) 90vw, 30vw" />
              </div>
              <figcaption data-wf-card-body>
                {item.serviceName ? <strong>{item.serviceName}</strong> : null}
                {item.caption ? <span>{item.caption}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Preguntas en acordeón sobre tarjeta, con una llamada al final. */
const ConventionalFaq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const faqs = config.faqs.filter((faq) => faq.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (faqs.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="cv2-faq">
      <Container>
        <div className="cv2-section-head">
          <h2>{config.content.headings.faq?.title || 'Preguntas frecuentes'}</h2>
        </div>
        <div className="cv2-faq__panel" data-wf-card>
          <Accordion
            mode="single"
            icon="chevron"
            items={faqs.slice(0, 10).map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
          />
        </div>
        <p className="cv2-faq__foot">
          ¿No está tu duda? <CtaButton cta={config.navigation.primaryCta} variant="link" size="md" />
        </p>
      </Container>
    </SectionShell>
  );
};

/** Contacto en tarjetas con iconos: teléfono, correo, dirección y horario. */
const ConventionalContact: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;

  const cards = [
    business.phone
      ? { key: 'phone', icon: 'phone' as const, title: 'Llámanos', value: business.phone, cta: { label: business.phone, kind: 'tel' as const, target: business.phone } }
      : null,
    business.email
      ? { key: 'mail', icon: 'mail' as const, title: 'Escríbenos', value: business.email, cta: null }
      : null,
    business.address.line1
      ? {
          key: 'pin',
          icon: 'pin' as const,
          title: 'Visítanos',
          value: `${business.address.line1}, ${business.address.postalCode} ${business.address.city}`,
          cta: config.contact.mapLinkUrl
            ? { label: 'Ver en el mapa', kind: 'external' as const, target: config.contact.mapLinkUrl }
            : null,
        }
      : null,
    business.openingHours.length > 0
      ? {
          key: 'clock',
          icon: 'clock' as const,
          title: 'Horario',
          value: business.openingHours.map((slot) => `${slot.label}: ${slot.value}`).join(' · '),
          cta: null,
        }
      : null,
  ].filter((card): card is NonNullable<typeof card> => card !== null);

  return (
    <SectionShell anchor={section.anchor} className="cv2-contact" surface="alternative">
      <Container>
        <div className="cv2-section-head">
          <h2>{config.content.headings.contact?.title || 'Contacto'}</h2>
          <p>{config.content.headings.contact?.subtitle || business.serviceArea}</p>
        </div>
        <div className="cv2-contact__grid" data-wf-card-row data-wf-card-aligned="true" style={{ ['--wf-card-row-columns' as string]: cards.length }}>
          {cards.map((card) => (
            <article key={card.key} data-wf-card data-wf-entry="fade-up">
              <div data-wf-card-body>
                <IconBadge icon={card.icon} size="md" />
                <h3>{card.title}</h3>
                <p>{card.value}</p>
                {card.cta ? (
                  <button type="button" className="cv2-contact__link" onClick={() => runCta(card.cta!)}>
                    {card.cta.label}
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */

export const PROFILE_SECTIONS: Record<string, SectionComponent> = {
  'pf2-header-01': PremiumHeader,
  'pf2-hero-01': PremiumHero,
  'pf2-services-01': PremiumServices,
  'pf2-process-01': PremiumProcess,
  'pf2-gallery-01': PremiumGallery,
  'pf2-quotes-01': PremiumTestimonials,
  'pf2-faq-01': PremiumFaq,
  'pf2-contact-01': PremiumContact,
  'pf2-final-01': PremiumFinalCta,
  'pf2-footer-01': PremiumFooter,

  'mn2-header-01': MinimalHeader,
  'mn2-hero-01': MinimalHero,
  'mn2-services-01': MinimalServices,
  'mn2-process-01': MinimalProcess,
  'mn2-gallery-01': MinimalGallery,
  'mn2-quotes-01': MinimalTestimonials,
  'mn2-faq-01': MinimalFaq,
  'mn2-contact-01': MinimalContact,
  'mn2-final-01': MinimalFinalCta,
  'mn2-footer-01': MinimalFooter,

  'cv2-header-01': ConventionalHeader,
  'cv2-hero-01': ConventionalHero,
  'cv2-trust-01': ConventionalTrust,
  'cv2-services-01': ConventionalServices,
  'cv2-process-01': ConventionalProcess,
  'cv2-gallery-01': ConventionalGallery,
  'cv2-quotes-01': ConventionalTestimonials,
  'cv2-faq-01': ConventionalFaq,
  'cv2-contact-01': ConventionalContact,
  'cv2-final-01': ConventionalFinalCta,
  'cv2-footer-01': ConventionalFooter,
};
