import { useSite } from '../context';
import { Icon, type IconName } from './Icon';

/**
 * Marca del negocio.
 *
 * Hasta ahora las cuatro templates dibujaban un símbolo fijo más el nombre, y
 * `business.logo.image` no lo leía nadie: subir un logotipo desde Recursos
 * visuales guardaba el archivo pero no cambiaba nada en pantalla. Este
 * componente es el único punto que resuelve la marca efectiva.
 *
 * Cascada: logotipo propio (variante oscura si la superficie es inversa) →
 * logotipo principal → símbolo de la template. El nombre en texto se mantiene
 * cuando el proyecto lo pide.
 */
export function BrandMark({
  icon = 'paw',
  size = 26,
  strokeWidth = 1.5,
  inverse = false,
  className,
}: {
  icon?: IconName;
  size?: number;
  strokeWidth?: number;
  /** `true` sobre fondos oscuros: usa la variante clara del logotipo si existe. */
  inverse?: boolean;
  className?: string;
}) {
  const { config } = useSite();
  const logo = config.business.logo;
  const image = (inverse ? logo.imageDark ?? logo.image : logo.image) ?? null;

  if (!logo.showLogo) return null;

  if (image) {
    return (
      <img
        className={`wf-brandmark${className ? ` ${className}` : ''}`}
        src={image.src}
        alt={image.alt || config.business.name}
        width={image.width}
        height={image.height}
        style={{ height: size * 1.35, width: 'auto', objectFit: 'contain' }}
      />
    );
  }

  return <Icon name={icon} size={size} strokeWidth={strokeWidth} className={className} />;
}
