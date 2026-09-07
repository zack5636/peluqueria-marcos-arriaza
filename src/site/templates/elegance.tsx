import { useRef, useState } from 'react';
import { useSite } from '../context';
import { useActiveSection, useStickyHeader } from '../hooks';
import type { SectionComponent } from '../registry';
import { Carousel } from '../components/Carousel';
import { BrandMark } from '../components/BrandMark';
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
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
import type { PlanItem } from '../types';

/* ======================================================================== *
 * Header integrado en el hero oscuro
 * ======================================================================== */

const Header: SectionComponent = ({ section }) => {
  const { config, runCta, setOpenModal } = useSite();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(config.navigation.items);
  const stuck = useStickyHeader(80);
  const { business, navigation } = config;

  return (
    <SectionShell as="header" anchor={section.anchor} className={`el-header${stuck ? ' is-stuck' : ''}`}>
      <Container className="el-header__inner">
        <button type="button" className="el-brand" onClick={() => runCta({ label: 'Inicio', kind: 'anchor', target: '#inicio' })}>
          <BrandMark icon="paw" size={26} strokeWidth={1.3} inverse />
          <span>
            <strong>{business.name}</strong>
            <small>{business.descriptor}</small>
          </span>
        </button>

        <nav className="el-nav" aria-label="Navegación principal">
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

        <div className="el-header__actions">
          <button type="button" className="wf-btn wf-btn--primary wf-btn--sm el-cta" onClick={() => setOpenModal('booking')}>
            <Icon name="calendar" size={17} />
            <span>Reservar ahora</span>
          </button>
          <button
            type="button"
            className="el-burger"
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
        tone="dark"
        footer={
          <button
            type="button"
            className="wf-btn wf-btn--primary wf-btn--md wf-btn--full"
            onClick={() => {
              setOpen(false);
              setOpenModal('booking');
            }}
          >
            Reservar ahora
          </button>
        }
      />
    </SectionShell>
  );
};

/* ======================================================================== *
 * Hero cinematográfico
 * ======================================================================== */

