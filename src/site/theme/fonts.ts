/**
 * Familias tipográficas. Todas se sirven desde `public/assets/fonts` (ver
 * `scripts/fetch-assets.mjs`) y declaran fallback de sistema, de modo que el
 * sitio nunca depende de una petición externa.
 */

export const FONT_STACKS = {
  poppins: "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
  nunito: "'Nunito', 'Segoe UI', system-ui, -apple-system, sans-serif",
  inter: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  playfair: "'Playfair Display', Georgia, 'Times New Roman', serif",
  cormorant: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
} as const;

export type FontStackKey = keyof typeof FONT_STACKS;

export interface FontPair {
  id: string;
  label: string;
  display: FontStackKey;
  body: FontStackKey;
}

/** Pares aprobados que la pantalla Temas ofrece por template. */
export const APPROVED_FONT_PAIRS: FontPair[] = [
  { id: 'nunito-poppins', label: 'Familiar · Nunito + Poppins', display: 'nunito', body: 'poppins' },
  { id: 'nunito-inter', label: 'Amable · Nunito + Inter', display: 'nunito', body: 'inter' },
  { id: 'poppins-inter', label: 'Moderna · Poppins + Inter', display: 'poppins', body: 'inter' },
  { id: 'poppins-poppins', label: 'Geométrica · Poppins', display: 'poppins', body: 'poppins' },
  { id: 'playfair-inter', label: 'Editorial · Playfair + Inter', display: 'playfair', body: 'inter' },
  { id: 'playfair-poppins', label: 'Boutique · Playfair + Poppins', display: 'playfair', body: 'poppins' },
  { id: 'playfair-nunito', label: 'Natural · Playfair + Nunito', display: 'playfair', body: 'nunito' },
  { id: 'cormorant-inter', label: 'Premium · Cormorant + Inter', display: 'cormorant', body: 'inter' },
  { id: 'cormorant-poppins', label: 'Sofisticada · Cormorant + Poppins', display: 'cormorant', body: 'poppins' },
  { id: 'inter-inter', label: 'Minimalista · Inter', display: 'inter', body: 'inter' },
];

export function findFontPair(id: string): FontPair | undefined {
  return APPROVED_FONT_PAIRS.find((pair) => pair.id === id);
}
