/*
 * Cliente de ManageOS para una web de cliente.
 *
 * Deliberadamente genérico: no sabe nada de peluquerías caninas ni de esta
 * plantilla. Habla el contrato público de ManageOS —el mismo que usa cualquier
 * otra web conectada— y por eso vale tal cual para el siguiente sitio que
 * hagamos. Lo único propio de cada negocio vive en su manifiesto y en lo que su
 * dueño configure dentro de Manager.
 *
 * La web nunca lleva credenciales dentro. Se identifica por su **origen**: pide
 * un saludo a la API y esta le devuelve la clave pública que corresponde al
 * dominio desde el que se está sirviendo. Un dominio que el negocio no haya
 * conectado no recibe nada, y una clave copiada a otro sitio tampoco sirve
 * porque el servidor comprueba el origen en cada llamada.
 */

/**
 * Un tamaño de un servicio, con su propio precio y su propia duración.
 *
 * Manager los da ya resueltos junto al catálogo: esta web no calcula nada, solo
 * enseña lo que el negocio configuró y manda el elegido tal cual al reservar.
 */
export interface TamanoDeServicio {
  id: string;
  label: string;
  priceMinor: number;
  currency: string;
  durationMinutes: number;
  displayOrder: number;
}

export interface ServicioPublico {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceMinor: number | null;
  currency: string | null;
  priceMode: 'fixed' | 'from' | 'on_request';
  displayOrder: number;
  /** Vacío cuando el servicio no ofrece tamaños: se reserva con su precio y duración de siempre. */
  sizeTiers: TamanoDeServicio[];
}

export interface CampoDeReserva {
  key: string;
  label: string;
  type: 'text' | 'long_text' | 'phone' | 'email' | 'number' | 'date' | 'boolean' | 'selection';
  required: boolean;
  target: 'customer.firstName' | 'customer.lastName' | 'customer.email' | 'customer.phone' | 'detail';
  options: string[];
  help: string | null;
  displayOrder: number;
}

export interface EstadoDelNegocio {
  business: {
    name: string;
    timezone: string;
    locale: string;
    contactEmail: string | null;
    contactPhone: string | null;
    address: unknown;
  };
  booking: {
    mode: string;
    horizonDays: number;
    minimumLeadMinutes: number;
    slotMinutes: number;
    fields: CampoDeReserva[];
  };
  hours: { isoWeekday: number; startLocal: string; endLocal: string }[];
  closures: { kind: string; startsAt: string; endsAt: string }[];
  services: ServicioPublico[];
  workers: { id: string; displayName: string; serviceIds: string[] }[];
  computedAt: string;
}

export interface HuecoDelDia {
  startsAt: string;
  endsAt: string;
  available: boolean;
  workerIds: string[];
}

export interface DiaDePanorama {
  date: string;
  /** Falso cuando el negocio no abre ese día: no hay ni rejilla que ofrecer. */
  open: boolean;
  slots: HuecoDelDia[];
}

export interface RespuestaDeReserva {
  booking: {
    id: string;
    status: string;
    startsAt: string;
    serviceEndsAt: string;
    service: { id: string; name: string };
    manageToken?: string;
  };
}

export class ErrorDeManageOS extends Error {
  constructor(readonly code: string, mensaje: string, readonly status: number) {
    super(mensaje);
    this.name = 'ErrorDeManageOS';
  }
}

/**
 * A qué API se habla.
 *
 * En desarrollo se apunta a la API local con `VITE_MANAGEOS_API_URL`. Sin nada
 * configurado se asume la de producción, que es lo correcto para una web
 * desplegada: el negocio no tiene que tocar variables de entorno para que su
 * web funcione.
 */
const API = (import.meta.env.VITE_MANAGEOS_API_URL as string | undefined)?.replace(/\/$/, '')
  ?? 'https://api.manageos.xyz';

/**
 * Clave del sitio, si alguien la fija a mano.
 *
 * Es la salida de emergencia para previsualizar una web antes de que su dominio
 * definitivo exista. El camino normal es el saludo por origen, que es el que
 * funcionará en producción sin configurar nada.
 */
const CLAVE_FIJADA = import.meta.env.VITE_MANAGEOS_SITE_KEY as string | undefined;

let clavePrometida: Promise<string | null> | null = null;

async function leerError(respuesta: Response): Promise<never> {
  const cuerpo = await respuesta.json().catch(() => null) as
    { error?: { code?: string; message?: string } } | null;
  throw new ErrorDeManageOS(
    cuerpo?.error?.code ?? 'REQUEST_FAILED',
    cuerpo?.error?.message ?? 'No hemos podido conectar con la agenda.',
    respuesta.status,
  );
}

