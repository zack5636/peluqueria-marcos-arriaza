# Peluquería canina MARCOS Arriaza

Web pública de Peluquería canina MARCOS Arriaza (C. de Arriaza, 7, Moncloa - Aravaca, Madrid),
construida sobre la misma plantilla y el mismo motor de reservas que **Peludos & Co.** — el motor
(`src/manageos/`, `src/site/components/`) no se ha tocado; lo único propio de este proyecto es el
contenido (`src/config.ts`), dos plantillas de presentación y la identidad visual.

## Arrancar

```bash
npm install
npm run dev
```

Se abre en <http://localhost:5185>.

Para una versión compilada:

```bash
npm run build
npm run preview
```

## Conexión con ManageOS

La reserva y el catálogo salen de ManageOS cuando la web está conectada. Es el mismo contrato
público que usa cualquier web que hagamos:

1. **La web se identifica por su origen.** Al cargar pide `/public/v1/handshake` y la API le
   devuelve la clave pública del negocio cuyo dominio coincide. No hay credenciales dentro del
   código ni variables que configurar en producción.
2. **El negocio la conecta desde Manager** indicando su dominio. Manager lee el manifiesto que la
   web publica en `/.well-known/manageos.json` —servicios, horario y los campos que su formulario
   pide— y crea lo que falte.
3. **A partir de ahí manda Manager.** Servicios, precios, duración, horario, capacidad y campos del
   formulario se leen en vivo: lo que su dueño cambia allí se ve aquí sin desplegar nada, y lo que
   archiva deja de ofrecerse.

Sin conexión, la sección de reserva no muestra ningún formulario propio: pide llamar al teléfono
del negocio. Es deliberado — no hay un sistema de reservas de mentira detrás.

Para probar contra una API local, crea un `.env.local`:

```
VITE_MANAGEOS_API_URL=http://127.0.0.1:3001
```

## Qué contiene

| Ruta | Qué es |
|---|---|
| `/` | Portada: hero, servicios, proceso, ventajas, reseñas + galería y reserva rápida |
| `/servicios`, `/precios`, `/galeria`, `/sobre-nosotros`, `/contacto`, `/reservar` | Páginas públicas |
| `/aviso-legal`, `/privacidad`, `/cookies` | Textos legales |
| `/admin` | Panel de administración interno (no está enlazado desde la web) |

## Estructura

```
src/
  config.ts        Todo el contenido público: textos, precios, imágenes, páginas
  main.tsx         Punto de entrada: enruta entre la web y /admin
  admin/           Panel de administración (store.ts, AdminPanel.tsx, admin.css)
  site/            Runtime de la plantilla — motor compartido con Peludos & Co.
  manageos/        Cliente e integración con Manager — sin cambios respecto al original
public/assets/     Imágenes reales del negocio y tipografías, servidas en local
```

- **Cambiar textos, precios o imágenes:** se edita `src/config.ts`.
- **Identidad visual:** un único tema, "Cálido artesano" (`pco-arriaza-calido` en
  `src/site/theme/themes.ts`), construido desde las fotos reales del local — no los tres temas
  genéricos de la plantilla original.

## Créditos de las imágenes

Las fotografías son reales del negocio: la mayoría proceden de su ficha pública de Google Business
(Peluquería canina MARCOS Arriaza), y la foto de portada fue aportada directamente. La atribución
de cada imagen está en su campo `credit` dentro de `src/config.ts`. Donde un dato público no estaba
verificado (correo, redes sociales, razón social) se ha dejado vacío o como placeholder explícito
en vez de inventarlo.
