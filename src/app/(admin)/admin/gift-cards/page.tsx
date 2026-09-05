import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveGiftCard, deleteGiftCard } from '@/actions/admin';
import { ActionForm, Field, Area, Check, Upload, Submit } from '@/components/admin/Form';
import Chrome from '../Chrome';
import NoDatabase from '../NoDatabase';

export const dynamic = 'force-dynamic';

export default async function GiftCardsAdmin() {
  const session = await getSession();
  const data = await getAdminContent();
  const title = 'Gift cards';
  const intro = 'One panel per occasion. There is no price attached, because the person buying chooses the amount in the salon.';

  if (!data) {
    return <Chrome who={session?.name ?? ''} current="/admin/gift-cards" title={title} intro={intro}><NoDatabase /></Chrome>;
  }

  return (
    <Chrome who={session?.name ?? ''} current="/admin/gift-cards" title={title} intro={intro}>
      {data.giftCards.map((g) => (
        <details className="a-item" key={g.id}>
          <summary>
            <span>{g.titleEn}{!g.published && <span className="a-hidden"> · hidden</span>}</span>
            <span className="a-sum">{g.yearRound ? 'all year' : 'seasonal'}</span>
          </summary>
          <div className="a-item__body">
            <ActionForm action={saveGiftCard}>
              <input type="hidden" name="id" value={g.id} />
              <input type="hidden" name="slug" value={g.slug} />
              <div className="a-grid a-grid--2">
                <Field label="Title, English" name="titleEn" defaultValue={g.titleEn} required />
                <Field label="Title, Arabic" name="titleAr" defaultValue={g.titleAr} ar />
                <Area label="Description, English" name="bodyEn" defaultValue={g.bodyEn} />
                <Area label="Description, Arabic" name="bodyAr" defaultValue={g.bodyAr} ar />
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                <Upload name="image" defaultValue={g.image} />
              </div>
              <Field label="Sort order" name="sortOrder" type="number" defaultValue={g.sortOrder} />
              <div className="a-row">
                <Check label="Available all year" name="yearRound" defaultChecked={g.yearRound} />
                <Check label="Show on the site" name="published" defaultChecked={g.published} />
                <Submit />
              </div>
            </ActionForm>
            <ActionForm action={deleteGiftCard}>
              <input type="hidden" name="id" value={g.id} />
              <div className="a-row"><Submit danger confirm={`Remove the ${g.titleEn} card?`}>Remove</Submit></div>
            </ActionForm>
          </div>
        </details>
      ))}

      <div className="a-card">
        <h3>Add a gift card</h3>
        <ActionForm action={saveGiftCard}>
          <div className="a-grid a-grid--2">
            <Field label="Title, English" name="titleEn" required />
            <Field label="Title, Arabic" name="titleAr" ar />
            <Area label="Description, English" name="bodyEn" />
            <Area label="Description, Arabic" name="bodyAr" ar />
          </div>
          <div style={{ marginTop: '0.85rem' }}><Upload name="image" /></div>
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={999} />
          <div className="a-row">
            <Check label="Available all year" name="yearRound" />
            <Check label="Show on the site" name="published" defaultChecked />
            <Submit>Add gift card</Submit>
          </div>
        </ActionForm>
      </div>
    </Chrome>
  );
}
