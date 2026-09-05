import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveTestimonial, deleteTestimonial } from '@/actions/admin';
import { ActionForm, Field, Area, Check, Submit } from '@/components/admin/Form';
import Chrome from '../Chrome';
import NoDatabase from '../NoDatabase';

export const dynamic = 'force-dynamic';

export default async function ReviewsAdmin() {
  const session = await getSession();
  const data = await getAdminContent();
  const title = 'Reviews';
  const intro = 'Only put real reviews here, whether they came from the Google profile or a client wrote to you directly. An invented one is worse than an empty page.';

  if (!data) {
    return <Chrome who={session?.name ?? ''} current="/admin/reviews" title={title} intro={intro}><NoDatabase /></Chrome>;
  }

  return (
    <Chrome who={session?.name ?? ''} current="/admin/reviews" title={title} intro={intro}>
      {data.testimonials.map((r) => (
        <details className="a-item" key={r.id}>
          <summary>
            <span>{r.name}{!r.published && <span className="a-hidden"> · hidden</span>}</span>
            <span className="a-sum">{'★'.repeat(r.rating)} · {r.saidOn}</span>
          </summary>
          <div className="a-item__body">
            <ActionForm action={saveTestimonial}>
              <input type="hidden" name="id" value={r.id} />
              <div className="a-grid a-grid--4">
                <Field label="Name" name="name" defaultValue={r.name} required />
                <Field label="Stars" name="rating" type="number" defaultValue={r.rating} />
                <Field label="When" name="saidOn" defaultValue={r.saidOn} placeholder="2 months ago" />
                <Field label="Where from" name="source" defaultValue={r.source} />
              </div>
              <div className="a-grid a-grid--2" style={{ marginTop: '0.85rem' }}>
                <Area label="Review, English" name="bodyEn" defaultValue={r.bodyEn} />
                <Area label="Review, Arabic" name="bodyAr" defaultValue={r.bodyAr} ar />
              </div>
              <Field label="Sort order" name="sortOrder" type="number" defaultValue={r.sortOrder} />
              <div className="a-row">
                <Check label="Show on the site" name="published" defaultChecked={r.published} />
                <Submit />
              </div>
            </ActionForm>
            <ActionForm action={deleteTestimonial}>
              <input type="hidden" name="id" value={r.id} />
              <div className="a-row"><Submit danger confirm={`Remove the review from ${r.name}?`}>Remove</Submit></div>
            </ActionForm>
          </div>
        </details>
      ))}

      <div className="a-card">
        <h3>Add a review</h3>
        <ActionForm action={saveTestimonial}>
          <div className="a-grid a-grid--4">
            <Field label="Name" name="name" required />
            <Field label="Stars" name="rating" type="number" defaultValue={5} />
            <Field label="When" name="saidOn" placeholder="last week" />
            <Field label="Where from" name="source" defaultValue="Google" />
          </div>
          <div className="a-grid a-grid--2" style={{ marginTop: '0.85rem' }}>
            <Area label="Review, English" name="bodyEn" />
            <Area label="Review, Arabic" name="bodyAr" ar />
          </div>
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={999} />
          <div className="a-row">
            <Check label="Show on the site" name="published" defaultChecked />
            <Submit>Add review</Submit>
          </div>
        </ActionForm>
      </div>
    </Chrome>
  );
}
