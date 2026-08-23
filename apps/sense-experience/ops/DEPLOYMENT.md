# تشغيل SENSE Experience بشكل مستقل

هذه الحزمة تشغّل الواجهة والخدمة وقاعدة MySQL الخاصة بـSENSE Experience. لا تتصل بقاعدة Urban-Sense ولا تعيد استخدام هويته أو أسراره.

## تشغيل معاينة آمنة

```bash
cd apps/sense-experience
cp .env.example .env
# عدّل كلمات المرور وSENSE_EXPERIENCE_WEB_ORIGIN في .env
bash ops/bootstrap-server.sh
```

يعرض الخادم الواجهة على `http://localhost:3000` ويقدم `GET /healthz`. عند بقاء `SENSE_EXPERIENCE_ACCEPT_REAL_DATA=false` تعمل الواجهة، وتبقى API الخاصة ببيانات المزودين مغلقة بحالة `503`.

## فتح بوابة بيانات حقيقية

قبل جعل القيمة `true`، أكمل العناصر التالية:

1. جهّز مزود OIDC مستقلًا وأضف قيم `SENSE_EXPERIENCE_OIDC_*` و`SENSE_EXPERIENCE_REVIEWER_SESSION_SECRET` إلى `.env`.
2. طبّق الترحيلات عبر خدمة `schema` التي تشغل `pnpm db:migrate`.
3. استخرج subject الخاص بأول مراجع من مزود OIDC، ثم نفّذ أمرًا واحدًا من بيئة موثوقة:

```bash
REVIEWER_OIDC_SUBJECT='subject-from-oidc' \
REVIEWER_DISPLAY_NAME='اسم المراجع' \
REVIEWER_ROLE='administrator' \
SENSE_EXPERIENCE_DATABASE_URL='mysql://...' \
node ops/provision-reviewer.mjs
```

4. عيّن نطاق الخدمة وTLS، واجعل `SENSE_EXPERIENCE_WEB_ORIGIN` و`SENSE_EXPERIENCE_OIDC_REDIRECT_URI` متطابقين مع النطاق الحقيقي.
5. راجع سياسة الخصوصية والاحتفاظ والحذف، ثم غيّر `SENSE_EXPERIENCE_ACCEPT_REAL_DATA` إلى `true` وأعد تشغيل الحاويات.

لا تضف مزودين تجريبيين أو مراجعات أو شهادات مصطنعة لتجاوز هذه البوابة.
