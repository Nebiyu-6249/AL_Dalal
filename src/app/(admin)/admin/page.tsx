import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveService, deleteService } from '@/actions/admin';
import { ActionForm, Field, Check, Choice, Submit } from '@/components/admin/Form';
import Chrome from './Chrome';
import NoDatabase from './NoDatabase';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const session = await getSession();
  const data = await getAdminContent();

  if (!data) {
    return (
      <Chrome who={session?.name ?? ''} current="/admin" title="Services"
        intro="Every service on the site, in both languages.">
        <NoDatabase />
      </Chrome>
    );
  }

  const catOptions = data.categories.map((c) => ({ value: c.slug, label: c.nameEn }));

  return (
    <Chrome
      who={session?.name ?? ''}
      current="/admin"
      title="Services"
      intro={`All ${data.services.length} services. A name changed here changes it on the service page, the menu page, the tiles on the home page and the information Google reads, all at once.`}
    >
      <div className="a-note">
        <b>There are no price fields any more.</b>
        <p style={{ margin: '0.5rem 0 0' }}>
          The site does not show prices. They change with hair length, thickness and what the
          client picks, so the salon quotes on WhatsApp and again in the chair. Add and name
          services here as usual. The old figures are still in the database, untouched, in case
          prices ever go back on the site.
        </p>
      </div>

      {data.categories.map((cat) => {
        const rows = data.services.filter((s) => s.categorySlug === cat.slug);
        return (
          <section key={cat.slug} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem' }}>
              {cat.nameEn} <span className="a-sum">({rows.length})</span>
            </h2>

            {rows.map((s) => (
              <details className="a-item" key={s.id}>
                <summary>
                  <span>
                    {s.nameEn}
                    {!s.published && <span className="a-hidden"> · hidden</span>}
                  </span>
                  <span className="a-sum">{s.groupEn}</span>
                </summary>
                <div className="a-item__body">
                  <ActionForm action={saveService}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="sortOrder" value={s.sortOrder} />
                    <div className="a-grid a-grid--2">
                      <Field label="Name, English" name="nameEn" defaultValue={s.nameEn} required />
                      <Field label="Name, Arabic" name="nameAr" defaultValue={s.nameAr} ar />
                      <Field label="Group heading, English" name="groupEn" defaultValue={s.groupEn} />
                      <Field label="Group heading, Arabic" name="groupAr" defaultValue={s.groupAr} ar />
                    </div>
                    <div className="a-grid a-grid--2" style={{ marginTop: '0.85rem' }}>
                      <Field label="Note, English" name="noteEn" defaultValue={s.noteEn} />
                      <Field label="Note, Arabic" name="noteAr" defaultValue={s.noteAr} ar />
                    </div>
                    <input type="hidden" name="categorySlug" value={s.categorySlug} />
                    <div className="a-row">
                      <Check label="Show on the site" name="published" defaultChecked={s.published} />
                      <Submit />
                    </div>
                  </ActionForm>

                  <ActionForm action={deleteService}>
                    <input type="hidden" name="id" value={s.id} />
                    <div className="a-row">
                      <Submit danger confirm={`Remove "${s.nameEn}" for good?`}>Remove</Submit>
                    </div>
                  </ActionForm>
                </div>
              </details>
            ))}
          </section>
        );
      })}

      <div className="a-card">
        <h3>Add a service</h3>
        <ActionForm action={saveService}>
          <div className="a-grid a-grid--2">
            <Choice label="Which page it belongs on" name="categorySlug" options={catOptions} />
            <Field label="Group heading, English" name="groupEn" placeholder="Treatments" />
            <Field label="Name, English" name="nameEn" required />
            <Field label="Name, Arabic" name="nameAr" ar />
            <Field label="Group heading, Arabic" name="groupAr" ar />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={999} />
          </div>
          <div className="a-row">
            <Check label="Show on the site" name="published" defaultChecked />
            <Submit>Add service</Submit>
          </div>
        </ActionForm>
      </div>
    </Chrome>
  );
}
