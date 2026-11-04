import { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { SEVERITY_COLORS } from "../../lib/severity";
import { baseUrl } from "../../lib/base";
import { Plus, Search, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import AppLayout from "../../Layouts/AppLayout";

export default function PatientsIndex() {
  const { patients, auth } = usePage().props;
  const me = auth?.user || {};
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const { data, setData, post, processing, reset, errors } = useForm({
    name: "",
    uid: "",
    age: 30,
    gender: "Female",
    mobile: "",
    email: "",
    consultant_name: me.name || "",
    assessment_date: today,
    notes: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post(baseUrl("/patients"), {
      onSuccess: () => {
        toast.success("Patient added");
        setOpen(false);
        reset();
      },
      onError: () => toast.error("Could not add patient"),
    });
  };

  const filtered = patients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
           (p.uid || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl" data-testid="patients-page">
      <div className="flex items-end justify-between mb-8 fade-up">
        <div>
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-muted)" }}>Roster</div>
          <h1 className="font-display text-4xl sm:text-5xl" style={{ color: "var(--ink)" }}>Patients</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button data-testid="add-patient-btn" className="btn-primary-warm inline-flex items-center gap-2">
              <Plus size={16} /> New Patient
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display text-2xl">Client registration</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4 mt-2" data-testid="add-patient-form">
              <div>
                <Label>Client Name *</Label>
                <Input data-testid="patient-name" required value={data.name} onChange={(e) => setData("name", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>UID</Label>
                  <Input data-testid="patient-uid" value={data.uid} onChange={(e) => setData("uid", e.target.value)} placeholder="e.g. RDL-0042" />
                </div>
                <div>
                  <Label>Assessment Date</Label>
                  <Input data-testid="patient-assessment-date" type="date" value={data.assessment_date} onChange={(e) => setData("assessment_date", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Age *</Label>
                  <Input data-testid="patient-age" type="number" min="1" max="120" required value={data.age} onChange={(e) => setData("age", e.target.value)} />
                </div>
                <div>
                  <Label>Gender *</Label>
                  <Select value={data.gender} onValueChange={(v) => setData("gender", v)}>
                    <SelectTrigger data-testid="patient-gender"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Mobile</Label>
                  <Input data-testid="patient-mobile" value={data.mobile} onChange={(e) => setData("mobile", e.target.value)} placeholder="+91 ..." />
                </div>
                <div>
                  <Label>Email ID</Label>
                  <Input data-testid="patient-email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} placeholder="client@example.com" />
                </div>
              </div>
              <div>
                <Label>Consultant Name</Label>
                <Input data-testid="patient-consultant" value={data.consultant_name} onChange={(e) => setData("consultant_name", e.target.value)} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea data-testid="patient-notes" value={data.notes} onChange={(e) => setData("notes", e.target.value)} />
              </div>
              <DialogFooter>
                <button data-testid="patient-save" type="submit" disabled={processing} className="btn-primary-warm w-full">Save client</button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card-warm p-3 mb-6 flex items-center gap-3 max-w-md">
        <Search size={16} color="var(--ink-muted)" />
        <input
          data-testid="patients-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or UID…"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "var(--ink)" }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card-warm p-12 text-center" data-testid="patients-empty">
          <User size={36} color="var(--ink-muted)" className="mx-auto mb-4" />
          <div className="font-display text-2xl mb-2" style={{ color: "var(--ink)" }}>No patients yet</div>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Add your first client to begin assessment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, idx) => (
            <Link
              key={p.id}
              href={baseUrl(`/patients/${p.id}`)}
              data-testid={`patient-card-${p.id}`}
              className={`card-warm p-6 hover:-translate-y-0.5 transition fade-up delay-${(idx % 4) + 1}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl"
                     style={{ background: "var(--cream-deep)", color: "var(--ink)" }}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                {p.last_severity && (
                  <span className="tag-severity"
                        style={{ background: SEVERITY_COLORS[p.last_severity],
                                 color: ["Severe", "Extreme"].includes(p.last_severity) ? "#FAF3E3" : "#3F1C0E" }}>
                    {p.last_severity}
                  </span>
                )}
              </div>
              <div className="font-display text-xl mb-1" style={{ color: "var(--ink)" }}>{p.name}</div>
              <div className="text-xs mb-1" style={{ color: "var(--ink-muted)" }}>
                {p.uid && <span>UID {p.uid} · </span>}{p.age}y · {p.gender}
              </div>
              {p.consultant_name && (
                <div className="text-xs mb-4" style={{ color: "var(--ink-muted)" }}>Consultant: {p.consultant_name}</div>
              )}
              <div className="flex items-end justify-between pt-4 border-t" style={{ borderColor: "var(--line)" }}>
                <div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>Sessions</div>
                  <div className="font-display text-2xl" style={{ color: "var(--ink)" }}>{p.sessions_count}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>Last score</div>
                  <div className="font-display text-2xl" style={{ color: "var(--ink)" }}>
                    {p.last_score ?? "—"}{p.last_score != null && <span className="text-sm" style={{ color: "var(--ink-muted)" }}>/40</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

PatientsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
