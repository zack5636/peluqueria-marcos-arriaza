import { useCallback, useEffect, useMemo, useState } from 'react';
import { config } from '../config';
import {
  DEFAULT_THEME_ID,
  PREVIEW_PARAM,
  THEMES,
  clearRequests,
  readRequests,
  readTheme,
  resetTheme,
  subscribeRequests,
  subscribeTheme,
  themeById,
  writeTheme,
  type DemoRequest,
} from './store';
import './admin.css';

type Device = 'escritorio' | 'tablet' | 'movil';

const DEVICES: { id: Device; label: string; width: number; icon: string }[] = [
  { id: 'escritorio', label: 'Escritorio', width: 1280, icon: '🖥️' },
  { id: 'tablet', label: 'Tablet', width: 820, icon: '📐' },
  { id: 'movil', label: 'Móvil', width: 390, icon: '📱' },
];

/** Solo las páginas de contenido: los textos legales no aportan nada al escaparate. */
const PREVIEW_ROUTES = config.pages
  .filter((page) => !['/aviso-legal', '/privacidad', '/cookies'].includes(page.route))
  .map((page) => ({ route: page.route, name: page.name }));

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function AdminPanel() {
  const [applied, setApplied] = useState(readTheme);
  const [selected, setSelected] = useState(readTheme);
  const [device, setDevice] = useState<Device>('escritorio');
  const [route, setRoute] = useState('/');
  const [toast, setToast] = useState<string | null>(null);
  const [requests, setRequests] = useState<DemoRequest[]>(readRequests);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => subscribeTheme((id) => setApplied(id)), []);
  useEffect(() => subscribeRequests(() => setRequests(readRequests())), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const previewSrc = useMemo(
    () => `${route}?${PREVIEW_PARAM}=${encodeURIComponent(selected)}`,
    [route, selected],
  );

  const dirty = selected !== applied;
  const activeTheme = themeById(applied);
  const deviceWidth = DEVICES.find((item) => item.id === device)?.width ?? 1280;

  const apply = useCallback(() => {
    writeTheme(selected);
    setApplied(selected);
    setToast(`Tema aplicado: ${themeById(selected).name}. La web pública ya se ve así.`);
  }, [selected]);

  const restore = useCallback(() => {
    resetTheme();
    setApplied(DEFAULT_THEME_ID);
    setSelected(DEFAULT_THEME_ID);
    setToast('Tema restablecido al original de la plantilla.');
  }, []);

  const sectionCount = useMemo(
    () => config.pages.reduce((total, page) => total + page.sections.filter((section) => section.enabled).length, 0),
    [],
  );

  return (
    <div className="pa" data-theme-preview={selected}>
      <div className="pa__aurora" aria-hidden="true">
        <span className="pa__blob pa__blob--1" />
        <span className="pa__blob pa__blob--2" />
        <span className="pa__blob pa__blob--3" />
      </div>

      <header className="pa__top">
        <div className="pa__brand">
          <span className="pa__mark" aria-hidden="true">
            <span className="pa__paw">🐾</span>
          </span>
          <span className="pa__brandText">
            <strong>{config.business.name}</strong>
            <small>Panel de administración · demo</small>
          </span>
        </div>

        <div className="pa__topActions">
          <span className="pa__pill" title="Tema aplicado ahora mismo en la web pública">
            <span className="pa__pillDot" style={{ background: activeTheme.swatches[0] }} />
            {activeTheme.name}
          </span>
          <a className="pa__btn pa__btn--ghost" href="/">
            Ver la web ↗
          </a>
        </div>
      </header>

      <main className="pa__main">
        <section className="pa__panel pa__panel--themes" aria-labelledby="pa-temas">
          <div className="pa__panelHead">
            <div>
              <h1 id="pa-temas" className="pa__title">
                Temas de la plantilla
              </h1>
              <p className="pa__lead">
                La plantilla trae tres lecturas de color. Elige una para verla al instante en la vista previa
                y pulsa <strong>Aplicar</strong> para que sea la que ve cualquier visitante.
              </p>
            </div>
            <span className="pa__count">{THEMES.length} temas</span>
          </div>

          <ul className="pa__themes">
            {THEMES.map((theme, index) => {
              const isSelected = theme.id === selected;
              const isApplied = theme.id === applied;
              return (
                <li key={theme.id}>
                  <button
                    type="button"
                    className={`pa__theme${isSelected ? ' is-selected' : ''}`}
                    style={{ '--pa-theme-accent': theme.swatches[0], animationDelay: `${index * 90}ms` } as React.CSSProperties}
                    onClick={() => setSelected(theme.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="pa__swatches" aria-hidden="true">
                      {theme.swatches.map((color) => (
                        <span key={color} className="pa__swatch" style={{ background: color }} />
                      ))}
                    </span>
                    <span className="pa__themeBody">
                      <span className="pa__themeName">
                        {theme.name}
                        {isApplied ? <span className="pa__badge">En uso</span> : null}
                      </span>
                      <span className="pa__themeDesc">{theme.description}</span>
                      <code className="pa__themeId">{theme.id}</code>
                    </span>
                    <span className="pa__check" aria-hidden="true">
                      ✓
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="pa__apply">
            <button type="button" className="pa__btn pa__btn--primary" onClick={apply} disabled={!dirty}>
              {dirty ? 'Aplicar a la web' : 'Tema aplicado'}
            </button>
            <button type="button" className="pa__btn pa__btn--ghost" onClick={restore} disabled={applied === DEFAULT_THEME_ID}>
              Restablecer original
            </button>
            <p className="pa__hint">
              El tema se guarda en este navegador. Los textos, precios e imágenes no cambian: es la misma web
              con otra piel.
            </p>
          </div>
        </section>

        <section className="pa__panel pa__panel--preview" aria-labelledby="pa-preview">
          <div className="pa__panelHead">
            <h2 id="pa-preview" className="pa__title pa__title--sm">
              Vista previa en vivo
            </h2>
            <div className="pa__devices" role="group" aria-label="Tamaño de pantalla">
              {DEVICES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`pa__device${device === item.id ? ' is-active' : ''}`}
                  onClick={() => setDevice(item.id)}
                  aria-pressed={device === item.id}
                >
                  <span aria-hidden="true">{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pa__routes" role="group" aria-label="Página que se previsualiza">
            {PREVIEW_ROUTES.map((page) => (
              <button
                key={page.route}
                type="button"
                className={`pa__route${route === page.route ? ' is-active' : ''}`}
                onClick={() => setRoute(page.route)}
                aria-pressed={route === page.route}
              >
                {page.name}
              </button>
            ))}
            <button type="button" className="pa__route pa__route--reload" onClick={() => setReloadKey((value) => value + 1)}>
              ↻ Recargar
            </button>
          </div>

          <div className="pa__stage" data-device={device}>
            <div className="pa__frame" style={{ width: deviceWidth, ['--pa-frame-width' as string]: `${deviceWidth}px` }}>
              <div className="pa__frameBar" aria-hidden="true">
                <span /> <span /> <span />
                <em>peludosandco.es{route === '/' ? '' : route}</em>
              </div>
              <iframe
                key={`${previewSrc}-${reloadKey}`}
                className="pa__iframe"
                src={previewSrc}
                title={`Vista previa de ${themeById(selected).name}`}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="pa__panel pa__panel--data" aria-labelledby="pa-datos">
          <div className="pa__panelHead">
            <h2 id="pa-datos" className="pa__title pa__title--sm">
              Contenido de la web
            </h2>
          </div>
          <ul className="pa__stats">
            <li>
              <strong>{config.pages.length}</strong>
              <span>páginas</span>
            </li>
            <li>
              <strong>{sectionCount}</strong>
              <span>secciones activas</span>
            </li>
            <li>
              <strong>{config.services?.length ?? 0}</strong>
              <span>servicios</span>
            </li>
            <li>
              <strong>{config.packages?.length ?? 0}</strong>
              <span>paquetes</span>
            </li>
          </ul>
          <p className="pa__hint">
            Los textos, precios e imágenes viven en <code>src/config.ts</code>. Este panel solo decide el
            aspecto; para cambiar el contenido se edita ese archivo.
          </p>
        </section>

        <section className="pa__panel pa__panel--requests" aria-labelledby="pa-solicitudes">
          <div className="pa__panelHead">
            <h2 id="pa-solicitudes" className="pa__title pa__title--sm">
              Solicitudes de reserva
            </h2>
            <button type="button" className="pa__btn pa__btn--ghost pa__btn--sm" onClick={clearRequests} disabled={requests.length === 0}>
              Vaciar
            </button>
          </div>
          <p className="pa__hint pa__hint--warn">
            Esta demo no tiene servidor: las reservas que se envían desde la web se guardan solo en este
            navegador, para poder enseñar el circuito completo a un cliente.
          </p>
          {requests.length === 0 ? (
            <p className="pa__empty">Todavía no se ha enviado ninguna solicitud desde la web.</p>
          ) : (
            <ul className="pa__requests">
              {requests.map((request) => (
                <li key={request.id}>
                  <span className="pa__reqRef">{request.reference}</span>
                  <span className="pa__reqName">
                    {request.values.ownerName || 'Sin nombre'}
                    {request.values.petName ? ` · ${request.values.petName}` : ''}
                  </span>
                  <span className="pa__reqMeta">
                    {[request.values.service, request.values.date, request.values.time].filter(Boolean).join(' · ') || 'Sin detalle'}
                  </span>
                  <span className="pa__reqDate">{formatDate(request.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <div className={`pa__toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
