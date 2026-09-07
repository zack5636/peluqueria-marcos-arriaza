/**
 * Segunda generación de las tres familias visuales.
 *
 * Nace de comparar el generador con las cuatro templates caninas históricas.
 * Lo que las hace verse mejor no es el color: es que **la fotografía es
 * estructura**, que el ritmo alterna superficies en vez de encadenar bloques
 * blancos, y que hay dos o tres momentos fuertes por página. Aquí se traducen
 * esos principios a cada familia, sin copiar ninguna template.
 *
 * Aporta lo que faltaba:
 *
 *  · **Transformaciones** — el antes/después es la prueba más directa del
 *    sector y no existía ninguna variante de calidad. Cada familia lo resuelve
 *    a su manera: Premium con comparación grande y numerada, Minimalista con
 *    pares en rejilla estricta, Convencional con tarjetas etiquetadas.
 *  · **Reserva propia por familia** — antes las tres compartían el mismo bloque
 *    heredado, que es justo la contaminación que no debe existir.
 *  · **Segunda composición de hero y de servicios** — para que regenerar cambie
 *    de composición dentro de la misma identidad, no de tamaño de letra.
 */

import { useSite } from '../../context';
import type { SectionComponent } from '../../registry';
import { Container, CtaButton, Picture, SectionShell, StarRating } from '../../components/primitives';
import { Icon } from '../../components/Icon';
import { BookingForm } from '../../components/BookingForm';
import { BeforeAfterSlider, BeforeAfterSplit } from '../../components/BeforeAfter';

/* ========================================================================== */
/*  PREMIUM — la fotografía manda                                             */
/* ========================================================================== */

/**
 * Hero editorial partido: la fotografía ocupa una columna a sangre por el borde
 * y la tipografía vive en una tarjeta oscura que la invade. Alternativa real al
 * hero a pantalla completa, no una variación de tamaños.
 */
