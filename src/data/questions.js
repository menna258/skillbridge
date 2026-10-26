// Career assessment. Each option awards points to careers (c) and traits (t).
export const questions = [
  {
    id: 'q1',
    text: { en: 'Which university project would you enjoy the most?', ar: 'أي مشروع جامعي ستستمتع به أكثر؟' },
    options: [
      { label: { en: 'Building a website for a student club', ar: 'بناء موقع لنادٍ طلابي' }, c: { frontend: 3, ux: 1 }, t: { technical: 2, creative: 1 } },
      { label: { en: 'Analysing survey results to find patterns', ar: 'تحليل نتائج استبيان لاكتشاف الأنماط' }, c: { data: 3, product: 1 }, t: { analytical: 3 } },
      { label: { en: 'Designing the look and feel of a mobile app', ar: 'تصميم شكل وتجربة تطبيق جوال' }, c: { ux: 3, frontend: 1 }, t: { creative: 3 } },
      { label: { en: 'Promoting an event and growing its audience', ar: 'الترويج لفعالية وزيادة جمهورها' }, c: { marketing: 3, product: 1 }, t: { communication: 3 } },
    ],
  },
  {
    id: 'q2',
    text: { en: 'When a group project gets stuck, you usually…', ar: 'عندما يتعثر مشروع جماعي، فإنك عادةً…' },
    options: [
      { label: { en: 'Organise the team and assign clear tasks', ar: 'تنظّم الفريق وتوزّع مهامًا واضحة' }, c: { product: 3 }, t: { leadership: 3 } },
      { label: { en: 'Dig into the details to find the root cause', ar: 'تتعمق في التفاصيل لتجد السبب الجذري' }, c: { security: 2, data: 2 }, t: { analytical: 3 } },
      { label: { en: 'Suggest a fresh, creative approach', ar: 'تقترح طريقة جديدة ومبتكرة' }, c: { ux: 2, marketing: 2 }, t: { creative: 3 } },
      { label: { en: 'Build a quick prototype to test an idea', ar: 'تبني نموذجًا سريعًا لتجربة فكرة' }, c: { frontend: 3 }, t: { technical: 2, creative: 1 } },
    ],
  },
  {
    id: 'q3',
    text: { en: 'Which school subject did you find most engaging?', ar: 'أي مادة دراسية كانت الأكثر متعة لك؟' },
    options: [
      { label: { en: 'Mathematics and statistics', ar: 'الرياضيات والإحصاء' }, c: { data: 3, security: 1 }, t: { analytical: 3 } },
      { label: { en: 'Computer science', ar: 'علوم الحاسب' }, c: { frontend: 2, security: 2 }, t: { technical: 3 } },
      { label: { en: 'Art and design', ar: 'الفنون والتصميم' }, c: { ux: 3 }, t: { creative: 3 } },
      { label: { en: 'Languages and business', ar: 'اللغات وإدارة الأعمال' }, c: { marketing: 2, product: 2 }, t: { communication: 2, leadership: 1 } },
    ],
  },
  {
    id: 'q4',
    text: { en: 'What kind of problems excite you?', ar: 'ما نوع المشكلات التي تتحمس لحلها؟' },
    options: [
      { label: { en: 'Protecting people from online threats', ar: 'حماية الناس من التهديدات الإلكترونية' }, c: { security: 3 }, t: { analytical: 2, technical: 1 } },
      { label: { en: 'Making technology easier to use', ar: 'جعل التكنولوجيا أسهل في الاستخدام' }, c: { ux: 3, frontend: 1 }, t: { creative: 2, communication: 1 } },
      { label: { en: 'Deciding what a team should build next', ar: 'تحديد ما يجب أن يبنيه الفريق لاحقًا' }, c: { product: 3 }, t: { leadership: 2, analytical: 1 } },
      { label: { en: 'Getting a message in front of the right people', ar: 'إيصال رسالة إلى الجمهور المناسب' }, c: { marketing: 3 }, t: { communication: 3 } },
    ],
  },
  {
    id: 'q5',
    text: { en: 'How do you prefer to spend a free afternoon?', ar: 'كيف تفضّل قضاء وقت فراغك؟' },
    options: [
      { label: { en: 'Tinkering with code or a new app', ar: 'التجريب في البرمجة أو تطبيق جديد' }, c: { frontend: 2, security: 2 }, t: { technical: 3 } },
      { label: { en: 'Sketching, photography or editing videos', ar: 'الرسم أو التصوير أو مونتاج الفيديو' }, c: { ux: 2, marketing: 2 }, t: { creative: 3 } },
      { label: { en: 'Solving puzzles or strategy games', ar: 'حل الألغاز أو ألعاب الاستراتيجية' }, c: { data: 2, security: 1, product: 1 }, t: { analytical: 3 } },
      { label: { en: 'Meeting friends or volunteering', ar: 'لقاء الأصدقاء أو العمل التطوعي' }, c: { product: 2, marketing: 2 }, t: { communication: 2, leadership: 1 } },
    ],
  },
  {
    id: 'q6',
    text: { en: 'Which tool would you most like to master?', ar: 'أي أداة تود إتقانها أكثر؟' },
    options: [
      { label: { en: 'A code editor like VS Code', ar: 'محرر أكواد مثل VS Code' }, c: { frontend: 3 }, t: { technical: 3 } },
      { label: { en: 'Excel, SQL or Power BI', ar: 'Excel أو SQL أو Power BI' }, c: { data: 3 }, t: { analytical: 3 } },
      { label: { en: 'Figma or Adobe XD', ar: 'Figma أو Adobe XD' }, c: { ux: 3 }, t: { creative: 3 } },
      { label: { en: 'Jira, Notion or Trello', ar: 'Jira أو Notion أو Trello' }, c: { product: 3 }, t: { leadership: 2, communication: 1 } },
    ],
  },
  {
    id: 'q7',
    text: { en: 'In a team, others describe you as…', ar: 'في الفريق، يصفك الآخرون بأنك…' },
    options: [
      { label: { en: 'The organiser who keeps everyone on track', ar: 'المنظّم الذي يحافظ على سير العمل' }, c: { product: 3 }, t: { leadership: 3 } },
      { label: { en: 'The persuasive voice who pitches ideas', ar: 'الصوت المقنع الذي يعرض الأفكار' }, c: { marketing: 3 }, t: { communication: 3 } },
      { label: { en: 'The careful one who spots risks', ar: 'الحريص الذي يكتشف المخاطر' }, c: { security: 3, data: 1 }, t: { analytical: 3 } },
      { label: { en: 'The builder who makes things work', ar: 'البنّاء الذي يجعل الأشياء تعمل' }, c: { frontend: 3 }, t: { technical: 3 } },
    ],
  },
  {
    id: 'q8',
    text: { en: 'What matters most to you in your first job?', ar: 'ما الأهم بالنسبة لك في وظيفتك الأولى؟' },
    options: [
      { label: { en: 'Seeing the visible impact of my work', ar: 'رؤية الأثر الواضح لعملي' }, c: { frontend: 2, ux: 2 }, t: { creative: 2, technical: 1 } },
      { label: { en: 'High demand and job security', ar: 'الطلب المرتفع والأمان الوظيفي' }, c: { security: 2, data: 2 }, t: { analytical: 2, technical: 1 } },
      { label: { en: 'Working with many different people', ar: 'العمل مع أشخاص كثيرين ومختلفين' }, c: { marketing: 2, product: 2 }, t: { communication: 3 } },
      { label: { en: 'A clear path to leadership', ar: 'مسار واضح نحو القيادة' }, c: { product: 3 }, t: { leadership: 3 } },
    ],
  },
  {
    id: 'q9',
    text: { en: 'How do you approach learning something new?', ar: 'كيف تتعامل مع تعلّم شيء جديد؟' },
    options: [
      { label: { en: 'Hands-on: I build something right away', ar: 'عمليًا: أبني شيئًا فورًا' }, c: { frontend: 2, security: 1 }, t: { technical: 3 } },
      { label: { en: 'Research first, then experiment carefully', ar: 'أبحث أولًا ثم أجرّب بعناية' }, c: { data: 2, security: 2 }, t: { analytical: 3 } },
      { label: { en: 'Visually, with examples and inspiration', ar: 'بصريًا، بالأمثلة والإلهام' }, c: { ux: 3 }, t: { creative: 3 } },
      { label: { en: 'By discussing it with others', ar: 'بالمناقشة مع الآخرين' }, c: { marketing: 2, product: 2 }, t: { communication: 3 } },
    ],
  },
  {
    id: 'q10',
    text: { en: 'Which result would make you proudest?', ar: 'أي إنجاز سيجعلك أكثر فخرًا؟' },
    options: [
      { label: { en: 'A campaign that reached 100,000 people', ar: 'حملة وصلت إلى ١٠٠ ألف شخص' }, c: { marketing: 3 }, t: { communication: 2, creative: 1 } },
      { label: { en: 'An insight that saved a company money', ar: 'رؤية وفّرت المال لشركة' }, c: { data: 3 }, t: { analytical: 3 } },
      { label: { en: 'Stopping a cyber attack before damage', ar: 'إيقاف هجوم إلكتروني قبل حدوث ضرر' }, c: { security: 3 }, t: { technical: 2, analytical: 1 } },
      { label: { en: 'Launching a product on time with my team', ar: 'إطلاق منتج في موعده مع فريقي' }, c: { product: 3 }, t: { leadership: 3 } },
    ],
  },
  {
    id: 'q11',
    text: { en: 'Which work environment suits you best?', ar: 'أي بيئة عمل تناسبك أكثر؟' },
    options: [
      { label: { en: 'Quiet focus time on deep problems', ar: 'وقت تركيز هادئ على مشكلات عميقة' }, c: { security: 2, data: 2 }, t: { analytical: 2, technical: 1 } },
      { label: { en: 'A creative studio full of ideas', ar: 'استوديو إبداعي مليء بالأفكار' }, c: { ux: 2, marketing: 2 }, t: { creative: 3 } },
      { label: { en: 'A fast-moving tech startup', ar: 'شركة ناشئة تقنية سريعة الإيقاع' }, c: { frontend: 2, product: 2 }, t: { technical: 1, leadership: 2 } },
      { label: { en: 'Client-facing, with lots of meetings', ar: 'تعامل مباشر مع العملاء واجتماعات كثيرة' }, c: { marketing: 2, product: 2 }, t: { communication: 3 } },
    ],
  },
  {
    id: 'q12',
    text: { en: 'How comfortable are you with technical tools today?', ar: 'ما مدى ارتياحك للأدوات التقنية حاليًا؟' },
    options: [
      { label: { en: 'Very — I already write some code', ar: 'كثيرًا — أكتب بعض الأكواد بالفعل' }, c: { frontend: 2, security: 2 }, t: { technical: 3 } },
      { label: { en: 'Comfortable with spreadsheets and numbers', ar: 'مرتاح مع الجداول والأرقام' }, c: { data: 3, product: 1 }, t: { analytical: 2 } },
      { label: { en: 'I prefer visual and design tools', ar: 'أفضّل الأدوات البصرية وأدوات التصميم' }, c: { ux: 3 }, t: { creative: 2 } },
      { label: { en: 'I prefer people over tools', ar: 'أفضّل التعامل مع الناس على الأدوات' }, c: { marketing: 2, product: 2 }, t: { communication: 2, leadership: 1 } },
    ],
  },
]
