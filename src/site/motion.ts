/**
 * Sistema de animaciones del proyecto.
 *
 * Reglas que el sistema garantiza y que las variantes no pueden romper:
 *
 * 1. **No altera el layout.** Solo se animan `transform`, `opacity`, `filter` y
 *    `box-shadow`. Un elemento oculto antes de aparecer conserva su espacio
 *    (`opacity: 0`, nunca `display: none`), así que no hay saltos de contenido
 *    ni cambios de altura. Las elevaciones se resuelven con `translate`, que no
 *    empuja a las tarjetas vecinas.
 * 2. **Respeta el sistema operativo.** Con `prefers-reduced-motion: reduce` las
 *    duraciones caen a cero y los movimientos continuos se detienen.
 * 3. **Sobrevive al tema.** La configuración vive en el proyecto, no en el tema.
 *    Un tema solo puede *recomendar* valores; cambiarlo nunca borra los ajustes.
 *
 * El módulo lo comparten el Admin Panel, la preview y los proyectos exportados,
 * por lo que no puede importar nada de `src/admin`, `src/data` ni de Tauri.
 */

/** Estilo global. Fija los valores de partida de todo lo demás. */
export type MotionStyleId = 'ninguna' | 'suave' | 'dinamico' | 'premium';

/** Animación de entrada de una sección o de las tarjetas de una colección. */
export type EntryAnimationId =
  | 'none'
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'reveal-up'
  | 'blur-in'
  | 'rise';

/** Respuesta de una tarjeta al pasar el ratón. */
export type CardAnimationId =
  | 'none'
  | 'lift'
  | 'lift-glow'
  | 'lift-media'
  | 'border-draw'
  | 'tilt';

/** Tratamiento de las imágenes de portada y de sección. */
export type ImageAnimationId = 'none' | 'drift' | 'zoom-slow' | 'ken-burns' | 'parallax';

/** Fondo animado de las bandas decorativas. */
export type BackgroundAnimationId = 'none' | 'gradient-shift' | 'floating-shapes' | 'aurora';

export type HeaderAnimationId = 'none' | 'shrink' | 'solid' | 'hide-on-scroll';
export type ButtonAnimationId = 'none' | 'press' | 'glow' | 'sweep';
export type IconAnimationId = 'none' | 'pulse' | 'draw' | 'bounce';
export type GalleryTransitionId = 'fade' | 'slide' | 'zoom';

/** Cómo se comporta la aparición al desplazarse. */
export type ScrollBehaviorId = 'once' | 'every-time';

export interface SectionMotion {
  /** Animación de entrada de la sección. */
  entry: EntryAnimationId;
  /** Encadena las tarjetas de la colección que contenga. */
  stagger: boolean;
  /** Retardo propio, sumado al global. */
  delayMs: number;
  /** Desactiva la animación solo en esta sección. */
  disabled: boolean;
}

export interface MotionConfig {
  /** Versión del contrato de animaciones; permite migrar sin perder ajustes. */
  version: number;
  style: MotionStyleId;
  /** 0–100. Escala distancias, sombras y amplitudes. */
  intensity: number;
  durationMs: number;
  delayMs: number;
  staggerMs: number;
  scrollBehavior: ScrollBehaviorId;
  /** Fracción visible que dispara la entrada (0–1). */
  threshold: number;
  cards: CardAnimationId;
  images: ImageAnimationId;
  background: BackgroundAnimationId;
  header: HeaderAnimationId;
  buttons: ButtonAnimationId;
  icons: IconAnimationId;
  gallery: GalleryTransitionId;
  /** Anima los contadores al entrar en pantalla. */
  counters: boolean;
  /** Transiciones entre páginas y secciones. */
  pageTransitions: boolean;
  /** Ajustes por instancia de sección, indexados por `SectionInstance.id`. */
  sections: Record<string, SectionMotion>;
}

export const MOTION_CONFIG_VERSION = 1;

