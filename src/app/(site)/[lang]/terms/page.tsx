import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { type Lang, isLang, dict, href } from '@/lib/i18n';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  return {
    title: lang === 'ar' ? 'الشروط' : 'Terms',
    alternates: { canonical: href(lang, '/terms'), languages: { en: '/terms', ar: '/ar/terms' } },
    robots: { index: false, follow: true },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const { settings } = await getContent();
  const d = dict(lang);

  return (
    <section className="section section--tight" style={{ paddingBottom: 'var(--section-y)' }}>
      <div className="wrap">
        <hr className="rule" />
        <h1>{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of use'}</h1>
        <p style={{ color: 'var(--taupe)', marginTop: '0.5rem' }}>
          {lang === 'ar' ? 'آخر تحديث: سبتمبر ٢٠٢٦' : 'Last updated: September 2026'}
        </p>

        <div className="prose" style={{ marginTop: '2rem' }}>
          {lang === 'ar' ? (
            <>
              <h2>من نحن</h2>
              <p>{d.salon}، {settings.addressAr}. واتساب واتصال على الرقم المذكور في صفحة التواصل.</p>
              <h2>الأسعار</h2>
              <p>
                لا توجد أسعار منشورة على هذا الموقع. نحدد السعر بالدرهم الإماراتي حسب طول الشعر وكثافته وحالته وما تختارينه، ونخبرك به عبر واتساب أو في الصالون قبل بدء الخدمة. السعر المعتمد هو ما نؤكده لك في الصالون، ويشمل الخدمة المذكورة فقط.
              </p>
              <h2>الحجوزات</h2>
              <p>
                الحجز يتم عبر واتساب أو بالحضور مباشرة. لا يوجد حجز أو دفع إلكتروني على هذا الموقع. إن لم تتمكني من الحضور، أخبرينا مسبقًا حتى نمنح الموعد لغيرك، خاصة في مواعيد الضفائر والحناء الطويلة.
              </p>
              <h2>بطاقات الهدايا</h2>
              <p>
                تصدر البطاقات بالمبلغ الذي تختارينه، وتصرف على أي خدمة من قائمتنا، ويمكن استخدامها على أكثر من زيارة. تُقدم البطاقة عند الحضور. لا تُستبدل بمبلغ نقدي.
              </p>
              <h2>الحساسية والسلامة</h2>
              <p>
                أخبرينا عن أي حساسية أو حالة جلدية أو حمل قبل بدء أي خدمة، خاصة الحناء والصبغة والعلاجات وإزالة الشعر. نجري اختبار حساسية عند الحاجة. الخدمات للسيدات فقط.
              </p>
              <h2>محتوى الموقع</h2>
              <p>
                الصور والنصوص والشعار ملك للصالون. التقييمات المنشورة منقولة كما كتبها أصحابها على صفحتنا في خرائط جوجل. نحرص على دقة المعلومات لكننا لا نضمن خلو الموقع من الأخطاء.
              </p>
              <h2>القانون</h2>
              <p>تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة وإمارة رأس الخيمة.</p>
            </>
          ) : (
            <>
              <h2>Who we are</h2>
              <p>{d.salon}, {settings.addressEn}. WhatsApp and phone numbers are on the contact page.</p>
              <h2>Prices</h2>
              <p>
                No prices are published on this site. We quote in UAE dirhams, and the figure moves with
                the length, thickness and condition of your hair and with what you choose to put in it.
                We tell you the price on WhatsApp or in the salon before we start, it covers the service
                named and nothing more, and the price that applies is the one we confirm on the day.
              </p>
              <h2>Appointments</h2>
              <p>
                Book on WhatsApp or walk in. There is no online booking and no online payment on this
                site. If you cannot make it, tell us beforehand so the slot can go to someone else. That
                matters most for braiding and henna, which hold a chair for several hours.
              </p>
              <h2>Gift cards</h2>
              <p>
                Cards are issued for the amount you choose and can be spent on anything from the menu,
                across more than one visit if you like. Bring the card with you. Cards are not exchanged
                for cash.
              </p>
              <h2>Allergies and safety</h2>
              <p>
                Tell us about any allergy, skin condition or pregnancy before we begin, and particularly
                before henna, colour, treatments or waxing. We patch test where it is needed. Services
                are for women only.
              </p>
              <h2>Content on this site</h2>
              <p>
                The photographs, text and logo belong to the salon. Reviews are reproduced as their
                authors wrote them on our Google profile. We keep the information here accurate, but we
                do not promise the site is free of mistakes.
              </p>
              <h2>Law</h2>
              <p>These terms are governed by the laws of the United Arab Emirates and of Ras Al Khaimah.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
