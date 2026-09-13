import { useEffect } from 'react';
import { Modal } from '../site/components/Modal';
import { useCustomerAuth } from './useCustomerAuth';
import { Icon } from '../site/components/Icon';
import type { CitaCliente } from './cuentas';

function formatearFecha(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatearHora(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function EstadoBadge({ status }: { status: CitaCliente['status'] }) {
  switch (status) {
    case 'pending':
      return <span className="manageos-badge manageos-badge--pending">Pendiente de confirmación</span>;
    case 'confirmed':
      return <span className="manageos-badge manageos-badge--confirmed">Confirmada</span>;
    case 'completed':
      return <span className="manageos-badge manageos-badge--completed">Completada</span>;
    case 'cancelled':
      return <span className="manageos-badge manageos-badge--cancelled">Cancelada</span>;
    case 'no_show':
      return <span className="manageos-badge manageos-badge--cancelled">No presentado</span>;
    default:
      return <span className="manageos-badge">{status}</span>;
  }
}

export function MisCitas() {
  const {
    customer,
    modalCitasAbierto,
    cerrarModalCitas,
    citas,
    cargandoCitas,
    refrescarCitas,
    logout,
  } = useCustomerAuth();

  useEffect(() => {
    if (modalCitasAbierto) {
      void refrescarCitas();
    }
  }, [modalCitasAbierto, refrescarCitas]);

  if (!customer) return null;

  return (
    <Modal
      open={modalCitasAbierto}
      onClose={cerrarModalCitas}
      title="Mis citas"
      size="md"
    >
      <div className="manageos-citas-dialog">
        <div className="manageos-citas-header">
          <div className="manageos-user-info">
            <span className="manageos-user-avatar">
              <Icon name="user" size={20} />
            </span>
            <div>
              <strong>{customer.name}</strong>
              <small>{customer.email}</small>
            </div>
          </div>
          <div className="manageos-user-actions">
            <button
              type="button"
              className="manageos-btn-icon"
              onClick={() => void refrescarCitas()}
              title="Actualizar citas"
              aria-label="Actualizar citas"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 15.5-6.4L22 9" />
                <path d="M22 3v6h-6" />
                <path d="M21 12a9 9 0 0 1-15.5 6.4L2 15" />
                <path d="M2 21v-6h6" />
              </svg>
            </button>
            <button
              type="button"
              className="manageos-btn-logout"
              onClick={() => void logout()}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {cargandoCitas && citas.length === 0 ? (
          <div className="manageos-citas-loading">
            <p>Cargando tus citas...</p>
          </div>
        ) : citas.length === 0 ? (
          <div className="manageos-citas-empty">
            <span className="manageos-empty-icon">
              <Icon name="calendar" size={36} />
            </span>
            <h4>No tienes citas reservadas</h4>
            <p>Cuando reserves una cita en nuestra web, podrás ver su estado y detalles aquí en tiempo real.</p>
            <button
              type="button"
              className="manageos-btn-primary"
              onClick={() => {
                cerrarModalCitas();
                const el = document.getElementById('reservar');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Reservar una cita
            </button>
          </div>
        ) : (
          <div className="manageos-citas-list">
            {citas.map((cita) => {
              const petDetail = cita.details?.find((d) => d.key === 'nombre_mascota')?.value
                || cita.subjectName;
              const sizeDetail = cita.details?.find((d) => d.key === 'tamano')?.value
                || cita.sizeLabel;

              return (
                <article key={cita.id} className={`manageos-cita-card status-${cita.status}`}>
                  <div className="manageos-cita-top">
                    <h4 className="manageos-cita-service">{cita.serviceName}</h4>
                    <EstadoBadge status={cita.status} />
                  </div>

                  <div className="manageos-cita-datetime">
                    <span className="manageos-cita-date">
                      <Icon name="calendar" size={16} />
                      {formatearFecha(cita.startsAt)}
                    </span>
                    <span className="manageos-cita-time">
                      <Icon name="clock" size={16} />
                      {formatearHora(cita.startsAt)}
                    </span>
                  </div>

                  {(petDetail || sizeDetail || cita.workerName) && (
                    <div className="manageos-cita-meta">
                      {petDetail && (
                        <span className="manageos-meta-tag">
                          <strong>Mascota:</strong> {petDetail}
                        </span>
                      )}
                      {sizeDetail && (
                        <span className="manageos-meta-tag">
                          <strong>Tamaño:</strong> {sizeDetail}
                        </span>
                      )}
                      {cita.workerName && (
                        <span className="manageos-meta-tag">
                          <strong>Atendido por:</strong> {cita.workerName}
                        </span>
                      )}
                    </div>
                  )}

                  {cita.priceMinor !== null && (
                    <div className="manageos-cita-price">
                      <span>Importe:</span>
                      <strong>
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: cita.currency ?? 'EUR',
                        }).format(cita.priceMinor / 100)}
                      </strong>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
