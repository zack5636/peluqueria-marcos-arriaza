import { useCallback, useEffect, useMemo, useState } from 'react';
import { estadoDelNegocio, type EstadoDelNegocio } from './cliente';

/*
 * El estado del negocio, vivo.
 *
 * Se vuelve a pedir, no se lee una sola vez. Todo lo público —servicios,
 * precios, horario y los campos del formulario— vive en Manager y su dueño lo
 * cambia mientras la web está abierta. Pidiéndolo solo al montar, un servicio
 * nuevo o un precio corregido no aparecía hasta recargar a mano, y desde fuera
 * eso se lee como «Manager no se refleja en la web».
 *
 * Se refresca al volver a la pestaña, al recuperar la conexión y cada pocos
 * minutos. Es contenido, no disponibilidad: no necesita más, y la disponibilidad
 * ya se pide aparte y en el momento de elegir hora.
 */

export type ConexionManageOS =
  | { estado: 'consultando' }
  | { estado: 'conectado'; datos: EstadoDelNegocio }
  | { estado: 'sin-conectar' };

const ESPERA_MINIMA_MS = 30_000;
const REFRESCO_MS = 180_000;

export function useManageOS(): ConexionManageOS & { refrescar: () => void } {
  const [conexion, setConexion] = useState<ConexionManageOS>({ estado: 'consultando' });

  const [ultima, setUltima] = useState(0);

  const pedir = useCallback((forzar: boolean) => {
    setUltima((anterior) => {
      if (!forzar && Date.now() - anterior < ESPERA_MINIMA_MS) return anterior;
      void estadoDelNegocio()
        .then((datos) => setConexion({ estado: 'conectado', datos }))
        /*
         * Sin conexión la web sigue en pie con su contenido propio. Una demo que
         * se queda en blanco porque la agenda no contesta es peor que una que
         * enseña el negocio y avisa al reservar.
         */
        .catch(() => setConexion((previo) => (previo.estado === 'conectado' ? previo : { estado: 'sin-conectar' })));
      return Date.now();
    });
  }, []);

  useEffect(() => {
    pedir(true);
    const alVolver = () => { if (document.visibilityState === 'visible') pedir(false); };
    const alEnfocar = () => pedir(false);
    const alReconectar = () => pedir(true);
    const reloj = window.setInterval(() => pedir(false), REFRESCO_MS);
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('focus', alEnfocar);
    window.addEventListener('online', alReconectar);
    return () => {
      window.clearInterval(reloj);
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('focus', alEnfocar);
      window.removeEventListener('online', alReconectar);
    };
  }, [pedir]);

  return useMemo(
    () => ({ ...conexion, refrescar: () => pedir(true) }),
    [conexion, pedir],
  );
}
