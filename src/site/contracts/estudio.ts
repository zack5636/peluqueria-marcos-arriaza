/**
 * Contratos de la template «Estudio».
 *
 * Declaran lo mismo que el resto del nicho —campos, límites de colección,
 * recursos y salidas de navegación— para que el Creador Web pueda validar,
 * intercambiar y editar estas secciones igual que las de las otras cuatro
 * familias caninas. Lo que cambia es el lenguaje visual, no el contrato.
 */

import { inferSurfaceContext, type SectionVariant } from '../registry';

const NICHE = 'peluqueria-canina';
const TEMPLATE = 'canine-estudio';

function variant(
  spec: Omit<SectionVariant, 'nicheId' | 'schemaVersion' | 'sourceTemplateId' | 'surfaceContext'> & {
    surfaceContext?: SectionVariant['surfaceContext'];
  },
): SectionVariant {
  return {
    nicheId: NICHE,
    sourceTemplateId: TEMPLATE,
    schemaVersion: '1.0.0',
    layoutContract: {
      containment: spec.sectionType === 'header' ? 'document' : 'section',
      overflow: spec.sectionType === 'header' ? 'visible' : 'clip',
    },
    surfaceContext: spec.surfaceContext ?? inferSurfaceContext(spec as SectionVariant),
    ...spec,
  } as SectionVariant;
}

const NAV_LIMIT = { collection: 'navigation.items', min: 3, max: 8 };

