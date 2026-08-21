import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { accessManagementHref, urbanSenseHref } from "@/lib/sensePortalRoute";
import { trpc } from "@/lib/trpc";
import { ShieldAlert, UserCog, UsersRound } from "lucide-react";
import { useState } from "react";

const roleLabels: Record<string, string> = {
  citizen: "مستخدم",
  developer: "مطور",
  platform_admin: "مدير منصة",
  service_officer: "موظف خدمة",
  field_worker: "عامل ميداني",
  supervisor: "مشرف",
  municipality_admin: "مدير بلدية",
};

const assignableRoles = ["citizen", "developer", "platform_admin"] as const;

export default function AccessControl() {
  const { user, loading } = useAuth();
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const accounts = trpc.access.listAccounts.useQuery(undefined, { enabled: user?.role === "platform_admin" });
  const updateAccount = trpc.access.updateAccount.useMutation({
    onSettled: () => {
      setPendingUserId(null);
      accounts.refetch();
    },
  });

  if (loading) {
    return <main className="mx-auto max-w-5xl px-4 py-20 text-center text-slate-600">جارٍ التحقق من هويتك…</main>;
  }

  if (user?.role !== "platform_admin") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <section className="border border-amber-200 bg-amber-50 p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-amber-700" />
          <h1 className="text-2xl font-black text-slate-900">إدارة الوصول محصورة بمدير المنصة</h1>
          <p className="mt-3 text-slate-700">لكل حساب هويته الفردية ودوره المحدد. لا توجد كلمات مرور مشتركة أو مسار إداري عام.</p>
          <Button asChild className="mt-6"><a href={urbanSenseHref}>العودة إلى Urban‑Sense</a></Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-7">
        <div>
          <p className="text-sm font-bold text-[#0f5b5b]">وصول فردي قابل للتدقيق</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">إدارة الحسابات والصلاحيات</h1>
          <p className="mt-3 max-w-3xl text-slate-600">الدور يحدد نطاق الوصول، وحالة الحساب توقف الإجراءات المحمية فورًا. كلمات المرور لا تُعرض ولا تُدار هنا.</p>
        </div>
        <Button variant="outline" asChild><a href={accessManagementHref}>تحديث القائمة</a></Button>
      </header>

      <section className="mt-8 border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4"><UsersRound className="h-5 w-5 text-[#0f5b5b]" /><h2 className="font-black text-slate-900">الحسابات الفردية</h2></div>
        {accounts.isLoading ? <p className="p-6 text-slate-600">جارٍ تحميل الحسابات…</p> : null}
        {accounts.error ? <p className="p-6 text-red-700">تعذر تحميل الحسابات. أعد المحاولة.</p> : null}
        <div className="divide-y divide-slate-200">
          {accounts.data?.map(account => {
            const updating = pendingUserId === account.id;
            const isSelf = account.id === user.id;
            return (
              <article key={`${account.id}:${account.role}:${account.isActive}`} className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_180px_150px_auto] md:items-center">
                <div>
                  <p className="font-bold text-slate-900">{account.name || "حساب بلا اسم"}</p>
                  <p className="text-sm text-slate-500">{account.email || "لا يوجد بريد ظاهر"}</p>
                  {isSelf ? <span className="mt-2 inline-block bg-teal-50 px-2 py-1 text-xs font-bold text-[#0f5b5b]">حسابك الحالي</span> : null}
                </div>
                <label className="text-sm font-bold text-slate-700">الدور
                  <select defaultValue={assignableRoles.includes(account.role as typeof assignableRoles[number]) ? account.role : "citizen"} disabled={updating} className="mt-1 block w-full border border-slate-300 bg-white px-3 py-2" onChange={event => {
                    setPendingUserId(account.id);
                    updateAccount.mutate({ userId: account.id, role: event.target.value as typeof assignableRoles[number], isActive: account.isActive });
                  }}>
                    {assignableRoles.map(role => <option key={role} value={role}>{roleLabels[role]}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input type="checkbox" defaultChecked={account.isActive} disabled={updating} onChange={event => {
                    setPendingUserId(account.id);
                    updateAccount.mutate({ userId: account.id, role: assignableRoles.includes(account.role as typeof assignableRoles[number]) ? account.role as typeof assignableRoles[number] : "citizen", isActive: event.target.checked });
                  }} />
                  الحساب نشط
                </label>
                <div className="flex items-center gap-2 text-sm text-slate-500"><UserCog className="h-4 w-4" />{updating ? "جارٍ الحفظ…" : roleLabels[account.role] || account.role}</div>
              </article>
            );
          })}
        </div>
      </section>
      <p className="mt-6 text-sm leading-7 text-slate-600">يُسجل كل تعديل لدور أو حالة حساب في سجل التدقيق. لا يمنح دور المطور صلاحيات بلدية تلقائية، ولا يكشف نشر الصفحة العامة أي بيانات تشغيلية.</p>
    </main>
  );
}
