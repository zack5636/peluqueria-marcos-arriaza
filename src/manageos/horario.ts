/**
 * El horario del negocio, en líneas listas para enseñar.
 *
 * Genérico a propósito: no sabe nada de peluquerías ni de esta plantilla,
 * solo de los tramos que `useManageOS` ya trae en `datos.hours`. Cualquier
 * futura web conectada puede reutilizarlo tal cual para su propia ficha de
 * contacto, en vez de mantener un horario de mentira escrito a mano en su
 * `config.ts` que deje de coincidir con Manager en cuanto alguien lo cambie
 * ahí.
 */

export interface TramoHorario {
  isoWeekday: number;
  startLocal: string;
  endLocal: string;
}

export interface LineaHorario {
  label: string;
  value: string;
}

const NOMBRE_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function clavePorDia(tramos: TramoHorario[], dia: number): string {
  return tramos
    .filter((tramo) => tramo.isoWeekday === dia)
    .map((tramo) => `${tramo.startLocal.slice(0, 5)}-${tramo.endLocal.slice(0, 5)}`)
    .sort()
    .join(',');
}

function valorDeClave(clave: string): string {
  if (!clave) return 'Cerrado';
  return clave
    .split(',')
    .map((tramo) => tramo.replace('-', ' – '))
    .join(', ');
}

/**
 * Agrupa los siete días en líneas «Lunes a viernes: 9:30 – 19:00», uniendo
 * solo los tramos consecutivos que comparten exactamente el mismo horario.
 * Un día sin ningún tramo se lee «Cerrado», nunca se omite: que el negocio
 * cierra un día es tan parte del horario como a qué hora abre otro.
 */
export function formatearHorario(tramos: TramoHorario[]): LineaHorario[] {
  const claves = Array.from({ length: 7 }, (_, indice) => clavePorDia(tramos, indice + 1));
  const lineas: LineaHorario[] = [];
  let inicio = 0;
  while (inicio < 7) {
    let fin = inicio;
    while (fin + 1 < 7 && claves[fin + 1] === claves[inicio]) fin += 1;
    const label = fin === inicio ? NOMBRE_DIA[inicio]! : `${NOMBRE_DIA[inicio]} a ${NOMBRE_DIA[fin]}`;
    lineas.push({ label, value: valorDeClave(claves[inicio]!) });
    inicio = fin + 1;
  }
  return lineas;
}
