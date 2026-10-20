import { useMemo, useState } from "react";
import { environmentalSeminar, validateSeminarBooking } from "../live/seminarBooking.js";

const reservedSeatsKey = "sense-environmental-seminar-reserved-v1";

export function SeminarBookingCard() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [seats, setSeats] = useState(1);
  const [submitted, setSubmitted] = useState<{ reference: string; seats: number } | null>(null);
  const [error, setError] = useState("");
  const remainingSeats = useMemo(() => {
    try { return Math.max(0, environmentalSeminar.capacity - Number(localStorage.getItem(reservedSeatsKey) || 0)); } catch { return environmentalSeminar.capacity; }
  }, [submitted]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateSeminarBooking({ name, contact, seats }, remainingSeats);
    if (!result.ok) { setError(result.message); setSubmitted(null); return; }
    try { localStorage.setItem(reservedSeatsKey, String(environmentalSeminar.capacity - result.seats)); } catch { /* local-only demo remains usable */ }
    setError("");
    setSubmitted({ reference: result.reference, seats: result.seats });
  }

  return <section className="seminar-booking-card" aria-labelledby="seminar-booking-title">
    <div className="seminar-booking-intro"><span className="sense-section-label">حجز مقعد · ندوة بيئية</span><h2 id="seminar-booking-title">احجز مكانك في الندوة</h2><p>أرسل طلب مقاعد أوليًا للندوة حول كهوف فلسطين. سيظهر لك رقم مرجعي محلي؛ التأكيد النهائي يعتمد على مراجعة منتدى الخبرات.</p><div className="seminar-facts"><span><b>الموعد</b>{environmentalSeminar.dateLabel}</span><span><b>المكان</b>{environmentalSeminar.venue}</span><span><b>السعة التجريبية</b>{remainingSeats} مقعدًا ظاهرًا</span></div></div>
    <form className="seminar-booking-form" onSubmit={submit}>
      <label>الاسم<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="اسم الحاضر أو المجموعة" /></label>
      <label>البريد أو الهاتف<input value={contact} onChange={(event) => setContact(event.target.value)} required minLength={5} placeholder="وسيلة تواصل للتأكيد" /></label>
      <label>عدد المقاعد<select value={seats} onChange={(event) => setSeats(Number(event.target.value))}>{Array.from({ length: 6 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "مقعد" : "مقاعد"}</option>)}</select></label>
      <button className="sense-primary" type="submit" disabled={!remainingSeats}>{remainingSeats ? "اطلب المقاعد ↗" : "اكتملت السعة المعلنة"}</button>
      {error && <p className="seminar-booking-error" role="alert">{error}</p>}
      {submitted && <div className="seminar-booking-success" role="status"><strong>تم حفظ طلب المقاعد مبدئيًا ✓</strong><p>المرجع: <b>{submitted.reference}</b> · {submitted.seats} مقعد</p><small>هذا ليس تذكرة نهائية ولا عملية دفع. تواصل مع الجهة المنظمة لتأكيد الحضور.</small></div>}
      <small className="seminar-booking-boundary">يحفظ هذا النموذج مسودة محلية في المتصفح فقط، ولا يرسل بياناتك إلى خادم في النسخة الحالية.</small>
    </form>
  </section>;
}
