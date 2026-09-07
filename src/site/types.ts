/**
 * Contratos de datos del runtime de sitios.
 *
 * Este módulo lo comparten el Admin Panel (preview) y los proyectos exportados,
 * por lo que no puede importar nada de `src/admin`, `src/data` ni de Tauri.
 */

import type { CollectionBindings, RouteBindings } from './bindings';
import type { CollectionSchema, CollectionSet } from './collections';
import type { FormSchema } from './forms';
import type { MotionConfig } from './motion';

export type SectionType =
  | 'header'
  | 'hero'
  | 'services'
  | 'packages'
  | 'plans'
  | 'benefits'
  | 'process'
  | 'gallery'
  | 'transformations'
  | 'testimonials'
  | 'team'
  | 'faq'
  | 'contact'
  | 'booking'
  | 'petProfile'
  | 'ambience'
  | 'finalCta'
  | 'footer';

/** Los catorce tipos que la biblioteca del Creador Web ofrece explícitamente. */
export const CREATOR_SECTION_TYPES: readonly SectionType[] = [
  'header',
  'hero',
  'services',
  'packages',
  'process',
  'gallery',
  'transformations',
  'testimonials',
  'team',
  'faq',
  'contact',
  'booking',
  'finalCta',
  'footer',
] as const;

export const SECTION_TYPE_LABEL: Record<SectionType, string> = {
  header: 'Header',
  hero: 'Hero',
  services: 'Servicios',
  packages: 'Paquetes',
  plans: 'Planes',
  benefits: 'Ventajas',
  process: 'Proceso',
  gallery: 'Galería',
  transformations: 'Antes y después',
  testimonials: 'Testimonios',
  team: 'Equipo',
  faq: 'FAQ',
  contact: 'Contacto',
  booking: 'Reservas',
  petProfile: 'Perfil de mascota',
  ambience: 'Ambiente',
  finalCta: 'CTA final',
  footer: 'Footer',
};

export type CtaKind =
  | 'anchor'
  | 'route'
  | 'tel'
  | 'mailto'
  | 'whatsapp'
  | 'modal'
  | 'external';

export interface Cta {
  label: string;
  kind: CtaKind;
  /** Ancla (`#reserva`), ruta (`/servicios`), número, correo o URL según `kind`. */
  target: string;
  /** Mensaje prellenado para `whatsapp`. */
  message?: string;
}

export interface ImageAsset {
  /** Ruta relativa a la raíz pública del sitio. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Variantes locales optimizadas; la original sigue siendo el fallback. */
  sources?: { src: string; width: number }[];
  /** Punto focal 0–100 por dispositivo, usado con `object-position`. */
  focal: { desktop: [number, number]; tablet: [number, number]; mobile: [number, number] };
  /** Proporción recomendada del slot, p. ej. `4:5`. */
  ratio: string;
  /** Origen del asset: `demo` proviene de la template; `client` lo subió el usuario. */
  origin: 'demo' | 'client';
  credit?: { author: string; source: string; license: string; url: string };
}

export interface BusinessHours {
  label: string;
  value: string;
}

export interface SocialLink {
  network: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'google';
  url: string;
  label: string;
}

export interface BusinessInfo {
  name: string;
  legalName: string;
  tagline: string;
  descriptor: string;
  logo: {
    text: string;
    image: ImageAsset | null;
    /** Variante para superficies oscuras; opcional. */
    imageDark?: ImageAsset | null;
    /** Icono cuadrado para la pestaña del navegador; opcional. */
    favicon?: ImageAsset | null;
    showLogo: boolean;
    showName: boolean;
  };
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    line1: string;
    postalCode: string;
    city: string;
    region: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  openingHours: BusinessHours[];
  serviceArea: string;
}

export interface ServiceItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  /** Precio "desde" en euros. `null` oculta el precio en la tarjeta. */
  priceFromEur: number | null;
  durationMinutes: number;
  includes: string[];
  sizes: string[];
  icon: string;
  /** Imagen propia que sustituye al símbolo, cuando el usuario la sube. */
  iconImage?: ImageAsset | null;
  accent: string;
  image: ImageAsset | null;
}

