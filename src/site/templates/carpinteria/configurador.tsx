import { useMemo, useRef, useState } from 'react';
import { activeItems, itemImage, itemList, itemText, type CollectionItem } from '../../collections';
import { getForm } from '../../forms';
import type { SectionComponent } from '../../registry';
import { useSite } from '../../context';
import { useActiveSection } from '../../hooks';
import { Accordion } from '../../components/Accordion';
import { BrandMark } from '../../components/BrandMark';
import { Icon } from '../../components/Icon';
import { MobileDrawer } from '../../components/MobileDrawer';
import { SiteForm } from '../../components/SiteForm';
import { Container, CtaButton, Picture, SectionShell } from '../../components/primitives';

const configureCta = (label = 'Empezar configuración') => ({ label, kind: 'route' as const, target: '/configura-tu-proyecto' });
const collectionTitle = (item: CollectionItem) => itemText(item, 'nombre', itemText(item, 'titulo'));

const Header: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite(); const [open, setOpen] = useState(false); const trigger = useRef<HTMLButtonElement>(null);
  const items = useMemo(() => config.navigation.items.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder), [config.navigation.items]); const active = useActiveSection(items);
  return <SectionShell anchor={section.anchor} as="header" className="cc-header"><Container className="cc-header__inner">
    <button type="button" className="cc-brand" onClick={() => runCta({ label: 'Inicio', kind: 'route', target: '/' })}><BrandMark icon="ruler" size={28} /><span><strong>{config.business.name}</strong><em>configurador a medida</em></span></button>
    <nav aria-label="Navegación principal">{items.slice(0, 9).map((item) => <button key={item.id} type="button" className={active === item.id ? 'is-active' : ''} onClick={() => runCta(item.cta)}>{item.label}</button>)}</nav>
    <div className="cc-header__actions"><CtaButton cta={config.navigation.primaryCta} size="sm" /><button ref={trigger} type="button" aria-label="Abrir menú" aria-expanded={open} className="cc-burger" onClick={() => setOpen(true)}><Icon name="menu" size={23} /></button></div>
  </Container><MobileDrawer open={open} onClose={() => setOpen(false)} items={items} activeId={active} triggerRef={trigger} footer={<CtaButton cta={config.navigation.primaryCta} full />} /></SectionShell>;
};

const Hero: SectionComponent = ({ section }) => {
  const { config } = useSite(); const hero = config.content.hero; const types = activeItems(config.collections ?? {}, 'tipos-proyecto'); const [selected, setSelected] = useState(types[0]?.id ?? '');
  return <SectionShell anchor={section.anchor} className="cc-hero"><Container><div className="cc-hero__copy" data-wf-entry="fade-up"><p className="cc-label">{hero.eyebrow}</p><h1>{hero.title}<span>{hero.titleHighlight}</span></h1><p>{hero.paragraph}</p><div className="cc-actions"><CtaButton cta={hero.primaryCta} size="lg" /><CtaButton cta={hero.secondaryCta!} variant="ghost" size="lg" /></div></div>
    <div className="cc-hero__panel" data-wf-card data-wf-entry="fade"><header><span>01 / 02</span><strong>¿Qué quieres transformar?</strong></header><div className="cc-choice-grid">{types.map((item) => <button key={item.id} type="button" className={selected === item.id ? 'is-selected' : ''} onClick={() => setSelected(item.id)}><Picture image={itemImage(item, 'icono')} /><span>{itemText(item, 'nombre')}</span><Icon name="checkCircle" size={18} /></button>)}</div><CtaButton cta={configureCta('Continuar con esta idea')} full /></div>
  </Container></SectionShell>;
};

