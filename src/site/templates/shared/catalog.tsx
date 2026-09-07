/**
 * Catálogo y ficha de detalle — universales por rol.
 *
 * Consumen `@catalog` y su ficha `@catalogItem`. La misma pareja de componentes
 * sirve para tipos de plaga, tratamientos de fisioterapia, patologías, líneas de
 * producto o cualquier catálogo que un nicho declare: quién es `@catalog` lo
 * decide el `NicheConfig`, y aquí no se nombra ninguno.
 *
 * Los campos se leen con tolerancia —`titulo` o `nombre`, `resumen` o
 * `descripcion`— porque cada sector nombra su esquema a su manera y forzar un
 * único nombre volvería a acoplar el componente al vocabulario.
 */

import { useSite } from '../../context';
import { roleItems, roleRoute } from '../../bindings';
import { itemImage, itemList, itemText, type CollectionItem } from '../../collections';
import type { SectionComponent } from '../../registry';
import { Container, CtaButton, Heading, Picture, SectionShell } from '../../components/primitives';
import { Icon } from '../../components/Icon';

/** Slug de la ruta activa bajo un prefijo. Mismo criterio que las templates. */
function useSlug(prefix: string): string | null {
  const { route } = useSite();
  const normalized = route.split('?')[0]!.replace(/\/+$/, '');
  if (!prefix || !normalized.startsWith(`${prefix}/`)) return null;
  return normalized.slice(prefix.length + 1) || null;
}

const title = (item: CollectionItem) => itemText(item, 'titulo', itemText(item, 'nombre', 'Sin título'));
const summary = (item: CollectionItem) => itemText(item, 'resumen', itemText(item, 'descripcion'));

/* -------------------------------------------------------------------------- */
/*  Listado                                                                    */
/* -------------------------------------------------------------------------- */

const CatalogGrid: SectionComponent = ({ section }) => {
  const { config, runCta } = useSite();
  const items = roleItems(config, 'catalog');
  if (items.length === 0) return null;

  const base = roleRoute(config, 'catalog');
  const heading = config.content.headings.services ?? { eyebrow: '', title: '', subtitle: '' };

  return (
    <SectionShell anchor={section.anchor} className="sh-catalog">
      <Container>
        <Heading heading={{ eyebrow: heading.eyebrow, title: heading.title || 'Qué tratamos', subtitle: heading.subtitle }} align="left" />
        <div
          className="sh-catalog__grid"
          data-wf-card-row
          style={{ ['--wf-card-row-columns' as string]: Math.min(3, Math.max(2, items.length)) }}
        >
          {items.map((item) => {
            const slug = itemText(item, 'slug');
            const image = itemImage(item, 'imagen');
            return (
              <article key={item.id} data-wf-card data-wf-entry="blur-in">
                {image ? (
                  <div data-wf-card-media>
                    <Picture image={image} sizes="(max-width: 720px) 90vw, 30vw" />
                  </div>
                ) : null}
                <div data-wf-card-body>
                  <h3>{title(item)}</h3>
                  {summary(item) ? <p>{summary(item)}</p> : null}
                  {itemList(item, 'beneficios').length > 0 ? (
                    <ul className="sh-catalog__points">
                      {itemList(item, 'beneficios').slice(0, 3).map((point) => (
                        <li key={point}>
                          <Icon name="check" size={14} /> {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {base && slug ? (
                  <div data-wf-card-actions>
                    <button
                      type="button"
                      className="wf-btn wf-btn--ghost wf-btn--sm"
                      data-wf-button
                      onClick={() => runCta({ label: title(item), kind: 'route', target: `${base}/${slug}` })}
                    >
                      Ver ficha <Icon name="arrowRight" size={16} />
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*  Ficha                                                                      */
/* -------------------------------------------------------------------------- */

const CatalogDetail: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const base = roleRoute(config, 'catalog');
  const slug = useSlug(base || '/catalogo');
  const items = roleItems(config, 'catalog');
  const item = slug ? items.find((candidate) => itemText(candidate, 'slug') === slug) : null;

  if (!slug || !item) {
    return (
      <SectionShell anchor={section.anchor} className="sh-catalog sh-catalog--detail">
        <Container>
          <Heading
            heading={{
              eyebrow: 'Catálogo',
              title: slug ? 'Ficha no encontrada' : 'Elige un elemento del catálogo',
              subtitle: slug ? 'El elemento solicitado ya no está publicado.' : '',
            }}
          />
          <CtaButton cta={config.navigation.primaryCta} variant="primary" />
        </Container>
      </SectionShell>
    );
  }

  const image = itemImage(item, 'imagen');
  const related = items.filter((candidate) => candidate.id !== item.id).slice(0, 3);

  return (
    <SectionShell anchor={section.anchor} className="sh-catalog sh-catalog--detail">
      <Container>
        <Heading heading={{ eyebrow: 'Ficha', title: title(item), subtitle: summary(item) }} align="left" />
        <div className="sh-catalog__detail">
          {image ? (
            <div data-wf-media-frame className="sh-catalog__detail-media">
              <Picture image={image} sizes="(max-width: 900px) 90vw, 45vw" />
            </div>
          ) : null}
          <div className="sh-catalog__detail-body" data-wf-entry="fade-up">
            {itemText(item, 'descripcion') ? <p>{itemText(item, 'descripcion')}</p> : null}
            {itemList(item, 'beneficios').length > 0 ? (
              <ul className="sh-catalog__points">
                {itemList(item, 'beneficios').map((point) => (
                  <li key={point}>
                    <Icon name="check" size={14} /> {point}
                  </li>
                ))}
              </ul>
            ) : null}
            <CtaButton cta={config.navigation.primaryCta} variant="primary" />
          </div>
        </div>

        {related.length > 0 ? (
          <div className="sh-catalog__related">
            <h2>También te puede interesar</h2>
            <ul>
              {related.map((candidate) => (
                <li key={candidate.id}>{title(candidate)}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </SectionShell>
  );
};

export const SHARED_CATALOG_SECTIONS: Record<string, SectionComponent> = {
  'sh-catalog-grid-01': CatalogGrid,
  'sh-catalog-detail-01': CatalogDetail,
};
