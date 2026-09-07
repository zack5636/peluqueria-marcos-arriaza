import { StrictMode, useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SiteRenderer } from './site/SiteRenderer';
import type { BookingFieldName, BookingRequest } from './site/types';
import { config } from './config';
import { AdminPanel } from './admin/AdminPanel';
import {
  ADMIN_ROUTE,
  PREVIEW_PARAM,
  isKnownTheme,
  readTheme,
  saveDemoRequest,
  subscribeTheme,
} from './admin/store';

/**
 * Punto de entrada de la web.
 *
 * Dos vistas sobre el mismo contenido: la web pública en `/…` y el panel de
 * administración en `/admin`. El panel no está enlazado desde la web, así que
 * un visitante nunca tropieza con él, pero tampoco es un secreto: es una demo.
 */

function currentPath(): string {
  return window.location.pathname || '/';
}

/** Tema que pide la vista previa del panel (`?tema=…`), sin llegar a aplicarlo. */
function previewTheme(): string | null {
  const requested = new URLSearchParams(window.location.search).get(PREVIEW_PARAM);
  return isKnownTheme(requested) ? requested : null;
}

/**
 * Guarda la solicitud de reserva en este navegador y devuelve un resguardo.
 *
 * Es lo que permite enseñar el formulario completo sin montar un backend. El
 * panel etiqueta estas solicitudes como locales, de modo que nadie confunda la
 * demo con un sistema de reservas en producción.
 */
async function submitDemoBooking(
  values: Partial<Record<BookingFieldName, string>>,
): Promise<BookingRequest> {
  // Un respiro corto: sin él, el formulario responde tan rápido que parece que no ha hecho nada.
  await new Promise((resolve) => window.setTimeout(resolve, 420));
  const request = saveDemoRequest(values as Record<string, string>);
  return { ...request, values };
}

function App() {
  const [path, setPath] = useState(currentPath);
  const [themeId, setThemeId] = useState(() => previewTheme() ?? readTheme());
  const locked = useMemo(() => previewTheme() !== null, []);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // En la vista previa manda el parámetro de la URL; en la web pública, lo que
  // el panel haya dejado guardado (incluso si se cambia desde otra pestaña).
  useEffect(() => {
    if (locked) return;
    return subscribeTheme((id) => setThemeId(id));
  }, [locked]);

  const navigate = useCallback((next: string) => {
    // La vista previa conserva `?tema=…` al navegar: si no, el primer clic
    // dentro del iframe volvería al tema aplicado y la comparación se rompería.
    const preview = previewTheme();
    const target = preview ? `${next}${next.includes('?') ? '&' : '?'}${PREVIEW_PARAM}=${preview}` : next;
    window.history.pushState(null, '', target);
    setPath(next.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const siteConfig = useMemo(
    () => ({ ...config, meta: { ...config.meta, themeId } }),
    [themeId],
  );

  if (path === ADMIN_ROUTE || path.startsWith(`${ADMIN_ROUTE}/`)) {
    return <AdminPanel />;
  }

  return (
    <SiteRenderer
      config={siteConfig}
      options={{
        previewMode: false,
        route: path,
        onNavigate: navigate,
        onSubmitBookingRequest: submitDemoBooking,
      }}
    />
  );
}

const node = document.getElementById('root');
if (!node) throw new Error('Falta el contenedor #root en index.html');
createRoot(node).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
