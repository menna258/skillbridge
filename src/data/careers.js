import { img } from '../lib/images'

// Career paths the assessment can recommend. Salary ranges are indicative
// monthly entry-level figures in EGP for the Egyptian market (demo data).
export const careers = [
  {
    id: 'frontend',
    icon: 'Code2',
    title: { en: 'Front-End Developer', ar: 'مطوّر واجهات أمامية' },
    summary: {
      en: 'Build fast, accessible websites and web apps that people enjoy using.',
      ar: 'تبني مواقع وتطبيقات ويب سريعة وسهلة الاستخدام يستمتع بها الناس.',
    },
    image: img('photo-1498050108023-c5249f4df085'),
    salary: [15000, 28000],
    demand: 'high',
    traits: { technical: 3, creative: 2, analytical: 2, communication: 1, leadership: 0 },
    skills: ['html-css', 'javascript', 'react', 'git'],
    roadmap: [
      {
        title: { en: 'Web foundations', ar: 'أساسيات الويب' },
        weeks: 4,
        steps: [
          { id: 'fe-1', title: { en: 'Structure pages with semantic HTML', ar: 'بناء الصفحات بـ HTML دلالي' }, courses: ['c-web-basics'] },
          { id: 'fe-2', title: { en: 'Style responsive layouts with CSS Flexbox and Grid', ar: 'تنسيق تخطيطات متجاوبة بـ Flexbox و Grid' }, courses: ['c-web-basics'] },
          { id: 'fe-3', title: { en: 'Track your code with Git and publish on GitHub', ar: 'إدارة الكود بـ Git ونشره على GitHub' }, courses: ['c-git'] },
        ],
      },
      {
        title: { en: 'Programming with JavaScript', ar: 'البرمجة بجافاسكريبت' },
        weeks: 6,
        steps: [
          { id: 'fe-4', title: { en: 'Master variables, functions, arrays and objects', ar: 'إتقان المتغيرات والدوال والمصفوفات والكائنات' }, courses: ['c-js'] },
          { id: 'fe-5', title: { en: 'Work with the DOM and browser events', ar: 'التعامل مع DOM وأحداث المتصفح' }, courses: ['c-js'] },
          { id: 'fe-6', title: { en: 'Fetch data from APIs with async/await', ar: 'جلب البيانات من الواجهات البرمجية بـ async/await' }, courses: ['c-js'] },
        ],
      },
      {
        title: { en: 'Modern frameworks', ar: 'الأطر الحديثة' },
        weeks: 6,
        steps: [
          { id: 'fe-7', title: { en: 'Build component-based UIs with React', ar: 'بناء واجهات قائمة على المكوّنات بـ React' }, courses: ['c-react'] },
          { id: 'fe-8', title: { en: 'Manage state, routing and forms', ar: 'إدارة الحالة والتوجيه والنماذج' }, courses: ['c-react'] },
        ],
      },
      {
        title: { en: 'Job-ready portfolio', ar: 'معرض أعمال جاهز للتوظيف' },
        weeks: 4,
        steps: [
          { id: 'fe-9', title: { en: 'Ship three portfolio projects with live demos', ar: 'إطلاق ثلاثة مشاريع بعروض مباشرة' }, courses: ['c-portfolio'] },
          { id: 'fe-10', title: { en: 'Prepare for technical interviews', ar: 'الاستعداد للمقابلات التقنية' }, courses: ['c-interview'] },
        ],
      },
    ],
  },
  {
    id: 'data',
    icon: 'BarChart3',
    title: { en: 'Data Analyst', ar: 'محلل بيانات' },
    summary: {
      en: 'Turn raw numbers into clear insights that guide business decisions.',
      ar: 'تحوّل الأرقام الخام إلى رؤى واضحة توجّه قرارات العمل.',
    },
    image: img('photo-1551288049-bebda4e38f71'),
    salary: [14000, 26000],
    demand: 'high',
    traits: { analytical: 3, technical: 2, communication: 1, creative: 0, leadership: 1 },
    skills: ['excel', 'sql', 'python', 'statistics', 'data-viz'],
    roadmap: [
      {
        title: { en: 'Spreadsheet & statistics basics', ar: 'أساسيات الجداول والإحصاء' },
        weeks: 4,
        steps: [
          { id: 'da-1', title: { en: 'Clean and summarise data in Excel', ar: 'تنظيف البيانات وتلخيصها في Excel' }, courses: ['c-excel'] },
          { id: 'da-2', title: { en: 'Learn descriptive statistics and probability', ar: 'تعلّم الإحصاء الوصفي والاحتمالات' }, courses: ['c-stats'] },
        ],
      },
      {
        title: { en: 'Querying data', ar: 'الاستعلام عن البيانات' },
        weeks: 5,
        steps: [
          { id: 'da-3', title: { en: 'Write SQL queries with joins and aggregations', ar: 'كتابة استعلامات SQL بالربط والتجميع' }, courses: ['c-sql'] },
          { id: 'da-4', title: { en: 'Analyse a real public dataset end to end', ar: 'تحليل مجموعة بيانات عامة من البداية للنهاية' }, courses: ['c-sql'] },
        ],
      },
      {
        title: { en: 'Python for analysis', ar: 'بايثون للتحليل' },
        weeks: 6,
        steps: [
          { id: 'da-5', title: { en: 'Use pandas to transform and explore data', ar: 'استخدام pandas لتحويل البيانات واستكشافها' }, courses: ['c-python-data'] },
          { id: 'da-6', title: { en: 'Build dashboards that tell a story', ar: 'بناء لوحات معلومات تحكي قصة' }, courses: ['c-dataviz'] },
        ],
      },
      {
        title: { en: 'Job-ready portfolio', ar: 'معرض أعمال جاهز للتوظيف' },
        weeks: 3,
        steps: [
          { id: 'da-7', title: { en: 'Publish two case studies with your findings', ar: 'نشر دراستي حالة بنتائجك' }, courses: ['c-portfolio'] },
          { id: 'da-8', title: { en: 'Practise SQL and case interview questions', ar: 'التدرّب على أسئلة SQL ودراسات الحالة' }, courses: ['c-interview'] },
        ],
      },
    ],
  },
  {
    id: 'ux',
    icon: 'PenTool',
    title: { en: 'UX/UI Designer', ar: 'مصمم تجربة وواجهة المستخدم' },
    summary: {
      en: 'Research user needs and design intuitive, beautiful digital products.',
      ar: 'تدرس احتياجات المستخدمين وتصمم منتجات رقمية بديهية وجميلة.',
    },
    image: img('photo-1561070791-2526d30994b5'),
    salary: [12000, 24000],
    demand: 'medium',
    traits: { creative: 3, communication: 2, analytical: 1, technical: 1, leadership: 0 },
    skills: ['figma', 'user-research', 'prototyping', 'communication'],
    roadmap: [
      {
        title: { en: 'Design fundamentals', ar: 'أساسيات التصميم' },
        weeks: 4,
        steps: [
          { id: 'ux-1', title: { en: 'Learn layout, typography and colour theory', ar: 'تعلّم التخطيط والخطوط ونظرية الألوان' }, courses: ['c-ux-foundations'] },
          { id: 'ux-2', title: { en: 'Design your first screens in Figma', ar: 'صمّم أولى شاشاتك في Figma' }, courses: ['c-figma'] },
        ],
      },
      {
        title: { en: 'User-centred research', ar: 'البحث المتمحور حول المستخدم' },
        weeks: 4,
        steps: [
          { id: 'ux-3', title: { en: 'Run user interviews and build personas', ar: 'إجراء مقابلات المستخدمين وبناء الشخصيات' }, courses: ['c-ux-foundations'] },
          { id: 'ux-4', title: { en: 'Map user journeys and information architecture', ar: 'رسم رحلات المستخدم وهيكلة المعلومات' }, courses: ['c-ux-foundations'] },
        ],
      },
      {
        title: { en: 'Prototyping & testing', ar: 'النماذج الأولية والاختبار' },
        weeks: 5,
        steps: [
          { id: 'ux-5', title: { en: 'Build interactive prototypes with auto layout', ar: 'بناء نماذج تفاعلية بـ Auto Layout' }, courses: ['c-figma'] },
          { id: 'ux-6', title: { en: 'Run usability tests and iterate', ar: 'إجراء اختبارات قابلية الاستخدام والتحسين' }, courses: ['c-figma'] },
        ],
      },
      {
        title: { en: 'Job-ready portfolio', ar: 'معرض أعمال جاهز للتوظيف' },
        weeks: 4,
        steps: [
          { id: 'ux-7', title: { en: 'Write three detailed case studies', ar: 'كتابة ثلاث دراسات حالة مفصّلة' }, courses: ['c-portfolio'] },
          { id: 'ux-8', title: { en: 'Present your design process confidently', ar: 'عرض عملية التصميم الخاصة بك بثقة' }, courses: ['c-interview', 'c-communication'] },
        ],
      },
    ],
  },
  {
    id: 'marketing',
    icon: 'Megaphone',
    title: { en: 'Digital Marketing Specialist', ar: 'أخصائي تسويق رقمي' },
    summary: {
      en: 'Grow brands online through content, campaigns, search and analytics.',
      ar: 'تنمّي العلامات التجارية عبر المحتوى والحملات ومحركات البحث والتحليلات.',
    },
    image: img('photo-1432888498266-38ffec3eaf0a'),
    salary: [10000, 20000],
    demand: 'medium',
    traits: { communication: 3, creative: 2, analytical: 2, leadership: 1, technical: 0 },
    skills: ['seo', 'content', 'web-analytics', 'social-media'],
    roadmap: [
      {
        title: { en: 'Marketing foundations', ar: 'أساسيات التسويق' },
        weeks: 3,
        steps: [
          { id: 'mk-1', title: { en: 'Understand funnels, audiences and positioning', ar: 'فهم مسارات التحويل والجمهور والتموضع' }, courses: ['c-marketing'] },
          { id: 'mk-2', title: { en: 'Write persuasive copy for the web', ar: 'كتابة نصوص إقناعية للويب' }, courses: ['c-content'] },
        ],
      },
      {
        title: { en: 'Channels & campaigns', ar: 'القنوات والحملات' },
        weeks: 5,
        steps: [
          { id: 'mk-3', title: { en: 'Optimise pages for search engines', ar: 'تحسين الصفحات لمحركات البحث' }, courses: ['c-seo'] },
          { id: 'mk-4', title: { en: 'Plan a social media content calendar', ar: 'تخطيط تقويم محتوى لوسائل التواصل' }, courses: ['c-marketing'] },
        ],
      },
      {
        title: { en: 'Measure & optimise', ar: 'القياس والتحسين' },
        weeks: 4,
        steps: [
          { id: 'mk-5', title: { en: 'Track campaigns with web analytics', ar: 'تتبّع الحملات بتحليلات الويب' }, courses: ['c-seo'] },
          { id: 'mk-6', title: { en: 'Report results with simple dashboards', ar: 'عرض النتائج بلوحات معلومات بسيطة' }, courses: ['c-excel'] },
        ],
      },
      {
        title: { en: 'Job-ready portfolio', ar: 'معرض أعمال جاهز للتوظيف' },
        weeks: 3,
        steps: [
          { id: 'mk-7', title: { en: 'Run a small real campaign and document results', ar: 'تنفيذ حملة حقيقية صغيرة وتوثيق نتائجها' }, courses: ['c-portfolio'] },
          { id: 'mk-8', title: { en: 'Prepare for marketing interviews', ar: 'الاستعداد لمقابلات التسويق' }, courses: ['c-interview', 'c-communication'] },
        ],
      },
    ],
  },
  {
    id: 'security',
    icon: 'ShieldCheck',
    title: { en: 'Cybersecurity Analyst', ar: 'محلل أمن سيبراني' },
    summary: {
      en: 'Protect systems and data by detecting threats and hardening defences.',
      ar: 'تحمي الأنظمة والبيانات من خلال رصد التهديدات وتقوية الدفاعات.',
    },
    image: img('photo-1550751827-4bd374c3f58b'),
    salary: [16000, 30000],
    demand: 'high',
    traits: { technical: 3, analytical: 3, leadership: 0, communication: 0, creative: 0 },
    skills: ['networking', 'linux', 'security-fundamentals', 'python'],
    roadmap: [
      {
        title: { en: 'IT foundations', ar: 'أساسيات تقنية المعلومات' },
        weeks: 5,
        steps: [
          { id: 'sc-1', title: { en: 'Understand networks, TCP/IP and DNS', ar: 'فهم الشبكات و TCP/IP و DNS' }, courses: ['c-networking'] },
          { id: 'sc-2', title: { en: 'Get comfortable on the Linux command line', ar: 'الاحتراف في سطر أوامر لينكس' }, courses: ['c-linux'] },
        ],
      },
      {
        title: { en: 'Security core', ar: 'جوهر الأمن' },
        weeks: 6,
        steps: [
          { id: 'sc-3', title: { en: 'Learn common attacks and the CIA triad', ar: 'تعلّم الهجمات الشائعة ومثلث CIA' }, courses: ['c-security'] },
          { id: 'sc-4', title: { en: 'Analyse logs and detect incidents', ar: 'تحليل السجلات واكتشاف الحوادث' }, courses: ['c-security'] },
        ],
      },
      {
        title: { en: 'Automation', ar: 'الأتمتة' },
        weeks: 4,
        steps: [
          { id: 'sc-5', title: { en: 'Automate security tasks with Python', ar: 'أتمتة مهام الأمن ببايثون' }, courses: ['c-python-data'] },
        ],
      },
      {
        title: { en: 'Job-ready portfolio', ar: 'معرض أعمال جاهز للتوظيف' },
        weeks: 4,
        steps: [
          { id: 'sc-6', title: { en: 'Complete capture-the-flag labs and write-ups', ar: 'إكمال تحديات CTF وكتابة تقاريرها' }, courses: ['c-portfolio'] },
          { id: 'sc-7', title: { en: 'Prepare for SOC analyst interviews', ar: 'الاستعداد لمقابلات محلل مركز العمليات الأمنية' }, courses: ['c-interview'] },
        ],
      },
    ],
  },
  {
    id: 'product',
    icon: 'Rocket',
    title: { en: 'Product / Project Manager', ar: 'مدير منتج / مشروعات' },
    summary: {
      en: 'Lead teams to plan, prioritise and deliver products customers love.',
      ar: 'تقود الفرق لتخطيط المنتجات وترتيب أولوياتها وتسليمها بما يرضي العملاء.',
    },
    image: img('photo-1552664730-d307ca884978'),
    salary: [14000, 27000],
    demand: 'medium',
    traits: { leadership: 3, communication: 3, analytical: 2, creative: 1, technical: 0 },
    skills: ['agile', 'communication', 'product-strategy', 'excel'],
    roadmap: [
      {
        title: { en: 'Ways of working', ar: 'أساليب العمل' },
        weeks: 3,
        steps: [
          { id: 'pm-1', title: { en: 'Run projects with Agile and Scrum', ar: 'إدارة المشروعات بأجايل وسكرم' }, courses: ['c-agile'] },
          { id: 'pm-2', title: { en: 'Communicate clearly with stakeholders', ar: 'التواصل بوضوح مع أصحاب المصلحة' }, courses: ['c-communication'] },
        ],
      },
      {
        title: { en: 'Product thinking', ar: 'التفكير في المنتج' },
        weeks: 5,
        steps: [
          { id: 'pm-3', title: { en: 'Discover problems worth solving', ar: 'اكتشاف المشكلات التي تستحق الحل' }, courses: ['c-product'] },
          { id: 'pm-4', title: { en: 'Write user stories and prioritise a roadmap', ar: 'كتابة قصص المستخدم وترتيب أولويات الخطة' }, courses: ['c-product', 'c-agile'] },
        ],
      },
      {
        title: { en: 'Data-informed decisions', ar: 'قرارات مبنية على البيانات' },
        weeks: 4,
        steps: [
          { id: 'pm-5', title: { en: 'Define metrics and read dashboards', ar: 'تحديد المقاييس وقراءة لوحات المعلومات' }, courses: ['c-excel', 'c-dataviz'] },
        ],
      },
      {
        title: { en: 'Job-ready portfolio', ar: 'معرض أعمال جاهز للتوظيف' },
        weeks: 3,
        steps: [
          { id: 'pm-6', title: { en: 'Document a product case study', ar: 'توثيق دراسة حالة لمنتج' }, courses: ['c-portfolio'] },
          { id: 'pm-7', title: { en: 'Practise product sense interviews', ar: 'التدرّب على مقابلات حسّ المنتج' }, courses: ['c-interview'] },
        ],
      },
    ],
  },
]

export const careerById = Object.fromEntries(careers.map((c) => [c.id, c]))
