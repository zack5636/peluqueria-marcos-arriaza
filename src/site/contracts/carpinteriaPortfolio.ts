import { inferSurfaceContext, type SectionVariant } from '../registry';

const TEMPLATE = 'carpinteria-portfolio';
const STACK = { desktop: 'multi-columna', tablet: '2 columnas', mobile: '1 columna' };

function variant(v: Omit<SectionVariant, 'nicheId' | 'sourceTemplateId' | 'schemaVersion' | 'surfaceContext'> & { surfaceContext?: SectionVariant['surfaceContext'] }): SectionVariant {
  return { nicheId: 'carpinteria', sourceTemplateId: TEMPLATE, schemaVersion: '1.0.0', layoutContract: { containment: v.sectionType === 'header' ? 'document' : 'section', overflow: v.sectionType === 'header' ? 'visible' : 'clip' }, ...v, surfaceContext: v.surfaceContext ?? inferSurfaceContext(v) } as SectionVariant;
}

const common = (id: string, sectionType: SectionVariant['sectionType'], name: string, fields: string[], outputs: string[], required = false, surfaceContext?: SectionVariant['surfaceContext']): SectionVariant => variant({
  id, sectionType, name, description: 'Composición editorial conectada a colecciones editables, con contenido completo y estados sin imagen.',
  requiredFields: fields, optionalFields: [], collectionLimits: [], themeTokenCoverage: ['brandPrimary', 'surface', 'text', 'textMuted', 'border'],
  responsiveContract: STACK, navigationOutputs: outputs, requiredCompanions: [], conflicts: [], assetSlots: [], required, fixed: required, surfaceContext,
});

export const CARPINTERIA_PORTFOLIO_VARIANTS: SectionVariant[] = [
  variant({ id: 'cp-header-01', sectionType: 'header', name: 'Cabecera editorial compacta', description: 'Marca, navegación amplia y presupuesto; se convierte en drawer sin perder rutas.', requiredFields: ['business.name', 'navigation.items'], optionalFields: ['business.logo'], collectionLimits: [{ collection: 'navigation.items', min: 6, max: 12 }], themeTokenCoverage: ['brandPrimary', 'surface', 'text', 'border'], responsiveContract: { desktop: 'marca · nav · CTA', tablet: 'marca · CTA · drawer', mobile: 'marca · drawer' }, navigationOutputs: ['/'], requiredCompanions: ['footer'], conflicts: [], assetSlots: [{ key: 'logo', ratio: 'libre', minWidth: 240, minHeight: 80, required: false }], required: true, fixed: true }),
  variant({ id: 'cp-hero-01', sectionType: 'hero', name: 'Hero editorial asimétrico', description: 'Titular de gran escala, fotografía completa y banda de garantías sin geometría frágil.', requiredFields: ['content.hero.title', 'content.hero.primaryCta'], optionalFields: ['content.hero.image'], collectionLimits: [{ collection: 'content.hero.microBenefits', min: 2, max: 4 }], themeTokenCoverage: ['heroBackground', 'brandPrimary', 'text'], responsiveContract: { desktop: 'texto · imagen + banda', tablet: 'texto → imagen → banda', mobile: 'flujo vertical' }, navigationOutputs: ['#inicio'], requiredCompanions: [], conflicts: [], assetSlots: [{ key: 'hero', ratio: '4:3', minWidth: 1800, minHeight: 1350, required: false }], required: true, fixed: false }),
  common('cp-categorias-01', 'benefits', 'Categorías visuales', ['collections.categorias-proyecto'], ['#categorias', '/categorias', '/categorias/{slug}']),
  common('cp-proyectos-01', 'gallery', 'Mosaico de proyectos', ['collections.proyectos'], ['#proyectos', '/proyectos', '/proyectos/{slug}'], false, 'dark'),
  common('cp-servicios-01', 'services', 'Servicios numerados', ['collections.servicios-carpinteria'], ['#servicios', '/servicios', '/servicios/{slug}']),
  common('cp-materiales-01', 'plans', 'Biblioteca de materia', ['collections.materiales', 'collections.acabados'], ['#materiales', '/materiales-acabados', '/materiales/{slug}']),
  common('cp-proceso-01', 'process', 'Proceso en líneas', ['collections.fases-proceso'], ['#proceso', '/proceso']),
  common('cp-taller-01', 'team', 'Relato del taller', ['business.name'], ['#taller', '/taller']),
  common('cp-testimonios-01', 'testimonials', 'Testimonios editoriales', ['collections.testimonios-carpinteria'], ['#testimonios']),
  common('cp-faq-01', 'faq', 'Preguntas editables', ['collections.preguntas-carpinteria'], ['#preguntas', '/preguntas']),
  common('cp-final-01', 'finalCta', 'Cierre de presupuesto', ['content.finalCta'], ['#presupuesto', '/solicitar-presupuesto'], false, 'brand'),
  variant({ id: 'cp-footer-01', sectionType: 'footer', name: 'Pie editorial', description: 'Marca, navegación, contacto y documentos legales.', requiredFields: ['business.legalName', 'content.legal'], optionalFields: [], collectionLimits: [], themeTokenCoverage: ['surfaceInverse', 'textInverse'], responsiveContract: STACK, navigationOutputs: ['/aviso-legal', '/privacidad', '/cookies'], requiredCompanions: ['header'], conflicts: [], assetSlots: [], required: true, fixed: true }),
  ...([
    ['cp-page-proyectos-01', 'gallery', 'Portfolio completo', '/proyectos', ['collections.proyectos']],
    ['cp-page-servicios-01', 'services', 'Servicios completos', '/servicios', ['collections.servicios-carpinteria']],
    ['cp-page-categorias-01', 'benefits', 'Categorías completas', '/categorias', ['collections.categorias-proyecto']],
    ['cp-page-materiales-01', 'plans', 'Materiales y acabados', '/materiales-acabados', ['collections.materiales']],
    ['cp-page-proceso-01', 'process', 'Proceso completo', '/proceso', ['collections.fases-proceso']],
    ['cp-page-taller-01', 'team', 'Taller completo', '/taller', ['business.name']],
    ['cp-page-nosotros-01', 'benefits', 'Sobre nosotros', '/sobre-nosotros', ['business.name']],
    ['cp-page-faq-01', 'faq', 'Preguntas completas', '/preguntas', ['collections.preguntas-carpinteria']],
    ['cp-page-presupuesto-01', 'contact', 'Solicitud de presupuesto', '/solicitar-presupuesto', ['forms']],
    ['cp-page-legal-01', 'contact', 'Documento legal', '/aviso-legal', ['content.legal']],
  ] as const).map(([id, type, name, route, fields]) => common(id, type as SectionVariant['sectionType'], name, [...fields], [route], true)),
];
