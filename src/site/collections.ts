/**
 * Colecciones declaradas por la template.
 *
 * El sistema original fijaba las colecciones en el tipo `SiteConfig`
 * (`services`, `packages`, `team`…), lo que obligaba a escribir el vocabulario
 * de cada nicho dentro de los componentes. Con cuatro nichos nuevos eso deja de
 * ser viable: «tipos de plaga», «proyectos», «modalidades» o «bonos» son
 * colecciones distintas que el usuario debe poder editar, ampliar y reordenar.
 *
 * Una template declara aquí el *esquema* de sus colecciones y el Admin Panel
 * genera el editor a partir de él. Ningún componente contiene nombres de plagas,
 * de clases ni de tratamientos.
 *
 * Este módulo lo comparten el Admin Panel, la preview y los proyectos
 * exportados, por lo que no puede importar nada de `src/admin`, `src/data` ni de
 * Tauri.
 */

import type { ImageAsset } from './types';

export type CollectionFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'price'
  | 'boolean'
  | 'select'
  | 'list'
  | 'tags'
  | 'image'
  | 'icon'
  | 'link'
  | 'date'
  | 'time'
  /** Referencia a elementos de otra colección declarada. */
  | 'relation';

export interface CollectionFieldSchema {
  key: string;
  label: string;
  type: CollectionFieldType;
  /** Ayuda mostrada bajo el campo en el editor. */
  help?: string;
  required?: boolean;
  /** Valor por defecto al crear un elemento nuevo. */
  defaultValue?: CollectionValue;
  /** Opciones de un `select`. */
  options?: { value: string; label: string }[];
  /** Filas de un `textarea`. */
  rows?: number;
  min?: number;
  max?: number;
  /** Contrato del slot cuando el campo es una imagen. */
  asset?: { ratio: string; minWidth: number; minHeight: number };
  /**
   * Colección referenciada cuando el campo es `relation`. El valor guardado es
   * el `id` del elemento destino, nunca su título: renombrarlo no rompe nada.
   */
  relationTo?: { collection: string; labelField: string; multiple?: boolean };
}

export type CollectionValue = string | number | boolean | string[] | ImageAsset | null;

export interface CollectionItem {
  id: string;
  enabled: boolean;
  sortOrder: number;
  values: Record<string, CollectionValue>;
}

export interface CollectionSchema {
  /** Clave estable, p. ej. `tipos-de-plaga`. */
  key: string;
  singular: string;
  plural: string;
  description: string;
  /** Campo cuyo valor titula la tarjeta en el editor. */
  titleField: string;
  fields: CollectionFieldSchema[];
  /** Mínimo y máximo de elementos que la template admite. */
  min: number;
  max: number;
  /** Una colección de sistema no se puede eliminar entera desde el Admin. */
  system?: boolean;
  /** Ruta de detalle por elemento, p. ej. `/plagas/{slug}`. */
  detailRoute?: string;
}

export type CollectionSet = Record<string, CollectionItem[]>;

/** Campo de texto obligatorio: el atajo más frecuente al declarar un esquema. */
export function textField(
  key: string,
  label: string,
  extra: Partial<CollectionFieldSchema> = {},
): CollectionFieldSchema {
  return { key, label, type: 'text', required: true, defaultValue: '', ...extra };
}

export function field(
  key: string,
  label: string,
  type: CollectionFieldType,
  extra: Partial<CollectionFieldSchema> = {},
): CollectionFieldSchema {
  return { key, label, type, ...extra };
}

/** Valor inicial coherente con el tipo declarado. */
export function emptyValue(schema: CollectionFieldSchema): CollectionValue {
  if (schema.defaultValue !== undefined) return schema.defaultValue;
  switch (schema.type) {
    case 'number':
    case 'price':
      return null;
    case 'boolean':
      return false;
    case 'list':
    case 'tags':
      return [];
    case 'relation':
      return schema.relationTo?.multiple ? [] : '';
    case 'image':
    case 'icon':
      return null;
    case 'select':
      return schema.options?.[0]?.value ?? '';
    default:
      return '';
  }
}

/** Crea un elemento nuevo con todos los campos del esquema inicializados. */
export function createItem(
  schema: CollectionSchema,
  sortOrder: number,
  seed: Record<string, CollectionValue> = {},
  id = `${schema.key}-${Math.random().toString(36).slice(2, 10)}`,
): CollectionItem {
  const values: Record<string, CollectionValue> = {};
  for (const f of schema.fields) values[f.key] = seed[f.key] ?? emptyValue(f);
  return { id, enabled: true, sortOrder, values };
}

/**
 * Elemento de demo. Se diferencia de `createItem` en que exige la semilla
 * completa, de modo que una template no pueda publicar contenido a medias.
 */
export function demoItem(
  id: string,
  sortOrder: number,
  values: Record<string, CollectionValue>,
): CollectionItem {
  return { id, enabled: true, sortOrder, values };
}

/**
 * Copia de un elemento con identificador nuevo.
 *
 * El `id` es lo que referencian rutas, recursos visuales y relaciones, así que
 * una copia nunca puede heredarlo. El resto de valores se clonan en profundidad.
 */
