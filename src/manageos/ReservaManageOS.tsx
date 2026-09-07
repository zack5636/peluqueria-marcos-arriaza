import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ErrorDeManageOS, crearReserva, panoramaDeHuecos, precioLegible,
  type CampoDeReserva, type DiaDePanorama, type EstadoDelNegocio, type ServicioPublico,
} from './cliente';
import { Icon } from '../site/components/Icon';

/*
 * Reservar de verdad.
 *
 * Cuatro pasos, en el orden en que se decide: qué le hacemos, qué día, a qué
 * hora y quién eres. La disponibilidad la calcula ManageOS con el horario del
 * negocio, su capacidad y sus grupos de servicios, así que aquí no se deduce
 * nada: se pinta lo que el servidor dice que existe. El horizonte de reserva
 * —hasta cuándo se puede mirar— también lo dice el propio negocio
 * (`booking.horizonDays`) y no un límite fijado aquí.
 *
 * El formulario tampoco está escrito a mano. Los campos salen del negocio
 * —`booking.fields` del estado público—, que es lo que hace que esto sirva para
 * una peluquería canina y para cualquier otra cosa sin tocar el código.
 */

interface Props {
  estado: EstadoDelNegocio;
  whatsapp?: string | null;
  /** Servicio preseleccionado al llegar desde una tarjeta del catálogo. */
  servicioInicial?: string | null;
}

type Paso = 'servicio' | 'dia' | 'hora' | 'datos' | 'hecho';
type NivelDelDia = 'libre' | 'ocupado' | 'completo';

const DIAS_CORTOS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function iso(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

/** Fecha local a medianoche, para comparar días sin que la hora estorbe. */
function medianoche(fecha: Date): Date {
  const copia = new Date(fecha);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

function sumarDias(fecha: Date, dias: number): Date {
  const copia = new Date(fecha);
  copia.setDate(copia.getDate() + dias);
  return copia;
}

function horaLegible(instante: string, zona: string): string {
  return new Date(instante).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: zona,
  });
}

