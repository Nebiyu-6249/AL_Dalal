/**
 * The salon's content, exactly as it appears on the printed price menu.
 *
 * This file does two jobs. It seeds the database the first time /api/setup
 * runs, and it is what the site falls back to if the database is unreachable,
 * so the pages never render empty.
 *
 * Once the database is set up, edits made in /admin win over anything here.
 *
 * The price fields are still seeded, because the columns stay in the database
 * and prices can be switched back on later. Nothing on the site renders them.
 * The salon quotes on WhatsApp instead.
 */

export type SeedService = {
  categorySlug: string;
  groupEn: string; groupAr: string;
  nameEn: string; nameAr: string;
  noteEn?: string; noteAr?: string;
  priceFrom: number; priceTo?: number;
  unitEn?: string; unitAr?: string;
};

export const SETTINGS = {
  id: 1,
  whatsapp: '971543682760',
  phone: '+97172082308',
  email: 'tinaderawa123@gmail.com',
  addressEn: 'Al Maireed, Ras Al Khaimah, United Arab Emirates',
  addressAr: 'المعيريض، رأس الخيمة، الإمارات العربية المتحدة',
  mapsUrl: 'https://maps.app.goo.gl/faanPi1USAtv5GPS9',
  instagram: 'https://www.instagram.com/aldlalhenaandbeaut',
  tiktok: 'https://www.tiktok.com/@aldalalbeauty',
  latitude: 25.8027497,
  longitude: 55.960915,
  menuPdf: '',
  noticeEn: '',
  noticeAr: '',
  noticeActive: false,
};

/** Open 10:00 to 22:00, every day. weekday 0 = Sunday. */
export const HOURS = [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
  weekday, opens: '10:00', closes: '22:00', closed: false,
}));

