/**
 * Contenido público de la web de Peluquería canina MARCOS Arriaza.
 *
 * Nace sobre la misma plantilla y el mismo motor que Peludos & Co. — el motor
 * de reservas conectado a Manager (`src/manageos/*`) no cambia una línea—,
 * pero todo lo que se ve aquí es específico de Marcos: su dirección real, su
 * teléfono, sus horas, sus reseñas de Google y sus propias fotos. Donde un
 * dato público no estaba verificado (email, redes sociales, razón social) se
 * ha dejado vacío a propósito en vez de inventarlo — ver los comentarios de
 * cada bloque.
 *
 * Todo lo que se ve en la web sale de aquí: textos, precios, imágenes y
 * páginas. El tema visual NO se decide aquí: lo elige el panel de
 * administración y queda guardado en el navegador (ver `src/admin/store.ts`).
 */
import type { SiteConfig } from './site/types';

export const config: SiteConfig = {
  "meta": {
    "projectId": "demo-marcos-arriaza",
    "projectName": "Peluquería canina MARCOS Arriaza",
    "templateId": "canine-peludos-and-co",
    "templateVersion": "1.0.0",
    "themeId": "pco-arriaza-calido",
    "locale": "es-ES",
    "currency": "EUR"
  },
  "business": {
    "name": "Peluquería canina MARCOS Arriaza",
    /*
     * Google clasifica el negocio como "Peluquero de mascotas" (autónomo),
     * sin razón social publicada. En vez de inventar un "S.L." que no existe,
     * se deja como placeholder neutro explícito hasta que Marcos lo confirme.
     */
    "legalName": "Marcos Arriaza (nombre fiscal pendiente de confirmar)",
    "tagline": "Tu perro, en las manos de Marcos",
    "descriptor": "Peluquería canina",
    "logo": {
      "text": "MARCOS Arriaza",
      "image": null,
      "showLogo": true,
      "showName": true
    },
    "phone": "+34 619 62 44 49",
    "whatsapp": "+34 619 62 44 49",
    /* Sin correo verificado en la ficha pública: se deja vacío, no inventado. */
    "email": "",
    "address": {
      "line1": "C. de Arriaza, 7",
      "postalCode": "28008",
      "city": "Madrid",
      "region": "Moncloa - Aravaca, Comunidad de Madrid",
      "country": "España",
      "coordinates": {
        "lat": 40.4212,
        "lng": -3.716
      }
    },
    "openingHours": [
      {
        "label": "Lunes a viernes",
        "value": "10:00 – 19:00"
      },
      {
        "label": "Sábado",
        "value": "Cerrado"
      },
      {
        "label": "Domingo",
        "value": "Cerrado"
      }
    ],
    "serviceArea": "Moncloa - Aravaca y barrios próximos de Madrid"
  },
  "navigation": {
    "items": [
      {
        "id": "inicio",
        "label": "Inicio",
        "enabled": true,
        "sortOrder": 0,
        "cta": {
          "label": "Inicio",
          "kind": "route",
          "target": "/"
        }
      },
      {
        "id": "servicios",
        "label": "Servicios",
        "enabled": true,
        "sortOrder": 1,
        "cta": {
          "label": "Servicios",
          "kind": "route",
          "target": "/servicios"
        }
      },
      {
        "id": "precios",
        "label": "Precios",
        "enabled": true,
        "sortOrder": 2,
        "cta": {
          "label": "Precios",
          "kind": "route",
          "target": "/precios"
        }
      },
      {
        "id": "sobre-nosotros",
        "label": "Sobre nosotros",
        "enabled": true,
        "sortOrder": 3,
        "cta": {
          "label": "Sobre nosotros",
          "kind": "route",
          "target": "/sobre-nosotros"
        }
      },
      {
        "id": "galeria",
        "label": "Galería",
        "enabled": true,
        "sortOrder": 4,
        "cta": {
          "label": "Galería",
          "kind": "route",
          "target": "/galeria"
        }
      },
      {
        "id": "contacto",
        "label": "Contacto",
        "enabled": true,
        "sortOrder": 5,
        "cta": {
          "label": "Contacto",
          "kind": "route",
          "target": "/contacto"
        }
      }
    ],
    "primaryCta": {
      "label": "Reservar cita",
      "kind": "modal",
      "target": "booking"
    },
    "secondaryCta": {
      "label": "Ver servicios",
      "kind": "anchor",
      "target": "#servicios"
    }
  },
  "content": {
    "hero": {
      "eyebrow": "Trato cercano · desde el barrio",
      "title": "Tu perro, cuidado por",
      "titleHighlight": "Marcos",
      "paragraph": "Peluquería canina de toda la vida en Moncloa - Aravaca. Sin cadenas ni turnos rotativos: cada cita la atiende Marcos, con el tiempo que tu perro necesite.",
      "note": "",
      "primaryCta": {
        "label": "Reservar cita",
        "kind": "modal",
        "target": "booking"
      },
      "secondaryCta": {
        "label": "Ver servicios",
        "kind": "anchor",
        "target": "#servicios"
      },
      "microBenefits": [
        {
          "id": "un-solo-peluquero",
          "label": "Siempre Marcos",
          "description": "el mismo peluquero",
          "icon": "award"
        },
        {
          "id": "valoracion",
          "label": "4,9 de 5",
          "description": "en Google",
          "icon": "sparkle"
        },
        {
          "id": "resenas",
          "label": "+300 reseñas",
          "description": "de clientes reales",
          "icon": "paw"
        },
        {
          "id": "trato",
          "label": "Trato cercano",
          "description": "y sin prisas",
          "icon": "heart"
        }
      ],
      "ratingBadge": {
        "enabled": true,
        "score": "4,9",
        "countLabel": "316 reseñas en Google",
        "sourceLabel": "Reseñas de Google",
        "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
      },
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/hero/perrito-recepcion.webp",
        "alt": "Perrito de pelo canela recién peinado, de pie sobre el suelo del local",
        "width": 1000,
        "height": 706,
        "ratio": "4:5",
        "origin": "client",
        "focal": {
          "desktop": [
            48,
            55
          ],
          "tablet": [
            48,
            50
          ],
          "mobile": [
            48,
            45
          ]
        },
        "credit": {
          "author": "Marcos",
          "source": "Foto aportada directamente por el negocio",
          "license": "Uso con y para el propio negocio",
          "url": ""
        }
      },
      "videoCta": {
        "enabled": false,
        "label": "",
        "posterSrc": "",
        "videoSrc": "",
        "transcript": ""
      }
    },
    "headings": {
      "services": {
        "eyebrow": "Servicios",
        "title": "Todo lo que tu perro necesita",
        "subtitle": ""
      },
      "packages": {
        "eyebrow": "Paquetes",
        "title": "Ahorra con nuestros paquetes",
        "subtitle": ""
      },
      "process": {
        "eyebrow": "Nuestro proceso",
        "title": "Así de fácil es reservar",
        "subtitle": ""
      },
      "benefits": {
        "eyebrow": "",
        "title": "¿Por qué elegir a Marcos?",
        "subtitle": ""
      },
      "booking": {
        "eyebrow": "",
        "title": "Reserva rápida",
        "subtitle": "Cuéntanos sobre tu peludo y buscaremos el mejor horario."
      }
    },
    "benefits": [
      {
        "id": "mismo-peluquero",
        "enabled": true,
        "sortOrder": 0,
        "title": "Siempre el mismo peluquero",
        "description": "Marcos atiende cada cita en persona",
        "icon": "heart",
        "accent": "#B5533C"
      },
      {
        "id": "valoracion-google",
        "enabled": true,
        "sortOrder": 1,
        "title": "4,9 en Google",
        "description": "Más de 300 reseñas reales de clientes",
        "icon": "sparkle",
        "accent": "#D4A24C"
      },
      {
        "id": "paciencia",
        "enabled": true,
        "sortOrder": 2,
        "title": "Paciencia ante todo",
        "description": "Si el perro no está tranquilo, se para y se retoma con calma",
        "icon": "shield",
        "accent": "#6E8F5C"
      },
      {
        "id": "barrio",
        "enabled": true,
        "sortOrder": 3,
        "title": "De toda la vida en el barrio",
        "description": "A un paseo de Plaza de España y los Jardines de Sabatini",
        "icon": "pin",
        "accent": "#8B6B4A"
      },
      {
        "id": "puntualidad",
        "enabled": true,
        "sortOrder": 4,
        "title": "Puntualidad y confianza",
        "description": "Se respeta la hora acordada",
        "icon": "clock",
        "accent": "#B5533C"
      }
    ],
    "processSteps": [
      {
        "id": "step-1",
        "enabled": true,
        "sortOrder": 0,
        "title": "Elige el servicio",
        "description": "Encuentra la opción adecuada para su manto y tamaño.",
        "icon": "notes"
      },
      {
        "id": "step-2",
        "enabled": true,
        "sortOrder": 1,
        "title": "Reserva tu cita",
        "description": "Eliges servicio, día y hora entre los huecos que quedan libres.",
        "icon": "calendar"
      },
      {
        "id": "step-3",
        "enabled": true,
        "sortOrder": 2,
        "title": "Disfrutamos juntos",
        "description": "Marcos cuida de tu perro como si fuera suyo.",
        "icon": "heart"
      },
      {
        "id": "step-4",
        "enabled": true,
        "sortOrder": 3,
        "title": "Listo para lucir",
        "description": "Recogida con recomendaciones de mantenimiento.",
        "icon": "sparkle"
      }
    ],
    "petProfile": {
      "heading": {
        "eyebrow": "",
        "title": "",
        "subtitle": ""
      },
      "bullets": [],
      "cta": {
        "label": "",
        "kind": "anchor",
        "target": "#inicio"
      },
      "mockup": {
        "petName": "",
        "breed": "",
        "age": "",
        "customerSince": "",
        "nextAppointment": {
          "service": "",
          "date": "",
          "time": ""
        },
        "history": []
      }
    },
    "newsletter": {
      "enabled": false,
      "title": "",
      "description": "",
      "buttonLabel": "",
      "consentText": "",
      "successMessage": ""
    },
    "ambienceImage": {
      "src": "/assets/templates/canine/marcos-arriaza/hero/marcos-equipo-tres-perros.webp",
      "alt": "Marcos sonriendo junto a tres perros recién peinados sobre la mesa de trabajo",
      "width": 1600,
      "height": 1067,
      "ratio": "3:2",
      "origin": "client",
      "focal": {
        "desktop": [50, 35],
        "tablet": [50, 35],
        "mobile": [50, 30]
      },
      "credit": {
        "author": "Google Maps",
        "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
        "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
        "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
      }
    },
    "finalCta": {
      "title": "",
      "subtitle": "",
      "cta": {
        "label": "",
        "kind": "modal",
        "target": "booking"
      },
      "image": null
    },
    "pricingNote": "Precio orientativo para perro pequeño; el presupuesto final se confirma según tamaño y estado del manto.",
    "packagesSideBenefits": [
      "El precio final se confirma antes de empezar",
      "Producto y técnica adaptados a cada manto",
      "Siempre el mismo peluquero, cita tras cita"
    ],
    "legal": {
      "legalNotice": {
        "title": "Aviso legal",
        "body": "Esta web pertenece a Marcos Arriaza, titular de Peluquería canina MARCOS Arriaza (razón social y NIF pendientes de incorporar a este aviso).\n\nEl acceso y uso de esta web implica la aceptación de estas condiciones. Los contenidos, textos, fotografías y elementos gráficos pertenecen al negocio o se utilizan con su autorización; queda prohibida su reproducción sin autorización previa.\n\nSe prestan servicios de estética e higiene canina. La información publicada tiene carácter orientativo: los precios finales dependen del tamaño, el manto y el estado del pelo de cada animal, y se confirman antes de iniciar el servicio.\n\nNo se prestan servicios veterinarios. Ante cualquier signo de enfermedad, lesión o dolor recomendamos acudir a un centro veterinario.\n\nPara cualquier consulta relacionada con este aviso legal puedes llamar al 619 62 44 49."
      },
      "privacy": {
        "title": "Política de privacidad",
        "body": "Los datos personales facilitados a través de los formularios de esta web se tratan con la finalidad de gestionar solicitudes de cita, responder consultas y prestar el servicio contratado.\n\nLa base jurídica del tratamiento es el consentimiento de la persona interesada y, cuando existe una reserva, la ejecución de la relación de servicio. Los datos se conservan mientras se mantenga la relación y durante los plazos legales aplicables.\n\nLos datos relativos a la salud, las alergias o el comportamiento del animal se utilizan exclusivamente para prestar el servicio con seguridad y no se publican ni se ceden a terceros.\n\nNo se realizan cesiones de datos salvo obligación legal, ni se toman decisiones automatizadas ni se elaboran perfiles comerciales.\n\nPuedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad llamando al 619 62 44 49 e indicando el derecho que deseas ejercer. También puedes reclamar ante la Agencia Española de Protección de Datos."
      },
      "cookies": {
        "title": "Política de cookies",
        "body": "Esta web utiliza únicamente cookies técnicas necesarias para su funcionamiento, como las que recuerdan el estado de los formularios durante la sesión. No se emplean cookies publicitarias ni de perfilado.\n\nSi en el futuro se incorporan servicios de terceros —por ejemplo un mapa embebido o una herramienta de medición— se solicitará el consentimiento previo mediante un aviso específico y no se cargarán hasta que se acepte.\n\nPuedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Bloquear las cookies técnicas puede impedir el uso correcto de los formularios.\n\nPara cualquier duda sobre esta política llama al 619 62 44 49."
      },
      "copyrightNote": "Todos los derechos reservados."
    },
    "footerTagline": "Peluquería canina de barrio, con el cuidado y el tiempo que cada perro necesita.",
    "footerSignature": ""
  },
  /*
   * Nombres alineados con los que se dan de alta en Manager (se emparejan por
   * nombre normalizado, ver `src/manageos/useCatalogo.ts`): en cuanto la web se
   * conecte, precio y duración pasan a mandarlos Manager, y aquí solo quedan el
   * texto, el icono y la foto. Precio/duración de partida son los que ya están
   * verificados en la cuenta de Manager de referencia; a confirmar con Marcos
   * en el alta real si difieren.
   */
  "services": [
    {
      "id": "svc-bano",
      "enabled": true,
      "sortOrder": 0,
      "name": "Baño y secado",
      "slug": "bano-y-secado",
      "shortDescription": "Higiene con champú adaptado y secado profesional.",
      "longDescription": "Baño con champú elegido según el manto y la piel, aclarado completo y secado profesional con cepillado.",
      "priceFromEur": 20,
      "durationMinutes": 60,
      "includes": [
        "Champú adaptado",
        "Aclarado completo",
        "Secado profesional",
        "Cepillado final"
      ],
      "sizes": [
        "Mini",
        "Pequeño",
        "Mediano",
        "Grande"
      ],
      "icon": "bath",
      "accent": "#B5533C",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/gallery/estacion-de-bano.webp",
        "alt": "Estación de baño profesional del local, con azulejo decorativo y pared de ladrillo visto",
        "width": 1200,
        "height": 1600,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [45, 35], "tablet": [45, 35], "mobile": [45, 30] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "svc-corte",
      "enabled": true,
      "sortOrder": 1,
      "name": "Corte y estilismo",
      "slug": "corte-y-estilismo",
      "shortDescription": "Corte según raza, manto y preferencia.",
      "longDescription": "Corte de raza o comercial acordado contigo, con perfilado de cara y patas y acabado a máquina o tijera.",
      "priceFromEur": 30,
      "durationMinutes": 90,
      "includes": [
        "Baño previo",
        "Corte de raza o comercial",
        "Perfilado de cara y patas",
        "Acabado personalizado"
      ],
      "sizes": [
        "Mini",
        "Pequeño",
        "Mediano",
        "Grande"
      ],
      "icon": "scissors",
      "accent": "#8B6B4A",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/hero/marcos-equipo-tres-perros.webp",
        "alt": "Marcos con un caniche, un chihuahua y un maltés recién arreglados",
        "width": 1600,
        "height": 1067,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [50, 30], "tablet": [50, 30], "mobile": [50, 25] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "svc-deslanado",
      "enabled": true,
      "sortOrder": 2,
      "name": "Deslanado",
      "slug": "deslanado",
      "shortDescription": "Retirada de pelo muerto y reducción de muda.",
      "longDescription": "Tratamiento específico para mantos dobles: retiramos el subpelo muerto con producto y técnica, reduciendo la muda en casa.",
      "priceFromEur": 35,
      "durationMinutes": 90,
      "includes": [
        "Producto deslanante",
        "Retirada de subpelo",
        "Secado con soplador",
        "Cepillado final"
      ],
      "sizes": [
        "Pequeño",
        "Mediano",
        "Grande",
        "Gigante"
      ],
      "icon": "brush",
      "accent": "#6E8F5C",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/gallery/resultado-maltes-hogar.webp",
        "alt": "Maltés con el manto sano y esponjado tras el tratamiento, en casa de su familia",
        "width": 1200,
        "height": 1600,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [40, 45], "tablet": [40, 45], "mobile": [40, 40] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "svc-spa",
      "enabled": true,
      "sortOrder": 3,
      "name": "Spa y tratamientos",
      "slug": "spa-y-tratamientos",
      "shortDescription": "Hidratación, nutrición y masaje suave.",
      "longDescription": "Mascarilla hidratante o nutritiva según la necesidad del manto, con masaje suave y acabado perfumado.",
      "priceFromEur": 28,
      "durationMinutes": 60,
      "includes": [
        "Mascarilla hidratante o nutritiva",
        "Masaje suave",
        "Secado y cepillado",
        "Perfume"
      ],
      "sizes": [
        "Mini",
        "Pequeño",
        "Mediano",
        "Grande"
      ],
      "icon": "sparkle",
      "accent": "#D4A24C",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/about/marcos-con-maltes.webp",
        "alt": "Marcos peinando con calma a un maltés sobre la mesa de trabajo",
        "width": 1200,
        "height": 2133,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [42, 22], "tablet": [42, 20], "mobile": [42, 18] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "svc-higiene",
      "enabled": true,
      "sortOrder": 4,
      "name": "Corte de uñas e higiene",
      "slug": "corte-de-unas-e-higiene",
      "shortDescription": "Uñas, oídos y zona perianal.",
      "longDescription": "Corte de uñas, limpieza de oídos y zona perianal. Ideal entre visitas completas.",
      "priceFromEur": 12,
      "durationMinutes": 30,
      "includes": [
        "Corte y limado de uñas",
        "Limpieza externa de oídos",
        "Higiene de zona perianal"
      ],
      "sizes": [
        "Mini",
        "Pequeño",
        "Mediano",
        "Grande"
      ],
      "icon": "nail",
      "accent": "#B5533C",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/gallery/interior-escaparate.webp",
        "alt": "Interior de la peluquería visto desde el escaparate, con la mesa de trabajo junto a la ventana",
        "width": 1200,
        "height": 1600,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [50, 45], "tablet": [50, 45], "mobile": [50, 40] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    }
  ],
  /*
   * Sin paquetes combinados: la plantilla traía "Básico/Completo/Premium
   * Spa" con un precio de bloque inventado que no corresponde a ningún
   * servicio real. `/precios` ahora tira del catálogo real de servicios
   * (ver `PricingPage` en `templates/pages.tsx`) en su lugar. La sección de
   * paquetes de la home queda desactivada en `pages` más abajo por lo mismo.
   */
  "packages": [],
  "plans": [],
  "team": [],
  "gallery": [
    {
      "id": "gal-01",
      "enabled": true,
      "sortOrder": 0,
      "caption": "Marcos, en plena sesión de peinado",
      "serviceName": "Corte y estilismo",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/about/marcos-con-maltes.webp",
        "alt": "Marcos peinando a un maltés en su peluquería, con pared de ladrillo visto al fondo",
        "width": 1200,
        "height": 2133,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [42, 22], "tablet": [42, 20], "mobile": [42, 18] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "gal-02",
      "enabled": true,
      "sortOrder": 1,
      "caption": "El local, visto desde el escaparate",
      "serviceName": "El local",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/gallery/interior-escaparate.webp",
        "alt": "Interior de la peluquería visto desde el escaparate, con la mesa de trabajo junto a la ventana",
        "width": 1200,
        "height": 1600,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [50, 45], "tablet": [50, 45], "mobile": [50, 40] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "gal-03",
      "enabled": true,
      "sortOrder": 2,
      "caption": "Un maltés con el manto sano, ya en casa",
      "serviceName": "Deslanado",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/gallery/resultado-maltes-hogar.webp",
        "alt": "Maltés con el manto sano y esponjado tras el tratamiento, en casa de su familia",
        "width": 1200,
        "height": 1600,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [40, 45], "tablet": [40, 45], "mobile": [40, 40] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "gal-04",
      "enabled": true,
      "sortOrder": 3,
      "caption": "La estación de baño",
      "serviceName": "Baño y secado",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/gallery/estacion-de-bano.webp",
        "alt": "Estación de baño profesional del local, con azulejo decorativo y pared de ladrillo visto",
        "width": 1200,
        "height": 1600,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [45, 35], "tablet": [45, 35], "mobile": [45, 30] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    },
    {
      "id": "gal-05",
      "enabled": true,
      "sortOrder": 4,
      "caption": "Marcos con tres clientes recién arreglados",
      "serviceName": "Corte y estilismo",
      "image": {
        "src": "/assets/templates/canine/marcos-arriaza/hero/marcos-equipo-tres-perros.webp",
        "alt": "Marcos sonriendo junto a un caniche, un chihuahua y un maltés recién peinados",
        "width": 1600,
        "height": 1067,
        "ratio": "4:5",
        "origin": "client",
        "focal": { "desktop": [50, 30], "tablet": [50, 30], "mobile": [50, 25] },
        "credit": {
          "author": "Google Maps",
          "source": "Ficha de Google Business de Peluquería canina MARCOS Arriaza",
          "license": "Foto pública del perfil del negocio, usada con y para el propio negocio",
          "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid"
        }
      }
    }
  ],
  /*
   * Sin antes/después inventados.
   *
   * La plantilla original comparaba dos fotos por perro para vender la
   * transformación. No tenemos ningún par "antes/después" verificado de
   * Marcos —solo fotos sueltas de su ficha de Google—, y presentar dos fotos
   * cualquiera como si fueran el mismo perro sería falsificar una prueba, no
   * adaptar contenido. Se deja vacío a propósito: `ReviewAndTransformations`
   * (en `templates/peludosAndCo.tsx`) usa en su lugar la galería real de
   * `config.gallery` para esta misma sección de la home.
   */
  "transformations": [],
  "testimonials": [
    {
      "id": "tst-01",
      "enabled": true,
      "sortOrder": 0,
      "author": "Myriam S.",
      "petName": "",
      "rating": 5,
      "text": "No puedo estar más contenta con el servicio. Desde el primer momento se nota la pasión, la profesionalidad y el cariño con el que trabaja el dueño. Trata a los perros con una paciencia y un respeto excepcionales.",
      "avatar": null
    },
    {
      "id": "tst-02",
      "enabled": true,
      "sortOrder": 1,
      "author": "Elena A.",
      "petName": "",
      "rating": 5,
      "text": "Después de un campamento perruno, mis perritas necesitaban un buen baño. Me dijeron que confiase en las manos de Marcos y ha sido todo un acierto. La atención es súper cercana.",
      "avatar": null
    },
    {
      "id": "tst-03",
      "enabled": true,
      "sortOrder": 2,
      "author": "Beto G.",
      "petName": "",
      "rating": 5,
      "text": "Llevamos a nuestra cachorra de Bichón Maltés a su primer servicio de peluquería y ha sido un gran acierto: muy profesional, y se nota el cuidado y el cariño en lo que hacen. El resultado nos ha dejado más que contentos, ¡repetiremos seguro!",
      "avatar": null
    }
  ],
  "faqs": [],
  "booking": {
    "mode": "pending-request",
    "scheduleConnected": false,
    "fields": [
      {
        "name": "ownerName",
        "label": "Nombre y apellidos",
        "step": 1,
        "required": true,
        "enabled": true
      },
      {
        "name": "phone",
        "label": "Teléfono",
        "step": 1,
        "required": true,
        "enabled": true
      },
      {
        "name": "email",
        "label": "Correo electrónico",
        "step": 2,
        "required": true,
        "enabled": true
      },
      {
        "name": "petName",
        "label": "Nombre de la mascota",
        "step": 1,
        "required": true,
        "enabled": true
      },
      {
        "name": "breed",
        "label": "Raza",
        "step": 2,
        "required": false,
        "enabled": true
      },
      {
        "name": "size",
        "label": "Tamaño",
        "step": 2,
        "required": true,
        "enabled": true
      },
      {
        "name": "age",
        "label": "Edad (años)",
        "step": 2,
        "required": false,
        "enabled": true
      },
      {
        "name": "service",
        "label": "Servicio",
        "step": 1,
        "required": true,
        "enabled": true
      },
      {
        "name": "professional",
        "label": "Profesional preferido",
        "step": 2,
        "required": false,
        "enabled": true
      },
      {
        "name": "date",
        "label": "Fecha preferida",
        "step": 1,
        "required": true,
        "enabled": true
      },
      {
        "name": "time",
        "label": "Hora preferida",
        "step": 2,
        "required": false,
        "enabled": true
      },
      {
        "name": "notes",
        "label": "Observaciones",
        "step": 1,
        "required": false,
        "enabled": true
      },
      {
        "name": "allergies",
        "label": "Alergias o necesidades especiales",
        "step": 2,
        "required": false,
        "enabled": true
      },
      {
        "name": "consent",
        "label": "Consentimiento de privacidad",
        "step": 2,
        "required": true,
        "enabled": true
      }
    ],
    "professionalsSelectable": false,
    "timeSlots": [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "16:00",
      "17:00",
      "18:00"
    ],
    "sizes": [
      "Mini (hasta 5 kg)",
      "Pequeño (5–10 kg)",
      "Mediano (10–25 kg)",
      "Grande (25–40 kg)",
      "Gigante (+40 kg)"
    ],
    "confirmationTitle": "Hemos recibido tu solicitud",
    "confirmationMessage": "Es un acuse de recibo: buscamos el mejor horario y te confirmamos el hueco.",
    "privacyText": "He leído y acepto la política de privacidad y autorizo el contacto para gestionar esta solicitud.",
    "whatsappTemplate": "Hola, he solicitado {servicio} para {mascota} el {fecha}. ¿Podéis confirmarme el hueco?"
  },
  "contact": {
    "mapEmbedUrl": "https://www.openstreetmap.org/export/embed.html?bbox=-3.7260%2C40.4162%2C-3.7060%2C40.4262&layer=mapnik&marker=40.4212%2C-3.716",
    "mapLinkUrl": "https://www.openstreetmap.org/?mlat=40.4212&mlon=-3.716#map=17/40.4212/-3.716",
    /*
     * Sin Instagram, Facebook ni TikTok: no hay ningún perfil verificado en
     * su ficha pública, e inventar un enlace sería peor que no ofrecer
     * ninguno. Se deja solo la ficha real de Google, que sí se pudo
     * verificar directamente.
     */
    "socialLinks": [
      {
        "network": "google",
        "url": "https://www.google.com/maps/search/Peluqueria+canina+Marcos+Arriaza+Calle+de+Arriaza+7+Madrid",
        "label": "Ficha de Peluquería canina MARCOS Arriaza en Google Maps"
      }
    ]
  },
  "pages": [
    {
      "id": "inicio",
      "name": "Inicio",
      "route": "/",
      "sortOrder": 0,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "pco-s-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio-header",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "pco-s-hero",
          "type": "hero",
          "variantId": "pco-hero-01",
          "anchor": "inicio",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": false
        },
        {
          "id": "pco-s-services",
          "type": "services",
          "variantId": "pco-services-01",
          "anchor": "servicios",
          "sortOrder": 2,
          "enabled": true,
          "required": false,
          "fixed": false
        },
        {
          "id": "pco-s-packages",
          "type": "packages",
          "variantId": "pco-packages-01",
          "anchor": "paquetes",
          "sortOrder": 3,
          /* Desactivada: sin paquetes combinados verificados (ver config.packages). */
          "enabled": false,
          "required": false,
          "fixed": false
        },
        {
          "id": "pco-s-process",
          "type": "process",
          "variantId": "pco-process-01",
          "anchor": "proceso",
          "sortOrder": 4,
          "enabled": true,
          "required": false,
          "fixed": false
        },
        {
          "id": "pco-s-benefits",
          "type": "benefits",
          "variantId": "pco-benefits-01",
          "anchor": "por-que-elegirnos",
          "sortOrder": 5,
          "enabled": true,
          "required": false,
          "fixed": false
        },
        {
          "id": "pco-s-proof",
          "type": "testimonials",
          "variantId": "pco-testimonials-01",
          "anchor": "testimonios",
          "sortOrder": 6,
          "enabled": true,
          "required": false,
          "fixed": false
        },
        {
          "id": "pco-s-booking",
          "type": "booking",
          "variantId": "pco-booking-01",
          "anchor": "reserva",
          "sortOrder": 7,
          "enabled": true,
          "required": true,
          "fixed": false
        },
        {
          "id": "pco-s-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 8,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "servicios",
      "name": "Servicios",
      "route": "/servicios",
      "sortOrder": 1,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "servicios-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "servicios-content",
          "type": "services",
          "variantId": "common-services-01",
          "anchor": "servicios-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "servicios-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "tarifas",
      "name": "Precios",
      "route": "/precios",
      "sortOrder": 2,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "tarifas-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "tarifas-content",
          "type": "packages",
          "variantId": "common-pricing-01",
          "anchor": "tarifas-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "tarifas-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "galeria",
      "name": "Galería",
      "route": "/galeria",
      "sortOrder": 3,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "galeria-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "galeria-content",
          "type": "gallery",
          "variantId": "common-gallery-01",
          "anchor": "galeria-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "galeria-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "sobre-nosotros",
      "name": "Sobre nosotros",
      "route": "/sobre-nosotros",
      "sortOrder": 4,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "sobre-nosotros-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "sobre-nosotros-content",
          "type": "benefits",
          "variantId": "common-about-01",
          "anchor": "sobre-nosotros-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "sobre-nosotros-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "contacto",
      "name": "Contacto",
      "route": "/contacto",
      "sortOrder": 5,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "contacto-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "contacto-content",
          "type": "contact",
          "variantId": "common-contact-01",
          "anchor": "contacto-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "contacto-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "reservar",
      "name": "Reservar",
      "route": "/reservar",
      "sortOrder": 6,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "reservar-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "reservar-content",
          "type": "booking",
          "variantId": "common-booking-01",
          "anchor": "reservar-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "reservar-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "aviso-legal",
      "name": "Aviso legal",
      "route": "/aviso-legal",
      "sortOrder": 7,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "aviso-legal-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "aviso-legal-content",
          "type": "contact",
          "variantId": "common-legal-01",
          "anchor": "aviso-legal-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "aviso-legal-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "privacidad",
      "name": "Política de privacidad",
      "route": "/privacidad",
      "sortOrder": 8,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "privacidad-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "privacidad-content",
          "type": "contact",
          "variantId": "common-legal-01",
          "anchor": "privacidad-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "privacidad-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    },
    {
      "id": "cookies",
      "name": "Política de cookies",
      "route": "/cookies",
      "sortOrder": 9,
      "themeOverrideId": null,
      "sections": [
        {
          "id": "cookies-header",
          "type": "header",
          "variantId": "pco-header-01",
          "anchor": "inicio",
          "sortOrder": 0,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "cookies-content",
          "type": "contact",
          "variantId": "common-legal-01",
          "anchor": "cookies-contenido",
          "sortOrder": 1,
          "enabled": true,
          "required": true,
          "fixed": true
        },
        {
          "id": "cookies-footer",
          "type": "footer",
          "variantId": "pco-footer-01",
          "anchor": "contacto",
          "sortOrder": 2,
          "enabled": true,
          "required": true,
          "fixed": true
        }
      ]
    }
  ],
  "tokenOverrides": {},
  "collectionSchemas": [],
  "collections": {},
  "forms": [],
  "motion": {
    "version": 1,
    "style": "suave",
    "intensity": 45,
    "durationMs": 520,
    "delayMs": 0,
    "staggerMs": 70,
    "scrollBehavior": "once",
    "threshold": 0.15,
    "cards": "lift",
    "images": "none",
    "background": "none",
    "header": "shrink",
    "buttons": "press",
    "icons": "none",
    "gallery": "fade",
    "counters": true,
    "pageTransitions": true,
    "sections": {
      "pco-s-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-hero": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-services": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-packages": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-process": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-benefits": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-proof": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-booking": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "pco-s-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "servicios-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "servicios-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "servicios-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "tarifas-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "tarifas-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "tarifas-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "galeria-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "galeria-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "galeria-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "sobre-nosotros-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "sobre-nosotros-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "sobre-nosotros-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "contacto-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "contacto-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "contacto-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "reservar-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "reservar-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "reservar-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "aviso-legal-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "aviso-legal-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "aviso-legal-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "privacidad-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "privacidad-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "privacidad-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "cookies-header": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "cookies-content": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      },
      "cookies-footer": {
        "entry": "fade-up",
        "stagger": true,
        "delayMs": 0,
        "disabled": false
      }
    }
  },
  "bindings": {},
  "routes": {
    "home": "/",
    "services": "/servicios",
    "contact": "/contacto",
    "booking": "/reservar",
    "faq": "/preguntas",
    "about": "/sobre-nosotros",
    "legalNotice": "/aviso-legal",
    "privacy": "/privacidad",
    "cookies": "/cookies"
  },
  "schemaVersion": 4
};
