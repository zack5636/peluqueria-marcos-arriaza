/**
 * Vocabulario de tokens compartido por las cuatro templates.
 *
 * Un tema reasigna estos tokens semánticos; nunca colores sueltos dentro de un
 * componente. Todos los componentes de `src/site` leen exclusivamente de aquí.
 */

export type DecorPattern = 'paws' | 'dots' | 'lines' | 'organic' | 'none';
export type IconStyle = 'filled-circle' | 'soft-circle' | 'line' | 'gold-circle' | 'outline-square';
export type CardStyle = 'elevated' | 'outlined' | 'flat' | 'inverse';
export type MotionPreset = 'calm' | 'balanced' | 'expressive';

/**
 * Familia de animación de la web pública.
 *
 * El preset controla la intensidad; el estilo controla *qué* ocurre. Todos usan
 * exclusivamente `transform`, `opacity` y `box-shadow`, que el compositor
 * resuelve sin recalcular layout.
 */
export type AnimationStyle = 'suave' | 'elevacion' | 'brillo' | 'cinetico' | 'ninguna';

export const ANIMATION_STYLES: { id: AnimationStyle; name: string; description: string }[] = [
  { id: 'suave', name: 'Suave', description: 'Apariciones con desvanecido y desplazamiento corto. La opción más discreta.' },
  { id: 'elevacion', name: 'Elevación', description: 'Las tarjetas se elevan con sombra y las imágenes hacen un zoom contenido.' },
  { id: 'brillo', name: 'Brillo', description: 'Destellos y barrido de degradado con el color de marca en botones y tarjetas.' },
  { id: 'cinetico', name: 'Cinético', description: 'Entradas direccionales encadenadas con retardo entre elementos.' },
  { id: 'ninguna', name: 'Sin movimiento', description: 'Desactiva las animaciones decorativas y deja solo los cambios de estado.' },
];

export interface ThemeTokens {
  // --- Color ---
  brandPrimary: string;
  brandPrimaryStrong: string;
  brandPrimaryContrast: string;
  brandSecondary: string;
  accent: string;
  accentAlt: string;
  accentTertiary: string;
  surface: string;
  surfaceAlt: string;
  surfaceMuted: string;
  surfaceHighlight: string;
  surfaceInverse: string;
  surfaceInverseSoft: string;
  text: string;
  textMuted: string;
  textInverse: string;
  textMutedInverse: string;
  /** Texto principal sobre superficies claras y alternativas claras. */
  textOnLight: string;
  /** Texto secundario sobre superficies claras y alternativas claras. */
  textMutedOnLight: string;
  /** Texto principal sobre superficies oscuras, overlays y heroes inversos. */
  textOnDark: string;
  /** Texto secundario sobre superficies oscuras, overlays y footers. */
  textMutedOnDark: string;
  /** Texto colocado directamente sobre el color de marca. */
  textOnBrand: string;
  /** Texto principal dentro de tarjetas; independiente de la banda exterior. */
  textOnCard: string;
  /** Texto de controles de acción primarios. */
  buttonText: string;
  /** Enlaces de texto sobre superficies claras. */
  linkText: string;
  /** Texto decorativo o auxiliar que todavía debe ser legible. */
  decorativeText: string;
  border: string;
  borderStrong: string;
  success: string;
  warning: string;
  danger: string;
  focus: string;
  /**
   * Anillo de foco sobre bandas y superficies inversas. Un único `focus` no
   * puede cumplir AA sobre blanco y sobre negro a la vez, así que las zonas
   * inversas usan su propio token.
   */
  focusInverse: string;
  whatsapp: string;
  star: string;

  // --- Tipografía ---
  fontDisplay: string;
  fontBody: string;
  displayWeight: string;
  bodyWeight: string;
  displayTransform: string;
  displayLetterSpacing: string;
  eyebrowTransform: string;
  eyebrowLetterSpacing: string;
  h1Size: string;
  h1SizeMobile: string;
  h1LineHeight: string;
  h2Size: string;
  h3Size: string;
  bodySize: string;
  labelSize: string;

