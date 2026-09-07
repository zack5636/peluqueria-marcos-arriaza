import { useRef, useState } from 'react';
import { useSite, resolverPreseleccion } from '../context';
import { useActiveSection, useStickyHeader } from '../hooks';
import type { SectionComponent } from '../registry';
import { ReservaConectada } from '../../manageos/ReservaConectada';
import { useCatalogo } from '../../manageos/useCatalogo';
import { useManageOS } from '../../manageos/useManageOS';
import { formatearHorario } from '../../manageos/horario';
import { Carousel } from '../components/Carousel';
import { BrandMark } from '../components/BrandMark';
import { Icon } from '../components/Icon';
import { MobileDrawer } from '../components/MobileDrawer';
import { Modal } from '../components/Modal';
import {
  Container,
  CtaButton,
  DecorLayer,
  Heading,
  IconBadge,
  Picture,
  Ribbon,
  SectionShell,
  StarRating,
} from '../components/primitives';
import type { ServiceItem } from '../types';
import { ServiceDetail } from './peludosFelices';

/* ======================================================================== *
 * Header — barra blanca con teléfono y CTA lila
 * ======================================================================== */

const Header: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(config.navigation.items);
  const stuck = useStickyHeader(60);
  const { business, navigation } = config;

  return (
    <SectionShell as="header" anchor={section.anchor} className={`pco-header${stuck ? ' is-stuck' : ''}`}>
      <Container className="pco-header__inner">
        <button type="button" className="pco-brand" onClick={() => runCta({ label: 'Inicio', kind: 'anchor', target: '#inicio' })}>
          <span className="pco-brand__mark">
            <BrandMark icon="paw" size={24} />
          </span>
          <span className="pco-brand__text">
            <strong>{business.name}</strong>
            <small>{business.descriptor}</small>
          </span>
        </button>

        <nav className="pco-nav" aria-label="Navegación principal">
          <ul>
            {navigation.items
              .filter((item) => item.enabled)
              .map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={active === item.id ? 'is-active' : undefined}
                    aria-current={active === item.id ? 'true' : undefined}
                    onClick={() => runCta(item.cta)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
          </ul>
        </nav>

        <div className="pco-header__actions">
          <CtaButton cta={navigation.primaryCta} icon="calendar" size="sm" />
          <button
            type="button"
            className="pco-burger"
            ref={triggerRef}
            aria-expanded={open}
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </Container>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={navigation.items}
        activeId={active}
        triggerRef={triggerRef}
        footer={<CtaButton cta={navigation.primaryCta} icon="calendar" full />}
      />
    </SectionShell>
  );
};

/* ======================================================================== *
 * Hero — partido blanco/lila con badge de reseñas
 * ======================================================================== */

const Hero: SectionComponent = ({ section }) => {
  const { config, previewMode, announce } = useSite();
  const hero = config.content.hero;
  const badge = hero.ratingBadge;

  return (
    <SectionShell anchor={section.anchor} className="pco-hero">
      <Container className="pco-hero__inner">
        <div className="pco-hero__copy">
          <span className="pco-hero__tag">{hero.eyebrow}</span>
          <h1>
            {hero.title}{' '}
            <span className="pco-hero__grad">{hero.titleHighlight}</span>
          </h1>
          <p className="pco-hero__lead">{hero.paragraph}</p>
          <div className="pco-hero__ctas">
            <CtaButton cta={hero.primaryCta} icon="calendar" size="lg" />
          </div>
          <ul className="pco-hero__benefits">
            {hero.microBenefits.map((benefit) => (
              <li key={benefit.id}>
                <IconBadge icon={benefit.icon} size="sm" />
                <span>
                  <strong>{benefit.label}</strong>
                  <small>{benefit.description}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pco-hero__media">
          <DecorLayer className="pco-hero__decor" />
          <Picture image={hero.image} loading="eager" className="pco-hero__photo" />
          {badge.enabled ? (
            <div className="pco-hero__badge">
              <Icon name="google" size={26} />
              <span>
                <strong>{badge.score}</strong>
                <StarRating rating={5} size={13} />
                {badge.url ? (
                  <a
                    href={previewMode ? undefined : badge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (previewMode) {
                        e.preventDefault();
                        announce('Modo preview: el enlace externo no se abre.');
                      }
                    }}
                  >
                    {badge.countLabel}
                  </a>
                ) : (
                  <small>{badge.countLabel}</small>
                )}
              </span>
            </div>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Servicios — cinco cards compactas con precio
 * ======================================================================== */

const Services: SectionComponent = ({ section }) => {
  const { config, formatPrice, runCta, selectBooking } = useSite();
  /* Manda Manager cuando la web está conectada; si no, el catálogo de la plantilla. */
  const { servicios: services } = useCatalogo(config.services);
  const heading = config.content.headings.services;
  const [detail, setDetail] = useState<ServiceItem | null>(null);

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--surface pco-services">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <div className="pco-services__grid">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              className="wf-card wf-card--interactive pco-service"
              onClick={() => setDetail(service)}
            >
              <IconBadge icon={service.icon} size="md" />
              <h3>{service.name}</h3>
              <p>{service.shortDescription}</p>
              {service.priceFromEur !== null ? (
                <span className="pco-service__price">
                  Desde <b>{formatPrice(service.priceFromEur)}</b>
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="pco-services__all">
          <CtaButton
            cta={{ label: 'Ver todos los servicios', kind: 'route', target: '/servicios' }}
            variant="link"
            icon="arrowRight"
          />
        </div>
      </Container>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ''}
        footer={
          detail ? (
            <button
              type="button"
              className="wf-btn wf-btn--primary wf-btn--md"
              onClick={() => {
                if (detail) selectBooking({ serviceId: detail.id, label: detail.name });
                setDetail(null);
                runCta({ label: 'Reservar', kind: 'anchor', target: '#reserva' });
              }}
            >
              Reservar este servicio
            </button>
          ) : null
        }
      >
        {detail ? <ServiceDetail service={detail} formatPrice={formatPrice} /> : null}
      </Modal>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Paquetes — tres cards horizontales + lista lateral de valor
 * ======================================================================== */

const Packages: SectionComponent = ({ section }) => {
  const { config, formatPrice, selectBooking, runCta, announce } = useSite();
  const packages = config.packages.filter((p) => p.enabled);
  const heading = config.content.headings.packages;

  const choose = (id: string, name: string) => {
    selectBooking({ packageId: id, label: `Paquete ${name}` });
    announce(`Paquete ${name} seleccionado en el formulario de reserva.`);
    runCta({ label: 'Reservar', kind: 'anchor', target: '#reserva' });
  };

  return (
    <SectionShell anchor={section.anchor} className="wf-section pco-packages">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <div className="pco-packages__layout">
          <div className="pco-packages__list">
            {packages.map((pack) => (
              <article key={pack.id} className={`wf-card pco-package${pack.highlighted ? ' is-featured' : ''}`}>
                {pack.highlighted ? <Ribbon label={pack.highlightLabel} /> : null}
                <div className="pco-package__body">
                  <h3>{pack.name}</h3>
                  <p>{pack.includes.join(' + ')}</p>
                  <p className="wf-price">{formatPrice(pack.priceEur)}</p>
                  <button type="button" className="wf-btn wf-btn--primary wf-btn--sm" onClick={() => choose(pack.id, pack.name)}>
                    Elegir paquete
                  </button>
                </div>
                <span className="pco-package__photo">
                  <Picture image={pack.image} />
                </span>
              </article>
            ))}
          </div>
          <ul className="pco-packages__benefits">
            {config.content.packagesSideBenefits.map((line) => (
              <li key={line}>
                <IconBadge icon="sparkle" size="sm" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="wf-note pco-packages__note">{config.content.pricingNote}</p>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Proceso — cuatro pasos con conectores punteados
 * ======================================================================== */

const Process: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const steps = config.content.processSteps.filter((s) => s.enabled);
  const heading = config.content.headings.process;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--surface pco-process">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <ol className="pco-process__grid">
          {steps.map((step) => (
            <li key={step.id}>
              <IconBadge icon={step.icon} size="lg" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Ventajas — cinco argumentos equidistantes
 * ======================================================================== */

const Benefits: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const benefits = config.content.benefits.filter((b) => b.enabled);
  const heading = config.content.headings.benefits;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-section--tight pco-benefits">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <ul className="pco-benefits__row">
          {benefits.map((benefit) => (
            <li key={benefit.id}>
              <IconBadge icon={benefit.icon} accent={benefit.accent} size="md" />
              <strong>{benefit.title}</strong>
              <small>{benefit.description}</small>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Reseña estrecha + transformaciones anchas
 * ======================================================================== */

const ReviewAndTransformations: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const testimonials = config.testimonials.filter((t) => t.enabled);
  /*
   * Sin comparador de antes/después: no hay ningún par verificado de Marcos
   * (ver el comentario en `config.transformations`). Esta mitad de la banda
   * enseña en su lugar la galería real del local y del trabajo, tal cual.
   */
  const items = config.gallery.filter((g) => g.enabled).slice(0, 4);

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band pco-proof">
      <Container className="pco-proof__inner">
        <div className="pco-proof__review">
          <p className="wf-eyebrow">Lo que dicen nuestros clientes</p>
          <Carousel
            items={testimonials}
            visible={1}
            label="Reseñas de clientes"
            renderItem={(item) => {
              const t = testimonials.find((x) => x.id === item.id);
              if (!t) return null;
              return (
                <article className="pco-review">
                  <span className="pco-review__quote" aria-hidden="true">
                    “
                  </span>
                  <StarRating rating={t.rating} />
                  <p>{t.text}</p>
                  <footer>
                    <span className="pco-review__avatar">
                      <Picture image={t.avatar} />
                    </span>
                    <span>
                      <strong>{t.author}</strong>
                      <small>Reseña en Google</small>
                    </span>
                  </footer>
                </article>
              );
            }}
          />
        </div>

        <div className="pco-proof__transformations" id="galeria-trabajo">
          <p className="wf-eyebrow">El local y el trabajo</p>
          <div className="pco-proof__grid">
            {items.map((item) => (
              <figure className="wf-ba wf-ba--split" key={item.id}>
                <Picture image={item.image} />
                <figcaption className="wf-ba__caption">
                  <strong>{item.caption}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="pco-proof__cta">
            <CtaButton cta={{ label: 'Ver toda la galería', kind: 'route', target: '/galeria' }} variant="link" icon="arrowRight" />
          </div>
        </div>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Reserva rápida — card horizontal antes del footer
 * ======================================================================== */

const QuickBooking: SectionComponent = ({ section }) => {
  const { config, bookingSelection } = useSite();
  const heading = config.content.headings.booking;
  const preseleccion = resolverPreseleccion(config, bookingSelection);

  return (
    <SectionShell anchor={section.anchor} className="wf-section pco-booking">
      <Container>
        <div className="wf-card pco-booking__card">
          <div className="pco-booking__intro">
            <span className="pco-booking__icon">
              <Icon name="calendar" size={30} />
            </span>
            <h2>{heading?.title ?? 'Reserva rápida'}</h2>
            <p>{heading?.subtitle}</p>
          </div>
          <div className="pco-booking__form">
            <ReservaConectada
              whatsapp={config.business.whatsapp}
              servicioInicial={preseleccion.servicioId}
              paqueteInicial={preseleccion.paquete}
            />
          </div>
        </div>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Footer azul noche de cinco columnas
 * ======================================================================== */

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta, previewMode, announce } = useSite();
  const { business, content, contact, navigation } = config;
  /* También aquí: un servicio archivado en Manager no puede seguir listado. */
  const { servicios } = useCatalogo(config.services);
  /* Y el horario del pie es el mismo que el de Reserva: el de Manager si hay conexión. */
  const conexion = useManageOS();
  const horario = conexion.estado === 'conectado' ? formatearHorario(conexion.datos.hours) : business.openingHours;
  const year = new Date().getFullYear();

  return (
    <SectionShell as="footer" anchor={section.anchor} className="pco-footer">
      <Container className="pco-footer__grid">
        <div className="pco-footer__brand">
          <span className="pco-footer__logo">
            <span className="pco-brand__mark pco-brand__mark--inverse">
              <BrandMark icon="paw" size={22}  inverse/>
            </span>
            <span>
              <strong>{business.name}</strong>
              <small>{business.descriptor}</small>
            </span>
          </span>
          <p>{content.footerTagline}</p>
          <div className="pco-footer__social">
            {contact.socialLinks.map((link) => (
              <a
                key={link.network}
                href={previewMode ? undefined : link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                onClick={(e) => {
                  if (previewMode) {
                    e.preventDefault();
                    announce('Modo preview: el enlace externo no se abre.');
                  }
                }}
              >
                <Icon name={link.network} size={18} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Enlaces rápidos">
          <h3>Enlaces rápidos</h3>
          <ul>
            {navigation.items
              .filter((item) => item.enabled)
              .map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => runCta(item.cta)}>
                    {item.label}
                  </button>
                </li>
              ))}
          </ul>
        </nav>

        <div>
          <h3>Servicios</h3>
          <ul>
            {servicios
              .map((service) => (
                <li key={service.id}>
                  <button type="button" onClick={() => runCta({ label: service.name, kind: 'anchor', target: '#servicios' })}>
                    {service.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3>Información</h3>
          <ul className="pco-footer__info">
            {horario.map((entry) => (
              <li key={entry.label}>
                <span>{entry.label}</span>
                <strong>{entry.value}</strong>
              </li>
            ))}
            <li>
              <span>Dirección</span>
              <strong>
                {business.address.line1}, {business.address.postalCode} {business.address.city}
              </strong>
            </li>
          </ul>
        </div>

        <div>
          <h3>Contacto</h3>
          <ul className="pco-footer__contact">
            <li>
              <a href={`tel:${business.phone.replace(/\s/g, '')}`}>
                <Icon name="phone" size={16} /> {business.phone}
              </a>
            </li>
            {business.email ? (
              <li>
                <a href={`mailto:${business.email}`}>
                  <Icon name="mail" size={16} /> {business.email}
                </a>
              </li>
            ) : null}
            <li>
              <button type="button" onClick={() => runCta({ label: 'Mapa', kind: 'external', target: contact.mapLinkUrl })}>
                <Icon name="pin" size={16} /> Cómo llegar
              </button>
            </li>
          </ul>
          <span className="pco-footer__area">
            <Icon name="pin" size={15} /> {business.serviceArea}
          </span>
        </div>
      </Container>

      <div className="pco-footer__bar">
        <Container className="pco-footer__bar-inner">
          <span>
            © {year} {business.legalName}. {content.legal.copyrightNote}
          </span>
          <span className="pco-footer__legal">
            <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: '/aviso-legal' })}>
              Aviso legal
            </button>
            <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>
              Privacidad
            </button>
            <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>
              Cookies
            </button>
          </span>
        </Container>
      </div>
    </SectionShell>
  );
};

export const PELUDOS_AND_CO_SECTIONS: Record<string, SectionComponent> = {
  'pco-header-01': Header,
  'pco-hero-01': Hero,
  'pco-services-01': Services,
  'pco-packages-01': Packages,
  'pco-process-01': Process,
  'pco-benefits-01': Benefits,
  'pco-testimonials-01': ReviewAndTransformations,
  'pco-booking-01': QuickBooking,
  'pco-footer-01': Footer,
};