export const CATEGORIES = [
  {
    slug: 'henna',
    nameEn: 'Henna', nameAr: 'الحناء',
    taglineEn: 'Drawn by hand, cone by cone',
    taglineAr: 'ترسم يدويًا بالمخروط',
    introEn:
      'Brown and black henna, drawn by hand. Bridal work, Eid and party designs, and henna for the hair. ' +
      'Wedding weeks and the days before Eid fill early, so message us ahead rather than on the day.',
    introAr:
      'حناء بنية وسوداء ترسم يدويًا. نقوش للعرائس وللأعياد والمناسبات، وحناء للشعر. ' +
      'أسابيع الأعراس وأيام ما قبل العيد تمتلئ مبكرًا، لذا راسلينا مسبقًا.',
    tileImage: '/images/tile-henna.webp',
    heroImage: '/images/service-henna.webp',
    sortOrder: 1,
  },
  {
    slug: 'braiding',
    nameEn: 'Braiding & Extensions', nameAr: 'الضفائر والإكستنشن',
    taglineEn: 'Cornrows, knotless, sew-in and extensions',
    taglineAr: 'كورنروز، ضفائر، خياطة وإكستنشن',
    introEn:
      'Braiding, sew-in fixing, fixing by line, clips, rings and candle fixing. ' +
      'The price follows the length, the thickness and how fine you want the parting, so a small ' +
      'set of cornrows and a full head down to the waist are not the same job. Send a photo of what ' +
      'you want on WhatsApp and we will tell you the price and how long to set aside before you come in.',
    introAr:
      'ضفائر، تركيب بالخياطة، تركيب بالخط، مشابك، حلقات وتركيب بالشمع. ' +
      'السعر يتبع الطول والكثافة ودقة الفرق، فمجموعة صغيرة من الكورنروز تختلف عن رأس كامل حتى الخصر. ' +
      'أرسلي صورة لما ترغبين به عبر واتساب ونخبرك بالسعر والوقت اللازم قبل الحضور.',
    tileImage: '/images/tile-braiding.webp',
    heroImage: '/images/service-braiding.webp',
    sortOrder: 2,
  },
  {
    slug: 'hair',
    nameEn: 'Hair', nameAr: 'الشعر',
    taglineEn: 'Treatments, cuts, colour and styling',
    taglineAr: 'علاجات وقص وصبغة وتصفيف',
    introEn:
      'Protein, keratin, botox and kabiyan treatments, hot oil and steam, cuts, colour, relaxing and blow dries. ' +
      'Treatment prices move with length and condition, so we look at your hair and quote before we start. ' +
      'Nothing gets added to the bill once you are in the chair.',
    introAr:
      'علاجات البروتين والكيراتين والبوتوكس والكابيان، حمام زيت ساخن بالبخار، قص وصبغة وفرد وتجفيف. ' +
      'تختلف أسعار العلاج حسب طول الشعر وحالته، لذا نعاين شعرك ونحدد السعر قبل البدء. ' +
      'لا نضيف أي مبلغ بعد جلوسك على الكرسي.',
    tileImage: '/images/tile-hair.webp',
    heroImage: '/images/service-hair.webp',
    sortOrder: 3,
  },
  {
    slug: 'nails',
    nameEn: 'Nails', nameAr: 'الأظافر',
    taglineEn: 'Manicure, pedicure, extensions and art',
    taglineAr: 'مانيكير وبديكير وتركيب ورسم',
    introEn:
      'Gel and regular polish, acrylic, hard gel and dip powder extensions, refills, shaping, ' +
      'manicure and pedicure. Removal is priced whether or not the set came from us, so bring in work ' +
      'from anywhere and we will take it off properly rather than let you pick at it.',
    introAr:
      'طلاء جل وعادي، تركيب أكريليك وهارد جل وديب باودر، تعبئة، تشكيل، مانيكير وبديكير. ' +
      'الإزالة لها سعر سواء ركبنا الأظافر عندنا أو لا، فأحضري أي تركيب ونزيله بطريقة صحيحة.',
    tileImage: '/images/tile-nails.webp',
    heroImage: '/images/service-nails.webp',
    sortOrder: 4,
  },
  {
    slug: 'skin',
    nameEn: 'Skin & Waxing', nameAr: 'البشرة وإزالة الشعر',
    taglineEn: 'Facials, waxing, massage',
    taglineAr: 'فيشل وإزالة شعر ومساج',
    introEn:
      'Facials, full face clean-up with scrub and vitamins, waxing from the face to the full body, ' +
      'body massage and bleaching. The wax is warm honey wax, patch tested and single use, ' +
      'so no pot gets double dipped.',
    introAr:
      'فيشل، تنظيف كامل للوجه بالتقشير والفيتامينات، إزالة الشعر من الوجه حتى الجسم كامل، ' +
      'مساج وتفتيح للجسم. الشمع شمع عسل دافئ يستخدم مرة واحدة مع اختبار حساسية، ' +
      'ولا تغمس الأداة في الوعاء مرتين.',
    tileImage: '/images/tile-skin.webp',
    heroImage: '/images/service-skin.webp',
    sortOrder: 5,
  },
  {
    slug: 'lashes',
    nameEn: 'Lashes, Brows & Makeup', nameAr: 'الرموش والحواجب والمكياج',
    taglineEn: 'Threading, extensions, refills and makeup',
    taglineAr: 'خيط وتركيب وتعبئة ومكياج',
    introEn:
      'Eyelash extensions, one month sets, refills and removal. Brow threading, shaping, colouring ' +
      'and bleaching. Makeup for weddings, graduations and parties, in the salon or at your home.',
    introAr:
      'تركيب رموش، رموش لمدة شهر، تعبئة وإزالة. خيط وتشكيل وصبغ وتفتيح الحواجب. ' +
      'مكياج للأعراس والتخرج والمناسبات، في الصالون أو في منزلك.',
    tileImage: '/images/tile-lashes.webp',
    heroImage: '/images/service-lashes.webp',
    sortOrder: 6,
  },
];

const S = (
  categorySlug: string, groupEn: string, groupAr: string,
  rows: Array<[string, string, number, number?, string?, string?, string?, string?]>,
): SeedService[] =>
  rows.map(([nameEn, nameAr, priceFrom, priceTo, unitEn, unitAr, noteEn, noteAr]) => ({
    categorySlug, groupEn, groupAr, nameEn, nameAr, priceFrom, priceTo,
    unitEn: unitEn ?? '', unitAr: unitAr ?? '', noteEn: noteEn ?? '', noteAr: noteAr ?? '',
  }));

