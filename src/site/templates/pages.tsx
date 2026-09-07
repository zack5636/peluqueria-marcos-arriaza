import { useMemo, useState } from 'react';
import { useSite } from '../context';
import { useCatalogo } from '../../manageos/useCatalogo';
import { useManageOS } from '../../manageos/useManageOS';
import { formatearHorario } from '../../manageos/horario';
import type { SectionComponent } from '../registry';
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
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
import { Accordion } from '../components/Accordion';
import { ReservaConectada } from '../../manageos/ReservaConectada';
/*
 * Sigue existiendo para «Crear perfil de mascota» (`PetProfileCreatePage`), que
 * no es una reserva: da de alta un perfil con verificación por correo. No hay
 * ruta que la enlace en esta web, pero el componente es genérico y no le
 * corresponde desaparecer con la reserva.
 */
import { BookingForm } from '../components/BookingForm';
import { BeforeAfterSlider } from '../components/BeforeAfter';
import type { ImageAsset } from '../types';

/**
 * Páginas secundarias compartidas por las cuatro templates.
 *
 * Leen exclusivamente tokens del tema activo, de modo que cada template las
 * viste con su propia identidad sin duplicar componentes. Todas se apoyan en el
 * mismo esqueleto —hero de página, cuerpo rico y cierre con llamada a la
 * acción— para que una ruta secundaria no se sienta más pobre que la portada.
 */

/* ------------------------------------------------------------------ *
 * Piezas comunes
 * ------------------------------------------------------------------ */

function PageHero({
  eyebrow,
  title,
  lead,
  image,
  actions,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  image?: ImageAsset | null;
  actions?: React.ReactNode;
}) {
  const { config } = useSite();
  const surface = config.meta.templateId === 'canine-elegance' ? 'dark' : 'alternative';
  return (
    <div className={`wf-pagehero${image ? ' wf-pagehero--media' : ''}`} data-wf-surface={surface}>
      <Container className="wf-pagehero__inner">
        <div className="wf-pagehero__copy">
          <p className="wf-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {lead ? <p className="wf-pagehero__lead wf-prose">{lead}</p> : null}
          {actions ? <div className="wf-pagehero__actions">{actions}</div> : null}
        </div>
        {image ? (
          <div className="wf-pagehero__media">
            <Picture image={image} loading="eager" />
          </div>
        ) : null}
      </Container>
    </div>
  );
}

/** Cierre común: evita que una ruta termine en seco. */
function PageCta({ title, subtitle }: { title: string; subtitle: string }) {
  const { setOpenModal } = useSite();
  return (
    <div className="wf-section wf-band wf-pagecta">
      <Container className="wf-pagecta__inner">
        <div>
          <h2>{title}</h2>
          <p className="wf-prose">{subtitle}</p>
        </div>
        <button type="button" className="wf-btn wf-btn--primary wf-btn--lg" onClick={() => setOpenModal('booking')}>
          <Icon name="calendar" size={18} />
          <span>Reservar cita</span>
        </button>
      </Container>
    </div>
  );
}

/**
 * Datos de contacto reutilizados por Sobre nosotros, Contacto y Reserva.
 *
 * El horario es el único de estos datos que Manager también gobierna una vez
 * la web está conectada: mientras que dirección, teléfono y correo son cosas
 * que el propio negocio escribe en su ficha de contenido, el horario es
 * justo lo que decide si hay hueco que ofrecer, así que enseñarlo desde aquí
 * sin mirar a Manager podía llevar a un horario de mentira que ya no
 * coincidía con el de verdad. Sin conexión, se sigue enseñando el de la
 * ficha —una web sin ManageOS detrás no tiene otro horario que mostrar—.
 */
