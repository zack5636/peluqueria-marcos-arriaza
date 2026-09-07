import { Icon } from '../site/components/Icon';

/*
 * Lo que se enseña cuando no hay agenda real a la que conectarse.
 *
 * No hay un segundo sistema de reservas que la sustituya. Un formulario que
 * guarda la solicitud en el propio navegador parece funcionar y no reserva
 * nada de verdad; mantenerlo como «respaldo» sería tener dos caminos de
 * reserva a la vez, uno real y uno que solo lo parece. Aquí se dice la verdad:
 * ahora mismo no se puede reservar en línea, y se deja un teléfono de
 * contacto si el negocio lo tiene.
 */
export function AgendaNoDisponible({ contactPhone }: { contactPhone?: string | null }) {
  return (
    <div className="pco-reserva pco-reserva--vacia" role="status">
      <span className="pco-reserva__marca" aria-hidden="true">
        <Icon name="calendar" size={26} />
      </span>
      <h3>La reserva en línea no está disponible ahora mismo</h3>
      <p className="pco-reserva__nota">
        {contactPhone
          ? <>Llámanos al <strong>{contactPhone}</strong> y te damos cita.</>
          : 'Vuelve a intentarlo en unos minutos.'}
      </p>
    </div>
  );
}
