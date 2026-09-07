import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { BookingFieldName, BookingRequest, Cta, SiteConfig } from './types';

export interface SiteRuntimeOptions {
  /**
   * En modo preview los envíos y los enlaces externos se interceptan: nada sale
   * del dispositivo y se muestra un aviso explícito.
   */
  previewMode: boolean;
  /** Ruta activa dentro del sitio (`/`, `/servicios`, …). */
  route: string;
  onNavigate: (route: string) => void;
  onExternalLink?: (url: string) => void;
  /**
   * La aplicación anfitriona decide dónde se persiste. Web Factory conecta su
   * API local; una exportación puede conectar un endpoint propio.
   */
  onSubmitBookingRequest?: (
    values: Partial<Record<BookingFieldName, string>>,
  ) => Promise<BookingRequest>;
  /**
   * Envío de un formulario declarado por la template. Se separa de la reserva
   * canina porque sus campos son abiertos: se transmiten con la etiqueta con la
   * que se pidieron para que el panel pueda mostrarlos después.
   */
  onSubmitForm?: (submission: FormSubmission) => Promise<BookingRequest>;
}

export interface FormSubmission {
  formKey: string;
  formName: string;
  templateId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  values: { name: string; label: string; type: string; value: string }[];
}

export interface BookingSelection {
  serviceId?: string;
  packageId?: string;
  planId?: string;
  label?: string;
}

interface SiteRuntimeValue extends SiteRuntimeOptions {
  config: SiteConfig;
  bookingSelection: BookingSelection;
  selectBooking: (selection: BookingSelection) => void;
  requests: BookingRequest[];
  submitRequest: (
    values: Partial<Record<BookingFieldName, string>>,
  ) => Promise<BookingRequest>;
  submitForm: (submission: FormSubmission) => Promise<BookingRequest>;
  announcement: string;
  announce: (message: string) => void;
  openModal: string | null;
  setOpenModal: (id: string | null) => void;
  registerAnchor: (anchor: string, node: HTMLElement | null) => void;
  scrollToAnchor: (anchor: string, focusSelector?: string) => void;
  runCta: (cta: Cta) => void;
  formatPrice: (amount: number, suffix?: string) => string;
}

const SiteRuntimeContext = createContext<SiteRuntimeValue | null>(null);

const EUR = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** `35` -> `35 €`; `65` con sufijo `/mes` -> `65 €/mes`. */
export function formatEur(amount: number, suffix = ''): string {
  return `${EUR.format(amount)}${suffix}`;
}

