import { useMemo } from 'react';
import type { ServiceItem } from '../site/types';
import { useManageOS } from './useManageOS';
import type { ServicioPublico } from './cliente';

/*
 * El catálogo que se enseña.
 *
 * Manda ManageOS cuando la web está conectada: los servicios, sus nombres, sus
 * precios y su duración son los que su dueño mantiene en Manager, y lo que
 * archiva allí deja de verse aquí. Sin conexión se usa el catálogo propio de la
 * plantilla, que es lo que permite enseñar la web antes de dar de alta nada.
 *
 * Lo visual no viaja por la API y no tiene por qué: el icono, el color y las
 * fotos son de la plantilla. Se emparejan por nombre —normalizado— para que un
 * servicio que existe en las dos partes conserve su aspecto, y uno creado en
 * Manager entre con el aspecto genérico de su sitio en vez de no aparecer.
 */

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function desdeManageOS(servicio: ServicioPublico, plantilla: ServiceItem | undefined, orden: number): ServiceItem {
  return {
    id: servicio.id,
    enabled: true,
    sortOrder: orden,
    name: servicio.name,
    slug: normalizar(servicio.name),
    shortDescription: servicio.description || plantilla?.shortDescription || '',
    longDescription: servicio.description || plantilla?.longDescription || '',
    priceFromEur: servicio.priceMinor === null ? null : Math.round(servicio.priceMinor) / 100,
    durationMinutes: servicio.durationMinutes,
    includes: plantilla?.includes ?? [],
    sizes: plantilla?.sizes ?? [],
    icon: plantilla?.icon ?? 'paw',
    accent: plantilla?.accent ?? '#8A43D6',
    image: plantilla?.image ?? null,
    ...(plantilla?.iconImage ? { iconImage: plantilla.iconImage } : {}),
  };
}

export interface Catalogo {
  servicios: ServiceItem[];
  /** `true` cuando lo que se ve viene de Manager y no del fichero de la plantilla. */
  conectado: boolean;
}

export function useCatalogo(propios: ServiceItem[]): Catalogo {
  const conexion = useManageOS();

  return useMemo(() => {
    if (conexion.estado !== 'conectado') {
      return { servicios: propios.filter((servicio) => servicio.enabled), conectado: false };
    }
    const porNombre = new Map(propios.map((servicio) => [normalizar(servicio.name), servicio]));
    const servicios = [...conexion.datos.services]
      .sort((izquierda, derecha) => izquierda.displayOrder - derecha.displayOrder)
      .map((servicio, indice) => desdeManageOS(servicio, porNombre.get(normalizar(servicio.name)), indice));
    return { servicios, conectado: true };
  }, [conexion, propios]);
}
