/**
 * Capacidades de movimiento e interacción de la biblioteca heredada.
 *
 * No se ha inventado nada: cada entrada se obtuvo leyendo el propio componente
 * —qué `data-wf-entry` declara, si encadena varios, y qué piezas monta
 * (`Accordion`, `Carousel`, `BeforeAfter`, `Lightbox`, tarjetas, imágenes)—.
 * Es metadata que describe lo que la sección **ya hace**, no efectos añadidos.
 *
 * El `tier` clasifica el acabado para no inflar la biblioteca con bloques
 * mediocres: `reference` es material de referencia, `solid` es utilizable y
 * `basic` marca las que conviene mejorar antes de venderlas como catálogo.
 *
 * Generado por `scripts` de clasificación y revisable a mano.
 * Recuento: 5 de referencia, 38 sólidas, 57 básicas.
 */

import type { VariantMotion } from './interactions';

export const INHERITED_MOTION: Record<string, VariantMotion> = {
  'cc-faq-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'accordion'], tier: 'basic' },
  'cc-final-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'cc-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'cc-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'cc-hero-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'cc-inspiracion-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom'], tier: 'basic' },
  'cc-pasos-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'cc-servicios-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'cc-tipos-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom'], tier: 'basic' },
  'co-casos-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'co-diferencias-01': { entry: 'slide-right', stagger: true, interactions: ['scroll-reveal', 'stagger', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'reference' },
  'co-faq-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'accordion'], tier: 'basic' },
  'co-finalcta-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'co-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'co-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'solid' },
  'co-hero-01': { entry: 'fade-up', stagger: true, interactions: ['scroll-reveal', 'stagger', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'reference' },
  'co-metodo-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'cta-micro'], tier: 'solid' },
  'co-planes-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'co-sectores-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'cta-micro'], tier: 'solid' },
  'co-soluciones-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'tabs'], tier: 'basic' },
  'co-testimonials-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'cp-categorias-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom'], tier: 'solid' },
  'cp-faq-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'accordion'], tier: 'basic' },
  'cp-final-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'cp-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'cp-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'basic' },
  'cp-hero-01': { entry: 'fade-up', stagger: true, interactions: ['scroll-reveal', 'stagger', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'cp-materiales-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'cp-proceso-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'cp-proyectos-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'cp-servicios-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'cp-taller-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'basic' },
  'cp-testimonios-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'ct-final-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'basic' },
  'ct-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom'], tier: 'solid' },
  'ct-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'ct-hero-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'ct-historias-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom'], tier: 'basic' },
  'ct-manifiesto-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'ct-proceso-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom'], tier: 'basic' },
  'ct-servicios-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom'], tier: 'basic' },
  'ct-valores-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'el-finalcta-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'basic' },
  'el-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'solid' },
  'el-gallery-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'lightbox', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'el-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'solid' },
  'el-hero-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'el-plans-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'solid' },
  'el-process-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'el-services-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'el-testimonials-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'carousel', 'image-zoom'], tier: 'basic' },
  'hg-consejos-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'hg-estaciones-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'hg-faq-01': { entry: 'slide-right', stagger: false, interactions: ['scroll-reveal', 'accordion', 'cta-micro'], tier: 'basic' },
  'hg-finalcta-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'hg-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'hg-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'solid' },
  'hg-hero-01': { entry: 'fade-up', stagger: true, interactions: ['scroll-reveal', 'stagger', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'reference' },
  'hg-plan-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'hg-proceso-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'tabs'], tier: 'solid' },
  'hg-senales-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'hg-testimonials-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'hg-tratamientos-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'cta-micro'], tier: 'solid' },
  'pco-benefits-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'pco-booking-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'pco-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'pco-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'solid' },
  'pco-hero-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'pco-packages-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'pco-process-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'pco-services-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'pco-testimonials-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'carousel', 'before-after', 'image-zoom', 'cta-micro'], tier: 'reference' },
  'pf-booking-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'accordion', 'cta-micro'], tier: 'solid' },
  'pf-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'carousel', 'image-zoom'], tier: 'solid' },
  'pf-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'solid' },
  'pf-hero-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'pf-packages-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'pf-services-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'pf-testimonials-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'lightbox', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'ppa-faq-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'accordion'], tier: 'basic' },
  'ppa-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'ppa-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'solid' },
  'ppa-hero-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'ppa-process-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'ppa-services-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'ppa-testimonials-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'carousel', 'image-zoom'], tier: 'solid' },
  'ppa-transformations-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'before-after', 'cta-micro'], tier: 'basic' },
  'pr-faq-01': { entry: 'slide-right', stagger: false, interactions: ['scroll-reveal', 'accordion', 'cta-micro'], tier: 'basic' },
  'pr-finalcta-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
  'pr-footer-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal'], tier: 'basic' },
  'pr-header-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'sticky-header', 'cta-micro'], tier: 'solid' },
  'pr-hero-01': { entry: 'fade-up', stagger: true, interactions: ['scroll-reveal', 'stagger', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'reference' },
  'pr-plagas-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'pr-process-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'pr-sectores-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'cta-micro'], tier: 'solid' },
  'pr-services-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'cta-micro'], tier: 'solid' },
  'pr-testimonials-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'pr-trabajos-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover', 'image-zoom', 'cta-micro'], tier: 'solid' },
  'pr-trust-01': { entry: 'fade-up', stagger: false, interactions: ['scroll-reveal', 'card-hover'], tier: 'basic' },
  'pr-zonas-01': { entry: 'slide-right', stagger: false, interactions: ['scroll-reveal', 'cta-micro'], tier: 'basic' },
};

/** Variantes cuyo acabado no da la talla para una biblioteca de calidad. */
export const NEEDS_VISUAL_WORK: string[] = Object.entries(INHERITED_MOTION)
  .filter(([, motion]) => motion.tier === 'basic')
  .map(([id]) => id);
