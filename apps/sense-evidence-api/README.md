# SENSE Evidence API

خدمة Ruby on Rails مقترحة لإدارة **الادعاءات والأدلة وقرارات المراجعة البشرية** ضمن منظومة SENSE.

> **الحالة:** تصور معماري ووثيقة بدء فقط. هذا المجلد لا يحتوي بعد على تطبيق Rails منفذًا، ولا ينبغي اعتباره خدمة منشورة أو جاهزة لاستقبال بيانات حقيقية.

## الغرض

تمنح الخدمة SENSE طبقة مستقلة لحفظ الادعاءات المتعلقة بالتجارب السياحية، وربط كل ادعاء بدليل ومصدر وحالة مراجعة وقرار بشري. الهدف هو منع نشر معلومات غير مؤكدة عن المكان أو المضيف أو السلامة أو الوصول أو السعر أو التوافر.

الخدمة ليست نظام حجز أو دفع، وليست جهة اعتماد، ولا تنشئ شراكات تلقائيًا. كما أنها لا تقرأ بيانات Urban-Sense المدنية ولا تكتب فيها.

## الحدود الحالية

يشمل النطاق المقترح:

- إنشاء مسودة ملف تجربة.
- إضافة ادعاء إلى ملف التجربة.
- إرفاق مرجع أو ملاحظة أو دليل بالادعاء.
- نقل الادعاء إلى طابور المراجعة.
- تسجيل قرار المراجع وسببه وتاريخه.
- إظهار حالة الادعاء للواجهة العامة بصياغة محدودة.
- تسجيل أحداث التدقيق دون كشف البيانات الخاصة للعامة.

لا يشمل النطاق الحالي:

- الحجز أو الدفع.
- التحقق الآلي من هوية أصحاب التجارب.
- اعتماد رسمي أو شهادة جودة.
- نشر ملف عام دون موافقة ومراجعة بشرية.
- تخزين بيانات بطاقات الدفع.
- مشاركة قاعدة البيانات مع Urban-Sense.
- استخدام مؤشر الجاهزية بوصفه دليلًا على الطلب أو الاعتماد.

## التصميم المقترح

```text
React / SENSE Experience
          |
          | HTTPS JSON API
          v
Ruby on Rails Evidence API
          |
          +-- PostgreSQL
          +-- Object storage for approved evidence only
          +-- Audit log
          +-- Reviewer authorization boundary
```

يجب أن تتعامل الواجهة مع الخدمة عبر عقد API موثق. لا تعتمد الخدمة على جداول مشتركة أو أسرار مشتركة مع `apps/web` أو أي تطبيق آخر.

## هيكل مجلدات Rails المقترح

```text
apps/sense-evidence-api/
├── README.md
├── Gemfile
├── Gemfile.lock
├── Rakefile
├── config.ru
├── Dockerfile
├── .ruby-version
├── .env.example
├── .gitignore
│
├── app/
│   ├── controllers/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── experiences_controller.rb
│   │   │       ├── claims_controller.rb
│   │   │       ├── evidence_items_controller.rb
│   │   │       ├── review_decisions_controller.rb
│   │   │       └── health_controller.rb
│   │   └── application_controller.rb
│   │
│   ├── models/
│   │   ├── provider.rb
│   │   ├── experience.rb
│   │   ├── claim.rb
│   │   ├── evidence_item.rb
│   │   ├── review_decision.rb
│   │   ├── reviewer.rb
│   │   └── audit_event.rb
│   │
│   ├── policies/
│   │   ├── experience_policy.rb
│   │   ├── claim_policy.rb
│   │   ├── evidence_item_policy.rb
│   │   └── review_decision_policy.rb
│   │
│   ├── serializers/
│   │   ├── experience_serializer.rb
│   │   ├── claim_serializer.rb
│   │   └── evidence_item_serializer.rb
│   │
│   ├── services/
│   │   ├── claims/
│   │   │   ├── submit_for_review.rb
│   │   │   ├── publish_projection.rb
│   │   │   └── redact_private_fields.rb
│   │   ├── evidence/
│   │   │   ├── register_item.rb
│   │   │   └── validate_metadata.rb
│   │   └── review/
│   │       ├── record_decision.rb
│   │       └── transition_claim.rb
│   │
│   └── jobs/
│       └── audit_event_job.rb
│
├── config/
│   ├── routes.rb
│   ├── database.yml
│   ├── environment.rb
│   ├── environments/
│   │   ├── development.rb
│   │   ├── test.rb
│   │   └── production.rb
│   └── initializers/
│       ├── cors.rb
│       └── structured_logging.rb
│
├── db/
│   ├── migrate/
│   ├── schema.rb
│   └── seeds.rb
│
├── lib/
│   ├── contracts/
│   │   ├── api_error.rb
│   │   └── public_claim_projection.rb
│   └── tasks/
│       └── evidence.rake
│
├── openapi/
│   └── sense-evidence-api.yml
│
├── spec/
│   ├── requests/
│   │   └── api/v1/
│   ├── models/
│   ├── policies/
│   ├── services/
│   ├── contract/
│   └── support/
│
├── docs/
│   ├── DATA-MODEL.md
│   ├── REVIEW-WORKFLOW.md
│   ├── SECURITY-AND-RETENTION.md
│   ├── INTEGRATION-CONTRACT.md
│   └── RUNBOOK.md
│
└── .github/
    └── workflows/
        ├── ci.yml
        └── security.yml
```