const Types: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite(); const items = activeItems(config.collections ?? {}, 'tipos-proyecto');
  return <SectionShell anchor={section.anchor} className="cc-section cc-types"><Container><SectionTitle step="01" title="Empieza por el espacio" text="Cada tipo abre preguntas diferentes y mantiene su propia ficha dinámica." /><div data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 4 }}>{items.map((item) => <article key={item.id} data-wf-card><div data-wf-card-media><Picture image={itemImage(item, 'imagen')} /></div><div data-wf-card-body><h3>{itemText(item, 'nombre')}</h3><p>{itemText(item, 'descripcion')}</p><ul>{itemList(item, 'preguntasClave').slice(0, 2).map((x) => <li key={x}>{x}</li>)}</ul></div><div data-wf-card-actions><button type="button" onClick={() => runCta({ label: 'Abrir tipo', kind: 'route', target: `/tipos/${itemText(item, 'slug')}` })}>Explorar <Icon name="arrowRight" size={16} /></button></div></article>)}</div></Container></SectionShell>;
};

function SectionTitle({ step, title, text }: { step: string; title: string; text: string }) { return <div className="cc-title" data-wf-entry="fade-up"><span>{step}</span><div><h2>{title}</h2><p>{text}</p></div></div>; }

const Steps: SectionComponent = ({ section }) => {
  const { config } = useSite(); const phases = activeItems(config.collections ?? {}, 'fases-proceso');
  return <SectionShell anchor={section.anchor} className="cc-section cc-steps"><Container><SectionTitle step="02" title="Del brief al montaje" text="El formulario solo organiza el inicio. El trabajo real continúa con una secuencia verificable." /><ol>{phases.map((item, i) => <li key={item.id} data-wf-entry="fade-up"><span>{String(i + 1).padStart(2, '0')}</span><h3>{itemText(item, 'titulo')}</h3><p>{itemText(item, 'descripcion')}</p><em>{itemText(item, 'duracion')}</em></li>)}</ol></Container></SectionShell>;
};

const Inspiration: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite(); const styles = activeItems(config.collections ?? {}, 'estilos');
  return <SectionShell anchor={section.anchor} className="cc-section cc-inspiration"><Container><SectionTitle step="03" title="Elige una dirección, no una etiqueta" text="Los estilos son referencias editables para hablar de atmósfera, línea y material." /><div data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>{styles.map((item) => <article key={item.id} data-wf-card><div data-wf-card-media><Picture image={itemImage(item, 'imagen')} /></div><div data-wf-card-body><p className="cc-label">Dirección visual</p><h3>{itemText(item, 'nombre')}</h3><p>{itemText(item, 'descripcion')}</p><div className="cc-chips">{itemList(item, 'claves').map((x) => <span key={x}>{x}</span>)}</div></div><div data-wf-card-actions><button type="button" onClick={() => runCta({ label: 'Abrir estilo', kind: 'route', target: `/estilos/${itemText(item, 'slug')}` })}>Ver claves <Icon name="arrowRight" size={16} /></button></div></article>)}</div></Container></SectionShell>;
};

const Services: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite(); const items = activeItems(config.collections ?? {}, 'servicios-configurador');
  return <SectionShell anchor={section.anchor} className="cc-section cc-services"><Container><SectionTitle step="04" title="Qué hacemos con la información" text="Servicios conectados a tipos de proyecto y a ejemplos reales." /><div className="cc-service-list">{items.map((item, i) => <article key={item.id} data-wf-card><span>{String(i + 1).padStart(2, '0')}</span><div data-wf-card-body><h3>{itemText(item, 'titulo')}</h3><p>{itemText(item, 'resumen')}</p></div><div data-wf-card-actions><button type="button" onClick={() => runCta({ label: 'Ver servicio', kind: 'route', target: `/servicios/${itemText(item, 'slug')}` })}>Abrir <Icon name="arrowRight" size={16} /></button></div></article>)}</div></Container></SectionShell>;
};

