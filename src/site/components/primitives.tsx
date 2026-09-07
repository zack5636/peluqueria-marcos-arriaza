import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useSite } from '../context';
import type { Cta, ImageAsset, SectionHeading } from '../types';
import type { SurfaceContext } from '../registry';
import { Icon, isIconName, type IconName } from './Icon';

/* ------------------------------------------------------------------ *
 * Sección con ancla registrada
 * ------------------------------------------------------------------ */

export function SectionShell({
  anchor,
  className,
  style,
  children,
  as: Tag = 'section',
  label,
  surface,
}: {
  anchor: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  as?: 'section' | 'div' | 'header' | 'footer';
  label?: string;
  surface?: SurfaceContext;
}) {
  const { registerAnchor } = useSite();
  const ref = useRef<HTMLElement | null>(null);
  const id = anchor.replace(/^#/, '');

  useEffect(() => {
    registerAnchor(id, ref.current);
    return () => registerAnchor(id, null);
  }, [id, registerAnchor]);

  return (
    <Tag
      id={id}
      ref={ref as never}
      className={className}
      style={style}
      aria-label={label}
      data-wf-section={id}
      data-wf-surface={surface}
    >
      {children}
    </Tag>
  );
}

export function Container({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`wf-container${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Encabezados de sección
 * ------------------------------------------------------------------ */

export function Heading({
  heading,
  align = 'center',
  level = 2,
  className,
}: {
  heading: SectionHeading;
  align?: 'center' | 'left';
  level?: 2 | 3;
  className?: string;
}) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <div className={`wf-heading wf-heading--${align}${className ? ` ${className}` : ''}`}>
      {heading.eyebrow ? <p className="wf-eyebrow">{heading.eyebrow}</p> : null}
      <Tag className="wf-heading__title">{heading.title}</Tag>
      {heading.subtitle ? <p className="wf-heading__subtitle">{heading.subtitle}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Botones y enlaces con acción real
 * ------------------------------------------------------------------ */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'inverse' | 'link';

export function CtaButton({
  cta,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  full,
  onBeforeRun,
}: {
  cta: Cta | null | undefined;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  className?: string;
  full?: boolean;
  onBeforeRun?: () => void;
}) {
  const { runCta, previewMode } = useSite();
  // Una llamada a la acción opcional puede no existir. Con la biblioteca
  // abierta a cualquier nicho, una sección ya no puede dar por hecho que el
  // proyecto de destino declare la suya: sin CTA no se pinta el botón.
  if (!cta) return null;
  const isExternal = cta.kind === 'external' || cta.kind === 'whatsapp';
  return (
    <button
      type="button"
      className={[
        'wf-btn',
        `wf-btn--${variant}`,
        `wf-btn--${size}`,
        full ? 'wf-btn--full' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        onBeforeRun?.();
        runCta(cta);
      }}
      aria-describedby={isExternal && previewMode ? 'wf-preview-note' : undefined}
    >
      {icon ? <Icon name={icon} size={size === 'lg' ? 20 : 18} /> : null}
      <span>{cta.label}</span>
      {isExternal && !previewMode ? <span className="wf-sr-only"> (se abre en una pestaña nueva)</span> : null}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Imágenes
 * ------------------------------------------------------------------ */

export function Picture({
  image,
  className,
  device = 'desktop',
  sizes,
  loading = 'lazy',
  decorative = false,
}: {
  image: ImageAsset | null;
  className?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
  sizes?: string;
  loading?: 'lazy' | 'eager';
  decorative?: boolean;
}) {
  /*
   * Sin foto, una superficie de marca; nunca un cartel de «pendiente».
   *
   * Antes se pintaba un recuadro de líneas discontinuas con el texto «Imagen
   * pendiente». Dice la verdad sobre el estado del contenido, pero delante de un
   * cliente lo que cuenta es que la web parece a medio hacer. Un panel con el
   * color del negocio ocupa el mismo sitio, mantiene la composición y no llama
   * la atención sobre lo que falta.
   */
  if (!image) {
    return (
      <div
        className={`wf-image wf-image--blank${className ? ` ${className}` : ''}`}
        role="presentation"
        aria-hidden="true"
      />
    );
  }
  const [x, y] = image.focal[device];
  return (
    <img
      className={`wf-image${className ? ` ${className}` : ''}`}
      src={image.src}
      srcSet={image.sources?.map((source) => `${source.src} ${source.width}w`).join(', ')}
      alt={decorative ? '' : image.alt}
      width={image.width}
      height={image.height}
      loading={loading}
      fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      decoding="async"
      sizes={sizes ?? '(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw'}
      style={{ objectPosition: `${x}% ${y}%` }}
      aria-hidden={decorative || undefined}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Valoración
 * ------------------------------------------------------------------ */

export function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="wf-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={size} className={n <= rounded ? 'is-on' : 'is-off'} />
      ))}
      <span className="wf-sr-only">{rounded} de 5</span>
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Icono con contenedor según el token `iconStyle`
 * ------------------------------------------------------------------ */

export function IconBadge({
  icon,
  accent,
  size = 'md',
}: {
  icon: string;
  accent?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  // Reserva neutra: las templates de otros nichos no deben caer en un símbolo canino.
  const name: IconName = isIconName(icon) ? icon : 'sparkle';
  const px = size === 'lg' ? 30 : size === 'sm' ? 18 : 24;
  return (
    <span
      className={`wf-icon-badge wf-icon-badge--${size}`}
      style={accent ? ({ '--wf-badge-accent': accent } as CSSProperties) : undefined}
    >
      <Icon name={name} size={px} />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Decoración de fondo derivada del token `decorPattern`
 * ------------------------------------------------------------------ */

export function DecorLayer({ className }: { className?: string }) {
  return <span className={`wf-decor${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}

/** Cinta "Más popular" / "Más elegido". */
export function Ribbon({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'dark' }) {
  return <span className={`wf-ribbon wf-ribbon--${tone}`}>{label}</span>;
}
