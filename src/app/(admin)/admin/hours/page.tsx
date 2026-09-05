import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveHours } from '@/actions/admin';
import { ActionForm, Check, Submit } from '@/components/admin/Form';
import Chrome from '../Chrome';
import NoDatabase from '../NoDatabase';

export const dynamic = 'force-dynamic';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default async function HoursAdmin() {
  const session = await getSession();
  const data = await getAdminContent();
  const title = 'Opening hours';
  const intro = 'These hours appear in the footer, on the contact page and in what Google shows when someone searches for the salon. Keep them the same as the Google Business Profile.';

  if (!data) {
    return <Chrome who={session?.name ?? ''} current="/admin/hours" title={title} intro={intro}><NoDatabase /></Chrome>;
  }

  const byDay = (weekday: number) =>
    data.hours.find((h) => h.weekday === weekday) ?? { opens: '10:00', closes: '22:00', closed: false };

  return (
    <Chrome who={session?.name ?? ''} current="/admin/hours" title={title} intro={intro}>
      <ActionForm action={saveHours} className="a-card">
        {DAYS.map((day, weekday) => {
          const h = byDay(weekday);
          return (
            <div key={day} className="a-grid a-grid--3"
              style={{ alignItems: 'end', paddingBottom: '0.85rem', marginBottom: '0.85rem', borderBottom: '1px solid #eee7dd' }}>
              <label className="a-field">
                <span>{day} opens</span>
                <input type="time" name={`opens-${weekday}`} defaultValue={h.opens} />
              </label>
              <label className="a-field">
                <span>closes</span>
                <input type="time" name={`closes-${weekday}`} defaultValue={h.closes} />
              </label>
              <Check label="Closed all day" name={`closed-${weekday}`} defaultChecked={h.closed} />
            </div>
          );
        })}
        <div className="a-row"><Submit>Save opening hours</Submit></div>
      </ActionForm>

      <div className="a-note" style={{ marginTop: '1.5rem' }}>
        <b>For Ramadan</b>
        <p style={{ margin: '0.4rem 0 0' }}>
          Change the times here, and put a line on the Contact tab notice bar so visitors see it
          straight away. Change both back afterwards.
        </p>
      </div>
    </Chrome>
  );
}