/* -------------------------------------------------------------------------- */
/*                          Biblioteca para la preview                        */
/* -------------------------------------------------------------------------- */

export interface MotionLibraryEntry<T extends string = string> {
  id: T;
  name: string;
  description: string;
  /** Cómo se comporta en móvil, donde la amplitud siempre se reduce. */
  mobileNote: string;
}

export const ENTRY_ANIMATIONS: MotionLibraryEntry<EntryAnimationId>[] = [
  { id: 'none', name: 'Sin entrada', description: 'El contenido aparece directamente, sin animación.', mobileNote: 'Idéntico en móvil.' },
  { id: 'fade', name: 'Desvanecido', description: 'La sección aparece subiendo la opacidad, sin desplazamiento.', mobileNote: 'Idéntico en móvil.' },
  { id: 'fade-up', name: 'Desvanecido hacia arriba', description: 'Aparece desplazándose ligeramente desde abajo. La opción más neutra.', mobileNote: 'La distancia se reduce a la mitad.' },
  { id: 'fade-down', name: 'Desvanecido hacia abajo', description: 'Aparece descendiendo; útil en cabeceras y menús.', mobileNote: 'La distancia se reduce a la mitad.' },
  { id: 'slide-left', name: 'Entrada desde la derecha', description: 'Desplazamiento lateral hacia la izquierda al entrar en pantalla.', mobileNote: 'Se convierte en desvanecido vertical para no provocar desbordes.' },
  { id: 'slide-right', name: 'Entrada desde la izquierda', description: 'Desplazamiento lateral hacia la derecha al entrar en pantalla.', mobileNote: 'Se convierte en desvanecido vertical para no provocar desbordes.' },
  { id: 'zoom-in', name: 'Escalado', description: 'La sección crece desde un tamaño ligeramente menor.', mobileNote: 'La escala se acerca a 1 para evitar recortes.' },
  { id: 'reveal-up', name: 'Revelado progresivo', description: 'El contenido se descubre tras una máscara que sube.', mobileNote: 'Se mantiene, con recorrido más corto.' },
  { id: 'blur-in', name: 'Enfoque', description: 'Entra desenfocado y se enfoca progresivamente.', mobileNote: 'El desenfoque se reduce para no penalizar el rendimiento.' },
  { id: 'rise', name: 'Ascenso amplio', description: 'Recorrido largo y elástico; la entrada más visible.', mobileNote: 'El recorrido se acorta notablemente.' },
];

export const CARD_ANIMATIONS: MotionLibraryEntry<CardAnimationId>[] = [
  { id: 'none', name: 'Sin respuesta', description: 'La tarjeta no reacciona al ratón.', mobileNote: 'Sin efecto: en móvil no hay puntero.' },
  { id: 'lift', name: 'Elevación', description: 'La tarjeta completa se eleva y su sombra crece.', mobileNote: 'Se aplica brevemente al tocar.' },
  { id: 'lift-glow', name: 'Elevación con brillo', description: 'Eleva la tarjeta, intensifica la sombra y tiñe el borde con el color de marca.', mobileNote: 'Se aplica brevemente al tocar.' },
  { id: 'lift-media', name: 'Elevación coordinada', description: 'La tarjeta se eleva y, a la vez, su imagen hace un zoom contenido y el icono se desplaza.', mobileNote: 'Se aplica brevemente al tocar.' },
  { id: 'border-draw', name: 'Trazado de borde', description: 'Un borde de color recorre el perímetro de la tarjeta.', mobileNote: 'Se aplica brevemente al tocar.' },
  { id: 'tilt', name: 'Inclinación', description: 'La tarjeta se inclina levemente siguiendo al puntero.', mobileNote: 'Desactivado en móvil.' },
];