export function duplicateItem(
  schema: CollectionSchema,
  item: CollectionItem,
  sortOrder: number,
  id = `${schema.key}-${Math.random().toString(36).slice(2, 10)}`,
): CollectionItem {
  const values = structuredClone(item.values);
  const title = values[schema.titleField];
  if (typeof title === 'string') values[schema.titleField] = `${title} (copia)`;
  // El identificador de URL también debe ser único si el esquema lo declara.
  if ('slug' in values && typeof values.slug === 'string' && values.slug) {
    values.slug = `${values.slug}-copia`;
  }
  return { id, enabled: item.enabled, sortOrder, values };
}

/** Reescribe `sortOrder` como 1..n respetando el orden actual. */
export function normalizeOrder(items: CollectionItem[]): CollectionItem[] {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => (item.sortOrder === index + 1 ? item : { ...item, sortOrder: index + 1 }));
}

/** Mueve un elemento una posición y renumera el resto. */
export function moveItem(items: CollectionItem[], id: string, direction: -1 | 1): CollectionItem[] {
  const ordered = normalizeOrder(items);
  const index = ordered.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= ordered.length) return ordered;
  const next = [...ordered];
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((item, i) => ({ ...item, sortOrder: i + 1 }));
}

export function getCollection(collections: CollectionSet, key: string): CollectionItem[] {
  return collections[key] ?? [];
}

/** Elementos activos en orden de render. Es lo que consume la web pública. */
export function activeItems(collections: CollectionSet, key: string): CollectionItem[] {
  return getCollection(collections, key)
    .filter((item) => item.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function itemText(item: CollectionItem, key: string, fallback = ''): string {
  const value = item.values[key];
  return typeof value === 'string' && value ? value : fallback;
}

export function itemNumber(item: CollectionItem, key: string): number | null {
  const value = item.values[key];
  return typeof value === 'number' ? value : null;
}

export function itemList(item: CollectionItem, key: string): string[] {
  const value = item.values[key];
  return Array.isArray(value) ? value : [];
}

export function itemBool(item: CollectionItem, key: string): boolean {
  return item.values[key] === true;
}

export function itemImage(item: CollectionItem, key: string): ImageAsset | null {
  const value = item.values[key];
  if (value && typeof value === 'object' && !Array.isArray(value) && 'src' in value) {
    return value as ImageAsset;
  }
  return null;
}

/** Título mostrado en el editor y en los listados del Admin. */
export function itemTitle(schema: CollectionSchema, item: CollectionItem): string {
  return itemText(item, schema.titleField, `${schema.singular} sin título`);
}

/**
 * Todos los slots de imagen que una colección publica, con su contrato.
 * Recursos visuales los necesita para mostrar los huecos aunque estén vacíos.
 */
export function collectionAssetSlots(
  schema: CollectionSchema,
): { key: string; label: string; ratio: string; minWidth: number; minHeight: number }[] {
  return schema.fields
    .filter((f) => (f.type === 'image' || f.type === 'icon') && f.asset)
    .map((f) => ({
      key: `${schema.key}.${f.key}`,
      label: `${schema.singular} · ${f.label}`,
      ratio: f.asset!.ratio,
      minWidth: f.asset!.minWidth,
      minHeight: f.asset!.minHeight,
    }));
}

export interface CollectionIssue {
  collection: string;
  itemId: string | null;
  field: string | null;
  message: string;
}

/** Valida un conjunto de colecciones contra sus esquemas. */
export function validateCollections(
  schemas: CollectionSchema[],
  collections: CollectionSet,
): CollectionIssue[] {
  const issues: CollectionIssue[] = [];
  for (const schema of schemas) {
    const items = getCollection(collections, schema.key);
    if (items.length < schema.min) {
      issues.push({
        collection: schema.key,
        itemId: null,
        field: null,
        message: `${schema.plural} necesita al menos ${schema.min} elemento(s); hay ${items.length}.`,
      });
    }
    if (items.length > schema.max) {
      issues.push({
        collection: schema.key,
        itemId: null,
        field: null,
        message: `${schema.plural} admite como máximo ${schema.max} elemento(s); hay ${items.length}.`,
      });
    }
    for (const item of items) {
      for (const f of schema.fields) {
        if (!f.required) continue;
        const value = item.values[f.key];
        const empty =
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (empty) {
          issues.push({
            collection: schema.key,
            itemId: item.id,
            field: f.key,
            message: `«${f.label}» es obligatorio en ${schema.singular.toLowerCase()} «${itemTitle(schema, item)}».`,
          });
        }
      }
    }
  }
  return issues;
}

/**
 * Rellena las colecciones que el esquema declara pero el proyecto no tiene, y
 * completa los campos añadidos en versiones posteriores de la template. Es lo
 * que permite abrir un proyecto antiguo sin recrearlo ni duplicar datos.
 */
export function reconcileCollections(
  schemas: CollectionSchema[],
  collections: CollectionSet,
): { collections: CollectionSet; added: string[]; filled: string[] } {
  const next: CollectionSet = { ...collections };
  const added: string[] = [];
  const filled: string[] = [];

  for (const schema of schemas) {
    const existing = next[schema.key];
    if (!existing) {
      next[schema.key] = [];
      added.push(schema.key);
      continue;
    }
    next[schema.key] = existing.map((item) => {
      let changed = false;
      const values = { ...item.values };
      for (const f of schema.fields) {
        if (!(f.key in values)) {
          values[f.key] = emptyValue(f);
          changed = true;
        }
      }
      if (changed) filled.push(`${schema.key}.${item.id}`);
      return changed ? { ...item, values } : item;
    });
  }

  return { collections: next, added, filled };
}
