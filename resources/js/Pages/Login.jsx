import { useForm } from "@inertiajs/react";
import { Flower2, ArrowRight } from "lucide-react";
import { baseUrl } from "../lib/base";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "therapist@radial.com",
    password: "radial123",
  });

  const submit = (e) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background: "var(--cream)" }}>
      {/* Left brand panel */}
      <div
        className="hidden md:flex flex-col justify-between p-14 grain"
        style={{ background: "linear-gradient(160deg, #F5EDDB 0%, #E89866 65%, #8E3A1C 100%)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--ink)" }}>
            <Flower2 size={20} color="#FAF3E3" />
          </div>
          <div>
            <div className="font-display text-3xl leading-none" style={{ color: "var(--ink)" }}>radial</div>
            <div className="text-[11px] tracking-widest uppercase" style={{ color: "var(--ink-soft)" }}>
              Y-BOCS Clinical Suite
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-display text-5xl lg:text-6xl leading-tight mb-6" style={{ color: "var(--ink)" }}>
            Measure what<br />matters in OCD<br />care.
          </h1>
          <p className="max-w-md text-base" style={{ color: "var(--ink-soft)" }}>
            A complete Y-BOCS workflow — symptom checklist, severity scale, AI-assisted clinical interpretation,
            and longitudinal progress charts. Built for therapists who care about outcomes.
          </p>
        </div>

        <div className="flex gap-3 text-xs uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>
          <span>Subclinical</span><span>·</span><span>Mild</span><span>·</span><span>Moderate</span><span>·</span><span>Severe</span><span>·</span><span>Extreme</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-md card-warm p-10" data-testid="login-form">
          <div className="font-display text-3xl mb-2" style={{ color: "var(--ink)" }}>Sign in</div>
          <p className="text-sm mb-8" style={{ color: "var(--ink-muted)" }}>
            Continue to your clinical workspace.
          </p>

          <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>
            Email
          </label>
          <input
            data-testid="login-email"
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            className="w-full px-4 py-3 mb-1 rounded-xl outline-none focus:ring-2"
            style={{ background: "#FAF3E3", border: "1px solid var(--line)", color: "var(--ink)" }}
          />
          {errors.email && <div className="text-xs mb-4" style={{ color: "#8E3A1C" }}>{errors.email}</div>}

          <label className="block text-xs uppercase tracking-widest mb-2 mt-4" style={{ color: "var(--ink-muted)" }}>
            Password
          </label>
          <input
            data-testid="login-password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            required
            className="w-full px-4 py-3 mb-8 rounded-xl outline-none focus:ring-2"
            style={{ background: "#FAF3E3", border: "1px solid var(--line)", color: "var(--ink)" }}
          />

          <button
            data-testid="login-submit"
            disabled={processing}
            className="w-full btn-primary-warm flex items-center justify-center gap-2"
          >
            {processing ? "Signing in…" : <>Sign in <ArrowRight size={16} /></>}
          </button>

          <div className="mt-6 p-3 rounded-xl text-xs" style={{ background: "#F5EDDB", color: "var(--ink-soft)" }}>
            <strong>Demo:</strong> therapist@radial.com / radial123
          </div>
        </form>
      </div>
    </div>
  );
}