function diaLegible(fecha: string): string {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

/**
 * Cuánto queda libre de lo que había ese día.
 *
 * Se compara sobre la rejilla del propio día, no sobre un máximo inventado: un
 * sábado corto no debe parecer más lleno que un martes solo por tener menos
 * horas de agenda.
 */
function nivelDelDia(dia: DiaDePanorama): NivelDelDia {
  if (dia.slots.length === 0) return 'completo';
  const libres = dia.slots.filter((hueco) => hueco.available).length;
  if (libres === 0) return 'completo';
  return libres / dia.slots.length > 0.3 ? 'libre' : 'ocupado';
}

export function ReservaManageOS({ estado, whatsapp, servicioInicial }: Props) {
  const [paso, setPaso] = useState<Paso>('servicio');
  const [servicioId, setServicioId] = useState<string>(servicioInicial ?? '');
  const [mes, setMes] = useState(() => { const hoy = new Date(); return new Date(hoy.getFullYear(), hoy.getMonth(), 1); });
  const [dias, setDias] = useState<DiaDePanorama[]>([]);
  const [cargandoAgenda, setCargandoAgenda] = useState(false);
  const [fecha, setFecha] = useState('');
  const [inicio, setInicio] = useState('');
  const [valores, setValores] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [reserva, setReserva] = useState<{ startsAt: string; servicio: string } | null>(null);
  const [ayudaAbierta, setAyudaAbierta] = useState(false);
  const enviandoRef = useRef(false);

  const servicios = useMemo(
    () => [...estado.services].sort((a, b) => a.displayOrder - b.displayOrder),
    [estado.services],
  );
  const servicio = servicios.find((entrada) => entrada.id === servicioId) ?? null;
  const campos = useMemo(
    () => [...estado.booking.fields].sort((a, b) => a.displayOrder - b.displayOrder),
    [estado.booking.fields],
  );

  /*
   * Hasta cuándo se puede mirar. Lo decide el negocio desde Manager
   * (`booking.horizonDays`), no un límite fijado en la plantilla: una peluquería
   * puede abrir 15 días de agenda y otra 60, y esta pantalla tiene que
   * respetarlo tal cual venga.
   */
  const hoy = useMemo(() => medianoche(new Date()), []);
  const ultimoDia = useMemo(
    () => sumarDias(hoy, Math.max(0, estado.booking.horizonDays - 1)),
    [hoy, estado.booking.horizonDays],
  );

  /*
   * Un servicio puede desaparecer del catálogo mientras alguien lo tiene
   * elegido —el negocio lo archiva desde Manager—. Si pasa, se suelta en vez de
   * dejar avanzar hacia una reserva que el servidor va a rechazar.
   */
  useEffect(() => {
    if (servicioId && !servicios.some((entrada) => entrada.id === servicioId)) {
      setServicioId('');
      setInicio('');
      setPaso('servicio');
      setAviso('Ese servicio ya no está disponible. Elige otro, por favor.');
    }
  }, [servicioId, servicios]);

  const cargarAgenda = useCallback(async (idServicio: string, primerDiaDelMes: Date) => {
    setCargandoAgenda(true);
    try {
      const desde = primerDiaDelMes < hoy ? hoy : primerDiaDelMes;
      const finMes = new Date(primerDiaDelMes.getFullYear(), primerDiaDelMes.getMonth() + 1, 0);
      const hasta = finMes > ultimoDia ? ultimoDia : finMes;
      if (hasta < desde) { setDias([]); return; }
      const panorama = await panoramaDeHuecos(idServicio, iso(desde), iso(hasta));
      setDias(panorama.days);
      /* Si la hora elegida ha dejado de estar libre, se suelta y se dice. */
      setInicio((elegida) => {
        if (!elegida) return elegida;
        const sigue = panorama.days.some((dia) => dia.slots.some(
          (hueco) => hueco.startsAt === elegida && hueco.available,
        ));
        if (!sigue) setAviso('Esa hora acaba de ocuparse. Elige otra, por favor.');
        return sigue ? elegida : '';
      });
    } catch (error) {
      setDias([]);
      setAviso(error instanceof ErrorDeManageOS ? error.message : 'No hemos podido consultar la agenda.');
    } finally {
      setCargandoAgenda(false);
    }
  }, [hoy, ultimoDia]);

  useEffect(() => {
    if (!servicioId) return;
    void cargarAgenda(servicioId, mes);
  }, [servicioId, mes, cargarAgenda]);

  /*
   * La agenda envejece mientras la pantalla está abierta. Se vuelve a pedir al
   * volver a la pestaña: no es tiempo real ni hace falta, pero evita que alguien
   * envíe una hora que se ocupó hace diez minutos.
   */
  useEffect(() => {
    if (!servicioId || paso === 'hecho') return;
    const alVolver = () => {
      if (document.visibilityState === 'visible' && !enviandoRef.current) void cargarAgenda(servicioId, mes);
    };
    document.addEventListener('visibilitychange', alVolver);
    return () => document.removeEventListener('visibilitychange', alVolver);
  }, [servicioId, mes, paso, cargarAgenda]);

  const porFecha = useMemo(() => new Map(dias.map((dia) => [dia.date, dia])), [dias]);
  const diaElegido = fecha ? porFecha.get(fecha) : undefined;
  const huecosDelDia = diaElegido?.slots ?? [];

  const elegirServicio = (id: string) => {
    setServicioId(id); setFecha(''); setInicio(''); setAviso(null); setPaso('dia');
  };

  const faltantes = campos.filter((campo) => {
    if (!campo.required) return false;
    const valor = (valores[campo.key] ?? '').trim();
    return campo.type === 'boolean' ? valor !== 'true' : valor.length === 0;
  });

  const enviar = async () => {
    if (enviandoRef.current || !servicio || !inicio) return;
    if (faltantes.length) { setAviso(`Falta ${faltantes[0]!.label.toLowerCase()}.`); return; }
    enviandoRef.current = true;
    setEnviando(true);
    setAviso(null);
    try {
      const cliente: { firstName: string; lastName?: string; email?: string; phone?: string } = { firstName: '' };
      const detalles: { key: string; label: string; value: string }[] = [];
      for (const campo of campos) {
        const valor = (valores[campo.key] ?? '').trim();
        if (!valor) continue;
        if (campo.target === 'customer.firstName') cliente.firstName = valor;
        else if (campo.target === 'customer.lastName') cliente.lastName = valor;
        else if (campo.target === 'customer.email') cliente.email = valor;
        else if (campo.target === 'customer.phone') cliente.phone = valor;
        else detalles.push({ key: campo.key, label: campo.label, value: valor });
      }
      const respuesta = await crearReserva(
        { serviceId: servicio.id, startsAt: inicio, customer: cliente, details: detalles },
        crypto.randomUUID(),
      );
      setReserva({ startsAt: respuesta.booking.startsAt, servicio: respuesta.booking.service.name });
      setPaso('hecho');
    } catch (error) {
      if (error instanceof ErrorDeManageOS && error.code === 'SLOT_UNAVAILABLE') {
        setAviso('Esa hora acaba de ocuparse. Elige otra, por favor.');
        setInicio('');
        setPaso('hora');
        void cargarAgenda(servicio.id, mes);
      } else {
        setAviso(error instanceof ErrorDeManageOS ? error.message : 'No hemos podido completar la reserva.');
      }
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
    }
  };

  if (paso === 'hecho' && reserva) {
    return (
      <div className="pco-reserva pco-reserva--hecha">
        <span className="pco-reserva__marca"><Icon name="check" size={28} /></span>
        <h3>Tu cita está reservada</h3>
        <p className="pco-reserva__resumen">
          {reserva.servicio} · {diaLegible(reserva.startsAt.slice(0, 10))} a las{' '}
          {horaLegible(reserva.startsAt, estado.business.timezone)}
        </p>
        <p className="pco-reserva__nota">
          Te esperamos. Si no puedes venir, avísanos con tiempo y le damos tu hueco a otro peludo.
        </p>
      </div>
    );
  }

  return (
    <div className="pco-reserva">
      <ol className="pco-reserva__pasos" aria-label="Pasos de la reserva">
        {(['servicio', 'dia', 'hora', 'datos'] as const).map((clave, indice) => {
          const orden: Paso[] = ['servicio', 'dia', 'hora', 'datos'];
          const actual = orden.indexOf(paso);
          const estadoPaso = indice < actual ? 'hecho' : indice === actual ? 'actual' : 'pendiente';
          const etiquetas = { servicio: 'Servicio', dia: 'Día', hora: 'Hora', datos: 'Tus datos' };
          return (
            <li key={clave} className={`pco-reserva__paso pco-reserva__paso--${estadoPaso}`}>
              <span className="pco-reserva__num">{indice < actual ? <Icon name="check" size={13} /> : indice + 1}</span>
              <span>{etiquetas[clave]}</span>
            </li>
          );
        })}
      </ol>

      {aviso ? <p className="pco-reserva__aviso" role="status">{aviso}</p> : null}

      {paso === 'servicio' ? (
        <div className="pco-reserva__servicios">
          {servicios.length === 0
            ? <p className="pco-reserva__vacio">Ahora mismo no hay servicios publicados.</p>
            : servicios.map((entrada) => (
              <button
                key={entrada.id}
                type="button"
                className="pco-reserva__servicio"
                onClick={() => elegirServicio(entrada.id)}
              >
                <span className="pco-reserva__servicio-nombre">{entrada.name}</span>
                <span className="pco-reserva__servicio-meta">
                  {entrada.durationMinutes} min
                  {precioLegible(entrada) ? <> · {precioLegible(entrada)}</> : null}
                </span>
                {entrada.description ? (
                  <span className="pco-reserva__servicio-desc">{entrada.description}</span>
                ) : null}
                <Icon name="arrowRight" size={16} />
              </button>
            ))}
        </div>
      ) : null}

      {paso === 'dia' && servicio ? (
        <Calendario
          mes={mes}
          dias={porFecha}
          cargando={cargandoAgenda}
          hoy={hoy}
          ultimoDia={ultimoDia}
          onMes={setMes}
          onDia={(elegido) => { setFecha(elegido); setInicio(''); setPaso('hora'); }}
          onVolver={() => setPaso('servicio')}
          servicio={servicio}
        />
      ) : null}

      {paso === 'hora' && servicio ? (
        <div className="pco-reserva__horas-bloque">
          <button type="button" className="pco-reserva__volver" onClick={() => setPaso('dia')}>
            <Icon name="arrowLeft" size={16} /> {diaLegible(fecha)}
          </button>
          {cargandoAgenda ? <p className="pco-reserva__vacio">Consultando la agenda…</p> : null}
          {!cargandoAgenda && huecosDelDia.filter((h) => h.available).length === 0 ? (
            <p className="pco-reserva__vacio">No queda ningún hueco este día. Prueba con otro.</p>
          ) : null}
          <div className="pco-reserva__horas">
            {huecosDelDia.map((hueco) => (
              <button
                key={hueco.startsAt}
                type="button"
                disabled={!hueco.available}
                aria-pressed={inicio === hueco.startsAt}
                className={`pco-reserva__hora${inicio === hueco.startsAt ? ' pco-reserva__hora--elegida' : ''}${hueco.available ? '' : ' pco-reserva__hora--ocupada'}`}
                onClick={() => { setInicio(hueco.startsAt); setAviso(null); setPaso('datos'); }}
              >
                {horaLegible(hueco.startsAt, estado.business.timezone)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {paso === 'datos' && servicio && inicio ? (
        <form
          className="pco-reserva__datos"
          onSubmit={(evento) => { evento.preventDefault(); void enviar(); }}
        >
          <button type="button" className="pco-reserva__volver" onClick={() => setPaso('hora')}>
            <Icon name="arrowLeft" size={16} /> Cambiar la hora
          </button>
          <p className="pco-reserva__elegido">
            <strong>{servicio.name}</strong> · {diaLegible(fecha)} a las{' '}
            {horaLegible(inicio, estado.business.timezone)}
          </p>
          <div className="pco-reserva__campos">
            {campos.map((campo) => (
              <CampoDeFormulario
                key={campo.key}
                campo={campo}
                valor={valores[campo.key] ?? ''}
                onCambio={(valor) => setValores((previos) => ({ ...previos, [campo.key]: valor }))}
              />
            ))}
          </div>
          <button type="submit" className="pco-reserva__enviar" disabled={enviando}>
            {enviando ? 'Reservando…' : 'Confirmar la cita'}
          </button>
        </form>
      ) : null}

      {whatsapp ? (
        <div className="pco-reserva__ayuda">
          <button
            type="button"
            className="pco-reserva__ayuda-boton"
            aria-expanded={ayudaAbierta}
            onClick={() => setAyudaAbierta((abierta) => !abierta)}
          >
            ¿Necesitas más ayuda?
          </button>
          {ayudaAbierta ? (
            <p className="pco-reserva__ayuda-detalle">
              Escríbenos por WhatsApp al{' '}
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {whatsapp}
              </a>{' '}
              y te ayudamos a elegir el servicio o la hora.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * El mes completo, en rejilla de seis semanas.
 *
 * Cada día lleva su propio nivel de ocupación —libre, ocupado, completo—,
 * calculado sobre los huecos que ManageOS ya ha devuelto para ese mes. El
 * negocio no tiene que explicarlo dos veces: el mismo dato que decide si una
 * hora se puede pulsar decide de qué color se ve el día.
 */
function Calendario({ mes, dias, cargando, hoy, ultimoDia, onMes, onDia, onVolver, servicio }: {
  mes: Date;
  dias: Map<string, DiaDePanorama>;
  cargando: boolean;
  hoy: Date;
  ultimoDia: Date;
  onMes: (mes: Date) => void;
  onDia: (fecha: string) => void;
  onVolver: () => void;
  servicio: ServicioPublico;
}) {
  const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const desplazamiento = (primero.getDay() + 6) % 7; // lunes primero
  const inicioRejilla = sumarDias(primero, -desplazamiento);

  const celdas = Array.from({ length: 42 }, (_valor, indice) => {
    const fecha = sumarDias(inicioRejilla, indice);
    const isoFecha = iso(fecha);
    const dia = dias.get(isoFecha);
    const pasado = fecha < hoy;
    const fueraDeVentana = fecha > ultimoDia;
    const cerrado = Boolean(dia && !dia.open);
    const nivel = dia && dia.open ? nivelDelDia(dia) : null;
    return {
      fecha: isoFecha,
      numero: fecha.getDate(),
      delMes: fecha.getMonth() === mes.getMonth(),
      pasado,
      fueraDeVentana,
      cerrado,
      nivel,
      seleccionable: Boolean(dia) && !pasado && !fueraDeVentana && !cerrado && nivel !== 'completo',
    };
  });

  const mesInicial = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const mesFinal = new Date(ultimoDia.getFullYear(), ultimoDia.getMonth(), 1);
  const inicioMesActual = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const puedeRetroceder = inicioMesActual > mesInicial;
  const puedeAvanzar = inicioMesActual < mesFinal;

  return (
    <div className="pco-reserva__calendario">
      <button type="button" className="pco-reserva__volver" onClick={onVolver}>
        <Icon name="arrowLeft" size={16} /> {servicio.name}
      </button>
      <div className="pco-reserva__mes">
        <button
          type="button"
          aria-label="Mes anterior"
          disabled={!puedeRetroceder}
          onClick={() => onMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
        >
          <Icon name="arrowLeft" size={16} />
        </button>
        <span>{MESES[mes.getMonth()]} {mes.getFullYear()}</span>
        <button
          type="button"
          aria-label="Mes siguiente"
          disabled={!puedeAvanzar}
          onClick={() => onMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
        >
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
      <div className="pco-reserva__semana" aria-hidden="true">
        {DIAS_CORTOS.map((dia, indice) => <span key={`${dia}-${indice}`}>{dia}</span>)}
      </div>
      <div className="pco-reserva__dias" role="grid" aria-busy={cargando}>
        {celdas.map((celda) => {
          const motivo = celda.pasado ? 'Ya ha pasado'
            : celda.fueraDeVentana ? 'Fuera del plazo de reserva'
              : celda.cerrado ? 'Cerrado'
                : celda.nivel === 'completo' ? 'Completo'
                  : null;
          const clases = ['pco-reserva__dia'];
          if (!celda.delMes) clases.push('pco-reserva__dia--fuera');
          if (celda.nivel) clases.push(`pco-reserva__dia--${celda.nivel}`);
          return (
            <button
              key={celda.fecha}
              type="button"
              disabled={!celda.seleccionable}
              className={clases.join(' ')}
              aria-label={motivo ? `${celda.numero}, ${motivo.toLowerCase()}` : `Día ${celda.numero}`}
              onClick={() => onDia(celda.fecha)}
            >
              {celda.numero}
            </button>
          );
        })}
      </div>
      {cargando ? <p className="pco-reserva__vacio">Consultando la agenda…</p> : null}
      <ul className="pco-reserva__leyenda">
        <li><i className="pco-reserva__punto pco-reserva__punto--libre" /> Disponible</li>
        <li><i className="pco-reserva__punto pco-reserva__punto--ocupado" /> Ocupado</li>
        <li><i className="pco-reserva__punto pco-reserva__punto--completo" /> Completo</li>
      </ul>
    </div>
  );
}

/** Un campo del formulario, según lo que el negocio declaró en Manager. */
function CampoDeFormulario({ campo, valor, onCambio }: {
  campo: CampoDeReserva;
  valor: string;
  onCambio: (valor: string) => void;
}) {
  const id = `reserva-${campo.key}`;
  const comun = {
    id,
    value: valor,
    required: campo.required,
    'aria-describedby': campo.help ? `${id}-ayuda` : undefined,
  };

  return (
    <div className={`pco-reserva__campo${campo.type === 'long_text' ? ' pco-reserva__campo--ancho' : ''}`}>
      {campo.type === 'boolean' ? (
        <label className="pco-reserva__check" htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={valor === 'true'}
            onChange={(evento) => onCambio(evento.target.checked ? 'true' : '')}
          />
          <span>{campo.label}</span>
        </label>
      ) : (
        <>
          <label htmlFor={id}>
            {campo.label}{campo.required ? <span aria-hidden="true"> *</span> : null}
          </label>
          {campo.type === 'long_text' ? (
            <textarea {...comun} rows={3} onChange={(evento) => onCambio(evento.target.value)} />
          ) : campo.type === 'selection' ? (
            <select {...comun} onChange={(evento) => onCambio(evento.target.value)}>
              <option value="">Elige una opción</option>
              {campo.options.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
            </select>
          ) : (
            <input
              {...comun}
              type={campo.type === 'phone' ? 'tel' : campo.type === 'email' ? 'email' : campo.type === 'number' ? 'number' : campo.type === 'date' ? 'date' : 'text'}
              onChange={(evento) => onCambio(evento.target.value)}
            />
          )}
        </>
      )}
      {campo.help ? <span className="pco-reserva__ayuda-campo" id={`${id}-ayuda`}>{campo.help}</span> : null}
    </div>
  );
}
