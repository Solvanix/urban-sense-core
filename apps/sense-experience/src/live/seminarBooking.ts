export type SeminarBookingInput = {
  name: string;
  contact: string;
  seats: number;
};

export type SeminarBookingResult =
  | { ok: true; reference: string; seats: number }
  | { ok: false; message: string };

export const environmentalSeminar = {
  id: "palestine-caves-seminar",
  title: "استغوار كهوف فلسطين تحت الأرض… عالمٌ لم يُكتشف بعد",
  dateLabel: "السبت 26/09/2026 · 17:00",
  venue: "منتدى الخبرات",
  capacity: 30,
};

export function validateSeminarBooking(input: SeminarBookingInput, remainingSeats: number): SeminarBookingResult {
  if (input.name.trim().length < 2) return { ok: false, message: "أدخل اسمًا صالحًا للحجز." };
  if (input.contact.trim().length < 5) return { ok: false, message: "أدخل وسيلة تواصل صالحة." };
  if (!Number.isInteger(input.seats) || input.seats < 1) return { ok: false, message: "اختر مقعدًا واحدًا على الأقل." };
  if (input.seats > 6) return { ok: false, message: "الحد الأقصى للطلب الواحد 6 مقاعد." };
  if (input.seats > remainingSeats) return { ok: false, message: `المقاعد المتبقية حاليًا: ${remainingSeats}.` };
  const reference = `SENSE-${environmentalSeminar.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  return { ok: true, reference, seats: input.seats };
}
