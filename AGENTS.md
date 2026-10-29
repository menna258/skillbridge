# SkillBridge

منصة تطوير مهني لطلبة الجامعة، بالعربي والإنجليزي. الطالب بيشتري كورسات، وفيه أدمن واحدة بس هي صاحبة المشروع.

- **صاحبة المشروع مش مبرمجة**: كلّمها بالعامية المصرية، خطوة خطوة، وقولها تضغط فين بالظبط.
- **المصطلحات**: قبل ما تسمّي أي مفهوم في الكود أو التيكتات، ارجع لـ GLOSSARY.md. **القرارات الكبيرة**: في docs/adr.

## الداتا

- الكورسات في جدول skillbridge_courses على Supabase، وsrc/data/courses.js كان أول استيراد بس. الوظايف وباقي الداتا في src/data. أي داتا بتظهر على الموقع جاية من المكانين دول بس.
- فورم Contact بيحفظ في جدول skillbridge_contact_messages.
- الأدمن هو المستخدم اللي عنده app_metadata.skillbridge_admin = true، والعلامة دي بتتحط بأمر SQL بس.

## الشغل على GitHub Issues

- الـ Spec بتاع الحسابات وشرا الكورسات ولوحة الأدمن في #2، وخريطة الاشتراك الشهري في #21.
- اشتغل على التيكتات اللي عليها label اسمه ready-for-agent، وكل تيكتات الـ Blocked by بتاعتها مقفولة. أما ready-for-human فمستنية صاحبة المشروع.
- التيكت يتقفل لما الاختبار الآلي بتاعه يعدّي.
- الدفع (Paymob) متأجل لحد ما يبقى فيه حساب Paymob، فأسعار الكورسات تفضل صفر.

## Supabase

- ملفات supabase/*.sql بتتشغّل بالإيد من SQL Editor، ومفيش migrations. والـ MCP بتاع Supabase مالوش صلاحية على المشروع.
- الـ Edge Functions بتترفع بالأمر ده:
  `npx.cmd supabase functions deploy <name> --project-ref zwhyspllkkvtusucvkva --use-api`
  والـ paymob-webhook بالذات بيترفع ومعاه `--no-verify-jwt`، لأن Paymob بينادي عليه من غير توكن Supabase.

## الأوامر والاختبارات

- على الجهاز ده، PowerShell بيمنع npm.ps1 وnpx.ps1، فاستخدم npm.cmd وnpx.cmd.
- `npm.cmd test` بيشتغل على مشروع Supabase الحقيقي، لأن الخطة المجانية فيها مشروعين بس ومفيش Docker:
  - محتاج ملف .env.test فيه المفتاح السري، والملف ده مش بيترفع على git.
  - أي حاجة الاختبار بيعملها اسمها يبدأ بـ sbtest- وتتمسح في الآخر.

## النشر، وإمتى التعديل يبقى خلصان

- كل push على main بيتنشر لوحده على Cloudflare Pages (skillbridge-ar7.pages.dev). شيت الكورس طالب Render، بس Render بيطلب كارت، فالنشر يفضل على Cloudflare لحد ما المدرّب يوافق.
- التعديل يبقى خلصان لما `npm.cmd test` يعدّي، وبعد ما يتنشر: رسالة تبعتها من فورم Contact على لينك pages.dev تظهر في جدول skillbridge_contact_messages.
