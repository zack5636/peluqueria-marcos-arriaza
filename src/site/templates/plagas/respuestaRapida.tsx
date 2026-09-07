/**
 * PlagaControl · Respuesta rápida — secciones.
 *
 * Template orientada a urgencias y conversión. Ninguna sección contiene nombres
 * de plagas ni de sectores: todo se lee de las colecciones editables del
 * proyecto, de modo que el usuario puede añadir, renombrar o eliminar elementos
 * sin tocar código.
 */

import { roleItems, roleRoute } from '@/site/bindings';
import { itemBool, itemImage, itemList, itemText } from '../../collections';
import { useMemo, useRef, useState } from 'react';
import { useSite } from '../../context';
import { getForm } from '../../forms';
import type { SectionComponent } from '../../registry';
import type { Cta, SectionHeading } from '../../types';
import { useActiveSection, useStickyHeader } from '../../hooks';
import { Accordion } from '../../components/Accordion';
import { BrandMark } from '../../components/BrandMark';
import { Icon } from '../../components/Icon';
import { MobileDrawer } from '../../components/MobileDrawer';
import { SiteForm } from '../../components/SiteForm';
import {
  Container,
  CtaButton,
  Heading,
  IconBadge,
  Picture,
  SectionShell,
  StarRating,
} from '../../components/primitives';

/* -------------------------------------------------------------------------- */
/*                                  Utilidades                                 */
/* -------------------------------------------------------------------------- */

const FALLBACK_HEADING: SectionHeading = { eyebrow: '', title: '', subtitle: '' };

function useHeading(key: string, fallback: SectionHeading): SectionHeading {
  const { config } = useSite();
  return (config.content.headings as Record<string, SectionHeading | undefined>)[key] ?? fallback;
}

function primaryCta(label?: string): Cta {
  return { label: label ?? 'Solicitar inspección', kind: 'modal', target: 'booking' };
}

/* -------------------------------------------------------------------------- */
/*                                   Header                                    */
/* -------------------------------------------------------------------------- */