## نموذج البيانات

### `Provider`

يمثل صاحب التجربة أو الجهة التي تقدّمها. لا يُعرض ملفه العام قبل الموافقة المطلوبة، ويجب فصل بيانات الاتصال الخاصة عن الإسقاط العام.

### `Experience`

يمثل التجربة أو المسار المقترح. يحتوي على حالته التشغيلية، ووصفه، ومضيفه، ونطاقه، ونقاط التحقق المطلوبة.

### `Claim`

يمثل ادعاءً قابلًا للمراجعة، مثل مدة التجربة أو نقطة اللقاء أو مستوى الوصول. لا يصبح الادعاء قابلًا للإظهار العام لمجرد إدخاله.

### `EvidenceItem`

يمثل الدليل المرتبط بالادعاء، مثل إفادة منسوبة، ملاحظة ميدانية، صورة، رابط، أو سجل مراجعة. يجب أن تتضمن البيانات الوصفية مالك الدليل، وتاريخ جمعه، وحالة الموافقة، وحدود استخدامه.

### `ReviewDecision`

يمثل قرار المراجع البشري، مع هوية المراجع، والقرار، والسبب، والتاريخ، ورقم النسخة أو الادعاء الذي تمت مراجعته.

### `AuditEvent`

يسجل الأحداث الحساسة مثل إنشاء الادعاء، إرفاق الدليل، طلب التعديل، قرار المراجع، النشر، والإخفاء. لا ينبغي أن يحتوي سجل التدقيق على أسرار أو بيانات أكثر مما يلزم.

## حالات سير العمل

```text
draft
  ↓
under_review
  ├── needs_changes ──→ draft
  ├── rejected
  └── approved_for_display
                         ↓
                      published
                         ↓
                      archived
```

تتطلب الحالات `approved_for_display` و`published` موافقة بشرية موثقة. ولا تعني `approved_for_display` أن السعر أو التوافر أو الحجز متاح؛ إذ يجب أن يكون لكل نوع ادعاء قواعد تحقق مستقلة.

## الإسقاط العام للادعاءات

لا ترسل الخدمة السجل الداخلي كاملًا إلى الواجهة العامة. بدلًا من ذلك، تنشئ إسقاطًا محدودًا مثل:

```json
{
  "claim": "مدة التجربة",
  "value": "90 دقيقة",
  "status": "verified_for_display",
  "reviewed_at": "2026-09-17",
  "source_label": "مراجعة محلية"
}
```

أما بيانات الاتصال، والملاحظات الداخلية، وهوية المراجع، والملفات الخاصة، وأسباب الرفض التفصيلية، فتظل خارج الإسقاط العام ما لم توجد سياسة صريحة تسمح بعرضها.

## واجهة API أولية

```text
GET    /api/v1/health
GET    /api/v1/experiences/:id
POST   /api/v1/experiences
PATCH  /api/v1/experiences/:id
GET    /api/v1/experiences/:experience_id/claims
POST   /api/v1/experiences/:experience_id/claims
POST   /api/v1/claims/:id/evidence
POST   /api/v1/claims/:id/submit-for-review
POST   /api/v1/claims/:id/review-decisions
GET    /api/v1/review-queue
```

هذه المسارات تصور أولي، ولا يجوز تنفيذها أو نشرها قبل اعتماد عقد البيانات والصلاحيات وسياسة الاحتفاظ.

## الصلاحيات المقترحة

