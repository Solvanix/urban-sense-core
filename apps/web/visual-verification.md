# Visual verification — 2026-08-14

The Arabic public landing page was verified at desktop and mobile widths. The layout preserves RTL hierarchy, legible contrast, responsive call-to-action controls, and a documented report-lifecycle illustration. The citizen report list was also verified in its empty state.

The municipal operations page was verified at desktop width after moving the template navigation into RTL context and translating its visible labels. The authenticated administrator setup card, municipality selector, workflow metrics, and operations queue render without layout overflow. Functional staff access remains server-enforced; the page explains when a signed-in user lacks an operational municipality role.

The new-report form was verified in the authenticated state with Arabic fields and RTL spacing. Report-detail and operations-detail routes were verified to display clear Arabic error states when a report identifier does not exist rather than remaining in a loading state. The full lifecycle and evidence-upload path are covered by router integration tests without creating user-facing demonstration data in the production database.

The new-report page was also verified at a 375-pixel mobile width. The RTL labels, selectors, text areas, action button, and guidance panel remain legible without horizontal overflow.

## التحقق الواقعي لمسار بلدية الاختبار

في 14 أغسطس 2026، تم التحقق بصريًا من بيانات حقيقية أُنشئت عبر الواجهة الموثقة: بلدية **بلدية اختبار SENSE** والبلاغ الداخلي الموسوم **US-2026-5DA70BBA**. أظهرت لقطات سطح المكتب والهاتف التخطيط العربي من اليمين إلى اليسار، ووضوح النصوص، واستمرارية مسارات الرجوع والتنقل في لوحة العمليات وتفاصيل بلاغ المواطن.

| المسار | عرض سطح المكتب 1280px | عرض الهاتف 375px | الملاحظة |
|---|---|---|---|
| `/العمليات` | تم التحقق | تم التحقق | تظهر بطاقة النطاق وإدارة العضوية وبطاقات المؤشرات وطابور البلاغات بترتيب مقروء ودون قص مرئي. |
| `/بلاغاتي/1` | تم التحقق | تم التحقق | يظهر سجل الحالة والأدلة وبطاقة التقييم بشكل متجاوب؛ تتكدس الأقسام رأسيًا على الهاتف مع بقاء عناوين RTL والأزرار مقروءة. |

> ظهرت واجهة التقييم بعد الإغلاق المعتمد، لكن لم يُرسل تقييم اختباري لأن التقييمات يجب أن تصدر عن مواطن حقيقي خلال مرحلة التشغيل التجريبي، وليس كبيانات اصطناعية للتحقق التقني.

## صفحة الدعوة إلى التجربة التجريبية

تم التحقق من المسار العام `/التجربة` على عرض سطح المكتب بعرض 1280 بكسل والهاتف بعرض 375 بكسل. تحافظ الصفحة على التباين المقروء واتجاه RTL، وتعرض حدودًا صريحة للتجربة، وتنبيهًا بعدم استخدامها للطوارئ، ومسار مشاركة حقيقيًا يبدأ بالتسجيل وينتهي بتقييم اختياري صادق بعد الإغلاق. تتدرج بطاقات الخطوات رأسيًا على الهاتف دون قص مرئي، وتبقى أزرار المشاركة والعودة إلى الرئيسية قابلة للاستخدام.