const Header: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const stuck = useStickyHeader(60);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // El drawer devuelve el foco a este botón al cerrarse.
  const burgerRef = useRef<HTMLButtonElement>(null);
  const items = useMemo(
    () => config.navigation.items.filter((i) => i.enabled).sort((a, b) => a.sortOrder - b.sortOrder),
    [config.navigation.items],
  );
  const activeId = useActiveSection(items);
  const urgencias = config.business.openingHours.find((h) => /urgenc/i.test(h.label));

  return (
    <SectionShell anchor={section.anchor} as="header" className="pr-header" label="Cabecera">
      {/* Barra superior: teléfono, WhatsApp y disponibilidad siempre visibles. */}
      <div className="pr-header__top">
        <Container className="pr-header__top-inner">
          <p className="pr-header__area">
            <Icon name="pin" size={15} />
            <span>{config.business.serviceArea}</span>
          </p>
          <div className="pr-header__top-actions">
            {urgencias ? (
              <span className="pr-header__badge">
                <Icon name="clock" size={15} />
                {urgencias.label}: {urgencias.value}
              </span>
            ) : null}
            <button
              type="button"
              className="pr-header__link"
              data-wf-button
              onClick={() => runCta({ label: config.business.phone, kind: 'tel', target: config.business.phone })}
            >
              <Icon name="phone" size={15} />
              {config.business.phone}
            </button>
            {config.business.whatsapp ? (
              <button
                type="button"
                className="pr-header__link pr-header__link--wa"
                data-wf-button
                onClick={() =>
                  runCta({
                    label: 'WhatsApp',
                    kind: 'whatsapp',
                    target: config.business.whatsapp,
                    message: 'Hola, necesito ayuda con una plaga.',
                  })
                }
              >
                <Icon name="whatsapp" size={15} />
                WhatsApp
              </button>
            ) : null}
          </div>
        </Container>
      </div>

      <div className={`pr-header__main${stuck ? ' is-stuck' : ''}`} data-wf-header>
        <Container className="pr-header__inner">
          <button
            type="button"
            className="pr-header__brand"
            onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}
          >
            <BrandMark icon="shield" size={30} />
            {config.business.logo.showName ? <span>{config.business.name}</span> : null}
          </button>

          <nav className="pr-header__nav" aria-label="Navegación principal">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`pr-header__nav-link${activeId === item.id ? ' is-active' : ''}`}
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={() => runCta(item.cta)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pr-header__actions">
            <CtaButton cta={config.navigation.primaryCta} variant="primary" size="sm" icon="calendar" />
            <button
              type="button"
              ref={burgerRef}
              className="pr-header__burger"
              aria-label="Abrir menú"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </Container>
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        activeId={activeId}
        triggerRef={burgerRef}
        footer={
          <div className="pr-drawer__actions">
            <CtaButton cta={config.navigation.primaryCta} variant="primary" full />
            <CtaButton
              cta={{ label: `Llamar ${config.business.phone}`, kind: 'tel', target: config.business.phone }}
              variant="secondary"
              icon="phone"
              full
            />
          </div>
        }
      />
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                     Hero                                    */
/* -------------------------------------------------------------------------- */

const Hero: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;
  const zonas = roleItems(config, 'serviceAreas');

  return (
    <SectionShell anchor={section.anchor} className="pr-hero">
      {/* Capa decorativa: no captura el ratón ni genera desbordes. */}
      <span className="pr-hero__layer" data-wf-motion-layer aria-hidden="true">
        <span className="pr-hero__shape pr-hero__shape--a" data-wf-motion-shape />
        <span className="pr-hero__shape pr-hero__shape--b" data-wf-motion-shape />
      </span>

      <Container className="pr-hero__inner">
        <div className="pr-hero__copy" data-wf-entry="fade-up">
          {hero.eyebrow ? (
            <p className="pr-hero__eyebrow">
              <Icon name="alert" size={16} />
              {hero.eyebrow}
            </p>
          ) : null}

          <h1 className="pr-hero__title">
            {hero.title} <em>{hero.titleHighlight}</em>
          </h1>
          <p className="pr-hero__paragraph">{hero.paragraph}</p>

          <div className="pr-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" size="lg" icon="calendar" />
            {hero.secondaryCta ? (
              <CtaButton cta={hero.secondaryCta} variant="secondary" size="lg" icon="phone" />
            ) : null}
          </div>

          {hero.note ? <p className="pr-hero__note">{hero.note}</p> : null}

          {hero.ratingBadge.enabled ? (
            <div className="pr-hero__rating">
              <StarRating rating={5} size={18} />
              <span>
                <strong>{hero.ratingBadge.score}</strong> · {hero.ratingBadge.countLabel} en{' '}
                {hero.ratingBadge.sourceLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="pr-hero__media" data-wf-entry="zoom-in" data-wf-media-frame>
          <Picture image={hero.image} loading="eager" className="pr-hero__image" data-wf-motion-image />
          {zonas.length > 0 ? (
            <div className="pr-hero__coverage">
              <p className="pr-hero__coverage-title">
                <Icon name="map" size={16} /> Cobertura inmediata
              </p>
              <ul>
                {zonas.slice(0, 4).map((zona) => (
                  <li key={zona.id}>
                    <span>{itemText(zona, 'nombre')}</span>
                    <strong>{itemText(zona, 'respuesta', '—')}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>

      {/* Microbeneficios: banda de confianza inmediata bajo el hero. */}
      {hero.microBenefits.length > 0 ? (
        <Container>
          <ul className="pr-hero__micro" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: hero.microBenefits.length }}>
            {hero.microBenefits.map((benefit, index) => (
              <li key={benefit.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 80}ms` }}>
                <span data-wf-card-icon>
                  <IconBadge icon={benefit.icon} size="sm" />
                </span>
                <div data-wf-card-body>
                  <strong>{benefit.label}</strong>
                  <span>{benefit.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                          Indicadores de confianza                           */
/* -------------------------------------------------------------------------- */

const Trust: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('benefits', FALLBACK_HEADING);
  const benefits = config.content.benefits.filter((b) => b.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (benefits.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pr-trust">
      <Container>
        {heading.title ? <Heading heading={heading} align="center" /> : null}
        <div
          className="pr-trust__grid"
          data-wf-card-row
          style={{ ['--wf-card-row-columns' as string]: Math.min(benefits.length, 5) }}
        >
          {benefits.map((benefit, index) => (
            <article
              key={benefit.id}
              className="pr-trust__card"
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
            >
              <span data-wf-card-icon>
                <IconBadge icon={benefit.icon} accent={`var(--wf-${benefit.accent})`} size="lg" />
              </span>
              <div data-wf-card-body>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Tipos de plaga                                 */
/* -------------------------------------------------------------------------- */

/** Rejilla de plagas. El catálogo es una colección editable del proyecto. */
const Plagas: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const plagas = roleItems(config, 'catalog');

  const heading: SectionHeading = {
    eyebrow: 'Tipos de plaga',
    title: '¿Qué plaga quieres eliminar?',
    subtitle: 'Elige la que se parezca a tu caso y te explicamos cómo la tratamos.',
  };

  if (plagas.length === 0) {
    return (
      <SectionShell anchor={section.anchor} className="pr-plagas">
        <Container>
          <Heading heading={heading} />
          <p className="pr-empty">
            Todavía no has añadido ningún tipo de plaga. Añádelos desde Contenido → Tipos de plaga y aparecerán
            aquí y en el formulario de solicitud.
          </p>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="pr-plagas">
      <Container>
        <Heading heading={heading} />
        <div className="pr-plagas__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {plagas.map((plaga, index) => {
            const slug = itemText(plaga, 'slug');
            return (
              <article
                key={plaga.id}
                className="pr-plagas__card"
                data-wf-card
                data-wf-entry="fade-up"
                style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
              >
                <div className="pr-plagas__media" data-wf-card-media>
                  <Picture image={null} className="pr-plagas__image" />
                  <span className="pr-plagas__icon" data-wf-card-icon>
                    <IconBadge icon={itemText(plaga, 'icono', 'bug')} size="md" />
                  </span>
                  {itemBool(plaga, 'urgente') ? <span className="pr-plagas__flag">Urgente</span> : null}
                </div>

                <div data-wf-card-body>
                  <h3>{itemText(plaga, 'nombre')}</h3>
                  <p>{itemText(plaga, 'resumen')}</p>
                  {itemList(plaga, 'senales').length > 0 ? (
                    <ul className="pr-plagas__signals">
                      {itemList(plaga, 'senales')
                        .slice(0, 3)
                        .map((senal) => (
                          <li key={senal}>
                            <Icon name="check" size={14} />
                            {senal}
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </div>

                <div data-wf-card-actions>
                  {slug ? (
                    <button
                      type="button"
                      className="wf-btn wf-btn--ghost wf-btn--sm"
                      data-wf-button
                      onClick={() => runCta({ label: 'Ver detalle', kind: 'route', target: `${roleRoute(config, 'catalog', '/plagas')}/${slug}` })}
                    >
                      Cómo la tratamos
                      <Icon name="arrowRight" size={16} />
                    </button>
                  ) : null}
                  <CtaButton cta={primaryCta('Pedir inspección')} variant="primary" size="sm" />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Servicios                                  */
/* -------------------------------------------------------------------------- */

const Services: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const heading = useHeading('services', FALLBACK_HEADING);
  const services = config.services.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pr-services">
      <Container>
        <Heading heading={heading} />
        <div
          className="pr-services__grid"
          data-wf-card-row
          style={{ ['--wf-card-row-columns' as string]: Math.min(services.length, 3) }}
        >
          {services.map((service, index) => (
            <article
              key={service.id}
              className="pr-services__card"
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
            >
              <span data-wf-card-icon>
                <IconBadge icon={service.icon} accent={`var(--wf-${service.accent})`} size="lg" />
              </span>
              <div data-wf-card-body>
                <h3>{service.name}</h3>
                <p>{service.shortDescription}</p>
                {service.includes.length > 0 ? (
                  <ul className="pr-services__includes">
                    {service.includes.slice(0, 4).map((item) => (
                      <li key={item}>
                        <Icon name="check" size={15} />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div data-wf-card-actions>
                <button
                  type="button"
                  className="wf-btn wf-btn--ghost wf-btn--sm"
                  data-wf-button
                  onClick={() => runCta({ label: 'Ver servicio', kind: 'route', target: `/servicios/${service.slug}` })}
                >
                  Más detalles
                  <Icon name="arrowRight" size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Proceso                                   */
/* -------------------------------------------------------------------------- */

const Process: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('process', FALLBACK_HEADING);
  const steps = config.content.processSteps.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (steps.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pr-process">
      <Container>
        <Heading heading={heading} />
        <ol className="pr-process__list" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: steps.length }}>
          {steps.map((step, index) => (
            <li
              key={step.id}
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 90}ms` }}
            >
              <span className="pr-process__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span data-wf-card-icon>
                <IconBadge icon={step.icon} size="md" />
              </span>
              <div data-wf-card-body>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Sectores                                  */
/* -------------------------------------------------------------------------- */

const Sectores: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const sectores = roleItems(config, 'segments');
  if (sectores.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pr-sectores">
      <Container>
        <Heading
          heading={{
            eyebrow: 'Sectores',
            title: 'Trabajamos para hogares y para negocios',
            subtitle: 'Cada actividad tiene sus exigencias. Adaptamos el método, el horario y la documentación.',
          }}
        />
        <div className="pr-sectores__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {sectores.map((sector, index) => {
            const slug = itemText(sector, 'slug');
            return (
              <article
                key={sector.id}
                className="pr-sectores__card"
                data-wf-card
                data-wf-entry="fade-up"
                style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
              >
                <span data-wf-card-icon>
                  <IconBadge icon={itemText(sector, 'icono', 'building')} size="md" />
                </span>
                <div data-wf-card-body>
                  <h3>{itemText(sector, 'nombre')}</h3>
                  <p>{itemText(sector, 'resumen')}</p>
                  {itemList(sector, 'necesidades').length > 0 ? (
                    <ul className="pr-sectores__needs">
                      {itemList(sector, 'necesidades').map((n) => (
                        <li key={n}>
                          <Icon name="check" size={14} />
                          {n}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div data-wf-card-actions>
                  {slug ? (
                    <button
                      type="button"
                      className="wf-btn wf-btn--link wf-btn--sm"
                      data-wf-button
                      onClick={() => runCta({ label: 'Ver sector', kind: 'route', target: `${roleRoute(config, 'segments', '/sectores')}/${slug}` })}
                    >
                      Ver cómo lo hacemos
                      <Icon name="arrowRight" size={15} />
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Zonas de cobertura                             */
/* -------------------------------------------------------------------------- */

const Zonas: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const zonas = roleItems(config, 'serviceAreas');
  if (zonas.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pr-zonas">
      <Container className="pr-zonas__inner">
        <div className="pr-zonas__copy" data-wf-entry="slide-right">
          <Heading
            heading={{
              eyebrow: 'Zonas de cobertura',
              title: '¿Llegamos hasta ti?',
              subtitle: `Damos servicio en ${config.business.serviceArea}. Si tu localidad no aparece, llámanos: es probable que también lleguemos.`,
            }}
            align="left"
          />
          <div className="pr-zonas__actions">
            <CtaButton cta={primaryCta('Comprobar mi zona')} variant="primary" />
            <CtaButton
              cta={{ label: config.business.phone, kind: 'tel', target: config.business.phone }}
              variant="secondary"
              icon="phone"
            />
          </div>
        </div>

        <ul className="pr-zonas__list" data-wf-entry="slide-left">
          {zonas.map((zona) => (
            <li key={zona.id} className={itemBool(zona, 'destacada') ? 'is-featured' : undefined}>
              <span className="pr-zonas__name">
                <Icon name="pin" size={15} />
                {itemText(zona, 'nombre')}
              </span>
              <span className="pr-zonas__meta">{itemText(zona, 'provincia')}</span>
              <span className="pr-zonas__time">{itemText(zona, 'respuesta', 'Consultar')}</span>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                             Trabajos realizados                             */
/* -------------------------------------------------------------------------- */

const Trabajos: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const heading = useHeading('gallery', FALLBACK_HEADING);
  const trabajos = roleItems(config, 'cases');

  if (trabajos.length === 0) {
    return (
      <SectionShell anchor={section.anchor} className="pr-trabajos">
        <Container>
          <Heading heading={heading} />
          <p className="pr-empty">
            Aún no has publicado ningún trabajo. Añádelos desde Contenido → Trabajos realizados para mostrar
            casos reales con su situación de partida y su resultado.
          </p>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="pr-trabajos">
      <Container>
        <Heading heading={heading} />
        <div className="pr-trabajos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
          {trabajos.slice(0, 4).map((trabajo, index) => (
            <article
              key={trabajo.id}
              className="pr-trabajos__card"
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 80}ms` }}
            >
              <div className="pr-trabajos__media" data-wf-card-media>
                <Picture image={null} className="pr-trabajos__image" />
              </div>
              <div data-wf-card-body>
                <p className="pr-trabajos__tags">
                  <span>{itemText(trabajo, 'sector')}</span>
                  <span>{itemText(trabajo, 'plaga')}</span>
                  <span>{itemText(trabajo, 'localidad')}</span>
                </p>
                <h3>{itemText(trabajo, 'titulo')}</h3>
                <p className="pr-trabajos__problem">{itemText(trabajo, 'problema')}</p>
                <p className="pr-trabajos__result">
                  <Icon name="checkCircle" size={16} />
                  {itemText(trabajo, 'resultado')}
                </p>
              </div>
              <div data-wf-card-actions>
                <button
                  type="button"
                  className="wf-btn wf-btn--link wf-btn--sm"
                  data-wf-button
                  onClick={() => runCta({ label: 'Ver trabajo', kind: 'route', target: roleRoute(config, 'cases', '/trabajos') })}
                >
                  Ver todos los trabajos
                  <Icon name="arrowRight" size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Testimonios                                 */
/* -------------------------------------------------------------------------- */

const Testimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('testimonials', FALLBACK_HEADING);
  const items = config.testimonials.filter((t) => t.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pr-testimonials">
      <Container>
        <Heading heading={heading} />
        <div
          className="pr-testimonials__grid"
          data-wf-card-row
          style={{ ['--wf-card-row-columns' as string]: Math.min(items.length, 4) }}
        >
          {items.map((item, index) => (
            <figure
              key={item.id}
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
            >
              <div data-wf-card-body>
                <StarRating rating={item.rating} />
                <blockquote>{item.text}</blockquote>
              </div>
              <figcaption data-wf-card-actions>{item.author}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                     FAQ                                     */
/* -------------------------------------------------------------------------- */

const Faq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('faq', FALLBACK_HEADING);
  const faqs = config.faqs.filter((f) => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (faqs.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pr-faq">
      <Container className="pr-faq__inner">
        <div className="pr-faq__copy" data-wf-entry="slide-right">
          <Heading heading={heading} align="left" />
          <div className="pr-faq__help">
            <p>¿No encuentras tu duda?</p>
            <CtaButton
              cta={{ label: `Llamar ${config.business.phone}`, kind: 'tel', target: config.business.phone }}
              variant="secondary"
              icon="phone"
            />
          </div>
        </div>
        <div className="pr-faq__list" data-wf-entry="fade-up">
          <Accordion
            items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
            mode="single"
            icon="chevron"
          />
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  CTA final                                  */
/* -------------------------------------------------------------------------- */

const FinalCta: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const cta = config.content.finalCta;

  return (
    <SectionShell anchor={section.anchor} className="pr-finalcta">
      <span className="pr-finalcta__layer" data-wf-motion-layer aria-hidden="true">
        <span className="pr-finalcta__shape" data-wf-motion-shape />
      </span>
      <Container className="pr-finalcta__inner" data-wf-motion-band>
        <div data-wf-entry="fade-up">
          <h2>{cta.title}</h2>
          <p>{cta.subtitle}</p>
        </div>
        <div className="pr-finalcta__actions" data-wf-entry="fade-up">
          <CtaButton cta={cta.cta} variant="primary" size="lg" icon="calendar" />
          <CtaButton
            cta={{ label: config.business.phone, kind: 'tel', target: config.business.phone }}
            variant="inverse"
            size="lg"
            icon="phone"
          />
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    Footer                                   */
/* -------------------------------------------------------------------------- */

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const items = config.navigation.items.filter((i) => i.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const plagas = roleItems(config, 'catalog');

  return (
    <SectionShell anchor={section.anchor} as="footer" className="pr-footer">
      <Container className="pr-footer__inner">
        <div className="pr-footer__brand">
          <BrandMark icon="shield" size={30} inverse />
          <p>{config.content.footerTagline}</p>
          <div className="pr-footer__contact">
            <button type="button" data-wf-button onClick={() => runCta({ label: config.business.phone, kind: 'tel', target: config.business.phone })}>
              <Icon name="phone" size={16} /> {config.business.phone}
            </button>
            <button type="button" data-wf-button onClick={() => runCta({ label: config.business.email, kind: 'mailto', target: config.business.email })}>
              <Icon name="mail" size={16} /> {config.business.email}
            </button>
            <span>
              <Icon name="pin" size={16} /> {config.business.address.line1}, {config.business.address.postalCode}{' '}
              {config.business.address.city}
            </span>
          </div>
        </div>

        <nav className="pr-footer__nav" aria-label="Páginas">
          <h3>Navegación</h3>
          {items.map((item) => (
            <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
              {item.label}
            </button>
          ))}
        </nav>

        <nav className="pr-footer__nav" aria-label="Plagas">
          <h3>Plagas que tratamos</h3>
          {plagas.slice(0, 7).map((plaga) => (
            <button
              key={plaga.id}
              type="button"
              onClick={() => runCta({ label: itemText(plaga, 'nombre'), kind: 'route', target: `${roleRoute(config, 'catalog', '/plagas')}/${itemText(plaga, 'slug')}` })}
            >
              {itemText(plaga, 'nombre')}
            </button>
          ))}
        </nav>

        <div className="pr-footer__hours">
          <h3>Horario</h3>
          <ul>
            {config.business.openingHours.map((hour) => (
              <li key={hour.label}>
                <span>{hour.label}</span>
                <strong>{hour.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="pr-footer__legal">
        <p>{config.content.footerSignature}</p>
        <nav aria-label="Textos legales">
          <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: roleRoute(config, 'legalNotice', '/aviso-legal') })}>
            Aviso legal
          </button>
          <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: roleRoute(config, 'privacy', '/privacidad') })}>
            Política de privacidad
          </button>
          <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: roleRoute(config, 'cookies', '/cookies') })}>
            Política de cookies
          </button>
        </nav>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                             Páginas secundarias                             */
/* -------------------------------------------------------------------------- */

/** Portada común de las páginas secundarias: contexto antes del contenido. */
function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="pr-pagehero" data-wf-entry="fade-up">
      <Container>
        <p className="pr-pagehero__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="pr-pagehero__subtitle">{subtitle}</p>
        {actions ? <div className="pr-pagehero__actions">{actions}</div> : null}
      </Container>
    </div>
  );
}

/** Detalle de un elemento de colección, resuelto por la ruta activa. */
function useSlugFromRoute(prefix: string): string | null {
  const { route } = useSite();
  const normalized = route.split('?')[0].replace(/\/+$/, '');
  if (!normalized.startsWith(`${prefix}/`)) return null;
  return normalized.slice(prefix.length + 1) || null;
}

const PageServicios: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const slug = useSlugFromRoute('/servicios');
  const services = config.services.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const current = slug ? services.find((s) => s.slug === slug) : null;

  if (slug && !current) {
    return (
      <SectionShell anchor={section.anchor} className="pr-page">
        <PageHero eyebrow="Servicios" title="Servicio no encontrado" subtitle="El servicio solicitado no existe o se ha desactivado." />
        <Container>
          <CtaButton cta={{ label: 'Ver todos los servicios', kind: 'route', target: '/servicios' }} variant="primary" />
        </Container>
      </SectionShell>
    );
  }

  if (current) {
    return (
      <SectionShell anchor={section.anchor} className="pr-page">
        <PageHero
          eyebrow="Servicio"
          title={current.name}
          subtitle={current.shortDescription}
          actions={<CtaButton cta={primaryCta('Solicitar este servicio')} variant="primary" size="lg" />}
        />
        <Container className="pr-page__split">
          <div className="pr-page__main" data-wf-entry="fade-up">
            <p className="pr-page__lead">{current.longDescription}</p>
            {current.includes.length > 0 ? (
              <>
                <h2>Qué incluye</h2>
                <ul className="pr-page__checklist">
                  {current.includes.map((item) => (
                    <li key={item}>
                      <Icon name="checkCircle" size={18} />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <h2>Cómo trabajamos</h2>
            <ol className="pr-page__steps">
              {config.content.processSteps
                .filter((s) => s.enabled)
                .map((step) => (
                  <li key={step.id}>
                    <strong>{step.title}</strong>
                    <span>{step.description}</span>
                  </li>
                ))}
            </ol>
          </div>
          <aside className="pr-page__aside" data-wf-entry="fade-up">
            <div className="pr-page__card" data-wf-card>
              <h3>¿Lo necesitas ahora?</h3>
              <p>{config.content.pricingNote}</p>
              <div data-wf-card-actions>
                <CtaButton cta={primaryCta()} variant="primary" full />
                <CtaButton
                  cta={{ label: config.business.phone, kind: 'tel', target: config.business.phone }}
                  variant="secondary"
                  icon="phone"
                  full
                />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero
        eyebrow="Servicios"
        title="Qué hacemos"
        subtitle="Inspección, tratamiento de choque, prevención, mantenimiento y urgencias."
        actions={<CtaButton cta={primaryCta()} variant="primary" size="lg" />}
      />
      <Container>
        <div className="pr-services__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {services.map((service, index) => (
            <article
              key={service.id}
              className="pr-services__card"
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
            >
              <span data-wf-card-icon>
                <IconBadge icon={service.icon} accent={`var(--wf-${service.accent})`} size="lg" />
              </span>
              <div data-wf-card-body>
                <h2>{service.name}</h2>
                <p>{service.longDescription || service.shortDescription}</p>
                <ul className="pr-services__includes">
                  {service.includes.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div data-wf-card-actions>
                <button
                  type="button"
                  className="wf-btn wf-btn--ghost wf-btn--sm"
                  data-wf-button
                  onClick={() => runCta({ label: service.name, kind: 'route', target: `/servicios/${service.slug}` })}
                >
                  Ver ficha completa
                  <Icon name="arrowRight" size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

const PagePlagas: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const slug = useSlugFromRoute('/plagas');
  const plagas = roleItems(config, 'catalog');
  const current = slug ? plagas.find((p) => itemText(p, 'slug') === slug) : null;

  if (slug && !current) {
    return (
      <SectionShell anchor={section.anchor} className="pr-page">
        <PageHero eyebrow="Tipos de plaga" title="Plaga no encontrada" subtitle="El elemento solicitado no existe o se ha desactivado." />
        <Container>
          <CtaButton cta={{ label: 'Ver todas las plagas', kind: 'route', target: roleRoute(config, 'catalog', '/plagas') }} variant="primary" />
        </Container>
      </SectionShell>
    );
  }

  if (current) {
    return (
      <SectionShell anchor={section.anchor} className="pr-page">
        <PageHero
          eyebrow="Tipo de plaga"
          title={itemText(current, 'nombre')}
          subtitle={itemText(current, 'resumen')}
          actions={<CtaButton cta={primaryCta('Solicitar inspección')} variant="primary" size="lg" />}
        />
        <Container className="pr-page__split">
          <div className="pr-page__main" data-wf-entry="fade-up">
            <p className="pr-page__lead">{itemText(current, 'descripcion')}</p>

            {itemList(current, 'senales').length > 0 ? (
              <>
                <h2>Cómo saber si la tienes</h2>
                <ul className="pr-page__checklist">
                  {itemList(current, 'senales').map((s) => (
                    <li key={s}>
                      <Icon name="search" size={18} />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {itemList(current, 'riesgos').length > 0 ? (
              <>
                <h2>Por qué conviene actuar</h2>
                <ul className="pr-page__checklist pr-page__checklist--risk">
                  {itemList(current, 'riesgos').map((r) => (
                    <li key={r}>
                      <Icon name="alert" size={18} />
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {itemText(current, 'tratamiento') ? (
              <>
                <h2>Cómo la tratamos</h2>
                <p>{itemText(current, 'tratamiento')}</p>
              </>
            ) : null}
          </div>

          <aside className="pr-page__aside" data-wf-entry="fade-up">
            <div className="pr-page__card" data-wf-card>
              <h3>Datos rápidos</h3>
              <dl className="pr-page__facts">
                {itemText(current, 'temporada') ? (
                  <>
                    <dt>Temporada</dt>
                    <dd>{itemText(current, 'temporada')}</dd>
                  </>
                ) : null}
                <dt>Urgencia</dt>
                <dd>{itemBool(current, 'urgente') ? 'Recomendada intervención inmediata' : 'Admite planificación'}</dd>
              </dl>
              <div data-wf-card-actions>
                <CtaButton cta={primaryCta()} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero
        eyebrow="Tipos de plaga"
        title="Plagas que tratamos"
        subtitle="Cada especie exige un método distinto. Estas son las que resolvemos con más frecuencia."
        actions={<CtaButton cta={primaryCta()} variant="primary" size="lg" />}
      />
      <Container>
        {plagas.length === 0 ? (
          <p className="pr-empty">Añade tipos de plaga desde Contenido para que aparezcan en esta página.</p>
        ) : (
          <div className="pr-plagas__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
            {plagas.map((plaga, index) => (
              <article
                key={plaga.id}
                className="pr-plagas__card"
                data-wf-card
                data-wf-entry="fade-up"
                style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}
              >
                <div className="pr-plagas__media" data-wf-card-media>
                  <Picture image={null} className="pr-plagas__image" />
                  <span className="pr-plagas__icon" data-wf-card-icon>
                    <IconBadge icon={itemText(plaga, 'icono', 'bug')} size="md" />
                  </span>
                  {itemBool(plaga, 'urgente') ? <span className="pr-plagas__flag">Urgente</span> : null}
                </div>
                <div data-wf-card-body>
                  <h2>{itemText(plaga, 'nombre')}</h2>
                  <p>{itemText(plaga, 'resumen')}</p>
                </div>
                <div data-wf-card-actions>
                  <button
                    type="button"
                    className="wf-btn wf-btn--ghost wf-btn--sm"
                    data-wf-button
                    onClick={() => runCta({ label: 'Ver', kind: 'route', target: `${roleRoute(config, 'catalog', '/plagas')}/${itemText(plaga, 'slug')}` })}
                  >
                    Cómo la tratamos
                    <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </SectionShell>
  );
};

const PageSectores: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const slug = useSlugFromRoute('/sectores');
  const sectores = roleItems(config, 'segments');
  const current = slug ? sectores.find((s) => itemText(s, 'slug') === slug) : null;

  if (current) {
    return (
      <SectionShell anchor={section.anchor} className="pr-page">
        <PageHero
          eyebrow="Sector"
          title={itemText(current, 'nombre')}
          subtitle={itemText(current, 'resumen')}
          actions={<CtaButton cta={primaryCta('Solicitar propuesta')} variant="primary" size="lg" />}
        />
        <Container className="pr-page__split">
          <div className="pr-page__main" data-wf-entry="fade-up">
            {itemList(current, 'necesidades').length > 0 ? (
              <>
                <h2>Qué necesita este sector</h2>
                <ul className="pr-page__checklist">
                  {itemList(current, 'necesidades').map((n) => (
                    <li key={n}>
                      <Icon name="checkCircle" size={18} />
                      {n}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {itemText(current, 'normativa') ? (
              <>
                <h2>Documentación</h2>
                <p>{itemText(current, 'normativa')}</p>
              </>
            ) : null}
          </div>
          <aside className="pr-page__aside" data-wf-entry="fade-up">
            <div className="pr-page__card" data-wf-card>
              <h3>Hablemos de tu caso</h3>
              <p>Preparamos una propuesta con el alcance, la periodicidad y el precio cerrado.</p>
              <div data-wf-card-actions>
                <CtaButton cta={primaryCta('Solicitar propuesta')} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero
        eyebrow="Sectores"
        title="A quién damos servicio"
        subtitle="Adaptamos método, horario y documentación a la actividad de cada cliente."
        actions={<CtaButton cta={primaryCta()} variant="primary" size="lg" />}
      />
      <Container>
        <div className="pr-sectores__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {sectores.map((sector, index) => (
            <article
              key={sector.id}
              className="pr-sectores__card"
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}
            >
              <span data-wf-card-icon>
                <IconBadge icon={itemText(sector, 'icono', 'building')} size="md" />
              </span>
              <div data-wf-card-body>
                <h2>{itemText(sector, 'nombre')}</h2>
                <p>{itemText(sector, 'resumen')}</p>
              </div>
              <div data-wf-card-actions>
                <CtaButton
                  cta={{ label: 'Ver detalle', kind: 'route', target: `${roleRoute(config, 'segments', '/sectores')}/${itemText(sector, 'slug')}` }}
                  variant="ghost"
                  size="sm"
                />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

const PageZonas: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const zonas = roleItems(config, 'serviceAreas');

  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero
        eyebrow="Zonas de cobertura"
        title="Dónde trabajamos"
        subtitle={`Damos servicio en ${config.business.serviceArea}. Estos son los tiempos de respuesta habituales.`}
        actions={<CtaButton cta={primaryCta('Comprobar mi zona')} variant="primary" size="lg" />}
      />
      <Container>
        {zonas.length === 0 ? (
          <p className="pr-empty">Añade tus zonas de cobertura desde Contenido para mostrarlas aquí.</p>
        ) : (
          <ul className="pr-zonas__list pr-zonas__list--page" data-wf-entry="fade-up">
            {zonas.map((zona) => (
              <li key={zona.id} className={itemBool(zona, 'destacada') ? 'is-featured' : undefined}>
                <span className="pr-zonas__name">
                  <Icon name="pin" size={15} />
                  {itemText(zona, 'nombre')}
                </span>
                <span className="pr-zonas__meta">{itemText(zona, 'provincia')}</span>
                <span className="pr-zonas__time">{itemText(zona, 'respuesta', 'Consultar')}</span>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </SectionShell>
  );
};

const PageTrabajos: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const trabajos = roleItems(config, 'cases');

  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero
        eyebrow="Trabajos realizados"
        title="Casos reales"
        subtitle="La situación de partida, lo que hicimos y cómo quedó."
        actions={<CtaButton cta={primaryCta()} variant="primary" size="lg" />}
      />
      <Container>
        {trabajos.length === 0 ? (
          <p className="pr-empty">
            Todavía no hay trabajos publicados. Añádelos desde Contenido → Trabajos realizados.
          </p>
        ) : (
          <div className="pr-trabajos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
            {trabajos.map((trabajo, index) => (
              <article
                key={trabajo.id}
                className="pr-trabajos__card"
                data-wf-card
                data-wf-entry="fade-up"
                style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
              >
                <div className="pr-trabajos__media" data-wf-card-media>
                  <Picture image={null} className="pr-trabajos__image" />
                </div>
                <div data-wf-card-body>
                  <p className="pr-trabajos__tags">
                    <span>{itemText(trabajo, 'sector')}</span>
                    <span>{itemText(trabajo, 'plaga')}</span>
                    <span>{itemText(trabajo, 'localidad')}</span>
                  </p>
                  <h2>{itemText(trabajo, 'titulo')}</h2>
                  <p className="pr-trabajos__problem">
                    <strong>Situación:</strong> {itemText(trabajo, 'problema')}
                  </p>
                  <p>
                    <strong>Intervención:</strong> {itemText(trabajo, 'solucion')}
                  </p>
                  <p className="pr-trabajos__result">
                    <Icon name="checkCircle" size={16} />
                    {itemText(trabajo, 'resultado')}
                  </p>
                </div>
                <div data-wf-card-actions>
                  <span className="pr-trabajos__duration">
                    <Icon name="clock" size={15} />
                    {itemText(trabajo, 'duracion', 'Duración no indicada')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </SectionShell>
  );
};

const PageNosotros: SectionComponent = ({ section }) => {
  const { config } = useSite();
  // Los hooks se resuelven arriba: no pueden quedar dentro de un bloque condicional.
  const teamHeading = useHeading('team', FALLBACK_HEADING);
  const benefits = config.content.benefits.filter((b) => b.enabled);
  const team = config.team.filter((t) => t.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const certs = roleItems(config, 'credentials');

  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero
        eyebrow="Sobre nosotros"
        title={`Quiénes somos en ${config.business.name}`}
        subtitle={config.business.tagline}
        actions={<CtaButton cta={primaryCta()} variant="primary" size="lg" />}
      />
      <Container>
        <div className="pr-trust__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {benefits.map((benefit, index) => (
            <article
              key={benefit.id}
              className="pr-trust__card"
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}
            >
              <span data-wf-card-icon>
                <IconBadge icon={benefit.icon} size="lg" />
              </span>
              <div data-wf-card-body>
                <h2>{benefit.title}</h2>
                <p>{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>

        {team.length > 0 ? (
          <>
            <Heading heading={teamHeading} />
            <div className="pr-team__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
              {team.map((member, index) => (
                <article
                  key={member.id}
                  data-wf-card
                  data-wf-entry="fade-up"
                  style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}
                >
                  <div className="pr-team__media" data-wf-card-media>
                    <Picture image={member.photo} />
                  </div>
                  <div data-wf-card-body>
                    <h3>{member.name}</h3>
                    <p className="pr-team__role">{member.role}</p>
                    <p>{member.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {certs.length > 0 ? (
          <div className="pr-certs" data-wf-entry="fade-up">
            <h2>Acreditaciones y documentación</h2>
            <ul>
              {certs.map((cert) => (
                <li key={cert.id} data-wf-card>
                  <strong>{itemText(cert, 'nombre')}</strong>
                  <span>{itemText(cert, 'descripcion')}</span>
                  {itemText(cert, 'referencia') ? (
                    <em>Ref. {itemText(cert, 'referencia')}</em>
                  ) : (
                    <em className="pr-certs__pending">Pendiente de completar</em>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </SectionShell>
  );
};

const PageFaq: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const faqs = config.faqs.filter((f) => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const consejos = roleItems(config, 'articles');

  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Todo lo que sueles preguntarnos"
        subtitle="Y si te queda alguna duda, te la resolvemos por teléfono sin compromiso."
        actions={
          <CtaButton
            cta={{ label: `Llamar ${config.business.phone}`, kind: 'tel', target: config.business.phone }}
            variant="secondary"
            size="lg"
            icon="phone"
          />
        }
      />
      <Container>
        {faqs.length === 0 ? (
          <p className="pr-empty">Añade preguntas frecuentes desde Contenido.</p>
        ) : (
          <div data-wf-entry="fade-up">
            <Accordion
              items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
              mode="multiple"
              icon="chevron"
            />
          </div>
        )}
        {consejos.length ? (
          <div className="pr-page__related">
            <h2>Consejos de prevención</h2>
            <div className="pr-trabajos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
              {consejos.map((item) => (
                <article key={item.id} className="pr-page__card" data-wf-card>
                  <div data-wf-card-body><h3>{itemText(item, 'titulo')}</h3><p>{itemText(item, 'resumen')}</p></div>
                  <div data-wf-card-actions><button type="button" className="wf-btn wf-btn--ghost wf-btn--sm" onClick={() => runCta({ label: 'Leer consejo', kind: 'route', target: `${roleRoute(config, 'articles', '/consejos')}/${itemText(item, 'slug')}` })}>Leer consejo</button></div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </SectionShell>
  );
};

const PageContacto: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const form = getForm(config.forms ?? [], 'solicitar-inspeccion');

  return (
    <SectionShell anchor={section.anchor} className="pr-page pr-page--contacto">
      <PageHero
        eyebrow="Contacto"
        title="Cuéntanos qué ocurre"
        subtitle="Rellena la solicitud, llámanos o escríbenos por WhatsApp. Respondemos el mismo día."
      />
      <Container className="pr-contacto">
        <div className="pr-contacto__form" data-wf-entry="fade-up">
          {form ? (
            <SiteForm form={form} columns={2} />
          ) : (
            <p className="pr-empty">No hay ningún formulario configurado para esta página.</p>
          )}
        </div>

        <aside className="pr-contacto__aside" data-wf-entry="fade-up">
          <div className="pr-page__card" data-wf-card>
            <h3>Contacto directo</h3>
            <div data-wf-card-body>
              <button type="button" className="pr-contacto__link" data-wf-button onClick={() => runCta({ label: config.business.phone, kind: 'tel', target: config.business.phone })}>
                <Icon name="phone" size={18} />
                <span>
                  <strong>Llamar ahora</strong>
                  {config.business.phone}
                </span>
              </button>
              {config.business.whatsapp ? (
                <button
                  type="button"
                  className="pr-contacto__link"
                  data-wf-button
                  onClick={() =>
                    runCta({
                      label: 'WhatsApp',
                      kind: 'whatsapp',
                      target: config.business.whatsapp,
                      message: 'Hola, necesito ayuda con una plaga.',
                    })
                  }
                >
                  <Icon name="whatsapp" size={18} />
                  <span>
                    <strong>WhatsApp</strong>
                    {config.business.whatsapp}
                  </span>
                </button>
              ) : null}
              <button type="button" className="pr-contacto__link" data-wf-button onClick={() => runCta({ label: config.business.email, kind: 'mailto', target: config.business.email })}>
                <Icon name="mail" size={18} />
                <span>
                  <strong>Correo</strong>
                  {config.business.email}
                </span>
              </button>
            </div>
          </div>

          <div className="pr-page__card" data-wf-card>
            <h3>Horario</h3>
            <ul className="pr-contacto__hours">
              {config.business.openingHours.map((hour) => (
                <li key={hour.label}>
                  <span>{hour.label}</span>
                  <strong>{hour.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="pr-page__card" data-wf-card>
            <h3>Dónde estamos</h3>
            <p>
              {config.business.address.line1}
              <br />
              {config.business.address.postalCode} {config.business.address.city}
            </p>
            {config.contact.mapLinkUrl ? (
              <div data-wf-card-actions>
                <CtaButton
                  cta={{ label: 'Ver en el mapa', kind: 'external', target: config.contact.mapLinkUrl }}
                  variant="ghost"
                  size="sm"
                  icon="external"
                />
              </div>
            ) : null}
          </div>
        </aside>
      </Container>
    </SectionShell>
  );
};

const PageConsejos: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const slug = useSlugFromRoute('/consejos');
  const consejos = roleItems(config, 'articles');
  const current = slug ? consejos.find((item) => itemText(item, 'slug') === slug) : null;
  if (!current) {
    return (
      <SectionShell anchor={section.anchor} className="pr-page">
        <PageHero eyebrow="Consejos" title="Consejo no encontrado" subtitle="El consejo solicitado no existe o ya no está publicado." />
        <Container><CtaButton cta={{ label: 'Volver a prevención', kind: 'route', target: roleRoute(config, 'faq', '/preguntas') }} variant="primary" /></Container>
      </SectionShell>
    );
  }
  return (
    <SectionShell anchor={section.anchor} className="pr-page">
      <PageHero eyebrow={itemText(current, 'categoria', 'Prevención')} title={itemText(current, 'titulo')} subtitle={itemText(current, 'resumen')} actions={<CtaButton cta={primaryCta()} variant="primary" size="lg" />} />
      <Container className="pr-page__split">
        <article className="pr-page__main" data-wf-entry="fade-up">
          <Picture image={itemImage(current, 'imagen')} />
          {itemText(current, 'contenido').split('\n\n').filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {itemList(current, 'recomendaciones').length ? <ul className="pr-page__checklist">{itemList(current, 'recomendaciones').map((tip) => <li key={tip}><Icon name="checkCircle" size={18} />{tip}</li>)}</ul> : null}
        </article>
        <aside className="pr-page__aside"><div className="pr-page__card" data-wf-card><h3>¿Has detectado señales?</h3><p>Una inspección permite confirmar el origen antes de aplicar un tratamiento.</p><div data-wf-card-actions><CtaButton cta={primaryCta()} variant="primary" full /></div></div></aside>
      </Container>
    </SectionShell>
  );
};

const PageLegal: SectionComponent = ({ section }) => {
  const { config, route } = useSite();
  const legal = config.content.legal;
  const normalized = route.split('?')[0].replace(/\/+$/, '');
  const doc =
    normalized === '/privacidad' ? legal.privacy : normalized === '/cookies' ? legal.cookies : legal.legalNotice;

  return (
    <SectionShell anchor={section.anchor} className="pr-page pr-page--legal">
      <PageHero eyebrow="Información legal" title={doc.title} subtitle="" />
      <Container>
        <div className="pr-legal" data-wf-entry="fade-up">
          {doc.body.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Registro                                   */
/* -------------------------------------------------------------------------- */

export const PLAGAS_RESPUESTA_RAPIDA_SECTIONS: Record<string, SectionComponent> = {
  'pr-header-01': Header,
  'pr-hero-01': Hero,
  'pr-trust-01': Trust,
  'pr-plagas-01': Plagas,
  'pr-services-01': Services,
  'pr-process-01': Process,
  'pr-sectores-01': Sectores,
  'pr-zonas-01': Zonas,
  'pr-trabajos-01': Trabajos,
  'pr-testimonials-01': Testimonials,
  'pr-faq-01': Faq,
  'pr-finalcta-01': FinalCta,
  'pr-footer-01': Footer,
  'pr-page-servicios-01': PageServicios,
  'pr-page-plagas-01': PagePlagas,
  'pr-page-sectores-01': PageSectores,
  'pr-page-zonas-01': PageZonas,
  'pr-page-trabajos-01': PageTrabajos,
  'pr-page-consejos-01': PageConsejos,
  'pr-page-nosotros-01': PageNosotros,
  'pr-page-faq-01': PageFaq,
  'pr-page-contacto-01': PageContacto,
  'pr-page-legal-01': PageLegal,
};
