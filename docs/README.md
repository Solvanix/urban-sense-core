# خريطة وثائق منظومة SENSE

هذه الوثائق تشرح ما بُني، وما هو مقترح، وما يحتاج قرارًا أو تشغيلًا مستقلًا. لا تُستخدم أي وثيقة هنا لإثبات شراكة أو إنجاز أو خدمة ما لم يرد فيها دليل واضح على ذلك.

[العودة إلى فهرس رحلة المستخدم](../INDEX.md)

## ابدأ بحسب هدفك

| الهدف | الوثيقة المناسبة |
|---|---|
| فهم التطبيقات والمسارات وحالات الإطلاق | [خارطة التشغيل والمنتج](OPERATING-PRODUCT-BLUEPRINT.md) |
| فهم العلاقة بين التطبيقات المستقلة | [هندسة المحفظة](PORTFOLIO-ARCHITECTURE.md) |
| متابعة تسلسل العمل والقرارات التالية | [ابدأ من هنا](START-HERE.md) |
| فهم نطاق Urban‑Sense وبوابات إطلاقه | [بوصلة المنتج](URBAN-SENSE-PRODUCT-COMPASS.md) |
| تشغيل SENSE Experience بأمان | [بوابة جاهزية البيانات الحقيقية](sense-experience/REAL-DATA-READINESS.md) |
| مراجعة حوكمة SENSE المرحلية | [إطار الحوكمة](SENSE-PHASED-GOVERNANCE-FRAMEWORK-2026-08-20.md) |
| مراجعة اسم «عَنان | ANAN» المقترح | [حزمة الرسائل](ANAN-PROPOSED-BRAND-MESSAGING-2026-08-20.md) |
| مراجعة فحص اسم نطاق قصير | [مسودة فحص الدومين](DOMAIN-SHORT-NAME-RESEARCH-2026-08-20.md) |

## مجموعات الوثائق

### المنتج والتشغيل

- [`OPERATING-PRODUCT-BLUEPRINT.md`](OPERATING-PRODUCT-BLUEPRINT.md): التطبيقات، البيانات، المحاسبة، الأهداف، وقرارات الإطلاق.
- [`PORTFOLIO-ARCHITECTURE.md`](PORTFOLIO-ARCHITECTURE.md): الفصل بين Urban‑Sense وSENSE Experience والمسارات اللاحقة.
- [`URBAN-SENSE-PRODUCT-COMPASS.md`](URBAN-SENSE-PRODUCT-COMPASS.md): نطاق منصة البلاغات وحدودها وبوابات الجودة.
- [`github-first-roadmap.md`](github-first-roadmap.md): خارطة التنفيذ من المستودع المركزي.

### الأمان والهندسة

- [`architecture/MVP-ARCHITECTURE.md`](architecture/MVP-ARCHITECTURE.md)
- [`security/SECURITY-BASELINE.md`](security/SECURITY-BASELINE.md)
- [`shared/ACCESSIBILITY-BASELINE.md`](shared/ACCESSIBILITY-BASELINE.md)
- [`decision-records/`](decision-records/): قرارات المصدر، الاختبارات، وحدود التطبيقات.

### SENSE Experience

توجد وثائق الجاهزية وبيانات الخدمة والمراجعين ودعوة المزودين في [`sense-experience/`](sense-experience/). وهي تشرح بوضوح لماذا تبقى الخدمة مقفلة أمام البيانات الحقيقية إلى أن تتحقق بوابات التشغيل المستقل.

### الحوكمة والهوية

- [`SENSE-PHASED-GOVERNANCE-FRAMEWORK-2026-08-20.md`](SENSE-PHASED-GOVERNANCE-FRAMEWORK-2026-08-20.md)
- [`ANAN-PROPOSED-BRAND-MESSAGING-2026-08-20.md`](ANAN-PROPOSED-BRAND-MESSAGING-2026-08-20.md)
- [`BRAND-LOGO-DIRECTIONS-2026-08-20.md`](BRAND-LOGO-DIRECTIONS-2026-08-20.md)
- [`DOMAIN-REASSESSMENT-2026-08-20.md`](DOMAIN-REASSESSMENT-2026-08-20.md)
- [`DOMAIN-SHORT-NAME-RESEARCH-2026-08-20.md`](DOMAIN-SHORT-NAME-RESEARCH-2026-08-20.md): فحص أولي غير ملزم لأسماء قصيرة وحدود قرار النطاق والبريد.

اسم «عَنان | ANAN» ورسائله ومونوغرامات الهوية المقترحة مواد مراجعة فقط حتى يصدر قرار المالك ويُفحص النطاق والعلامة. لا تمثل هذه الملفات تسجيلًا أو اعتمادًا قانونيًا.

### البحث والسجل

يضم [`research/`](research/) تحليلات مقيدة بالمصادر عن التحديات، والتعلّم، والرؤية الحاسوبية، والمراجع العامة. أما سجل المصادر والأرشيف فيبدأ من [`LEGACY-SOURCE-REGISTER.md`](LEGACY-SOURCE-REGISTER.md) و[`ARCHIVE-INTAKE-2026-08-19.md`](ARCHIVE-INTAKE-2026-08-19.md).

## قواعد القراءة

1. فرّق دائمًا بين **منشور** و**نواة في الكود** و**مقترح**.
2. لا تعلن شريكًا أو نتائج أو مزودًا أو تقييمًا استنادًا إلى وثيقة تخطيط فقط.
3. ارجع إلى README الخاص بكل تطبيق قبل تشغيله أو إضافة بيانات إليه.
4. لا تنقل أسرار البيئة أو بيانات التشغيل إلى المستودع.
