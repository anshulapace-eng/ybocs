import { Link, router, usePage } from "@inertiajs/react";
import { LayoutDashboard, Users, FileBarChart2, LogOut, Flower2, Shield } from "lucide-react";
import { baseUrl } from "../lib/base";

export default function AppLayout({ children }) {
  const { auth, url: currentUrl } = usePage().props;
  const user = auth?.user || {};
  const currentPath = typeof window !== "undefined" ? window.location.pathname : currentUrl || "";

  const logout = () => {
    router.post(baseUrl("/logout"));
  };

  const links = [
    { to: baseUrl("/dashboard"), label: "Dashboard", icon: LayoutDashboard },
    { to: baseUrl("/patients"), label: "Patients", icon: Users },
    { to: baseUrl("/reports"), label: "Reports", icon: FileBarChart2 },
  ];
  if (user.role === "admin") {
    links.push({ to: baseUrl("/admin/therapists"), label: "Therapists", icon: Shield });
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--cream)" }}>
      <aside
        className="w-64 shrink-0 hidden md:flex flex-col py-8 px-5 border-r"
        style={{ borderColor: "var(--line)", background: "#FBF6E9" }}
        data-testid="sidebar"
      >
        <div className="flex items-center gap-2 mb-12 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--ink)" }}>
            <Flower2 size={18} color="#FAF3E3" />
          </div>
          <div>
            <div className="font-display text-2xl leading-none" style={{ color: "var(--ink)" }}>
              radial
            </div>
            <div className="text-[10px] tracking-widest uppercase" style={{ color: "var(--ink-muted)" }}>
              Y-BOCS Suite
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath.startsWith(to);
            return (
              <Link
                key={to}
                href={to}
                data-testid={`nav-${label.toLowerCase()}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:opacity-80"
                style={{
                  background: isActive ? "var(--cream-deep)" : "transparent",
                  color: "var(--ink)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <Icon size={18} />
                <span className="text-sm">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t" style={{ borderColor: "var(--line)" }}>
          <div className="px-3 mb-3">
            <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              {user.name || "Therapist"}
            </div>
            <div className="text-xs" style={{ color: "var(--ink-muted)" }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={logout}
            data-testid="logout-btn"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full hover:opacity-80"
            style={{ color: "var(--ink-soft)" }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 md:px-12 py-10">{children}</main>
    </div>
  );
}
