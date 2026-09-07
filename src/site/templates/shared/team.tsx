/**
 * Equipo / profesionales — familia universal.
 *
 * Tres composiciones distintas para el mismo dato: `config.team`. Sirven a
 * fisioterapeutas, peluqueros, técnicos o asesores sin una línea de vocabulario
 * sectorial, porque el rol de cada persona lo aporta el negocio.
 *
 * No son tarjetas funcionales: cada una tiene su propia jerarquía, tratamiento
 * de imagen, ritmo y microinteracción, pensados para las tres direcciones
 * visuales. Los tokens hacen el resto —una misma composición cambia de carácter
 * con la paleta y la tipografía del perfil—.
 */

import { useSite } from '../../context';
import type { SectionComponent } from '../../registry';
import { Container, CtaButton, Heading, Picture, SectionShell } from '../../components/primitives';
import { Icon } from '../../components/Icon';

/** Iniciales legibles cuando alguien no tiene retrato. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

const EMPTY = { eyebrow: '', title: '', subtitle: '' };

/* -------------------------------------------------------------------------- */
/*  Editorial — retratos altos, numeración y lectura pausada                   */
/* -------------------------------------------------------------------------- */

const TeamEditorial: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const members = config.team.filter((member) => member.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (members.length === 0) return null;
  const heading = config.content.headings.team ?? EMPTY;

  return (
    <SectionShell anchor={section.anchor} className="sh-team sh-team--editorial">
      <Container>
        <Heading heading={{ eyebrow: heading.eyebrow || 'Equipo', title: heading.title || 'Quién te atiende', subtitle: heading.subtitle }} align="left" />
        <div className="sh-team__editorial-grid">
          {members.map((member, index) => (
            <article key={member.id} className="sh-team__figure" data-wf-entry="reveal-up">
              <div className="sh-team__portrait" data-wf-media-frame>
                {member.photo ? (
                  <Picture image={member.photo} sizes="(max-width: 720px) 90vw, 30vw" />
                ) : (
                  <span className="sh-team__initials" aria-hidden="true">{initials(member.name)}</span>
                )}
                <span className="sh-team__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="sh-team__body">
                <h3>{member.name}</h3>
                <p className="sh-team__role">{member.role}</p>
                {member.bio ? <p className="sh-team__bio">{member.bio}</p> : null}
                {member.specialties.length > 0 ? (
                  <ul className="sh-team__tags">
                    {member.specialties.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*  Rejilla — hairline, denso y sin ruido                                      */
/* -------------------------------------------------------------------------- */

const TeamGrid: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const members = config.team.filter((member) => member.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (members.length === 0) return null;
  const heading = config.content.headings.team ?? EMPTY;

  return (
    <SectionShell anchor={section.anchor} className="sh-team sh-team--grid">
      <Container>
        <Heading heading={{ eyebrow: heading.eyebrow || 'Equipo', title: heading.title || 'Profesionales', subtitle: heading.subtitle }} align="left" />
        <ul className="sh-team__list">
          {members.map((member) => (
            <li key={member.id} data-wf-entry="fade" data-wf-card>
              <div className="sh-team__avatar" aria-hidden={member.photo ? undefined : 'true'}>
                {member.photo ? <Picture image={member.photo} sizes="120px" /> : <span>{initials(member.name)}</span>}
              </div>
              <div className="sh-team__meta">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                {member.specialties.length > 0 ? <small>{member.specialties.join(' · ')}</small> : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
};

/* -------------------------------------------------------------------------- */
/*  Tarjetas — retrato, especialidad y contacto directo                        */
/* -------------------------------------------------------------------------- */

const TeamCards: SectionComponent = ({ section }) => {
  const { config } = useSite();
  const members = config.team.filter((member) => member.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (members.length === 0) return null;
  const heading = config.content.headings.team ?? EMPTY;
  const cta = config.navigation.primaryCta;

  return (
    <SectionShell anchor={section.anchor} className="sh-team sh-team--cards">
      <Container>
        <Heading heading={{ eyebrow: heading.eyebrow || 'Equipo', title: heading.title || 'Te atiende un equipo con nombre', subtitle: heading.subtitle }} />
        <div
          className="sh-team__cards"
          data-wf-card-row
          style={{ ['--wf-card-row-columns' as string]: Math.min(4, Math.max(2, members.length)) }}
        >
          {members.map((member) => (
            <article key={member.id} data-wf-card data-wf-entry="fade-up">
              <div data-wf-card-media className="sh-team__cardmedia">
                {member.photo ? (
                  <Picture image={member.photo} sizes="(max-width: 720px) 80vw, 22vw" />
                ) : (
                  <span className="sh-team__initials" aria-hidden="true">{initials(member.name)}</span>
                )}
              </div>
              <div data-wf-card-body>
                <h3>{member.name}</h3>
                <p className="sh-team__role">
                  <Icon name="check" size={14} /> {member.role}
                </p>
                {member.specialties.length > 0 ? (
                  <ul className="sh-team__tags">
                    {member.specialties.slice(0, 3).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <div className="sh-team__actions">
          <CtaButton cta={cta} variant="primary" />
        </div>
      </Container>
    </SectionShell>
  );
};

export const SHARED_TEAM_SECTIONS: Record<string, SectionComponent> = {
  'sh-team-editorial-01': TeamEditorial,
  'sh-team-grid-01': TeamGrid,
  'sh-team-cards-01': TeamCards,
};
