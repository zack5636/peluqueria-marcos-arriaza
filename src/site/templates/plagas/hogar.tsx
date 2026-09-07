/**
 * Casa Tranquila · Hogar — secciones.
 *
 * Tercera composición del nicho, distinta de las otras dos. El recorrido es
 * educativo: primero acompaña a reconocer señales, después explica el proceso,
 * luego sitúa la prevención en el calendario y solo al final propone la
 * revisión. El tono evita el alarmismo, así que no hay contadores de urgencia
 * ni distintivos rojos.
 *
 * Todo el vocabulario procede de las colecciones editables del proyecto.
 */

import { roleItems, roleRoute } from '@/site/bindings';
import type { SiteConfig } from '@/site/types';
import { useMemo, useRef, useState } from 'react';
import { useSite } from '../../context';
import { activeItems, itemBool, itemList, itemNumber, itemText } from '../../collections';
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

const FALLBACK: SectionHeading = { eyebrow: '', title: '', subtitle: '' };

function useHeading(key: string, fallback = FALLBACK): SectionHeading {
  const { config } = useSite();
  return (config.content.headings as Record<string, SectionHeading | undefined>)[key] ?? fallback;
}

const revisionCta = (config: SiteConfig, label = 'Solicitar revisión'): Cta => ({
  label,
  kind: 'route',
  target: roleRoute(config, 'contact', '/solicitar-revision'),
});

const ESTACION_LABEL: Record<string, string> = {
  primavera: 'Primavera',
  verano: 'Verano',
  otono: 'Otoño',
  invierno: 'Invierno',
};

function useSlug(prefix: string): string | null {
  const { route } = useSite();
  const normalized = route.split('?')[0].replace(/\/+$/, '');
  if (!normalized.startsWith(`${prefix}/`)) return null;
  return normalized.slice(prefix.length + 1) || null;
}

/* -------------------------------------------------------------------------- */
/*                                   Header                                    */
/* -------------------------------------------------------------------------- */