export interface PackageItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  name: string;
  priceEur: number;
  priceNote: string;
  includes: string[];
  highlighted: boolean;
  highlightLabel: string;
  accent: string;
  image: ImageAsset | null;
}

export interface PlanItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  name: string;
  monthlyPriceEur: number;
  includes: string[];
  conditions: string[];
  highlighted: boolean;
  highlightLabel: string;
}

export interface BenefitItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  title: string;
  description: string;
  icon: string;
  iconImage?: ImageAsset | null;
  accent: string;
}

export interface ProcessStep {
  id: string;
  enabled: boolean;
  sortOrder: number;
  title: string;
  description: string;
  icon: string;
  iconImage?: ImageAsset | null;
}

export interface TeamMember {
  id: string;
  enabled: boolean;
  sortOrder: number;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  availability: string;
  photo: ImageAsset | null;
}

export interface Testimonial {
  id: string;
  enabled: boolean;
  sortOrder: number;
  author: string;
  petName: string;
  rating: number;
  text: string;
  avatar: ImageAsset | null;
}

export interface GalleryItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  caption: string;
  serviceName: string;
  image: ImageAsset | null;
}

export interface TransformationItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  petName: string;
  breed: string;
  serviceName: string;
  before: ImageAsset | null;
  after: ImageAsset | null;
}

export interface FaqItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  question: string;
  answer: string;
  category: string;
}

export type BookingMode = 'pending-request' | 'direct-confirmed' | 'whatsapp-assisted';

export type BookingFieldName =
  | 'ownerName'
  | 'phone'
  | 'email'
  | 'petName'
  | 'breed'
  | 'size'
  | 'age'
  | 'service'
  | 'professional'
  | 'date'
  | 'time'
  | 'notes'
  | 'allergies'
  | 'consent';

export interface BookingFieldConfig {
  name: BookingFieldName;
  label: string;
  /** `1` aparece en el formulario visible; `2` en el paso de detalle. */
  step: 1 | 2;
  required: boolean;
  enabled: boolean;
}

export interface BookingConfig {
  mode: BookingMode;
  /** Cuando `direct-confirmed` no tiene agenda conectada, se degrada y se avisa. */
  scheduleConnected: boolean;
  fields: BookingFieldConfig[];
  professionalsSelectable: boolean;
  timeSlots: string[];
  sizes: string[];
  confirmationTitle: string;
  confirmationMessage: string;
  privacyText: string;
  whatsappTemplate: string;
}

export interface LegalTexts {
  legalNotice: { title: string; body: string };
  privacy: { title: string; body: string };
  cookies: { title: string; body: string };
  copyrightNote: string;
}

export interface SectionHeading {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  paragraph: string;
  note: string;
  primaryCta: Cta;
  secondaryCta: Cta | null;
  microBenefits: { id: string; label: string; description: string; icon: string }[];
  ratingBadge: { enabled: boolean; score: string; countLabel: string; sourceLabel: string; url: string };
  image: ImageAsset | null;
  videoCta: { enabled: boolean; label: string; posterSrc: string; videoSrc: string; transcript: string };
}

export interface NavItem {
  id: string;
  label: string;
  cta: Cta;
  enabled: boolean;
  sortOrder: number;
}

export interface PetProfileContent {
  heading: SectionHeading;
  bullets: string[];
  cta: Cta;
  mockup: {
    petName: string;
    breed: string;
    age: string;
    customerSince: string;
    nextAppointment: { service: string; date: string; time: string };
    history: { service: string; date: string }[];
  };
}

export interface NewsletterConfig {
  enabled: boolean;
  title: string;
  description: string;
  buttonLabel: string;
  consentText: string;
  successMessage: string;
}

export interface SiteContent {
  hero: HeroContent;
  headings: Partial<Record<SectionType | 'ambience' | 'benefits', SectionHeading>>;
  benefits: BenefitItem[];
  processSteps: ProcessStep[];
  petProfile: PetProfileContent;
  newsletter: NewsletterConfig;
  ambienceImage: ImageAsset | null;
  finalCta: {
    title: string;
    subtitle: string;
    cta: Cta;
    image: ImageAsset | null;
  };
  pricingNote: string;
  packagesSideBenefits: string[];
  legal: LegalTexts;
  footerTagline: string;
  footerSignature: string;
}

