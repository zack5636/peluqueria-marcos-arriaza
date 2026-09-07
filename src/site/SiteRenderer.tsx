import { useEffect, useMemo, useRef } from 'react';
import { SiteRuntimeProvider, useSite, resolverPreseleccion, type SiteRuntimeOptions } from './context';
import { usePrefersReducedMotion } from './hooks';
import { getVariant, SECTION_COMPONENTS } from './variants';
import { headerPatternForVariant } from './registry';
import { EleganceModals } from './templates/elegance';
import { getTheme, resolveEffectiveTheme } from './theme/themes';
import { normalizeThemeTokenOverrides, tokensToCssVars } from './theme/tokens';
import { motionDataAttributes, motionFromStyle, motionToCssVars } from './motion';
import type { PageConfig, SiteConfig } from './types';
import { Container } from './components/primitives';
import { Modal } from './components/Modal';
import { ReservaConectada } from '../manageos/ReservaConectada';

import './styles/base.css';
import './styles/cards.css';
import './styles/motion.css';
import './styles/peludos-felices.css';
import './styles/pelos-paz-amor.css';
import './styles/elegance.css';
import './styles/peludos-and-co.css';
import './styles/estudio.css';
import './styles/plagas-respuesta-rapida.css';
import './styles/plagas-corporativa.css';
import './styles/plagas-hogar.css';
import './styles/carpinteria-portfolio.css';
import './styles/carpinteria-configurador.css';
import './styles/shared-library.css';
import './styles/profiles.css';
import './styles/profiles-body.css';
import './styles/profiles-b.css';
import './styles/carpinteria-taller.css';

/**
 * Modal de reserva compartido por las cuatro templates.
 *
 * Antes solo Elegance y Pelos, Paz y Amor tenían modal, así que en las otras
 * dos «Reservar» solo podía desplazar hasta el final de la portada. Ahora
 * cualquier CTA de reserva abre el mismo flujo sin obligar a recorrer la
 * página, y `/reservar` sigue existiendo como página completa.
 *
 * Es la misma `ReservaConectada` que la sección de la portada y que la página
 * completa: un único sistema de reservas, no un formulario aparte que viva solo
 * en el modal. Antes eran dos flujos distintos abriéndose el uno encima del
 * otro —el modal con el formulario antiguo, y detrás la agenda real— y quien
 * reservaba rellenaba primero el que no llegaba a ningún sitio.
 */
function BookingModal() {
  const { openModal, setOpenModal, config, bookingSelection } = useSite();
  const preseleccion = resolverPreseleccion(config, bookingSelection);
  return (
    <Modal
      open={openModal === 'booking'}
      onClose={() => setOpenModal(null)}
      title="Reservar cita"
      size="md"
    >
      <ReservaConectada
        whatsapp={config.business.whatsapp}
        servicioInicial={preseleccion.servicioId}
        paqueteInicial={preseleccion.paquete}
      />
    </Modal>
  );
}

/** Modales globales que cada template añade fuera del flujo de secciones. */
const TEMPLATE_OVERLAYS: Record<string, () => React.ReactElement | null> = {
  'canine-elegance': EleganceModals,
};

export function resolvePage(config: SiteConfig, route: string): PageConfig | undefined {
  const normalized = route.split('?')[0].replace(/\/$/, '') || '/';
  const matchesPattern = (pattern: string) => {
    const expression = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace('\\{slug\\}', '[^/]+');
    return new RegExp(`^${expression}$`).test(normalized);
  };

  const exact = config.pages.find((page) => page.route === normalized);
  if (exact) return exact;

  const declaredPattern = config.pages.find((page) => page.route.includes('{slug}') && matchesPattern(page.route));
  if (declaredPattern) return declaredPattern;

  // Compatibilidad con proyectos anteriores: sus esquemas ya declaraban la
  // ruta dinámica aunque todavía no existiera una PageConfig parametrizada.
  const schema = (config.collectionSchemas ?? []).find(
    (candidate) => candidate.detailRoute && matchesPattern(candidate.detailRoute),
  );
  if (schema?.detailRoute) {
    const parent = schema.detailRoute.replace(/\/{slug}\/?$/, '') || '/';
    return config.pages.find((page) => page.route === parent);
  }

  // Nunca se cae silenciosamente en Inicio: SiteBody mostrará el 404 real.
  return undefined;
}

function SiteBody({ route }: { route: string }) {
  const { config } = useSite();
  const page = resolvePage(config, route);
  const Overlay = TEMPLATE_OVERLAYS[config.meta.templateId];

  if (!page) {
    return (
      <Container className="wf-page-doc">
        <h1>Página no encontrada</h1>
        <p>La ruta solicitada no existe en la estructura de este proyecto.</p>
      </Container>
    );
  }

  const sections = [...page.sections].filter((s) => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section.variantId];
        const variant = getVariant(section.variantId);
        if (!Component) {
          return (
            <div key={section.id} className="wf-variante-ausente" role="alert">
              La variante <code>{section.variantId}</code> no está implementada en este runtime.
            </div>
          );
        }
        const documentFlow = variant?.layoutContract?.containment === 'document';
        return (
          <div
            key={`${section.id}:${section.variantId}`}
            className={`wf-variant-slot${documentFlow ? ' wf-variant-slot--document' : ''}`}
            data-wf-variant={section.variantId}
            data-wf-section-type={section.type}
            data-wf-source-template={variant?.sourceTemplateId ?? 'unknown'}
            data-wf-destination-template={config.meta.templateId}
            data-wf-overflow={variant?.layoutContract?.overflow ?? 'clip'}
            data-wf-surface={variant?.surfaceContext ?? 'light'}
            data-wf-header-pattern={variant ? (headerPatternForVariant(variant) ?? undefined) : undefined}
          >
            <Component section={section} />
          </div>
        );
      })}
      <BookingModal />
      {Overlay ? <Overlay /> : null}
    </>
  );
}