export const ESTUDIO_VARIANTS: SectionVariant[] = [
  variant({
    id: 'es-header-01',
    sectionType: 'header',
    name: 'Cabecera de filete con navegación numerada',
    description:
      'Marca en versalitas, navegación con numeración editorial y acción como enlace subrayado. Sin botón sólido.',
    requiredFields: ['business.name', 'navigation.items', 'navigation.primaryCta'],
    optionalFields: ['business.descriptor'],
    collectionLimits: [NAV_LIMIT],
    themeTokenCoverage: ['surface', 'border', 'borderStrong', 'text', 'brandPrimary'],
    surfaceContext: 'light',
    responsiveContract: { desktop: 'marca · nav numerada · enlace', tablet: 'marca · enlace', mobile: 'drawer' },
    navigationOutputs: ['#inicio'],
    requiredCompanions: ['footer'],
    conflicts: [],
    assetSlots: [],
    required: true,
    fixed: true,
  }),

  variant({
    id: 'es-hero-01',
    sectionType: 'hero',
    name: 'Hero tipográfico con corte fotográfico',
    description:
      'Titular a gran tamaño ocupando la composición y, debajo, la fotografía recortada en banda ancha a sangre.',
    requiredFields: ['content.hero.title', 'content.hero.paragraph', 'content.hero.primaryCta'],
    optionalFields: ['business.tagline', 'content.hero.image', 'content.hero.secondaryCta'],
    collectionLimits: [{ collection: 'content.hero.microBenefits', min: 0, max: 4 }],
    themeTokenCoverage: ['surface', 'border', 'text', 'textMuted', 'brandPrimary', 'fontDisplay'],
    surfaceContext: 'light',
    responsiveContract: { desktop: 'titular + banda + datos', tablet: 'titular + banda', mobile: 'apilado' },
    navigationOutputs: ['#inicio'],
    requiredCompanions: ['header'],
    conflicts: [],
    assetSlots: [{ key: 'hero', ratio: '24:8', minWidth: 1600, minHeight: 600, required: false }],
    required: true,
    fixed: false,
  }),

  variant({
    id: 'es-services-01',
    sectionType: 'services',
    name: 'Servicios como índice editorial',
    description:
      'Tabla de filas con número, nombre, resumen, duración y precio alineado; la miniatura del servicio se asoma al recorrer la fila.',
    requiredFields: ['services', 'navigation.primaryCta'],
    optionalFields: ['content.headings.services'],
    collectionLimits: [{ collection: 'services', min: 2, max: 8 }],
    themeTokenCoverage: ['surface', 'border', 'borderStrong', 'text', 'brandPrimary', 'fontDisplay'],
    surfaceContext: 'light',
    responsiveContract: {
      desktop: 'nº · nombre · duración · precio',
      tablet: 'nº · nombre · precio',
      mobile: 'nº · nombre · precio',
    },
    navigationOutputs: ['#servicios'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [{ key: 'service', ratio: '4:3', minWidth: 600, minHeight: 450, required: false }],
    required: false,
    fixed: false,
  }),

  variant({
    id: 'es-results-01',
    sectionType: 'transformations',
    name: 'Antes y después a página completa con índice',
    description:
      'Una sola comparación arrastrable, grande y sin marco, con un índice lateral para cambiar de caso.',
    requiredFields: ['transformations'],
    optionalFields: ['content.headings.transformations'],
    collectionLimits: [{ collection: 'transformations', min: 1, max: 12 }],
    themeTokenCoverage: ['surfaceInverse', 'textOnDark', 'textMutedOnDark', 'accent', 'fontDisplay'],
    surfaceContext: 'dark',
    responsiveContract: { desktop: 'comparación + índice', tablet: 'comparación + índice', mobile: 'apilado' },
    navigationOutputs: ['#transformaciones'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [{ key: 'transformation', ratio: '1:1', minWidth: 800, minHeight: 800, required: true }],
    required: false,
    fixed: false,
  }),

  variant({
    id: 'es-gallery-01',
    sectionType: 'gallery',
    name: 'Archivo en hoja de contactos',
    description: 'Retícula estricta con número de registro por pieza y desaturación leve que se recupera al pasar.',
    requiredFields: ['gallery'],
    optionalFields: ['content.headings.gallery'],
    collectionLimits: [{ collection: 'gallery', min: 3, max: 30 }],
    themeTokenCoverage: ['surfaceAlt', 'border', 'textMuted', 'brandPrimary'],
    surfaceContext: 'alternative',
    responsiveContract: { desktop: '4 columnas', tablet: '3 columnas', mobile: '2 columnas' },
    navigationOutputs: ['#galeria'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [{ key: 'gallery', ratio: '4:3', minWidth: 600, minHeight: 450, required: true }],
    required: false,
    fixed: false,
  }),

  variant({
    id: 'es-testimonials-01',
    sectionType: 'testimonials',
    name: 'Opiniones como citas editoriales',
    description:
      'Una cita a tamaño de titular y el resto en columnas de filete. Sin estrellas ni avatar; la media queda como dato al pie.',
    requiredFields: ['testimonials'],
    optionalFields: ['content.headings.testimonials'],
    collectionLimits: [{ collection: 'testimonials', min: 1, max: 12 }],
    themeTokenCoverage: ['surface', 'border', 'text', 'textMuted', 'brandPrimary', 'fontDisplay'],
    surfaceContext: 'light',
    responsiveContract: { desktop: 'cita + 3 columnas', tablet: 'cita + 2', mobile: 'apilado' },
    navigationOutputs: ['#opiniones'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [],
    required: false,
    fixed: false,
  }),

  variant({
    id: 'es-booking-01',
    sectionType: 'booking',
    name: 'Reserva como formulario de papel',
    description:
      'Datos del estudio en filetes a un lado y el formulario real con campos de línea inferior al otro. Sin tarjeta elevada.',
    requiredFields: ['booking', 'business.phone'],
    optionalFields: ['business.email', 'business.address', 'business.openingHours', 'content.headings.booking'],
    collectionLimits: [],
    themeTokenCoverage: ['surfaceAlt', 'border', 'borderStrong', 'text', 'brandPrimary'],
    surfaceContext: 'alternative',
    responsiveContract: { desktop: '5/7', tablet: 'apilado', mobile: 'apilado' },
    navigationOutputs: ['#reserva'],
    requiredCompanions: [],
    conflicts: [],
    assetSlots: [],
    required: false,
    fixed: false,
  }),

  variant({
    id: 'es-footer-01',
    sectionType: 'footer',
    name: 'Pie con marca a tamaño de cartel',
    description: 'Cuatro columnas en filete y la marca del salón a sangre como último gesto tipográfico.',
    requiredFields: ['business.legalName', 'content.legal', 'navigation.items'],
    optionalFields: ['business.address'],
    collectionLimits: [NAV_LIMIT],
    themeTokenCoverage: ['surface', 'border', 'borderStrong', 'text', 'textMuted', 'brandPrimary'],
    surfaceContext: 'light',
    responsiveContract: { desktop: '4 columnas + marca', tablet: '2 columnas', mobile: '1 columna' },
    navigationOutputs: ['/aviso-legal', '/privacidad', '/cookies'],
    requiredCompanions: ['header'],
    conflicts: [],
    assetSlots: [],
    required: true,
    fixed: true,
  }),
];