/**
 * La clave pública de esta web, preguntándosela a la API.
 *
 * Se pide una sola vez por carga: no cambia mientras la pestaña está abierta y
 * repetirla en cada llamada añadiría un viaje de red a todo.
 */
export function claveDelSitio(): Promise<string | null> {
  if (CLAVE_FIJADA) return Promise.resolve(CLAVE_FIJADA);
  clavePrometida ??= fetch(`${API}/public/v1/handshake`, { cache: 'no-store' })
    .then(async (respuesta) => {
      if (!respuesta.ok) return null;
      const cuerpo = await respuesta.json() as { siteKey?: string };
      return cuerpo.siteKey ?? null;
    })
    .catch(() => null);
  return clavePrometida;
}

async function pedir<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  const clave = await claveDelSitio();
  if (!clave) throw new ErrorDeManageOS('SITE_NOT_CONNECTED', 'Esta web todavía no está conectada a ManageOS.', 404);
  const respuesta = await fetch(`${API}${ruta}`, {
    ...init,
    /*
     * Nada de esto se cachea. El catálogo y los precios cambian desde Manager y
     * la disponibilidad caduca en cuanto alguien reserva; una copia vieja
     * enseñaría un precio que ya no es o una hora que ya no está.
     */
    cache: 'no-store',
    headers: {
      'x-manager-site': clave,
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!respuesta.ok) await leerError(respuesta);
  return respuesta.json() as Promise<T>;
}

/** Todo lo público del negocio, tal como está ahora mismo en Manager. */
export function estadoDelNegocio(): Promise<EstadoDelNegocio> {
  return pedir<EstadoDelNegocio>('/public/v1/site');
}

/**
 * La rejilla de huecos de un servicio entre dos fechas.
 *
 * Devuelve **todos** los huecos con una marca por cada uno, no solo los libres:
 * enseñar una hora tachada dice más que hacerla desaparecer, y es lo que permite
 * que se note que el sitio está lleno a esa hora y no que no se trabaja.
 */
export function panoramaDeHuecos(serviceId: string, desde: string, hasta: string, sizeId?: string): Promise<{
  timezone: string; days: DiaDePanorama[];
}> {
  const parametros = new URLSearchParams({ serviceId, from: desde, to: hasta, ...(sizeId ? { sizeId } : {}) });
  return pedir(`/public/v1/availability/overview?${parametros}`);
}

export interface DatosDeReserva {
  serviceId: string;
  /** El tamaño elegido, cuando el servicio los ofrece. */
  sizeId?: string;
  startsAt: string;
  customer: { firstName: string; lastName?: string; email?: string; phone?: string };
  details: { key: string; label: string; value: string }[];
  workerId?: string;
}

/**
 * Crea la reserva.
 *
 * La clave de idempotencia la pone la web: si alguien pulsa dos veces o la red
 * reintenta, se crea una cita y no dos. El servidor vuelve a validar el hueco
 * aunque la pantalla lo diera por libre, así que dos personas no pueden quedarse
 * con el mismo.
 */
export function crearReserva(datos: DatosDeReserva, idempotencia: string): Promise<RespuestaDeReserva> {
  return pedir<RespuestaDeReserva>('/public/v1/bookings', {
    method: 'POST',
    headers: { 'idempotency-key': idempotencia },
    body: JSON.stringify(datos),
  });
}

/**
 * El exponente real de una moneda.
 *
 * Casi todas usan 2 decimales (cien céntimos), pero el peso chileno y el
 * guaraní paraguayo no tienen fracción: cobran en unidades enteras. Dividir
 * entre 100 ahí convertiría un precio de 1.000 en 10,00 — el mismo motivo por
 * el que Manager guarda el precio como entero y no como número con coma.
 */
function exponenteDeMoneda(currency: string): number {
  return currency === 'CLP' || currency === 'PYG' ? 0 : 2;
}

/** Precio tal como se enseña, respetando lo que el negocio decidió en Manager. */
export function precioLegible(servicio: ServicioPublico, locale = 'es-ES'): string | null {
  if (servicio.priceMode === 'on_request' || servicio.priceMinor === null) return null;
  const moneda = servicio.currency ?? 'EUR';
  const importe = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moneda,
  }).format(servicio.priceMinor / 10 ** exponenteDeMoneda(moneda));
  return servicio.priceMode === 'from' ? `Desde ${importe}` : importe;
}

/** El precio de un tamaño, siempre fijo: a diferencia del servicio, un tamaño no tiene modo "a consultar" ni "desde". */
export function precioLegibleTamano(tamano: TamanoDeServicio, locale = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: tamano.currency,
  }).format(tamano.priceMinor / 10 ** exponenteDeMoneda(tamano.currency));
}
