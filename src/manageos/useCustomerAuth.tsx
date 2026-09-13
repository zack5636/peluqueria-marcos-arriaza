import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  obtenerTokenGuardado,
  obtenerPerfilCliente,
  obtenerMisCitasCliente,
  iniciarSesionCliente,
  registrarCliente,
  cerrarSesionCliente,
  type CuentaCliente,
  type CitaCliente,
} from './cuentas';
import './cuentas.css';

export interface CustomerAuthContextValue {
  customer: CuentaCliente | null;
  token: string | null;
  cargando: boolean;
  citas: CitaCliente[];
  cargandoCitas: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refrescarCitas: () => Promise<void>;
  modalAuthAbierto: boolean;
  datosInicialesAuth: { nombre?: string; email?: string; telefono?: string } | null;
  abrirModalAuth: (datos?: { nombre?: string; email?: string; telefono?: string }) => void;
  cerrarModalAuth: () => void;
  modalCitasAbierto: boolean;
  abrirModalCitas: () => void;
  cerrarModalCitas: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => obtenerTokenGuardado());
  const [customer, setCustomer] = useState<CuentaCliente | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [citas, setCitas] = useState<CitaCliente[]>([]);
  const [cargandoCitas, setCargandoCitas] = useState<boolean>(false);
  const [modalAuthAbierto, setModalAuthAbierto] = useState<boolean>(false);
  const [datosInicialesAuth, setDatosInicialesAuth] = useState<{ nombre?: string; email?: string; telefono?: string } | null>(null);
  const [modalCitasAbierto, setModalCitasAbierto] = useState<boolean>(false);

  const refrescarCitas = useCallback(async () => {
    if (!token) {
      setCitas([]);
      return;
    }
    setCargandoCitas(true);
    try {
      const items = await obtenerMisCitasCliente(token);
      setCitas(items);
    } catch {
      // Ignoramos fallo puntual de lectura
    } finally {
      setCargandoCitas(false);
    }
  }, [token]);

  // Carga inicial del perfil si hay token guardado
  useEffect(() => {
    let activo = true;
    if (!token) {
      setCustomer(null);
      setCitas([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    obtenerPerfilCliente(token)
      .then((perfil) => {
        if (!activo) return;
        setCustomer(perfil);
      })
      .catch(() => {
        if (!activo) return;
        setToken(null);
        setCustomer(null);
        cerrarSesionCliente(token);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [token]);

  // Refrescar citas cuando hay usuario autenticado
  useEffect(() => {
    if (token && customer) {
      void refrescarCitas();
    }
  }, [token, customer, refrescarCitas]);

  const login = useCallback(async (email: string, password: string) => {
    const respuesta = await iniciarSesionCliente({ email, password });
    setToken(respuesta.token);
    setCustomer(respuesta.customer);
    setModalAuthAbierto(false);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    const respuesta = await registrarCliente({ name, email, password, phone });
    setToken(respuesta.token);
    setCustomer(respuesta.customer);
    setModalAuthAbierto(false);
  }, []);

  const logout = useCallback(async () => {
    await cerrarSesionCliente(token);
    setToken(null);
    setCustomer(null);
    setCitas([]);
    setModalCitasAbierto(false);
  }, [token]);

  const abrirModalAuth = useCallback((datos?: { nombre?: string; email?: string; telefono?: string }) => {
    if (datos) setDatosInicialesAuth(datos);
    setModalAuthAbierto(true);
  }, []);
  const cerrarModalAuth = useCallback(() => {
    setDatosInicialesAuth(null);
    setModalAuthAbierto(false);
  }, []);
  const abrirModalCitas = useCallback(() => setModalCitasAbierto(true), []);
  const cerrarModalCitas = useCallback(() => setModalCitasAbierto(false), []);

  const value: CustomerAuthContextValue = {
    customer,
    token,
    cargando,
    citas,
    cargandoCitas,
    login,
    register,
    logout,
    refrescarCitas,
    modalAuthAbierto,
    datosInicialesAuth,
    abrirModalAuth,
    cerrarModalAuth,
    modalCitasAbierto,
    abrirModalCitas,
    cerrarModalCitas,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth(): CustomerAuthContextValue {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth debe usarse dentro de un CustomerAuthProvider');
  }
  return context;
}