export interface SectionInstance {
  id: string;
  type: SectionType;
  /** Identificador de la variante implementada, p. ej. `pf-hero-01`. */
  variantId: string;
  enabled: boolean;
  /** Las secciones obligatorias no se pueden desactivar ni eliminar. */
  required: boolean;
  /** Las secciones fijas (header/footer) no se pueden reordenar. */
  fixed: boolean;
  anchor: string;
  sortOrder: number;
}

export interface PageConfig {
  id: string;
  name: string;
  route: string;
  sortOrder: number;
  /** Cuando existe, esta página deja de heredar el tema global del proyecto. */
  themeOverrideId: string | null;
  sections: SectionInstance[];
}

export interface SiteMeta {
  projectId: string;
  projectName: string;
  templateId: string;
  templateVersion: string;
  /**
   * Nicho del proyecto. Antes se deducía del template de origen, lo que dejó de
   * ser correcto en cuanto una variante puede servir a varios sectores: el
   * nicho es del proyecto, no de la plantilla de una de sus secciones.
   */
  nicheId?: string;
  themeId: string;
  locale: 'es-ES';
  currency: 'EUR';
}

export interface SiteConfig {
  meta: SiteMeta;
  business: BusinessInfo;
  navigation: { items: NavItem[]; primaryCta: Cta; secondaryCta: Cta | null };
  content: SiteContent;
  services: ServiceItem[];
  packages: PackageItem[];
  plans: PlanItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  transformations: TransformationItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  booking: BookingConfig;
  contact: { mapEmbedUrl: string; mapLinkUrl: string; socialLinks: SocialLink[] };
  pages: PageConfig[];
  /** Tokens de tema sobreescritos manualmente en el ámbito del proyecto. */
  tokenOverrides: Record<string, string>;

  /* ------------------------------------------------------------------ */
  /*  Contratos abiertos                                                 */
  /*                                                                     */
  /*  Las colecciones fijas de arriba resuelven el nicho de peluquería    */
  /*  canina. Los nichos con vocabulario propio —tipos de plaga,          */
  /*  proyectos, modalidades, bonos— lo declaran aquí, de modo que        */
  /*  ningún nombre quede escrito dentro de un componente.                */
  /*                                                                     */
  /*  Son opcionales para que los proyectos creados antes de existir      */
  /*  sigan abriéndose; `normalizeSiteConfig` los completa al cargarlos.  */
  /* ------------------------------------------------------------------ */

  /** Esquemas de las colecciones que declara la template. */
  collectionSchemas?: CollectionSchema[];
  /** Contenido de esas colecciones, indexado por clave de esquema. */
  collections?: CollectionSet;
  /**
   * Qué colección cumple cada función semántica en este proyecto.
   *
   * Es lo que permite que una sección genérica pida «el catálogo primario» sin
   * saber si aquí se llama `plagas`, `patologias` o `tipos-proyecto`. Ausente,
   * cada rol se resuelve a la colección que se llame igual, de modo que los
   * proyectos anteriores siguen funcionando sin migrarse.
   */
  bindings?: CollectionBindings;
  /** Ruta real de cada destino semántico (`@catalog` → `/patologias`). */
  routes?: RouteBindings;
  /** Formularios declarados por la template. */
  forms?: FormSchema[];
  /** Configuración de animaciones del proyecto. */
  motion?: MotionConfig;
  /** Versión del contrato de contenido con la que se guardó el proyecto. */
  schemaVersion?: number;
  /**
   * Origen versionado del proyecto (`SiteRecipe`), guardado tal cual dentro del
   * snapshot para no exigir una migración de esquema. El runtime lo ignora por
   * completo: aquí es un objeto opaco, y la capa de fábrica lo lee con tipo.
   */
  recipe?: unknown;
}

/** Recibo público mínimo: nunca expone información administrativa. */
export interface BookingRequest {
  id: string;
  reference: string;
  createdAt: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  values: Partial<Record<BookingFieldName, string>>;
}
