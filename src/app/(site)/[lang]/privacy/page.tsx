import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { type Lang, isLang, dict, href } from '@/lib/i18n';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  return {
    title: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy policy',
    alternates: { canonical: href(lang, '/privacy'), languages: { en: '/privacy', ar: '/ar/privacy' } },
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const { settings } = await getContent();
  const d = dict(lang);
  const updated = lang === 'ar' ? 'آخر تحديث: سبتمبر ٢٠٢٦' : 'Last updated: September 2026';

  return (
    <section className="section section--tight" style={{ paddingBottom: 'var(--section-y)' }}>
      <div className="wrap">
        <hr className="rule" />
        <h1>{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy policy'}</h1>
        <p style={{ color: 'var(--taupe)', marginTop: '0.5rem' }}>{updated}</p>

        <div className="prose" style={{ marginTop: '2rem' }}>
          {lang === 'ar' ? (
            <>
              <p>
                هذا الموقع يخص {d.salon} في المعيريض، رأس الخيمة. هذه الصفحة تشرح ما يحدث لبياناتك عند زيارتك للموقع.
              </p>
              <h2>ما لا نجمعه</h2>
              <p>
                لا يحتوي الموقع على نموذج تسجيل ولا حسابات ولا سلة شراء ولا دفع إلكتروني. لا نطلب اسمك ولا رقمك ولا بريدك الإلكتروني في أي صفحة، ولا ننشئ ملفًا شخصيًا عنك.
              </p>
              <h2>واتساب والهاتف</h2>
              <p>
                أزرار الحجز تفتح تطبيق واتساب أو تطبيق الهاتف على جهازك. عند مراسلتنا تنتقل رسالتك عبر واتساب، وتخضع لسياسة خصوصية واتساب لا لسياستنا. نحتفظ بالرسائل في هاتف الصالون لتنظيم المواعيد، ونستخدم اسمك ورقمك لهذا الغرض فقط. لا نبيع أي معلومات ولا نشاركها مع أي جهة.
              </p>
              <h2>خرائط جوجل</h2>
              <p>
                صفحة {'"'}اتصلي بنا{'"'} تعرض خريطة من جوجل. عند تحميل الخريطة قد تستقبل جوجل عنوان IP الخاص بك وبيانات المتصفح. هذا يخضع لسياسة خصوصية جوجل. إن لم ترغبي بذلك، يمكنك استخدام رابط الموقع النصي بدلًا من الخريطة.
              </p>
              <h2>ملفات تعريف الارتباط</h2>
              <p>
                لا يستخدم الموقع ملفات تعريف ارتباط للتتبع ولا للإعلانات. ملف الارتباط الوحيد هو ملف تسجيل دخول لوحة التحكم، ولا يُنشأ إلا لموظفي الصالون.
              </p>
              <h2>الصور</h2>
              <p>
                الصور المنشورة على الموقع هي صور الصالون وأعماله وفريقه، منشورة بموافقة من ظهر فيها. إن كنت ترغبين بإزالة صورة تخصك، راسلينا على {settings.email} أو على واتساب ونزيلها.
              </p>
              <h2>حقوقك</h2>
              <p>
                يمكنك أن تطلبي معرفة ما لدينا عنك أو حذفه. راسلينا على {settings.email} وسنرد خلال ثلاثين يومًا. يُعالج الموقع وفق قانون حماية البيانات الشخصية في دولة الإمارات العربية المتحدة.
              </p>
              <h2>التواصل</h2>
              <p>
                {d.salon}، {settings.addressAr}. البريد الإلكتروني {settings.email}.
              </p>
            </>
          ) : (
            <>
              <p>
                This site belongs to {d.salon} in Al Maireed, Ras Al Khaimah. This page explains what
                happens to your information when you visit it.
              </p>
              <h2>What we do not collect</h2>
              <p>
                There is no sign-up form on this site, no accounts, no basket and no online payment.
                No page asks for your name, your number or your email address, and we do not build a
                profile of you.
              </p>
              <h2>WhatsApp and phone</h2>
              <p>
                The booking buttons open WhatsApp or the phone app on your own device. When you message
                us, that conversation travels through WhatsApp and is covered by WhatsApp&rsquo;s privacy
                policy rather than ours. We keep those messages on the salon phone so we can manage
                appointments, and we use your name and number for that and nothing else. We do not sell
                information and we do not pass it to anyone.
              </p>
              <h2>Google Maps</h2>
              <p>
                The contact page shows a Google map. When that map loads, Google may receive your IP
                address and browser details. That is covered by Google&rsquo;s own privacy policy. If you
                would rather not load it, use the text address and the directions link instead.
              </p>
              <h2>Cookies</h2>
              <p>
                No tracking cookies and no advertising cookies. The only cookie this site can set is the
                login cookie for the salon&rsquo;s admin panel, and that is only ever created for staff.
              </p>
              <h2>Photographs</h2>
              <p>
                The photographs here show the salon, its work and its team, published with the agreement
                of the people in them. If a photograph of you appears and you want it taken down, write to{' '}
                {settings.email} or send a WhatsApp message and we will remove it.
              </p>
              <h2>Your rights</h2>
              <p>
                You can ask what we hold about you and ask us to delete it. Write to {settings.email} and
                we will answer within thirty days. The site is operated in line with the United Arab
                Emirates Personal Data Protection Law.
              </p>
              <h2>Getting in touch</h2>
              <p>
                {d.salon}, {settings.addressEn}. Email {settings.email}.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
