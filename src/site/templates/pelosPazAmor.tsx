import { useRef, useState } from 'react';
import { useSite } from '../context';
import { useActiveSection, useStickyHeader } from '../hooks';
import type { SectionComponent } from '../registry';
import { Accordion } from '../components/Accordion';
import { BeforeAfterSlider } from '../components/BeforeAfter';
import { BookingForm } from '../components/BookingForm';
import { Carousel } from '../components/Carousel';
import { BrandMark } from '../components/BrandMark';
import { Icon } from '../components/Icon';
import { MobileDrawer } from '../components/MobileDrawer';
import { Modal } from '../components/Modal';
import {
  Container,
  CtaButton,
  Heading,
  IconBadge,
  Picture,
  Ribbon,
  SectionShell,
  StarRating,
} from '../components/primitives';
import type { TeamMember } from '../types';

/* ======================================================================== *
 * Header — logo lineal dorado, nav centrada, CTA dorado + WhatsApp circular
 * ======================================================================== */

const Header: SectionComponent = ({ section }) => {
  const { config, runCta, setOpenModal } = useSite();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(config.navigation.items);
  const stuck = useStickyHeader(60);
  const { business, navigation } = config;

  return (
    <SectionShell as="header" anchor={section.anchor} className={`ppa-header${stuck ? ' is-stuck' : ''}`}>
      <Container className="ppa-header__inner">
        <button type="button" className="ppa-brand" onClick={() => runCta({ label: 'Inicio', kind: 'anchor', target: '#inicio' })}>
          <span className="ppa-brand__mark">
            <BrandMark icon="paw" size={30} strokeWidth={1.4} />
          </span>
          <span className="ppa-brand__text">
            <strong>{business.name}</strong>
            <small>{business.descriptor}</small>
          </span>
        </button>

        <nav className="ppa-nav" aria-label="Navegación principal">
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

        <div className="ppa-header__actions">
          <button type="button" className="wf-btn wf-btn--primary wf-btn--sm" onClick={() => setOpenModal('booking')}>
            Reservar cita
          </button>
          <button
            type="button"
            className="ppa-header__wa"
            aria-label="Escríbenos por WhatsApp"
            onClick={() =>
              runCta({
                label: 'WhatsApp',
                kind: 'whatsapp',
                target: business.whatsapp,
                message: 'Hola, me gustaría solicitar una cita para mi perro.',
              })
            }
          >
            <Icon name="whatsapp" size={22} />
          </button>
          <button
            type="button"
            className="ppa-burger"
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
        footer={
          <button
            type="button"
            className="wf-btn wf-btn--primary wf-btn--md wf-btn--full"
            onClick={() => {
              setOpen(false);
              setOpenModal('booking');
            }}
          >
            Reservar cita
          </button>
        }
      />
    </SectionShell>
  );
};

/* ======================================================================== *
 * Hero — fotografía luminosa a sangre con copy a la izquierda
 * ======================================================================== */