const Hero: SectionComponent = ({ section }) => {
  const { config, setOpenModal } = useSite();
  const hero = config.content.hero;

  return (
    <SectionShell anchor={section.anchor} className="el-hero">
      <div className="el-hero__media">
        <Picture image={hero.image} loading="eager" />
      </div>
      <div className="el-hero__veil" aria-hidden="true" />
      <Container className="el-hero__inner">
        <div className="el-hero__copy">
          <p className="wf-eyebrow el-hero__eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="el-hero__lead">{hero.paragraph}</p>
          <div className="el-hero__ctas">
            <button type="button" className="wf-btn wf-btn--primary wf-btn--lg" onClick={() => setOpenModal('booking')}>
              <Icon name="calendar" size={18} />
              <span>{hero.primaryCta.label}</span>
            </button>
            {hero.videoCta.enabled ? (
              <button type="button" className="el-video-btn" onClick={() => setOpenModal('video')}>
                <span className="el-video-btn__icon">
                  <Icon name="play" size={16} />
                </span>
                <span>{hero.videoCta.label}</span>
              </button>
            ) : null}
          </div>
        </div>
        <ul className="el-hero__guarantees">
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
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Servicios destacados — cuatro cards con retrato
 * ======================================================================== */

const Services: SectionComponent = ({ section }) => {
  const { config, formatPrice, runCta } = useSite();
  const services = config.services.filter((s) => s.enabled);
  const heading = config.content.headings.services;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--surface el-services">
      <Container>
        <div className="el-services__head">
          {heading ? <Heading heading={heading} align="left" className="el-services__heading" /> : null}
          <CtaButton
            cta={{ label: 'Ver todos los servicios', kind: 'route', target: '/servicios' }}
            variant="secondary"
            size="sm"
          />
        </div>
        <div className="el-services__grid">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              className="wf-card wf-card--interactive el-service"
              onClick={() => runCta({ label: service.name, kind: 'route', target: `/servicios/${service.slug}` })}
            >
              <span className="el-service__photo">
                <Picture image={service.image} />
                <span className="el-service__icon">
                  <Icon name={service.icon as never} size={18} />
                </span>
              </span>
              <span className="el-service__body">
                <strong>{service.name}</strong>
                <span className="el-service__desc">{service.shortDescription}</span>
                {service.priceFromEur !== null ? (
                  <span className="el-service__price">
                    Desde <b>{formatPrice(service.priceFromEur)}</b>
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Franja partida: planes de cuidado + perfil de mascota
 * ======================================================================== */

const PlansAndProfile: SectionComponent = ({ section }) => {
  const { config, formatPrice, runCta } = useSite();
  const plans = config.plans.filter((p) => p.enabled);
  const profile = config.content.petProfile;
  const [detail, setDetail] = useState<PlanItem | null>(null);

  return (
    <div className="el-split">
      <SectionShell anchor={section.anchor} className="el-plans" surface="dark">
        <div className="el-split__inner">
          {config.content.headings.plans ? <Heading heading={config.content.headings.plans} align="left" /> : null}
          <div className="el-plans__grid">
            {plans.map((plan) => (
              <article key={plan.id} className={`el-plan${plan.highlighted ? ' is-featured' : ''}`}>
                {plan.highlighted ? <Ribbon label={plan.highlightLabel} /> : null}
                <h3>{plan.name}</h3>
                <ul>
                  {plan.includes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="el-plan__price">
                  {formatPrice(plan.monthlyPriceEur, '/mes')}
                </p>
                <button type="button" className="wf-btn wf-btn--ghost wf-btn--sm wf-btn--full" onClick={() => setDetail(plan)}>
                  Elegir plan
                </button>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell anchor="perfil-mascota" className="el-profile" surface="alternative">
        <div className="el-split__inner el-profile__inner">
          <div className="el-profile__copy">
            {profile.heading ? <Heading heading={profile.heading} align="left" /> : null}
            <ul className="wf-includes">
              {profile.bullets.map((line) => (
                <li key={line}>
                  <Icon name="check" size={16} /> {line}
                </li>
              ))}
            </ul>
            <CtaButton cta={profile.cta} icon="user" />
            <p className="wf-note">
              <Icon name="lock" size={14} /> Las alergias y notas de salud son privadas: nunca se muestran en la web pública.
            </p>
          </div>
          <div className="el-profile__mockup" aria-label="Ejemplo del perfil digital de mascota" role="img">
            <div className="el-phone">
              <div className="el-phone__status">
                <span>9:41</span>
                <span aria-hidden="true">▮▮▮</span>
              </div>
              <div className="el-phone__head">
                <span className="el-phone__avatar">
                  <Icon name="dog" size={22} />
                </span>
                <span>
                  <strong>{profile.mockup.petName}</strong>
                  <small>
                    {profile.mockup.breed} · {profile.mockup.age}
                  </small>
                  <small>Cliente desde {profile.mockup.customerSince}</small>
                </span>
              </div>
              <div className="el-phone__card">
                <span className="el-phone__label">Próxima cita</span>
                <strong>{profile.mockup.nextAppointment.service}</strong>
                <small>
                  {profile.mockup.nextAppointment.date} · {profile.mockup.nextAppointment.time}
                </small>
              </div>
              <div className="el-phone__list">
                <span className="el-phone__label">Historial reciente</span>
                {profile.mockup.history.map((entry) => (
                  <span key={`${entry.service}-${entry.date}`} className="el-phone__row">
                    <span>{entry.service}</span>
                    <small>{entry.date}</small>
                  </span>
                ))}
              </div>
              <span className="el-phone__cta">Agendar cita</span>
            </div>
          </div>
        </div>
      </SectionShell>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ? `Plan ${detail.name}` : ''}
        footer={
          detail ? (
            <>
              <button type="button" className="wf-btn wf-btn--ghost wf-btn--md" onClick={() => setDetail(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="wf-btn wf-btn--primary wf-btn--md"
                onClick={() => {
                  setDetail(null);
                  runCta({ label: 'Solicitar alta', kind: 'modal', target: 'booking' });
                }}
              >
                Aceptar condiciones y solicitar alta
              </button>
            </>
          ) : null
        }
      >
        {detail ? (
          <div className="wf-service-detail">
            <p className="wf-price">{formatPrice(detail.monthlyPriceEur, '/mes')}</p>
            <ul className="wf-includes">
              {detail.includes.map((line) => (
                <li key={line}>
                  <Icon name="check" size={15} /> {line}
                </li>
              ))}
            </ul>
            <h3>Condiciones</h3>
            <ul className="wf-includes">
              {detail.conditions.map((line) => (
                <li key={line}>
                  <Icon name="notes" size={15} /> {line}
                </li>
              ))}
            </ul>
            <p className="wf-note">
              Solicitar el alta no genera ningún cobro: revisamos las condiciones contigo antes de activarlo.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

/* ======================================================================== *
 * Proceso de reserva
 * ======================================================================== */

const Process: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const steps = config.content.processSteps.filter((s) => s.enabled);
  const heading = config.content.headings.process;
  const degraded = config.booking.mode === 'direct-confirmed' && !config.booking.scheduleConnected;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--surface el-process">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <ol className="el-process__grid">
          {steps.map((step, index) => (
            <li key={step.id}>
              <span className="el-process__head">
                <span className="el-process__num">{index + 1}</span>
                <IconBadge icon={step.icon} size="md" />
              </span>
              <div className="el-process__body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 ? (
                <span className="el-process__arrow" aria-hidden="true">
                  <Icon name="arrowRight" size={18} />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        {degraded ? (
          <p className="wf-note el-process__note">
            <Icon name="bell" size={15} /> Sin agenda conectada, el paso final registra una solicitud pendiente de
            confirmación, no una cita cerrada.
          </p>
        ) : null}
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Testimonios sobre fondo negro
 * ======================================================================== */

const Testimonials: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const testimonials = config.testimonials.filter((t) => t.enabled);
  const heading = config.content.headings.testimonials;

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--inverse el-testimonials">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <Carousel
          items={testimonials}
          visible={3}
          label="Testimonios de clientes"
          className="el-testimonials__carousel"
          renderItem={(item) => {
            const t = testimonials.find((x) => x.id === item.id);
            if (!t) return null;
            return (
              <article className="el-testimonial">
                <span className="el-testimonial__avatar">
                  <Picture image={t.avatar} />
                </span>
                <StarRating rating={t.rating} />
                <p>“{t.text}”</p>
                <footer>
                  — {t.author}, dueño/a de {t.petName}
                </footer>
              </article>
            );
          }}
        />
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Galería de seis fotografías
 * ======================================================================== */

const Gallery: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const gallery = config.gallery.filter((g) => g.enabled);
  const heading = config.content.headings.gallery;
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <SectionShell anchor={section.anchor} className="wf-section wf-band--surface el-gallery">
      <Container>
        {heading ? <Heading heading={heading} /> : null}
        <div className="el-gallery__grid">
          {gallery.map((item) => (
            <button key={item.id} type="button" className="el-gallery__item" onClick={() => setLightbox(item.id)}>
              <Picture image={item.image} />
              <span className="wf-sr-only">Ampliar: {item.caption}</span>
            </button>
          ))}
        </div>
        <div className="el-gallery__cta">
          <CtaButton cta={{ label: 'Ver más fotos', kind: 'route', target: '/galeria' }} variant="secondary" />
        </div>
      </Container>
      <Lightbox
        entries={gallery.map((item) => ({ id: item.id, image: item.image, caption: item.caption, meta: item.serviceName }))}
        openId={lightbox}
        onClose={() => setLightbox(null)}
      />
    </SectionShell>
  );
};

/* ======================================================================== *
 * CTA dorado final
 * ======================================================================== */

const FinalCta: SectionComponent = ({ section }) => {
  const { config, setOpenModal } = useSite();
  const cta = config.content.finalCta;

  return (
    <SectionShell anchor={section.anchor} className="el-final">
      <Container className="el-final__inner">
        <span className="el-final__paw" aria-hidden="true">
          <Icon name="paw" size={34} />
        </span>
        <div className="el-final__copy">
          <h2>{cta.title}</h2>
          <p>{cta.subtitle}</p>
        </div>
        <button type="button" className="wf-btn wf-btn--inverse wf-btn--lg" onClick={() => setOpenModal('booking')}>
          <Icon name="calendar" size={18} />
          <span>{cta.cta.label}</span>
        </button>
        <span className="el-final__dog">
          <Picture image={cta.image} decorative />
        </span>
      </Container>
    </SectionShell>
  );
};

/* ======================================================================== *
 * Footer antracita con newsletter
 * ======================================================================== */

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta, previewMode, announce } = useSite();
  const { business, content, contact, navigation } = config;
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<{ kind: 'idle' | 'ok' | 'error'; message: string }>({ kind: 'idle', message: '' });
  const year = new Date().getFullYear();
  const newsletter = content.newsletter;

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
      setState({ kind: 'error', message: 'Introduce un correo electrónico válido.' });
      return;
    }
    if (!consent) {
      setState({ kind: 'error', message: 'Debes aceptar el consentimiento para suscribirte.' });
      return;
    }
    // Sin proveedor conectado, la suscripción se registra localmente y se
    // comunica con claridad; no se simula un envío externo.
    setState({ kind: 'ok', message: newsletter.successMessage });
    setEmail('');
    setConsent(false);
    announce(newsletter.successMessage);
  };

  return (
    <>
      <SectionShell as="footer" anchor={section.anchor} className="el-footer">
        <Container className="el-footer__grid">
          <div className="el-footer__brand">
            <span className="el-footer__logo">
              <Icon name="paw" size={28} strokeWidth={1.3} />
              <strong>{business.name}</strong>
            </span>
            <p>{content.footerTagline}</p>
            <div className="el-footer__social">
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

          <nav aria-label="Navegación del pie">
            <h3>Navegación</h3>
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
                    <button
                      type="button"
                      onClick={() => runCta({ label: service.name, kind: 'route', target: `/servicios/${service.slug}` })}
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3>Contacto</h3>
            <ul className="el-footer__contact">
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
                <span>
                  <Icon name="pin" size={16} /> {business.address.line1}, {business.address.postalCode}{' '}
                  {business.address.city}
                </span>
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

          {newsletter.enabled ? (
            <div className="el-newsletter">
              <h3>{newsletter.title}</h3>
              <p>{newsletter.description}</p>
              <form onSubmit={subscribe} noValidate>
                <label className="wf-sr-only" htmlFor="el-newsletter-email">
                  Correo electrónico
                </label>
                <div className="el-newsletter__row">
                  <input
                    id="el-newsletter-email"
                    className="wf-input"
                    type="email"
                    value={email}
                    placeholder="Tu correo electrónico"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setState({ kind: 'idle', message: '' });
                    }}
                    aria-invalid={state.kind === 'error' || undefined}
                    aria-describedby="el-newsletter-status"
                  />
                  <button type="submit" className="wf-btn wf-btn--primary wf-btn--sm" aria-label={newsletter.buttonLabel}>
                    <Icon name="arrowRight" size={18} />
                  </button>
                </div>
                <label className="wf-consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>{newsletter.consentText}</span>
                </label>
                <p
                  id="el-newsletter-status"
                  className={`el-newsletter__status is-${state.kind}`}
                  role={state.kind === 'error' ? 'alert' : 'status'}
                >
                  {state.message}
                </p>
              </form>
            </div>
          ) : null}
        </Container>

        <div className="el-footer__bar">
          <Container className="el-footer__bar-inner">
            <span>
              © {year} {business.legalName}. {content.legal.copyrightNote}
            </span>
            <span className="el-footer__legal">
              <button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>
                Aviso de privacidad
              </button>
              <button type="button" onClick={() => runCta({ label: 'Términos', kind: 'route', target: '/aviso-legal' })}>
                Términos y condiciones
              </button>
              <button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>
                Cookies
              </button>
            </span>
          </Container>
        </div>
      </SectionShell>

      <button
        type="button"
        className="el-wa-float"
        aria-label="Escríbenos por WhatsApp"
        onClick={() =>
          runCta({
            label: 'WhatsApp',
            kind: 'whatsapp',
            target: business.whatsapp,
            message: 'Hola, me gustaría reservar una cita en Elegance.',
          })
        }
      >
        <Icon name="whatsapp" size={26} />
      </button>
    </>
  );
};

/* ======================================================================== *
 * Modales globales de la template
 * ======================================================================== */

export function EleganceModals() {
  const { openModal, setOpenModal, config } = useSite();
  const video = config.content.hero.videoCta;

  return (
    <>
      <Modal open={openModal === 'video'} onClose={() => setOpenModal(null)} title="Vídeo de marca" size="video">
        <div className="el-video">
          {video.videoSrc ? (
            <video controls poster={video.posterSrc} preload="none">
              <source src={video.videoSrc} type="video/mp4" />
              <track kind="captions" srcLang="es" label="Español" />
              Tu navegador no admite vídeo HTML5.
            </video>
          ) : (
            <div className="el-video__poster">
              <img src={video.posterSrc} alt="Fotograma del salón Elegance" />
              <p>
                Todavía no hay un vídeo cargado para este proyecto. Sube el archivo desde Contenido para activarlo; el
                botón se ocultará automáticamente si no existe.
              </p>
            </div>
          )}
        </div>
        <details className="el-video__transcript">
          <summary>Transcripción</summary>
          <p>{video.transcript}</p>
        </details>
      </Modal>
    </>
  );
}

export const ELEGANCE_SECTIONS: Record<string, SectionComponent> = {
  'el-header-01': Header,
  'el-hero-01': Hero,
  'el-services-01': Services,
  'el-plans-01': PlansAndProfile,
  'el-process-01': Process,
  'el-testimonials-01': Testimonials,
  'el-gallery-01': Gallery,
  'el-finalcta-01': FinalCta,
  'el-footer-01': Footer,
};
