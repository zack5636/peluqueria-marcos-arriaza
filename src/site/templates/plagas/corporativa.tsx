/**
 * Gestión Integral · Corporativa — secciones.
 *
 * Composición propia, no una revisión de «Respuesta rápida»: la cabecera es
 * técnica y sin barra de urgencias, el método aparece antes que el catálogo,
 * las soluciones se organizan por problema o por sector mediante pestañas, y el
 * cierre es una propuesta escrita en lugar de una llamada.
 *
 * Ningún nombre de solución, sector, plan o caso está escrito aquí: todo
 * procede de las colecciones editables del proyecto.
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

const propuestaCta = (config: SiteConfig, label = 'Solicitar propuesta'): Cta => ({
  label,
  kind: 'route',
  target: roleRoute(config, 'contact', '/solicitar-propuesta'),
});

/** `Pregunta :: Respuesta` -> par utilizable por el acordeón. */
function parseFaqLines(lines: string[]): { id: string; question: string; answer: string }[] {
  return lines
    .map((line, index) => {
      const [question, ...rest] = line.split('::');
      const answer = rest.join('::').trim();
      if (!question?.trim() || !answer) return null;
      return { id: `faq-${index}`, question: question.trim(), answer };
    })
    .filter((x): x is { id: string; question: string; answer: string } => x !== null);
}

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
    <SectionShell anchor={section.anchor} as="header" className="co-header" label="Cabecera">
      <div className={`co-header__bar${stuck ? ' is-stuck' : ''}`} data-wf-header>
        <Container className="co-header__inner">
          <button type="button" className="co-header__brand" onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}>
            <BrandMark icon="shield" size={28} />
            <span>
              <strong>{config.business.name}</strong>
              <em>{config.business.descriptor}</em>
            </span>
          </button>

          <nav className="co-header__nav" aria-label="Navegación principal">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`co-header__link${activeId === item.id ? ' is-active' : ''}`}
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={() => runCta(item.cta)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="co-header__actions">
            <button
              type="button"
              className="co-header__phone"
              data-wf-button
              onClick={() => runCta({ label: config.business.phone, kind: 'tel', target: config.business.phone })}
            >
              <Icon name="phone" size={15} />
              {config.business.phone}
            </button>
            <CtaButton cta={config.navigation.primaryCta} variant="primary" size="sm" icon="fileText" />
            <button
              ref={burgerRef}
              type="button"
              className="co-header__burger"
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
          <div className="co-drawer__actions">
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
  const sectores = roleItems(config, 'segments');

  return (
    <SectionShell anchor={section.anchor} className="co-hero">
      <span className="co-hero__layer" data-wf-motion-layer aria-hidden="true">
        <span className="co-hero__grid" data-wf-motion-band />
      </span>
      <Container className="co-hero__inner">
        <div className="co-hero__copy" data-wf-entry="fade-up">
          {hero.eyebrow ? <p className="co-hero__eyebrow">{hero.eyebrow}</p> : null}
          <h1 className="co-hero__title">
            {hero.title} <em>{hero.titleHighlight}</em>
          </h1>
          <p className="co-hero__paragraph">{hero.paragraph}</p>
          <div className="co-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" size="lg" icon="fileText" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="secondary" size="lg" /> : null}
          </div>
          {hero.note ? <p className="co-hero__note">{hero.note}</p> : null}
        </div>

        <div className="co-hero__media" data-wf-entry="fade-up" data-wf-media-frame>
          <Picture image={hero.image} loading="eager" className="co-hero__image" data-wf-motion-image />
        </div>
      </Container>

      {hero.microBenefits.length > 0 ? (
        <Container>
          <ul
            className="co-hero__facts"
            data-wf-card-row
            style={{ ['--wf-card-row-columns' as string]: hero.microBenefits.length }}
          >
            {hero.microBenefits.map((benefit, index) => (
              <li key={benefit.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}>
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

      {sectores.length > 0 ? (
        <Container>
          <p className="co-hero__sectors" data-wf-entry="fade">
            <span>Trabajamos para</span>
            {sectores.slice(0, 6).map((s) => (
              <em key={s.id}>{itemText(s, 'nombre')}</em>
            ))}
          </p>
        </Container>
      ) : null}
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Método (proceso corto)                           */
/* -------------------------------------------------------------------------- */

const Metodo: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('process');
  const steps = config.content.processSteps.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (steps.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="co-metodo">
      <Container>
        <Heading heading={heading} align="left" />
        <ol className="co-metodo__track">
          {steps.map((step, index) => (
            <li key={step.id} data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 90}ms` }}>
              <span className="co-metodo__dot" aria-hidden="true">
                {index + 1}
              </span>
              <div>
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
/*                         Soluciones (problema / sector)                      */
/* -------------------------------------------------------------------------- */

function SolucionCards({ items, sectores }: { items: ReturnType<typeof activeItems>; sectores: ReturnType<typeof activeItems> }) {
  const { runCta, config } = useSite();
  if (items.length === 0) {
    return (
      <p className="co-empty">
        No hay soluciones en esta vista todavía. Añádelas desde Contenido → Soluciones y elige cómo organizarlas.
      </p>
    );
  }
  return (
    <div className="co-soluciones__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
      {items.map((item, index) => {
        const sector = sectores.find((s) => s.id === itemText(item, 'sector'));
        return (
          <article
            key={item.id}
            className="co-soluciones__card"
            data-wf-card
            data-wf-entry="fade-up"
            style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
          >
            <span data-wf-card-icon>
              <IconBadge icon={itemText(item, 'icono', 'shield')} size="lg" />
            </span>
            <div data-wf-card-body>
              <h3>{itemText(item, 'nombre')}</h3>
              {sector ? <p className="co-soluciones__sector">{itemText(sector, 'nombre')}</p> : null}
              <p>{itemText(item, 'resumen')}</p>
              {itemList(item, 'beneficios').length > 0 ? (
                <ul className="co-list">
                  {itemList(item, 'beneficios').slice(0, 3).map((b) => (
                    <li key={b}>
                      <Icon name="check" size={14} />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
              {itemText(item, 'duracion') || itemText(item, 'periodicidad') ? (
                <p className="co-soluciones__meta">
                  {itemText(item, 'duracion') ? (
                    <span>
                      <Icon name="clock" size={13} /> {itemText(item, 'duracion')}
                    </span>
                  ) : null}
                  {itemText(item, 'periodicidad') ? (
                    <span>
                      <Icon name="calendar" size={13} /> {itemText(item, 'periodicidad')}
                    </span>
                  ) : null}
                </p>
              ) : null}
            </div>
            <div data-wf-card-actions>
              <button
                type="button"
                className="wf-btn wf-btn--ghost wf-btn--sm"
                data-wf-button
                onClick={() => runCta({ label: 'Ver', kind: 'route', target: `${roleRoute(config, 'services', '/soluciones')}/${itemText(item, 'slug')}` })}
              >
                Ver metodología
                <Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

const Soluciones: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('services');
  const all = roleItems(config, 'services');
  const sectores = roleItems(config, 'segments');
  const [view, setView] = useState<'problema' | 'sector'>('problema');
  const visible = all.filter((s) => itemText(s, 'enfoque', 'problema') === view);

  return (
    <SectionShell anchor={section.anchor} className="co-soluciones">
      <Container>
        <div className="co-soluciones__head">
          <Heading heading={heading} align="left" />
          {/* Las dos vistas son del mismo dato: cambia el criterio, no el contenido. */}
          <div className="co-tabs" role="tablist" aria-label="Organizar soluciones">
            {(['problema', 'sector'] as const).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                className={`co-tabs__tab${view === id ? ' is-active' : ''}`}
                onClick={() => setView(id)}
              >
                {id === 'problema' ? 'Por problema' : 'Por sector'}
              </button>
            ))}
          </div>
        </div>
        <SolucionCards items={visible} sectores={sectores} />
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Sectores                                   */
/* -------------------------------------------------------------------------- */

const Sectores: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const sectores = roleItems(config, 'segments');
  if (sectores.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="co-sectores">
      <Container>
        <Heading
          heading={{
            eyebrow: 'Sectores profesionales',
            title: 'Cada actividad tiene sus exigencias',
            subtitle: 'Adaptamos método, horario y documentación al tipo de instalación.',
          }}
          align="left"
        />
        <div className="co-sectores__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
          {sectores.map((sector, index) => (
            <article
              key={sector.id}
              className="co-sectores__card"
              data-wf-card
              data-wf-entry="fade-up"
              style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}
            >
              <span data-wf-card-icon>
                <IconBadge icon={itemText(sector, 'icono', 'building')} size="md" />
              </span>
              <div data-wf-card-body>
                <h3>{itemText(sector, 'nombre')}</h3>
                <p>{itemText(sector, 'resumen')}</p>
              </div>
              <div data-wf-card-actions>
                <button
                  type="button"
                  className="wf-btn wf-btn--link wf-btn--sm"
                  data-wf-button
                  onClick={() => runCta({ label: 'Ver', kind: 'route', target: `${roleRoute(config, 'segments', '/sectores')}/${itemText(sector, 'slug')}` })}
                >
                  Ver metodología del sector
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
/*                          Planes de mantenimiento                            */
/* -------------------------------------------------------------------------- */

/**
 * Fila comparable. La altura la iguala `cards.css` y las acciones se empujan al
 * fondo con la distribución flex, no con márgenes por tarjeta.
 */
function PlanCards({ items }: { items: ReturnType<typeof activeItems> }) {
  const { formatPrice, config } = useSite();
  if (items.length === 0) {
    return <p className="co-empty">Añade planes desde Contenido → Planes de mantenimiento para compararlos aquí.</p>;
  }
  return (
    <div
      className="co-planes__grid"
      data-wf-card-row
      data-wf-card-aligned="true"
      style={{ ['--wf-card-row-columns' as string]: Math.min(items.length, 3) }}
    >
      {items.map((plan, index) => {
        const price = itemNumber(plan, 'precio');
        const destacado = itemBool(plan, 'destacado');
        return (
          <article
            key={plan.id}
            className="co-planes__card"
            data-wf-card
            data-wf-card-highlight={destacado ? 'true' : undefined}
            data-wf-entry="fade-up"
            style={{ ['--wf-entry-delay' as string]: `${index * 80}ms` }}
          >
            {/* Cuatro hijos, uno por banda de la fila alineada. El hueco del
                distintivo se reserva siempre para que los precios coincidan. */}
            <header className="co-planes__head">
              <span data-wf-card-flag-slot>
                {destacado ? <span className="co-planes__flag">Más contratado</span> : null}
              </span>
              <h3>{itemText(plan, 'nombre')}</h3>
            </header>

            <p className="co-planes__price">
              {price !== null ? (
                <>
                  <strong>{formatPrice(price)}</strong>
                  <span>/{itemText(plan, 'periodicidad', 'periodo')}</span>
                </>
              ) : (
                <em>Precio a medida</em>
              )}
            </p>

            <div data-wf-card-body>
              <p className="co-planes__resumen">{itemText(plan, 'resumen')}</p>
              <ul className="co-list">
                {itemList(plan, 'incluye').map((linea) => (
                  <li key={linea}>
                    <Icon name="check" size={14} />
                    {linea}
                  </li>
                ))}
              </ul>
              {itemList(plan, 'condiciones').length > 0 ? (
                <ul className="co-planes__condiciones">
                  {itemList(plan, 'condiciones').map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div data-wf-card-actions>
              <CtaButton
                cta={propuestaCta(config, itemText(plan, 'ctaLabel', 'Solicitar propuesta'))}
                variant={destacado ? 'primary' : 'secondary'}
                full
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

const Planes: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('plans');
  const planes = roleItems(config, 'plans');

  return (
    <SectionShell anchor={section.anchor} className="co-planes">
      <Container>
        <Heading heading={heading} />
        <PlanCards items={planes} />
        {config.content.pricingNote ? <p className="co-planes__note">{config.content.pricingNote}</p> : null}
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Diferencias / ventajas                           */
/* -------------------------------------------------------------------------- */

const Diferencias: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('benefits');
  const items = config.content.benefits.filter((b) => b.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="co-diferencias">
      <Container className="co-diferencias__inner">
        <div data-wf-entry="slide-right">
          <Heading heading={heading} align="left" />
          <div className="co-diferencias__cta">
            <CtaButton cta={propuestaCta(config)} variant="primary" icon="fileText" />
          </div>
        </div>
        <div className="co-diferencias__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
          {items.map((item, index) => (
            <article key={item.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}>
              <span data-wf-card-icon>
                <IconBadge icon={item.icon} accent={`var(--wf-${item.accent})`} size="md" />
              </span>
              <div data-wf-card-body>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Casos de éxito                                */
/* -------------------------------------------------------------------------- */

function CasoCards({ items, limit }: { items: ReturnType<typeof activeItems>; limit?: number }) {
  const { config, runCta } = useSite();
  const sectores = roleItems(config, 'segments');
  const list = limit ? items.slice(0, limit) : items;

  if (items.length === 0) {
    return (
      <p className="co-empty">
        Todavía no hay casos publicados. Añádelos desde Contenido → Casos de éxito, con la situación de partida y
        el resultado real de cada intervención.
      </p>
    );
  }

  return (
    <div className="co-casos__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
      {list.map((caso, index) => {
        const sector = sectores.find((s) => s.id === itemText(caso, 'sector'));
        return (
          <article
            key={caso.id}
            className="co-casos__card"
            data-wf-card
            data-wf-entry="fade-up"
            style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}
          >
            <div className="co-casos__media" data-wf-card-media>
              <Picture image={null} className="co-casos__image" />
            </div>
            <div data-wf-card-body>
              {sector ? <p className="co-casos__sector">{itemText(sector, 'nombre')}</p> : null}
              <h3>{itemText(caso, 'titulo')}</h3>
              <p>{itemText(caso, 'problema')}</p>
            </div>
            <div data-wf-card-actions>
              <button
                type="button"
                className="wf-btn wf-btn--link wf-btn--sm"
                data-wf-button
                onClick={() => runCta({ label: 'Ver caso', kind: 'route', target: `${roleRoute(config, 'cases', '/casos')}/${itemText(caso, 'slug')}` })}
              >
                Ver el caso completo
                <Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

const Casos: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('gallery');
  return (
    <SectionShell anchor={section.anchor} className="co-casos">
      <Container>
        <Heading heading={heading} align="left" />
        <CasoCards items={roleItems(config, 'cases')} limit={3} />
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                          Testimonios / FAQ / cierre                         */
/* -------------------------------------------------------------------------- */

const Testimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const heading = useHeading('testimonials');
  const items = config.testimonials.filter((t) => t.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="co-testimonials">
      <Container>
        <Heading heading={heading} align="left" />
        <div className="co-testimonials__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: Math.min(items.length, 3) }}>
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
    <SectionShell anchor={section.anchor} className="co-faq">
      <Container>
        <Heading heading={heading} align="left" />
        <div data-wf-entry="fade-up">
          <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} mode="multiple" icon="chevron" />
        </div>
      </Container>
    </SectionShell>
  );
};

const FinalCta: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const cta = config.content.finalCta;
  return (
    <SectionShell anchor={section.anchor} className="co-finalcta">
      <Container className="co-finalcta__inner" data-wf-motion-band>
        <div data-wf-entry="fade-up">
          <h2>{cta.title}</h2>
          <p>{cta.subtitle}</p>
        </div>
        <div className="co-finalcta__actions" data-wf-entry="fade-up">
          <CtaButton cta={cta.cta} variant="primary" size="lg" icon="fileText" />
          <CtaButton cta={{ label: config.business.phone, kind: 'tel', target: config.business.phone }} variant="inverse" size="lg" icon="phone" />
        </div>
      </Container>
    </SectionShell>
  );
};

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const items = config.navigation.items.filter((i) => i.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const sectores = roleItems(config, 'segments');

  return (
    <SectionShell anchor={section.anchor} as="footer" className="co-footer">
      <Container className="co-footer__inner">
        <div className="co-footer__brand">
          <BrandMark icon="shield" size={28} inverse />
          <p>{config.content.footerTagline}</p>
          <div className="co-footer__contact">
            <button type="button" data-wf-button onClick={() => runCta({ label: config.business.phone, kind: 'tel', target: config.business.phone })}>
              <Icon name="phone" size={15} /> {config.business.phone}
            </button>
            <button type="button" data-wf-button onClick={() => runCta({ label: config.business.email, kind: 'mailto', target: config.business.email })}>
              <Icon name="mail" size={15} /> {config.business.email}
            </button>
            <span>
              <Icon name="pin" size={15} /> {config.business.address.line1}, {config.business.address.postalCode} {config.business.address.city}
            </span>
          </div>
        </div>

        <nav className="co-footer__nav" aria-label="Páginas">
          <h3>Navegación</h3>
          {items.map((item) => (
            <button key={item.id} type="button" onClick={() => runCta(item.cta)}>
              {item.label}
            </button>
          ))}
        </nav>

        <nav className="co-footer__nav" aria-label="Sectores">
          <h3>Sectores</h3>
          {sectores.slice(0, 6).map((s) => (
            <button key={s.id} type="button" onClick={() => runCta({ label: itemText(s, 'nombre'), kind: 'route', target: `${roleRoute(config, 'segments', '/sectores')}/${itemText(s, 'slug')}` })}>
              {itemText(s, 'nombre')}
            </button>
          ))}
        </nav>

        <div className="co-footer__hours">
          <h3>Disponibilidad</h3>
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

      <Container className="co-footer__legal">
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
    <div className="co-pagehero" data-wf-entry="fade-up">
      <Container>
        <p className="co-pagehero__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {subtitle ? <p className="co-pagehero__subtitle">{subtitle}</p> : null}
        {actions ? <div className="co-pagehero__actions">{actions}</div> : null}
      </Container>
    </div>
  );
}

const PageSoluciones: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const slug = useSlug(roleRoute(config, 'services', '/soluciones'));
  const all = roleItems(config, 'services');
  const sectores = roleItems(config, 'segments');
  const plagas = roleItems(config, 'catalog');
  const current = slug ? all.find((s) => itemText(s, 'slug') === slug) : null;
  const [view, setView] = useState<'problema' | 'sector'>('problema');

  if (slug && !current) {
    return (
      <SectionShell anchor={section.anchor} className="co-page">
        <PageHero eyebrow="Soluciones" title="Solución no encontrada" subtitle="El elemento solicitado no existe o se ha desactivado." />
        <Container>
          <CtaButton cta={{ label: 'Ver todas las soluciones', kind: 'route', target: roleRoute(config, 'services', '/soluciones') }} variant="primary" />
        </Container>
      </SectionShell>
    );
  }

  if (current) {
    const faqs = parseFaqLines(itemList(current, 'faq'));
    const sector = sectores.find((s) => s.id === itemText(current, 'sector'));
    return (
      <SectionShell anchor={section.anchor} className="co-page">
        <PageHero
          eyebrow={sector ? itemText(sector, 'nombre') : 'Solución'}
          title={itemText(current, 'nombre')}
          subtitle={itemText(current, 'resumen')}
          actions={<CtaButton cta={propuestaCta(config, itemText(current, 'ctaLabel', 'Solicitar propuesta'))} variant="primary" size="lg" />}
        />
        <Container className="co-page__split">
          <div className="co-page__main" data-wf-entry="fade-up">
            <p className="co-page__lead">{itemText(current, 'descripcion')}</p>
            {itemText(current, 'metodologia') ? (
              <>
                <h2>Metodología</h2>
                <p>{itemText(current, 'metodologia')}</p>
              </>
            ) : null}
            {itemList(current, 'beneficios').length > 0 ? (
              <>
                <h2>Qué aporta</h2>
                <ul className="co-checklist">
                  {itemList(current, 'beneficios').map((b) => (
                    <li key={b}>
                      <Icon name="checkCircle" size={18} />
                      {b}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {faqs.length > 0 ? (
              <>
                <h2>Preguntas frecuentes</h2>
                <Accordion items={faqs} mode="multiple" icon="chevron" />
              </>
            ) : null}
          </div>
          <aside className="co-page__aside" data-wf-entry="fade-up">
            <div className="co-card" data-wf-card>
              <h3>Datos del servicio</h3>
              <dl className="co-facts">
                {itemText(current, 'duracion') ? (
                  <>
                    <dt>Duración orientativa</dt>
                    <dd>{itemText(current, 'duracion')}</dd>
                  </>
                ) : null}
                {itemText(current, 'periodicidad') ? (
                  <>
                    <dt>Periodicidad</dt>
                    <dd>{itemText(current, 'periodicidad')}</dd>
                  </>
                ) : null}
              </dl>
              <div data-wf-card-actions>
                <CtaButton cta={propuestaCta(config)} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  const visible = all.filter((s) => itemText(s, 'enfoque', 'problema') === view);
  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Soluciones"
        title="Qué resolvemos"
        subtitle="Puedes verlas organizadas por el problema que resuelven o por el sector al que se dirigen."
        actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <div className="co-tabs" role="tablist" aria-label="Organizar soluciones">
          {(['problema', 'sector'] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={`co-tabs__tab${view === id ? ' is-active' : ''}`}
              onClick={() => setView(id)}
            >
              {id === 'problema' ? 'Por problema' : 'Por sector'}
            </button>
          ))}
        </div>
        <SolucionCards items={visible} sectores={sectores} />
        {plagas.length ? (
          <div className="co-page__related">
            <h2>Diagnósticos técnicos por plaga</h2>
            <div className="co-sectores__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
              {plagas.map((item) => (
                <article key={item.id} data-wf-card>
                  <div data-wf-card-body><h3>{itemText(item, 'nombre')}</h3><p>{itemText(item, 'resumen')}</p></div>
                  <div data-wf-card-actions><button type="button" className="wf-btn wf-btn--ghost wf-btn--sm" onClick={() => runCta({ label: 'Abrir diagnóstico', kind: 'route', target: `${roleRoute(config, 'catalog', '/plagas')}/${itemText(item, 'slug')}` })}>Ver diagnóstico</button></div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </SectionShell>
  );
};

const PageSectores: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const slug = useSlug(roleRoute(config, 'segments', '/sectores'));
  const sectores = roleItems(config, 'segments');
  const soluciones = roleItems(config, 'services');
  const current = slug ? sectores.find((s) => itemText(s, 'slug') === slug) : null;

  if (current) {
    const recomendadas = soluciones.filter((s) => itemText(s, 'sector') === current.id);
    return (
      <SectionShell anchor={section.anchor} className="co-page">
        <PageHero
          eyebrow="Sector profesional"
          title={itemText(current, 'nombre')}
          subtitle={itemText(current, 'resumen')}
          actions={<CtaButton cta={propuestaCta(config, 'Solicitar inspección')} variant="primary" size="lg" />}
        />
        <Container className="co-page__split">
          <div className="co-page__main" data-wf-entry="fade-up">
            {itemList(current, 'necesidades').length > 0 ? (
              <>
                <h2>Necesidades habituales</h2>
                <ul className="co-checklist">
                  {itemList(current, 'necesidades').map((n) => (
                    <li key={n}>
                      <Icon name="checkCircle" size={18} />
                      {n}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2>Riesgos si no se controla</h2>
            <ul className="co-checklist co-checklist--risk">
              <li>
                <Icon name="alert" size={18} />
                Interrupción de la actividad por una incidencia detectada en el peor momento.
              </li>
              <li>
                <Icon name="alert" size={18} />
                Falta de documentación cuando se requiere justificar el control realizado.
              </li>
              <li>
                <Icon name="alert" size={18} />
                Coste creciente: una población establecida siempre exige más intervención que la prevención.
              </li>
            </ul>

            {itemText(current, 'normativa') ? (
              <>
                <h2>Documentación aplicable</h2>
                <p>{itemText(current, 'normativa')}</p>
              </>
            ) : null}

            {recomendadas.length > 0 ? (
              <>
                <h2>Soluciones recomendadas</h2>
                <SolucionCards items={recomendadas} sectores={sectores} />
              </>
            ) : null}
          </div>
          <aside className="co-page__aside" data-wf-entry="fade-up">
            <div className="co-card" data-wf-card>
              <h3>¿Hablamos de tu instalación?</h3>
              <p>Visita técnica previa y propuesta con alcance y coste cerrado.</p>
              <div data-wf-card-actions>
                <CtaButton cta={propuestaCta(config)} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Sectores profesionales"
        title="A quién damos servicio"
        subtitle="Comunidades, restauración, hoteles, almacenes, oficinas e industria."
        actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        {sectores.length === 0 ? (
          <p className="co-empty">Añade sectores desde Contenido para que aparezcan aquí.</p>
        ) : (
          <div className="co-sectores__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
            {sectores.map((sector, index) => (
              <article key={sector.id} className="co-sectores__card" data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}>
                <span data-wf-card-icon>
                  <IconBadge icon={itemText(sector, 'icono', 'building')} size="md" />
                </span>
                <div data-wf-card-body>
                  <h2>{itemText(sector, 'nombre')}</h2>
                  <p>{itemText(sector, 'resumen')}</p>
                  {itemList(sector, 'necesidades').length > 0 ? (
                    <ul className="co-list">
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
                  <CtaButton cta={{ label: 'Ver detalle', kind: 'route', target: `${roleRoute(config, 'segments', '/sectores')}/${itemText(sector, 'slug')}` }} variant="ghost" size="sm" />
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </SectionShell>
  );
};

const PageProceso: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const steps = config.content.processSteps.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Proceso de intervención"
        title="Cómo trabajamos, fase a fase"
        subtitle="Cada fase tiene un entregable concreto, así que en todo momento sabes en qué punto está el servicio."
        actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <ol className="co-fases">
          {steps.map((step, index) => (
            <li key={step.id} data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 80}ms` }}>
              <span className="co-fases__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
              <span className="co-fases__icon" data-wf-card-icon>
                <IconBadge icon={step.icon} size="md" />
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
};

const PagePlanes: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Planes de mantenimiento"
        title="Elige la periodicidad que necesitas"
        subtitle="Todos los planes incluyen informe documental por visita. El alcance final se ajusta tras la visita técnica."
      />
      <Container>
        <PlanCards items={roleItems(config, 'plans')} />
        {config.content.pricingNote ? <p className="co-planes__note">{config.content.pricingNote}</p> : null}
        <div className="co-planes__extras">
          <h2>Incluido en todos los planes</h2>
          <ul className="co-checklist">
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

const PageCasos: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const slug = useSlug(roleRoute(config, 'cases', '/casos'));
  const casos = roleItems(config, 'cases');
  const sectores = roleItems(config, 'segments');
  const current = slug ? casos.find((c) => itemText(c, 'slug') === slug) : null;

  if (current) {
    const sector = sectores.find((s) => s.id === itemText(current, 'sector'));
    return (
      <SectionShell anchor={section.anchor} className="co-page">
        <PageHero
          eyebrow={sector ? itemText(sector, 'nombre') : 'Caso de éxito'}
          title={itemText(current, 'titulo')}
          subtitle=""
          actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />}
        />
        <Container className="co-page__split">
          <div className="co-page__main" data-wf-entry="fade-up">
            <h2>Situación inicial</h2>
            <p>{itemText(current, 'problema')}</p>
            {itemText(current, 'intervencion') ? (
              <>
                <h2>Intervención</h2>
                <p>{itemText(current, 'intervencion')}</p>
              </>
            ) : null}
            {itemText(current, 'resultado') ? (
              <>
                <h2>Resultado</h2>
                <p>{itemText(current, 'resultado')}</p>
              </>
            ) : null}
          </div>
          <aside className="co-page__aside" data-wf-entry="fade-up">
            <div className="co-card" data-wf-card>
              <h3>¿Tienes una situación parecida?</h3>
              <p>Cuéntanos el alcance y preparamos una propuesta para tu instalación.</p>
              <div data-wf-card-actions>
                <CtaButton cta={propuestaCta(config)} variant="primary" full />
              </div>
            </div>
          </aside>
        </Container>
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Casos de éxito"
        title="Intervenciones de referencia"
        subtitle="Situación de partida, actuación realizada y resultado."
        actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <CasoCards items={casos} />
      </Container>
    </SectionShell>
  );
};

const PageEmpresa: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const teamHeading = useHeading('team');
  const benefits = config.content.benefits.filter((b) => b.enabled);
  const team = config.team.filter((t) => t.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const zonas = roleItems(config, 'serviceAreas');

  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Empresa"
        title={`Quiénes somos en ${config.business.name}`}
        subtitle={config.business.tagline}
        actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        <div className="co-diferencias__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>
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
          <>
            <Heading heading={teamHeading} align="left" />
            <div className="co-team__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
              {team.map((m, index) => (
                <article key={m.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}>
                  <div className="co-team__media" data-wf-card-media>
                    <Picture image={m.photo} />
                  </div>
                  <div data-wf-card-body>
                    <h3>{m.name}</h3>
                    <p className="co-team__role">{m.role}</p>
                    <p>{m.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {zonas.length > 0 ? (
          <div className="co-zonas" data-wf-entry="fade-up">
            <h2>Dónde trabajamos</h2>
            <p className="co-zonas__intro">{config.business.serviceArea}</p>
            <ul>
              {zonas.map((z) => (
                <li key={z.id}>
                  <Icon name="pin" size={14} /> {itemText(z, 'nombre')}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </SectionShell>
  );
};

const PageDocumentacion: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const docs = roleItems(config, 'documents');

  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Documentación"
        title="Documentos y acreditaciones"
        subtitle="Aquí publicamos la documentación del servicio. Los campos que no estén completados no se muestran como válidos."
      />
      <Container>
        {docs.length === 0 ? (
          <p className="co-empty">
            Todavía no hay documentos publicados. Añádelos desde Contenido → Documentación. La página funciona
            correctamente aunque esta sección quede vacía.
          </p>
        ) : (
          <div className="co-docs__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>
            {docs.map((doc, index) => {
              const referencia = itemText(doc, 'referencia');
              const enlace = itemText(doc, 'enlace');
              return (
                <article key={doc.id} className="co-docs__card" data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 60}ms` }}>
                  <span data-wf-card-icon>
                    <IconBadge icon="fileText" size="md" />
                  </span>
                  <div data-wf-card-body>
                    <p className="co-docs__tipo">{itemText(doc, 'tipo')}</p>
                    <h2>{itemText(doc, 'titulo')}</h2>
                    <p>{itemText(doc, 'descripcion')}</p>
                    <dl className="co-facts">
                      {itemText(doc, 'emisor') ? (
                        <>
                          <dt>Emitido por</dt>
                          <dd>{itemText(doc, 'emisor')}</dd>
                        </>
                      ) : null}
                      {referencia ? (
                        <>
                          <dt>Referencia</dt>
                          <dd>{referencia}</dd>
                        </>
                      ) : null}
                    </dl>
                    {!referencia && !itemText(doc, 'emisor') ? (
                      <p className="co-docs__pending">Pendiente de completar con los datos reales.</p>
                    ) : null}
                  </div>
                  <div data-wf-card-actions>
                    {enlace ? (
                      <button type="button" className="wf-btn wf-btn--ghost wf-btn--sm" data-wf-button onClick={() => runCta({ label: 'Abrir', kind: 'external', target: enlace })}>
                        Abrir documento
                        <Icon name="external" size={15} />
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </SectionShell>
  );
};

const PagePlagas: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const slug = useSlug(roleRoute(config, 'catalog', '/plagas'));
  const current = slug
    ? roleItems(config, 'catalog').find((item) => itemText(item, 'slug') === slug)
    : null;
  if (!current) {
    return <SectionShell anchor={section.anchor} className="co-page"><PageHero eyebrow="Diagnóstico técnico" title="Plaga no encontrada" subtitle="El elemento solicitado no existe o ya no está publicado." actions={<CtaButton cta={propuestaCta(config)} variant="primary" />} /></SectionShell>;
  }
  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero eyebrow="Diagnóstico técnico" title={itemText(current, 'nombre')} subtitle={itemText(current, 'resumen')} actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />} />
      <Container className="co-page__split">
        <article className="co-page__main" data-wf-entry="fade-up">
          <p className="co-page__lead">{itemText(current, 'descripcion')}</p>
          <h2>Indicadores que revisamos</h2>
          <ul className="co-checklist">{itemList(current, 'senales').map((signal) => <li key={signal}><Icon name="search" size={18} />{signal}</li>)}</ul>
          <h2>Criterio de intervención</h2>
          <p>{itemText(current, 'tratamiento', 'La inspección determina focos, vías de entrada, nivel de actividad y medidas correctoras documentadas.')}</p>
        </article>
        <aside className="co-page__aside"><div className="co-card" data-wf-card><h3>Convertir el diagnóstico en plan</h3><p>La propuesta relaciona riesgos, frecuencia, evidencias y responsables.</p><div data-wf-card-actions><CtaButton cta={propuestaCta(config)} variant="primary" full /></div></div></aside>
      </Container>
    </SectionShell>
  );
};

const PageFaq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const faqs = config.faqs.filter((f) => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <SectionShell anchor={section.anchor} className="co-page">
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Dudas habituales antes de contratar"
        subtitle=""
        actions={<CtaButton cta={propuestaCta(config)} variant="primary" size="lg" />}
      />
      <Container>
        {faqs.length === 0 ? (
          <p className="co-empty">Añade preguntas frecuentes desde Contenido.</p>
        ) : (
          <div data-wf-entry="fade-up">
            <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} mode="multiple" icon="chevron" />
          </div>
        )}
      </Container>
    </SectionShell>
  );
};

const PagePropuesta: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const form = getForm(config.forms ?? [], 'solicitar-propuesta');
  const steps = config.content.processSteps.filter((s) => s.enabled).slice(0, 3);

  return (
    <SectionShell anchor={section.anchor} className="co-page co-page--propuesta">
      <PageHero
        eyebrow="Solicitar propuesta"
        title="Cuéntanos tu instalación"
        subtitle="Con estos datos preparamos la visita técnica y, tras ella, una propuesta con alcance, periodicidad y coste cerrado."
      />
      <Container className="co-propuesta">
        <div className="co-propuesta__form" data-wf-entry="fade-up">
          {form ? <SiteForm form={form} columns={2} /> : <p className="co-empty">No hay ningún formulario configurado.</p>}
        </div>
        <aside className="co-propuesta__aside" data-wf-entry="fade-up">
          <div className="co-card" data-wf-card>
            <h3>Qué ocurre después</h3>
            <ol className="co-propuesta__steps">
              {steps.map((s) => (
                <li key={s.id}>
                  <strong>{s.title}</strong>
                  <span>{s.description}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="co-card" data-wf-card>
            <h3>Prefieres hablarlo</h3>
            <p>
              {config.business.phone} · {config.business.email}
            </p>
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
    <SectionShell anchor={section.anchor} className="co-page co-page--legal">
      <PageHero eyebrow="Información legal" title={doc.title} subtitle="" />
      <Container>
        <div className="co-legal" data-wf-entry="fade-up">
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

export const PLAGAS_CORPORATIVA_SECTIONS: Record<string, SectionComponent> = {
  'co-header-01': Header,
  'co-hero-01': Hero,
  'co-metodo-01': Metodo,
  'co-soluciones-01': Soluciones,
  'co-sectores-01': Sectores,
  'co-planes-01': Planes,
  'co-diferencias-01': Diferencias,
  'co-casos-01': Casos,
  'co-testimonials-01': Testimonials,
  'co-faq-01': Faq,
  'co-finalcta-01': FinalCta,
  'co-footer-01': Footer,
  'co-page-soluciones-01': PageSoluciones,
  'co-page-sectores-01': PageSectores,
  'co-page-proceso-01': PageProceso,
  'co-page-planes-01': PagePlanes,
  'co-page-casos-01': PageCasos,
  'co-page-empresa-01': PageEmpresa,
  'co-page-documentacion-01': PageDocumentacion,
  'co-page-plagas-01': PagePlagas,
  'co-page-faq-01': PageFaq,
  'co-page-propuesta-01': PagePropuesta,
  'co-page-legal-01': PageLegal,
};