function ContactDetails() {
  const { config, runCta } = useSite();
  const { business } = config;
  const conexion = useManageOS();
  const horario = conexion.estado === 'conectado' ? formatearHorario(conexion.datos.hours) : business.openingHours;
  return (
    <ul className="wf-contactlist">
      <li>
        <IconBadge icon="pin" size="sm" />
        <div>
          <strong>Dirección</strong>
          <span>
            {business.address.line1}, {business.address.postalCode} {business.address.city}
          </span>
        </div>
      </li>
      <li>
        <IconBadge icon="phone" size="sm" />
        <div>
          <strong>Teléfono</strong>
          <button type="button" className="wf-btn--link" onClick={() => runCta({ label: business.phone, kind: 'tel', target: business.phone })}>
            {business.phone}
          </button>
        </div>
      </li>
      <li>
        <IconBadge icon="whatsapp" size="sm" />
        <div>
          <strong>WhatsApp</strong>
          <button
            type="button"
            className="wf-btn--link"
            onClick={() => runCta({ label: 'WhatsApp', kind: 'whatsapp', target: business.whatsapp, message: 'Hola, me gustaría pedir cita.' })}
          >
            {business.whatsapp}
          </button>
        </div>
      </li>
      {business.email ? (
        <li>
          <IconBadge icon="mail" size="sm" />
          <div>
            <strong>Correo</strong>
            <button type="button" className="wf-btn--link" onClick={() => runCta({ label: business.email, kind: 'mailto', target: business.email })}>
              {business.email}
            </button>
          </div>
        </li>
      ) : null}
      <li>
        <IconBadge icon="clock" size="sm" />
        <div>
          <strong>Horario</strong>
          <span>
            {horario.map((entry) => `${entry.label}: ${entry.value}`).join(' · ')}
          </span>
        </div>
      </li>
    </ul>
  );
}

/**
 * Mapa de la dirección del proyecto.
 *
 * Representación local y autónoma. La cartografía externa solo se abre cuando
 * el visitante pulsa «Cómo llegar», así la exportación no descarga tiles ni
 * depende de un iframe de terceros para renderizar.
 */
