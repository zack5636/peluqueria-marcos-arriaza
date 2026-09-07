import { useRef, useState } from 'react';
import { useSite } from '../context';
import { useActiveSection, useStickyHeader } from '../hooks';
import type { SectionComponent } from '../registry';
import { Accordion } from '../components/Accordion';
import { BookingForm } from '../components/BookingForm';
import { Carousel } from '../components/Carousel';
import { BrandMark } from '../components/BrandMark';
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
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

/* ======================================================================== *
 * Header — barra blanca, nav centrada, WhatsApp + CTA rosa
 * ======================================================================== */

const Header: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(config.navigation.items);
  const stuck = useStickyHeader(60);
  const { business, navigation } = config;

  return (
    <SectionShell as="header" anchor={section.anchor} className={`pf-header${stuck ? ' is-stuck' : ''}`}>
      <Container className="pf-header__inner">
        <button type="button" className="pf-brand" onClick={() => runCta({ label: 'Inicio', kind: 'anchor', target: '#inicio' })}>
          <span className="pf-brand__mark">
            <BrandMark icon="paw" size={26} />
          </span>
          <span className="pf-brand__text">
            <strong>{business.name}</strong>
            <small>{business.descriptor}</small>
          </span>
        </button>

        <nav className="pf-nav" aria-label="Navegación principal">
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

        <div className="pf-header__actions">
          <button
            type="button"
            className="pf-header__wa"
            onClick={() =>
              runCta({
                label: 'WhatsApp',
                kind: 'whatsapp',
                target: business.whatsapp,
                message: 'Hola, quiero información para mi perro',
              })
            }
          >
            <Icon name="whatsapp" size={22} />
            <span className="pf-header__wa-text">
              <small>WhatsApp</small>
              <strong>{business.whatsapp}</strong>
            </span>
          </button>
          <CtaButton cta={navigation.primaryCta} icon="calendar" size="sm" />
          <button
            type="button"
            className="pf-burger"
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
 * Hero — dos columnas 46/54, perro recortado sobre mancha amarilla
 * ======================================================================== */

const Hero: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const hero = config.content.hero;

  return (
    <SectionShell anchor={section.anchor} className="pf-hero">
      <DecorLayer className="pf-hero__decor" />
      <Container className="pf-hero__inner">
        <div className="pf-hero__copy">
          <h1>
            {hero.title}
            {hero.titleHighlight ? (
              <>
                {' '}
                <span className="pf-hero__highlight">{hero.titleHighlight}</span>
              </>
            ) : null}
            <span className="pf-hero__heart" aria-hidden="true">
              <Icon name="heart" size={30} />
            </span>
          </h1>
          <p className="pf-hero__lead">{hero.paragraph}</p>
          <ul className="pf-hero__micro">
            {hero.microBenefits.map((benefit) => (
              <li key={benefit.id}>
                <IconBadge icon={benefit.icon} size="sm" />
                <span>{benefit.label}</span>
              </li>
            ))}
          </ul>
          <div className="pf-hero__ctas">
            <CtaButton cta={hero.primaryCta} icon="calendar" size="lg" />
            {hero.secondaryCta ? (
              <CtaButton cta={hero.secondaryCta} variant="whatsapp" icon="whatsapp" size="lg" />
            ) : null}
          </div>
          {hero.note ? (
            <p className="pf-hero__note">
              <Icon name="paw" size={16} /> {hero.note}
            </p>
          ) : null}
        </div>

        <div className="pf-hero__media">
          <span className="pf-hero__blob" aria-hidden="true" />
          <Picture image={hero.image} loading="eager" className="pf-hero__photo" />
          <span className="pf-hero__spark pf-hero__spark--a" aria-hidden="true">
            <Icon name="sparkle" size={26} />
          </span>
          <span className="pf-hero__spark pf-hero__spark--b" aria-hidden="true">
            <Icon name="heart" size={20} />
          </span>
        </div>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Servicios — cinco cards con icono circular multicolor
 * ======================================================================== */

const Services: SectionComponent = ({ section }) => {
  const { config, formatPrice } = useSite();
  const [detail, setDetail] = useState<ServiceItem | null>(null);
  const services = config.services.filter((s) => s.enabled);
  const heading = config.content.headings.services;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--alt pf-services">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <div className="pf-services__grid">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              className="wf-card wf-card--interactive pf-service"
              onClick={() => setDetail(service)}
              style={{ borderTopColor: service.accent }}
            >
              <IconBadge icon={service.icon} accent={service.accent} size="md" />
              <h3>{service.name}</h3>
              <p>{service.shortDescription}</p>
              <span className="pf-service__more">
                Ver detalle <Icon name="arrowRight" size={16} />
              </span>
            </button>
          ))}
        </div>
      </Container>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ''}
        footer={
          detail ? (
            <CtaButton
              cta={{ label: 'Reservar este servicio', kind: 'anchor', target: '#reserva' }}
              onBeforeRun={() => setDetail(null)}
            />
          ) : null
        }
      >
        {detail ? <ServiceDetail service={detail} formatPrice={formatPrice} /> : null}
      </Modal>
    </SectionShell>
  );
};

