import { useId, useMemo, useRef, useState } from 'react';
import { buildWhatsappUrl, useSite } from '../context';
import type { BookingFieldName, BookingRequest } from '../types';
import { Icon } from './Icon';
import { Modal } from './Modal';

const PHONE_RE = /^(?:\+?\d[\d\s.-]{7,17})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export type BookingLayout = 'stacked' | 'grid-2' | 'grid-4' | 'modal-steps';

type Values = Partial<Record<BookingFieldName, string>>;
type Errors = Partial<Record<BookingFieldName, string>>;

function todayIso(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 10);
}

export function validateBooking(
  values: Values,
  fields: { name: BookingFieldName; required: boolean; enabled: boolean; label: string }[],
): Errors {
  const errors: Errors = {};
  for (const field of fields) {
    if (!field.enabled) continue;
    const raw = (values[field.name] ?? '').trim();

    if (field.required && !raw) {
      errors[field.name] =
        field.name === 'consent'
          ? 'Debes aceptar la política de privacidad para continuar.'
          : `${field.label} es obligatorio.`;
      continue;
    }
    if (!raw) continue;

    if (field.name === 'phone' && !PHONE_RE.test(raw)) {
      errors.phone = 'Introduce un teléfono válido, por ejemplo +34 612 345 678.';
    }
    if (field.name === 'email' && !EMAIL_RE.test(raw)) {
      errors.email = 'Introduce un correo electrónico válido.';
    }
    if (field.name === 'date' && raw < todayIso()) {
      errors.date = 'La fecha debe ser posterior a hoy.';
    }
    if (field.name === 'age') {
      const age = Number(raw);
      if (!Number.isFinite(age) || age < 0 || age > 30) {
        errors.age = 'Introduce una edad entre 0 y 30 años.';
      }
    }
  }
  return errors;
}

