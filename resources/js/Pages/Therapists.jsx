import { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { Plus, Shield, Trash2, User } from "lucide-react";
import { baseUrl } from "../lib/base";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import AppLayout from "../Layouts/AppLayout";

export default function Therapists() {
  const { therapists, auth } = usePage().props;
  const me = auth?.user || {};
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    name: "",
    email: "",
    password: "",
    role: "therapist",
  });

  const submit = (e) => {
    e.preventDefault();
    post(baseUrl("/admin/therapists"), {
      onSuccess: () => {
        toast.success("Therapist added");
        setOpen(false);
        reset();
      },
      onError: () => toast.error("Could not add"),
    });
  };

  const remove = (tid) => {
    if (!window.confirm("Remove this therapist? Their patients will remain in the database.")) return;
    router.delete(baseUrl(`/admin/therapists/${tid}`), {
      onSuccess: () => toast.success("Removed"),
      onError: () => toast.error("Could not remove"),
    });
  };

  return (
    <div className="max-w-7xl" data-testid="therapists-page">
      <div className="flex items-end justify-between mb-8 fade-up">
        <div>
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-muted)" }}>Organization</div>
          <h1 className="font-display text-4xl sm:text-5xl" style={{ color: "var(--ink)" }}>Therapists</h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>Manage clinicians who can use this Y-BOCS workspace.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button data-testid="add-therapist-btn" className="btn-primary-warm inline-flex items-center gap-2">
              <Plus size={16} /> New Therapist
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-display text-2xl">Add therapist</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4 mt-2" data-testid="therapist-form">
              <div>
                <Label>Full name</Label>
                <Input data-testid="therapist-name" required value={data.name} onChange={(e) => setData("name", e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input data-testid="therapist-email" type="email" required value={data.email} onChange={(e) => setData("email", e.target.value)} />
              </div>
              <div>
                <Label>Temporary password</Label>
                <Input data-testid="therapist-password" required minLength={6} value={data.password} onChange={(e) => setData("password", e.target.value)} />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={data.role} onValueChange={(v) => setData("role", v)}>
                  <SelectTrigger data-testid="therapist-role"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <button data-testid="therapist-save" type="submit" disabled={processing} className="btn-primary-warm w-full">Save therapist</button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card-warm p-2 fade-up">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Patients</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {therapists.map((tr) => (
              <tr key={tr.id} className="border-t" style={{ borderColor: "var(--line)" }} data-testid={`therapist-row-${tr.id}`}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-display" style={{ background: "var(--cream-deep)", color: "var(--ink)" }}>
                      {tr.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm" style={{ color: "var(--ink)" }}>{tr.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm" style={{ color: "var(--ink-soft)" }}>{tr.email}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: tr.role === "admin" ? "var(--brick)" : "var(--cream-deep)", color: tr.role === "admin" ? "#FAF3E3" : "var(--ink)" }}>
                    {tr.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                    {tr.role}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm" style={{ color: "var(--ink-soft)" }}>{tr.patients_count}</td>
                <td className="px-4 py-4 text-sm" style={{ color: "var(--ink-soft)" }}>
                  {new Date(tr.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-right">
                  {tr.id !== me.id && (
                    <button data-testid={`therapist-delete-${tr.id}`} onClick={() => remove(tr.id)} className="opacity-50 hover:opacity-100 transition" title="Remove">
                      <Trash2 size={16} color="var(--brick)" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {therapists.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "var(--ink-muted)" }}>
            No therapists yet.
          </div>
        )}
      </div>
    </div>
  );
}

Therapists.layout = (page) => <AppLayout>{page}</AppLayout>;
