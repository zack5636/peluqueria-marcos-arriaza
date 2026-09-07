import { useMemo, useRef, useState, type ReactNode } from 'react';
import { activeItems, itemBool, itemImage, itemList, itemText, type CollectionItem } from '../../collections';
import { getForm } from '../../forms';
import type { SectionComponent } from '../../registry';
import { useSite } from '../../context';
import { useActiveSection, useStickyHeader } from '../../hooks';
import { Accordion } from '../../components/Accordion';
import { BrandMark } from '../../components/BrandMark';
import { Icon } from '../../components/Icon';
import { MobileDrawer } from '../../components/MobileDrawer';
import { SiteForm } from '../../components/SiteForm';
import { Container, CtaButton, Heading, Picture, SectionShell } from '../../components/primitives';

const EMPTY_HEADING = { eyebrow: '', title: '', subtitle: '' };

const budgetCta = (label = 'Solicitar presupuesto') => ({ label, kind: 'route' as const, target: '/solicitar-presupuesto' });

function byId(items: CollectionItem[], id: string) { return items.find((item) => item.id === id); }
function relatedNames(items: CollectionItem[], ids: string[]) { return ids.map((id) => byId(items, id)).filter(Boolean).map((item) => itemText(item!, 'nombre')); }
function useSlug(prefix: string) {
  const { route } = useSite();
  const path = route.split('?')[0].replace(/\/+$/, '');
  return path.startsWith(`${prefix}/`) ? path.slice(prefix.length + 1) || null : null;
}

const Header: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const stuck = useStickyHeader(32);
  const items = useMemo(() => config.navigation.items.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder), [config.navigation.items]);
  const activeId = useActiveSection(items);
  return <SectionShell anchor={section.anchor} as="header" className="cp-header" label="Cabecera">
    <div className={`cp-header__bar${stuck ? ' is-stuck' : ''}`} data-wf-header>
      <Container className="cp-header__inner">
        <button className="cp-header__brand" type="button" onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}>
          <BrandMark icon="ruler" size={30} /><span><strong>{config.business.name}</strong><em>{config.business.tagline}</em></span>
        </button>
        <nav className="cp-header__nav" aria-label="Navegación principal">{items.map((item) => <button key={item.id} type="button" aria-current={activeId === item.id ? 'page' : undefined} className={activeId === item.id ? 'is-active' : ''} onClick={() => runCta(item.cta)}>{item.label}</button>)}</nav>
        <div className="cp-header__actions"><CtaButton cta={config.navigation.primaryCta} size="sm" /><button ref={triggerRef} className="cp-header__burger" type="button" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" size={24} /></button></div>
      </Container>
    </div>
    <MobileDrawer open={open} onClose={() => setOpen(false)} items={items} activeId={activeId} triggerRef={triggerRef} footer={<CtaButton cta={config.navigation.primaryCta} full />} />
  </SectionShell>;
};

