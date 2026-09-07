import { useManageOS } from './useManageOS';
import { ReservaManageOS } from './ReservaManageOS';
import { AgendaNoDisponible } from './AgendaNoDisponible';
import './reserva.css';

/*
 * El único sistema de reservas de la web.
 *
 * Cuando la web está conectada a ManageOS, esto es la agenda real: servicios,
 * precios, huecos y campos salen de allí y la cita se crea allí. Cuando no lo
 * está, no hay un segundo formulario que la sustituya y finja reservar: se dice
 * que la agenda no está disponible. Dos caminos de reserva —uno real y uno que
 * solo lo parece— es peor que uno solo que a veces está caído.
 *
 * Se usa igual en cualquier sitio de la web donde se pida una cita: el modal
 * global, la página de reserva y la sección de la portada. Esa es la garantía
 * de que no hay dos flujos conviviendo por accidente.
 */
export function ReservaConectada({ whatsapp, servicioInicial }: {
  whatsapp?: string | null;
  /** Servicio preseleccionado al llegar desde una tarjeta del catálogo. */
  servicioInicial?: string | null;
}) {
  const conexion = useManageOS();

  if (conexion.estado === 'consultando') {
    return (
      <div className="pco-reserva pco-reserva--cargando" aria-busy="true" role="status">
        <p className="pco-reserva__cargando-texto">
          Consultando la agenda
          <span aria-hidden="true" className="pco-reserva__puntos"><i /><i /><i /></span>
        </p>
      </div>
    );
  }

  if (conexion.estado === 'conectado') {
    return (
      <ReservaManageOS
        estado={conexion.datos}
        whatsapp={whatsapp ?? conexion.datos.business.contactPhone}
        servicioInicial={servicioInicial ?? null}
      />
    );
  }

  return <AgendaNoDisponible contactPhone={whatsapp} />;
}
