import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ChefHat,
  Cpu,
  FileText,
  GraduationCap,
  Headset,
  Languages,
  LayoutDashboard,
  Menu,
  NotebookPen,
  PiggyBank,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import clsx from "clsx";
import logo from "../assets/logo.png";

const overview = { to: "/", label: "Overview", icon: LayoutDashboard, end: true };

const groups = [
  {
    label: "LEARNING & KNOWLEDGE",
    links: [
      { to: "/study-buddy", label: "Study Buddy", icon: GraduationCap },
      { to: "/homework", label: "Homework Coach", icon: NotebookPen },
      { to: "/language", label: "Language Learning", icon: Languages },
    ],
  },
  {
    label: "BUSINESS & OPERATIONS",
    links: [
      { to: "/followup", label: "Follow-up Agent", icon: UserCheck },
      { to: "/document", label: "Document & Report", icon: FileText },
      { to: "/support", label: "Customer Support", icon: Headset },
    ],
  },
  {
    label: "DAILY PRODUCTIVITY",
    links: [
      { to: "/recipe", label: "Recipe Coach", icon: ChefHat },
      { to: "/finance", label: "Finance Coach", icon: PiggyBank },
    ],
  },
];

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  onClick,
}: {
  to: string;
  label: string;
  icon: typeof ChefHat;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 min-h-[40px]",
          isActive
            ? "bg-indigo-50/90 text-indigo-700 font-bold border-l-2 border-indigo-600 shadow-2xs"
            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
        )
      }
    >
      <Icon size={16} strokeWidth={2} className="shrink-0 transition-transform group-hover:scale-110" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50/50">
      {/* Mobile Top Navigation Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3 lg:hidden sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Faimily AI" className="h-8 w-8 rounded-lg border border-slate-200 object-cover" />
          <div>
            <p className="text-xs font-extrabold text-slate-900 tracking-tight leading-none">Faimily AI</p>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Enterprise Workspace</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-white p-5 shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="Faimily AI" className="h-8 w-8 rounded-lg border border-slate-200 object-cover" />
                <span className="text-sm font-extrabold text-slate-900">Faimily AI Suite</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              <NavItem {...overview} onClick={() => setMobileMenuOpen(false)} />
              {groups.map((g) => (
                <div key={g.label} className="mt-4">
                  <p className="px-3.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {g.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {g.links.map((l) => (
                      <NavItem key={l.to} {...l} onClick={() => setMobileMenuOpen(false)} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200/90 bg-white p-5 sticky top-0 h-screen overflow-y-auto shadow-2xs">
        <div className="flex items-center gap-3 px-1 pb-5 border-b border-slate-100">
          <img src={logo} alt="Faimily AI" className="h-9 w-9 shrink-0 rounded-xl border border-slate-200/80 shadow-2xs object-cover" />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-900 tracking-tight">Faimily AI Workspace</p>
            <p className="text-[10px] font-semibold text-indigo-600 mt-0.5">Enterprise v2.4</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 pt-4">
          <NavItem {...overview} />
        </nav>

        {groups.map((g) => (
          <div key={g.label} className="mt-5">
            <p className="mb-2 px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {g.label}
            </p>
            <nav className="flex flex-col gap-1">
              {g.links.map((l) => (
                <NavItem key={l.to} {...l} />
              ))}
            </nav>
          </div>
        ))}

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5">
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-800 leading-tight">Engine Operational</p>
              <p className="text-[10px] text-slate-400 leading-tight">Zero Retention Secured</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Content Canvas */}
      <main className="min-w-0 flex-1 flex flex-col">
        {/* Desktop Top Context Header Bar */}
        <header className="hidden lg:flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-8 py-3.5 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-900">Workspace</span>
            <span>/</span>
            <span className="text-slate-600">Multi-Agent Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-[11px] font-bold text-emerald-700">
              <ShieldCheck size={13} />
              <span>Enterprise Mode</span>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 text-xs font-semibold text-slate-700">
              <Cpu size={15} className="text-indigo-600" />
              <span>8 Active Engines</span>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