const Header: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const stuck = useStickyHeader(50);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const items = useMemo(
    () => config.navigation.items.filter((i) => i.enabled).sort((a, b) => a.sortOrder - b.sortOrder),
    [config.navigation.items],
  );
  const activeId = useActiveSection(items);

  return (
    <SectionShell anchor={section.anchor} as="header" className="hg-header" label="Cabecera">
      <div className={`hg-header__bar${stuck ? ' is-stuck' : ''}`} data-wf-header>
        <Container className="hg-header__inner">
          <button type="button" className="hg-header__brand" onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}>
            <BrandMark icon="home" size={30} />
            {config.business.logo.showName ? <span>{config.business.name}</span> : null}
          </button>

          <nav className="hg-header__nav" aria-label="Navegación principal">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`hg-header__link${activeId === item.id ? ' is-active' : ''}`}
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={() => runCta(item.cta)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hg-header__actions">
            <CtaButton cta={config.navigation.primaryCta} variant="primary" size="sm" />
            <button
              ref={burgerRef}
              type="button"
              className="hg-header__burger"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </Container>
      </div>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        activeId={activeId}
        triggerRef={burgerRef}
        footer={
          <div className="hg-drawer__actions">
            <CtaButton cta={config.navigation.primaryCta} variant="primary" full />
            <CtaButton cta={{ label: config.business.phone, kind: 'tel', target: config.business.phone }} variant="secondary" icon="phone" full />
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

  return (
    <SectionShell anchor={section.anchor} className="hg-hero">
      <span className="hg-hero__layer" data-wf-motion-layer aria-hidden="true">
        <span className="hg-hero__blob hg-hero__blob--a" data-wf-motion-shape />
        <span className="hg-hero__blob hg-hero__blob--b" data-wf-motion-shape />
      </span>

      <Container className="hg-hero__inner">
        <div className="hg-hero__copy" data-wf-entry="fade-up">
          {hero.eyebrow ? <p className="hg-hero__eyebrow">{hero.eyebrow}</p> : null}
          <h1 className="hg-hero__title">
            {hero.title} <em>{hero.titleHighlight}</em>
          </h1>
          <p className="hg-hero__paragraph">{hero.paragraph}</p>
          <div className="hg-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" size="lg" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="secondary" size="lg" /> : null}
          </div>
          {hero.note ? <p className="hg-hero__note">{hero.note}</p> : null}
          {hero.ratingBadge.enabled ? (
            <div className="hg-hero__rating">
              <StarRating rating={5} size={17} />
              <span>
                <strong>{hero.ratingBadge.score}</strong> · {hero.ratingBadge.countLabel} en {hero.ratingBadge.sourceLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="hg-hero__media" data-wf-entry="zoom-in" data-wf-media-frame>
          <Picture image={hero.image} loading="eager" className="hg-hero__image" data-wf-motion-image />
        </div>
      </Container>

      {hero.microBenefits.length > 0 ? (
        <Container>
          <ul className="hg-hero__values" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: hero.microBenefits.length }}>
            {hero.microBenefits.map((b, index) => (
              <li key={b.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 80}ms` }}>
                <span data-wf-card-icon>
                  <IconBadge icon={b.icon} size="md" />
                </span>
                <div data-wf-card-body>
                  <strong>{b.label}</strong>
                  <span>{b.description}</span>
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
/*                        Señales / problemas frecuentes                       */
/* -------------------------------------------------------------------------- */

function ProblemaCards({ items, limit }: { items: ReturnType<typeof activeItems>; limit?: number }) {
  const { runCta, config } = useSite();
  const list = limit ? items.slice(0, limit) : items;

  if (items.length === 0) {
    return (
      <p className="hg-empty">
        Todavía no hay problemas frecuentes configurados. Añádelos desde Contenido → Tipos de plaga: aparecerán
        aquí y en el formulario de revisión.
      </p>
    );
  }

  return (
    <div className="hg-problemas__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
      {list.map((item, index) => (
        <article
          key={item.id}
          className="hg-problemas__card"
          data-wf-card
          data-wf-entry="fade-up"
          style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
        >
          <span data-wf-card-icon>
            <IconBadge icon={itemText(item, 'icono', 'search')} size="lg" />
          </span>
          <div data-wf-card-body>
            <h3>{itemText(item, 'nombre')}</h3>
            <p>{itemText(item, 'resumen')}</p>
            {itemList(item, 'senales').length > 0 ? (
              <>
                <p className="hg-problemas__label">Señales habituales</p>
                <ul className="hg-list">
                  {itemList(item, 'senales').slice(0, 3).map((s) => (
                    <li key={s}>
                      <Icon name="check" size={14} />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <div data-wf-card-actions>
            <button
              type="button"
              className="wf-btn wf-btn--ghost wf-btn--sm"
              data-wf-button
              onClick={() => runCta({ label: 'Ver', kind: 'route', target: `${roleRoute(config, 'catalog', '/plagas')}/${itemText(item, 'slug')}` })}
            >
              Cómo reconocerlo
              <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

const Senales: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="hg-problemas">
      <Container>
        <Heading
          heading={{
            eyebrow: 'Problemas frecuentes',
            title: '¿Has notado algo en casa?',
            subtitle: 'Estas son las situaciones más habituales y las señales que las delatan. Sin alarmas: identificarlas pronto lo hace todo más sencillo.',
          }}
        />
        <ProblemaCards items={roleItems(config, 'catalog')} limit={6} />
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Proceso                                   */
/* -------------------------------------------------------------------------- */

const Proceso: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('process');
  const steps = config.content.processSteps.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (steps.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="hg-proceso">
      <Container>
        <Heading heading={heading} />
        <div className="hg-proceso__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: steps.length }}>
          {steps.map((step, index) => (
            <article key={step.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 90}ms` }}>
              <span className="hg-proceso__step" aria-hidden="true">
                {index + 1}
              </span>
              <span data-wf-card-icon>
                <IconBadge icon={step.icon} size="md" />
              </span>
              <div data-wf-card-body>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Prevención estacional                            */
/* -------------------------------------------------------------------------- */

function EstacionPanels({ items }: { items: ReturnType<typeof activeItems> }) {
  const { config } = useSite();
  const plagas = roleItems(config, 'catalog');
  const [active, setActive] = useState(0);

  if (items.length === 0) {
    return (
      <p className="hg-empty">
        Configura la prevención estacional desde Contenido → Prevención estacional. Puedes describir qué vigilar y
        qué hacer en cada época sin tocar código.
      </p>
    );
  }

  const current = items[Math.min(active, items.length - 1)];
  const relacionadas = plagas.filter((p) => (itemList(current, 'plagas') as string[]).includes(p.id));

  return (
    <div className="hg-estaciones">
      <div className="hg-estaciones__tabs" role="tablist" aria-label="Estaciones del año">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls="hg-estacion-panel"
            id={`hg-estacion-tab-${index}`}
            tabIndex={index === active ? 0 : -1}
            className={`hg-estaciones__tab${index === active ? ' is-active' : ''}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
              const next = event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? items.length - 1
                  : (index + direction + items.length) % items.length;
              setActive(next);
              const list = event.currentTarget.closest('[role="tablist"]');
              window.requestAnimationFrame(() => (list?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next])?.focus());
            }}
          >
            <IconBadge icon={itemText(item, 'icono', 'leaf')} size="sm" />
            <span>{ESTACION_LABEL[itemText(item, 'estacion')] ?? itemText(item, 'estacion')}</span>
          </button>
        ))}
      </div>

      <div
        className="hg-estaciones__panel"
        role="tabpanel"
        id="hg-estacion-panel"
        aria-labelledby={`hg-estacion-tab-${Math.min(active, items.length - 1)}`}
        data-wf-entry="fade"
      >
        <h3>{itemText(current, 'titulo')}</h3>
        <p className="hg-estaciones__resumen">{itemText(current, 'resumen')}</p>

        <div className="hg-estaciones__cols">
          {itemList(current, 'vigilar').length > 0 ? (
            <div>
              <h4>Qué vigilar</h4>
              <ul className="hg-list">
                {itemList(current, 'vigilar').map((v) => (
                  <li key={v}>
                    <Icon name="search" size={14} />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {itemList(current, 'acciones').length > 0 ? (
            <div>
              <h4>Qué puedes hacer</h4>
              <ul className="hg-list">
                {itemList(current, 'acciones').map((a) => (
                  <li key={a}>
                    <Icon name="check" size={14} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {relacionadas.length > 0 ? (
          <p className="hg-estaciones__plagas">
            <span>Más activas en esta época:</span>
            {relacionadas.map((p) => (
              <em key={p.id}>{itemText(p, 'nombre')}</em>
            ))}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const Estaciones: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="hg-prevencion">
      <Container>
        <Heading
          heading={{
            eyebrow: 'Prevención estacional',
            title: 'Cada época tiene lo suyo',
            subtitle: 'Saber qué mirar en cada estación evita la mayoría de los problemas antes de que aparezcan.',
          }}
        />
        <EstacionPanels items={roleItems(config, 'seasons')} />
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Tratamientos                                */
/* -------------------------------------------------------------------------- */

const Tratamientos: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const heading = useHeading('services');
  const services = config.services.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="hg-tratamientos">
      <Container>
        <Heading heading={heading} />
        <div className="hg-tratamientos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: Math.min(services.length, 4) }}>
          {services.map((service, index) => (
            <article
              key={service.id}
              className="hg-tratamientos__card"
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
                <ul className="hg-list">
                  {service.includes.slice(0, 4).map((i) => (
                    <li key={i}>
                      <Icon name="check" size={14} />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div data-wf-card-actions>
                <button
                  type="button"
                  className="wf-btn wf-btn--link wf-btn--sm"
                  data-wf-button
                  onClick={() => runCta({ label: service.name, kind: 'route', target: `${roleRoute(config, 'services', '/tratamientos')}/${service.slug}` })}
                >
                  Saber más
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
/*                             Plan de mantenimiento                           */
/* -------------------------------------------------------------------------- */

/**
 * Comparativa entre actuar una vez y mantener durante el año. Es una fila
 * comparable: las zonas van alineadas y los botones comparten línea aunque las
 * descripciones tengan longitudes distintas.
 */
function PlanComparativa({ items }: { items: ReturnType<typeof activeItems> }) {
  const { formatPrice, config } = useSite();
  if (items.length === 0) {
    return <p className="hg-empty">Añade planes desde Contenido → Planes de mantenimiento para compararlos aquí.</p>;
  }
  return (
    <div
      className="hg-plan__grid"
      data-wf-card-row
      data-wf-card-aligned="true"
      style={{ ['--wf-card-row-columns' as string]: Math.min(items.length, 3) }}
    >
      {items.map((plan, index) => {
        const precio = itemNumber(plan, 'precio');
        const destacado = itemBool(plan, 'destacado');
        return (
          <article
            key={plan.id}
            className="hg-plan__card"
            data-wf-card
            data-wf-card-highlight={destacado ? 'true' : undefined}
            data-wf-entry="fade-up"
            style={{ ['--wf-entry-delay' as string]: `${index * 80}ms` }}
          >
            {/* Cuatro hijos, uno por banda de la fila alineada. El hueco del
                distintivo se reserva siempre para que los precios coincidan. */}
            <header className="hg-plan__head">
              <span data-wf-card-flag-slot>
                {destacado ? <span className="hg-plan__flag">Recomendado</span> : null}
              </span>
              <h3>{itemText(plan, 'nombre')}</h3>
            </header>

            <p className="hg-plan__price">
              {precio !== null ? (
                <>
                  <strong>{formatPrice(precio)}</strong>
                  <span>/{itemText(plan, 'periodicidad', 'periodo')}</span>
                </>
              ) : (
                <em>Según la vivienda</em>
              )}
            </p>

            <div data-wf-card-body>
              <p className="hg-plan__resumen">{itemText(plan, 'resumen')}</p>
              <ul className="hg-list">
                {itemList(plan, 'incluye').map((i) => (
                  <li key={i}>
                    <Icon name="check" size={14} />
                    {i}
                  </li>
                ))}
              </ul>
              {itemList(plan, 'condiciones').length > 0 ? (
                <ul className="hg-plan__condiciones">
                  {itemList(plan, 'condiciones').map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div data-wf-card-actions>
              <CtaButton cta={revisionCta(config, itemText(plan, 'ctaLabel', 'Solicitar revisión'))} variant={destacado ? 'primary' : 'secondary'} full />
            </div>
          </article>
        );
      })}
    </div>
  );
}

const Plan: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('plans');
  return (
    <SectionShell anchor={section.anchor} className="hg-plan">
      <Container>
        <Heading heading={heading} />
        <PlanComparativa items={roleItems(config, 'plans')} />
        {config.content.pricingNote ? <p className="hg-plan__note">{config.content.pricingNote}</p> : null}
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Consejos                                  */
/* -------------------------------------------------------------------------- */

function ConsejoCards({ items, limit }: { items: ReturnType<typeof activeItems>; limit?: number }) {
  const { runCta, config } = useSite();
  const list = limit ? items.slice(0, limit) : items;

  if (items.length === 0) {
    return (
      <p className="hg-empty">
        Todavía no hay consejos publicados. Añádelos desde Contenido → Consejos y prevención.
      </p>
    );
  }

  return (
    <div className="hg-consejos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
      {list.map((consejo, index) => (
        <article
          key={consejo.id}
          className="hg-consejos__card"
          data-wf-card
          data-wf-entry="fade-up"
          style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
        >
          <div className="hg-consejos__media" data-wf-card-media>
            <Picture image={null} className="hg-consejos__image" />
          </div>
          <div data-wf-card-body>
            <p className="hg-consejos__cat">{itemText(consejo, 'categoria', 'prevencion')}</p>
            <h3>{itemText(consejo, 'titulo')}</h3>
            <p>{itemText(consejo, 'resumen')}</p>
          </div>
          <div data-wf-card-actions>
            <button
              type="button"
              className="wf-btn wf-btn--link wf-btn--sm"
              data-wf-button
              onClick={() => runCta({ label: 'Leer', kind: 'route', target: `${roleRoute(config, 'articles', '/consejos')}/${itemText(consejo, 'slug')}` })}
            >
              Leer el consejo
              <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

const Consejos: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="hg-consejos">
      <Container>
        <Heading
          heading={{
            eyebrow: 'Consejos',
            title: 'Cosas que puedes hacer tú',
            subtitle: 'Gestos sencillos que evitan la mayoría de las visitas que hacemos.',
          }}
        />
        <ConsejoCards items={roleItems(config, 'articles')} limit={3} />
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                          Testimonios, FAQ y cierre                          */
/* -------------------------------------------------------------------------- */

const Testimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('testimonials');
  const items = config.testimonials.filter((t) => t.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="hg-testimonials">
      <Container>
        <Heading heading={heading} />
        <div className="hg-testimonials__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: Math.min(items.length, 3) }}>
          {items.map((item, index) => (
            <figure key={item.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}>
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

const Faq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('faq');
  const faqs = config.faqs.filter((f) => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (faqs.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="hg-faq">
      <Container className="hg-faq__inner">
        <div data-wf-entry="slide-right">
          <Heading heading={heading} align="left" />
          <div className="hg-faq__help">
            <p>¿Tienes otra duda?</p>
            <CtaButton cta={{ label: `Llamar ${config.business.phone}`, kind: 'tel', target: config.business.phone }} variant="secondary" icon="phone" />
          </div>
        </div>
        <div data-wf-entry="fade-up">
          <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} mode="single" icon="chevron" />
        </div>
      </Container>
    </SectionShell>
  );
};

const FinalCta: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const cta = config.content.finalCta;
  return (
    <SectionShell anchor={section.anchor} className="hg-finalcta">
      <span className="hg-finalcta__layer" data-wf-motion-layer aria-hidden="true">
        <span className="hg-finalcta__blob" data-wf-motion-shape />
      </span>
      <Container className="hg-finalcta__inner" data-wf-motion-band>
        <div data-wf-entry="fade-up">
          <h2>{cta.title}</h2>
          <p>{cta.subtitle}</p>
        </div>
        <div className="hg-finalcta__actions" data-wf-entry="fade-up">
          <CtaButton cta={cta.cta} variant="primary" size="lg" />
          <CtaButton cta={{ label: config.business.phone, kind: 'tel', target: config.business.phone }} variant="secondary" size="lg" icon="phone" />
        </div>
      </Container>
    </SectionShell>
  );
};

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const items = config.navigation.items.filter((i) => i.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const zonas = roleItems(config, 'serviceAreas');

  return (
    <SectionShell anchor={section.anchor} as="footer" className="hg-footer">
      <Container className="hg-footer__inner">
        <div className="hg-footer__brand">
          <BrandMark icon="home" size={28} />
          <p>{config.content.footerTagline}</p>
          <div className="hg-footer__contact">
            <button type="button" data-wf-button onClick={() => runCta({ label: config.business.phone, kind: 'tel', target: config.business.phone })}>
              <Icon name="phone" size={15} /> {config.business.phone}
            </button>
            <button type="button" data-wf-button onClick={() => runCta({ label: config.business.email, kind: 'mailto', target: config.business.email })}>
              <Icon name="mail" size={15} /> {config.business.email}
            </button>
          </div>
        </div>

        <nav className="hg-footer__nav" aria-label="Páginas">
          <h3>Navegación</h3>
          {items.map((item) => (
            <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hg-footer__zonas">
          <h3>Dónde trabajamos</h3>
          <p>{config.business.serviceArea}</p>
          <ul>
            {zonas.slice(0, 8).map((z) => (
              <li key={z.id}>{itemText(z, 'nombre')}</li>
            ))}
          </ul>
        </div>

        <div className="hg-footer__hours">
          <h3>Horario</h3>
          <ul>
            {config.business.openingHours.map((h) => (
              <li key={h.label}>
                <span>{h.label}</span>
                <strong>{h.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="hg-footer__legal">
        <p>{config.content.footerSignature}</p>
        <nav aria-label="Textos legales">
          <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: roleRoute(config, 'legalNotice', '/aviso-legal') })}>Aviso legal</button>
          <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: roleRoute(config, 'privacy', '/privacidad') })}>Política de privacidad</button>
          <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: roleRoute(config, 'cookies', '/cookies') })}>Política de cookies</button>
        </nav>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                             Páginas secundarias                             */
/* -------------------------------------------------------------------------- */

function PageHero({ eyebrow, title, subtitle, actions }: { eyebrow: string; title: string; subtitle: string; actions?: React.ReactNode }) {
  return (
    <div className="hg-pagehero" data-wf-entry="fade-up">
      <Container>
        <p className="hg-pagehero__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {subtitle ? <p className="hg-pagehero__subtitle">{subtitle}</p> : null}
        {actions ? <div className="hg-pagehero__actions">{actions}</div> : null}
      </Container>
    </div>
  );
}

const PageHogar: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const benefits = config.content.benefits.filter((b) => b.enabled);
  const steps = config.content.processSteps.filter((s) => s.enabled);
  const sectores = roleItems(config, 'segments');

  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Hogar protegido"
        title="Qué significa cuidar una vivienda"
        subtitle="Trabajamos en pisos, casas, comunidades y segundas residencias. Cada una tiene sus puntos débiles y su calendario."
        actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <div className="hg-values__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
          {benefits.map((b, index) => (
            <article key={b.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}>
              <span data-wf-card-icon>
                <IconBadge icon={b.icon} size="md" />
              </span>
              <div data-wf-card-body>
                <h2>{b.title}</h2>
                <p>{b.description}</p>
              </div>
            </article>
          ))}
        </div>

        {sectores.length > 0 ? (
          <div className="hg-tipos" data-wf-entry="fade-up">
            <h2>Tipos de vivienda que atendemos</h2>
            <div className="hg-tipos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
              {sectores.map((s) => (
                <article key={s.id} data-wf-card>
                  <span data-wf-card-icon>
                    <IconBadge icon={itemText(s, 'icono', 'home')} size="sm" />
                  </span>
                  <div data-wf-card-body>
                    <h3>{itemText(s, 'nombre')}</h3>
                    <p>{itemText(s, 'resumen')}</p>
                  </div>
                  <div data-wf-card-actions>
                    <CtaButton cta={{ label: 'Ver este hogar', kind: 'route', target: `${roleRoute(config, 'segments', '/sectores')}/${itemText(s, 'slug')}` }} variant="ghost" size="sm" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="hg-proceso__grid hg-proceso__grid--page" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: steps.length }}>
          {steps.map((step, index) => (
            <article key={step.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}>
              <span className="hg-proceso__step" aria-hidden="true">{index + 1}</span>
              <div data-wf-card-body>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

const PageProblemas: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const problemSlug = useSlug(roleRoute(config, 'catalog', '/problemas'));
  // Esta template registra además `/plagas/{slug}` como ruta de detalle propia,
  // heredada de su estructura original. Se conserva literal: no es un destino
  // semántico, es una segunda ruta que la propia template publica.
  const plagaSlug = useSlug('/plagas');
  const slug = problemSlug ?? plagaSlug;
  const plagas = roleItems(config, 'catalog');
  const current = slug ? plagas.find((p) => itemText(p, 'slug') === slug) : null;

  if (slug && !current) {
    return (
      <SectionShell anchor={section.anchor} className="hg-page">
        <PageHero eyebrow="Problemas frecuentes" title="No encontrado" subtitle="El elemento solicitado no existe o se ha desactivado." />
        <Container>
          <CtaButton cta={{ label: 'Ver todos los problemas', kind: 'route', target: roleRoute(config, 'catalog', '/problemas') }} variant="primary" />
        </Container>
      </SectionShell>
    );
  }

  if (current) {
    return (
      <SectionShell anchor={section.anchor} className="hg-page">
        <PageHero
          eyebrow="Problema frecuente"
          title={itemText(current, 'nombre')}
          subtitle={itemText(current, 'resumen')}
          actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />}
        />
        <Container className="hg-page__split">
          <div className="hg-page__main" data-wf-entry="fade-up">
            <p className="hg-page__lead">{itemText(current, 'descripcion')}</p>

            {itemList(current, 'senales').length > 0 ? (
              <>
                <h2>Señales habituales</h2>
                <ul className="hg-checklist">
                  {itemList(current, 'senales').map((s) => (
                    <li key={s}>
                      <Icon name="search" size={18} />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2>Dónde suele aparecer</h2>
            <p>
              Las zonas más habituales en una vivienda son cocina, baños, trasteros, terrazas y los puntos por donde
              pasan instalaciones. Si has visto algo, fíjate primero ahí.
            </p>

            <h2>Qué puedes hacer mientras tanto</h2>
            <ul className="hg-checklist">
              <li>
                <Icon name="check" size={18} />
                Guardar los alimentos en recipientes cerrados y recoger restos.
              </li>
              <li>
                <Icon name="check" size={18} />
                Mantener secas las zonas de fregado y revisar posibles humedades.
              </li>
              <li>
                <Icon name="check" size={18} />
                Anotar dónde y a qué hora lo has visto: nos ayuda mucho en la revisión.
              </li>
            </ul>

            {itemText(current, 'tratamiento') ? (
              <>
                <h2>Cómo lo tratamos</h2>
                <p>{itemText(current, 'tratamiento')}</p>
              </>
            ) : null}
          </div>

          <aside className="hg-page__aside" data-wf-entry="fade-up">
            <div className="hg-card" data-wf-card>
              <h3>¿Lo revisamos?</h3>
              <p>Sin compromiso. Miramos, te explicamos qué hemos visto y decides después.</p>
              {itemText(current, 'temporada') ? (
                <dl className="hg-facts">
                  <dt>Época de más actividad</dt>
                  <dd>{itemText(current, 'temporada')}</dd>
                </dl>
              ) : null}
              <div data-wf-card-actions>
                <CtaButton cta={revisionCta(config)} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Problemas frecuentes"
        title="¿Qué has notado en casa?"
        subtitle="Identifica la situación que más se parezca a la tuya. Cada ficha explica sus señales y qué puedes hacer."
        actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <ProblemaCards items={plagas} />
      </Container>
    </SectionShell>
  );
};

const PagePrevencion: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Prevención estacional"
        title="Un calendario para tu casa"
        subtitle="Qué conviene revisar en cada estación del año, con acciones concretas que puedes hacer tú."
        actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <EstacionPanels items={roleItems(config, 'seasons')} />
      </Container>
    </SectionShell>
  );
};

const PageTratamientos: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const slug = useSlug(roleRoute(config, 'services', '/tratamientos'));
  const services = config.services.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const current = slug ? services.find((s) => s.slug === slug) : null;

  if (current) {
    return (
      <SectionShell anchor={section.anchor} className="hg-page">
        <PageHero
          eyebrow="Tratamiento"
          title={current.name}
          subtitle={current.shortDescription}
          actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />}
        />
        <Container className="hg-page__split">
          <div className="hg-page__main" data-wf-entry="fade-up">
            <p className="hg-page__lead">{current.longDescription}</p>
            {current.includes.length > 0 ? (
              <>
                <h2>Qué incluye</h2>
                <ul className="hg-checklist">
                  {current.includes.map((i) => (
                    <li key={i}>
                      <Icon name="checkCircle" size={18} />
                      {i}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <aside className="hg-page__aside" data-wf-entry="fade-up">
            <div className="hg-card" data-wf-card>
              <h3>Antes de contratar</h3>
              <p>{config.content.pricingNote}</p>
              <div data-wf-card-actions>
                <CtaButton cta={revisionCta(config)} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Tratamientos"
        title="Qué podemos hacer"
        subtitle="Siempre empezamos por la opción menos invasiva que resuelva tu caso."
        actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <div className="hg-tratamientos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
          {services.map((service, index) => (
            <article key={service.id} className="hg-tratamientos__card" data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}>
              <span data-wf-card-icon>
                <IconBadge icon={service.icon} accent={`var(--wf-${service.accent})`} size="lg" />
              </span>
              <div data-wf-card-body>
                <h2>{service.name}</h2>
                <p>{service.longDescription || service.shortDescription}</p>
                <ul className="hg-list">
                  {service.includes.map((i) => (
                    <li key={i}>
                      <Icon name="check" size={14} />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div data-wf-card-actions>
                <button type="button" className="wf-btn wf-btn--ghost wf-btn--sm" data-wf-button onClick={() => runCta({ label: service.name, kind: 'route', target: `${roleRoute(config, 'services', '/tratamientos')}/${service.slug}` })}>
                  Ver ficha
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

const PagePlan: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Plan de mantenimiento"
        title="Una vez o durante todo el año"
        subtitle="No todas las viviendas necesitan un plan. Aquí puedes comparar las dos formas de trabajar y decidir con calma."
      />
      <Container>
        <PlanComparativa items={roleItems(config, 'plans')} />
        {config.content.pricingNote ? <p className="hg-plan__note">{config.content.pricingNote}</p> : null}
        <div className="hg-plan__extras">
          <h2>En cualquiera de los casos</h2>
          <ul className="hg-checklist">
            {config.content.packagesSideBenefits.map((b) => (
              <li key={b}>
                <Icon name="checkCircle" size={18} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </SectionShell>
  );
};

const PageConsejos: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const slug = useSlug(roleRoute(config, 'articles', '/consejos'));
  const consejos = roleItems(config, 'articles');
  const current = slug ? consejos.find((c) => itemText(c, 'slug') === slug) : null;

  if (current) {
    return (
      <SectionShell anchor={section.anchor} className="hg-page">
        <PageHero
          eyebrow={itemText(current, 'categoria', 'Consejo')}
          title={itemText(current, 'titulo')}
          subtitle={itemText(current, 'resumen')}
        />
        <Container className="hg-page__split">
          <div className="hg-page__main" data-wf-entry="fade-up">
            <p className="hg-page__lead">{itemText(current, 'cuerpo')}</p>
            {itemList(current, 'pasos').length > 0 ? (
              <>
                <h2>Pasos recomendados</h2>
                <ul className="hg-checklist">
                  {itemList(current, 'pasos').map((p) => (
                    <li key={p}>
                      <Icon name="checkCircle" size={18} />
                      {p}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <aside className="hg-page__aside" data-wf-entry="fade-up">
            <div className="hg-card" data-wf-card>
              <h3>¿Prefieres que lo veamos nosotros?</h3>
              <p>Una revisión sin compromiso resuelve la duda en poco tiempo.</p>
              <div data-wf-card-actions>
                <CtaButton cta={revisionCta(config)} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Consejos"
        title="Cosas que puedes hacer tú"
        subtitle="Gestos sencillos que evitan la mayoría de los problemas domésticos."
      />
      <Container>
        <ConsejoCards items={consejos} />
      </Container>
    </SectionShell>
  );
};

const PageNosotros: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const team = config.team.filter((t) => t.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const benefits = config.content.benefits.filter((b) => b.enabled);

  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Sobre nosotros"
        title={`Quiénes somos en ${config.business.name}`}
        subtitle={config.business.tagline}
        actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <div className="hg-values__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
          {benefits.map((b, index) => (
            <article key={b.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}>
              <span data-wf-card-icon>
                <IconBadge icon={b.icon} size="md" />
              </span>
              <div data-wf-card-body>
                <h2>{b.title}</h2>
                <p>{b.description}</p>
              </div>
            </article>
          ))}
        </div>

        {team.length > 0 ? (
          <div className="hg-team" data-wf-entry="fade-up">
            <h2>El equipo</h2>
            <div className="hg-team__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
              {team.map((m) => (
                <article key={m.id} data-wf-card>
                  <div className="hg-team__media" data-wf-card-media>
                    <Picture image={m.photo} />
                  </div>
                  <div data-wf-card-body>
                    <h3>{m.name}</h3>
                    <p className="hg-team__role">{m.role}</p>
                    <p>{m.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </SectionShell>
  );
};

const PageSector: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const slug = useSlug(roleRoute(config, 'segments', '/sectores'));
  const current = slug
    ? roleItems(config, 'segments').find((item) => itemText(item, 'slug') === slug)
    : null;
  if (!current) {
    return <SectionShell anchor={section.anchor} className="hg-page"><PageHero eyebrow="Hogares" title="Tipo de vivienda no encontrado" subtitle="El contenido solicitado no existe o ya no está publicado." actions={<CtaButton cta={{ label: 'Volver a Hogar protegido', kind: 'route', target: '/hogar-protegido' }} variant="primary" />} /></SectionShell>;
  }
  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero eyebrow="Hogar protegido" title={itemText(current, 'nombre')} subtitle={itemText(current, 'resumen')} actions={<CtaButton cta={revisionCta(config)} variant="primary" size="lg" />} />
      <Container className="hg-page__split">
        <article className="hg-page__main" data-wf-entry="fade-up">
          <p className="hg-page__lead">{itemText(current, 'descripcion', 'Cada vivienda necesita una revisión adaptada a sus accesos, zonas húmedas, almacenaje y hábitos cotidianos.')}</p>
          <h2>Qué revisamos primero</h2>
          <ul className="hg-checklist">{itemList(current, 'necesidades').map((need) => <li key={need}><Icon name="checkCircle" size={18} />{need}</li>)}</ul>
          <h2>Prevención cercana</h2>
          <p>Explicamos las señales, priorizamos medidas compatibles con la vivienda y tenemos en cuenta la presencia de niños o mascotas indicada en la solicitud.</p>
        </article>
        <aside className="hg-page__aside"><div className="hg-card" data-wf-card><h3>Una revisión sin compromiso</h3><p>Cuéntanos la localidad y lo que has observado para preparar la visita.</p><div data-wf-card-actions><CtaButton cta={revisionCta(config)} variant="primary" full /></div></div></aside>
      </Container>
    </SectionShell>
  );
};

const PageFaq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const faqs = config.faqs.filter((f) => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <SectionShell anchor={section.anchor} className="hg-page">
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Lo que suelen preguntarnos"
        subtitle="Y si tienes otra duda, te la resolvemos por teléfono sin compromiso."
        actions={<CtaButton cta={{ label: `Llamar ${config.business.phone}`, kind: 'tel', target: config.business.phone }} variant="secondary" size="lg" icon="phone" />}
      />
      <Container>
        {faqs.length === 0 ? (
          <p className="hg-empty">Añade preguntas frecuentes desde Contenido.</p>
        ) : (
          <div data-wf-entry="fade-up">
            <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} mode="multiple" icon="chevron" />
          </div>
        )}
      </Container>
    </SectionShell>
  );
};

const PageRevision: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const form = getForm(config.forms ?? [], 'solicitar-revision');
  const steps = config.content.processSteps.filter((s) => s.enabled);

  return (
    <SectionShell anchor={section.anchor} className="hg-page hg-page--revision">
      <PageHero
        eyebrow="Solicitar revisión"
        title="Empecemos por una revisión"
        subtitle="Cuéntanos qué has notado y buscamos el momento que mejor te venga. Sin compromiso."
      />
      <Container className="hg-revision">
        <div className="hg-revision__form" data-wf-entry="fade-up">
          {form ? <SiteForm form={form} columns={2} /> : <p className="hg-empty">No hay ningún formulario configurado.</p>}
        </div>
        <aside className="hg-revision__aside" data-wf-entry="fade-up">
          <div className="hg-card" data-wf-card>
            <h3>Cómo va a ser</h3>
            <ol className="hg-revision__steps">
              {steps.map((s) => (
                <li key={s.id}>
                  <strong>{s.title}</strong>
                  <span>{s.description}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="hg-card" data-wf-card>
            <h3>Prefieres llamarnos</h3>
            <p>
              {config.business.phone} · {config.business.email}
            </p>
            <p className="hg-revision__hours">{config.business.openingHours.map((h) => `${h.label}: ${h.value}`).join(' · ')}</p>
            <div data-wf-card-actions>
              <CtaButton cta={{ label: 'Llamar', kind: 'tel', target: config.business.phone }} variant="secondary" icon="phone" full />
            </div>
          </div>
        </aside>
      </Container>
    </SectionShell>
  );
};

const PageLegal: SectionComponent = ({ section }) => {
  const { config, route } = useSite();
  const legal = config.content.legal;
  const normalized = route.split('?')[0].replace(/\/+$/, '');
  const doc = normalized === '/privacidad' ? legal.privacy : normalized === '/cookies' ? legal.cookies : legal.legalNotice;
  return (
    <SectionShell anchor={section.anchor} className="hg-page hg-page--legal">
      <PageHero eyebrow="Información legal" title={doc.title} subtitle="" />
      <Container>
        <div className="hg-legal" data-wf-entry="fade-up">
          {doc.body.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Registro                                   */
/* -------------------------------------------------------------------------- */

export const PLAGAS_HOGAR_SECTIONS: Record<string, SectionComponent> = {
  'hg-header-01': Header,
  'hg-hero-01': Hero,
  'hg-senales-01': Senales,
  'hg-proceso-01': Proceso,
  'hg-estaciones-01': Estaciones,
  'hg-tratamientos-01': Tratamientos,
  'hg-plan-01': Plan,
  'hg-consejos-01': Consejos,
  'hg-testimonials-01': Testimonials,
  'hg-faq-01': Faq,
  'hg-finalcta-01': FinalCta,
  'hg-footer-01': Footer,
  'hg-page-hogar-01': PageHogar,
  'hg-page-problemas-01': PageProblemas,
  'hg-page-prevencion-01': PagePrevencion,
  'hg-page-tratamientos-01': PageTratamientos,
  'hg-page-plan-01': PagePlan,
  'hg-page-consejos-01': PageConsejos,
  'hg-page-sector-01': PageSector,
  'hg-page-nosotros-01': PageNosotros,
  'hg-page-faq-01': PageFaq,
  'hg-page-revision-01': PageRevision,
  'hg-page-legal-01': PageLegal,
};
