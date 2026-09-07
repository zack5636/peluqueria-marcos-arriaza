/**
 * Binding semántico entre una sección visual y los datos del proyecto.
 *
 * El problema que resuelve: `activeItems(config.collections, 'plagas')` ata un
 * componente al vocabulario de un sector. La misma rejilla de tarjetas con
 * título, resumen e imagen sirve para tipos de plaga, tratamientos de
 * fisioterapia o líneas de producto, pero con la clave escrita dentro solo
 * sirve para una.
 *
 * A partir de aquí una sección declara **qué función** necesita —un catálogo
 * primario, unos servicios, unas zonas— y el proyecto resuelve qué colección
 * concreta cumple ese papel. El componente nunca conoce la clave.
 *
 * Lo mismo con las rutas: una variante enlaza a `@catalog`, no a `/plagas`, y
 * la receta decide que en este negocio `@catalog` es `/patologias`.
 *
 * Direccionamiento único: cualquier sitio donde antes iba una clave física
 * —`collectionLimits`, `requiredFields`, `navigationOutputs`— admite ahora la
 * forma `@rol`. No hay campos nuevos ni una segunda infraestructura.
 */

import { activeItems, type CollectionItem, type CollectionSet } from './collections';

/* -------------------------------------------------------------------------- */
/*  Roles                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Función que una colección cumple en una web, con independencia de cómo la
 * llame el sector.
 */
export type CollectionRole =
  /** Catálogo primario: aquello sobre lo que trata el negocio. */
  | 'catalog'
  /** Servicios o tratamientos, cuando el sector los separa del catálogo. */
  | 'services'
  /** A quién se dirige: sectores, públicos, perfiles de cliente. */
  | 'segments'
  /** Dónde trabaja. */
  | 'serviceAreas'
  /** Planes recurrentes, bonos, mantenimientos. */
  | 'plans'
  /** Trabajos hechos: casos, proyectos, intervenciones. */
  | 'cases'
  /** Contenido educativo: consejos, artículos, guías. */
  | 'articles'
  /** Contenido con estacionalidad o fases temporales. */
  | 'seasons'
  /** Acreditaciones, certificados, titulaciones. */
  | 'credentials'
  /** Documentación entregable. */
  | 'documents';

export const COLLECTION_ROLES: readonly CollectionRole[] = [
  'catalog', 'services', 'segments', 'serviceAreas', 'plans',
  'cases', 'articles', 'seasons', 'credentials', 'documents',
] as const;

/** Destino de navegación estable, resuelto a una ruta real por proyecto. */
export type RouteRole =
  | 'home' | 'services' | 'catalog' | 'catalogItem' | 'segments' | 'segmentItem'
  | 'serviceAreas' | 'plans' | 'cases' | 'caseItem' | 'articles' | 'articleItem'
  | 'contact' | 'booking' | 'faq' | 'about' | 'documents' | 'seasons' | 'process'
  | 'legalNotice' | 'privacy' | 'cookies';

export type CollectionBindings = Partial<Record<CollectionRole, string>>;
export type RouteBindings = Partial<Record<RouteRole, string>>;

/* -------------------------------------------------------------------------- */
/*  Direccionamiento `@rol`                                                    */
/* -------------------------------------------------------------------------- */

/** `@services` → `services`; cualquier otra cosa no es un rol. */
export function parseRoleRef(value: string): string | null {
  return value.startsWith('@') ? value.slice(1) : null;
}

export function isRoleRef(value: string): boolean {
  return value.startsWith('@');
}

/* -------------------------------------------------------------------------- */
/*  Resolución                                                                 */
/* -------------------------------------------------------------------------- */

export interface BindingSource {
  collections?: CollectionSet | undefined;
  bindings?: CollectionBindings | undefined;
  routes?: RouteBindings | undefined;
}

/**
 * Clave física que cumple ese rol en este proyecto, o `undefined` si el negocio
 * no tiene nada que ponga ahí. Sin binding se prueba el propio nombre del rol,
 * que es lo que permite que un proyecto sencillo no declare nada.
 */
export function roleKey(source: BindingSource, role: CollectionRole): string | undefined {
  const bound = source.bindings?.[role];
  if (bound) return bound;
  return source.collections && role in source.collections ? role : undefined;
}

/** Elementos activos de la colección que cumple ese rol, en orden de render. */
export function roleItems(source: BindingSource, role: CollectionRole): CollectionItem[] {
  const key = roleKey(source, role);
  if (!key) return [];
  return activeItems(source.collections ?? {}, key);
}

/**
 * Ruta real de un destino semántico.
 *
 * El `fallback` conserva el comportamiento anterior de las variantes que
 * todavía escriben su ruta: si no hay binding, se usa lo que la variante decía.
 */
export function roleRoute(source: BindingSource, role: RouteRole, fallback = ''): string {
  return source.routes?.[role] ?? fallback;
}

/**
 * Resuelve una referencia de colección que puede venir como `@rol` o como clave
 * física. Es el punto por el que pasan `collectionLimits` y `requiredFields`.
 */
export function resolveCollectionRef(source: BindingSource, ref: string): string | undefined {
  const role = parseRoleRef(ref);
  if (!role) return ref;
  return roleKey(source, role as CollectionRole);
}

/**
 * Igual, para una salida de navegación.
 *
 * Un rol terminado en `Item` es la ficha de detalle de su rol base: se deriva
 * de él en lugar de exigir una declaración aparte, porque la ruta de detalle
 * siempre cuelga de la de listado.
 */
export function resolveRouteRef(source: BindingSource, ref: string): string | undefined {
  const role = parseRoleRef(ref);
  if (!role) return ref;

  const direct = source.routes?.[role as RouteRole];
  if (direct) return direct;

  if (role.endsWith('Item')) {
    const base = source.routes?.[role.slice(0, -4) as RouteRole];
    if (base) return `${base}/{slug}`;
  }
  return undefined;
}

/**
 * Bindings por defecto de un proyecto que no declara ninguno: cada rol apunta a
 * la colección que se llama igual, si existe. Mantiene funcionando cualquier
 * proyecto anterior sin migrarlo.
 */
export function defaultBindings(collections: CollectionSet | undefined): CollectionBindings {
  if (!collections) return {};
  const out: CollectionBindings = {};
  for (const role of COLLECTION_ROLES) {
    if (role in collections) out[role] = role;
  }
  return out;
}

/** Rutas por defecto: las que Web Factory ha usado siempre. */
export const DEFAULT_ROUTES: RouteBindings = {
  home: '/',
  services: '/servicios',
  contact: '/contacto',
  booking: '/reservar',
  faq: '/preguntas',
  about: '/sobre-nosotros',
  legalNotice: '/aviso-legal',
  privacy: '/privacidad',
  cookies: '/cookies',
};