export function ServiceDetail({
  service,
  formatPrice,
}: {
  service: ServiceItem;
  formatPrice: (amount: number, suffix?: string) => string;
}) {
  return (
    <div className="wf-service-detail">
      <p>{service.longDescription}</p>
      <div className="wf-service-detail__meta">
        {service.priceFromEur !== null ? (
          <span>
            <strong>Desde {formatPrice(service.priceFromEur)}</strong>
          </span>
        ) : null}
        <span>
          <Icon name="clock" size={16} /> {service.durationMinutes} min aprox.
        </span>
        <span>Tamaños: {service.sizes.join(', ')}</span>
      </div>
      <ul className="wf-includes">
        {service.includes.map((line) => (
          <li key={line}>
            <Icon name="check" size={16} /> {line}
          </li>
        ))}
      </ul>
      <p className="wf-note">El precio final depende del tamaño, el manto y el estado del pelo.</p>
    </div>
  );
}

/* ======================================================================== *
 * Franja partida: paquetes + por qué elegirnos
 * ======================================================================== */

const PackagesAndBenefits: SectionComponent = ({ section }) => {
  const { config, formatPrice, selectBooking, runCta, announce } = useSite();
  const packages = config.packages.filter((p) => p.enabled);
  const benefits = config.content.benefits.filter((b) => b.enabled);
  const packHeading = config.content.headings.packages;
  const benefitHeading = config.content.headings.benefits;

  const choose = (name: string) => {
    selectBooking({ label: `Paquete ${name}` });
    announce(`Paquete ${name} seleccionado en el formulario de reserva.`);
    runCta({ label: 'Reservar', kind: 'anchor', target: '#reserva' });
  };

  return (
    <div className="pf-split">
      <SectionShell anchor={section.anchor} className="wf-section pf-packages">
        <DecorLayer />
        <div className="pf-split__inner">
          {packHeading ? <Heading heading={packHeading} /> : null}
          <div className="pf-packages__grid">
            {packages.map((pack) => (
              <article key={pack.id} className="wf-card pf-package" style={{ '--pf-pack': pack.accent } as React.CSSProperties}>
                {pack.highlighted ? <Ribbon label={pack.highlightLabel} /> : null}
                <h3>
                  <Icon name="star" size={18} /> {pack.name}
                </h3>
                <p className="wf-price">
                  {formatPrice(pack.priceEur)} <small>{pack.priceNote}</small>
                </p>
                <ul className="wf-includes">
                  {pack.includes.map((line) => (
                    <li key={line}>
                      <Icon name="check" size={15} /> {line}
                    </li>
                  ))}
                </ul>
                <button type="button" className="wf-btn wf-btn--primary wf-btn--sm wf-btn--full" onClick={() => choose(pack.name)}>
                  Reservar
                </button>
              </article>
            ))}
          </div>
          <p className="wf-note pf-packages__note">{config.content.pricingNote}</p>
        </div>
      </SectionShell>

      <SectionShell anchor="por-que-elegirnos" className="wf-section pf-benefits">
        <div className="pf-split__inner pf-benefits__inner">
          <div>
            {benefitHeading ? <Heading heading={benefitHeading} align="left" /> : null}
            <ul className="pf-benefits__list">
              {benefits.map((benefit) => (
                <li key={benefit.id}>
                  <IconBadge icon={benefit.icon} accent={benefit.accent} size="md" />
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="pf-benefits__media">
            <span className="pf-benefits__blob" aria-hidden="true" />
            <Picture image={config.content.ambienceImage} className="pf-benefits__photo" />
          </div>
        </div>
      </SectionShell>
    </div>
  );
};

/* ======================================================================== *
 * Franja partida: reseñas + galería
 * ======================================================================== */

const ReviewsAndGallery: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const testimonials = config.testimonials.filter((t) => t.enabled);
  const gallery = config.gallery.filter((g) => g.enabled);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const instagram = config.contact.socialLinks.find((s) => s.network === 'instagram');

  return (
    <div className="pf-split pf-split--reviews">
      <SectionShell anchor={section.anchor} className="wf-section pf-reviews">
        <div className="pf-split__inner">
          {config.content.headings.testimonials ? (
            <Heading heading={config.content.headings.testimonials} align="left" />
          ) : null}
          <div className="pf-reviews__grid">
            {testimonials.map((item) => (
              <article key={item.id} className="wf-card pf-review">
                <StarRating rating={item.rating} />
                <p>“{item.text}”</p>
                <footer>
                  <span className="pf-review__avatar">
                    <Picture image={item.avatar} />
                  </span>
                  <span>
                    <strong>{item.author}</strong>
                    <small>Dueño/a de {item.petName}</small>
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell anchor="galeria" className="wf-section pf-gallery">
        <div className="pf-split__inner">
          {config.content.headings.gallery ? <Heading heading={config.content.headings.gallery} align="left" /> : null}
          <div className="pf-gallery__grid">
            {gallery.map((item) => (
              <button key={item.id} type="button" className="pf-gallery__item" onClick={() => setLightbox(item.id)}>
                <Picture image={item.image} />
                <span className="wf-sr-only">Ampliar: {item.caption}</span>
              </button>
            ))}
          </div>
          <div className="pf-gallery__cta">
            <CtaButton
              cta={
                instagram
                  ? { label: 'Ver más fotos en Instagram', kind: 'external', target: instagram.url }
                  : { label: 'Ver galería completa', kind: 'route', target: '/galeria' }
              }
              icon={instagram ? 'instagram' : 'sparkle'}
              onBeforeRun={() => undefined}
            />
          </div>
        </div>
      </SectionShell>

      <Lightbox
        entries={gallery.map((item) => ({ id: item.id, image: item.image, caption: item.caption, meta: item.serviceName }))}
        openId={lightbox}
        onClose={() => setLightbox(null)}
      />
      <button type="button" className="wf-sr-only" onClick={() => runCta({ label: '', kind: 'anchor', target: '#galeria' })}>
        Ir a galería
      </button>
    </div>
  );
};

/* ======================================================================== *
 * Franja operativa: reserva, contacto, mapa y FAQ
 * ======================================================================== */

const OperationsBand: SectionComponent = ({ section }) => {
  const { config, previewMode, announce } = useSite();
  const { business, contact } = config;
  const faqs = config.faqs.filter((f) => f.enabled);

  return (
    <div className="pf-ops">
      <Container className="pf-ops__grid">
        <SectionShell anchor={section.anchor} className="wf-card pf-booking">
          <h2>{config.content.headings.booking?.title ?? 'Reserva tu cita fácil y rápido'}</h2>
          <p className="wf-note">{config.content.headings.booking?.subtitle}</p>
          <BookingForm layout="grid-2" submitLabel="Reservar cita" showIntro />
        </SectionShell>

        <SectionShell anchor="contacto" className="wf-card pf-contact">
          <h2>Información de contacto</h2>
          <ul className="pf-contact__list">
            <li>
              <IconBadge icon="phone" size="sm" />
              <a href={`tel:${business.phone.replace(/\s/g, '')}`}>
                {business.phone}
                <small>WhatsApp disponible</small>
              </a>
            </li>
            <li>
              <IconBadge icon="mail" size="sm" />
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
            <li>
              <IconBadge icon="pin" size="sm" />
              <span>
                {business.address.line1}
                <small>
                  {business.address.postalCode} {business.address.city}, {business.address.country}
                </small>
              </span>
            </li>
            <li>
              <IconBadge icon="clock" size="sm" />
              <span>
                Horario de atención
                {business.openingHours.map((entry) => (
                  <small key={entry.label}>
                    {entry.label}: {entry.value}
                  </small>
                ))}
              </span>
            </li>
          </ul>
          <div className="pf-contact__social">
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
        </SectionShell>

        <div className="wf-card pf-map">
          <div className="pf-map__frame pf-map__frame--local" aria-label={`Ubicación de ${business.name}`}>
            <IconBadge icon="pin" size="lg" />
            <strong>{business.address.city}</strong>
            <span>{business.serviceArea}</span>
          </div>
          <div className="pf-map__foot">
            <span>
              <strong>{business.name}</strong>
              <small>
                {business.address.line1}, {business.address.postalCode} {business.address.city}
              </small>
            </span>
            <CtaButton
              cta={{ label: 'Cómo llegar', kind: 'external', target: contact.mapLinkUrl }}
              variant="secondary"
              size="sm"
              icon="pin"
            />
          </div>
        </div>

        <SectionShell anchor="faq" className="wf-card pf-faq">
          <h2>Preguntas frecuentes</h2>
          <Accordion
            items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
            mode="single"
            defaultOpenId={faqs[0]?.id}
          />
        </SectionShell>
      </Container>
    </div>
  );
};

/* ======================================================================== *
 * Footer rosa con borde superior ondulado
 * ======================================================================== */

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta, previewMode, announce } = useSite();
  const { business, content, contact, navigation } = config;
  const year = new Date().getFullYear();

  return (
    <SectionShell as="footer" anchor={section.anchor} className="pf-footer">
      <svg className="pf-footer__wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 C 180 0 360 60 540 34 C 720 8 900 58 1080 38 C 1230 22 1350 46 1440 30 L1440 0 L0 0 Z" fill="currentColor" />
      </svg>
      <Container className="pf-footer__grid">
        <div className="pf-footer__brand">
          <span className="pf-brand__mark">
            <BrandMark icon="paw" size={24} />
          </span>
          <strong>{business.name}</strong>
          <p>{content.footerTagline}</p>
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
            {config.services
              .filter((s) => s.enabled)
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
          <h3>Legal</h3>
          <ul>
            <li>
              <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: '/aviso-legal' })}>
                Aviso legal
              </button>
            </li>
            <li>
              <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>
                Política de privacidad
              </button>
            </li>
            <li>
              <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>
                Política de cookies
              </button>
            </li>
          </ul>
          <div className="pf-footer__social">
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
        <div className="pf-footer__dog" aria-hidden="true">
          <Icon name="dog" size={72} />
        </div>
      </Container>
      <div className="pf-footer__bar">
        <Container className="pf-footer__bar-inner">
          <span>
            © {year} {business.legalName}. {content.legal.copyrightNote}
          </span>
          <span>{content.footerSignature}</span>
        </Container>
      </div>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Variante de reseñas en carrusel (usada en móvil por la propia sección)
 * ======================================================================== */

export const PELUDOS_FELICES_SECTIONS: Record<string, SectionComponent> = {
  'pf-header-01': Header,
  'pf-hero-01': Hero,
  'pf-services-01': Services,
  'pf-packages-01': PackagesAndBenefits,
  'pf-testimonials-01': ReviewsAndGallery,
  'pf-booking-01': OperationsBand,
  'pf-footer-01': Footer,
};

/** Variante alternativa de testimonios: carrusel de una card. */
export const PeludosFelicesReviewCarousel: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const testimonials = config.testimonials.filter((t) => t.enabled);
  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--alt">
      <Container>
        {config.content.headings.testimonials ? <Heading heading={config.content.headings.testimonials} /> : null}
        <Carousel
          items={testimonials}
          visible={1}
          label="Reseñas de clientes"
          renderItem={(item) => {
            const t = testimonials.find((x) => x.id === item.id);
            if (!t) return null;
            return (
              <article className="wf-card pf-review">
                <StarRating rating={t.rating} />
                <p>“{t.text}”</p>
                <footer>
                  <span className="pf-review__avatar">
                    <Picture image={t.avatar} />
                  </span>
                  <span>
                    <strong>{t.author}</strong>
                    <small>Dueño/a de {t.petName}</small>
                  </span>
                </footer>
              </article>
            );
          }}
        />
      </Container>
    </SectionShell>
  );
};
PELUDOS_FELICES_SECTIONS['pf-testimonials-02'] = PeludosFelicesReviewCarousel;
