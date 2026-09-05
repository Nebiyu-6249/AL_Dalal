import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveService, deleteService } from '@/actions/admin';
import { ActionForm, Field, Check, Choice, Submit } from '@/components/admin/Form';
import Chrome from './Chrome';
import NoDatabase from './NoDatabase';

export const dynamic = 'force-dynamic';

export default async function PricesPage() {
  const session = await getSession();
  const data = await getAdminContent();

  if (!data) {
    return (
      <Chrome who={session?.name ?? ''} current="/admin" title="Prices"
        intro="Every service on the site and what it costs.">
        <NoDatabase />
      </Chrome>
    );
  }

  const catOptions = data.categories.map((c) => ({ value: c.slug, label: c.nameEn }));

  return (
    <Chrome
      who={session?.name ?? ''}
      current="/admin"
      title="Prices"
      intro={`All ${data.services.length} services. Changing a price here changes it on the service page, the menu page, the "from" line on the home page and the information Google reads, all at once.`}
    >
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
                  <span className="a-sum">
                    AED {s.priceFrom}{s.priceTo && s.priceTo !== s.priceFrom ? ` - ${s.priceTo}` : ''}
                  </span>
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
                    <div className="a-grid a-grid--4" style={{ marginTop: '0.85rem' }}>
                      <Field label="Price from" name="priceFrom" type="number" defaultValue={s.priceFrom} required />
                      <Field label="Price to" name="priceTo" type="number" defaultValue={s.priceTo}
                        hint="leave empty for one price" />
                      <Field label="Unit, English" name="unitEn" defaultValue={s.unitEn}
                        placeholder="per line" />
                      <Field label="Unit, Arabic" name="unitAr" defaultValue={s.unitAr} ar />
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
          <div className="a-grid a-grid--4" style={{ marginTop: '0.85rem' }}>
            <Field label="Price from" name="priceFrom" type="number" required />
            <Field label="Price to" name="priceTo" type="number" hint="optional" />
            <Field label="Unit, English" name="unitEn" />
            <Field label="Unit, Arabic" name="unitAr" ar />
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
