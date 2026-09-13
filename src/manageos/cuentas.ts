import { claveDelSitio, ErrorDeManageOS } from './cliente';

const API = (import.meta.env.VITE_MANAGEOS_API_URL as string | undefined)?.replace(/\/$/, '')
  ?? 'https://api.manageos.xyz';

const TOKEN_KEY = 'manageos_customer_token';

export interface CuentaCliente {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface DetalleCita {
  key: string;
  label: string;
  value: string;
}

export interface CitaCliente {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  startsAt: string;
  serviceEndsAt: string;
  serviceName: string;
  workerName: string | null;
  subjectName: string | null;
  priceMinor: number | null;
  currency: string | null;
  sizeLabel: string | null;
  details?: DetalleCita[];
  manageToken: string | null;
  createdAt: string;
}

export function obtenerTokenGuardado(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function guardarToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function borrarToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

async function pedirCuenta<T>(ruta: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const clave = await claveDelSitio();
  if (!clave) throw new ErrorDeManageOS('SITE_NOT_CONNECTED', 'Esta web todavía no está conectada a ManageOS.', 404);
  const respuesta = await fetch(`${API}${ruta}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'x-manager-site': clave,
      ...(token ? { 'authorization': `Bearer ${token}` } : {}),
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null) as { error?: { code?: string; message?: string } } | null;
    throw new ErrorDeManageOS(
      cuerpo?.error?.code ?? 'REQUEST_FAILED',
      cuerpo?.error?.message ?? 'No hemos podido completar la operación.',
      respuesta.status,
    );
  }
  return respuesta.json() as Promise<T>;
}

export async function registrarCliente(datos: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ token: string; customer: CuentaCliente }> {
  const respuesta = await pedirCuenta<{ token: string; customer: CuentaCliente }>(
    '/public/v1/account/register',
    {
      method: 'POST',
      body: JSON.stringify(datos),
    },
  );
  guardarToken(respuesta.token);
  return respuesta;
}

export async function iniciarSesionCliente(datos: {
  email: string;
  password: string;
}): Promise<{ token: string; customer: CuentaCliente }> {
  const respuesta = await pedirCuenta<{ token: string; customer: CuentaCliente }>(
    '/public/v1/account/login',
    {
      method: 'POST',
      body: JSON.stringify(datos),
    },
  );
  guardarToken(respuesta.token);
  return respuesta;
}

export async function obtenerPerfilCliente(token: string): Promise<CuentaCliente> {
  const respuesta = await pedirCuenta<{ customer: CuentaCliente }>(
    '/public/v1/account/me',
    {},
    token,
  );
  return respuesta.customer;
}

export async function cerrarSesionCliente(token?: string | null): Promise<void> {
  const activeToken = token ?? obtenerTokenGuardado();
  borrarToken();
  if (activeToken) {
    try {
      await pedirCuenta<{ success: boolean }>(
        '/public/v1/account/logout',
        { method: 'POST' },
        activeToken,
      );
    } catch {
      // Si falla la revocación remota no bloqueamos el logout local
    }
  }
}

export async function obtenerMisCitasCliente(token: string): Promise<CitaCliente[]> {
  const respuesta = await pedirCuenta<{ items: CitaCliente[] }>(
    '/public/v1/account/appointments',
    {},
    token,
  );
  return respuesta.items;
}