export const SERVICES: SeedService[] = [
  ...S('henna', 'Henna', 'الحناء', [
    ['Brown Henna', 'حناء بنية', 70],
    ['Black Henna', 'حناء سوداء', 70],
  ]),

  ...S('braiding', 'Braiding & Fixing', 'الضفائر والتركيب', [
    ['Hair Braiding', 'ضفائر الشعر', 100, 600],
    ['Hair Fixing (Sew-in)', 'تركيب الشعر بالخياطة', 100, 120],
    ['Hair Extension', 'إكستنشن الشعر', 200, 350],
    ['Hair Fixing by Line', 'تركيب بالخط', 20, undefined, 'per line', 'للخط'],
    ['Hair Clip Fixing', 'تركيب مشابك الشعر', 80, 100],
    ['Ring Hair Fixing', 'تركيب بالحلقات', 200, 250],
    ['Candle Hair Fixing', 'تركيب بالشمع', 200, 250],
  ]),
  ...S('braiding', 'Stickers & Removal', 'اللاصق والإزالة', [
    ['Hair Extension Sticker', 'لاصق إكستنشن', 250, undefined, 'each', 'للقطعة'],
    ['Hair Extension Sticker Fixing', 'تركيب لاصق الإكستنشن', 200, 350],
    ['Hair Extension Sticker Removal', 'إزالة لاصق الإكستنشن', 50],
    ['Hair Braids Removal', 'فك الضفائر', 50],
  ]),

  ...S('hair', 'Treatments', 'العلاجات', [
    ['Protein Treatment', 'علاج البروتين', 350, 700, '', '', 'Depending on hair length and condition', 'حسب طول الشعر وحالته'],
    ['Botox Treatment', 'علاج البوتوكس', 350, 400],
    ['Keratin Treatment', 'علاج الكيراتين', 300, 600],
    ['Kabiyan Treatment', 'علاج الكابيان', 150, 200],
    ['Hot Oil Steam Treatment', 'حمام زيت ساخن بالبخار', 70],
    ['Hair Butter Treatment', 'علاج بزبدة الشعر', 80],
    ['Aloe Vera Hair Mask', 'ماسك الصبار للشعر', 70],
    ['Mixed Hair Treatment', 'علاج مختلط للشعر', 70],
    ['Hair Massage', 'مساج للشعر', 50, 70],
  ]),
  ...S('hair', 'Cutting & Styling', 'القص والتصفيف', [
    ['Hair Wash', 'غسيل الشعر', 40],
    ['Blow Dry', 'تجفيف بالسشوار', 70],
    ['Blow Dry (Phon)', 'تجفيف بالفون', 60],
    ['Conditioner + Blow Dry', 'بلسم مع تجفيف', 100],
    ['Hair Styling', 'تصفيف الشعر', 100, 150],
    ['Hair Wave', 'تمويج الشعر', 70, 100],
    ['Curly Wave', 'تجعيد الشعر', 70, 100],
    ['Hair Relaxer', 'فرد الشعر', 100, 150],
    ['Hair Cut', 'قص الشعر', 20, 50],
    ['Layer (Step) Hair Cut', 'قص متدرج', 70, 80],
  ]),
  ...S('hair', 'Colour', 'الصبغة', [
    ['Hair Colouring', 'صبغة الشعر', 200, 300],
    ['Black Hair Colouring', 'صبغة سوداء للشعر', 70, 100],
  ]),

  ...S('nails', 'Manicure & Pedicure', 'المانيكير والبديكير', [
    ['Manicure', 'مانيكير', 40, 50],
    ['Special Manicure', 'مانيكير خاص', 60],
    ['Pedicure', 'بديكير', 90, 100],
    ['Special Pedicure', 'بديكير خاص', 120],
  ]),
  ...S('nails', 'Polish', 'الطلاء', [
    ['Gel Polish', 'طلاء جل', 50],
    ['Sugar Daddy Nail Polish', 'طلاء أظافر Sugar Daddy', 30, 40],
    ['Regular Nail Polish', 'طلاء أظافر عادي', 20, 30],
    ['Nail Shaping', 'تشكيل الأظافر', 20, 30],
  ]),
  ...S('nails', 'Extensions & Refills', 'التركيب والتعبئة', [
    ['Hard Gel Extension', 'تركيب هارد جل', 170],
    ['Acrylic Extension', 'تركيب أكريليك', 200],
    ['Dip Powder Extension', 'تركيب ديب باودر', 100, 120],
    ['Normal Nail Extension', 'تركيب أظافر عادي', 80, 100],
    ['Hard Gel Refill', 'تعبئة هارد جل', 75],
    ['Acrylic Refill', 'تعبئة أكريليك', 100],
  ]),
  ...S('nails', 'Removal', 'الإزالة', [
    ['Nail Extension Removal', 'إزالة تركيب الأظافر', 20, 30],
    ['Gel Extension Removal', 'إزالة تركيب الجل', 40],
    ['Acrylic Extension Removal', 'إزالة تركيب الأكريليك', 50],
  ]),

  ...S('skin', 'Facial Care', 'العناية بالوجه', [
    ['Full Face Clean-up (Scrub & Vitamins)', 'تنظيف كامل للوجه (تقشير وفيتامينات)', 50, 70],
    ['Facial', 'فيشل', 100],
    ['Special Facial', 'فيشل خاص', 150],
  ]),
  ...S('skin', 'Waxing', 'إزالة الشعر بالشمع', [
    ['Full Body Waxing', 'إزالة شعر الجسم كامل', 250],
    ['Full Leg Waxing', 'إزالة شعر الساقين', 70],
    ['Bikini Waxing', 'إزالة شعر البكيني', 70],
    ['Full Hand Waxing', 'إزالة شعر اليدين', 60],
    ['Candle Waxing', 'إزالة الشعر بالشمع', 60],
    ['Full Back Waxing', 'إزالة شعر الظهر', 50],
    ['Full Face Waxing', 'إزالة شعر الوجه', 50],
    ['Underarm Waxing', 'إزالة شعر الإبط', 20],
  ]),
  ...S('skin', 'Body', 'الجسم', [
    ['Body Massage', 'مساج للجسم', 100, 150],
    ['Full Body Bleaching', 'تفتيح كامل للجسم', 100, 150],
  ]),

  ...S('lashes', 'Eyelashes', 'الرموش', [
    ['Eyelash Extension', 'تركيب الرموش', 40, 50],
    ['One Month Eyelash Extension', 'رموش لمدة شهر', 200, 250],
    ['Eyelash Refill', 'تعبئة الرموش', 75],
    ['Eyelash Removal', 'إزالة الرموش', 50],
  ]),
  ...S('lashes', 'Eyebrows', 'الحواجب', [
    ['Eyebrow Colouring', 'صبغ الحواجب', 30, 50],
    ['Eyebrow Bleaching', 'تفتيح الحواجب', 20, 50],
    ['Eyebrow Cleaning', 'تنظيف الحواجب', 20],
    ['Eyebrow Threading', 'خيط الحواجب', 15],
    ['Mustache Threading', 'خيط الشارب', 15],
  ]),
  ...S('lashes', 'Makeup', 'المكياج', [
    ['Makeup', 'مكياج', 150, 200, '', '', 'Bridal and occasion makeup by appointment', 'مكياج العرائس والمناسبات بموعد مسبق'],
  ]),
].map((s, i) => ({ ...s, sortOrder: i }));