export const IMAGE_ANIMATIONS: MotionLibraryEntry<ImageAnimationId>[] = [
  { id: 'none', name: 'Estática', description: 'La imagen no se mueve.', mobileNote: 'Idéntico en móvil.' },
  { id: 'drift', name: 'Desplazamiento suave', description: 'Movimiento lento y continuo de pocos píxeles.', mobileNote: 'Amplitud reducida.' },
  { id: 'zoom-slow', name: 'Zoom lento', description: 'Escalado muy lento y continuo, sin recortar el encuadre.', mobileNote: 'Amplitud reducida.' },
  { id: 'ken-burns', name: 'Ken Burns', description: 'Combina zoom y desplazamiento; da vida a las portadas fotográficas.', mobileNote: 'Amplitud reducida.' },
  { id: 'parallax', name: 'Parallax controlado', description: 'La imagen se mueve a distinta velocidad que el texto al desplazarse.', mobileNote: 'Desactivado en móvil por rendimiento.' },
];

export const BACKGROUND_ANIMATIONS: MotionLibraryEntry<BackgroundAnimationId>[] = [
  { id: 'none', name: 'Fondo estático', description: 'Sin movimiento de fondo.', mobileNote: 'Idéntico en móvil.' },
  { id: 'gradient-shift', name: 'Degradado animado', description: 'El degradado de la banda se desplaza lentamente.', mobileNote: 'Se mantiene; es barato de componer.' },
  { id: 'floating-shapes', name: 'Formas flotantes', description: 'Formas suaves que se desplazan por detrás del contenido.', mobileNote: 'Menos formas y recorrido más corto.' },
  { id: 'aurora', name: 'Aurora', description: 'Manchas de color difuminadas en movimiento continuo.', mobileNote: 'Desactivado en móvil por rendimiento.' },
];

export const HEADER_ANIMATIONS: MotionLibraryEntry<HeaderAnimationId>[] = [
  { id: 'none', name: 'Cabecera fija', description: 'La cabecera no cambia al desplazarse.', mobileNote: 'Idéntico en móvil.' },
  { id: 'shrink', name: 'Compactar', description: 'Reduce su altura y el tamaño del logotipo al bajar.', mobileNote: 'Se mantiene.' },
  { id: 'solid', name: 'Volverse sólida', description: 'Pasa de transparente a sólida con sombra al abandonar el hero.', mobileNote: 'Se mantiene.' },
  { id: 'hide-on-scroll', name: 'Ocultar al bajar', description: 'Se oculta al bajar y reaparece al subir.', mobileNote: 'Se mantiene; libera altura útil.' },
];

export const BUTTON_ANIMATIONS: MotionLibraryEntry<ButtonAnimationId>[] = [
  { id: 'none', name: 'Sin efecto', description: 'Solo el cambio de color de estado.', mobileNote: 'Idéntico en móvil.' },
  { id: 'press', name: 'Pulsación', description: 'El botón se hunde levemente al pulsarlo.', mobileNote: 'Se mantiene.' },
  { id: 'glow', name: 'Halo', description: 'Un halo del color de marca crece bajo el botón.', mobileNote: 'Se mantiene.' },
  { id: 'sweep', name: 'Barrido', description: 'Un degradado recorre el botón de izquierda a derecha.', mobileNote: 'Se mantiene.' },
];

export const ICON_ANIMATIONS: MotionLibraryEntry<IconAnimationId>[] = [
  { id: 'none', name: 'Sin efecto', description: 'Iconos estáticos.', mobileNote: 'Idéntico en móvil.' },
  { id: 'pulse', name: 'Latido', description: 'Escalado breve al entrar en pantalla o al pasar el ratón.', mobileNote: 'Solo al entrar en pantalla.' },
  { id: 'draw', name: 'Trazado', description: 'El icono se dibuja trazando su contorno.', mobileNote: 'Se mantiene.' },
  { id: 'bounce', name: 'Rebote', description: 'Pequeño rebote vertical al aparecer.', mobileNote: 'Se mantiene, con menor amplitud.' },
];

