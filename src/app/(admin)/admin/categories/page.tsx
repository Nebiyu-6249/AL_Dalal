import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveCategory } from '@/actions/admin';
import { ActionForm, Field, Area, Check, Upload, Submit } from '@/components/admin/Form';
import Chrome from '../Chrome';
import NoDatabase from '../NoDatabase';

export const dynamic = 'force-dynamic';

export default async function CategoriesAdmin() {
  const session = await getSession();
  const data = await getAdminContent();
  const title = 'Service pages';
  const intro = 'The heading, the opening paragraph and the two pictures on each of the six service pages. The opening paragraph is also what Google shows underneath the page in its results, so keep it useful and around two sentences.';

  if (!data) {
    return <Chrome who={session?.name ?? ''} current="/admin/categories" title={title} intro={intro}><NoDatabase /></Chrome>;
  }

  return (
    <Chrome who={session?.name ?? ''} current="/admin/categories" title={title} intro={intro}>
      {data.categories.map((c) => (
        <details className="a-item" key={c.id}>
          <summary>
            <span>{c.nameEn}{!c.published && <span className="a-hidden"> · hidden</span>}</span>
            <span className="a-sum">/services/{c.slug}</span>
          </summary>
          <div className="a-item__body">
            <ActionForm action={saveCategory}>
              <input type="hidden" name="id" value={c.id} />
              <div className="a-grid a-grid--2">
                <Field label="Name, English" name="nameEn" defaultValue={c.nameEn} required />
                <Field label="Name, Arabic" name="nameAr" defaultValue={c.nameAr} ar />
                <Field label="One line under the name, English" name="taglineEn" defaultValue={c.taglineEn} />
                <Field label="One line under the name, Arabic" name="taglineAr" defaultValue={c.taglineAr} ar />
                <Area label="Opening paragraph, English" name="introEn" defaultValue={c.introEn} rows={5} />
                <Area label="Opening paragraph, Arabic" name="introAr" defaultValue={c.introAr} ar rows={5} />
              </div>
              <div className="a-grid a-grid--2" style={{ marginTop: '1rem' }}>
                <div>
                  <p className="a-sum" style={{ margin: '0 0 0.4rem' }}>Small picture on the home page</p>
                  <Upload name="tileImage" defaultValue={c.tileImage} />
                </div>
                <div>
                  <p className="a-sum" style={{ margin: '0 0 0.4rem' }}>Large picture at the top of the page</p>
                  <Upload name="heroImage" defaultValue={c.heroImage} />
                </div>
              </div>
              <Field label="Sort order" name="sortOrder" type="number" defaultValue={c.sortOrder} />
              <div className="a-row">
                <Check label="Show on the site" name="published" defaultChecked={c.published} />
                <Submit />
              </div>
            </ActionForm>
          </div>
        </details>
      ))}
    </Chrome>
  );
}
