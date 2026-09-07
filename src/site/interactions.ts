/**
 * Capacidades de interacción y movimiento que declara una variante.
 *
 * No es una biblioteca de animación nueva: `MotionConfig` ya define el
 * vocabulario —entradas, stagger, hover de tarjeta, tratamiento de imagen— y
 * `motion.css` ya lo aplica. Lo que faltaba era que el **registro** pudiera
 * decir qué hace cada sección, para que el generador componga con criterio en
 * vez de aplicar el mismo revelado a todo.
 *
 * El dato que lo justifica: de los 118 revelados declarados hoy en las
 * plantillas, 107 son `fade-up`. Una biblioteca modular con un único gesto
 * produce webs que se notan generadas.
 */

import type { EntryAnimationId, MotionStyleId, SectionMotion } from './motion';

/**
 * Patrón de interacción que la sección **posee por diseño**, no un efecto
 * añadido después. Sirve para dos cosas: describir la variante en el editor y
 * permitir que el generador reparta variedad sin repetir el mismo gesto.
 */
export type InteractionPattern =
  | 'scroll-reveal'
  | 'stagger'
  | 'card-hover'
  | 'image-zoom'
  | 'parallax'
  | 'accordion'
  | 'carousel'
  | 'before-after'
  | 'tabs'
  | 'counter'
  | 'cta-micro'
  | 'sticky-header'
  | 'lightbox'
  | 'drag';

/**
 * Nivel de acabado visual de una variante. Sirve para no inflar la biblioteca
 * contando bloques mediocres: el generador puede preferir las de referencia y
 * el editor puede avisar de las que están pendientes de mejora.
 */
export type VisualTier =
  /** Composición cuidada, jerarquía clara y movimiento propio. */
  | 'reference'
  /** Correcta y utilizable, sin ser ejemplar. */
  | 'solid'
  /** Funciona, pero es demasiado plana para vender una web. */
  | 'basic';

export interface VariantMotion {
  /** Entrada por defecto de la sección. */
  entry: EntryAnimationId;
  /** Encadena los elementos de su colección al aparecer. */
  stagger: boolean;
  interactions: InteractionPattern[];
  tier: VisualTier;
  /**
   * Entradas alternativas que la composición admite sin romperse. El generador
   * elige entre ellas para no repetir el mismo gesto en toda la página.
   */
  entryAlternatives?: EntryAnimationId[];
}

/* -------------------------------------------------------------------------- */
/*  Lenguaje de movimiento por dirección visual                                */
/* -------------------------------------------------------------------------- */

/**
 * Cada perfil tiene un idioma de movimiento, no una cantidad.
 *
 * Premium no significa «más animaciones» ni Minimalista «ninguna»: cambia el
 * gesto y su amplitud. Los tres deben sentirse profesionales.
 */
export interface MotionLanguage {
  style: MotionStyleId;
  /** Entradas que este perfil considera propias, en orden de preferencia. */
  vocabulary: EntryAnimationId[];
  /** Cuántas secciones seguidas pueden repetir gesto antes de cansar. */
  maxRepeat: number;
  /** Patrones que el perfil evita aunque la variante los ofrezca. */
  avoid: InteractionPattern[];
}

export const MOTION_LANGUAGE: Record<string, MotionLanguage> = {
  premium: {
    style: 'premium',
    // Revelados largos y con presencia: la página se descubre.
    vocabulary: ['reveal-up', 'blur-in', 'rise', 'fade-up', 'zoom-in'],
    maxRepeat: 2,
    avoid: [],
  },
  minimal: {
    style: 'suave',
    // Gestos cortos y precisos: nada llama la atención sobre sí mismo.
    vocabulary: ['fade', 'fade-up', 'fade-down', 'slide-right'],
    maxRepeat: 2,
    avoid: ['parallax', 'counter', 'drag'],
  },
  conventional: {
    style: 'dinamico',
    // Entradas reconocibles y respuesta rápida: el visitante sabe qué pasa.
    vocabulary: ['fade-up', 'slide-right', 'slide-left', 'zoom-in', 'fade'],
    maxRepeat: 2,
    avoid: ['parallax'],
  },
};

/* -------------------------------------------------------------------------- */
/*  Reparto de variedad                                                        */
/* -------------------------------------------------------------------------- */

export interface MotionAssignment {
  sectionId: string;
  motion: SectionMotion;
}

/**
 * Reparte los gestos de entrada de una página.
 *
 * Reglas, en este orden: se respeta lo que la variante declara si el perfil lo
 * admite; no se repite el mismo gesto más de `maxRepeat` veces seguidas; y la
 * elección es determinista, porque viene de la semilla de la receta.
 *
 * La cabecera nunca se anima al entrar: aparecer la navegación es peor que no
 * animarla.
 */
export function assignMotion(
  sections: { id: string; type: string; motion?: VariantMotion | undefined }[],
  language: MotionLanguage,
  random: () => number,
): MotionAssignment[] {
  const out: MotionAssignment[] = [];
  let previous: EntryAnimationId | null = null;
  let repeats = 0;

  for (const section of sections) {
    if (section.type === 'header' || section.type === 'footer') {
      out.push({ sectionId: section.id, motion: { entry: 'none', stagger: false, delayMs: 0, disabled: false } });
      continue;
    }

    const declared = section.motion?.entry;
    const alternatives = section.motion?.entryAlternatives ?? [];
    // Preferencias: lo que la variante declara y sus alternativas, filtradas
    // por el vocabulario del perfil; si nada encaja, el idioma del perfil manda.
    const preferred = [declared, ...alternatives].filter(
      (entry): entry is EntryAnimationId => entry !== undefined && language.vocabulary.includes(entry),
    );
    const pool = preferred.length > 0 ? preferred : language.vocabulary;

    const fallback: EntryAnimationId = language.vocabulary[0] ?? 'fade-up';
    let entry: EntryAnimationId = pool[Math.floor(random() * pool.length)] ?? fallback;
    if (entry === previous) {
      repeats += 1;
      if (repeats >= language.maxRepeat) {
        const others = language.vocabulary.filter((candidate) => candidate !== previous);
        entry = others[Math.floor(random() * others.length)] ?? entry;
        repeats = 0;
      }
    } else {
      repeats = 0;
    }
    previous = entry;

    out.push({
      sectionId: section.id,
      motion: {
        entry,
        stagger: section.motion?.stagger ?? false,
        delayMs: 0,
        disabled: false,
      },
    });
  }

  return out;
}

/** Cuántos gestos distintos usa una página. Métrica de la variedad conseguida. */
export function motionVariety(assignments: MotionAssignment[]): number {
  return new Set(assignments.filter((a) => a.motion.entry !== 'none').map((a) => a.motion.entry)).size;
}
