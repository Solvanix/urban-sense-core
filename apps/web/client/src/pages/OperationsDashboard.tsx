import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";
import { formatDate, statusLabels, statusStyles } from "@/lib/report-ui";
import { trpc } from "@/lib/trpc";
import { Activity, ClipboardList, Clock3, Loader2, ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const roleLabels = {
  citizen: "مواطن",
  service_officer: "موظف خدمة",
  field_worker: "عامل ميداني",
  supervisor: "مشرف",
  municipality_admin: "مدير بلدية",
} as const;

type ManagedRole = keyof typeof roleLabels;

export default function OperationsDashboard() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const municipalities = trpc.reports.municipalities.listPublic.useQuery();
  const [municipalityId, setMunicipalityId] = useState("");
  const [municipalityName, setMunicipalityName] = useState("");
  const [municipalityCode, setMunicipalityCode] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<ManagedRole>("service_officer");
  const [selectedActive, setSelectedActive] = useState(true);

  const createMunicipality = trpc.reports.municipalities.create.useMutation({
    onSuccess: async created => {
      toast.success("تم إنشاء البلدية وربط حسابك بإدارتها.");
      await municipalities.refetch();
      setMunicipalityId(String(created.id));
      setMunicipalityName("");
      setMunicipalityCode("");
    },
  });

  useEffect(() => {
    if (!municipalityId && municipalities.data?.[0]) setMunicipalityId(String(municipalities.data[0].id));
  }, [municipalityId, municipalities.data]);

  const activeMunicipalityId = Number(municipalityId);
  const reportsQuery = trpc.reports.listOperations.useQuery(
    { municipalityId: activeMunicipalityId },
    { enabled: Boolean(municipalityId) },
  );
  const membersQuery = trpc.reports.municipalities.listMembers.useQuery(
    { municipalityId: activeMunicipalityId },
    { enabled: Boolean(municipalityId), retry: false },
  );
  const platformUsersQuery = trpc.reports.municipalities.listPlatformUsers.useQuery(undefined, {
    enabled: user?.role === "platform_admin",
    retry: false,
  });
  const setMemberRole = trpc.reports.municipalities.setMemberRole.useMutation({
    onSuccess: async () => {
      toast.success("تم تحديث دور العضو ضمن نطاق البلدية وتوثيق التغيير.");
      await membersQuery.refetch();
      await utils.reports.listOperations.invalidate({ municipalityId: activeMunicipalityId });
      setSelectedUserId("");
    },
  });

  const candidates = user?.role === "platform_admin"
    ? (platformUsersQuery.data ?? []).map(member => ({ id: member.id, name: member.name, email: member.email }))
    : (membersQuery.data ?? []).map(member => ({ id: member.userId, name: member.name, email: member.email }));
  const metrics = useMemo(() => {
    const data = reportsQuery.data ?? [];
    return [
      { label: "إجمالي البلاغات", value: data.length, icon: ClipboardList, tone: "text-[#0f5b5b] bg-teal-50" },
      { label: "قيد المراجعة", value: data.filter(item => ["pending", "under_review"].includes(item.status)).length, icon: Clock3, tone: "text-amber-700 bg-amber-50" },
      { label: "قيد التنفيذ", value: data.filter(item => ["assigned", "in_progress"].includes(item.status)).length, icon: Activity, tone: "text-cyan-700 bg-cyan-50" },
      { label: "بانتظار الاعتماد", value: data.filter(item => item.status === "awaiting_verification").length, icon: ShieldCheck, tone: "text-violet-700 bg-violet-50" },
    ];
  }, [reportsQuery.data]);

  return (
    <DashboardLayout>
      <main className="min-h-full bg-[#f6f8f7] p-5 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-extrabold text-[#0f5b5b]">مساحة العمل الداخلية</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#143534]">لوحة العمليات البلدية</h1>
              <p className="mt-2 text-slate-600">مراجعة البلاغات، الإسناد الميداني، والتحقق من الإغلاق.</p>
            </div>
            <div className="w-full sm:w-64">
              <label className="mb-2 block text-sm font-bold text-slate-700">نطاق البلدية</label>
              <Select value={municipalityId} onValueChange={setMunicipalityId}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="اختر البلدية" /></SelectTrigger>
                <SelectContent>{municipalities.data?.map(item => <SelectItem key={item.id} value={String(item.id)}>{item.nameAr}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </header>

          {user?.role === "platform_admin" && (
            <Card className="mt-7 border-teal-100 bg-teal-50/40">
              <CardContent className="p-5">
                <h2 className="font-extrabold text-[#143534]">إعداد أول بلدية</h2>
                <p className="mt-1 text-sm text-slate-600">ينشئ هذا الإجراء نطاق البلدية ويربط حسابك كمدير للبلدية الجديدة.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                  <Input value={municipalityName} onChange={event => setMunicipalityName(event.target.value)} placeholder="اسم البلدية بالعربية" />
                  <Input value={municipalityCode} onChange={event => setMunicipalityCode(event.target.value.toLowerCase())} placeholder="مثال: ramallah" dir="ltr" />
                  <Button disabled={createMunicipality.isPending || municipalityName.length < 3 || municipalityCode.length < 3} onClick={() => createMunicipality.mutate({ nameAr: municipalityName, code: municipalityCode })} className="bg-[#0f5b5b] font-bold">إنشاء النطاق</Button>
                </div>
                {createMunicipality.error && <p className="mt-3 text-sm font-bold text-rose-700">{createMunicipality.error.message}</p>}
              </CardContent>
            </Card>
          )}

          {membersQuery.data && municipalityId && (
            <Card className="mt-7 border-slate-200 bg-white">
              <CardContent className="p-5">
                <div className="flex items-start gap-3"><span className="rounded-xl bg-teal-50 p-2 text-[#0f5b5b]"><UsersRound size={20} /></span><div><h2 className="font-extrabold text-[#143534]">فريق البلدية والصلاحيات</h2><p className="mt-1 text-sm leading-6 text-slate-600">تُطبق الأدوار على مستوى البلدية فقط، وكل تعديل يُسجل في سجل التدقيق.</p></div></div>
                <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_190px_150px_auto]">
                  <Select value={selectedUserId} onValueChange={value => {
                    setSelectedUserId(value);
                    const existing = membersQuery.data?.find(member => member.userId === Number(value));
                    if (existing) {
                      setSelectedRole(existing.role as ManagedRole);
                      setSelectedActive(existing.isActive);
                    } else {
                      setSelectedRole("service_officer");
                      setSelectedActive(true);
                    }
                  }}>
                    <SelectTrigger><SelectValue placeholder={user?.role === "platform_admin" ? "اختر مستخدمًا لإضافته أو تحديثه" : "اختر عضوًا لتحديث دوره"} /></SelectTrigger>
                    <SelectContent>{candidates.map(member => <SelectItem key={member.id} value={String(member.id)}>{member.name ?? member.email ?? `مستخدم #${member.id}`}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={selectedRole} onValueChange={value => setSelectedRole(value as ManagedRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(roleLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={selectedActive ? "active" : "inactive"} onValueChange={value => setSelectedActive(value === "active")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="active">نشط</SelectItem><SelectItem value="inactive">موقوف</SelectItem></SelectContent>
                  </Select>
                  <Button disabled={!selectedUserId || setMemberRole.isPending} onClick={() => setMemberRole.mutate({ municipalityId: activeMunicipalityId, userId: Number(selectedUserId), role: selectedRole, isActive: selectedActive })} className="gap-2 bg-[#0f5b5b] font-bold"><UserCog size={17} />حفظ العضوية</Button>
                </div>
                {setMemberRole.error && <p className="mt-3 text-sm font-bold text-rose-700">{setMemberRole.error.message}</p>}
                <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {membersQuery.data.map(member => <div key={member.membershipId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 text-sm"><div><span className="block font-bold text-slate-800">{member.name ?? member.email ?? `عضو #${member.userId}`}</span><span className={`mt-1 inline-block text-xs font-bold ${member.isActive ? "text-emerald-700" : "text-slate-500"}`}>{member.isActive ? "عضوية نشطة" : "عضوية موقوفة"}</span></div><div className="flex items-center gap-2"><Badge className="border-0 bg-white text-slate-600 ring-1 ring-slate-200">{roleLabels[member.role as ManagedRole] ?? member.role}</Badge><Button size="sm" variant="outline" disabled={setMemberRole.isPending} onClick={() => setMemberRole.mutate({ municipalityId: activeMunicipalityId, userId: member.userId, role: member.role as ManagedRole, isActive: !member.isActive })}>{member.isActive ? "إيقاف" : "تفعيل"}</Button></div></div>)}
                </div>
              </CardContent>
            </Card>
          )}

          {reportsQuery.error ? (
            <Card className="mt-7 border-amber-200"><CardContent className="p-6"><h2 className="font-extrabold text-amber-900">تحتاج هذه اللوحة إلى صلاحية تشغيلية</h2><p className="mt-2 leading-7 text-amber-800">{reportsQuery.error.message} يجب أن يربط مدير البلدية حسابك بنطاق البلدية ودور مناسب مثل موظف خدمة أو عامل ميداني أو مشرف.</p></CardContent></Card>
          ) : (
            <>
              <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(item => <Card key={item.label} className="border-slate-100 shadow-sm"><CardContent className="flex items-center gap-4 p-5"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.tone}`}><item.icon size={21} /></span><div><p className="text-sm font-bold text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{item.value}</p></div></CardContent></Card>)}
              </section>
              <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-extrabold text-slate-900">طابور البلاغات</h2></div>
                {reportsQuery.isLoading ? <div className="flex items-center gap-3 p-8 text-slate-500"><Loader2 className="animate-spin" size={18} />جارٍ تحميل البلاغات...</div> : reportsQuery.data?.length === 0 ? <div className="p-10 text-center text-slate-500">لا توجد بلاغات ضمن النطاق المختار.</div> : <div className="divide-y divide-slate-100">{reportsQuery.data?.map(report => <Link key={report.id} href={`/العمليات/${report.id}`}><article className="flex cursor-pointer flex-wrap items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"><div><div className="flex items-center gap-2"><span className="font-mono text-xs text-slate-400">{report.publicReference}</span><Badge className={`border-0 ring-1 ${statusStyles[report.status]}`}>{statusLabels[report.status]}</Badge></div><h3 className="mt-2 font-extrabold text-slate-900">{report.title}</h3><p className="mt-1 text-sm text-slate-500">{report.locationDescription}</p></div><time className="text-sm text-slate-500">{formatDate(report.updatedAt)}</time></article></Link>)}</div>}
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