const Faq: SectionComponent = ({ section }) => { const { config } = useSite(); const items = activeItems(config.collections ?? {}, 'preguntas-carpinteria'); return <SectionShell anchor={section.anchor} className="cc-section cc-faq"><Container><SectionTitle step="05" title="Preguntas antes de configurar" text="Todo lo que necesitas saber sobre el alcance del brief." /><Accordion items={items.map((item) => ({ id: item.id, question: itemText(item, 'pregunta'), answer: itemText(item, 'respuesta') }))} mode="multiple" icon="plusminus" /></Container></SectionShell>; };
const Final: SectionComponent = ({ section }) => { const { config } = useSite(); return <SectionShell anchor={section.anchor} className="cc-final"><Container><span>READY</span><div><p className="cc-label">Brief guiado</p><h2>{config.content.finalCta.title}</h2><p>{config.content.finalCta.subtitle}</p><CtaButton cta={config.content.finalCta.cta} variant="inverse" size="lg" /></div></Container></SectionShell>; };
const Footer: SectionComponent = ({ section }) => { const { config, runCta } = useSite(); return <SectionShell anchor={section.anchor} as="footer" className="cc-footer"><Container><div><BrandMark icon="ruler" size={30} /><h2>{config.business.name}</h2><p>{config.content.footerTagline}</p></div><nav>{config.navigation.items.filter((x) => x.enabled).slice(0, 8).map((item) => <button key={item.id} type="button" onClick={() => runCta(item.cta)}>{item.label}</button>)}</nav><address><a href={`tel:${config.business.phone}`}>{config.business.phone}</a><a href={`mailto:${config.business.email}`}>{config.business.email}</a><span>{config.business.address.city}</span></address><small>{config.content.footerSignature}</small></Container></SectionShell>; };

function PageHero({ code, title, text }: { code: string; title: string; text: string }) { return <div className="cc-page-hero"><Container><span>{code}</span><h1>{title}</h1><p>{text}</p></Container></div>; }
function Cards({ items, prefix }: { items: CollectionItem[]; prefix: string }) { const { runCta } = useSite(); return <div className="cc-page-cards" data-wf-card-row style={{ ['--wf-card-row-columns' as string]: 3 }}>{items.map((item) => <article key={item.id} data-wf-card><div data-wf-card-media><Picture image={itemImage(item, 'imagen')} /></div><div data-wf-card-body><h2>{collectionTitle(item)}</h2><p>{itemText(item, 'descripcion', itemText(item, 'resumen'))}</p></div><div data-wf-card-actions><button type="button" onClick={() => runCta({ label: 'Abrir ficha', kind: 'route', target: `${prefix}/${itemText(item, 'slug')}` })}>Abrir ficha <Icon name="arrowRight" size={16} /></button></div></article>)}</div>; }
function Detail({ item, label }: { item: CollectionItem; label: string }) { const lists = ['preguntasClave', 'claves', 'caracteristicas', 'beneficios', 'proceso'].flatMap((key) => itemList(item, key)); return <><PageHero code="FICHA" title={collectionTitle(item)} text={itemText(item, 'descripcion', itemText(item, 'resumen'))} /><Container className="cc-detail"><div><Picture image={itemImage(item, 'imagen')} /></div><article><p className="cc-label">{label}</p><p>{itemText(item, 'contenido', itemText(item, 'descripcion'))}</p>{lists.length ? <ul>{lists.map((x) => <li key={x}>{x}</li>)}</ul> : null}<CtaButton cta={configureCta('Usar como punto de partida')} /></article></Container></>; }

