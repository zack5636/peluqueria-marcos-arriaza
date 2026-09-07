import { useEffect, useMemo, useState } from 'react';
import { useSite } from './context';
import type { NavItem } from './types';

function normalizeRoute(route: string): string {
  return route.split('?')[0].replace(/\/+$/, '') || '/';
}

/**
 * Marca el enlace activo del header.
 *
 * Combina las dos formas de navegación de las templates: los enlaces de ancla,
 * que solo existen en la portada, y los enlaces de ruta, que deben marcarse por
 * la URL. Antes solo se observaban anclas, así que en `/servicios`, `/galeria` o
 * cualquier página secundaria ningún elemento del menú quedaba activo, y en la
 * portada tampoco lo estaba hasta desplazarse.
 */
export function useActiveSection(items: NavItem[]): string | null {
  const { route } = useSite();
  const currentRoute = normalizeRoute(route);
  // El estado guarda también la ruta en la que se observó, de modo que al
  // cambiar de página se descarta sin necesidad de un efecto de reinicio.
  const [observed, setObserved] = useState<{ route: string; id: string | null }>({ route: '/', id: null });
  const active = observed.route === currentRoute ? observed.id : null;

  const routeMatchId = useMemo(() => {
    if (currentRoute === '/') {
      // Con la navegacion por rutas, «Inicio» es un enlace de ruta mas.
      return items.find((item) => item.enabled && item.cta.kind === 'route' && normalizeRoute(item.cta.target) === '/')?.id ?? null;
    }
    const byRoute = items.find(
      (item) => item.enabled && item.cta.kind === 'route' && normalizeRoute(item.cta.target) === currentRoute,
    );
    if (byRoute) return byRoute.id;
    // Varias templates declaran el enlace como ancla (`#servicios`) aunque exista
    // además una página dedicada con la misma ruta (`/servicios`). Estando en esa
    // página el elemento del menú debe quedar marcado igualmente.
    const byAnchor = items.find((item) => {
      if (!item.enabled || item.cta.kind !== 'anchor') return false;
      const anchor = item.cta.target.replace(/^#/, '');
      if (!anchor) return false;
      return currentRoute === `/${anchor}` || currentRoute.startsWith(`/${anchor}/`);
    });
    return byAnchor?.id ?? null;
  }, [items, currentRoute]);

  const firstAnchorId = useMemo(
    () => items.find((item) => item.enabled && item.cta.kind === 'anchor')?.id ?? null,
    [items],
  );

  // En la portada, volver arriba devuelve el foco al primer enlace.
  useEffect(() => {
    if (currentRoute !== '/') return;
    const onScroll = () => {
      if (window.scrollY < 90) setObserved({ route: currentRoute, id: null });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentRoute]);

  useEffect(() => {
    // Los anclajes de la navegación pertenecen a la portada.
    if (currentRoute !== '/') return;
    const anchors = items
      .filter((item) => item.enabled && item.cta.kind === 'anchor')
      .map((item) => ({ id: item.id, target: item.cta.target.replace(/^#/, '') }));
    if (anchors.length === 0) return;

    const nodes = anchors
      .map((entry) => {
        const node = document.getElementById(entry.target);
        return node ? { ...entry, node } : null;
      })
      .filter((x): x is { id: string; target: string; node: HTMLElement } => x !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = nodes.find((n) => n.node === visible.target);
        if (match) setObserved({ route: currentRoute, id: match.id });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.15, 0.35] },
    );

    nodes.forEach((n) => observer.observe(n.node));
    return () => observer.disconnect();
  }, [items, currentRoute]);

  if (routeMatchId) return routeMatchId;
  if (currentRoute !== '/') return null;
  return active ?? firstAnchorId;
}

/** El header se vuelve compacto/sólido al abandonar el hero. */
export function useStickyHeader(threshold = 40): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>('[data-wf-scroll]') ?? null;
    const read = () => setStuck((scroller ? scroller.scrollTop : window.scrollY) > threshold);
    read();
    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener('scroll', read, { passive: true });
    return () => target.removeEventListener('scroll', read);
  }, [threshold]);

  return stuck;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