export const GALLERY_TRANSITIONS: MotionLibraryEntry<GalleryTransitionId>[] = [
  { id: 'fade', name: 'Desvanecido', description: 'Las imágenes se funden entre sí.', mobileNote: 'Idéntico en móvil.' },
  { id: 'slide', name: 'Deslizamiento', description: 'Las imágenes se desplazan lateralmente.', mobileNote: 'Idéntico en móvil.' },
  { id: 'zoom', name: 'Escalado', description: 'La imagen entrante crece mientras la saliente se desvanece.', mobileNote: 'Idéntico en móvil.' },
];

export const MOTION_STYLES: {
  id: MotionStyleId;
  name: string;
  description: string;
}[] = [
  { id: 'ninguna', name: 'Sin animaciones', description: 'Desactiva todo el movimiento decorativo. Solo quedan los cambios de estado necesarios.' },
  { id: 'suave', name: 'Suave', description: 'Apariciones cortas y discretas. Recomendado cuando el contenido debe leerse rápido.' },
  { id: 'dinamico', name: 'Dinámico', description: 'Entradas visibles, encadenado entre tarjetas y respuesta clara al ratón.' },
  { id: 'premium', name: 'Premium', description: 'Movimiento amplio y continuo: fondos animados, parallax y revelados largos.' },
];

/* -------------------------------------------------------------------------- */
/*                                  Presets                                    */
/* -------------------------------------------------------------------------- */

type StylePreset = Omit<MotionConfig, 'version' | 'sections' | 'style'>;

const PRESETS: Record<MotionStyleId, StylePreset> = {
  ninguna: {
    intensity: 0,
    durationMs: 0,
    delayMs: 0,
    staggerMs: 0,
    scrollBehavior: 'once',
    threshold: 0.1,
    cards: 'none',
    images: 'none',
    background: 'none',
    header: 'solid',
    buttons: 'none',
    icons: 'none',
    gallery: 'fade',
    counters: false,
    pageTransitions: false,
  },
  suave: {
    intensity: 45,
    durationMs: 520,
    delayMs: 0,
    staggerMs: 70,
    scrollBehavior: 'once',
    threshold: 0.15,
    cards: 'lift',
    images: 'none',
    background: 'none',
    header: 'shrink',
    buttons: 'press',
    icons: 'none',
    gallery: 'fade',
    counters: true,
    pageTransitions: true,
  },
  dinamico: {
    intensity: 70,
    durationMs: 640,
    delayMs: 0,
    staggerMs: 100,
    scrollBehavior: 'once',
    threshold: 0.18,
    cards: 'lift-media',
    images: 'zoom-slow',
    background: 'gradient-shift',
    header: 'shrink',
    buttons: 'sweep',
    icons: 'pulse',
    gallery: 'slide',
    counters: true,
    pageTransitions: true,
  },
  premium: {
    intensity: 90,
    durationMs: 820,
    delayMs: 60,
    staggerMs: 130,
    scrollBehavior: 'once',
    threshold: 0.2,
    cards: 'lift-glow',
    images: 'ken-burns',
    background: 'aurora',
    header: 'solid',
    buttons: 'glow',
    icons: 'draw',
    gallery: 'zoom',
    counters: true,
    pageTransitions: true,
  },
};

/** Configuración completa a partir de un estilo global. */
export function motionFromStyle(style: MotionStyleId): MotionConfig {
  return {
    version: MOTION_CONFIG_VERSION,
    style,
    ...structuredClone(PRESETS[style]),
    sections: {},
  };
}

export const DEFAULT_SECTION_MOTION: SectionMotion = {
  entry: 'fade-up',
  stagger: true,
  delayMs: 0,
  disabled: false,
};

export function sectionMotion(config: MotionConfig, sectionId: string): SectionMotion {
  return config.sections[sectionId] ?? DEFAULT_SECTION_MOTION;
}

