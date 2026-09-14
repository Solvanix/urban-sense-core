# SENSE Ecosystem / Urban‑Sense Core

> **هذا هو المستودع المركزي الحاكم لمنظومة SENSE.** يجمع تطبيقات مستقلة في الكود والحوكمة، لا تطبيقًا واحدًا يخلط الهويات أو الصلاحيات أو قواعد البيانات.

## ما الذي يعمل عليه هذا المستودع الآن؟

أصبحت تجربة السياحة في هذا المستودع منتجًا فعليًا قابلًا للتطوير، لا مجرد فهرس أو صفحة عرض:

- **`apps/sense-experience/`** — منصة SENSE السياحية العربية للعيزرية: اكتشاف المسارات، بناء خطة يوم، طلب مراجعة محلي آمن، وممر شراكة لمزودي التجارب.
- **`apps/sense-go/`** — تطبيق الجوال Expo: اكتشاف RTL، حفظ الخطة محليًا، قصص المكان، ومسار المزود.
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

## الجودة

```bash
cd apps/sense-experience && pnpm check && pnpm test && pnpm build
cd ../sense-go && pnpm exec tsc --noEmit
```
