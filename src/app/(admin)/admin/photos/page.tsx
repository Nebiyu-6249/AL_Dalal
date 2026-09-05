import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { savePhoto, deletePhoto } from '@/actions/admin';
import { ActionForm, Field, Check, Choice, Upload, Submit } from '@/components/admin/Form';
import Chrome from '../Chrome';
import NoDatabase from '../NoDatabase';

export const dynamic = 'force-dynamic';

const SLOTS = [
  { value: 'hero', label: 'Home page, big pictures at the top' },
  { value: 'about-team', label: 'About page, the team' },
  { value: 'interior', label: 'Inside the salon' },
  { value: 'gallery-henna', label: 'Henna page, our work' },
  { value: 'gallery-braiding', label: 'Braiding page, our work' },
  { value: 'gallery-hair', label: 'Hair page, our work' },
  { value: 'gallery-nails', label: 'Nails page, our work' },
  { value: 'gallery-skin', label: 'Skin page, our work' },
  { value: 'gallery-lashes', label: 'Lashes page, our work' },
];

const labelFor = (slot: string) => SLOTS.find((s) => s.value === slot)?.label ?? slot;

export default async function PhotosAdmin() {
  const session = await getSession();
  const data = await getAdminContent();
  const title = 'Photos';
  const intro = 'Upload a picture and choose where it goes. Photographs of clients need their agreement first, since this is a public website.';

  if (!data) {
    return <Chrome who={session?.name ?? ''} current="/admin/photos" title={title} intro={intro}><NoDatabase /></Chrome>;
  }

  return (
    <Chrome who={session?.name ?? ''} current="/admin/photos" title={title} intro={intro}>
      <div className="a-card">
        <h3>Add a photo</h3>
        <ActionForm action={savePhoto}>
          <Upload name="url" widthName="width" heightName="height" />
          <div className="a-grid a-grid--2" style={{ marginTop: '0.85rem' }}>
            <Choice label="Where it goes" name="slot" options={SLOTS} />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={999} />
            <Field label="Describe it, English" name="altEn" required
              hint="what is in the picture" />
            <Field label="Describe it, Arabic" name="altAr" ar />
          </div>
          <div className="a-row">
            <Check label="Show on the site" name="published" defaultChecked />
            <Submit>Add photo</Submit>
          </div>
        </ActionForm>
      </div>

      {SLOTS.map((slot) => {
        const rows = data.photos.filter((p) => p.slot === slot.value);
        if (!rows.length) return null;
        return (
          <section key={slot.value} style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 0.85rem' }}>
              {slot.label} <span className="a-sum">({rows.length})</span>
            </h2>
            <div className="a-photos">
              {rows.map((p) => (
                <div className="a-card" key={p.id} style={{ margin: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="a-thumb" src={p.url} alt={p.altEn} />
                  <ActionForm action={savePhoto}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="url" value={p.url} />
                    <input type="hidden" name="width" value={p.width} />
                    <input type="hidden" name="height" value={p.height} />
                    <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.7rem' }}>
                      <Choice label="Where it goes" name="slot" defaultValue={p.slot} options={SLOTS} />
                      <Field label="Describe it, English" name="altEn" defaultValue={p.altEn} required />
                      <Field label="Describe it, Arabic" name="altAr" defaultValue={p.altAr} ar />
                      <Field label="Sort order" name="sortOrder" type="number" defaultValue={p.sortOrder} />
                      <Check label="Show on the site" name="published" defaultChecked={p.published} />
                    </div>
                    <div className="a-row"><Submit quiet>Save</Submit></div>
                  </ActionForm>
                  <ActionForm action={deletePhoto}>
                    <input type="hidden" name="id" value={p.id} />
                    <Submit danger confirm="Remove this photo?">Remove</Submit>
                  </ActionForm>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {data.photos.some((p) => !SLOTS.find((s) => s.value === p.slot)) && (
        <p className="a-sum" style={{ marginTop: '1.5rem' }}>
          Some photos sit in a place that is no longer used: {' '}
          {[...new Set(data.photos.map((p) => p.slot))]
            .filter((s) => !SLOTS.find((x) => x.value === s))
            .map(labelFor).join(', ')}.
        </p>
      )}
    </Chrome>
  );
}
