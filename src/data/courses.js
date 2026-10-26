import { img } from '../lib/images'

// Demo course catalogue. Instructors and figures are illustrative sample data.
const course = (o) => ({ ...o, image: img(o.image, 700) })

export const courses = [
  course({
    id: 'c-web-basics', category: 'frontend', level: 'beginner', hours: 12, rating: 4.8, learners: 18420,
    image: 'photo-1517694712202-14dd9538aa97', instructor: 'Omar Khaled', skills: ['html-css'],
    title: { en: 'Responsive Web Design Essentials', ar: 'أساسيات تصميم المواقع المتجاوبة' },
    description: {
      en: 'Build real, mobile-friendly pages from scratch with semantic HTML, modern CSS, Flexbox and Grid.',
      ar: 'ابنِ صفحات حقيقية متوافقة مع الجوال من الصفر باستخدام HTML الدلالي و CSS الحديث و Flexbox و Grid.',
    },
    lessons: [
      { en: 'How the web works', ar: 'كيف يعمل الويب' },
      { en: 'Semantic HTML structure', ar: 'هيكلة HTML الدلالية' },
      { en: 'CSS selectors and the box model', ar: 'محددات CSS ونموذج الصندوق' },
      { en: 'Flexbox and Grid layouts', ar: 'تخطيطات Flexbox و Grid' },
      { en: 'Project: responsive landing page', ar: 'مشروع: صفحة هبوط متجاوبة' },
    ],
  }),
  course({
    id: 'c-git', category: 'frontend', level: 'beginner', hours: 4, rating: 4.7, learners: 9310,
    image: 'photo-1556075798-4825dfaaf498', instructor: 'Nour El-Din Samir', skills: ['git'],
    title: { en: 'Git & GitHub for Students', ar: 'Git و GitHub للطلاب' },
    description: {
      en: 'Version control without fear: commits, branches, pull requests and a polished GitHub profile.',
      ar: 'التحكم في الإصدارات بلا خوف: الـ commits والفروع وطلبات الدمج وملف GitHub احترافي.',
    },
    lessons: [
      { en: 'Why version control matters', ar: 'لماذا يهم التحكم في الإصدارات' },
      { en: 'Commits and history', ar: 'الـ commits والسجل' },
      { en: 'Branching and merging', ar: 'التفريع والدمج' },
      { en: 'Pull requests and code review', ar: 'طلبات الدمج ومراجعة الكود' },
      { en: 'Building your GitHub profile', ar: 'بناء ملفك على GitHub' },
    ],
  }),
  course({
    id: 'c-js', category: 'frontend', level: 'beginner', hours: 20, rating: 4.9, learners: 24105,
    image: 'photo-1579468118864-1b9ea3c0db4a', instructor: 'Mariam Fathy', skills: ['javascript'],
    title: { en: 'Modern JavaScript from Zero', ar: 'جافاسكريبت الحديثة من الصفر' },
    description: {
      en: 'Learn the language of the web step by step, from variables to async code and real APIs.',
      ar: 'تعلّم لغة الويب خطوة بخطوة، من المتغيرات حتى الكود غير المتزامن والواجهات البرمجية الحقيقية.',
    },
    lessons: [
      { en: 'Values, variables and types', ar: 'القيم والمتغيرات والأنواع' },
      { en: 'Functions and scope', ar: 'الدوال والنطاق' },
      { en: 'Arrays, objects and loops', ar: 'المصفوفات والكائنات والحلقات' },
      { en: 'DOM and events', ar: 'DOM والأحداث' },
      { en: 'Async/await and fetch', ar: 'async/await و fetch' },
    ],
  }),
  course({
    id: 'c-react', category: 'frontend', level: 'intermediate', hours: 18, rating: 4.8, learners: 15230,
    image: 'photo-1633356122544-f134324a6cee', instructor: 'Youssef Adel', skills: ['react', 'javascript'],
    title: { en: 'React: Build Real Apps', ar: 'React: ابنِ تطبيقات حقيقية' },
    description: {
      en: 'Components, hooks, routing and forms — everything you need to ship a production-ready React app.',
      ar: 'المكوّنات والخطافات والتوجيه والنماذج — كل ما تحتاجه لإطلاق تطبيق React جاهز للإنتاج.',
    },
    lessons: [
      { en: 'Thinking in components', ar: 'التفكير بالمكوّنات' },
      { en: 'State and hooks', ar: 'الحالة والخطافات' },
      { en: 'Routing with React Router', ar: 'التوجيه بـ React Router' },
      { en: 'Forms and validation', ar: 'النماذج والتحقق' },
      { en: 'Deploying your app', ar: 'نشر تطبيقك' },
    ],
  }),
  course({
    id: 'c-excel', category: 'data', level: 'beginner', hours: 8, rating: 4.6, learners: 21780,
    image: 'photo-1460925895917-afdab827c52f', instructor: 'Hana Mostafa', skills: ['excel'],
    title: { en: 'Excel for Data Analysis', ar: 'Excel لتحليل البيانات' },
    description: {
      en: 'Clean, analyse and present data with formulas, pivot tables and charts used in real companies.',
      ar: 'نظّف البيانات وحللها واعرضها باستخدام الصيغ والجداول المحورية والرسوم المستخدمة في الشركات.',
    },
    lessons: [
      { en: 'Cleaning messy data', ar: 'تنظيف البيانات غير المرتبة' },
      { en: 'Essential formulas and lookups', ar: 'الصيغ الأساسية ودوال البحث' },
      { en: 'Pivot tables', ar: 'الجداول المحورية' },
      { en: 'Charts that communicate', ar: 'رسوم بيانية معبّرة' },
      { en: 'Project: sales report', ar: 'مشروع: تقرير مبيعات' },
    ],
  }),
  course({
    id: 'c-stats', category: 'data', level: 'beginner', hours: 10, rating: 4.5, learners: 8640,
    image: 'photo-1543286386-713bdd548da4', instructor: 'Dr. Tarek Hassan', skills: ['statistics'],
    title: { en: 'Practical Statistics', ar: 'الإحصاء التطبيقي' },
    description: {
      en: 'The statistics every analyst uses daily, explained with intuitive examples instead of heavy maths.',
      ar: 'الإحصاء الذي يستخدمه كل محلل يوميًا، مشروح بأمثلة بديهية بدلًا من الرياضيات المعقدة.',
    },
    lessons: [
      { en: 'Describing data', ar: 'وصف البيانات' },
      { en: 'Distributions', ar: 'التوزيعات' },
      { en: 'Probability basics', ar: 'أساسيات الاحتمالات' },
      { en: 'Sampling and confidence', ar: 'العينات ومستوى الثقة' },
      { en: 'A/B testing', ar: 'اختبارات A/B' },
    ],
  }),
  course({
    id: 'c-sql', category: 'data', level: 'beginner', hours: 10, rating: 4.8, learners: 19870,
    image: 'photo-1544383835-bda2bc66a55d', instructor: 'Ahmed Ragab', skills: ['sql'],
    title: { en: 'SQL for Data Analysts', ar: 'SQL لمحللي البيانات' },
    description: {
      en: 'Query relational databases confidently, from SELECT basics to joins, grouping and window functions.',
      ar: 'استعلم من قواعد البيانات العلائقية بثقة، من أساسيات SELECT إلى الربط والتجميع ودوال النوافذ.',
    },
    lessons: [
      { en: 'SELECT and filtering', ar: 'SELECT والتصفية' },
      { en: 'Sorting and aggregations', ar: 'الترتيب والتجميع' },
      { en: 'Joining tables', ar: 'ربط الجداول' },
      { en: 'Subqueries and CTEs', ar: 'الاستعلامات الفرعية و CTE' },
      { en: 'Window functions', ar: 'دوال النوافذ' },
    ],
  }),
  course({
    id: 'c-python-data', category: 'data', level: 'intermediate', hours: 16, rating: 4.7, learners: 13450,
    image: 'photo-1526379095098-d400fd0bf935', instructor: 'Salma Ibrahim', skills: ['python'],
    title: { en: 'Python & pandas for Analysis', ar: 'بايثون و pandas للتحليل' },
    description: {
      en: 'Automate analysis with Python: load, reshape and explore datasets using pandas and notebooks.',
      ar: 'أتمت التحليل ببايثون: حمّل البيانات وأعد تشكيلها واستكشفها باستخدام pandas والدفاتر.',
    },
    lessons: [
      { en: 'Python syntax refresher', ar: 'مراجعة سريعة لبايثون' },
      { en: 'DataFrames and Series', ar: 'DataFrames و Series' },
      { en: 'Grouping and merging', ar: 'التجميع والدمج' },
      { en: 'Working with dates', ar: 'التعامل مع التواريخ' },
      { en: 'Project: exploratory analysis', ar: 'مشروع: تحليل استكشافي' },
    ],
  }),
  course({
    id: 'c-dataviz', category: 'data', level: 'intermediate', hours: 9, rating: 4.6, learners: 7920,
    image: 'photo-1551288049-bebda4e38f71', instructor: 'Laila Abdelrahman', skills: ['data-viz'],
    title: { en: 'Dashboards & Data Storytelling', ar: 'لوحات المعلومات ورواية البيانات' },
    description: {
      en: 'Design dashboards in Power BI-style tools that highlight what matters and drive decisions.',
      ar: 'صمّم لوحات معلومات بأدوات مثل Power BI تُبرز المهم وتدعم اتخاذ القرار.',
    },
    lessons: [
      { en: 'Choosing the right chart', ar: 'اختيار الرسم المناسب' },
      { en: 'Dashboard layout principles', ar: 'مبادئ تخطيط اللوحات' },
      { en: 'Interactive filters', ar: 'المرشحات التفاعلية' },
      { en: 'Storytelling with data', ar: 'رواية القصص بالبيانات' },
      { en: 'Presenting to stakeholders', ar: 'العرض أمام أصحاب المصلحة' },
    ],
  }),
  course({
    id: 'c-ux-foundations', category: 'ux', level: 'beginner', hours: 12, rating: 4.8, learners: 14300,
    image: 'photo-1586717791821-3f44a563fa4c', instructor: 'Dina Sherif', skills: ['user-research'],
    title: { en: 'UX Design Foundations', ar: 'أساسيات تصميم تجربة المستخدم' },
    description: {
      en: 'Learn the full UX process: research, personas, journeys, information architecture and wireframes.',
      ar: 'تعلّم رحلة UX كاملة: البحث والشخصيات ورحلات المستخدم وهيكلة المعلومات والإطارات السلكية.',
    },
    lessons: [
      { en: 'What UX designers do', ar: 'ماذا يفعل مصمم UX' },
      { en: 'User interviews', ar: 'مقابلات المستخدمين' },
      { en: 'Personas and journey maps', ar: 'الشخصيات وخرائط الرحلة' },
      { en: 'Information architecture', ar: 'هيكلة المعلومات' },
      { en: 'Wireframing', ar: 'الإطارات السلكية' },
    ],
  }),
  course({
    id: 'c-figma', category: 'ux', level: 'intermediate', hours: 10, rating: 4.9, learners: 12650,
    image: 'photo-1609921212029-bb5a28e60960', instructor: 'Karim Wael', skills: ['figma', 'prototyping'],
    title: { en: 'Figma: UI Design & Prototyping', ar: 'Figma: تصميم الواجهات والنماذج الأولية' },
    description: {
      en: 'Design polished interfaces with components and auto layout, then test them as clickable prototypes.',
      ar: 'صمّم واجهات احترافية بالمكوّنات و Auto Layout ثم اختبرها كنماذج أولية قابلة للنقر.',
    },
    lessons: [
      { en: 'Frames, grids and styles', ar: 'الإطارات والشبكات والأنماط' },
      { en: 'Components and variants', ar: 'المكوّنات والمتغيرات' },
      { en: 'Auto layout', ar: 'Auto Layout' },
      { en: 'Interactive prototypes', ar: 'النماذج التفاعلية' },
      { en: 'Usability testing', ar: 'اختبار قابلية الاستخدام' },
    ],
  }),
  course({
    id: 'c-marketing', category: 'marketing', level: 'beginner', hours: 9, rating: 4.6, learners: 16540,
    image: 'photo-1557838923-2985c318be48', instructor: 'Rana Magdy', skills: ['social-media'],
    title: { en: 'Digital Marketing Fundamentals', ar: 'أساسيات التسويق الرقمي' },
    description: {
      en: 'Audiences, funnels, social media and paid campaigns — the building blocks of online growth.',
      ar: 'الجمهور ومسارات التحويل ووسائل التواصل والحملات المدفوعة — أساسيات النمو على الإنترنت.',
    },
    lessons: [
      { en: 'The marketing funnel', ar: 'مسار التسويق' },
      { en: 'Knowing your audience', ar: 'معرفة جمهورك' },
      { en: 'Social media strategy', ar: 'استراتيجية وسائل التواصل' },
      { en: 'Paid ads basics', ar: 'أساسيات الإعلانات المدفوعة' },
      { en: 'Content calendar', ar: 'تقويم المحتوى' },
    ],
  }),
  course({
    id: 'c-content', category: 'marketing', level: 'beginner', hours: 6, rating: 4.5, learners: 6870,
    image: 'photo-1455390582262-044cdead277a', instructor: 'Mohamed Lotfy', skills: ['content'],
    title: { en: 'Copywriting That Converts', ar: 'كتابة إعلانية تحقق النتائج' },
    description: {
      en: 'Write headlines, emails and landing pages in English and Arabic that make people act.',
      ar: 'اكتب عناوين ورسائل بريد وصفحات هبوط بالعربية والإنجليزية تدفع الناس للتفاعل.',
    },
    lessons: [
      { en: 'Understanding the reader', ar: 'فهم القارئ' },
      { en: 'Headlines and hooks', ar: 'العناوين وجذب الانتباه' },
      { en: 'Writing for landing pages', ar: 'الكتابة لصفحات الهبوط' },
      { en: 'Email campaigns', ar: 'حملات البريد الإلكتروني' },
      { en: 'Editing and testing copy', ar: 'تحرير النصوص واختبارها' },
    ],
  }),
  course({
    id: 'c-seo', category: 'marketing', level: 'intermediate', hours: 8, rating: 4.7, learners: 9980,
    image: 'photo-1562577309-4932fdd64cd1', instructor: 'Aya Hamdy', skills: ['seo', 'web-analytics'],
    title: { en: 'SEO & Web Analytics', ar: 'تحسين محركات البحث وتحليلات الويب' },
    description: {
      en: 'Rank higher on search engines and measure what works with analytics dashboards and UTM tracking.',
      ar: 'حقق ترتيبًا أعلى في محركات البحث وقِس ما ينجح بلوحات التحليلات وتتبع UTM.',
    },
    lessons: [
      { en: 'How search engines rank pages', ar: 'كيف ترتّب محركات البحث الصفحات' },
      { en: 'Keyword research', ar: 'البحث عن الكلمات المفتاحية' },
      { en: 'On-page SEO', ar: 'تحسين الصفحة داخليًا' },
      { en: 'Analytics setup and UTM', ar: 'إعداد التحليلات و UTM' },
      { en: 'Reporting performance', ar: 'تقارير الأداء' },
    ],
  }),
  course({
    id: 'c-networking', category: 'security', level: 'beginner', hours: 12, rating: 4.6, learners: 8120,
    image: 'photo-1558494949-ef010cbdcc31', instructor: 'Eng. Hossam Nabil', skills: ['networking'],
    title: { en: 'Computer Networking Basics', ar: 'أساسيات شبكات الحاسب' },
    description: {
      en: 'Understand how data travels: OSI model, IP addressing, DNS, HTTP and common network tools.',
      ar: 'افهم كيف تنتقل البيانات: نموذج OSI وعناوين IP و DNS و HTTP وأدوات الشبكات الشائعة.',
    },
    lessons: [
      { en: 'The OSI and TCP/IP models', ar: 'نموذجا OSI و TCP/IP' },
      { en: 'IP addressing and subnets', ar: 'عناوين IP والشبكات الفرعية' },
      { en: 'DNS and HTTP', ar: 'DNS و HTTP' },
      { en: 'Routers, switches and firewalls', ar: 'الموجهات والمحولات والجدران النارية' },
      { en: 'Troubleshooting tools', ar: 'أدوات استكشاف الأخطاء' },
    ],
  }),
  course({
    id: 'c-linux', category: 'security', level: 'beginner', hours: 8, rating: 4.7, learners: 7340,
    image: 'photo-1629654297299-c8506221ca97', instructor: 'Mahmoud Saad', skills: ['linux'],
    title: { en: 'Linux Command Line', ar: 'سطر أوامر لينكس' },
    description: {
      en: 'Navigate, manage files, users and permissions, and write simple shell scripts with confidence.',
      ar: 'تنقّل وأدر الملفات والمستخدمين والصلاحيات واكتب سكربتات بسيطة بثقة.',
    },
    lessons: [
      { en: 'Navigating the file system', ar: 'التنقل في نظام الملفات' },
      { en: 'Files and permissions', ar: 'الملفات والصلاحيات' },
      { en: 'Processes and services', ar: 'العمليات والخدمات' },
      { en: 'Pipes and text tools', ar: 'الأنابيب وأدوات النصوص' },
      { en: 'Shell scripting', ar: 'كتابة السكربتات' },
    ],
  }),
  course({
    id: 'c-security', category: 'security', level: 'intermediate', hours: 15, rating: 4.8, learners: 10210,
    image: 'photo-1563986768609-322da13575f3', instructor: 'Dr. Rania Fouad', skills: ['security-fundamentals'],
    title: { en: 'Cybersecurity Essentials', ar: 'أساسيات الأمن السيبراني' },
    description: {
      en: 'Threats, vulnerabilities, defences and incident response, with hands-on log analysis labs.',
      ar: 'التهديدات والثغرات والدفاعات والاستجابة للحوادث، مع معامل عملية لتحليل السجلات.',
    },
    lessons: [
      { en: 'The CIA triad', ar: 'مثلث CIA' },
      { en: 'Common attacks', ar: 'الهجمات الشائعة' },
      { en: 'Defence in depth', ar: 'الدفاع متعدد الطبقات' },
      { en: 'Log analysis and SIEM', ar: 'تحليل السجلات و SIEM' },
      { en: 'Incident response', ar: 'الاستجابة للحوادث' },
    ],
  }),
  course({
    id: 'c-agile', category: 'product', level: 'beginner', hours: 6, rating: 4.6, learners: 11240,
    image: 'photo-1531403009284-440f080d1e12', instructor: 'Mostafa Gamal', skills: ['agile'],
    title: { en: 'Agile & Scrum in Practice', ar: 'أجايل وسكرم عمليًا' },
    description: {
      en: 'Plan sprints, run stand-ups and retrospectives, and manage a backlog the way modern teams do.',
      ar: 'خطّط للدورات السريعة وأدر الاجتماعات اليومية والمراجعات وقائمة المهام كما تفعل الفرق الحديثة.',
    },
    lessons: [
      { en: 'Agile values', ar: 'قيم أجايل' },
      { en: 'Scrum roles and events', ar: 'أدوار وأحداث سكرم' },
      { en: 'Backlogs and user stories', ar: 'قوائم المهام وقصص المستخدم' },
      { en: 'Estimation and planning', ar: 'التقدير والتخطيط' },
      { en: 'Kanban boards', ar: 'لوحات كانبان' },
    ],
  }),
  course({
    id: 'c-product', category: 'product', level: 'intermediate', hours: 10, rating: 4.7, learners: 6590,
    image: 'photo-1531482615713-2afd69097998', instructor: 'Nada Hesham', skills: ['product-strategy'],
    title: { en: 'Product Management Fundamentals', ar: 'أساسيات إدارة المنتجات' },
    description: {
      en: 'Discover customer problems, define success metrics and build a roadmap your team believes in.',
      ar: 'اكتشف مشكلات العملاء وحدد مقاييس النجاح وابنِ خطة طريق يؤمن بها فريقك.',
    },
    lessons: [
      { en: 'The product manager role', ar: 'دور مدير المنتج' },
      { en: 'Customer discovery', ar: 'اكتشاف العملاء' },
      { en: 'Prioritisation frameworks', ar: 'أطر ترتيب الأولويات' },
      { en: 'Metrics that matter', ar: 'المقاييس المهمة' },
      { en: 'Building the roadmap', ar: 'بناء خطة الطريق' },
    ],
  }),
  course({
    id: 'c-communication', category: 'career', level: 'beginner', hours: 5, rating: 4.7, learners: 20310,
    image: 'photo-1475721027785-f74eccf877e2', instructor: 'Yasmin Kamal', skills: ['communication'],
    title: { en: 'Professional Communication Skills', ar: 'مهارات التواصل المهني' },
    description: {
      en: 'Present ideas clearly, write professional emails and collaborate effectively in teams.',
      ar: 'اعرض أفكارك بوضوح واكتب رسائل بريد احترافية وتعاون بفعالية داخل الفريق.',
    },
    lessons: [
      { en: 'Clear and concise writing', ar: 'الكتابة الواضحة والموجزة' },
      { en: 'Professional email etiquette', ar: 'آداب البريد المهني' },
      { en: 'Presenting with confidence', ar: 'العرض بثقة' },
      { en: 'Giving and receiving feedback', ar: 'تقديم الملاحظات وتلقيها' },
      { en: 'Teamwork across cultures', ar: 'العمل الجماعي بين الثقافات' },
    ],
  }),
  course({
    id: 'c-portfolio', category: 'career', level: 'intermediate', hours: 6, rating: 4.8, learners: 12780,
    image: 'photo-1499750310107-5fef28a66643', instructor: 'Ali Mansour', skills: ['communication'],
    title: { en: 'Build a Standout Portfolio', ar: 'ابنِ معرض أعمال مميز' },
    description: {
      en: 'Choose the right projects, write compelling case studies and publish a portfolio recruiters remember.',
      ar: 'اختر المشاريع المناسبة واكتب دراسات حالة مقنعة وانشر معرض أعمال يتذكره مسؤولو التوظيف.',
    },
    lessons: [
      { en: 'Picking portfolio projects', ar: 'اختيار مشاريع المعرض' },
      { en: 'Writing case studies', ar: 'كتابة دراسات الحالة' },
      { en: 'Publishing online', ar: 'النشر على الإنترنت' },
      { en: 'Optimising your LinkedIn', ar: 'تحسين ملفك على LinkedIn' },
      { en: 'Getting feedback', ar: 'الحصول على الملاحظات' },
    ],
  }),
  course({
    id: 'c-interview', category: 'career', level: 'beginner', hours: 5, rating: 4.9, learners: 22640,
    image: 'photo-1565688534245-05d6b5be184a', instructor: 'Heba Zaki', skills: ['communication'],
    title: { en: 'Ace Your Job Interview', ar: 'تفوّق في مقابلة العمل' },
    description: {
      en: 'Prepare a strong CV, answer behavioural questions with the STAR method and negotiate your first offer.',
      ar: 'جهّز سيرة ذاتية قوية وأجب عن الأسئلة السلوكية بطريقة STAR وتفاوض على أول عرض عمل.',
    },
    lessons: [
      { en: 'Writing an ATS-friendly CV', ar: 'كتابة سيرة ذاتية متوافقة مع أنظمة التتبع' },
      { en: 'The STAR method', ar: 'طريقة STAR' },
      { en: 'Technical and case questions', ar: 'الأسئلة التقنية ودراسات الحالة' },
      { en: 'Mock interview practice', ar: 'مقابلة تجريبية' },
      { en: 'Negotiating your offer', ar: 'التفاوض على العرض' },
    ],
  }),
]

export const courseById = Object.fromEntries(courses.map((c) => [c.id, c]))

export const courseCategories = ['frontend', 'data', 'ux', 'marketing', 'security', 'product', 'career']
export const courseLevels = ['beginner', 'intermediate', 'advanced']

// Minutes per lesson, derived from the course length.
export const lessonMinutes = (c) => Math.round((c.hours * 60) / c.lessons.length)
