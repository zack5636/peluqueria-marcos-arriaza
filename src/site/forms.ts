/**
 * Formularios declarados por la template.
 *
 * `BookingConfig` resolvía un único caso —pedir cita en una peluquería canina—
 * con una lista cerrada de campos. Los cuatro nichos nuevos necesitan
 * formularios distintos (identificar una plaga, configurar un proyecto de
 * carpintería, solicitar una primera consulta, reservar fisioterapia frente a
 * apuntarse a una clase), así que el nombre del campo pasa a ser abierto y el
 * formulario se declara como dato.
 *
 * La infraestructura —validación, estados de carga, confirmación, error y
 * protección contra envíos duplicados— es común a todos: cambia la declaración,
 * no el componente.
 */

export type FormFieldType =
  | 'text'
  | 'tel'
  | 'email'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'number'
  | 'consent';

export interface FormFieldSchema {
  /** Clave abierta; identifica el valor enviado. */
  name: string;
  label: string;
  type: FormFieldType;
  /** `1` aparece en el formulario visible; `2` en el paso de detalle. */
  step: 1 | 2;
  required: boolean;
  enabled: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  /**
   * Toma las opciones de una colección de la template en lugar de una lista
   * fija: así «¿qué plaga quieres tratar?» sigue al catálogo que edita el
   * usuario y ningún nombre queda escrito en el componente.
   */
  /** `$id` usa el identificador estable del elemento como valor interno. */
  optionsFrom?: { collection: string; labelField: string; valueField?: string | '$id' };
  rows?: number;
  min?: number;
  max?: number;
  /** Anchura en la rejilla del formulario. */
  width?: 'full' | 'half' | 'third';
}

export type FormMode = 'pending-request' | 'direct-confirmed' | 'whatsapp-assisted';

export interface FormSchema {
  /** Clave estable, p. ej. `solicitar-inspeccion`. */
  key: string;
  /** Etiqueta usada en el Admin y en las solicitudes recibidas. */
  name: string;
  title: string;
  description: string;
  fields: FormFieldSchema[];
  mode: FormMode;
  submitLabel: string;
  /** Cuando `direct-confirmed` no tiene agenda conectada, se degrada y se avisa. */
  scheduleConnected: boolean;
  confirmationTitle: string;
  confirmationMessage: string;
  privacyText: string;
  whatsappTemplate: string;
  /** Ventana en ms que bloquea un reenvío idéntico. */
  duplicateWindowMs: number;
}

export type FormValues = Record<string, string>;

export function getForm(forms: FormSchema[], key: string): FormSchema | undefined {
  return forms.find((form) => form.key === key);
}

export function visibleFields(form: FormSchema, step: 1 | 2): FormFieldSchema[] {
  return form.fields.filter((f) => f.enabled && f.step === step);
}

export function enabledFields(form: FormSchema): FormFieldSchema[] {
  return form.fields.filter((f) => f.enabled);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Teléfono español o internacional en formato laxo pero comprobable. */
const PHONE_RE = /^\+?[0-9\s().-]{9,20}$/;

/** Mensaje de error por campo, o cadena vacía si el valor es válido. */
export function validateField(schema: FormFieldSchema, raw: string | undefined): string {
  const value = (raw ?? '').trim();

  if (schema.type === 'consent') {
    if (schema.required && value !== 'true') return 'Debes aceptar para continuar.';
    return '';
  }
  if (!value) {
    return schema.required ? 'Este campo es obligatorio.' : '';
  }
  switch (schema.type) {
    case 'email':
      return EMAIL_RE.test(value) ? '' : 'Introduce un correo electrónico válido.';
    case 'tel':
      return PHONE_RE.test(value) ? '' : 'Introduce un teléfono válido.';
    case 'number': {
      const n = Number(value);
      if (Number.isNaN(n)) return 'Introduce un número.';
      if (schema.min !== undefined && n < schema.min) return `El mínimo es ${schema.min}.`;
      if (schema.max !== undefined && n > schema.max) return `El máximo es ${schema.max}.`;
      return '';
    }
    case 'date': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Introduce una fecha válida.';
      return '';
    }
    default:
      return '';
  }
}

export function validateForm(form: FormSchema, values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const schema of enabledFields(form)) {
    const message = validateField(schema, values[schema.name]);
    if (message) errors[schema.name] = message;
  }
  return errors;
}

/**
 * Huella de un envío. Dos envíos con los mismos valores dentro de la ventana
 * declarada se consideran duplicados y el segundo no se acepta.
 */
export function submissionFingerprint(form: FormSchema, values: FormValues): string {
  const parts = enabledFields(form)
    .map((f) => `${f.name}=${(values[f.name] ?? '').trim().toLowerCase()}`)
    .sort();
  return `${form.key}|${parts.join('&')}`;
}

/** Sustituye `{campo}` por el valor enviado; útil para la plantilla de WhatsApp. */
export function renderTemplate(template: string, values: FormValues): string {
  return template.replace(/\{(\w[\w-]*)\}/g, (match, key: string) => values[key] ?? match);
}