  // --- Layout ---
  contentMax: string;
  gutter: string;
  gutterTablet: string;
  gutterMobile: string;
  sectionSpacing: string;

  // --- Forma ---
  radiusCard: string;
  radiusButton: string;
  radiusInput: string;
  radiusImage: string;
  radiusPill: string;
  radiusModal: string;
  radiusContainer: string;

  // --- Profundidad ---
  shadowCard: string;
  shadowFloat: string;
  shadowOverlay: string;

  // --- Botones ---
  buttonPaddingY: string;
  buttonPaddingX: string;
  buttonWeight: string;
  buttonTransform: string;
  buttonLetterSpacing: string;
  buttonShadow: string;
  buttonGradient: string;

  // --- Tarjetas ---
  cardStyle: CardStyle;
  cardBorderWidth: string;
  cardBackground: string;
  cardGradient: string;
  cardBackdropFilter: string;
  cardHoverLift: string;
  surfaceGlow: string;

  // --- Fondos y decoración ---
  heroBackground: string;
  bandBackground: string;
  gradientAccent: string;
  decorPattern: DecorPattern;
  decorOpacity: string;
  iconStyle: IconStyle;

  // --- Movimiento ---
  durationFast: string;
  durationBase: string;
  easing: string;
  motionPreset: MotionPreset;
  /** Familia de animación aplicada a la web pública. */
  animationStyle: AnimationStyle;
  revealDistance: string;
  imageHoverScale: string;
  /** Color de los efectos animados; por defecto sigue a la marca. */
  motionAccent: string;
  /** Retardo entre elementos encadenados de una misma rejilla. */
  staggerStep: string;
}

export type ThemeTokenKey = keyof ThemeTokens;

/** Tokens de color que la pantalla Temas expone como paleta editable. */
export const EDITABLE_COLOR_TOKENS: readonly ThemeTokenKey[] = [
  'brandPrimary',
  'brandSecondary',
  'accent',
  'surface',
  'surfaceAlt',
  'surfaceInverse',
  'textOnLight',
  'textMutedOnLight',
  'textOnDark',
  'textMutedOnDark',
  'textOnBrand',
  'textOnCard',
  'buttonText',
  'linkText',
  'decorativeText',
  'border',
  'success',
  'warning',
  'danger',
  'focus',
  'focusInverse',
] as const;

export const TOKEN_LABELS: Partial<Record<ThemeTokenKey, string>> = {
  brandPrimary: 'Marca primaria',
  brandSecondary: 'Marca secundaria',
  accent: 'Acento',
  surface: 'Superficie',
  surfaceAlt: 'Superficie alterna',
  surfaceInverse: 'Superficie inversa',
  text: 'Texto principal',
  textMuted: 'Texto secundario',
  textOnLight: 'Texto sobre fondo claro',
  textMutedOnLight: 'Texto secundario sobre fondo claro',
  textOnDark: 'Texto sobre fondo oscuro',
  textMutedOnDark: 'Texto secundario sobre fondo oscuro',
  textOnBrand: 'Texto sobre color de marca',
  textOnCard: 'Texto de tarjetas',
  buttonText: 'Texto de botones',
  linkText: 'Texto de enlaces',
  decorativeText: 'Texto decorativo',
  border: 'Borde',
  success: 'Éxito',
  warning: 'Aviso',
  danger: 'Error',
  focus: 'Foco',
  focusInverse: 'Foco en zonas oscuras',
  motionAccent: 'Color de los efectos animados',
  fontDisplay: 'Tipografía de títulos',
  fontBody: 'Tipografía de cuerpo',
  radiusCard: 'Radio de tarjetas',
  radiusButton: 'Radio de botones',
  radiusInput: 'Radio de campos',
  radiusImage: 'Radio de imágenes',
  radiusModal: 'Radio de modales',
  radiusContainer: 'Radio de contenedores',
  shadowCard: 'Sombra de tarjeta',
  cardStyle: 'Estilo de tarjetas',
  iconStyle: 'Estilo de iconos',
  decorPattern: 'Decoración de fondo',
  gradientAccent: 'Degradado de acento',
  bandBackground: 'Fondo de secciones',
};

