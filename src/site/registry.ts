import type { ComponentType } from 'react';
import type { SectionInstance, SectionType } from './types';

export interface SectionComponentProps {
  section: SectionInstance;
}

export type SectionComponent = ComponentType<SectionComponentProps>;

/** Contexto visual que una sección publica al renderer. */
export type SurfaceContext = 'light' | 'dark' | 'alternative' | 'brand' | 'image' | 'card';
export type HeaderPattern = 'editorial' | 'corporate' | 'conversion';

const HEADER_PATTERNS: Record<string, HeaderPattern> = {
  'pf-header-01': 'conversion',
  'ppa-header-01': 'editorial',
  'el-header-01': 'corporate',
  'pco-header-01': 'conversion',
  'pr-header-01': 'conversion',
  'co-header-01': 'corporate',
  'hg-header-01': 'conversion',
  'cp-header-01': 'editorial',
  'cc-header-01': 'corporate',
  'ct-header-01': 'editorial',
};

export function headerPatternForVariant(variant: Pick<SectionVariant, 'id' | 'sectionType'>): HeaderPattern | null {
  if (variant.sectionType !== 'header') return null;
  return HEADER_PATTERNS[variant.id] ?? 'corporate';
}

/**
 * Fallback central para contratos previos. Los contratos nuevos pueden
 * declarar `surfaceContext` explícitamente; los existentes se normalizan por
 * sus capacidades, nunca por una regla CSS específica de la template.
 */
export function inferSurfaceContext(
  variant: Pick<SectionVariant, 'sectionType' | 'themeTokenCoverage' | 'assetSlots'>,
): SurfaceContext {
  if (variant.themeTokenCoverage.includes('textInverse') || variant.themeTokenCoverage.includes('surfaceInverse')) {
    return 'dark';
  }
  if (variant.sectionType === 'finalCta') return 'brand';
  if (variant.sectionType === 'hero' && variant.assetSlots.some((slot) => slot.key === 'hero')) return 'image';
  if (variant.themeTokenCoverage.includes('surfaceAlt')) return 'alternative';
  return 'light';
}

/**
 * Contrato de una variante de sección. Es lo que valida el Creador Web antes de
 * permitir combinar bloques de distintas templates del mismo nicho.
 */
/**
 * Política de la biblioteca: **genérica por defecto**.
 *
 * Una variante está abierta a cualquier nicho salvo que aquí se declare lo
 * contrario. La inversión importa al escalar: añadir el nicho número veinte no
 * puede obligar a editar decenas de componentes para meter su identificador en
 * una lista blanca. Lo que se declara es la excepción, no la norma.
 *
 * Qué cuenta como excepción, con dos criterios y ambos comprobables:
 *
 *  1. **Vocabulario en el texto visible.** Se obtuvo recorriendo el cuerpo de
 *     cada sección buscando términos propios del sector —plaga, roedor,
 *     desinsectación; perro, manto, mascota; madera, acabado, encimera—. Una
 *     sección que los escribe no puede servir a otro sector sin mentir.
 *  2. **Semántica de los datos.** Aunque el texto sea neutro, algunas secciones
 *     modelan un concepto del sector: un antes/después con nombre y raza, o un
 *     calendario de estacionalidad de plagas.
 *
 * Todo lo demás queda abierto: que un Header, un Hero, unos Servicios o un
 * Footer naciesen dentro de una template de plagas no los hace de plagas.
 */
export interface SectorLock {
  /** Nichos en los que sigue siendo utilizable. */
  niches: readonly string[];
  /** Por qué. Se muestra en el editor y queda auditable. */
  reason: string;
}

const VOCABULARY_LOCKS: Record<string, string> = {
  'cc-faq-01': 'carpinter',
  'cc-page-legal-01': 'acabado, carpinter',
  'co-page-legal-01': 'plaga',
  'co-page-plagas-01': 'plaga',
  'co-page-soluciones-01': 'plaga',
  'cp-faq-01': 'carpinter',
  'cp-footer-01': 'acabado',
  'cp-materiales-01': 'acabado',
  'cp-page-legal-01': 'acabado, carpinter, mueble',
  'cp-servicios-01': 'carpinter',
  'cp-taller-01': 'acabado',
  'cp-testimonios-01': 'carpinter',
  'ct-page-categorias-01': 'carpinter',
  'ct-servicios-01': 'carpinter, cocina',
  'el-plans-01': 'mascota',
  'el-services-01': 'mascota',
  'hg-hero-01': 'plaga',
  'hg-page-legal-01': 'plaga',
  'hg-page-problemas-01': 'plaga',
  'hg-proceso-01': 'plaga',
  'pf-header-01': 'perro',
  'pf-services-01': 'manto',
  'ppa-header-01': 'perro',
  'pr-footer-01': 'plaga',
  'pr-header-01': 'plaga',
  'pr-page-contacto-01': 'plaga',
  'pr-page-legal-01': 'plaga',
  'pr-page-plagas-01': 'plaga',
  'pr-page-trabajos-01': 'plaga',
  'pr-plagas-01': 'plaga',
  'pr-trabajos-01': 'plaga',
  'pr-trust-01': 'plaga',
};

/** Bloqueos por semántica de los datos, no por el texto. */
const DATA_LOCKS: Record<string, SectorLock> = {
  'ppa-transformations-01': { niches: ['peluqueria-canina'], reason: 'Modela un antes/después con nombre y raza del animal.' },
  'pco-testimonials-01': { niches: ['peluqueria-canina'], reason: 'Va emparejada con los comparadores de transformación canina.' },
  'pf-testimonials-01': { niches: ['peluqueria-canina'], reason: 'Depende de la galería de resultados del salón.' },
  'hg-senales-01': { niches: ['control-de-plagas'], reason: 'Reconocer señales de plaga es la experiencia del sector.' },
  'hg-estaciones-01': { niches: ['control-de-plagas'], reason: 'Calendario de estacionalidad de plagas.' },
  'cp-proyectos-01': { niches: ['carpinteria'], reason: 'Ficha de proyecto con necesidad, solución y resultado.' },
  'cc-tipos-01': { niches: ['carpinteria'], reason: 'Configurador de tipo de mueble.' },
  'cc-inspiracion-01': { niches: ['carpinteria'], reason: 'Selector de estilo y material del brief.' },
};