export function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function SiteRuntimeProvider({
  config,
  options,
  children,
}: {
  config: SiteConfig;
  options: SiteRuntimeOptions;
  children: ReactNode;
}) {
  const [bookingSelection, setBookingSelection] = useState<BookingSelection>({});
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [openModal, setOpenModal] = useState<string | null>(null);
  const anchors = useRef(new Map<string, HTMLElement>());

  const registerAnchor = useCallback((anchor: string, node: HTMLElement | null) => {
    if (node) anchors.current.set(anchor, node);
    else anchors.current.delete(anchor);
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  const scrollToAnchor = useCallback((anchor: string, focusSelector?: string) => {
    const key = anchor.replace(/^#/, '');
    const node = anchors.current.get(key) ?? document.getElementById(key);
    if (!node) return;
    const reduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Se descuenta la cabecera fija para que el título de la sección no quede
    // tapado, algo que `scrollIntoView({ block: 'start' })` no contempla.
    const header = document.querySelector<HTMLElement>('.wf-site header');
    const headerOffset =
      header && getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().height : 0;
    const startY = window.scrollY;
    const top = Math.max(0, node.getBoundingClientRect().top + startY - headerOffset - 8);

    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });

    // Salvaguarda: si el desplazamiento suave no llega a aplicarse —ocurre en
    // contextos sin composición o con la animación bloqueada— el enlace no puede
    // quedarse sin efecto, así que se salta a la posición de forma directa.
    if (!reduce) {
      window.setTimeout(() => {
        if (Math.abs(window.scrollY - startY) < 4 && Math.abs(top - startY) > 4) {
          window.scrollTo({ top, behavior: 'auto' });
        }
      }, 360);
    }

    if (focusSelector) {
      window.setTimeout(() => {
        const target = node.querySelector<HTMLElement>(focusSelector);
        target?.focus({ preventScroll: true });
      }, reduce ? 0 : 420);
    }
  }, []);

  const { previewMode, onExternalLink, onNavigate, onSubmitBookingRequest } = options;

  const runCta = useCallback(
    (cta: Cta) => {
      switch (cta.kind) {
        case 'anchor':
          scrollToAnchor(cta.target, cta.target === '#reserva' ? 'input, select, textarea' : undefined);
          break;
        case 'route':
          onNavigate(cta.target);
          break;
        case 'modal':
          setOpenModal(cta.target);
          break;
        case 'tel':
          if (!previewMode) window.location.href = `tel:${cta.target.replace(/\s/g, '')}`;
          else announce(`Modo preview: la llamada a ${cta.target} no se realiza.`);
          break;
        case 'mailto':
          if (!previewMode) window.location.href = `mailto:${cta.target}`;
          else announce(`Modo preview: el correo a ${cta.target} no se abre.`);
          break;
        case 'whatsapp':
        case 'external': {
          const url =
            cta.kind === 'whatsapp' ? buildWhatsappUrl(cta.target, cta.message ?? '') : cta.target;
          if (previewMode) {
            onExternalLink?.(url);
            announce('Modo preview: el enlace externo requiere confirmación.');
          } else {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
          break;
        }
      }
    },
    [announce, onExternalLink, onNavigate, previewMode, scrollToAnchor],
  );

  const submitRequest = useCallback(
    async (values: Partial<Record<BookingFieldName, string>>) => {
      let request: BookingRequest;
      if (onSubmitBookingRequest) {
        request = await onSubmitBookingRequest(values);
      } else if (previewMode) {
        const stamp = Date.now().toString(36).toUpperCase();
        request = {
          id: `preview-${stamp}`,
          reference: `PREVIEW-${stamp.slice(-6)}`,
          createdAt: new Date().toISOString(),
          status: 'pendiente',
          values,
        };
      } else {
        throw new Error('BOOKING_BACKEND_NOT_CONFIGURED');
      }
      setRequests((prev) => [request, ...prev]);
      return request;
    },
    [onSubmitBookingRequest, previewMode],
  );

  const { onSubmitForm } = options;

  const submitForm = useCallback(
    async (submission: FormSubmission) => {
      let request: BookingRequest;
      if (onSubmitForm) {
        request = await onSubmitForm(submission);
      } else if (previewMode) {
        // En preview nada sale del dispositivo: se devuelve un recibo local.
        const stamp = Date.now().toString(36).toUpperCase();
        request = {
          id: `preview-${stamp}`,
          reference: `PREVIEW-${stamp.slice(-6)}`,
          createdAt: new Date().toISOString(),
          status: 'pendiente',
          values: Object.fromEntries(
            submission.values.map((entry) => [entry.name, entry.value]),
          ) as BookingRequest['values'],
        };
      } else {
        throw new Error('FORM_BACKEND_NOT_CONFIGURED');
      }
      setRequests((prev) => [request, ...prev]);
      return request;
    },
    [onSubmitForm, previewMode],
  );

  const selectBooking = useCallback((selection: BookingSelection) => {
    setBookingSelection(selection);
  }, []);

  const value = useMemo<SiteRuntimeValue>(
    () => ({
      ...options,
      config,
      bookingSelection,
      selectBooking,
      requests,
      submitRequest,
      submitForm,
      announcement,
      announce,
      openModal,
      setOpenModal,
      registerAnchor,
      scrollToAnchor,
      runCta,
      formatPrice: formatEur,
    }),
    [
      options,
      config,
      bookingSelection,
      selectBooking,
      requests,
      submitRequest,
      submitForm,
      announcement,
      announce,
      openModal,
      registerAnchor,
      scrollToAnchor,
      runCta,
    ],
  );

  return <SiteRuntimeContext.Provider value={value}>{children}</SiteRuntimeContext.Provider>;
}

export function useSite(): SiteRuntimeValue {
  const ctx = useContext(SiteRuntimeContext);
  if (!ctx) throw new Error('useSite debe usarse dentro de SiteRuntimeProvider');
  return ctx;
}