const Page: SectionComponent = ({ section }) => {
  const { config, route } = useSite(); const c = config.collections ?? {}; const path = route.split('?')[0].replace(/\/+$/, '') || '/'; const parts = path.split('/').filter(Boolean); const slug = parts[1];
  const detailMap: Record<string, [string, string, string]> = { tipos: ['tipos-proyecto', 'Tipo de proyecto', '/tipos'], estilos: ['estilos', 'Estilo', '/estilos'], materiales: ['materiales', 'Material', '/materiales'], acabados: ['acabados', 'Acabado', '/acabados'], servicios: ['servicios-configurador', 'Servicio', '/servicios'], proyectos: ['proyectos-configurador', 'Proyecto', '/proyectos'] };
  if (slug && detailMap[parts[0]]) { const [key, label] = detailMap[parts[0]]; const item = activeItems(c, key).find((x) => itemText(x, 'slug') === slug); return <SectionShell anchor={section.anchor} className="cc-page">{item ? <Detail item={item} label={label} /> : <PageHero code="404" title="Ficha no encontrada" text="El elemento ya no está publicado." />}</SectionShell>; }
  if (path === '/configura-tu-proyecto' || path === '/solicitar-valoracion') { const form = getForm(config.forms ?? [], 'configurar-proyecto'); return <SectionShell anchor={section.anchor} className="cc-page"><PageHero code="01 → 02" title={path === '/configura-tu-proyecto' ? 'Configura tu proyecto' : 'Solicita una valoración'} text="Las opciones proceden de Contenido y conservan sus IDs aunque cambie el título." /><Container className="cc-form-layout"><div>{form ? <SiteForm form={form} columns={2} stepped /> : <p>Formulario no configurado.</p>}</div><aside data-wf-card><h2>Tu brief incluirá</h2><ul><li>Tipo y dirección visual</li><li>Material y acabado preferidos</li><li>Rango, medidas y plazo</li><li>Necesidades y referencias</li><li>Datos de contacto</li></ul><p>No genera un precio automático ni promete un plazo sin revisar el espacio.</p></aside></Container></SectionShell>; }
  if (path === '/como-trabajamos') return <SectionShell anchor={section.anchor} className="cc-page"><PageHero code="MÉTODO" title="Del brief a una propuesta construible" text="La información inicial se contrasta en cada fase." /><Container className="cc-timeline">{activeItems(c, 'fases-proceso').map((item, i) => <article key={item.id}><span>{String(i + 1).padStart(2, '0')}</span><h2>{itemText(item, 'titulo')}</h2><p>{itemText(item, 'descripcion')}</p><em>{itemText(item, 'duracion')}</em></article>)}</Container></SectionShell>;
  if (path === '/preguntas') { const items = activeItems(c, 'preguntas-carpinteria'); return <SectionShell anchor={section.anchor} className="cc-page"><PageHero code="FAQ" title="Preguntas frecuentes" text="Alcance, decisiones y siguientes pasos." /><Container><Accordion items={items.map((item) => ({ id: item.id, question: itemText(item, 'pregunta'), answer: itemText(item, 'respuesta') }))} mode="multiple" icon="plusminus" /></Container></SectionShell>; }
  if (detailMap[parts[0]]) { const [key, label, prefix] = detailMap[parts[0]]; return <SectionShell anchor={section.anchor} className="cc-page"><PageHero code={label.toUpperCase()} title={parts[0] === 'proyectos' ? 'Ejemplos conectados con elecciones' : `${label}s para configurar`} text="Contenido editable, ordenable y relacionado por identificadores estables." /><Container><Cards items={activeItems(c, key)} prefix={prefix} /></Container></SectionShell>; }
  const legal = config.content.legal; const doc = path === '/privacidad' ? legal.privacy : path === '/cookies' ? legal.cookies : legal.legalNotice;
  return <SectionShell anchor={section.anchor} className="cc-page"><PageHero code="LEGAL" title={doc.title} text="Información del responsable y condiciones de uso." /><Container className="cc-legal">{doc.body.split('\n\n').map((x, i) => <p key={i}>{x}</p>)}</Container></SectionShell>;
};

export const CARPINTERIA_CONFIGURADOR_SECTIONS: Record<string, SectionComponent> = {
  'cc-header-01': Header, 'cc-hero-01': Hero, 'cc-tipos-01': Types, 'cc-pasos-01': Steps, 'cc-inspiracion-01': Inspiration,
  'cc-servicios-01': Services, 'cc-faq-01': Faq, 'cc-final-01': Final, 'cc-footer-01': Footer,
  'cc-page-configura-01': Page, 'cc-page-servicios-01': Page, 'cc-page-tipos-01': Page, 'cc-page-estilos-01': Page,
  'cc-page-materiales-01': Page, 'cc-page-acabados-01': Page, 'cc-page-proceso-01': Page, 'cc-page-proyectos-01': Page,
  'cc-page-faq-01': Page, 'cc-page-legal-01': Page,
};