function LocationMap() {
  const { config, runCta } = useSite();
  const { business } = config;
  const consulta = `${business.address.line1}, ${business.address.postalCode} ${business.address.city}`.trim();
  const configurada = business.address.line1.trim().length > 3 && business.address.city.trim().length > 1;
  const indicaciones = `https://www.openstreetmap.org/search?query=${encodeURIComponent(consulta)}`;

  return (
    <div className="wf-map">
      <div className="wf-map__fallback" aria-label={`Ubicación de ${business.name}`}>
        <IconBadge icon="pin" size="lg" />
        <strong>{configurada ? consulta : 'Ubicación pendiente de configurar'}</strong>
        <span>
          {configurada
            ? 'Zona y dirección del salón. Abre las indicaciones cuando las necesites.'
            : 'Añade la dirección del negocio desde Contenido para completar la ubicación.'}
        </span>
      </div>
      <div className="wf-map__foot">
        <span>{business.serviceArea}</span>
        <button
          type="button"
          className="wf-btn wf-btn--secondary wf-btn--sm"
          onClick={() => runCta({ label: 'Cómo llegar', kind: 'external', target: indicaciones })}
        >
          <Icon name="pin" size={16} /> Cómo llegar
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Legales
 * ------------------------------------------------------------------ */

const LegalPage: SectionComponent = ({ section }) => {
  const { config, route } = useSite();
  const legal = config.content.legal;
  const doc =
    route.startsWith('/privacidad') ? legal.privacy : route.startsWith('/cookies') ? legal.cookies : legal.legalNotice;

  return (
    <SectionShell anchor={section.anchor} className="wf-band--surface">
      <Container className="wf-page-doc">
        <h1>{doc.title}</h1>
        {doc.body.split('\n\n').map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        <p>
          Responsable del tratamiento: {config.business.legalName}. Dirección: {config.business.address.line1},{' '}
          {config.business.address.postalCode} {config.business.address.city}.{' '}
          {config.business.email
            ? <>Correo de contacto: {config.business.email}.</>
            : <>Contacto: {config.business.phone}.</>}
        </p>
      </Container>
    </SectionShell>
  );
};

/* ------------------------------------------------------------------ *
 * Servicios
 * ------------------------------------------------------------------ */

const ServicesPage: SectionComponent = ({ section }) => {
  const { config, formatPrice, route, setOpenModal, selectBooking } = useSite();
  /* El catálogo de Manager, si la web está conectada. */
  const { servicios: services } = useCatalogo(config.services);
  const slug = /\/servicios\/([\w-]+)/.exec(route)?.[1];
  const focused = slug ? services.find((s) => s.slug === slug) : undefined;
  const faqs = config.faqs.filter((f) => f.enabled).slice(0, 6);
  const benefits = config.content.benefits.filter((b) => b.enabled).slice(0, 4);
  const [detalle, setDetalle] = useState<string | null>(null);

  const reservar = (serviceId: string, label: string) => {
    selectBooking({ serviceId, label });
    setOpenModal('booking');
  };

  if (focused) {
    return (
      <SectionShell anchor={section.anchor} className="wf-page">
        <PageHero
          eyebrow="Servicio"
          title={focused.name}
          lead={focused.longDescription || focused.shortDescription}
          image={focused.image}
          actions={
            <>
              <button type="button" className="wf-btn wf-btn--primary wf-btn--lg" onClick={() => reservar(focused.id, focused.name)}>
                <Icon name="calendar" size={18} /> <span>Reservar {focused.name}</span>
              </button>
              <CtaButton cta={{ label: 'Ver todos los servicios', kind: 'route', target: '/servicios' }} variant="secondary" size="lg" />
            </>
          }
        />
        <div className="wf-section wf-band--surface">
          <Container className="wf-detailgrid">
            <div className="wf-card wf-detailgrid__main">
              <h2>Qué incluye</h2>
              <ul className="wf-includes">
                {focused.includes.map((line) => (
                  <li key={line}>
                    <Icon name="check" size={16} /> {line}
                  </li>
                ))}
              </ul>
              <h3>Tamaños atendidos</h3>
              <ul className="wf-chiplist">
                {focused.sizes.map((size) => (
                  <li key={size}>{size}</li>
                ))}
              </ul>
            </div>
            <aside className="wf-card wf-detailgrid__aside">
              <p className="wf-eyebrow">Resumen</p>
              {focused.priceFromEur !== null ? (
                <p className="wf-price">
                  Desde <strong>{formatPrice(focused.priceFromEur)}</strong>
                </p>
              ) : null}
              <p>
                <Icon name="clock" size={16} /> {focused.durationMinutes} minutos aproximados
              </p>
              <p className="wf-note">{config.content.pricingNote}</p>
              <button type="button" className="wf-btn wf-btn--primary wf-btn--full" onClick={() => reservar(focused.id, focused.name)}>
                Reservar ahora
              </button>
            </aside>
          </Container>
        </div>
        <PageCta title="¿Dudas con este servicio?" subtitle="Cuéntanos cómo es tu perro y te recomendamos la opción adecuada." />
      </SectionShell>
    );
  }

  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Servicios"
        title="Todo lo que tu mascota necesita"
        lead="Precios orientativos por perro pequeño. Confirmamos el importe final según tamaño, manto y estado del pelo antes de empezar."
        image={config.content.hero.image}
        actions={
          <button type="button" className="wf-btn wf-btn--primary wf-btn--lg" onClick={() => setOpenModal('booking')}>
            <Icon name="calendar" size={18} /> <span>Reservar cita</span>
          </button>
        }
      />

      <div className="wf-section wf-band--surface">
        <Container>
          <div className="wf-servicegrid">
            {services.map((service) => (
              <article key={service.id} className="wf-card wf-servicecard">
                <div className="wf-servicecard__media">
                  <Picture image={service.image} />
                  {service.priceFromEur !== null ? (
                    <span className="wf-servicecard__price">Desde {formatPrice(service.priceFromEur)}</span>
                  ) : null}
                </div>
                <div className="wf-servicecard__body">
                  <IconBadge icon={service.icon} accent={service.accent} />
                  <h2>{service.name}</h2>
                  <p>{service.shortDescription}</p>
                  <ul className="wf-includes wf-includes--tight">
                    {service.includes.slice(0, 3).map((line) => (
                      <li key={line}>
                        <Icon name="check" size={14} /> {line}
                      </li>
                    ))}
                  </ul>
                  <p className="wf-servicecard__meta">
                    <span>
                      <Icon name="clock" size={14} /> {service.durationMinutes} min
                    </span>
                    <span>{service.sizes.length} tamaños</span>
                  </p>
                  <div className="wf-servicecard__actions">
                    <button type="button" className="wf-btn wf-btn--primary wf-btn--sm" onClick={() => reservar(service.id, service.name)}>
                      Reservar
                    </button>
                    <button type="button" className="wf-btn wf-btn--secondary wf-btn--sm" onClick={() => setDetalle(service.id)}>
                      Ver detalle
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </div>

      {benefits.length > 0 ? (
        <div className="wf-section wf-band">
          <Container>
            <Heading heading={{ eyebrow: 'Por qué nosotros', title: 'Ventajas incluidas en cada servicio', subtitle: '' }} />
            <div className="wf-benefitgrid">
              {benefits.map((benefit) => (
                <article key={benefit.id} className="wf-card wf-benefitcard">
                  <IconBadge icon={benefit.icon} />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      {faqs.length > 0 ? (
        <div className="wf-section wf-band--surface">
          <Container className="wf-narrow">
            <Heading heading={{ eyebrow: 'Dudas frecuentes', title: 'Sobre nuestros servicios', subtitle: '' }} />
            <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
          </Container>
        </div>
      ) : null}

      <PageCta title="¿Preparado para reservar?" subtitle="Elige el servicio y te confirmamos disponibilidad." />

      {detalle ? (
        <ServiceDetailDialog
          serviceId={detalle}
          onClose={() => setDetalle(null)}
          onReservar={(id, label) => {
            setDetalle(null);
            reservar(id, label);
          }}
        />
      ) : null}
    </SectionShell>
  );
};

function ServiceDetailDialog({
  serviceId,
  onClose,
  onReservar,
}: {
  serviceId: string;
  onClose: () => void;
  onReservar: (id: string, label: string) => void;
}) {
  const { config, formatPrice } = useSite();
  const { servicios: catalogo } = useCatalogo(config.services);
  const service = catalogo.find((s) => s.id === serviceId);
  if (!service) return null;
  return (
    <div className="wf-overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wf-dialog" role="dialog" aria-modal="true" aria-label={service.name}>
        <header className="wf-dialog__head">
          <h2>{service.name}</h2>
          <button type="button" className="wf-dialog__close" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="wf-dialog__body">
          <Picture image={service.image} />
          <p>{service.longDescription || service.shortDescription}</p>
          <ul className="wf-includes">
            {service.includes.map((line) => (
              <li key={line}>
                <Icon name="check" size={15} /> {line}
              </li>
            ))}
          </ul>
          <p className="wf-dialog__meta">
            {service.priceFromEur !== null ? <strong>Desde {formatPrice(service.priceFromEur)}</strong> : null}
            <span>
              <Icon name="clock" size={15} /> {service.durationMinutes} min
            </span>
          </p>
        </div>
        <footer className="wf-dialog__foot">
          <button type="button" className="wf-btn wf-btn--secondary" onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className="wf-btn wf-btn--primary" onClick={() => onReservar(service.id, service.name)}>
            Reservar este servicio
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Planes y paquetes
 * ------------------------------------------------------------------ */

const PricingPage: SectionComponent = ({ section }) => {
  const { config, formatPrice, setOpenModal, selectBooking } = useSite();
  /*
   * Precio por servicio, no por paquete inventado.
   *
   * La plantilla original ofrecía aquí combos ("Básico", "Completo", "Premium
   * Spa") con un precio de bloque que no corresponde a ningún servicio real
   * de Manager, así que no había forma de mantenerlos sincronizados ni de
   * verificar el ahorro que prometían. En vez de inventar esa cifra, esta
   * página tira del mismo catálogo — y por tanto del mismo precio — que ya
   * usan `/servicios` y la reserva: si cambia en Manager, cambia aquí solo.
   */
  const { servicios: services } = useCatalogo(config.services);
  const plans = config.plans.filter((p) => p.enabled);
  const faqs = config.faqs.filter((f) => f.enabled).slice(0, 4);

  const reservar = (serviceId: string, label: string) => {
    selectBooking({ serviceId, label });
    setOpenModal('booking');
  };
  const elegir = (id: string, label: string, tipo: 'packageId' | 'planId') => {
    selectBooking({ [tipo]: id, label } as never);
    setOpenModal('booking');
  };

  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Tarifas"
        title={plans.length > 0 ? 'Planes y precios' : 'Precio por servicio'}
        lead={config.content.pricingNote}
        actions={
          <button type="button" className="wf-btn wf-btn--primary wf-btn--lg" onClick={() => setOpenModal('booking')}>
            <Icon name="calendar" size={18} /> <span>Reservar cita</span>
          </button>
        }
      />

      {services.length > 0 ? (
        <div className="wf-section wf-band--surface">
          <Container>
            <Heading heading={{ eyebrow: 'Servicios', title: 'Cada servicio, con su precio', subtitle: '' }} />
            <div className="wf-pricegrid">
              {services.map((item) => (
                <article key={item.id} className="wf-card wf-pricecard">
                  <h3>{item.name}</h3>
                  <p className="wf-price">
                    <strong>{item.priceFromEur === null ? 'Consultar' : formatPrice(item.priceFromEur)}</strong>
                    {item.durationMinutes ? <span> · {item.durationMinutes} min</span> : null}
                  </p>
                  <p className="wf-note">{item.shortDescription}</p>
                  <ul className="wf-includes">
                    {item.includes.map((line) => (
                      <li key={line}>
                        <Icon name="check" size={15} /> {line}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="wf-btn wf-btn--primary wf-btn--full" onClick={() => reservar(item.id, item.name)}>
                    Reservar {item.name}
                  </button>
                </article>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      {plans.length > 0 ? (
        <div className="wf-section wf-band">
          <Container>
            <Heading heading={{ eyebrow: 'Planes mensuales', title: 'Ahorra y consiéntelo siempre', subtitle: '' }} />
            <div className="wf-pricegrid">
              {plans.map((item) => (
                <article key={item.id} className={`wf-card wf-pricecard${item.highlighted ? ' is-featured' : ''}`}>
                  {item.highlighted ? <Ribbon label="Más popular" /> : null}
                  <h3>{item.name}</h3>
                  <p className="wf-price">
                    <strong>{formatPrice(item.monthlyPriceEur)}</strong>
                    <span>/mes</span>
                  </p>
                  <ul className="wf-includes">
                    {item.includes.map((line) => (
                      <li key={line}>
                        <Icon name="check" size={15} /> {line}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="wf-btn wf-btn--primary wf-btn--full" onClick={() => elegir(item.id, item.name, 'planId')}>
                    Elegir plan
                  </button>
                </article>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      {config.content.packagesSideBenefits.length > 0 ? (
        <div className="wf-section wf-band--surface">
          <Container className="wf-narrow">
            <h2>Incluido en todas las opciones</h2>
            <ul className="wf-includes">
              {config.content.packagesSideBenefits.map((line) => (
                <li key={line}>
                  <Icon name="check" size={16} /> {line}
                </li>
              ))}
            </ul>
          </Container>
        </div>
      ) : null}

      {faqs.length > 0 ? (
        <div className="wf-section wf-band">
          <Container className="wf-narrow">
            <Heading heading={{ eyebrow: 'Condiciones', title: 'Preguntas sobre tarifas', subtitle: '' }} />
            <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
          </Container>
        </div>
      ) : null}

      <PageCta title="Elige tu opción" subtitle="Te confirmamos disponibilidad y resolvemos cualquier duda antes de cobrar nada." />
    </SectionShell>
  );
};

/* ------------------------------------------------------------------ *
 * Galería
 * ------------------------------------------------------------------ */

const GalleryPage: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const gallery = config.gallery.filter((g) => g.enabled);
  const transformations = config.transformations.filter((t) => t.enabled);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('todas');

  const categorias = useMemo(() => {
    const set = new Set(gallery.map((g) => g.serviceName).filter(Boolean));
    return ['todas', ...set];
  }, [gallery]);

  const visibles = filtro === 'todas' ? gallery : gallery.filter((g) => g.serviceName === filtro);

  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Galería"
        title="El local y el trabajo de cada día"
        lead="Fotos reales del negocio: el espacio, la estación de baño y algunos de los resultados que dejan clientes y su ficha de Google."
      />

      {categorias.length > 2 ? (
        <div className="wf-section wf-section--tight wf-band--surface">
          <Container>
            <ul className="wf-filterbar" role="group" aria-label="Filtrar galería">
              {categorias.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    className={`wf-chip${filtro === cat ? ' is-active' : ''}`}
                    aria-pressed={filtro === cat}
                    onClick={() => setFiltro(cat)}
                  >
                    {cat === 'todas' ? 'Todas' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      ) : null}

      <div className="wf-section wf-band--surface">
        <Container>
          {visibles.length === 0 ? (
            <p className="wf-note">Todavía no hay fotografías en esta categoría.</p>
          ) : (
            <div className="wf-gallerygrid">
              {visibles.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="wf-gallerygrid__item"
                  onClick={() => setLightbox(item.id)}
                >
                  <Picture image={item.image} loading={index < 4 ? 'eager' : 'lazy'} />
                  <span className="wf-gallerygrid__caption">
                    <strong>{item.caption}</strong>
                    {item.serviceName ? <small>{item.serviceName}</small> : null}
                  </span>
                </button>
              ))}
            </div>
          )}
        </Container>
      </div>

      {transformations.length > 0 ? (
        <div className="wf-section wf-band">
          <Container>
            <Heading heading={{ eyebrow: 'Antes y después', title: 'Compara el resultado', subtitle: '' }} />
            <div className="wf-transformgrid">
              {transformations.map((item) => (
                <figure key={item.id} className="wf-card wf-transformcard">
                  <BeforeAfterSlider item={item} />
                  <figcaption>
                    <strong>{item.petName}</strong> · {item.breed} · {item.serviceName}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      <PageCta title="¿Quieres un resultado así?" subtitle="Reserva una cita y cuéntanos cómo te gustaría ver a tu perro." />

      <Lightbox
        entries={gallery.map((item) => ({ id: item.id, image: item.image, caption: item.caption, meta: item.serviceName }))}
        openId={lightbox}
        onClose={() => setLightbox(null)}
      />
    </SectionShell>
  );
};

/* ------------------------------------------------------------------ *
 * Sobre nosotros
 * ------------------------------------------------------------------ */

const AboutPage: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const benefits = config.content.benefits.filter((b) => b.enabled);
  const team = config.team.filter((t) => t.enabled);
  const steps = config.content.processSteps.filter((s) => s.enabled);

  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Sobre nosotros"
        title="Así trabaja Marcos"
        lead={config.business.tagline}
        image={config.content.ambienceImage ?? config.content.hero.image}
      />

      <div className="wf-section wf-band--surface">
        <Container className="wf-storygrid">
          <div className="wf-storygrid__copy">
            <h2>Un solo peluquero, la misma atención cada vez</h2>
            <p className="wf-prose">{config.content.hero.paragraph}</p>
            <p className="wf-prose">
              Es él quien recibe, quien peina y quien te devuelve al perro — nadie más pasa por medio. Trato cercano,
              paciencia y un resultado cuidado es justo lo que repiten sus clientes en Google, y es también la razón de
              que la agenda tenga hueco limitado cada día.
            </p>
            <p className="wf-prose">
              Su filosofía, en sus propias reseñas: si el perro no está tranquilo, se para y se retoma con calma antes
              que forzar un acabado perfecto en un animal asustado.
            </p>
          </div>
          <aside className="wf-card wf-storygrid__aside">
            <p className="wf-eyebrow">Nuestros valores</p>
            <ul className="wf-includes">
              {benefits.map((benefit) => (
                <li key={benefit.id}>
                  <Icon name="check" size={16} /> <strong>{benefit.title}</strong> — {benefit.description}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </div>

      {steps.length > 0 ? (
        <div className="wf-section wf-band">
          <Container>
            <Heading heading={{ eyebrow: 'Cómo trabajamos', title: 'Nuestro proceso, paso a paso', subtitle: '' }} />
            <ol className="wf-processgrid">
              {steps.map((step, index) => (
                <li key={step.id} className="wf-card wf-processcard">
                  <span className="wf-processcard__num">{index + 1}</span>
                  <IconBadge icon={step.icon} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </div>
      ) : null}

      {team.length > 0 ? (
        <div className="wf-section wf-band--surface">
          <Container>
            <Heading heading={{ eyebrow: 'Equipo', title: 'Quién cuidará de tu perro', subtitle: '' }} />
            <div className="wf-teamgrid">
              {team.map((member) => (
                <article key={member.id} className="wf-card wf-teamcard">
                  <Picture image={member.photo} />
                  <h3>{member.name}</h3>
                  <p className="wf-teamcard__role">{member.role}</p>
                  <p>{member.bio}</p>
                  <p className="wf-note">{member.availability}</p>
                </article>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      <div className="wf-section wf-band">
        <Container className="wf-locationgrid">
          <div>
            <Heading heading={{ eyebrow: 'Dónde estamos', title: 'Ven a conocernos', subtitle: '' }} align="left" />
            <ContactDetails />
          </div>
          <LocationMap />
        </Container>
      </div>

      <PageCta title="¿Nos conocemos?" subtitle="Reserva una primera cita y te enseñamos el salón sin compromiso." />
    </SectionShell>
  );
};

/* ------------------------------------------------------------------ *
 * Contacto
 * ------------------------------------------------------------------ */

const ContactPage: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Contacto"
        title="Hablamos cuando quieras"
        lead={`Estamos en ${config.business.address.city}. Escríbenos, llámanos o reserva directamente desde aquí.`}
      />
      <div className="wf-section wf-band--surface">
        <Container className="wf-locationgrid">
          <div>
            <h2>Datos de contacto</h2>
            <ContactDetails />
            <LocationMap />
          </div>
          <div className="wf-card wf-contactform">
            <h2>Pide tu cita</h2>
            <ReservaConectada whatsapp={config.business.whatsapp} />
          </div>
        </Container>
      </div>
      <PageCta title="¿Prefieres llamarnos?" subtitle="Atendemos el teléfono en horario de salón y respondemos WhatsApp durante todo el día." />
    </SectionShell>
  );
};

/* ------------------------------------------------------------------ *
 * Reserva
 * ------------------------------------------------------------------ */

const BookingPage: SectionComponent = ({ section }) => {
  const { config } = useSite();

  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Reserva"
        title="Reserva tu cita"
        lead="Elige servicio, día y hora. Te confirmamos al momento."
      />
      <div className="wf-section wf-band--surface">
        <Container className="wf-bookinggrid">
          <div className="wf-card wf-bookinggrid__form">
            <ReservaConectada whatsapp={config.business.whatsapp} />
          </div>
          <aside className="wf-bookinggrid__aside">
            <div className="wf-card">
              <p className="wf-eyebrow">Dónde estamos</p>
              <ContactDetails />
            </div>
          </aside>
        </Container>
      </div>
    </SectionShell>
  );
};

/* ------------------------------------------------------------------ *
 * Perfil de mascota
 * ------------------------------------------------------------------ */

const PetProfilePage: SectionComponent = ({ section }) => {
  const { config, setOpenModal } = useSite();
  const perfil = config.content.petProfile;
  const mockup = perfil.mockup;

  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Perfil de mascota"
        title={perfil.heading.title || 'Su historia, su cuidado'}
        lead={perfil.heading.subtitle}
        actions={
          <>
            <CtaButton cta={{ label: 'Crear perfil', kind: 'route', target: '/perfil-mascota/crear' }} size="lg" />
            <button type="button" className="wf-btn wf-btn--secondary wf-btn--lg" onClick={() => setOpenModal('booking')}>
              <Icon name="calendar" size={18} /> <span>Agendar cita</span>
            </button>
          </>
        }
      />

      <div className="wf-section wf-band--surface">
        <Container className="wf-profilegrid">
          <div>
            <h2>Qué guarda el perfil</h2>
            <ul className="wf-includes">
              {perfil.bullets.map((line) => (
                <li key={line}>
                  <Icon name="check" size={16} /> {line}
                </li>
              ))}
            </ul>
            <p className="wf-note">
              Las alergias y notas de salud son privadas: nunca se muestran en la web pública y solo las ve el equipo del
              salón.
            </p>
          </div>

          {/* Ficha demostrativa con datos reales del snapshot. */}
          <article className="wf-card wf-petcard">
            <header className="wf-petcard__head">
              <IconBadge icon="paw" size="lg" />
              <div>
                <h3>{mockup.petName}</h3>
                <p>
                  {mockup.breed} · {mockup.age}
                </p>
                <small>Cliente desde {mockup.customerSince}</small>
              </div>
            </header>
            <section className="wf-petcard__block">
              <p className="wf-eyebrow">Próxima cita</p>
              <strong>{mockup.nextAppointment.service}</strong>
              <span>{mockup.nextAppointment.date}</span>
            </section>
            <section className="wf-petcard__block">
              <p className="wf-eyebrow">Historial reciente</p>
              <ul>
                {mockup.history.map((entry) => (
                  <li key={`${entry.service}-${entry.date}`}>
                    <span>{entry.service}</span>
                    <small>{entry.date}</small>
                  </li>
                ))}
              </ul>
            </section>
            <button type="button" className="wf-btn wf-btn--primary wf-btn--full" onClick={() => setOpenModal('booking')}>
              <Icon name="calendar" size={17} /> <span>Agendar cita</span>
            </button>
          </article>
        </Container>
      </div>

      <PageCta title="Crea el perfil de tu perro" subtitle="Tardarás menos de dos minutos y no tendrás que repetir sus datos nunca más." />
    </SectionShell>
  );
};

/** Alta del perfil: formulario real, separado de la reserva de cita. */
const PetProfileCreatePage: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Alta de perfil"
        title="Crear perfil de mascota"
        lead="El perfil guarda el historial de servicios, recordatorios y preferencias de tu perro."
      />
      <div className="wf-section wf-band--surface">
        <Container className="wf-narrow">
          <div className="wf-card">
            <p className="wf-note">
              El alta requiere verificación: al enviar la solicitud te enviamos un enlace de un solo uso al correo
              indicado para confirmar el acceso. Sin esa confirmación el perfil no se activa.
            </p>
            <BookingForm layout="grid-2" submitLabel="Solicitar alta del perfil" />
            <p className="wf-note">
              Responsable del tratamiento: {config.business.legalName}. Puedes ejercer tus derechos escribiendo a{' '}
              {config.business.email}.
            </p>
          </div>
        </Container>
      </div>
    </SectionShell>
  );
};

/* ------------------------------------------------------------------ *
 * Opiniones y preguntas
 * ------------------------------------------------------------------ */

const TestimonialsPage: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const testimonials = config.testimonials.filter((t) => t.enabled);
  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Opiniones"
        title="Lo que dicen nuestros clientes"
        lead="Reseñas reales de familias que confían en nosotros mes a mes."
      />
      <div className="wf-section wf-band--surface">
        <Container>
          <div className="wf-reviewgrid">
            {testimonials.map((item) => (
              <article key={item.id} className="wf-card wf-reviewcard">
                <StarRating rating={item.rating} />
                <p>“{item.text}”</p>
                <footer>
                  <strong>{item.author}</strong>
                  {item.petName ? <small>dueño/a de {item.petName}</small> : null}
                </footer>
              </article>
            ))}
          </div>
        </Container>
      </div>
      <PageCta title="¿Nos dejas la tuya?" subtitle="Después de tu cita te enviamos un enlace para valorar el servicio." />
    </SectionShell>
  );
};

const FaqPage: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const faqs = config.faqs.filter((f) => f.enabled);
  return (
    <SectionShell anchor={section.anchor} className="wf-page">
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Resolvemos tus dudas"
        lead="Y si no encuentras la tuya, escríbenos por WhatsApp y te respondemos el mismo día."
      />
      <div className="wf-section wf-band--surface">
        <Container className="wf-narrow">
          <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
        </Container>
      </div>
      <PageCta title="¿Sigues con dudas?" subtitle="Cuéntanos tu caso y te orientamos sin compromiso." />
    </SectionShell>
  );
};

export const COMMON_PAGE_SECTIONS: Record<string, SectionComponent> = {
  'common-legal-01': LegalPage,
  'common-services-01': ServicesPage,
  'common-pricing-01': PricingPage,
  'common-gallery-01': GalleryPage,
  'common-about-01': AboutPage,
  'common-contact-01': ContactPage,
  'common-booking-01': BookingPage,
  'common-petprofile-01': PetProfilePage,
  'common-petprofile-create-01': PetProfileCreatePage,
  'common-testimonials-01': TestimonialsPage,
  'common-faq-01': FaqPage,
};
