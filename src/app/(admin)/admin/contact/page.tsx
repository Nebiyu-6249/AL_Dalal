import { getAdminContent } from '@/lib/content';
import { getSession } from '@/lib/auth';
import { saveSettings } from '@/actions/admin';
import { ActionForm, Field, Area, Check, Upload, Submit } from '@/components/admin/Form';
import Chrome from '../Chrome';
import NoDatabase from '../NoDatabase';

export const dynamic = 'force-dynamic';

export default async function ContactAdmin() {
  const session = await getSession();
  const data = await getAdminContent();
  const title = 'Contact details';
  const intro = 'Changing a number here changes it in the header, the footer, every WhatsApp button, the contact page and the information Google reads.';

  if (!data) {
    return <Chrome who={session?.name ?? ''} current="/admin/contact" title={title} intro={intro}><NoDatabase /></Chrome>;
  }
  const s = data.settings;

  return (
    <Chrome who={session?.name ?? ''} current="/admin/contact" title={title} intro={intro}>
      <ActionForm action={saveSettings} className="a-card">
        <div className="a-grid a-grid--2">
          <Field label="WhatsApp number" name="whatsapp" defaultValue={s.whatsapp}
            hint="digits only, with country code" required />
          <Field label="Phone number" name="phone" defaultValue={s.phone} />
          <Field label="Email" name="email" type="email" defaultValue={s.email} />
          <Field label="Google Maps link" name="mapsUrl" defaultValue={s.mapsUrl} />
          <Field label="Instagram link" name="instagram" defaultValue={s.instagram} />
          <Field label="TikTok link" name="tiktok" defaultValue={s.tiktok} />
          <Field label="Address, English" name="addressEn" defaultValue={s.addressEn} />
          <Field label="Address, Arabic" name="addressAr" defaultValue={s.addressAr} ar />
          <Field label="Latitude" name="latitude" defaultValue={s.latitude} />
          <Field label="Longitude" name="longitude" defaultValue={s.longitude} />
        </div>

        <h3 style={{ margin: '1.75rem 0 0.75rem', fontSize: '1rem' }}>Printable menu</h3>
        <p className="a-sum" style={{ margin: '0 0 0.75rem' }}>
          Upload the PDF and a download button appears on the menu page. Leave it empty and
          the page simply lists the prices instead.
        </p>
        <Upload name="menuPdf" defaultValue={s.menuPdf} accept="application/pdf,image/*" />

        <h3 style={{ margin: '1.75rem 0 0.75rem', fontSize: '1rem' }}>Notice bar</h3>
        <p className="a-sum" style={{ margin: '0 0 0.75rem' }}>
          A line across the top of every page. Use it for Ramadan hours, Eid closures or a
          fully booked week, then switch it off again.
        </p>
        <div className="a-grid a-grid--2">
          <Area label="Notice, English" name="noticeEn" defaultValue={s.noticeEn} rows={2} />
          <Area label="Notice, Arabic" name="noticeAr" defaultValue={s.noticeAr} ar rows={2} />
        </div>
        <div className="a-row">
          <Check label="Show the notice" name="noticeActive" defaultChecked={s.noticeActive} />
          <Submit>Save contact details</Submit>
        </div>
      </ActionForm>
    </Chrome>
  );
}
