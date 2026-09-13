import { useState, type FormEvent } from 'react';
import { Modal } from '../site/components/Modal';
import { useCustomerAuth } from './useCustomerAuth';
import { ErrorDeManageOS } from './cliente';

export function AuthModal() {
  const { modalAuthAbierto, cerrarModalAuth, login, register } = useCustomerAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const resetForm = () => {
    setError(null);
    setEnviando(false);
  };

  const handleClose = () => {
    resetForm();
    cerrarModalAuth();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      if (tab === 'login') {
        await login(email.trim(), password);
      } else {
        if (!nombre.trim()) {
          throw new Error('Por favor, introduce tu nombre.');
        }
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
        await register(nombre.trim(), email.trim(), password, telefono.trim() || undefined);
      }
      handleClose();
    } catch (err: unknown) {
      if (err instanceof ErrorDeManageOS) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ha ocurrido un error inesperado.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      open={modalAuthAbierto}
      onClose={handleClose}
      title={tab === 'login' ? 'Iniciar sesión' : 'Crear tu cuenta'}
      size="sm"
    >
      <div className="manageos-auth-dialog">
        <div className="manageos-auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'login'}
            className={`manageos-auth-tab ${tab === 'login' ? 'is-active' : ''}`}
            onClick={() => { setTab('login'); resetForm(); }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'register'}
            className={`manageos-auth-tab ${tab === 'register' ? 'is-active' : ''}`}
            onClick={() => { setTab('register'); resetForm(); }}
          >
            Crear cuenta
          </button>
        </div>

        {error && (
          <div className="manageos-auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="manageos-auth-form">
          {tab === 'register' && (
            <div className="manageos-field">
              <label htmlFor="auth-nombre">Nombre completo</label>
              <input
                id="auth-nombre"
                type="text"
                required
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div className="manageos-field">
            <label htmlFor="auth-email">Correo electrónico</label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div className="manageos-field">
            <label htmlFor="auth-password">Contraseña</label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
            />
          </div>

          {tab === 'register' && (
            <div className="manageos-field">
              <label htmlFor="auth-phone">
                Teléfono <small>(opcional)</small>
              </label>
              <input
                id="auth-phone"
                type="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="600 000 000"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="manageos-auth-submit"
          >
            {enviando
              ? (tab === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...')
              : (tab === 'login' ? 'Entrar' : 'Registrarse')}
          </button>
        </form>

        <div className="manageos-auth-footer">
          {tab === 'login' ? (
            <p>
              ¿No tienes cuenta todavía?{' '}
              <button
                type="button"
                className="manageos-auth-link"
                onClick={() => { setTab('register'); resetForm(); }}
              >
                Crear cuenta
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="manageos-auth-link"
                onClick={() => { setTab('login'); resetForm(); }}
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