/** Nicho de origen de cada prefijo de variante. */
const PREFIX_NICHE: Record<string, string> = {
  pf: 'peluqueria-canina', ppa: 'peluqueria-canina', el: 'peluqueria-canina', pco: 'peluqueria-canina',
  pr: 'control-de-plagas', co: 'control-de-plagas', hg: 'control-de-plagas',
  cp: 'carpinteria', cc: 'carpinteria', ct: 'carpinteria',
};

/** Todas las restricciones, en un único mapa trazable. */
export const SECTOR_LOCKS: Record<string, SectorLock> = {
  ...Object.fromEntries(
    Object.entries(VOCABULARY_LOCKS).map(([id, terms]) => [
      id,
      {
        niches: [PREFIX_NICHE[id.split('-')[0]!] ?? 'desconocido'],
        reason: `Su texto visible contiene vocabulario del sector (${terms}).`,
      } satisfies SectorLock,
    ]),
  ),
  ...DATA_LOCKS,
};

/**
 * Colecciones que existen en cualquier proyecto: no atan a ningún sector.
 * El resto de nombres físicos pertenecen al vocabulario de una template.
 */
const UNIVERSAL_COLLECTIONS = new Set([
  'services', 'packages', 'plans', 'team', 'gallery', 'transformations',
  'testimonials', 'faqs', 'navigation.items',
  'content.benefits', 'content.processSteps', 'content.hero.microBenefits',
]);

/**
 * Acoplamiento **derivado**: una variante que todavía pide una colección por su
 * nombre físico —`fases-proceso`, `acabados`— sigue atada a la template que la
 * declara, aunque su texto sea neutro. No hace falta listarla: se deduce de su
 * propio contrato, así que decoupling y apertura ocurren a la vez.
 */
export function physicalCollectionCoupling(
  variant: Pick<SectionVariant, 'requiredFields' | 'collectionLimits'>,
): string | null {
  for (const field of variant.requiredFields) {
    if (field.startsWith('collections.') && !field.startsWith('collections.@')) {
      return field.slice('collections.'.length);
    }
  }
  for (const limit of variant.collectionLimits) {
    if (!limit.collection.startsWith('@') && !UNIVERSAL_COLLECTIONS.has(limit.collection)) {
      return limit.collection;
    }
  }
  return null;
}

/**
 * Nichos en los que una variante puede usarse.
 *
 * Genérica por defecto. Solo se restringe si alguien lo declaró explícitamente
 * —vocabulario o semántica— o si su propio contrato revela que aún depende de
 * una colección con nombre de sector.
 */
export function variantNiches(
  variant: Pick<SectionVariant, 'id' | 'nicheId' | 'sourceTemplateId' | 'requiredFields' | 'collectionLimits'>,
): string[] | 'any' {
  const lock = SECTOR_LOCKS[variant.id];
  if (lock) return [...lock.niches];
  return physicalCollectionCoupling(variant) ? [variant.nicheId] : 'any';
}

/** Por qué una variante está restringida, si lo está. */
export function lockReason(
  variant: Pick<SectionVariant, 'id' | 'nicheId' | 'sourceTemplateId' | 'requiredFields' | 'collectionLimits'>,
): string | null {
  const lock = SECTOR_LOCKS[variant.id];
  if (lock) return lock.reason;
  const coupled = physicalCollectionCoupling(variant);
  return coupled ? `Todavía pide la colección «${coupled}» por su nombre físico.` : null;
}

export interface SectionVariant {
  id: string;
  sectionType: SectionType;
  nicheId: string;
  sourceTemplateId: string;
  name: string;
  description: string;
  schemaVersion: string;
  /** Claves de `SiteConfig` que la variante necesita para renderizar. */
  requiredFields: string[];
  optionalFields: string[];
  collectionLimits: { collection: string; min: number; max: number }[];
  /**
   * Campos que debe aportar cada elemento de una colección. El contrato se
   * valida antes de mostrar una variante como utilizable; compartir únicamente
   * `sectionType` nunca es suficiente.
   */
  collectionItemFields?: Record<string, string[]>;
  themeTokenCoverage: string[];
  /** Superficie exterior: determina la herencia cromática contextual. */
  surfaceContext: SurfaceContext;
  responsiveContract: { desktop: string; tablet: string; mobile: string };
  /** Anclas/rutas que la sección publica para la navegación. */
  navigationOutputs: string[];
  /** Secciones o capacidades necesarias para que esta variante funcione. */
  requiredCompanions: SectionType[];
  /** Tipos de sección con los que no puede convivir en la misma página. */
  conflicts: SectionType[];
  assetSlots: {
    key: string;
    ratio: string;
    minWidth: number;
    minHeight: number;
    /** Un slot opcional conserva el fallback textual de la variante. */
    required?: boolean;
  }[];
  /**
   * La geometría exterior siempre pertenece al renderer de destino. Las
   * variantes solo pueden controlar su composición interior.
   */
  layoutContract?: {
    containment: 'document' | 'section';
    overflow: 'visible' | 'clip';
  };
  /** `true` cuando la sección no puede desactivarse. */
  required: boolean;
  /** `true` cuando la sección no puede moverse de posición. */
  fixed: boolean;
}
