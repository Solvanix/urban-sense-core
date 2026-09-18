# عقد مجال MABA/SENSE — الإصدار الأولي

## الغرض

هذا العقد يحدد الحد الأدنى للكيانات التي يحتاجها جسر SENSE/MABA. لا يمثل عقد API إنتاجيًا ولا يسمح بتنفيذ معاملات مالية أو أمنية حقيقية قبل اعتماد الأمن والخصوصية والاختبارات.

## حالات البيانات

| الحالة | المعنى |
|---|---|
| `prototype` | تصور أو بيانات تجريبية غير تشغيلية |
| `verified` | راجعها مالك أو مصدر محدد |
| `pilot` | مستخدمة ضمن تجربة محدودة مع موافقة |
| `production` | معتمدة للتشغيل الفعلي |

## الكيانات الأساسية

| الكيان | الغرض | حقول أساسية |
|---|---|---|
| `Municipality` | نطاق عزل البيانات والملكية | `id`, `name`, `status`, `owner` |
| `TouristProfile` | ملف تجربة السائح | `id`, `category`, `locale`, `accessibilityNeeds`, `dataStatus` |
| `Card` | هوية البطاقة، لا الرصيد | `id`, `profileId`, `serial`, `state`, `validFrom`, `validTo` |
| `Merchant` | الشريك التجاري | `id`, `municipalityId`, `branches`, `category`, `status` |
| `Offer` | عرض أو استحقاق | `id`, `merchantId`, `eligibility`, `validity`, `status` |
| `Trip` | رحلة أو مسار سياحي | `id`, `municipalityId`, `stops`, `accessibility`, `status` |
| `Fare` | تعريف تعرفة للنقل التجريبي | `id`, `operatorId`, `model`, `rules`, `status` |
| `AccessPoint` | نقطة وصول لموقع أو تجربة | `id`, `siteId`, `direction`, `hours`, `status` |
| `VerificationRecord` | سجل تحقق للمعلومة أو الجهاز | `id`, `subjectType`, `source`, `reviewedAt`, `confidence` |

## قواعد إلزامية

1. لا يُخزن الرصيد أو مفتاح NFC أو سر دفع في WordPress أو GitHub العام.
2. كل عرض أو مسار أو موقع له مالك ومصدر وتاريخ تحديث وحالة.
3. بيانات `prototype` لا تظهر بصيغة توحي بأنها خدمة متاحة.
4. كل حدث قابل لإعادة الإرسال يجب أن يحمل `eventId` فريدًا لمنع التكرار.
5. كل نطاق بلدي يمر عبر فحص صلاحية قبل القراءة أو التعديل.
6. بيانات السائح أقل ما يمكن، والحقول الحساسة مشفرة خارج عقد العرض العام.
7. QR التجريبي لا يمثل بطاقة إنتاجية ولا يسمح بخصم مالي حقيقي.

## مثال قراءة فقط

```json
{
  "meta": {
    "project": "SENSE/MABA",
    "dataStatus": "prototype",
    "lastUpdated": "2026-09-18T00:00:00Z",
    "source": "internal-design-review"
  },
  "touristProfile": {
    "id": "demo-tourist-001",
    "category": "STD",
    "locale": "ar",
    "accessibilityNeeds": [],
    "dataStatus": "prototype"
  },
  "card": {
    "id": "demo-card-001",
    "profileId": "demo-tourist-001",
    "state": "prototype",
    "balance": null
  },
  "offer": {
    "id": "demo-offer-001",
    "merchantId": "demo-merchant-001",
    "discount": null,
    "dataStatus": "prototype"
  }
}
```

## ما يحتاج اعتمادًا قبل التوسعة

نموذج الهوية، سياسة الخصوصية والاحتفاظ، صلاحيات البلديات، نموذج الإبطال، سجل التدقيق، خوارزمية التحقق من NFC، سياسة عدم الاتصال، نموذج التسوية، واختبارات الأجهزة.
