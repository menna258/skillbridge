import { img } from '../lib/images'

// Sample student stories (demo profiles, not real people).
export const studentStories = [
  {
    id: 's-1',
    name: { en: 'Salma Hassan', ar: 'سلمى حسن' },
    university: { en: 'Cairo University · Commerce', ar: 'جامعة القاهرة · تجارة' },
    career: 'data',
    photo: img('photo-1494790108377-be9c29b29330', 300),
    quote: {
      en: 'The assessment pointed me to data analytics. Twelve weeks of the roadmap later, I landed a BI internship.',
      ar: 'وجّهني التقييم إلى تحليل البيانات. وبعد ١٢ أسبوعًا من خطة التعلم حصلت على تدريب في ذكاء الأعمال.',
    },
    progress: 86,
  },
  {
    id: 's-2',
    name: { en: 'Youssef Ali', ar: 'يوسف علي' },
    university: { en: 'Ain Shams University · Engineering', ar: 'جامعة عين شمس · هندسة' },
    career: 'frontend',
    photo: img('photo-1507003211169-0a1dd7228f2d', 300),
    quote: {
      en: 'I finally stopped jumping between random tutorials. The roadmap told me exactly what to learn next.',
      ar: 'أخيرًا توقفت عن التنقل بين الدروس العشوائية. خطة التعلم أخبرتني بالضبط ماذا أتعلم بعد ذلك.',
    },
    progress: 72,
  },
  {
    id: 's-3',
    name: { en: 'Mariam Adel', ar: 'مريم عادل' },
    university: { en: 'Alexandria University · Fine Arts', ar: 'جامعة الإسكندرية · فنون جميلة' },
    career: 'ux',
    photo: img('photo-1438761681033-6461ffad8d80', 300),
    quote: {
      en: 'As an arts student I never thought tech was for me. Now I design screens for a real EdTech product.',
      ar: 'كطالبة فنون لم أتخيل أن التكنولوجيا لي. الآن أصمم شاشات لمنتج تعليمي حقيقي.',
    },
    progress: 94,
  },
  {
    id: 's-4',
    name: { en: 'Omar Fathy', ar: 'عمر فتحي' },
    university: { en: 'Helwan University · Computer Science', ar: 'جامعة حلوان · حاسبات ومعلومات' },
    career: 'security',
    photo: img('photo-1500648767791-00dcc994a43e', 300),
    quote: {
      en: 'Tracking my progress every week kept me motivated through networking and Linux, the hardest part for me.',
      ar: 'متابعة تقدمي أسبوعيًا حفّزتني خلال الشبكات ولينكس، وهما الجزء الأصعب بالنسبة لي.',
    },
    progress: 64,
  },
]