const Hero: SectionComponent = ({ section }) => {
  const { config, setOpenModal } = useSite();
  const hero = config.content.hero;

  return (
    <SectionShell anchor={section.anchor} className="ppa-hero">
      <div className="ppa-hero__media">
        <Picture image={hero.image} loading="eager" />
      </div>
      <div className="ppa-hero__veil" aria-hidden="true" />
      <Container className="ppa-hero__inner">
        <div className="ppa-hero__copy">
          <p className="wf-eyebrow">{hero.eyebrow}</p>
          <h1>
            {hero.title}
            {hero.titleHighlight ? <span className="ppa-hero__accent"> {hero.titleHighlight}</span> : null}
          </h1>
          <p className="ppa-hero__lead">{hero.paragraph}</p>
          <div className="ppa-hero__ctas">
            <button type="button" className="wf-btn wf-btn--primary wf-btn--lg" onClick={() => setOpenModal('booking')}>
              <Icon name="calendar" size={18} />
              <span>{hero.primaryCta.label}</span>
            </button>
            {hero.secondaryCta ? (
              <CtaButton cta={hero.secondaryCta} variant="whatsapp" icon="whatsapp" size="lg" />
            ) : null}
          </div>
          <ul className="ppa-hero__benefits">
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
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Servicios — cuatro cards altas con lista de inclusiones y precio
 * ======================================================================== */

const Services: SectionComponent = ({ section }) => {
  const { config, formatPrice, selectBooking, setOpenModal, announce } = useSite();
  const services = config.services.filter((s) => s.enabled);
  const heading = config.content.headings.services;

  const book = (name: string) => {
    selectBooking({ label: name });
    announce(`${name} seleccionado. Se abre el formulario de solicitud.`);
    setOpenModal('booking');
  };

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--surface ppa-services">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <div className="ppa-services__grid">
          {services.map((service) => (
            <article key={service.id} className="wf-card ppa-service">
              {service.id === config.services.find((s) => s.enabled && s.slug === 'bano-premium')?.id ? (
                <Ribbon label="Más elegido" tone="dark" />
              ) : null}
              <IconBadge icon={service.icon} size="md" />
              <h3>{service.name}</h3>
              <p className="ppa-service__sub">{service.shortDescription}</p>
              <ul className="wf-includes">
                {service.includes.map((line) => (
                  <li key={line}>
                    <Icon name="check" size={15} /> {line}
                  </li>
                ))}
              </ul>
              <p className="wf-price">
                {service.priceFromEur !== null ? formatPrice(service.priceFromEur) : '—'} <small>Desde</small>
              </p>
              <button type="button" className="wf-btn wf-btn--primary wf-btn--sm wf-btn--full" onClick={() => book(service.name)}>
                Reservar
              </button>
            </article>
          ))}
        </div>
        <p className="wf-note ppa-services__note">{config.content.pricingNote}</p>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Antes y después — bloque editorial + tres comparadores arrastrables
 * ======================================================================== */

const Transformations: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const items = config.transformations.filter((t) => t.enabled);
  const heading = config.content.headings.transformations;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band ppa-transformations">
      <Container className="ppa-transformations__inner">
        <div className="ppa-transformations__editorial">
          {heading ? <Heading heading={heading} align="left" /> : null}
          <CtaButton
            cta={{ label: 'Ver más transformaciones', kind: 'route', target: '/galeria?categoria=transformaciones' }}
            variant="secondary"
            icon="arrowRight"
          />
        </div>
        <div className="ppa-transformations__grid">
          {items.map((item) => (
            <BeforeAfterSlider key={item.id} item={item} />
          ))}
        </div>
      </Container>
      <button type="button" className="wf-sr-only" onClick={() => runCta({ label: '', kind: 'anchor', target: '#transformaciones' })}>
        Ir a transformaciones
      </button>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Proceso — cuatro pasos con línea punteada
 * ======================================================================== */

const Process: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const steps = config.content.processSteps.filter((s) => s.enabled);
  const heading = config.content.headings.process;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--surface ppa-process">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <ol className="ppa-process__grid">
          {steps.map((step, index) => (
            <li key={step.id}>
              <span className="ppa-process__num">{index + 1}</span>
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
 * Mosaico — testimonios / equipo / motivos / ambiente
 * ======================================================================== */

const Mosaic: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const testimonials = config.testimonials.filter((t) => t.enabled);
  const team = config.team.filter((m) => m.enabled);
  const benefits = config.content.benefits.filter((b) => b.enabled);
  const [member, setMember] = useState<TeamMember | null>(null);

  return (
    <div className="ppa-mosaic">
      <SectionShell anchor={section.anchor} className="ppa-mosaic__cell ppa-mosaic__testimonials">
        {config.content.headings.testimonials ? (
          <Heading heading={config.content.headings.testimonials} align="left" />
        ) : null}
        <Carousel
          items={testimonials}
          visible={1}
          label="Testimonios de clientes"
          renderItem={(item) => {
            const t = testimonials.find((x) => x.id === item.id);
            if (!t) return null;
            return (
              <article className="wf-card ppa-testimonial">
                <StarRating rating={t.rating} />
                <p>“{t.text}”</p>
                <footer>
                  <span className="ppa-testimonial__avatar">
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
      </SectionShell>

      <SectionShell anchor="equipo" className="ppa-mosaic__cell ppa-mosaic__team">
        {config.content.headings.team ? <Heading heading={config.content.headings.team} align="left" /> : null}
        <div className="ppa-team__grid">
          {team.map((person) => (
            <button key={person.id} type="button" className="ppa-team__card" onClick={() => setMember(person)}>
              <span className="ppa-team__photo">
                <Picture image={person.photo} />
              </span>
              <strong>{person.name}</strong>
              <small>{person.role}</small>
            </button>
          ))}
        </div>
      </SectionShell>

      <section className="ppa-mosaic__cell ppa-mosaic__reasons" aria-label="Por qué elegirnos">
        <h2 className="ppa-mosaic__title">¿Por qué elegirnos?</h2>
        <ul className="ppa-reasons">
          {benefits.map((benefit) => (
            <li key={benefit.id}>
              <Icon name="check" size={16} />
              <span>
                <strong>{benefit.title}</strong>
                <small>{benefit.description}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="ppa-mosaic__cell ppa-mosaic__ambience">
        <Picture image={config.content.ambienceImage} />
      </div>

      <Modal open={member !== null} onClose={() => setMember(null)} title={member?.name ?? ''} size="sm">
        {member ? (
          <div className="ppa-team__detail">
            <span className="ppa-team__detail-photo">
              <Picture image={member.photo} />
            </span>
            <p className="ppa-team__role">{member.role}</p>
            <p>{member.bio}</p>
            <ul className="wf-includes">
              {member.specialties.map((item) => (
                <li key={item}>
                  <Icon name="check" size={15} /> {item}
                </li>
              ))}
            </ul>
            <p className="wf-note">
              <Icon name="clock" size={15} /> Disponibilidad: {member.availability}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

/* ======================================================================== *
 * FAQ — rejilla 3×2
 * ======================================================================== */

const Faq: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const faqs = config.faqs.filter((f) => f.enabled);
  const heading = config.content.headings.faq;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band ppa-faq">
      <Container>
        {heading ? <Heading heading={heading} align="left" /> : null}
        <div className="ppa-faq__grid">
          <Accordion
            items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
            mode="multiple"
            icon="chevron"
            className="ppa-faq__accordion"
          />
        </div>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Footer marfil con franja dorada
 * ======================================================================== */

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta, previewMode, announce } = useSite();
  const { business, content, contact, navigation } = config;
  const year = new Date().getFullYear();

  return (
    <SectionShell as="footer" anchor={section.anchor} className="ppa-footer">
      <Container className="ppa-footer__grid">
        <div className="ppa-footer__brand">
          <span className="ppa-brand__mark">
            <BrandMark icon="paw" size={30} strokeWidth={1.4} />
          </span>
          <strong>{business.name}</strong>
          <p>{content.footerTagline}</p>
        </div>
        <div>
          <h3>Contáctanos</h3>
          <ul className="ppa-footer__contact">
            <li>
              <a href={`tel:${business.phone.replace(/\s/g, '')}`}>
                <Icon name="phone" size={16} /> {business.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`}>
                <Icon name="mail" size={16} /> {business.email}
              </a>
            </li>
            <li>
              <button type="button" onClick={() => runCta({ label: 'Mapa', kind: 'external', target: contact.mapLinkUrl })}>
                <Icon name="pin" size={16} /> {business.address.line1}, {business.address.city}
              </button>
            </li>
            {business.openingHours.map((entry) => (
              <li key={entry.label}>
                <span>
                  <Icon name="clock" size={16} /> {entry.label}: {entry.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Enlaces rápidos">
          <h3>Enlaces rápidos</h3>
          <ul className="ppa-footer__links">
            {navigation.items
              .filter((item) => item.enabled)
              .map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => runCta(item.cta)}>
                    {item.label}
                  </button>
                </li>
              ))}
            <li>
              <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>
                Políticas
              </button>
            </li>
            <li>
              <button type="button" onClick={() => runCta({ label: 'Aviso legal', kind: 'route', target: '/aviso-legal' })}>
                Términos y condiciones
              </button>
            </li>
          </ul>
        </nav>
        <div>
          <h3>Síguenos</h3>
          <p className="ppa-footer__social-text">Publicamos transformaciones y consejos de cuidado cada semana.</p>
          <div className="ppa-footer__social">
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
      </Container>
      <div className="ppa-footer__bar">
        <Container className="ppa-footer__bar-inner">
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
 * Modal de solicitud (se abre desde header, hero y servicios)
 * ======================================================================== */

export function PelosPazAmorBookingModal() {
  const { openModal, setOpenModal, config } = useSite();
  return (
    <Modal open={openModal === 'booking'} onClose={() => setOpenModal(null)} title="Solicita tu cita" size="md">
      <p className="wf-note ppa-booking__intro">
        Cuéntanos qué necesita tu peludo y te confirmamos día y hora. {config.booking.confirmationMessage}
      </p>
      <BookingForm layout="grid-2" submitLabel="Enviar solicitud" showIntro />
    </Modal>
  );
}

export const PELOS_PAZ_AMOR_SECTIONS: Record<string, SectionComponent> = {
  'ppa-header-01': Header,
  'ppa-hero-01': Hero,
  'ppa-services-01': Services,
  'ppa-transformations-01': Transformations,
  'ppa-process-01': Process,
  'ppa-testimonials-01': Mosaic,
  'ppa-faq-01': Faq,
  'ppa-footer-01': Footer,
};