export const GIFT_CARDS = [
  {
    slug: 'gift-of-glow',
    titleEn: 'Gift of Glow', titleAr: 'هدية التألق',
    bodyEn:
      'The card we keep in stock all year. You choose the amount, we write the name on it, ' +
      'and she spends it on whatever she wants from the menu. No expiry date and no rules about what it covers.',
    bodyAr:
      'البطاقة المتوفرة لدينا طوال العام. تختارين المبلغ، ونكتب الاسم عليها، ' +
      'وتصرفها على ما تشاء من قائمتنا. بدون تاريخ انتهاء وبدون شروط.',
    image: '/images/int-styling.webp', yearRound: true, sortOrder: 1,
  },
  {
    slug: 'wedding',
    titleEn: 'Wedding', titleAr: 'الأعراس',
    bodyEn:
      'For the bride, or for the women around her. Bridal henna and hair are what most of these go on, ' +
      'and we travel to the house for wedding mornings. Book the date early, because the week before a wedding ' +
      'is the week everyone else is booking too.',
    bodyAr:
      'للعروس أو لمن حولها. تستخدم غالبًا لحناء العروس وتصفيف الشعر، ' +
      'ونحضر إلى المنزل في صباح العرس. احجزي التاريخ مبكرًا، فالأسبوع الذي يسبق العرس هو أكثر الأسابيع ازدحامًا.',
    image: '/images/service-henna.webp', yearRound: false, sortOrder: 2,
  },
  {
    slug: 'graduation',
    titleEn: 'Graduation', titleAr: 'التخرج',
    bodyEn:
      'Hair, makeup and nails before the ceremony, or the whole thing as one card she opens on the day. ' +
      'Graduation season runs busy in May and June, so give us a few days of warning.',
    bodyAr:
      'شعر ومكياج وأظافر قبل الحفل، أو البطاقة كاملة تفتحها في يومها. ' +
      'موسم التخرج مزدحم في مايو ويونيو، لذا أخبرينا قبل أيام.',
    image: '/images/g-hair-updo.webp', yearRound: false, sortOrder: 3,
  },
  {
    slug: 'birthday',
    titleEn: 'Birthday', titleAr: 'أعياد الميلاد',
    bodyEn:
      'Written to her name, spent on whatever she likes. Most people put it toward nails or a facial, ' +
      'though a full afternoon of hair is not unheard of.',
    bodyAr:
      'مكتوبة باسمها، وتصرفها كما تحب. يستخدمها الأغلب للأظافر أو الفيشل، ' +
      'وبعضهن يفضلن يومًا كاملًا للعناية بالشعر.',
    image: '/images/g-nail-ombre.webp', yearRound: false, sortOrder: 4,
  },
  {
    slug: 'mothers-day',
    titleEn: "Mother's Day", titleAr: 'عيد الأم',
    bodyEn:
      'The one that sells out. If you want it for the day itself, come the week before, ' +
      'because the last two days are always the busiest of the year.',
    bodyAr:
      'الأكثر طلبًا. إن أردتها ليوم عيد الأم نفسه فتعالي قبل أسبوع، ' +
      'فآخر يومين هما الأكثر ازدحامًا في السنة.',
    image: '/images/g-skin-room.webp', yearRound: false, sortOrder: 5,
  },
];

