# SENSE Ecosystem / Urban‑Sense Core

> **هذا هو المستودع المركزي الحاكم لمنظومة SENSE.** يجمع تطبيقات مستقلة في الكود والحوكمة، لا تطبيقًا واحدًا يخلط الهويات أو الصلاحيات أو قواعد البيانات.

## ما الذي يعمل عليه هذا المستودع الآن؟

أصبحت تجربة السياحة في هذا المستودع منتجًا فعليًا قابلًا للتطوير، لا مجرد فهرس أو صفحة عرض:

- **`apps/sense-experience/`** — منصة SENSE السياحية العربية للعيزرية: اكتشاف المسارات، بناء خطة يوم، طلب مراجعة محلي آمن، وممر شراكة لمزودي التجارب.
- **`apps/sense-go/`** — تطبيق الجوال Expo: اكتشاف RTL، حفظ الخطة محليًا، قصص المكان، ومسار المزود.
- **`جواز المشروع`** عبر `/جواز-المشروع` أو `/tourism-readiness` — ملف جاهزية سياحية يعيد استخدام منطق الاستبانات لإنتاج بطاقة عرض، ملخص مقابلة، مخطط قصة WordPress، وخريطة فجوات.
- **`مختبر الحملات`** عبر `/مختبر-الحملات` أو `/campaign-lab` — يحول فكرة التجربة إلى حملة سياحية عبر أدوار استراتيجي وناقد ومحاكاة جمهور، دون خلط محتوى المشاريع المرجعية الخارجية.
- **`apps/web/`** — Urban‑Sense للبلاغات المدنية، مستقل في البيانات والهوية والصلاحيات.
- **`tourism/`** — نسخة GitHub Pages القديمة/التجريبية، محفوظة كمرجع بصري لا كمصدر المنتج الجديد.

## تشغيل منصة السياحة على الويب

```bash
cd apps/sense-experience
pnpm install
pnpm dev
```

## تشغيل تطبيق الجوال

```bash
cd apps/sense-go
pnpm install
pnpm start
```

## حدود المنتج الحالية

المنصة تعرض تجارب ومسارات مقترحة مع حالة واضحة مثل **قيد التحقق المحلي** أو **بانتظار الاعتماد**. لا تدّعي وجود توافر حي أو دفع أو حجز نهائي قبل تفعيل التكاملات ومراجعة الشركاء. طلب المراجعة في الويب مسودة آمنة في النسخة التجريبية، وتخزين خطة الجوال محلي على الجهاز.

## قواعد الفصل

لا تقرأ منصة السياحة بلاغات Urban‑Sense أو مرفقاته أو مستخدميه، ولا العكس. لا يُنشر ملف مزود أو وسيلة اتصال عامة قبل موافقته ومراجعة بشرية مستقلة. تبقى التجارة والدفع والمتجر مسارات منفصلة حتى اعتمادها تشغيليًا.

## الوثائق

- [`docs/sense-experience/PRODUCT-BOUNDARIES.md`](docs/sense-experience/PRODUCT-BOUNDARIES.md)
- [`docs/sense-experience/ENGINEERING-HANDOFF.md`](docs/sense-experience/ENGINEERING-HANDOFF.md)
- [`apps/sense-experience/README.md`](apps/sense-experience/README.md)
- [`apps/sense-go/README.md`](apps/sense-go/README.md)
- [`docs/sense-experience/TOURISM-PROJECT-PROFILE-REFERENCE.md`](docs/sense-experience/TOURISM-PROJECT-PROFILE-REFERENCE.md)
- [`docs/sense-experience/مرجع-الاستبيان-السياحي-للهاتف.txt`](docs/sense-experience/%D9%85%D8%B1%D8%AC%D8%B9-%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%A8%D9%8A%D8%A7%D9%86-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D9%84%D9%84%D9%87%D8%A7%D8%AA%D9%81.txt)
- [`docs/sense-experience/تدقيق-الاستبيان-السياحي-وخطة-التوظيف.md`](docs/sense-experience/%D8%AA%D8%AF%D9%82%D9%8A%D9%82-%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%A8%D9%8A%D8%A7%D9%86-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D9%88%D8%AE%D8%B7%D8%A9-%D8%A7%D9%84%D8%AA%D9%88%D8%B8%D9%8A%D9%81.md)

## الجودة

```bash
cd apps/sense-experience && pnpm check && pnpm test && pnpm build
cd ../sense-go && pnpm exec tsc --noEmit
```
