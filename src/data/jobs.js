// Demo job listings. Company names are fictional and used for demonstration only.
export const jobs = [
  {
    id: 'j-1', career: 'frontend', type: 'internship', location: 'cairo', mode: 'hybrid', postedDays: 2, salary: [6000, 8000],
    company: 'Nilecode Labs', logoColor: '#0fa094', skills: ['html-css', 'javascript', 'git'],
    title: { en: 'Front-End Developer Intern', ar: 'متدرب تطوير واجهات أمامية' },
    description: {
      en: 'Join a product team building booking tools for clinics. You will turn Figma designs into accessible React components and fix real bugs from week one.',
      ar: 'انضم لفريق منتج يبني أدوات حجز للعيادات. ستحوّل تصاميم Figma إلى مكوّنات React سهلة الوصول وتصلح أخطاء حقيقية من الأسبوع الأول.',
    },
  },
  {
    id: 'j-2', career: 'frontend', type: 'fulltime', location: 'remote', mode: 'remote', postedDays: 5, salary: [18000, 25000],
    company: 'Souq Pixel', logoColor: '#365294', skills: ['react', 'javascript', 'html-css', 'git'],
    title: { en: 'Junior React Developer', ar: 'مطوّر React مبتدئ' },
    description: {
      en: 'Build storefront features for an e-commerce platform serving shoppers across the region. Mentorship from senior engineers and weekly code reviews.',
      ar: 'ابنِ مزايا واجهة متجر لمنصة تجارة إلكترونية تخدم المتسوقين في المنطقة. إرشاد من مهندسين كبار ومراجعات كود أسبوعية.',
    },
  },
  {
    id: 'j-3', career: 'frontend', type: 'parttime', location: 'alexandria', mode: 'onsite', postedDays: 9, salary: [7000, 10000],
    company: 'Pharos Digital', logoColor: '#1d3061', skills: ['html-css', 'javascript'],
    title: { en: 'Part-Time Web Developer', ar: 'مطوّر ويب بدوام جزئي' },
    description: {
      en: 'Maintain and improve marketing websites for local brands. Flexible hours designed around university schedules.',
      ar: 'صيانة وتحسين المواقع التسويقية لعلامات تجارية محلية. ساعات مرنة تناسب جدول الجامعة.',
    },
  },
  {
    id: 'j-4', career: 'data', type: 'internship', location: 'cairo', mode: 'onsite', postedDays: 1, salary: [5000, 7000],
    company: 'Delta Insights', logoColor: '#0a8079', skills: ['excel', 'sql', 'statistics'],
    title: { en: 'Data Analyst Intern', ar: 'متدرب تحليل بيانات' },
    description: {
      en: 'Help the analytics team build weekly sales reports, clean datasets and answer business questions with SQL.',
      ar: 'ساعد فريق التحليلات في إعداد تقارير المبيعات الأسبوعية وتنظيف البيانات والإجابة عن أسئلة العمل بـ SQL.',
    },
  },
  {
    id: 'j-5', career: 'data', type: 'fulltime', location: 'giza', mode: 'hybrid', postedDays: 4, salary: [15000, 22000],
    company: 'Cairo FinTech Hub', logoColor: '#273f78', skills: ['sql', 'python', 'data-viz', 'statistics'],
    title: { en: 'Junior Data Analyst', ar: 'محلل بيانات مبتدئ' },
    description: {
      en: 'Analyse payment trends, design dashboards for the operations team and present insights to leadership every month.',
      ar: 'حلل اتجاهات المدفوعات وصمّم لوحات معلومات لفريق العمليات واعرض الرؤى على الإدارة شهريًا.',
    },
  },
  {
    id: 'j-6', career: 'data', type: 'fulltime', location: 'dubai', mode: 'onsite', postedDays: 12, salary: null,
    company: 'Gulf Retail Group', logoColor: '#10514f', skills: ['excel', 'sql', 'data-viz'],
    title: { en: 'Business Intelligence Associate', ar: 'مساعد ذكاء أعمال' },
    description: {
      en: 'Graduate programme for analysts who want to build BI dashboards for a regional retail chain. Relocation support available.',
      ar: 'برنامج للخريجين الراغبين في بناء لوحات ذكاء الأعمال لسلسلة متاجر إقليمية. يتوفر دعم للانتقال.',
    },
  },
  {
    id: 'j-7', career: 'ux', type: 'internship', location: 'remote', mode: 'remote', postedDays: 3, salary: [5000, 7000],
    company: 'Studio Mashrabiya', logoColor: '#0fa094', skills: ['figma', 'user-research'],
    title: { en: 'UX Design Intern', ar: 'متدرب تصميم تجربة المستخدم' },
    description: {
      en: 'Support designers on mobile app projects: run user interviews, create wireframes and test prototypes with real users.',
      ar: 'ادعم المصممين في مشاريع تطبيقات الجوال: أجرِ مقابلات المستخدمين وأنشئ الإطارات السلكية واختبر النماذج مع مستخدمين حقيقيين.',
    },
  },
  {
    id: 'j-8', career: 'ux', type: 'fulltime', location: 'cairo', mode: 'hybrid', postedDays: 7, salary: [14000, 20000],
    company: 'Edulink', logoColor: '#365294', skills: ['figma', 'prototyping', 'user-research', 'communication'],
    title: { en: 'Junior Product Designer', ar: 'مصمم منتجات مبتدئ' },
    description: {
      en: 'Design learning experiences used by thousands of students. Own features end to end, from research to polished UI.',
      ar: 'صمّم تجارب تعليمية يستخدمها آلاف الطلاب. تولَّ المزايا من البحث حتى الواجهة النهائية.',
    },
  },
  {
    id: 'j-9', career: 'marketing', type: 'internship', location: 'cairo', mode: 'onsite', postedDays: 2, salary: [4500, 6000],
    company: 'Bloom Agency', logoColor: '#0d6662', skills: ['social-media', 'content'],
    title: { en: 'Social Media Intern', ar: 'متدرب وسائل التواصل الاجتماعي' },
    description: {
      en: 'Plan posts, write captions in Arabic and English and report on engagement for consumer brands.',
      ar: 'خطّط للمنشورات واكتب التعليقات بالعربية والإنجليزية وقدّم تقارير التفاعل لعلامات تجارية استهلاكية.',
    },
  },
  {
    id: 'j-10', career: 'marketing', type: 'fulltime', location: 'riyadh', mode: 'onsite', postedDays: 6, salary: null,
    company: 'Najd Commerce', logoColor: '#1d3061', skills: ['seo', 'web-analytics', 'content'],
    title: { en: 'Digital Marketing Specialist', ar: 'أخصائي تسويق رقمي' },
    description: {
      en: 'Grow organic traffic and run performance campaigns for an online marketplace. Arabic copywriting is a strong plus.',
      ar: 'نمِّ الزيارات العضوية وأدر حملات أداء لسوق إلكتروني. إجادة الكتابة الإعلانية بالعربية ميزة قوية.',
    },
  },
  {
    id: 'j-11', career: 'security', type: 'internship', location: 'giza', mode: 'onsite', postedDays: 4, salary: [6000, 8500],
    company: 'Sentinel Shield', logoColor: '#15234a', skills: ['networking', 'linux', 'security-fundamentals'],
    title: { en: 'SOC Analyst Intern', ar: 'متدرب محلل مركز عمليات أمنية' },
    description: {
      en: 'Monitor alerts in a 24/7 security operations centre, triage incidents and learn from certified analysts.',
      ar: 'راقب التنبيهات في مركز عمليات أمنية يعمل على مدار الساعة وصنّف الحوادث وتعلّم من محللين معتمدين.',
    },
  },
  {
    id: 'j-12', career: 'security', type: 'fulltime', location: 'cairo', mode: 'hybrid', postedDays: 10, salary: [20000, 30000],
    company: 'Nile Bank Technology', logoColor: '#273f78', skills: ['security-fundamentals', 'networking', 'python'],
    title: { en: 'Junior Security Analyst', ar: 'محلل أمن مبتدئ' },
    description: {
      en: 'Help protect digital banking services: vulnerability scanning, log analysis and security awareness campaigns.',
      ar: 'ساهم في حماية الخدمات المصرفية الرقمية: فحص الثغرات وتحليل السجلات وحملات التوعية الأمنية.',
    },
  },
  {
    id: 'j-13', career: 'product', type: 'internship', location: 'remote', mode: 'remote', postedDays: 3, salary: [5000, 7000],
    company: 'Rihla Travel', logoColor: '#0a8079', skills: ['agile', 'communication'],
    title: { en: 'Associate Product Manager Intern', ar: 'متدرب مساعد مدير منتج' },
    description: {
      en: 'Work with engineers and designers on a travel booking app: write user stories, analyse feedback and run sprint demos.',
      ar: 'اعمل مع المهندسين والمصممين على تطبيق حجز سفر: اكتب قصص المستخدم وحلل الملاحظات وقدّم عروض الدورات.',
    },
  },
  {
    id: 'j-14', career: 'product', type: 'fulltime', location: 'alexandria', mode: 'hybrid', postedDays: 8, salary: [16000, 23000],
    company: 'Logix Supply', logoColor: '#10514f', skills: ['agile', 'product-strategy', 'excel', 'communication'],
    title: { en: 'Junior Project Coordinator', ar: 'منسق مشروعات مبتدئ' },
    description: {
      en: 'Coordinate logistics software releases, track timelines and keep stakeholders informed across three teams.',
      ar: 'نسّق إصدارات برمجيات اللوجستيات وتابع الجداول الزمنية وأبقِ أصحاب المصلحة على اطلاع عبر ثلاثة فرق.',
    },
  },
]

export const jobTypes = ['internship', 'fulltime', 'parttime']
export const jobLocations = ['cairo', 'giza', 'alexandria', 'remote', 'dubai', 'riyadh']
export const jobById = Object.fromEntries(jobs.map((j) => [j.id, j]))