export function BookingForm({
  layout = 'grid-2',
  submitLabel = 'Reservar cita',
  className,
  showIntro = false,
}: {
  layout?: BookingLayout;
  submitLabel?: string;
  className?: string;
  showIntro?: boolean;
}) {
  const { config, bookingSelection, submitRequest, previewMode, announce, requests } = useSite();
  const booking = config.booking;
  const formId = useId();
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [stepTwoOpen, setStepTwoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<BookingRequest | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const effectiveValues = useMemo<Values>(
    () => ({
      ...values,
      service: values.service ?? bookingSelection.label ?? '',
    }),
    [values, bookingSelection.label],
  );

  const enabledFields = useMemo(() => booking.fields.filter((f) => f.enabled), [booking.fields]);
  const stepOne = enabledFields.filter((f) => f.step === 1);
  const stepTwo = enabledFields.filter((f) => f.step === 2);

  const degraded = booking.mode === 'direct-confirmed' && !booking.scheduleConnected;
  const effectiveMode = degraded ? 'pending-request' : booking.mode;

  const setValue = (name: BookingFieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const runValidation = (scope: 'step1' | 'all'): Errors => {
    const fields = scope === 'step1' ? stepOne : enabledFields;
    const found = validateBooking(effectiveValues, fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      window.setTimeout(() => summaryRef.current?.focus(), 0);
    }
    return found;
  };

  const handleStepOne = (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const found = runValidation('step1');
    if (Object.keys(found).length > 0) return;
    if (stepTwo.length > 0) {
      setStepTwoOpen(true);
      return;
    }
    void finish();
  };

  const finish = async () => {
    if (submittingRef.current) return;
    const found = runValidation('all');
    if (Object.keys(found).length > 0) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError('');
    try {
      const request = await submitRequest({ ...effectiveValues });
      setResult(request);
      setStepTwoOpen(false);
      announce(`${booking.confirmationTitle} Referencia ${request.reference}.`);
    } catch (error) {
      const unconfigured =
        error instanceof Error && error.message === 'BOOKING_BACKEND_NOT_CONFIGURED';
      setSubmitError(
        unconfigured
          ? 'Esta web no tiene todavía un endpoint de reservas configurado. No se ha almacenado la solicitud.'
          : 'No se ha podido registrar la solicitud. No se ha guardado ningún dato; inténtalo de nuevo o contacta con el negocio.',
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const whatsappHref = () => {
    // Nunca se incluyen alergias u observaciones sin decisión explícita.
    const message = booking.whatsappTemplate
      .replace('{servicio}', effectiveValues.service ?? 'un servicio')
      .replace('{mascota}', effectiveValues.petName ?? 'mi perro')
      .replace('{fecha}', effectiveValues.date ?? 'una fecha por confirmar');
    return buildWhatsappUrl(config.business.whatsapp, message);
  };

  if (result) {
    return (
      <div className={`wf-booking wf-booking--done${className ? ` ${className}` : ''}`} role="status">
        <span className="wf-booking__done-icon">
          <Icon name="check" size={26} />
        </span>
        <h3>{booking.confirmationTitle}</h3>
        <p>{booking.confirmationMessage}</p>
        <p className="wf-booking__reference">
          Referencia: <strong>{result.reference}</strong>
        </p>
        {effectiveMode !== 'direct-confirmed' ? (
          <p className="wf-booking__pending">
            Esto es una solicitud, todavía no una cita confirmada. Te contactaremos para cerrar día y hora.
          </p>
        ) : null}
        <div className="wf-booking__done-actions">
          <button
            type="button"
            className="wf-btn wf-btn--secondary wf-btn--md"
            onClick={() => {
              setResult(null);
              setValues({});
            }}
          >
            Enviar otra solicitud
          </button>
          <a
            className="wf-btn wf-btn--whatsapp wf-btn--md"
            href={previewMode ? undefined : whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (previewMode) {
                e.preventDefault();
                announce('Modo preview: WhatsApp no se abre.');
              }
            }}
          >
            <Icon name="whatsapp" size={18} />
            <span>Continuar por WhatsApp</span>
          </a>
        </div>
        {requests.length > 1 ? (
          <p className="wf-booking__count">{requests.length} solicitudes registradas en esta sesión de demostración.</p>
        ) : null}
      </div>
    );
  }

  const errorList = enabledFields
    .filter((f) => errors[f.name])
    .map((f) => ({ name: f.name, label: f.label, message: errors[f.name] as string }));

  return (
    <div className={`wf-booking${className ? ` ${className}` : ''}`}>
      {showIntro && degraded ? (
        <p className="wf-booking__notice">
          <Icon name="bell" size={16} /> Sin agenda conectada: la reserva se registra como solicitud pendiente.
        </p>
      ) : null}

      {submitError ? (
        <div className="wf-booking__summary" role="alert">
          <strong>{submitError}</strong>
          <div className="wf-booking__done-actions">
            <a
              className="wf-btn wf-btn--whatsapp wf-btn--md"
              href={previewMode ? undefined : whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size={18} />
              <span>Enviar por WhatsApp</span>
            </a>
            <a className="wf-btn wf-btn--secondary wf-btn--md" href={`mailto:${config.business.email}`}>
              Enviar por correo
            </a>
          </div>
        </div>
      ) : null}

      {errorList.length > 0 ? (
        <div className="wf-booking__summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <strong>Revisa {errorList.length === 1 ? 'este campo' : `estos ${errorList.length} campos`}:</strong>
          <ul>
            {errorList.map((item) => (
              <li key={item.name}>
                <a href={`#${formId}-${item.name}`}>{item.label}</a>: {item.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form className={`wf-booking__form wf-booking__form--${layout}`} onSubmit={handleStepOne} noValidate>
        {stepOne.map((field) => (
          <Field
            key={field.name}
            idPrefix={formId}
            field={field}
            value={effectiveValues[field.name] ?? ''}
            error={errors[field.name]}
            onChange={setValue}
          />
        ))}
        <div className="wf-booking__actions">
          <button type="submit" className="wf-btn wf-btn--primary wf-btn--lg" disabled={submitting}>
            <Icon name="calendar" size={18} />
            <span>{stepTwo.length > 0 ? 'Continuar' : submitLabel}</span>
          </button>
          {stepTwo.length > 0 ? (
            <p className="wf-booking__hint">Después completarás los datos de tu peludo en un segundo paso.</p>
          ) : null}
        </div>
      </form>

      <Modal
        open={stepTwoOpen}
        onClose={() => setStepTwoOpen(false)}
        title="Completa los datos de tu peludo"
        size="md"
        footer={
          <>
            <button type="button" className="wf-btn wf-btn--ghost wf-btn--md" onClick={() => setStepTwoOpen(false)}>
              Volver
            </button>
            <button type="button" className="wf-btn wf-btn--primary wf-btn--md" onClick={() => void finish()} disabled={submitting}>
              {submitLabel}
            </button>
          </>
        }
      >
        <p className="wf-booking__step-note">
          Con estos datos preparamos la visita: raza, tamaño y necesidades especiales nos ayudan a reservar el tiempo
          adecuado.
        </p>
        <div className="wf-booking__form wf-booking__form--grid-2">
          {stepTwo.map((field) => (
            <Field
              key={field.name}
              idPrefix={formId}
              field={field}
              value={effectiveValues[field.name] ?? ''}
              error={errors[field.name]}
              onChange={setValue}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

function Field({
  idPrefix,
  field,
  value,
  error,
  onChange,
}: {
  idPrefix: string;
  field: { name: BookingFieldName; label: string; required: boolean };
  value: string;
  error?: string;
  onChange: (name: BookingFieldName, value: string) => void;
}) {
  const { config } = useSite();
  const id = `${idPrefix}-${field.name}`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;
  const wide = field.name === 'notes' || field.name === 'allergies' || field.name === 'consent';

  const common = {
    id,
    name: field.name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    required: field.required,
  } as const;

  let control: React.ReactNode;

  switch (field.name) {
    case 'service': {
      const options = [
        ...config.services.filter((s) => s.enabled).map((s) => s.name),
        ...config.packages.filter((p) => p.enabled).map((p) => `Paquete ${p.name}`),
        ...config.plans.filter((p) => p.enabled).map((p) => `Plan ${p.name}`),
      ];
      control = (
        <select {...common} className="wf-input" value={value} onChange={(e) => onChange(field.name, e.target.value)}>
          <option value="">Selecciona un servicio</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      break;
    }
    case 'size':
      control = (
        <select {...common} className="wf-input" value={value} onChange={(e) => onChange(field.name, e.target.value)}>
          <option value="">Selecciona el tamaño</option>
          {config.booking.sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      );
      break;
    case 'professional':
      control = (
        <select {...common} className="wf-input" value={value} onChange={(e) => onChange(field.name, e.target.value)}>
          <option value="">Sin preferencia</option>
          {config.team
            .filter((member) => member.enabled)
            .map((member) => (
              <option key={member.id} value={member.name}>
                {member.name} · {member.role}
              </option>
            ))}
        </select>
      );
      break;
    case 'time':
      control = (
        <select {...common} className="wf-input" value={value} onChange={(e) => onChange(field.name, e.target.value)}>
          <option value="">Selecciona una hora</option>
          {config.booking.timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      );
      break;
    case 'date':
      control = (
        <input
          {...common}
          className="wf-input"
          type="date"
          min={todayIso()}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
      break;
    case 'notes':
    case 'allergies':
      control = (
        <textarea
          {...common}
          className="wf-input wf-input--area"
          rows={3}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
      break;
    case 'consent':
      return (
        <div className={`wf-field wf-field--consent${error ? ' has-error' : ''}`}>
          <label className="wf-consent" htmlFor={id}>
            <input
              {...common}
              type="checkbox"
              checked={value === 'yes'}
              onChange={(e) => onChange(field.name, e.target.checked ? 'yes' : '')}
            />
            <span>{config.booking.privacyText}</span>
          </label>
          {error ? (
            <p className="wf-field__error" id={errorId}>
              <Icon name="close" size={14} /> {error}
            </p>
          ) : null}
        </div>
      );
    case 'phone':
      control = (
        <input
          {...common}
          className="wf-input"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
      break;
    case 'email':
      control = (
        <input
          {...common}
          className="wf-input"
          type="email"
          autoComplete="email"
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
      break;
    case 'age':
      control = (
        <input
          {...common}
          className="wf-input"
          type="number"
          min={0}
          max={30}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
      break;
    default:
      control = (
        <input
          {...common}
          className="wf-input"
          type="text"
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
  }

  return (
    <div className={`wf-field${wide ? ' wf-field--wide' : ''}${error ? ' has-error' : ''}`}>
      <label className="wf-field__label" htmlFor={id}>
        {field.label}
        {field.required ? <span aria-hidden="true"> *</span> : null}
        {field.required ? <span className="wf-sr-only"> (obligatorio)</span> : null}
      </label>
      {control}
      {error ? (
        <p className="wf-field__error" id={errorId}>
          <Icon name="close" size={14} /> {error}
        </p>
      ) : null}
    </div>
  );
}