function Announcer() {
  const { announcement, previewMode } = useSite();
  return (
    <>
      <p className="wf-sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      {previewMode ? (
        <span className="wf-preview-note" id="wf-preview-note">
          Modo preview · los envíos no salen del dispositivo
        </span>
      ) : null}
    </>
  );
}

export interface SiteRendererProps {
  config: SiteConfig;
  options: SiteRuntimeOptions;
  className?: string;
}

/**
 * Punto de entrada del runtime de sitios. Resuelve el tema efectivo (template →
 * tema global → override de página → ajustes de token) y monta las secciones de
 * la página activa.
 */
export function SiteRenderer({ config, options, className }: SiteRendererProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const page = resolvePage(config, options.route);

  const theme = useMemo(
    () => resolveEffectiveTheme(config.meta.themeId, page?.themeOverrideId ?? null, config.meta.templateId),
    [config.meta.themeId, config.meta.templateId, page?.themeOverrideId],
  );

  /**
   * La configuración de animaciones vive en el proyecto, no en el tema: cambiar
   * de tema no puede borrarla. Un proyecto anterior al sistema arranca con el
   * estilo suave hasta que `normalizeSiteConfig` lo persista.
   */
  const motion = useMemo(() => config.motion ?? motionFromStyle('suave'), [config.motion]);
  const reducedMotion = usePrefersReducedMotion();

  const style = useMemo(
    () => ({
      ...tokensToCssVars(theme.tokens, normalizeThemeTokenOverrides(config.tokenOverrides)),
      ...motionToCssVars(motion, reducedMotion),
    }),
    [theme, config.tokenOverrides, motion, reducedMotion],
  );

  const motionAttrs = useMemo(
    () => motionDataAttributes(motion, reducedMotion),
    [motion, reducedMotion],
  );

  /**
   * Aparición de los elementos marcados con `data-wf-entry`.
   *
   * El observador solo añade una clase; el movimiento lo describe `motion.css`.
   * Con movimiento reducido no se observa nada y todo queda visible de entrada,
   * de modo que el contenido nunca depende de que la animación se ejecute.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-wf-entry]'));
    if (targets.length === 0) return;

    const off =
      reducedMotion || motion.style === 'ninguna' || typeof IntersectionObserver === 'undefined';

    if (off) {
      targets.forEach((node) => node.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            node.classList.add('is-in');
            if (motion.scrollBehavior === 'once') observer.unobserve(node);
          } else if (motion.scrollBehavior === 'every-time') {
            node.classList.remove('is-in');
          }
        }
      },
      { threshold: Math.max(0, Math.min(1, motion.threshold)) },
    );

    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [config, motion, options.previewMode, options.route, reducedMotion]);

  /**
   * Valores efectivos de los tokens que se publican como atributos `data-*`.
   * `tokensToCssVars` ya combina tema y ajustes del proyecto para las variables
   * CSS; estos atributos deben seguir exactamente la misma cascada.
   */
  const effective = useMemo(() => {
    const overrides = (config.tokenOverrides ?? {}) as Partial<Record<string, string>>;
    const pick = <K extends keyof typeof theme.tokens>(key: K) =>
      (overrides[key as string] ?? theme.tokens[key]) as (typeof theme.tokens)[K];
    return {
      decorPattern: pick('decorPattern'),
      iconStyle: pick('iconStyle'),
      cardStyle: pick('cardStyle'),
      motionPreset: pick('motionPreset'),
      animationStyle: pick('animationStyle'),
    };
  }, [theme, config.tokenOverrides]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('.wf-variant-slot:not(.wf-variant-slot--document)'),
    );
    const reduced =
      options.previewMode ||
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined';
    if (reduced) {
      sections.forEach((section) => section.setAttribute('data-wf-reveal', 'visible'));
      return;
    }
    sections.forEach((section) => section.setAttribute('data-wf-reveal', 'pending'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).setAttribute('data-wf-reveal', 'visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [config, options.previewMode, options.route]);

  return (
    <SiteRuntimeProvider config={config} options={options}>
      <div
        ref={rootRef}
        className={`wf-site${className ? ` ${className}` : ''}`}
        style={style as React.CSSProperties}
        data-template={config.meta.templateId}
        data-theme={theme.id}
        data-decor={effective.decorPattern}
        data-icon-style={effective.iconStyle}
        data-card-style={effective.cardStyle}
        data-motion={effective.motionPreset}
        data-anim={effective.animationStyle}
        data-preview={options.previewMode ? 'true' : 'false'}
        {...motionAttrs}
        lang="es"
      >
        <SiteBody route={options.route} />
        <Announcer />
      </div>
    </SiteRuntimeProvider>
  );
}

export { getTheme, resolveEffectiveTheme };
