/**
 * Formulario genérico dirigido por `FormSchema`.
 *
 * Es la infraestructura común de los formularios de todas las templates: la
 * declaración cambia por nicho, el comportamiento no. Cubre validación por
 * campo, estados de carga, confirmación, error y protección contra envíos
 * duplicados.
 */

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { useSite } from '../context';
import { activeItems, itemText } from '../collections';
import {
  enabledFields,
  renderTemplate,
  submissionFingerprint,
  validateField,
  validateForm,
  type FormFieldSchema,
  type FormSchema,
  type FormValues,
} from '../forms';
import { Icon } from './Icon';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Localiza el valor de contacto entre los campos declarados.
 *
 * El nombre del campo lo elige cada template, así que se busca por tipo primero
 * (`tel`, `email`) y por coincidencia de clave después. Si no hay nada, el
 * registro guarda el dato vacío en lugar de inventarlo.
 */
function pickValue(fields: FormFieldSchema[], values: FormValues, hints: string[]): string {
  const byType = fields.find(
    (f) => (hints.includes('telefono') && f.type === 'tel') || (hints.includes('email') && f.type === 'email'),
  );
  if (byType && values[byType.name]) return values[byType.name];
  const byName = fields.find((f) => hints.some((hint) => f.name.toLowerCase().includes(hint)));
  return byName ? values[byName.name] ?? '' : '';
}

function fieldOptions(
  schema: FormFieldSchema,
  collections: ReturnType<typeof useSite>['config']['collections'],
): { value: string; label: string }[] {
  if (schema.optionsFrom) {
    // Las opciones siguen al catálogo editable, no a una lista escrita aquí.
    const items = activeItems(collections ?? {}, schema.optionsFrom.collection);
    return items.map((item) => {
      const label = itemText(item, schema.optionsFrom!.labelField, item.id);
      const value = schema.optionsFrom!.valueField === '$id'
        ? item.id
        : schema.optionsFrom!.valueField
          ? itemText(item, schema.optionsFrom!.valueField, label)
          : label;
      return { value, label };
    });
  }
  return schema.options ?? [];
}