/** Real reviews from the Google Business Profile. Nothing invented. */
export const TESTIMONIALS = [
  {
    name: 'Ouarda Amazouz', rating: 5, saidOn: '5 months ago', source: 'Google',
    bodyEn:
      'Every time I visit the salon, I have such a great experience! Huge thank you to Salama for her ' +
      'professionalism and incredible attention to detail. She truly takes her time to make everything ' +
      'perfect, and the results speak for themselves. My nails have never looked better. she\u2019s honestly ' +
      'a queen of nails! Highly recommend her to anyone looking for top-quality service.',
    bodyAr: '', sortOrder: 1,
  },
  {
    name: 'M\u00e1R', rating: 5, saidOn: 'a month ago', source: 'Google',
    bodyEn:
      'The best salon for me, literally! I got my hair done there for Eid, and it lasted a few days ' +
      'and looked amazing.',
    bodyAr: '', sortOrder: 2,
  },
  {
    name: 'Ameena N.', rating: 5, saidOn: '2 months ago', source: 'Google',
    bodyEn: 'Their work is good and they are skilled. Their prices are reasonable.',
    bodyAr: '', sortOrder: 3,
  },
  {
    name: 'amira amira', rating: 5, saidOn: 'a year ago', source: 'Google',
    bodyEn:
      'This salon is absolutely amazing and the service is wonderful. I would never go anywhere else. \u2764\ufe0f\u2764\ufe0f\u2764\ufe0f',
    bodyAr: '', sortOrder: 4,
  },
];

const F = (
  page: string,
  rows: Array<[string, string, string, string]>,
) => rows.map(([questionEn, questionAr, answerEn, answerAr], i) => ({
  page, questionEn, questionAr, answerEn, answerAr, sortOrder: i,
}));