| الدور | ما يمكنه فعله |
|---|---|
| صاحب التجربة | إنشاء مسودة، تعديل بياناته، وإرفاق أدلة تخص تجربته |
| المراجع | فحص الأدلة، طلب تعديل، وقبول أو رفض ادعاء ضمن نطاقه |
| مدير الخدمة | إدارة الإعدادات والمراجعين وسجل التدقيق |
| الواجهة العامة | قراءة الإسقاطات المنشورة فقط |
| خدمة التكامل | قراءة عقود محدودة بمفتاح خدمة مقيد النطاق |

لا ينبغي استخدام كلمة «مراجع موثق» أو «معتمد» في الواجهة ما لم توجد آلية هوية وصلاحية ومراجعة قابلة للإثبات.

## التشغيل المحلي عند بدء التنفيذ

هذه الخطوات مستقبلية؛ لا تعمل قبل إنشاء تطبيق Rails فعلي:

```bash
cd apps/sense-evidence-api
bundle install
bin/rails db:prepare
bin/rails spec
bin/rails server -p 4100
```

متطلبات أولية مقترحة:

- Ruby مثبت بإصدار محدد في `.ruby-version`.
- Rails بإصدار معتمد للفريق.
- PostgreSQL منفصل عن قاعدة Urban-Sense.
- متغيرات البيئة محفوظة خارج Git.
- تخزين ملفات خاص مع سياسة حذف واحتفاظ.
- هوية مراجعين مستقلة.

## بوابة الجودة قبل أي دمج

يجب أن يفشل CI عند تحقق أحد الشروط التالية:

- اختبار يفشل.
- مخالفة لعقد API.
- غياب سجل تدقيق لقرار حساس.
- محاولة نشر ادعاء بلا دليل أو موافقة لازمة.
- تسريب حقل خاص إلى الإسقاط العام.
- اتصال بقاعدة Urban-Sense أو مشاركة أسرار معها.
- وجود بيانات حقيقية في بيئة الاختبار.

الفحوص المقترحة:

```bash
bundle exec rubocop
bundle exec brakeman
bundle exec rspec
bundle exec rspec spec/contract
```

## خطة التنفيذ المرحلية

### المرحلة الأولى: العقد

اعتماد نموذج البيانات وحالات الادعاء وعقد الإسقاط العام قبل كتابة واجهة الإنتاج.

### المرحلة الثانية: المسودة والمراجعة

تنفيذ إنشاء التجربة والادعاء والدليل، ثم بناء طابور مراجعة داخلي دون نشر عام.

### المرحلة الثالثة: الإسقاط المحدود

إتاحة قراءة الادعاءات التي حصلت على حالة `approved_for_display` فقط، مع اختبار عدم تسريب الحقول الخاصة.

### المرحلة الرابعة: تكامل SENSE

ربط واجهة React بالخدمة عبر API موثق، مع إبقاء الحفظ المحلي الحالي متاحًا أثناء فترة الانتقال.

### المرحلة الخامسة: الجاهزية التشغيلية

لا تُفتح بيانات حقيقية أو نشر عام قبل اجتياز سياسة الأمان والاحتفاظ والموافقة، وتعيين مالك واضح للمراجعة والتشغيل.

## العلاقة مع مستودع SENSE

- `apps/sense-experience`: الواجهة وتجربة المزود والزائر.
- `apps/sense-evidence-api`: خدمة Ruby المقترحة للادعاءات والأدلة، عند اعتماد تنفيذها.
- `apps/web`: Urban-Sense المدني، ويبقى منفصلًا.
- `docs/sense-experience`: الوثائق والحدود والعقود المشتركة الخاصة بسياق SENSE.

المعيار هو أن تكون العلاقة عبر API وعقود ضيقة. لا تُستخدم جداول مشتركة أو قراءة مباشرة من قاعدة تطبيق آخر.

## قرار البدء

لا يبدأ التنفيذ الفعلي إلا بعد الإجابة عن الأسئلة التالية:

1. من يملك قرار مراجعة الادعاء؟
2. ما أنواع الأدلة المقبولة لكل نوع من الادعاءات؟
3. ما مدة الاحتفاظ بالملفات والمعلومات؟
4. هل نحتاج تخزين ملفات أم تكفينا روابط وملاحظات؟
5. ما الحقول التي يجوز ظهورها في الإسقاط العام؟
6. ما الخدمة التي ستشغّل Ruby في بيئة الإنتاج؟
7. ما معيار الانتقال من `approved_for_display` إلى `published`؟

## مراجع

[1]: https://guides.rubyonrails.org/ "Ruby on Rails Guides"
[2]: https://guides.rubyonrails.org/api_app.html "Using Rails for API-only Applications"
[3]: https://www.ruby-lang.org/en/documentation/ "Ruby Documentation"