export function SiteForm({
  form,
  className,
  columns = 2,
  onSubmitted,
  stepped = false,
}: {
  form: FormSchema;
  className?: string;
  columns?: 1 | 2;
  onSubmitted?: (values: FormValues) => void;
  /** Presenta los campos declarados en pasos 1 y 2 sin cambiar el esquema. */
  stepped?: boolean;
}) {
  const { config, submitForm, announce, previewMode, runCta } = useSite();
  const baseId = useId();
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [reference, setReference] = useState('');
  const [formError, setFormError] = useState('');
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  /** Huella del último envío aceptado, para bloquear duplicados. */
  const lastSubmission = useRef<{ fingerprint: string; at: number } | null>(null);

  const fields = useMemo(() => enabledFields(form), [form]);
  const hasSecondStep = stepped && fields.some((field) => field.step === 2);
  const visibleFormFields = hasSecondStep ? fields.filter((field) => field.step === currentStep) : fields;

  const setValue = useCallback(
    (name: string, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      // Un campo ya tocado se revalida en vivo para que el error desaparezca
      // en cuanto se corrige, en lugar de esperar al siguiente envío.
      setErrors((prev) => {
        if (!touched[name]) return prev;
        const schema = fields.find((f) => f.name === name);
        if (!schema) return prev;
        const message = validateField(schema, value);
        const next = { ...prev };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
    },
    [fields, touched],
  );

  const handleBlur = useCallback(
    (schema: FormFieldSchema) => {
      setTouched((prev) => ({ ...prev, [schema.name]: true }));
      const message = validateField(schema, values[schema.name]);
      setErrors((prev) => {
        const next = { ...prev };
        if (message) next[schema.name] = message;
        else delete next[schema.name];
        return next;
      });
    },
    [values],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (status === 'sending') return;

      if (hasSecondStep && currentStep === 1) {
        const firstStepFields = fields.filter((field) => field.step === 1);
        const firstStepErrors = Object.fromEntries(
          firstStepFields
            .map((field) => [field.name, validateField(field, values[field.name])])
            .filter(([, message]) => Boolean(message)),
        );
        setErrors((previous) => ({ ...previous, ...firstStepErrors }));
        setTouched((previous) => ({
          ...previous,
          ...Object.fromEntries(firstStepFields.map((field) => [field.name, true])),
        }));
        if (Object.keys(firstStepErrors).length > 0) {
          setStatus('error');
          setFormError('Revisa los campos marcados antes de continuar.');
          const firstInvalid = firstStepFields.find((field) => firstStepErrors[field.name]);
          if (firstInvalid) document.getElementById(`${baseId}-${firstInvalid.name}`)?.focus();
          return;
        }
        setStatus('idle');
        setFormError('');
        setCurrentStep(2);
        announce('Paso 2 de 2. Datos de contacto y detalles finales.');
        return;
      }

      const nextErrors = validateForm(form, values);
      setErrors(nextErrors);
      setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));

      if (Object.keys(nextErrors).length > 0) {
        setStatus('error');
        setFormError('Revisa los campos marcados antes de enviar.');
        announce('El formulario tiene campos por corregir.');
        // El foco va al primer campo con error, no al principio del formulario.
        const firstInvalid = fields.find((f) => nextErrors[f.name]);
        if (firstInvalid) {
          document.getElementById(`${baseId}-${firstInvalid.name}`)?.focus();
        }
        return;
      }

      const fingerprint = submissionFingerprint(form, values);
      const previous = lastSubmission.current;
      if (previous && previous.fingerprint === fingerprint && Date.now() - previous.at < form.duplicateWindowMs) {
        setStatus('error');
        setFormError('Ya hemos recibido esta solicitud. Espera un momento antes de reenviarla.');
        announce('Solicitud duplicada: no se ha enviado de nuevo.');
        return;
      }

      setStatus('sending');
      setFormError('');
      try {
        // Los valores viajan con la etiqueta con la que se pidieron, de modo
        // que el panel pueda mostrarlos aunque la template cambie después.
        const request = await submitForm({
          formKey: form.key,
          formName: form.name,
          templateId: config.meta.templateId,
          contactName: pickValue(fields, values, ['nombre', 'contacto', 'name']),
          contactPhone: pickValue(fields, values, ['telefono', 'phone', 'movil']),
          contactEmail: pickValue(fields, values, ['email', 'correo']),
          values: fields
            .filter((f) => f.type !== 'consent')
            .map((f) => {
              const raw = values[f.name] ?? '';
              // En un desplegable se guarda la etiqueta que vio la persona, no
              // la clave interna: la solicitud es un registro para leer.
              const option =
                f.type === 'select' || f.type === 'radio'
                  ? fieldOptions(f, config.collections).find((o) => o.value === raw)
                  : undefined;
              return { name: f.name, label: f.label, type: f.type, value: option?.label ?? raw };
            }),
        });
        lastSubmission.current = { fingerprint, at: Date.now() };
        setReference(request.reference);
        setStatus('sent');
        announce(`${form.confirmationTitle}. Referencia ${request.reference}.`);
        onSubmitted?.(values);
      } catch {
        setStatus('error');
        setFormError('No hemos podido enviar la solicitud. Inténtalo de nuevo o llámanos por teléfono.');
        announce('Error al enviar la solicitud.');
      }
    },
    [announce, baseId, config.collections, config.meta.templateId, currentStep, fields, form, hasSecondStep, onSubmitted, status, submitForm, values],
  );

  if (status === 'sent') {
    return (
      <div className={`wf-form wf-form--sent${className ? ` ${className}` : ''}`} role="status">
        <span className="wf-form__sent-icon" aria-hidden="true">
          <Icon name="checkCircle" size={34} />
        </span>
        <h3>{form.confirmationTitle}</h3>
        <p>{form.confirmationMessage}</p>
        {reference ? (
          <p className="wf-form__reference">
            Referencia: <strong>{reference}</strong>
          </p>
        ) : null}
        <button
          type="button"
          className="wf-btn wf-btn--ghost wf-btn--sm"
          data-wf-button
          onClick={() => {
            setValues({});
            setErrors({});
            setTouched({});
            setStatus('idle');
            setReference('');
            setCurrentStep(1);
          }}
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form
      className={`wf-form wf-form--cols-${columns}${className ? ` ${className}` : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {form.title ? <h3 className="wf-form__title">{form.title}</h3> : null}
      {form.description ? <p className="wf-form__description">{form.description}</p> : null}

      {hasSecondStep ? (
        <div className="wf-form__steps" aria-label={`Paso ${currentStep} de 2`}>
          <span className={currentStep >= 1 ? 'is-active' : ''}>1 · Proyecto</span>
          <span className={currentStep >= 2 ? 'is-active' : ''}>2 · Contacto</span>
        </div>
      ) : null}

      <div className="wf-form__grid">
        {visibleFormFields.map((schema) => {
          const id = `${baseId}-${schema.name}`;
          const error = errors[schema.name];
          const describedBy = [error ? `${id}-error` : null, schema.help ? `${id}-help` : null]
            .filter(Boolean)
            .join(' ');
          const common = {
            id,
            name: schema.name,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': describedBy || undefined,
            onBlur: () => handleBlur(schema),
          };

          return (
            <div
              key={schema.name}
              className={`wf-field wf-field--${schema.width ?? 'full'}${error ? ' wf-field--error' : ''}`}
            >
              {schema.type === 'consent' || schema.type === 'checkbox' ? (
                <label className="wf-field__check" htmlFor={id}>
                  <input
                    {...common}
                    type="checkbox"
                    checked={values[schema.name] === 'true'}
                    onChange={(e) => setValue(schema.name, e.target.checked ? 'true' : '')}
                  />
                  <span>
                    {schema.label}
                    {schema.required ? <span aria-hidden="true"> *</span> : null}
                  </span>
                </label>
              ) : (
                <>
                  <label className="wf-field__label" htmlFor={id}>
                    {schema.label}
                    {schema.required ? <span aria-hidden="true"> *</span> : null}
                  </label>

                  {schema.type === 'textarea' ? (
                    <textarea
                      {...common}
                      rows={schema.rows ?? 4}
                      placeholder={schema.placeholder}
                      value={values[schema.name] ?? ''}
                      onChange={(e) => setValue(schema.name, e.target.value)}
                    />
                  ) : schema.type === 'select' ? (
                    <select
                      {...common}
                      value={values[schema.name] ?? ''}
                      onChange={(e) => setValue(schema.name, e.target.value)}
                    >
                      <option value="">Selecciona una opción</option>
                      {fieldOptions(schema, config.collections).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : schema.type === 'radio' ? (
                    <div className="wf-field__radios" role="radiogroup" aria-labelledby={`${id}-label`}>
                      {fieldOptions(schema, config.collections).map((option) => (
                        <label key={option.value} className="wf-field__radio">
                          <input
                            type="radio"
                            name={schema.name}
                            value={option.value}
                            checked={values[schema.name] === option.value}
                            onChange={(e) => setValue(schema.name, e.target.value)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      {...common}
                      type={
                        schema.type === 'tel'
                          ? 'tel'
                          : schema.type === 'email'
                            ? 'email'
                            : schema.type === 'number'
                              ? 'number'
                              : schema.type === 'date'
                                ? 'date'
                                : schema.type === 'time'
                                  ? 'time'
                                  : 'text'
                      }
                      placeholder={schema.placeholder}
                      min={schema.min}
                      max={schema.max}
                      value={values[schema.name] ?? ''}
                      onChange={(e) => setValue(schema.name, e.target.value)}
                    />
                  )}
                </>
              )}

              {schema.help ? (
                <p className="wf-field__help" id={`${id}-help`}>
                  {schema.help}
                </p>
              ) : null}
              {error ? (
                <p className="wf-field__error" id={`${id}-error`} role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {form.privacyText ? <p className="wf-form__privacy">{form.privacyText}</p> : null}

      {formError ? (
        <p className="wf-form__alert" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="wf-form__actions">
        {hasSecondStep && currentStep === 2 ? (
          <button type="button" className="wf-btn wf-btn--ghost wf-btn--lg" data-wf-button onClick={() => { setCurrentStep(1); setFormError(''); }}>
            Volver
          </button>
        ) : null}
        <button
          type="submit"
          className="wf-btn wf-btn--primary wf-btn--lg"
          data-wf-button
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Enviando…' : hasSecondStep && currentStep === 1 ? 'Continuar' : form.submitLabel}
        </button>

        {config.business.whatsapp ? (
          <button
            type="button"
            className="wf-btn wf-btn--whatsapp wf-btn--lg"
            data-wf-button
            onClick={() =>
              runCta({
                label: 'WhatsApp',
                kind: 'whatsapp',
                target: config.business.whatsapp,
                message: renderTemplate(form.whatsappTemplate, values),
              })
            }
          >
            <Icon name="whatsapp" size={20} />
            <span>Escribir por WhatsApp</span>
          </button>
        ) : null}
      </div>

      {previewMode ? (
        <p className="wf-form__preview-note">Modo preview · los envíos no salen del dispositivo.</p>
      ) : null}
    </form>
  );
}