export const FAQS = [
  ...F('home', [
    ['Do I need an appointment?', 'هل أحتاج إلى موعد؟',
      'Walk in any day between 10:00 and 22:00 and we will fit you in where we can. For braiding, henna and anything bridal, message us first, because those take hours rather than minutes.',
      'يمكنك الحضور أي يوم بين الساعة ١٠ صباحًا و١٠ مساءً وسنستقبلك متى أمكن. أما الضفائر والحناء وخدمات العرائس فراسلينا مسبقًا لأنها تستغرق ساعات.'],
    ['Which languages do you speak?', 'ما اللغات التي تتحدثونها؟',
      'Arabic, English and Amharic.',
      'العربية والإنجليزية والأمهرية.'],
    ['Is the salon ladies only?', 'هل الصالون للسيدات فقط؟',
      'Yes. Al Dalal is a ladies salon.',
      'نعم، صالون الدلال مخصص للسيدات فقط.'],
    ['Do you come to the house for weddings?', 'هل تحضرون إلى المنزل للأعراس؟',
      'Yes, for henna, hair and makeup. Send us the date and the area on WhatsApp and we will tell you what we can do.',
      'نعم، للحناء والشعر والمكياج. أرسلي لنا التاريخ والمنطقة عبر واتساب ونخبرك بما يمكننا تقديمه.'],
    ['Why are there no prices on the site?', 'لماذا لا توجد أسعار على الموقع؟',
      'Because the same service costs different amounts depending on your hair. A braiding set can be a small job or most of a day, and extensions, rings and clips all change the figure. Send us a photo on WhatsApp and we will tell you the price before you come in, and we confirm it again in the salon before we start.',
      'لأن الخدمة نفسها تختلف كلفتها حسب شعرك. مجموعة الضفائر قد تكون عملًا صغيرًا أو تستغرق معظم اليوم، والإكستنشن والحلقات والمشابك تغير السعر كلها. أرسلي لنا صورة عبر واتساب ونخبرك بالسعر قبل حضورك، ونؤكده مرة أخرى في الصالون قبل أن نبدأ.'],
    ['How do I pay?', 'كيف أدفع؟',
      'In the salon, when the work is finished. There is no online payment and no deposit for ordinary appointments.',
      'في الصالون بعد انتهاء الخدمة. لا يوجد دفع إلكتروني ولا عربون للمواعيد العادية.'],
  ]),
  ...F('henna', [
    ['How long does henna take to stain?', 'كم تستغرق الحناء حتى تثبت؟',
      'The paste needs two to six hours on the skin. The colour keeps darkening for about 48 hours after you scrape it off, so what you see on the first evening is not the final shade.',
      'تحتاج العجينة من ساعتين إلى ست ساعات على الجلد. ويستمر اللون بالغمقان نحو ٤٨ ساعة بعد إزالتها، فاللون الذي ترينه في المساء الأول ليس النهائي.'],
    ['How long does it last?', 'كم تدوم؟',
      'Roughly one to two weeks on the hands, less on the feet and anywhere you wash often.',
      'من أسبوع إلى أسبوعين تقريبًا على اليدين، وأقل على القدمين وفي المناطق التي تغسل كثيرًا.'],
    ['How far ahead should I book for a wedding?', 'متى أحجز لحناء العرس؟',
      'Two weeks is comfortable. In wedding season and the week before Eid, the earlier the better, because those days book out first.',
      'أسبوعان وقت مريح. وفي موسم الأعراس والأسبوع الذي يسبق العيد كلما كان الحجز أبكر كان أفضل.'],
  ]),
  ...F('braiding', [
    ['How long does a braiding appointment take?', 'كم يستغرق موعد الضفائر؟',
      'Anywhere from two hours to most of a day, depending on the style, the length and how fine the parting is. We will give you a time when you send the photo, so you can plan the day around it.',
      'من ساعتين إلى معظم اليوم حسب التسريحة والطول ودقة الفرق. سنخبرك بالوقت عند إرسال الصورة لتتمكني من ترتيب يومك.'],
    ['Do I bring my own hair?', 'هل أحضر الشعر بنفسي؟',
      'You can, and plenty of people do. We also stock extensions in the salon. Message us before you buy so you get the right length and quantity for the style you want.',
      'يمكنك ذلك ويفعله الكثيرات. كما تتوفر لدينا الإكستنشن في الصالون. راسلينا قبل الشراء لتحصلي على الطول والكمية المناسبين.'],
    ['Why is there no price for braiding?', 'لماذا لا يوجد سعر ثابت للضفائر؟',
      'Because a small set of cornrows and a full head of knotless braids down to the waist are not the same job. The price follows length, thickness and how many braids there are, and extensions, rings and clips change it again. We quote from a photo before you come in.',
      'لأن مجموعة صغيرة من الكورنروز تختلف عن رأس كامل من الضفائر حتى الخصر. السعر يتبع الطول والكثافة وعدد الضفائر، والإكستنشن والحلقات والمشابك تغيره أيضًا. نحدده من الصورة قبل حضورك.'],
  ]),
  ...F('hair', [
    ['Why does the price of a protein treatment vary?', 'لماذا يختلف سعر علاج البروتين؟',
      'Length and condition. Short hair in good condition takes less product and less time than long or damaged hair. We look at your hair and tell you the price before we open anything.',
      'بسبب الطول والحالة. الشعر القصير السليم يحتاج مواد ووقتًا أقل من الشعر الطويل أو التالف. نعاين شعرك ونخبرك بالسعر قبل أن نفتح أي منتج.'],
    ['Which treatment should I pick?', 'أي علاج أختار؟',
      'It depends on what you want to fix. Keratin and botox are for smoothing and frizz, protein is for strength after damage, kabiyan and the oil treatments are for condition rather than shape. Ask when you arrive and we will look at your hair rather than guess.',
      'يعتمد على ما ترغبين بمعالجته. الكيراتين والبوتوكس للنعومة والتجعد، والبروتين لتقوية الشعر التالف، والكابيان وحمامات الزيت للترطيب أكثر من الفرد. اسألينا عند الحضور لنعاين شعرك.'],
    ['Do you test colour first?', 'هل تجرون اختبارًا للصبغة؟',
      'Yes, if you have never coloured with us or you have reacted to a dye before. Say so when you book so there is time for it.',
      'نعم، إذا لم تصبغي لدينا من قبل أو سبق أن تحسست من صبغة. أخبرينا عند الحجز ليتوفر الوقت لذلك.'],
  ]),
  ...F('nails', [
    ['How long does gel polish last?', 'كم يدوم طلاء الجل؟',
      'About two to three weeks before the regrowth starts to show. Extensions go three to four weeks between refills.',
      'من أسبوعين إلى ثلاثة قبل أن يظهر النمو. أما التركيب فمن ثلاثة إلى أربعة أسابيع بين كل تعبئة.'],
    ['Can you remove nails that were done somewhere else?', 'هل تزيلون أظافر ركبت في مكان آخر؟',
      'Yes. Removal has a price of its own and it depends on what is on there, so we look first and tell you. Better that than picking them off yourself, which takes the top layer of your natural nail with it.',
      'نعم. للإزالة سعرها الخاص ويعتمد على نوع التركيب، فنعاينه أولًا ونخبرك به. وهذا أفضل من نزعها بنفسك لأن ذلك يقشر الطبقة العليا من الظفر الطبيعي.'],
    ['Hard gel, acrylic or dip powder?', 'هارد جل أم أكريليك أم ديب باودر؟',
      'Acrylic is the strongest and the best choice for long shapes. Hard gel is lighter and looks more natural. Dip powder sits in between and goes on fastest. Tell us what you do with your hands all day and we will point you at one.',
      'الأكريليك الأقوى والأنسب للأشكال الطويلة. الهارد جل أخف ومظهره أكثر طبيعية. والديب باودر بينهما والأسرع تطبيقًا. أخبرينا بطبيعة عملك اليومي ونرشدك للأنسب.'],
  ]),
  ...F('skin', [
    ['Is the wax reused between clients?', 'هل يعاد استخدام الشمع؟',
      'No. Warm honey wax, single use, and the applicator never goes back into the pot.',
      'لا. شمع عسل دافئ يستخدم مرة واحدة، والأداة لا تعاد إلى الوعاء أبدًا.'],
    ['How long should the hair be before waxing?', 'ما طول الشعر المناسب قبل إزالته بالشمع؟',
      'Around five millimetres, which is roughly two weeks of growth. Shorter than that and the wax has nothing to hold.',
      'حوالي خمسة مليمترات، أي ما ينمو خلال أسبوعين تقريبًا. وإن كان أقصر فلن يتمكن الشمع من الإمساك به.'],
    ['What is in the full face clean-up?', 'ماذا يشمل تنظيف الوجه الكامل؟',
      'Cleansing, a scrub and a vitamin treatment. The facial and the special facial add steam, extraction and a mask, and they cost more than the clean-up. Ask on WhatsApp and we will tell you what each one comes to.',
      'تنظيف وتقشير وعلاج بالفيتامينات. أما الفيشل والفيشل الخاص فيضيفان البخار والتنظيف العميق والماسك، وسعرهما أعلى من التنظيف. راسلينا على واتساب ونخبرك بسعر كل واحد منها.'],
  ]),
  ...F('lashes', [
    ['How long do eyelash extensions last?', 'كم تدوم الرموش المركبة؟',
      'Two to three weeks before they need a refill. The one month set is built to run longer between visits and costs more to put on. Ask and we will tell you both prices.',
      'من أسبوعين إلى ثلاثة قبل الحاجة إلى تعبئة. أما رموش الشهر فمصممة لتدوم أطول بين الزيارات وسعرها أعلى. اسألينا ونخبرك بسعر الاثنين.'],
    ['Does threading hurt?', 'هل الخيط مؤلم؟',
      'A little on the first visit, much less after that. It is quicker than waxing and it does not lift the skin, which is why most people stay with it.',
      'قليلًا في المرة الأولى، وأقل بكثير بعدها. وهو أسرع من الشمع ولا يشد الجلد، ولهذا تفضله الأغلبية.'],
    ['Can you do makeup at my home?', 'هل يمكنكم عمل المكياج في منزلي؟',
      'Yes, for weddings, graduations and parties. Message us the date and the area and we will tell you what we can do.',
      'نعم، للأعراس والتخرج والمناسبات. راسلينا بالتاريخ والمنطقة ونخبرك بما يمكننا تقديمه.'],
  ]),
];