/**
 * Contrato de color v2. Los aliases antiguos se conservan para componentes y
 * proyectos previos, pero el renderer contextual solo consume estas claves.
 */
export const SEMANTIC_COLOR_TOKEN_VERSION = 2;

export const SEMANTIC_COLOR_TOKENS = [
  'textOnLight',
  'textMutedOnLight',
  'textOnDark',
  'textMutedOnDark',
  'textOnBrand',
  'textOnCard',
  'buttonText',
  'linkText',
  'decorativeText',
] as const satisfies readonly ThemeTokenKey[];

export type SemanticColorToken = (typeof SEMANTIC_COLOR_TOKENS)[number];

/** Deriva el contrato contextual sin destruir valores semánticos explícitos. */
export function normalizeSemanticThemeTokens<T extends Record<string, unknown>>(tokens: T): T & Record<SemanticColorToken, string> {
  const value = (key: string, fallback: string) =>
    typeof tokens[key] === 'string' && tokens[key] ? String(tokens[key]) : fallback;
  const text = value('text', '#10172F');
  const muted = value('textMuted', text);
  const inverse = value('textInverse', '#FFFFFF');
  const mutedInverse = value('textMutedInverse', inverse);
  const brandContrast = value('brandPrimaryContrast', inverse);
  return {
    ...tokens,
    textOnLight: value('textOnLight', text),
    textMutedOnLight: value('textMutedOnLight', muted),
    textOnDark: value('textOnDark', inverse),
    textMutedOnDark: value('textMutedOnDark', mutedInverse),
    textOnBrand: value('textOnBrand', brandContrast),
    textOnCard: value('textOnCard', text),
    buttonText: value('buttonText', brandContrast),
    linkText: value('linkText', text),
    decorativeText: value('decorativeText', muted),
  } as T & Record<SemanticColorToken, string>;
}

/** Migra overrides guardados; ejecutar varias veces devuelve el mismo mapa. */
export function normalizeThemeTokenOverrides(overrides: Record<string, string> = {}): Record<string, string> {
  const next = { ...overrides };
  const copy = (target: SemanticColorToken, source: string) => {
    if (!next[target] && next[source]) next[target] = next[source];
  };
  copy('textOnLight', 'text');
  copy('textMutedOnLight', 'textMuted');
  copy('textOnDark', 'textInverse');
  copy('textMutedOnDark', 'textMutedInverse');
  copy('textOnBrand', 'brandPrimaryContrast');
  copy('textOnCard', 'text');
  copy('buttonText', 'brandPrimaryContrast');
  copy('linkText', 'text');
  copy('decorativeText', 'textMuted');
  return next;
}

const CSS_VAR_CACHE = new Map<string, string>();

/** `brandPrimary` -> `--wf-brand-primary`. */
export function tokenToCssVar(key: string): string {
  const cached = CSS_VAR_CACHE.get(key);
  if (cached) return cached;
  const value = `--wf-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
  CSS_VAR_CACHE.set(key, value);
  return value;
}

/** Convierte los tokens en el objeto de estilos inline que envuelve al sitio. */
export function tokensToCssVars(
  tokens: ThemeTokens,
  overrides: Record<string, string> = {},
): Record<string, string> {
  const style: Record<string, string> = {};
  const effective = normalizeSemanticThemeTokens({ ...tokens, ...normalizeThemeTokenOverrides(overrides) });
  for (const [key, value] of Object.entries(effective)) {
    style[tokenToCssVar(key)] = String(value);
  }
  // Aliases de compatibilidad: componentes anteriores consumen estas
  // variables, pero reciben el valor del contrato contextual actualizado.
  style[tokenToCssVar('text')] = effective.textOnLight;
  style[tokenToCssVar('textMuted')] = effective.textMutedOnLight;
  style[tokenToCssVar('textInverse')] = effective.textOnDark;
  style[tokenToCssVar('textMutedInverse')] = effective.textMutedOnDark;
  style[tokenToCssVar('brandPrimaryContrast')] = effective.buttonText;
  return style;
}