/**
 * Reaplica el preset del estilo conservando lo que el usuario tocó a mano.
 * Se usa al pulsar «restaurar la animación recomendada».
 */
export function resetToStyle(config: MotionConfig, style: MotionStyleId): MotionConfig {
  return { ...motionFromStyle(style), sections: structuredClone(config.sections) };
}

/* -------------------------------------------------------------------------- */
/*                            Salida a la web pública                          */
/* -------------------------------------------------------------------------- */

/** Escala 0–100 → factor 0–1.4, para amplitudes y sombras. */
function amplitude(intensity: number): number {
  return Math.max(0, Math.min(100, intensity)) / 100 * 1.4;
}

/**
 * Variables CSS que consume `motion.css`.
 *
 * Con `reduced` todas las duraciones son `0ms` y las amplitudes `0`, de modo que
 * las reglas siguen aplicándose pero no producen movimiento: el contenido queda
 * visible y en su sitio sin necesidad de un árbol de estilos alternativo.
 */
export function motionToCssVars(config: MotionConfig, reduced = false): Record<string, string> {
  const off = reduced || config.style === 'ninguna';
  const amp = off ? 0 : amplitude(config.intensity);
  return {
    '--wf-motion-duration': off ? '0ms' : `${config.durationMs}ms`,
    '--wf-motion-delay': off ? '0ms' : `${config.delayMs}ms`,
    '--wf-motion-stagger': off ? '0ms' : `${config.staggerMs}ms`,
    '--wf-motion-amplitude': String(amp),
    '--wf-motion-distance': off ? '0px' : `${Math.round(28 * amp)}px`,
    '--wf-motion-scale': off ? '1' : String(1 + 0.04 * amp),
    '--wf-motion-lift': off ? '0px' : `${Math.round(10 * amp)}px`,
    '--wf-motion-blur': off ? '0px' : `${Math.round(8 * amp)}px`,
    '--wf-motion-ambient': off ? '0' : '1',
  };
}

/**
 * Atributos que el renderer pone en la raíz del sitio. `motion.css` engancha
 * todas sus reglas a estos selectores, así que la web pública y la exportación
 * comparten exactamente el mismo comportamiento.
 */
export function motionDataAttributes(
  config: MotionConfig,
  reduced = false,
): Record<string, string> {
  const off = reduced || config.style === 'ninguna';
  return {
    'data-wf-motion': off ? 'ninguna' : config.style,
    'data-wf-motion-cards': off ? 'none' : config.cards,
    'data-wf-motion-images': off ? 'none' : config.images,
    'data-wf-motion-background': off ? 'none' : config.background,
    'data-wf-motion-header': config.header,
    'data-wf-motion-buttons': off ? 'none' : config.buttons,
    'data-wf-motion-icons': off ? 'none' : config.icons,
    'data-wf-motion-gallery': config.gallery,
    'data-wf-motion-counters': off ? 'off' : String(config.counters),
    'data-wf-motion-transitions': off ? 'off' : String(config.pageTransitions),
  };
}

/**
 * Rellena los ajustes de las secciones que la template añadió después de crear
 * el proyecto y descarta los de secciones que ya no existen, sin tocar el resto.
 */
export function reconcileMotion(
  config: MotionConfig | undefined,
  sectionIds: string[],
  recommended: Record<string, SectionMotion> = {},
): MotionConfig {
  const base = config ?? motionFromStyle('suave');
  const known = new Set(sectionIds);
  const sections: Record<string, SectionMotion> = {};
  for (const id of sectionIds) {
    sections[id] = base.sections[id] ?? recommended[id] ?? { ...DEFAULT_SECTION_MOTION };
  }
  // Conserva los ajustes de secciones desconocidas solo si siguen existiendo.
  for (const [id, value] of Object.entries(base.sections)) {
    if (known.has(id)) sections[id] = value;
  }
  return { ...base, version: MOTION_CONFIG_VERSION, sections };
}
