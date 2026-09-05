export const LANGS = ['en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);
export const dir = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');

/** English lives at the root, Arabic under /ar. */
export function href(lang: Lang, path = '/') {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return lang === 'ar' ? `/ar${clean || ''}` || '/ar' : clean || '/';
}

/** Picks the right language field off a row without a conditional at each use. */
export const pick = <T extends Record<string, unknown>>(
  row: T, base: string, lang: Lang,
): string => {
  const key = base + (lang === 'ar' ? 'Ar' : 'En');
  const value = row[key];
  if (typeof value === 'string' && value.trim()) return value;
  const fallbackValue = row[base + 'En'];
  return typeof fallbackValue === 'string' ? fallbackValue : '';
};

export const t = {
  en: {
    salon: 'Al Dalal Henna & Beauty',
    tagline: 'Henna, braiding and beauty in Ras Al Khaimah',
    nav: { services: 'Services', gift: 'Gift Cards', menu: 'Menu', about: 'About', contact: 'Contact' },
    book: 'Book on WhatsApp',
    bookShort: 'WhatsApp',
    call: 'Call',
    viewMenu: 'See the price menu',
    downloadMenu: 'Download the menu (PDF)',
    allServices: 'All services',
    viewPrices: 'View prices',
    from: 'from',
    aed: 'AED',
    perLine: 'per line',
    each: 'each',
    ourWork: 'Our work',
    priceList: 'Price list',
    questions: 'Common questions',
    reviews: 'What clients say',
    reviewsSub: 'Reviews left on our Google profile.',
    findUs: 'Find us',
    openingHours: 'Opening hours',
    openDaily: 'Open every day',
    address: 'Address',
    getDirections: 'Open in Google Maps',
    followUs: 'Follow',
    ladiesOnly: 'Ladies only',
    languages: 'Arabic, English and Amharic spoken',
    walkIns: 'Walk in, or message ahead',
    skipToContent: 'Skip to content',
    switchLang: 'العربية',
    switchLangLabel: 'Switch to Arabic',
    menuOpen: 'Menu',
    menuClose: 'Close',
    rights: 'All rights reserved.',
    privacy: 'Privacy',
    terms: 'Terms',
    backHome: 'Back to the home page',
    notFoundTitle: 'That page is not here',
    notFoundBody: 'The link may be old, or the address mistyped. The services and prices are all still where they were.',
    giftIntro: 'Written to a name, spent on anything from the menu. You choose the amount. Ask for one in the salon, or message us and we will put it aside.',
    askAboutGift: 'Ask about this card',
    yearRound: 'Available all year',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    closed: 'Closed',
    menuNote: 'Every price on this page is the price you pay in the salon. Ranges depend on length, thickness or condition, and we tell you where you fall before we start.',
    noMenuPdf: 'The printable menu is being prepared. Every price is listed on this page in the meantime.',
    teamHeading: 'The people who do the work',
  },
  ar: {
    salon: 'صالون الدلال للحناء والتجميل',
    tagline: 'حناء وضفائر وتجميل في رأس الخيمة',
    nav: { services: 'الخدمات', gift: 'بطاقات الهدايا', menu: 'قائمة الأسعار', about: 'من نحن', contact: 'اتصلي بنا' },
    book: 'احجزي عبر واتساب',
    bookShort: 'واتساب',
    call: 'اتصال',
    viewMenu: 'اطلعي على قائمة الأسعار',
    downloadMenu: 'تحميل القائمة (PDF)',
    allServices: 'جميع الخدمات',
    viewPrices: 'عرض الأسعار',
    from: 'تبدأ من',
    aed: 'درهم',
    perLine: 'للخط',
    each: 'للقطعة',
    ourWork: 'من أعمالنا',
    priceList: 'قائمة الأسعار',
    questions: 'أسئلة متكررة',
    reviews: 'آراء عميلاتنا',
    reviewsSub: 'تقييمات منشورة على صفحتنا في خرائط جوجل.',
    findUs: 'موقعنا',
    openingHours: 'ساعات العمل',
    openDaily: 'مفتوح يوميًا',
    address: 'العنوان',
    getDirections: 'افتحي الموقع على خرائط جوجل',
    followUs: 'تابعينا',
    ladiesOnly: 'للسيدات فقط',
    languages: 'نتحدث العربية والإنجليزية والأمهرية',
    walkIns: 'تفضلي بالحضور أو راسلينا مسبقًا',
    skipToContent: 'انتقلي إلى المحتوى',
    switchLang: 'English',
    switchLangLabel: 'التبديل إلى الإنجليزية',
    menuOpen: 'القائمة',
    menuClose: 'إغلاق',
    rights: 'جميع الحقوق محفوظة.',
    privacy: 'الخصوصية',
    terms: 'الشروط',
    backHome: 'العودة إلى الصفحة الرئيسية',
    notFoundTitle: 'هذه الصفحة غير موجودة',
    notFoundBody: 'قد يكون الرابط قديمًا أو العنوان مكتوبًا بشكل خاطئ. جميع الخدمات والأسعار ما زالت في مكانها.',
    giftIntro: 'تكتب باسم من تحبين وتصرف على أي خدمة من القائمة، وأنت تختارين المبلغ. اطلبيها في الصالون أو راسلينا ونحجزها لك.',
    askAboutGift: 'استفسري عن هذه البطاقة',
    yearRound: 'متوفرة طوال العام',
    days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    closed: 'مغلق',
    menuNote: 'كل سعر في هذه الصفحة هو ما تدفعينه في الصالون. النطاقات تعتمد على الطول أو الكثافة أو الحالة، ونخبرك بسعرك قبل البدء.',
    noMenuPdf: 'قائمة الأسعار القابلة للطباعة قيد التجهيز. جميع الأسعار مذكورة في هذه الصفحة.',
    teamHeading: 'الفريق الذي يقوم بالعمل',
  },
} as const;

export type Dict = (typeof t)['en'];
export const dict = (lang: Lang): Dict => t[lang] as unknown as Dict;
