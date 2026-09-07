/**
 * Contratos de la biblioteca compartida.
 *
 * Estas variantes no pertenecen a ningún sector: se dirigen por rol
 * (`@catalog`) o por colección universal (`team`), así que la política de
 * genérica-por-defecto las deja abiertas sin declarar nada.
 *
 * Cada una declara además qué hace visualmente —`motion`—, que es lo que
 * permite al generador repartir gestos distintos en vez de aplicar el mismo
 * revelado a toda la página.
 */

import type { SectionVariant } from '../registry';
import { inferSurfaceContext } from '../registry';
import type { VariantMotion } from '../interactions';

type Spec = Omit<SectionVariant, 'nicheId' | 'schemaVersion' | 'surfaceContext' | 'layoutContract'> & {
  surfaceContext?: SectionVariant['surfaceContext'];
  motion: VariantMotion;
};

/** Motion declarado por variante, indexado por id. */
export const SHARED_VARIANT_MOTION: Record<string, VariantMotion> = {};

function shared(spec: Spec): SectionVariant {
  const { motion, ...variant } = spec;
  SHARED_VARIANT_MOTION[variant.id] = motion;
  return {
    ...variant,
    // Se declara el nicho de origen por compatibilidad con el contrato, pero
    // `variantNiches` la deja abierta: no hay bloqueo para ella.
    nicheId: 'compartida',
    schemaVersion: '1.0.0',
    surfaceContext: spec.surfaceContext ?? inferSurfaceContext(variant),
    layoutContract: { containment: 'section', overflow: 'clip' },
  };
}

export const SHARED_VARIANTS: SectionVariant[] = [
  /* ------------------------------- Equipo -------------------------------- */
  shared({
    id: 'sh-team-editorial-01',
    sectionType: 'team',
    sourceTemplateId: 'shared',
    name: 'Equipo editorial con retratos altos',
    description:
      'Retratos verticales numerados, biografía y especialidades. La primera figura se adelanta para marcar jerarquía.',
    requiredFields: ['team'],
    optionalFields: ['content.headings.team'],
    collectionLimits: [{ collection: 'team', min: 1, max: 8 }],
    collectionItemFields: { team: ['id', 'name', 'role'] },
    themeTokenCoverage: ['brandPrimary', 'surface', 'surfaceAlt', 'border', 'radiusImage'],
    responsiveContract: { desktop: '3–4 columnas', tablet: '2 columnas', mobile: '1 columna' },
    navigationOutputs: ['#equipo'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [{ key: 'team', ratio: '4:5', minWidth: 700, minHeight: 875, required: false }],
    required: false,
    fixed: false,
    surfaceContext: 'light',
    motion: {
      entry: 'reveal-up',
      stagger: true,
      interactions: ['scroll-reveal', 'stagger', 'image-zoom'],
      tier: 'reference',
      entryAlternatives: ['blur-in', 'fade-up'],
    },
  }),

  shared({
    id: 'sh-team-grid-01',
    sectionType: 'team',
    sourceTemplateId: 'shared',
    name: 'Equipo en rejilla hairline',
    description: 'Lista densa con avatar circular, rol y especialidades. Sin sombras ni decoración.',
    requiredFields: ['team'],
    optionalFields: ['content.headings.team'],
    collectionLimits: [{ collection: 'team', min: 1, max: 12 }],
    collectionItemFields: { team: ['id', 'name', 'role'] },
    themeTokenCoverage: ['brandPrimary', 'surface', 'surfaceAlt', 'border'],
    responsiveContract: { desktop: '3 columnas', tablet: '2 columnas', mobile: '1 columna' },
    navigationOutputs: ['#equipo'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [{ key: 'team', ratio: '1:1', minWidth: 400, minHeight: 400, required: false }],
    required: false,
    fixed: false,
    surfaceContext: 'light',
    motion: {
      entry: 'fade',
      stagger: false,
      interactions: ['scroll-reveal', 'card-hover'],
      tier: 'reference',
      entryAlternatives: ['fade-up'],
    },
  }),

  shared({
    id: 'sh-team-cards-01',
    sectionType: 'team',
    sourceTemplateId: 'shared',
    name: 'Equipo en tarjetas con acción',
    description: 'Tarjetas con retrato cuadrado, rol destacado, especialidades y llamada a la acción común.',
    requiredFields: ['team', 'navigation.primaryCta'],
    optionalFields: ['content.headings.team'],
    collectionLimits: [{ collection: 'team', min: 2, max: 8 }],
    collectionItemFields: { team: ['id', 'name', 'role'] },
    themeTokenCoverage: ['brandPrimary', 'surface', 'surfaceAlt', 'border', 'radiusCard', 'shadowCard'],
    responsiveContract: { desktop: '3–4 columnas', tablet: '2 columnas', mobile: '1 columna' },
    navigationOutputs: ['#equipo'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [{ key: 'team', ratio: '1:1', minWidth: 500, minHeight: 500, required: false }],
    required: false,
    fixed: false,
    surfaceContext: 'light',
    motion: {
      entry: 'fade-up',
      stagger: true,
      interactions: ['scroll-reveal', 'stagger', 'card-hover', 'cta-micro'],
      tier: 'reference',
      entryAlternatives: ['zoom-in', 'slide-right'],
    },
  }),

  /* ------------------------------ Catálogo ------------------------------- */
  shared({
    id: 'sh-catalog-grid-01',
    sectionType: 'services',
    sourceTemplateId: 'shared',
    name: 'Catálogo en tarjetas',
    description:
      'Rejilla del catálogo primario con imagen opcional, resumen y puntos clave. Enlaza a la ficha de cada elemento.',
    requiredFields: ['collections.@catalog'],
    optionalFields: ['content.headings.services'],
    collectionLimits: [{ collection: '@catalog', min: 1, max: 24 }],
    themeTokenCoverage: ['brandPrimary', 'surface', 'surfaceAlt', 'border', 'radiusCard'],
    responsiveContract: { desktop: '3 columnas', tablet: '2 columnas', mobile: '1 columna' },
    navigationOutputs: ['@catalog', '@catalogItem'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [],
    required: false,
    fixed: false,
    surfaceContext: 'alternative',
    motion: {
      entry: 'blur-in',
      stagger: true,
      interactions: ['scroll-reveal', 'stagger', 'card-hover'],
      tier: 'solid',
      entryAlternatives: ['fade-up', 'zoom-in'],
    },
  }),

  shared({
    id: 'sh-catalog-detail-01',
    sectionType: 'services',
    sourceTemplateId: 'shared',
    name: 'Ficha de catálogo',
    description: 'Detalle de un elemento del catálogo con imagen, descripción, puntos y elementos relacionados.',
    requiredFields: ['collections.@catalog'],
    optionalFields: [],
    collectionLimits: [{ collection: '@catalog', min: 1, max: 24 }],
    themeTokenCoverage: ['brandPrimary', 'surface', 'border', 'radiusImage'],
    responsiveContract: { desktop: '2 columnas', tablet: '1 columna', mobile: '1 columna' },
    navigationOutputs: ['@catalogItem'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [],
    required: true,
    fixed: true,
    surfaceContext: 'light',
    motion: {
      entry: 'fade-up',
      stagger: false,
      interactions: ['scroll-reveal'],
      tier: 'solid',
    },
  }),
];