const Hero: SectionComponent = ({ section }) => {
  const { config } = useSite(); const hero = config.content.hero;
  return <SectionShell anchor={section.anchor} className="cp-hero">
    <span className="cp-hero__grain" data-wf-motion-layer aria-hidden="true" />
    <Container className="cp-hero__grid">
      <div className="cp-hero__copy" data-wf-entry="fade-up"><p className="cp-kicker">{hero.eyebrow}</p><h1>{hero.title} <em>{hero.titleHighlight}</em></h1><p>{hero.paragraph}</p><div className="cp-actions"><CtaButton cta={hero.primaryCta} size="lg" /><CtaButton cta={hero.secondaryCta!} variant="link" size="lg" /></div><small>{hero.note}</small></div>
      <div className="cp-hero__media" data-wf-media-frame data-wf-entry="fade"><Picture image={hero.image} loading="eager" className="cp-cover" /></div>
      <ol className="cp-hero__facts" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: hero.microBenefits.length }}>{hero.microBenefits.map((fact, index) => <li key={fact.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${index * 70}ms` }}><span>0{index + 1}</span><div data-wf-card-body><strong>{fact.label}</strong><p>{fact.description}</p></div></li>)}</ol>
    </Container>
  </SectionShell>;
};

function SectionIntro({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: ReactNode }) {
  return <div className="cp-section-head" data-wf-entry="fade-up"><div><p className="cp-kicker">{eyebrow}</p><h2>{title}</h2>{text ? <p>{text}</p> : null}</div>{action}</div>;
}

const Categories: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite(); const items = activeItems(config.collections ?? {}, 'categorias-proyecto');
  return <SectionShell anchor={section.anchor} className="cp-section cp-categories"><Container><SectionIntro eyebrow="Categorías" title="Una respuesta propia para cada espacio" text="Explora proyectos por escala y uso." />
    <div className="cp-categories__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 4 }}>{items.map((item, i) => <article key={item.id} data-wf-card data-wf-entry="fade-up" style={{ ['--wf-entry-delay' as string]: `${i * 60}ms` }}><div data-wf-card-media><Picture image={itemImage(item, 'imagen')} /></div><div data-wf-card-body><span>0{i + 1}</span><h3 data-wf-card-title>{itemText(item, 'nombre')}</h3><p>{itemText(item, 'descripcion')}</p></div><div data-wf-card-actions><button type="button" className="cp-text-link" onClick={() => runCta({ label: itemText(item, 'cta'), kind: 'route', target: `/categorias/${itemText(item, 'slug')}` })}>{itemText(item, 'cta')} <Icon name="arrowRight" size={16} /></button></div></article>)}</div>
  </Container></SectionShell>;
};

function ProjectCards({ projects }: { projects: CollectionItem[] }) {
  const { runCta } = useSite();
  return <div className="cp-projects__grid" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>{projects.map((item, index) => <article key={item.id} className={index === 0 ? 'is-featured' : ''} data-wf-card data-wf-entry="fade-up"><div data-wf-card-media><Picture image={itemImage(item, 'imagen')} /></div><div data-wf-card-body><p className="cp-meta">{itemText(item, 'ubicacion')}</p><h3 data-wf-card-title>{itemText(item, 'titulo')}</h3><p>{itemText(item, 'resumen')}</p></div><div data-wf-card-actions><button className="cp-text-link" type="button" onClick={() => runCta({ label: 'Ver proyecto', kind: 'route', target: `/proyectos/${itemText(item, 'slug')}` })}>Ver proyecto <Icon name="arrowRight" size={16} /></button></div></article>)}</div>;
}

const Projects: SectionComponent = ({ section }) => {
  const { config } = useSite(); const items = activeItems(config.collections ?? {}, 'proyectos').filter((item) => itemBool(item, 'destacado'));
  return <SectionShell anchor={section.anchor} className="cp-section cp-projects"><Container><SectionIntro eyebrow="Proyectos seleccionados" title="El detalle empieza por entender el problema" text="Cada caso explica el espacio de partida, las decisiones y el resultado." action={<CtaButton cta={{ label: 'Ver todo el portfolio', kind: 'route', target: '/proyectos' }} variant="link" />} /><ProjectCards projects={items.length ? items : activeItems(config.collections ?? {}, 'proyectos').slice(0, 3)} /></Container></SectionShell>;
};

const Services: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite(); const items = activeItems(config.collections ?? {}, 'servicios-carpinteria'); const heading = config.content.headings.services ?? EMPTY_HEADING;
  return <SectionShell anchor={section.anchor} className="cp-section cp-services"><Container><Heading heading={heading} align="left" /><div className="cp-services__list" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>{items.map((item, index) => <article key={item.id} data-wf-card data-wf-entry="fade-up"><div data-wf-card-body><span className="cp-index">0{index + 1}</span><h3 data-wf-card-title>{itemText(item, 'titulo')}</h3><p>{itemText(item, 'resumen')}</p><ul>{itemList(item, 'beneficios').slice(0, 3).map((x) => <li key={x}>{x}</li>)}</ul></div><div data-wf-card-actions><button type="button" className="cp-text-link" onClick={() => runCta({ label: 'Ver servicio', kind: 'route', target: `/servicios/${itemText(item, 'slug')}` })}>Ver servicio <Icon name="arrowRight" size={16} /></button></div></article>)}</div></Container></SectionShell>;
};

const Materials: SectionComponent = ({ section }) => {
  const { config } = useSite(); const materials = activeItems(config.collections ?? {}, 'materiales'); const finishes = activeItems(config.collections ?? {}, 'acabados');
  return <SectionShell anchor={section.anchor} className="cp-section cp-materials"><Container><SectionIntro eyebrow="Materia" title="La superficie cuenta parte de la historia" text="Seleccionamos por aspecto, uso, mantenimiento y coherencia con el proyecto." /><div className="cp-materials__grid"><div className="cp-samples" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>{materials.map((item) => <article key={item.id} data-wf-card><div data-wf-card-media><Picture image={itemImage(item, 'imagen')} /></div><div data-wf-card-body><h3>{itemText(item, 'nombre')}</h3><p>{itemText(item, 'descripcion')}</p></div></article>)}</div><aside><p className="cp-kicker">Acabados</p>{finishes.map((item) => <div key={item.id}><strong>{itemText(item, 'nombre')}</strong><span>{itemText(item, 'aspecto')}</span></div>)}<CtaButton cta={{ label: 'Comparar materiales', kind: 'route', target: '/materiales-acabados' }} variant="link" /></aside></div></Container></SectionShell>;
};

const Process: SectionComponent = ({ section }) => {
  const { config } = useSite(); const phases = activeItems(config.collections ?? {}, 'fases-proceso');
  return <SectionShell anchor={section.anchor} className="cp-section cp-process"><Container><Heading heading={config.content.headings.process ?? EMPTY_HEADING} align="left" /><ol>{phases.map((item, index) => <li key={item.id} data-wf-entry="fade-up"><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{itemText(item, 'titulo')}</h3><p>{itemText(item, 'descripcion')}</p></div><em>{itemText(item, 'duracion')}</em></li>)}</ol></Container></SectionShell>;
};

const Workshop: SectionComponent = ({ section }) => {
  const { config } = useSite();
  return <SectionShell anchor={section.anchor} className="cp-section cp-workshop"><Container className="cp-workshop__grid"><div data-wf-media-frame><Picture image={config.content.ambienceImage} /></div><div data-wf-entry="fade-up"><p className="cp-kicker">Taller propio</p><h2>El proyecto se comprueba mientras toma forma</h2><p>El trabajo de taller permite ensayar encuentros, controlar el acabado y preparar un montaje más limpio. Añade aquí fotografías reales del espacio, las herramientas y el equipo.</p><ul><li>Despiece y mecanizado coordinados</li><li>Presentación en seco cuando el proyecto lo requiere</li><li>Control antes de salir a montaje</li></ul><CtaButton cta={{ label: 'Conocer el taller', kind: 'route', target: '/taller' }} variant="secondary" /></div></Container></SectionShell>;
};

const Testimonials: SectionComponent = ({ section }) => {
  const { config } = useSite(); const items = activeItems(config.collections ?? {}, 'testimonios-carpinteria');
  return <SectionShell anchor={section.anchor} className="cp-section cp-testimonials"><Container><Heading heading={config.content.headings.testimonials ?? EMPTY_HEADING} align="left" /><div data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 2 }}>{items.map((item) => <blockquote key={item.id} data-wf-card><div data-wf-card-body><p>“{itemText(item, 'texto')}”</p></div><footer data-wf-card-actions><strong>{itemText(item, 'autor')}</strong><span>{itemText(item, 'proyecto')}</span></footer></blockquote>)}</div></Container></SectionShell>;
};

const Faq: SectionComponent = ({ section }) => {
  const { config } = useSite(); const items = activeItems(config.collections ?? {}, 'preguntas-carpinteria');
  return <SectionShell anchor={section.anchor} className="cp-section cp-faq"><Container><Heading heading={config.content.headings.faq ?? EMPTY_HEADING} align="left" /><Accordion items={items.map((item) => ({ id: item.id, question: itemText(item, 'pregunta'), answer: itemText(item, 'respuesta') }))} mode="multiple" icon="chevron" /></Container></SectionShell>;
};

const FinalCta: SectionComponent = ({ section }) => {
  const { config } = useSite(); const cta = config.content.finalCta;
  return <SectionShell anchor={section.anchor} className="cp-final"><Container><div data-wf-entry="fade-up"><p className="cp-kicker">Primer paso</p><h2>{cta.title}</h2><p>{cta.subtitle}</p><CtaButton cta={cta.cta} variant="inverse" size="lg" /></div><span aria-hidden="true">LV</span></Container></SectionShell>;
};

const Footer: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite(); const items = config.navigation.items.filter((item) => item.enabled);
  return <SectionShell anchor={section.anchor} as="footer" className="cp-footer"><Container><div className="cp-footer__brand"><BrandMark icon="ruler" size={30} /><h2>{config.business.name}</h2><p>{config.content.footerTagline}</p></div><nav aria-label="Navegación de pie">{items.slice(0, 8).map((item) => <button key={item.id} type="button" onClick={() => runCta(item.cta)}>{item.label}</button>)}</nav><address><a href={`tel:${config.business.phone}`}>{config.business.phone}</a><a href={`mailto:${config.business.email}`}>{config.business.email}</a><span>{config.business.address.city} · {config.business.serviceArea}</span></address><div className="cp-footer__bottom"><span>{config.content.footerSignature}</span><button type="button" onClick={() => runCta({ label: 'Privacidad', kind: 'route', target: '/privacidad' })}>Privacidad</button><button type="button" onClick={() => runCta({ label: 'Cookies', kind: 'route', target: '/cookies' })}>Cookies</button></div></Container></SectionShell>;
};

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="cp-page-hero"><Container><p className="cp-kicker">{eyebrow}</p><h1>{title}</h1><p>{text}</p></Container></div>; }

function Detail({ item, kind }: { item: CollectionItem; kind: 'project' | 'service' | 'category' | 'material' | 'finish' }) {
  const { config } = useSite(); const materials = activeItems(config.collections ?? {}, 'materiales'); const finishes = activeItems(config.collections ?? {}, 'acabados');
  const title = itemText(item, kind === 'project' ? 'titulo' : kind === 'service' ? 'titulo' : 'nombre'); const description = itemText(item, kind === 'project' ? 'descripcion' : kind === 'service' ? 'contenido' : 'descripcion');
  return <><PageHero eyebrow={kind === 'project' ? 'Proyecto' : kind === 'service' ? 'Servicio' : kind === 'category' ? 'Categoría' : kind === 'finish' ? 'Acabado' : 'Material'} title={title} text={kind === 'project' ? itemText(item, 'resumen') : description} /><Container className="cp-detail"><div data-wf-media-frame><Picture image={itemImage(item, 'imagen')} /></div><article><p>{description}</p>{kind === 'project' ? <><h2>Del punto de partida al resultado</h2><dl><dt>Necesidad</dt><dd>{itemText(item, 'necesidad')}</dd><dt>Solución</dt><dd>{itemText(item, 'solucion')}</dd><dt>Resultado</dt><dd>{itemText(item, 'resultado')}</dd></dl><p className="cp-tags">{relatedNames(materials, itemList(item, 'materiales')).concat(relatedNames(finishes, itemList(item, 'acabados'))).join(' · ')}</p></> : null}{kind === 'service' ? <><h2>Qué aporta</h2><ul>{itemList(item, 'beneficios').map((x) => <li key={x}>{x}</li>)}</ul><h2>Cómo se realiza</h2><ol>{itemList(item, 'proceso').map((x) => <li key={x}>{x}</li>)}</ol></> : null}{kind === 'finish' ? <><h2>Aspecto y cuidados</h2><dl><dt>Aspecto</dt><dd>{itemText(item, 'aspecto')}</dd><dt>Cuidados</dt><dd>{itemText(item, 'cuidados')}</dd></dl></> : null}<CtaButton cta={budgetCta()} /></article></Container></>;
}

const PageContent: SectionComponent = ({ section }) => {
  const { config, route } = useSite(); const collections = config.collections ?? {}; const path = route.split('?')[0].replace(/\/+$/, '') || '/';
  const projectSlug = useSlug('/proyectos'); const serviceSlug = useSlug('/servicios'); const categorySlug = useSlug('/categorias'); const materialSlug = useSlug('/materiales'); const finishSlug = useSlug('/acabados');
  if (projectSlug) { const item = activeItems(collections, 'proyectos').find((x) => itemText(x, 'slug') === projectSlug); return <SectionShell anchor={section.anchor} className="cp-page">{item ? <Detail item={item} kind="project" /> : <PageHero eyebrow="Portfolio" title="Proyecto no encontrado" text="El proyecto solicitado ya no está publicado." />}</SectionShell>; }
  if (serviceSlug) { const item = activeItems(collections, 'servicios-carpinteria').find((x) => itemText(x, 'slug') === serviceSlug); return <SectionShell anchor={section.anchor} className="cp-page">{item ? <Detail item={item} kind="service" /> : <PageHero eyebrow="Servicios" title="Servicio no encontrado" text="Consulta el catálogo actualizado." />}</SectionShell>; }
  if (categorySlug) { const item = activeItems(collections, 'categorias-proyecto').find((x) => itemText(x, 'slug') === categorySlug); const projects = activeItems(collections, 'proyectos').filter((x) => itemText(x, 'categoria') === item?.id); return <SectionShell anchor={section.anchor} className="cp-page">{item ? <><Detail item={item} kind="category" /><Container className="cp-page__related"><h2>Proyectos de esta categoría</h2><ProjectCards projects={projects} /></Container></> : <PageHero eyebrow="Categorías" title="Categoría no encontrada" text="Consulta las categorías publicadas." />}</SectionShell>; }
  if (materialSlug) { const item = activeItems(collections, 'materiales').find((x) => itemText(x, 'slug') === materialSlug); return <SectionShell anchor={section.anchor} className="cp-page">{item ? <Detail item={item} kind="material" /> : <PageHero eyebrow="Materiales" title="Material no encontrado" text="Consulta la selección disponible." />}</SectionShell>; }
  if (finishSlug) { const item = activeItems(collections, 'acabados').find((x) => itemText(x, 'slug') === finishSlug); return <SectionShell anchor={section.anchor} className="cp-page">{item ? <Detail item={item} kind="finish" /> : <PageHero eyebrow="Acabados" title="Acabado no encontrado" text="Consulta la selección disponible." />}</SectionShell>; }

  const projects = activeItems(collections, 'proyectos'); const services = activeItems(collections, 'servicios-carpinteria'); const categories = activeItems(collections, 'categorias-proyecto');
  if (path === '/proyectos') return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Portfolio" title="Proyectos construidos alrededor de un lugar" text="Filtra por categoría y abre cada caso para conocer necesidad, solución y resultado." /><Container><ProjectCards projects={projects} /></Container></SectionShell>;
  if (path === '/servicios') return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Servicios" title="Un proceso completo, con responsabilidades claras" text="Diseño, fabricación e instalación conectados por una misma definición." /><Container className="cp-page-list">{services.map((item) => <DetailLink key={item.id} item={item} prefix="/servicios" titleKey="titulo" />)}</Container></SectionShell>;
  if (path === '/categorias') return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Categorías" title="Trabajos por uso y escala" text="Cada categoría reúne proyectos relacionados y conserva su propia ficha." /><Container className="cp-page-list">{categories.map((item) => <DetailLink key={item.id} item={item} prefix="/categorias" titleKey="nombre" />)}</Container></SectionShell>;
  if (path === '/materiales-acabados') return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Materiales y acabados" title="Elegir también es entender el uso" text="Compara aspecto, características, aplicaciones y cuidados antes de decidir." /><Container className="cp-library"><h2>Materiales</h2>{activeItems(collections, 'materiales').map((item) => <DetailLink key={item.id} item={item} prefix="/materiales" titleKey="nombre" />)}<h2>Acabados</h2>{activeItems(collections, 'acabados').map((item) => <DetailLink key={item.id} item={item} prefix="/acabados" titleKey="nombre" />)}</Container></SectionShell>;
  if (path === '/proceso') return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Proceso" title="De una necesidad difusa a una pieza instalada" text="Seis fases editables mantienen decisiones, expectativas y responsabilidades ordenadas." /><Container className="cp-process cp-process--page"><ol>{activeItems(collections, 'fases-proceso').map((item, i) => <li key={item.id}><span>{String(i + 1).padStart(2, '0')}</span><div><h2>{itemText(item, 'titulo')}</h2><p>{itemText(item, 'descripcion')}</p></div><em>{itemText(item, 'duracion')}</em></li>)}</ol></Container></SectionShell>;
  if (path === '/taller' || path === '/sobre-nosotros') return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow={path === '/taller' ? 'El taller' : 'Sobre nosotros'} title={path === '/taller' ? 'Donde el dibujo se encuentra con la materia' : 'Un equipo pequeño para proyectos que requieren atención'} text={path === '/taller' ? 'El espacio de fabricación, las pruebas y el control antes de montar.' : 'Diseño, oficio y coordinación reunidos bajo una misma responsabilidad.'} /><Container className="cp-story"><div data-wf-media-frame><Picture image={config.content.ambienceImage} /></div><article><h2>{path === '/taller' ? 'Fabricar también es anticipar' : 'Una forma de trabajar'}</h2><p>Trabajamos con una secuencia visible: escuchar, definir, fabricar, instalar y revisar. La web evita atribuir certificaciones, años de experiencia o garantías que el negocio no haya confirmado.</p><h3>Qué puedes completar aquí</h3><ul><li>Historia real del taller y del equipo</li><li>Fotografías propias del proceso</li><li>Capacidades, maquinaria y colaboradores verificables</li></ul><CtaButton cta={budgetCta('Visitar o consultar')} /></article></Container></SectionShell>;
  if (path === '/preguntas') { const faq = activeItems(collections, 'preguntas-carpinteria'); return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Preguntas frecuentes" title="Información útil antes de encargar" text="Respuestas editables sobre definición, plazos, materiales, montaje y cambios." /><Container><Accordion items={faq.map((item) => ({ id: item.id, question: itemText(item, 'pregunta'), answer: itemText(item, 'respuesta') }))} mode="multiple" icon="chevron" /></Container></SectionShell>; }
  if (path === '/solicitar-presupuesto') { const form = getForm(config.forms ?? [], 'solicitar-presupuesto-portfolio'); return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Solicitar presupuesto" title="Cuéntanos el espacio, no solo el mueble" text="Recogeremos el tipo de proyecto, medidas, rango, materiales y datos de contacto con etiquetas comprensibles." /><Container className="cp-budget"><div>{form ? <SiteForm form={form} columns={2} /> : <p>Formulario no configurado.</p>}</div><aside data-wf-card><h2>Qué ocurre después</h2><ol><li>Revisamos la información.</li><li>Te contactamos para concretar dudas.</li><li>Si encaja, planificamos visita y definición.</li></ol><p><strong>{config.business.phone}</strong><br />{config.business.email}</p></aside></Container></SectionShell>; }
  const legal = config.content.legal; const doc = path === '/privacidad' ? legal.privacy : path === '/cookies' ? legal.cookies : legal.legalNotice;
  return <SectionShell anchor={section.anchor} className="cp-page"><PageHero eyebrow="Información legal" title={doc.title} text="Información del responsable y condiciones de uso." /><Container className="cp-legal">{doc.body.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</Container></SectionShell>;
};

function DetailLink({ item, prefix, titleKey }: { item: CollectionItem; prefix: string; titleKey: string }) {
  const { runCta } = useSite(); return <article data-wf-card><div data-wf-card-media><Picture image={itemImage(item, 'imagen')} /></div><div data-wf-card-body><h2 data-wf-card-title>{itemText(item, titleKey)}</h2><p>{itemText(item, 'resumen', itemText(item, 'descripcion'))}</p></div><div data-wf-card-actions><button className="cp-text-link" type="button" onClick={() => runCta({ label: 'Abrir ficha', kind: 'route', target: `${prefix}/${itemText(item, 'slug')}` })}>Abrir ficha <Icon name="arrowRight" size={16} /></button></div></article>;
}

export const CARPINTERIA_PORTFOLIO_SECTIONS: Record<string, SectionComponent> = {
  'cp-header-01': Header, 'cp-hero-01': Hero, 'cp-categorias-01': Categories, 'cp-proyectos-01': Projects,
  'cp-servicios-01': Services, 'cp-materiales-01': Materials, 'cp-proceso-01': Process, 'cp-taller-01': Workshop,
  'cp-testimonios-01': Testimonials, 'cp-faq-01': Faq, 'cp-final-01': FinalCta, 'cp-footer-01': Footer,
  'cp-page-proyectos-01': PageContent, 'cp-page-servicios-01': PageContent, 'cp-page-categorias-01': PageContent,
  'cp-page-materiales-01': PageContent, 'cp-page-proceso-01': PageContent, 'cp-page-taller-01': PageContent,
  'cp-page-nosotros-01': PageContent, 'cp-page-faq-01': PageContent, 'cp-page-presupuesto-01': PageContent, 'cp-page-legal-01': PageContent,
};