/** Interior photography, shown on the About page and in the hero. */
export const PHOTOS = [
  { slot: 'hero', url: '/images/hero-salon.webp', altEn: 'The styling room at Al Dalal, with backlit gold arch mirrors', altAr: 'قاعة التصفيف في صالون الدلال بمرايا ذهبية مقوسة مضاءة', width: 1448, height: 814, sortOrder: 1 },
  { slot: 'hero', url: '/images/hero-pedicure.webp', altEn: 'Pedicure chairs beneath the Al Dalal Henna & Beauty sign', altAr: 'كراسي البديكير تحت لوحة صالون الدلال للحناء والتجميل', width: 1428, height: 803, sortOrder: 2 },
  { slot: 'hero', url: '/images/hero-nails.webp', altEn: 'The nail stations at Al Dalal', altAr: 'طاولات الأظافر في صالون الدلال', width: 1600, height: 900, sortOrder: 3 },
  { slot: 'about-team', url: '/images/about-team.webp', altEn: 'The team at Al Dalal Henna & Beauty', altAr: 'فريق صالون الدلال للحناء والتجميل', width: 1280, height: 853, sortOrder: 1 },
  { slot: 'interior', url: '/images/int-styling.webp', altEn: 'Styling chairs and the extension wall', altAr: 'كراسي التصفيف وجدار الإكستنشن', width: 1448, height: 965, sortOrder: 1 },
  { slot: 'interior', url: '/images/int-mirrors.webp', altEn: 'Backlit arch mirrors at the styling stations', altAr: 'مرايا مقوسة مضاءة عند محطات التصفيف', width: 1428, height: 952, sortOrder: 2 },
  { slot: 'interior', url: '/images/int-basins.webp', altEn: 'Wash basins and the product cabinet', altAr: 'أحواض الغسيل وخزانة المنتجات', width: 1372, height: 914, sortOrder: 3 },
  { slot: 'interior', url: '/images/int-nail-stations.webp', altEn: 'Nail stations', altAr: 'طاولات الأظافر', width: 1500, height: 999, sortOrder: 4 },
  { slot: 'interior', url: '/images/int-pedicure.webp', altEn: 'Pedicure chairs', altAr: 'كراسي البديكير', width: 1428, height: 952, sortOrder: 5 },

  { slot: 'gallery-henna', url: '/images/g-henna-1.webp', altEn: 'Henna line ornament', altAr: 'زخرفة حناء', width: 820, height: 820, sortOrder: 1 },

  { slot: 'gallery-braiding', url: '/images/g-braid-cornrows.webp', altEn: 'Cornrow braiding', altAr: 'ضفائر كورنروز', width: 736, height: 736, sortOrder: 1 },
  { slot: 'gallery-braiding', url: '/images/g-braid-knotless.webp', altEn: 'Knotless braids with curled ends', altAr: 'ضفائر بدون عقد بأطراف مجعدة', width: 736, height: 736, sortOrder: 2 },
  { slot: 'gallery-braiding', url: '/images/g-braid-cuffs.webp', altEn: 'Fine braids with gold cuffs and rings', altAr: 'ضفائر رفيعة بحلقات ذهبية', width: 453, height: 453, sortOrder: 3 },

  { slot: 'gallery-hair', url: '/images/g-hair-curl.webp', altEn: 'Curling and styling in progress', altAr: 'تجعيد وتصفيف الشعر', width: 820, height: 820, sortOrder: 1 },
  { slot: 'gallery-hair', url: '/images/g-hair-updo.webp', altEn: 'A finished occasion updo', altAr: 'تسريحة مناسبات', width: 519, height: 519, sortOrder: 2 },

  { slot: 'gallery-nails', url: '/images/g-nail-ombre.webp', altEn: 'White ombre almond nails', altAr: 'أظافر أومبريه بيضاء', width: 820, height: 820, sortOrder: 1 },
  { slot: 'gallery-nails', url: '/images/g-nail-burgundy.webp', altEn: 'Burgundy gel polish', altAr: 'طلاء جل بلون النبيذ', width: 708, height: 708, sortOrder: 2 },
  { slot: 'gallery-nails', url: '/images/g-nail-acrylic.webp', altEn: 'Acrylic extension being applied', altAr: 'تركيب أظافر أكريليك', width: 768, height: 768, sortOrder: 3 },
  { slot: 'gallery-nails', url: '/images/g-nail-gel.webp', altEn: 'Gel polish in a warm nude', altAr: 'طلاء جل بلون نود دافئ', width: 820, height: 820, sortOrder: 4 },
  { slot: 'gallery-nails', url: '/images/g-nail-pedicure.webp', altEn: 'Pedicure soak', altAr: 'نقع القدمين قبل البديكير', width: 820, height: 820, sortOrder: 5 },

  { slot: 'gallery-skin', url: '/images/g-skin-room.webp', altEn: 'The treatment room', altAr: 'غرفة العلاج', width: 574, height: 574, sortOrder: 1 },
  { slot: 'gallery-skin', url: '/images/g-skin-waxing.webp', altEn: 'Waxing', altAr: 'إزالة الشعر بالشمع', width: 628, height: 628, sortOrder: 2 },
];
