/**
 * Normalización y migración del contenido de un proyecto.
 *
 * Un proyecto guardado con una versión anterior debe abrirse tal cual: sin
 * recrearlo, sin perder recursos, textos, temas, formularios ni colecciones y
 * sin duplicar datos. Esta función es el único punto por el que pasa un
 * `SiteConfig` al cargarse, y es **idempotente**: aplicarla dos veces produce
 * exactamente el mismo resultado.
 *
 * Cada paso se declara con la versión en la que se introdujo, de modo que las
 * migraciones se aplican en orden y solo una vez.
 */

import { DEFAULT_ROUTES, defaultBindings } from './bindings';
import { reconcileCollections, type CollectionSchema, type CollectionSet } from './collections';
import type { FormSchema } from './forms';
import { motionFromStyle, reconcileMotion, type MotionConfig, type SectionMotion } from './motion';
import type { PageConfig, SiteConfig } from './types';
import { normalizeThemeTokenOverrides } from './theme/tokens';

/**
 * Versión del contrato de contenido.
 *
 *   1 · Contrato original de peluquería canina.
 *   2 · Colecciones declaradas, formularios abiertos y animaciones del proyecto.
 *   3 · Tokens de color semánticos y contextuales.
 *   4 · Bindings semánticos de colecciones y rutas.
 */
export const CONTENT_SCHEMA_VERSION = 4;

export interface NormalizeResult {
  config: SiteConfig;
  /** Versión con la que estaba guardado el proyecto. */
  from: number;
  to: number;
  /** Pasos aplicados, en orden. Se registra en el historial del proyecto. */
  applied: string[];
  /** Detalle de lo que se completó, para poder auditar la migración. */
  notes: string[];
}

/** Valores recomendados por la template para las secciones que declara. */
export interface TemplateMotionHints {
  style?: MotionConfig['style'];
  sections?: Record<string, SectionMotion>;
}

function allSectionIds(config: SiteConfig): string[] {
  const ids: string[] = [];
  for (const page of config.pages) {
    for (const section of page.sections) ids.push(section.id);
  }
  return ids;
}

/**
 * Completa un `SiteConfig` y lo lleva a la versión actual del contrato.
 *
 * `schemas` y `forms` provienen de la template registrada: el proyecto conserva
 * su contenido, pero la *forma* la manda siempre la template instalada, que es
 * lo que permite añadir campos nuevos sin romper proyectos antiguos.
 */
export function normalizeSiteConfig(
  config: SiteConfig,
  source: {
    collectionSchemas?: CollectionSchema[];
    forms?: FormSchema[];
    motion?: TemplateMotionHints;
    pages?: PageConfig[];
  } = {},
): NormalizeResult {
  const from = config.schemaVersion ?? 1;
  const applied: string[] = [];
  const notes: string[] = [];

  // Se trabaja sobre una copia: normalizar nunca muta el objeto recibido.
  const next: SiteConfig = { ...config };

  /* --- Contrato de rutas instalado por la template ----------------------- */

  if (source.pages?.length) {
    const existingIds = new Set(next.pages.map((page) => page.id));
    const existingRoutes = new Set(next.pages.map((page) => page.route));
    const missing = source.pages.filter((page) => !existingIds.has(page.id) && !existingRoutes.has(page.route));
    if (missing.length) {
      next.pages = [...next.pages, ...structuredClone(missing)];
      notes.push(`Rutas de template añadidas: ${missing.map((page) => page.route).join(', ')}.`);
    }
  }

  /* --- v2 · Esquemas de colección declarados por la template --------------- */

  const schemas = source.collectionSchemas ?? next.collectionSchemas ?? [];
  if (schemas.length > 0) {
    // La forma la manda la template instalada; el contenido, el proyecto.
    next.collectionSchemas = schemas;
    const reconciled = reconcileCollections(schemas, (next.collections ?? {}) as CollectionSet);
    next.collections = reconciled.collections;
    if (reconciled.added.length > 0) {
      notes.push(`Colecciones añadidas: ${reconciled.added.join(', ')}.`);
    }
    if (reconciled.filled.length > 0) {
      notes.push(`Campos nuevos completados en ${reconciled.filled.length} elemento(s).`);
    }
  } else {
    next.collectionSchemas = next.collectionSchemas ?? [];
    next.collections = next.collections ?? {};
  }

  /* --- v2 · Formularios abiertos ------------------------------------------ */

  if (source.forms && source.forms.length > 0) {
    const existing = next.forms ?? [];
    // Se conservan las personalizaciones del usuario (etiquetas, campos
    // desactivados, textos de confirmación) y solo se añaden los formularios
    // que la template declara y el proyecto todavía no tiene.
    const byKey = new Map(existing.map((form) => [form.key, form]));
    const merged: FormSchema[] = source.forms.map((declared) => {
      const saved = byKey.get(declared.key);
      if (!saved) return structuredClone(declared);
      const savedFields = new Map(saved.fields.map((f) => [f.name, f]));
      return {
        ...declared,
        ...saved,
        // Los campos nuevos de la template se incorporan; los ya guardados
        // mantienen la configuración que eligió el usuario.
        fields: declared.fields.map((f) => savedFields.get(f.name) ?? structuredClone(f)),
      };
    });
    // Un formulario creado a mano en el proyecto no se descarta.
    for (const saved of existing) {
      if (!merged.some((form) => form.key === saved.key)) merged.push(saved);
    }
    const addedForms = merged.length - existing.length;
    if (addedForms > 0) notes.push(`Formularios añadidos: ${addedForms}.`);
    next.forms = merged;
  } else {
    next.forms = next.forms ?? [];
  }

  /* --- v2 · Animaciones ---------------------------------------------------- */

  const hints = source.motion ?? {};
  const base = next.motion ?? motionFromStyle(hints.style ?? 'suave');
  next.motion = reconcileMotion(base, allSectionIds(next), hints.sections ?? {});
  if (!config.motion) notes.push('Configuración de animaciones inicializada.');

  if (from < 2) applied.push('contenido-v2-colecciones-formularios-animaciones');

  /* --- v3 · Contrato semántico de color ---------------------------------- */

  const previousOverrides = next.tokenOverrides ?? {};
  next.tokenOverrides = normalizeThemeTokenOverrides(previousOverrides);
  if (from < 3) {
    applied.push('tema-v3-colores-contextuales');
    if (Object.keys(next.tokenOverrides).length > Object.keys(previousOverrides).length) {
      notes.push('Ajustes de color antiguos vinculados a sus superficies semánticas.');
    }
  }

  /* --- v4 · Bindings semánticos ------------------------------------------ */

  // Un proyecto anterior no declara bindings: cada rol se resuelve a la
  // colección homónima y las rutas a las de siempre, así que nada cambia.
  if (!next.bindings) {
    next.bindings = defaultBindings(next.collections);
    if (Object.keys(next.bindings).length > 0) {
      notes.push(`Roles de colección deducidos: ${Object.keys(next.bindings).join(', ')}.`);
    }
  }
  next.routes = { ...DEFAULT_ROUTES, ...(next.routes ?? {}) };
  if (from < 4) applied.push('contenido-v4-bindings-semanticos');

  next.schemaVersion = CONTENT_SCHEMA_VERSION;

  return { config: next, from, to: CONTENT_SCHEMA_VERSION, applied, notes };
}

/** `true` cuando el proyecto está guardado con una versión anterior. */
export function needsMigration(config: SiteConfig): boolean {
  return (config.schemaVersion ?? 1) < CONTENT_SCHEMA_VERSION;
}
