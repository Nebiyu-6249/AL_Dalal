import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveFaq, deleteFaq } from '@/actions/admin';
import { ActionForm, Field, Area, Check, Choice, Submit } from '@/components/admin/Form';
import Chrome from '../Chrome';
import NoDatabase from '../NoDatabase';

export const dynamic = 'force-dynamic';

export default async function FaqsAdmin() {
  const session = await getSession();
  const data = await getAdminContent();
  const title = 'Questions';
  const intro = 'These appear at the bottom of a page and are also handed to Google, which is how the salon turns up for questions people type in full, such as how long eyelash extensions last.';

  if (!data) {
    return <Chrome who={session?.name ?? ''} current="/admin/faqs" title={title} intro={intro}><NoDatabase /></Chrome>;
  }

  const pages = [
    { value: 'home', label: 'Home page' },
    ...data.categories.map((c) => ({ value: c.slug, label: `${c.nameEn} page` })),
  ];
  const pageLabel = (v: string) => pages.find((p) => p.value === v)?.label ?? v;

  return (
    <Chrome who={session?.name ?? ''} current="/admin/faqs" title={title} intro={intro}>
      {pages.map((p) => {
        const rows = data.faqs.filter((f) => f.page === p.value);
        if (!rows.length) return null;
        return (
          <section key={p.value} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 0.75rem' }}>
              {p.label} <span className="a-sum">({rows.length})</span>
            </h2>
            {rows.map((f) => (
              <details className="a-item" key={f.id}>
                <summary>
                  <span>{f.questionEn}{!f.published && <span className="a-hidden"> · hidden</span>}</span>
                </summary>
                <div className="a-item__body">
                  <ActionForm action={saveFaq}>
                    <input type="hidden" name="id" value={f.id} />
                    <div className="a-grid a-grid--2">
                      <Field label="Question, English" name="questionEn" defaultValue={f.questionEn} required />
                      <Field label="Question, Arabic" name="questionAr" defaultValue={f.questionAr} ar />
                      <Area label="Answer, English" name="answerEn" defaultValue={f.answerEn} />
                      <Area label="Answer, Arabic" name="answerAr" defaultValue={f.answerAr} ar />
                    </div>
                    <div className="a-grid a-grid--2" style={{ marginTop: '0.85rem' }}>
                      <Choice label="Which page" name="page" defaultValue={f.page} options={pages} />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={f.sortOrder} />
                    </div>
                    <div className="a-row">
                      <Check label="Show on the site" name="published" defaultChecked={f.published} />
                      <Submit />
                    </div>
                  </ActionForm>
                  <ActionForm action={deleteFaq}>
                    <input type="hidden" name="id" value={f.id} />
                    <div className="a-row"><Submit danger confirm="Remove this question?">Remove</Submit></div>
                  </ActionForm>
                </div>
              </details>
            ))}
          </section>
        );
      })}

      <div className="a-card">
        <h3>Add a question</h3>
        <ActionForm action={saveFaq}>
          <div className="a-grid a-grid--2">
            <Field label="Question, English" name="questionEn" required />
            <Field label="Question, Arabic" name="questionAr" ar />
            <Area label="Answer, English" name="answerEn" />
            <Area label="Answer, Arabic" name="answerAr" ar />
          </div>
          <div className="a-grid a-grid--2" style={{ marginTop: '0.85rem' }}>
            <Choice label="Which page" name="page" options={pages} />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={999} />
          </div>
          <div className="a-row">
            <Check label="Show on the site" name="published" defaultChecked />
            <Submit>Add question</Submit>
          </div>
        </ActionForm>
      </div>
      <p className="a-sum">{pageLabel('home')} questions show under the home page FAQ.</p>
    </Chrome>
  );
}