const PremiumHeroSplit: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;

  return (
    <SectionShell anchor={section.anchor} className="pf3-hero" surface="light">
      <div className="pf3-hero__grid">
        <div className="pf3-hero__media" data-wf-media-frame>
          {hero.image ? <Picture image={hero.image} sizes="(max-width: 900px) 100vw, 58vw" loading="eager" /> : null}
        </div>
        <div className="pf3-hero__panel" data-wf-entry="rise">
          {config.business.tagline ? <span className="pf3-hero__eyebrow">{config.business.tagline}</span> : null}
          <h1>{hero.title}</h1>
          <p>{hero.paragraph}</p>
          <div className="pf3-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" size="lg" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="ghost" size="lg" /> : null}
          </div>
        </div>
      </div>
      {hero.microBenefits.length > 0 ? (
        <Container>
          <ul className="pf3-hero__strip">
            {hero.microBenefits.slice(0, 4).map((benefit) => (
              <li key={benefit.id}>
                <span aria-hidden="true" />
                {benefit.label}
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </SectionShell>
  );
};

/** Servicios como fichas fotográficas grandes de dos en dos. */
const PremiumServicesDuo: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const services = config.services.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;
  const heading = config.content.headings.services;

  return (
    <SectionShell anchor={section.anchor} className="pf3-services" surface="alternative">
      <Container>
        <div className="pf2-section-head">
          <span>{heading?.eyebrow || 'Servicios'}</span>
          <h2>{heading?.title || 'Lo que hacemos'}</h2>
        </div>
        <div className="pf3-services__duo">
          {services.slice(0, 4).map((service, index) => (
            <article key={service.id} data-wf-entry="blur-in" style={{ ['--pf3-i' as string]: index }}>
              <div className="pf3-services__media" data-wf-media-frame>
                {service.image ? (
                  <Picture image={service.image} sizes="(max-width: 900px) 90vw, 44vw" />
                ) : (
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                )}
                {service.priceFromEur !== null ? (
                  <span className="pf3-services__price">Desde {service.priceFromEur} €</span>
                ) : null}
              </div>
              <h3>{service.name}</h3>
              <p>{service.shortDescription}</p>
              {service.includes.length > 0 ? (
                <ul>
                  {service.includes.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/**
 * Resultados: una comparación grande manda y las demás la acompañan. El
 * antes/después con tirador es interactivo de verdad — arrastrarlo es la
 * demostración, no un adorno.
 */
const PremiumResults: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.transformations
    .filter((item) => item.enabled && item.before && item.after)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  const heading = config.content.headings.transformations;

  return (
    <SectionShell anchor={section.anchor} className="pf3-results" surface="dark">
      <Container>
        <div className="pf3-results__head">
          <div>
            <span>{heading?.eyebrow || 'Antes y después'}</span>
            <h2>{heading?.title || 'El resultado se ve'}</h2>
          </div>
          <p>{heading?.subtitle || 'Mismo perro, misma luz, mismo ángulo. Arrastra para comparar.'}</p>
        </div>

        {/* `BeforeAfterSlider` ya trae su propio pie: añadir otro lo duplicaba. */}
        <div className="pf3-results__lead" data-wf-entry="reveal-up">
          <BeforeAfterSlider item={lead!} />
        </div>

        {rest.length > 0 ? (
          <div className="pf3-results__rest">
            {rest.slice(0, 3).map((item, index) => (
              <div key={item.id} data-wf-entry="fade-up" style={{ ['--pf3-i' as string]: index }}>
                <BeforeAfterSplit item={item} />
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </SectionShell>
  );
};

/** Reserva editorial: el formulario a un lado, los datos del salón al otro. */
const PremiumBooking: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const business = config.business;

  return (
    <SectionShell anchor={section.anchor} className="pf3-booking" surface="alternative">
      <Container className="pf3-booking__grid">
        <div className="pf3-booking__aside" data-wf-entry="fade-up">
          <span>{config.content.headings.booking?.eyebrow || 'Reserva'}</span>
          <h2>{config.content.headings.booking?.title || 'Pide tu cita'}</h2>
          <p>{config.content.headings.booking?.subtitle || 'Dinos qué necesita tu perro y te confirmamos el hueco.'}</p>
          <dl>
            {business.phone ? (
              <div>
                <dt>Teléfono</dt>
                <dd>{business.phone}</dd>
              </div>
            ) : null}
            {business.address.line1 ? (
              <div>
                <dt>Dónde</dt>
                <dd>{business.address.line1}, {business.address.city}</dd>
              </div>
            ) : null}
            {business.openingHours.slice(0, 3).map((slot) => (
              <div key={slot.label}>
                <dt>{slot.label}</dt>
                <dd>{slot.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="pf3-booking__form" data-wf-entry="rise">
          <BookingForm layout="grid-2" submitLabel="Solicitar cita" />
        </div>
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  MINIMALISTA — el tipo manda                                               */
/* ========================================================================== */

/**
 * Hero de banda: bloque tipográfico ancho y, debajo, la fotografía a todo lo
 * ancho recortada en banda baja. La imagen acompaña, no compite.
 */
const MinimalHeroBand: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;

  return (
    <SectionShell anchor={section.anchor} className="mn3-hero">
      <Container>
        <div className="mn3-hero__type" data-wf-entry="fade">
          <h1>{hero.title}</h1>
          <div className="mn3-hero__meta">
            <p>{hero.paragraph}</p>
            <div className="mn3-hero__actions">
              <CtaButton cta={hero.primaryCta} variant="primary" />
              {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="ghost" /> : null}
            </div>
          </div>
        </div>
      </Container>
      {hero.image ? (
        <div className="mn3-hero__band" data-wf-entry="fade">
          <Picture image={hero.image} sizes="100vw" loading="eager" />
        </div>
      ) : null}
      {hero.microBenefits.length > 0 ? (
        <Container>
          <ul className="mn3-hero__facts">
            {hero.microBenefits.slice(0, 4).map((benefit) => (
              <li key={benefit.id}>{benefit.label}</li>
            ))}
          </ul>
        </Container>
      ) : null}
    </SectionShell>
  );
};

/** Servicios con miniatura cuadrada, filete y precio alineado. */
const MinimalServicesIndex: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const services = config.services.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="mn3-services">
      <Container>
        <h2 className="mn2-heading">{config.content.headings.services?.title || 'Servicios'}</h2>
        <ul className="mn3-services__index">
          {services.slice(0, 8).map((service, index) => (
            <li key={service.id} data-wf-entry="fade-up" style={{ ['--mn3-i' as string]: index }}>
              <button type="button" onClick={() => runCta(config.navigation.primaryCta)}>
                <span className="mn3-services__thumb">
                  {service.image ? <Picture image={service.image} sizes="120px" /> : null}
                </span>
                <span className="mn3-services__name">{service.name}</span>
                <span className="mn3-services__desc">{service.shortDescription}</span>
                <span className="mn3-services__price">
                  {service.priceFromEur !== null ? `${service.priceFromEur} €` : 'A consultar'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

/** Resultados en rejilla estricta: pares alineados, pie en filete. */
const MinimalResults: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.transformations
    .filter((item) => item.enabled && item.before && item.after)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="mn3-results" surface="alternative">
      <Container>
        <h2 className="mn2-heading">{config.content.headings.transformations?.title || 'Antes y después'}</h2>
        <div className="mn3-results__grid">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} data-wf-entry="fade">
              <BeforeAfterSplit item={item} />
            </div>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Reserva minimalista: el formulario como una ficha de filetes. */
const MinimalBooking: SectionComponent = ({ section }) => {
  const { config } = useSite();

  return (
    <SectionShell anchor={section.anchor} className="mn3-booking">
      <Container className="mn3-booking__grid">
        <div>
          <h2 className="mn2-heading">{config.content.headings.booking?.title || 'Reservar'}</h2>
          <p className="mn3-booking__note">
            {config.content.headings.booking?.subtitle || 'Indícanos servicio y preferencia de día.'}
          </p>
          {config.business.phone ? (
            <p className="mn3-booking__phone">{config.business.phone}</p>
          ) : null}
        </div>
        <BookingForm layout="stacked" submitLabel="Continuar" className="mn3-booking__form" />
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  CONVENCIONAL — la conversión manda                                        */
/* ========================================================================== */

/** Cabecera con barra de utilidad y CTA dominante, versión compacta. */
const ConventionalHeroBadge: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;
  const reviews = config.testimonials.filter((t) => t.enabled);
  const media = reviews.length > 0 ? reviews.reduce((sum, t) => sum + t.rating, 0) / reviews.length : 0;

  return (
    <SectionShell anchor={section.anchor} className="cv3-hero">
      <Container className="cv3-hero__grid">
        <div className="cv3-hero__copy" data-wf-entry="slide-right">
          {config.business.tagline ? <span className="cv3-hero__eyebrow">{config.business.tagline}</span> : null}
          <h1>{hero.title}</h1>
          <p>{hero.paragraph}</p>
          {hero.microBenefits.length > 0 ? (
            <ul className="cv3-hero__benefits">
              {hero.microBenefits.slice(0, 4).map((benefit) => (
                <li key={benefit.id}>
                  <Icon name="check" size={15} /> {benefit.label}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="cv3-hero__actions">
            <CtaButton cta={hero.primaryCta} variant="primary" size="lg" />
            {hero.secondaryCta ? <CtaButton cta={hero.secondaryCta} variant="secondary" size="lg" /> : null}
          </div>
        </div>
        <div className="cv3-hero__media" data-wf-entry="zoom-in">
          {hero.image ? <Picture image={hero.image} sizes="(max-width: 900px) 90vw, 46vw" loading="eager" /> : null}
          {media > 0 ? (
            <div className="cv3-hero__badge">
              <strong>{media.toFixed(1)}</strong>
              <span>
                <StarRating rating={Math.round(media)} size={13} />
                {reviews.length} opiniones
              </span>
            </div>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Servicios en rejilla compacta de cinco con precio e icono. */
const ConventionalServicesCompact: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const services = config.services.filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (services.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="cv3-services" surface="alternative">
      <Container>
        <div className="cv2-section-head">
          <h2>{config.content.headings.services?.title || 'Nuestros servicios'}</h2>
          <p>{config.content.headings.services?.subtitle || 'Elige el que necesitas y reserva en un minuto.'}</p>
        </div>
        <div className="cv3-services__grid">
          {services.slice(0, 5).map((service) => (
            <article key={service.id} data-wf-entry="fade-up">
              <div className="cv3-services__thumb">
                {service.image ? <Picture image={service.image} sizes="(max-width: 720px) 45vw, 18vw" /> : <Icon name="sparkle" size={22} />}
              </div>
              <h3>{service.name}</h3>
              <p>{service.shortDescription}</p>
              <footer>
                <strong>{service.priceFromEur !== null ? `Desde ${service.priceFromEur} €` : 'A consultar'}</strong>
                <button type="button" onClick={() => runCta(config.navigation.primaryCta)}>
                  Reservar <Icon name="arrowRight" size={14} />
                </button>
              </footer>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/** Resultados en tarjetas etiquetadas, con la comparación siempre visible. */
const ConventionalResults: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const items = config.transformations
    .filter((item) => item.enabled && item.before && item.after)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="cv3-results">
      <Container>
        <div className="cv2-section-head">
          <h2>{config.content.headings.transformations?.title || 'Antes y después'}</h2>
          <p>{config.content.headings.transformations?.subtitle || 'Resultados reales de clientes del salón.'}</p>
        </div>
        <div className="cv3-results__grid">
          {items.slice(0, 3).map((item) => (
            <article key={item.id} data-wf-card data-wf-entry="fade-up">
              <BeforeAfterSplit item={item} />
            </article>
          ))}
        </div>
        <div className="cv3-results__foot">
          <CtaButton cta={config.navigation.primaryCta} variant="primary" size="lg" />
          <button type="button" onClick={() => runCta({ label: 'Galería', kind: 'route', target: '/galeria' })}>
            Ver más transformaciones <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </Container>
    </SectionShell>
  );
};

/** Reserva comercial: tarjeta elevada con reclamo a un lado y formulario al otro. */
const ConventionalBooking: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const business = config.business;

  return (
    <SectionShell anchor={section.anchor} className="cv3-booking" surface="alternative">
      <Container>
        <div className="cv3-booking__card" data-wf-entry="fade-up">
          <aside>
            <span className="cv3-booking__icon" aria-hidden="true">
              <Icon name="calendar" size={22} />
            </span>
            <h2>{config.content.headings.booking?.title || 'Reserva rápida'}</h2>
            <p>{config.content.headings.booking?.subtitle || 'Cuéntanos sobre tu peludo y buscamos el mejor horario.'}</p>
            {business.whatsapp ? (
              <button
                type="button"
                className="cv3-booking__whatsapp"
                onClick={() =>
                  runCta({ label: 'WhatsApp', kind: 'whatsapp', target: business.whatsapp, message: 'Hola, quiero pedir cita' })
                }
              >
                <Icon name="whatsapp" size={16} /> ¿Dudas? Escríbenos por WhatsApp
              </button>
            ) : null}
            {business.phone ? <p className="cv3-booking__phone">{business.phone}</p> : null}
          </aside>
          <BookingForm layout="grid-2" submitLabel="Continuar" />
        </div>
      </Container>
    </SectionShell>
  );
};

/* ========================================================================== */
/*  VENTAJAS — una por familia                                                */
/* ========================================================================== */
/*
 * Sin estas, una web Minimalista tomaba prestado el bloque de ventajas de una
 * template de otro sector: cruzaba la familia y además arrastraba el lenguaje
 * visual de otro nicho.
 */

/** Premium: filas numeradas separadas por filete, sin iconos. */
const PremiumBenefits: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.content.benefits.filter((b) => b.enabled).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="pf3-benefits">
      <Container>
        <ol className="pf3-benefits__list">
          {items.map((item, index) => (
            <li key={item.id} data-wf-entry="fade-up" style={{ ['--pf3-i' as string]: index }}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
            </li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
};

/** Minimalista: fila de datos separada por filetes verticales. */
const MinimalBenefits: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.content.benefits.filter((b) => b.enabled).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="mn3-benefits">
      <Container>
        <ul className="mn3-benefits__row">
          {items.map((item) => (
            <li key={item.id} data-wf-entry="fade">
              {item.title}
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

/** Convencional: franja de marca con marca de verificación. */
const ConventionalBenefits: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const items = config.content.benefits.filter((b) => b.enabled).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <SectionShell anchor={section.anchor} className="cv3-benefits" surface="brand">
      <Container>
        <ul className="cv3-benefits__row">
          {items.map((item) => (
            <li key={item.id} data-wf-entry="fade-up">
              <Icon name="check" size={17} />
              <strong>{item.title}</strong>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */

export const PROFILE_SECTIONS_B: Record<string, SectionComponent> = {
  'pf3-hero-02': PremiumHeroSplit,
  'pf3-services-02': PremiumServicesDuo,
  'pf3-results-01': PremiumResults,
  'pf3-booking-01': PremiumBooking,
  'pf3-benefits-01': PremiumBenefits,

  'mn3-hero-02': MinimalHeroBand,
  'mn3-services-02': MinimalServicesIndex,
  'mn3-results-01': MinimalResults,
  'mn3-booking-01': MinimalBooking,
  'mn3-benefits-01': MinimalBenefits,

  'cv3-hero-02': ConventionalHeroBadge,
  'cv3-services-02': ConventionalServicesCompact,
  'cv3-results-01': ConventionalResults,
  'cv3-booking-01': ConventionalBooking,
  'cv3-benefits-01': ConventionalBenefits,
};
