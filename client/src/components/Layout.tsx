import { NavLink, Outlet } from "react-router-dom";
import {
  ChefHat,
  FileText,
  GraduationCap,
  Headset,
  Languages,
  LayoutDashboard,
  NotebookPen,
  PiggyBank,
  UserCheck,
} from "lucide-react";
import clsx from "clsx";
import logo from "../assets/logo.png";

const overview = { to: "/", label: "Overview", icon: LayoutDashboard, end: true };

const groups = [
  {
    label: "Learning",
    links: [
      { to: "/study-buddy", label: "Study Buddy", icon: GraduationCap },
      { to: "/homework", label: "Homework Coach", icon: NotebookPen },
      { to: "/language", label: "Language Learning", icon: Languages },
    ],
  },
  {
    label: "Business",
    links: [
      { to: "/followup", label: "Follow-up Agent", icon: UserCheck },
      { to: "/document", label: "Document & Report", icon: FileText },
      { to: "/support", label: "Customer Support", icon: Headset },
    ],
  },
  {
    label: "Everyday",
    links: [
      { to: "/recipe", label: "Recipe Coach", icon: ChefHat },
      { to: "/finance", label: "Finance Coach", icon: PiggyBank },
    ],
  },
];

function NavItem({ to, label, icon: Icon, end }: { to: string; label: string; icon: typeof ChefHat; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
          isActive
            ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
            : "text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
        )
      }
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full gap-4 p-4">
      <aside className="flex w-72 shrink-0 flex-col overflow-y-auto rounded-3xl border border-[var(--color-glass-border)] bg-[var(--color-surface)] backdrop-blur-xl p-5 [box-shadow:var(--shadow-lifted)]">
        <div className="mb-6 flex items-center gap-2.5 px-1 pt-1">
          <img src={logo} alt="Saasta Software Services" className="h-9 w-9 shrink-0 rounded-xl object-cover [box-shadow:var(--shadow-soft)]" />
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold leading-tight text-[var(--color-text)]">
              Saasta Software Services
            </p>
            <p className="text-xs leading-tight text-[var(--color-text-dim)]">AI Workspace</p>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5">
          <NavItem {...overview} />
        </nav>

        {groups.map((g) => (
          <div key={g.label} className="mt-5">
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
              {g.label}
            </p>
            <nav className="flex flex-col gap-0.5">
              {g.links.map((l) => (
                <NavItem key={l.to} {...l} />
              ))}
            </nav>
          </div>
        ))}

        <div className="mt-auto px-1 pb-1 pt-6">
          <p className="text-[11px] leading-relaxed text-[var(--color-text-faint)]">
            Crafted by <span className="font-medium text-[var(--color-text-dim)]">Saasta Software Services</span>
          </p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
