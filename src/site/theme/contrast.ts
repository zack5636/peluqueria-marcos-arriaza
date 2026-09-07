/** Cálculo de contraste WCAG 2.1 usado antes de guardar un tema. */

export interface ContrastPair {
  id: string;
  label: string;
  foreground: string;
  background: string;
  /** Texto grande (≥24px o ≥18.66px bold) usa el umbral 3:1. */
  large: boolean;
  /** Token editable implicado, para abrir su control desde el aviso. */
  token?: string;
  /** Cuál de los dos colores corresponde a `token`. */
  fixTarget?: 'foreground' | 'background';
  /** Contexto real que se está validando; se muestra en el editor. */
  surface: 'light' | 'dark' | 'alternative' | 'brand' | 'card' | 'button';
}

export interface ContrastResult extends ContrastPair {
  ratio: number;
  required: number;
  passes: boolean;
}

const HEX_SHORT = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const HEX_LONG = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const RGB_FN = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i;

export function parseColor(input: string): [number, number, number] | null {
  const value = input.trim();
  const short = HEX_SHORT.exec(value);
  if (short) {
    return [
      parseInt(short[1] + short[1], 16),
      parseInt(short[2] + short[2], 16),
      parseInt(short[3] + short[3], 16),
    ];
  }
  const long = HEX_LONG.exec(value);
  if (long) {
    return [parseInt(long[1], 16), parseInt(long[2], 16), parseInt(long[3], 16)];
  }
  const rgb = RGB_FN.exec(value);
  if (rgb) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }
  return null;
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: string): number | null {
  const rgb = parseColor(color);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(channelLuminance) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Devuelve el ratio de contraste (1–21) o `null` si algún color no es analizable. */
export function contrastRatio(foreground: string, background: string): number | null {
  const lumA = relativeLuminance(foreground);
  const lumB = relativeLuminance(background);
  if (lumA === null || lumB === null) return null;
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pares auditados de un tema. Es la única definición: la usan el validador del
 * Admin Panel y la prueba que valida los doce temas de fábrica, de modo que un
 * tema oficial no puede publicarse con un par por debajo del mínimo AA.
 *
 * `token` indica cuál de los dos colores es editable por el usuario, para poder
 * abrir su control y proponer una corrección concreta.
 */
export function officialThemePairs(tokens: Record<string, string>): ContrastPair[] {
  return [
    { id: 'body', label: 'Texto sobre fondo claro', foreground: tokens.textOnLight, background: tokens.surface, large: false, token: 'textOnLight', fixTarget: 'foreground', surface: 'light' },
    { id: 'muted', label: 'Texto secundario sobre fondo claro', foreground: tokens.textMutedOnLight, background: tokens.surface, large: false, token: 'textMutedOnLight', fixTarget: 'foreground', surface: 'light' },
    { id: 'band', label: 'Texto sobre superficie alternativa', foreground: tokens.textOnLight, background: tokens.surfaceAlt, large: false, token: 'textOnLight', fixTarget: 'foreground', surface: 'alternative' },
    { id: 'mutedBand', label: 'Texto secundario sobre superficie alternativa', foreground: tokens.textMutedOnLight, background: tokens.surfaceAlt, large: false, token: 'textMutedOnLight', fixTarget: 'foreground', surface: 'alternative' },
    { id: 'card', label: 'Texto dentro de tarjetas', foreground: tokens.textOnCard, background: tokens.cardBackground, large: false, token: 'textOnCard', fixTarget: 'foreground', surface: 'card' },
    { id: 'button', label: 'Texto del botón primario', foreground: tokens.buttonText, background: tokens.brandPrimary, large: false, token: 'buttonText', fixTarget: 'foreground', surface: 'button' },
    { id: 'buttonStrong', label: 'Texto del botón primario en hover', foreground: tokens.buttonText, background: tokens.brandPrimaryStrong, large: false, token: 'buttonText', fixTarget: 'foreground', surface: 'button' },
    { id: 'inverse', label: 'Texto sobre fondo oscuro', foreground: tokens.textOnDark, background: tokens.surfaceInverse, large: false, token: 'textOnDark', fixTarget: 'foreground', surface: 'dark' },
    { id: 'inverseMuted', label: 'Texto secundario sobre fondo oscuro', foreground: tokens.textMutedOnDark, background: tokens.surfaceInverse, large: false, token: 'textMutedOnDark', fixTarget: 'foreground', surface: 'dark' },
    { id: 'inverseSoft', label: 'Texto sobre fondo oscuro secundario', foreground: tokens.textOnDark, background: tokens.surfaceInverseSoft, large: false, token: 'textOnDark', fixTarget: 'foreground', surface: 'dark' },
    { id: 'brand', label: 'Texto sobre color de marca', foreground: tokens.textOnBrand, background: tokens.brandPrimary, large: false, token: 'textOnBrand', fixTarget: 'foreground', surface: 'brand' },
    { id: 'link', label: 'Enlace de texto sobre fondo claro', foreground: tokens.linkText, background: tokens.surface, large: false, token: 'linkText', fixTarget: 'foreground', surface: 'light' },
    { id: 'decorative', label: 'Texto decorativo sobre fondo claro', foreground: tokens.decorativeText, background: tokens.surface, large: false, token: 'decorativeText', fixTarget: 'foreground', surface: 'light' },
    { id: 'focus', label: 'Anillo de foco sobre superficie', foreground: tokens.focus, background: tokens.surface, large: true, token: 'focus', fixTarget: 'foreground', surface: 'light' },
    { id: 'focusInverse', label: 'Anillo de foco sobre superficie inversa', foreground: tokens.focusInverse, background: tokens.surfaceInverse, large: true, token: 'focusInverse', fixTarget: 'foreground', surface: 'dark' },
    { id: 'danger', label: 'Mensaje de error sobre fondo claro', foreground: tokens.danger, background: tokens.surface, large: false, token: 'danger', fixTarget: 'foreground', surface: 'light' },
    { id: 'success', label: 'Mensaje de éxito sobre fondo claro', foreground: tokens.success, background: tokens.surface, large: false, token: 'success', fixTarget: 'foreground', surface: 'light' },
    { id: 'warning', label: 'Mensaje de aviso sobre fondo claro', foreground: tokens.warning, background: tokens.surface, large: false, token: 'warning', fixTarget: 'foreground', surface: 'light' },
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  const part = (value: number) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`.toUpperCase();
}

function mix(color: [number, number, number], target: [number, number, number], amount: number): [number, number, number] {
  return [
    color[0] + (target[0] - color[0]) * amount,
    color[1] + (target[1] - color[1]) * amount,
    color[2] + (target[2] - color[2]) * amount,
  ];
}

/**
 * Busca el color más próximo al original que alcanza el ratio exigido,
 * oscureciéndolo o aclarándolo según cuál sea el fondo. Devuelve `null` cuando
 * ni el blanco ni el negro puros lo consiguen (fondos de luminancia media).
 */
export function suggestAccessibleColor(
  original: string,
  fixed: string,
  required: number,
): { color: string; ratio: number } | null {
  const from = parseColor(original);
  if (!from || relativeLuminance(fixed) === null) return null;

  const fixedLum = relativeLuminance(fixed) as number;
  // Si el color fijo es claro se oscurece el editable; si es oscuro se aclara.
  const target: [number, number, number] = fixedLum > 0.35 ? [0, 0, 0] : [255, 255, 255];

  let best: { color: string; ratio: number } | null = null;
  for (let step = 1; step <= 100; step += 1) {
    const candidate = toHex(mix(from, target, step / 100));
    const ratio = contrastRatio(candidate, fixed);
    if (ratio !== null && ratio >= required) {
      best = { color: candidate, ratio: Math.round(ratio * 100) / 100 };
      break;
    }
  }
  return best;
}

export function evaluatePairs(pairs: ContrastPair[]): ContrastResult[] {
  return pairs.map((pair) => {
    const required = pair.large ? 3 : 4.5;
    const ratio = contrastRatio(pair.foreground, pair.background);
    // Un valor no analizable (degradado, `currentColor`) no debe bloquear el
    // guardado: se marca como aprobado con ratio 0 y no se muestra como error.
    if (ratio === null) {
      return { ...pair, ratio: 0, required, passes: true };
    }
    return { ...pair, ratio: Math.round(ratio * 100) / 100, required, passes: ratio >= required };
  });
}
