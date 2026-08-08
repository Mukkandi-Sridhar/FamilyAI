import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Calendar,
  Cpu,
  FileText,
  GraduationCap,
  Heart,
  Layers,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

import hero3d from "../assets/hero_3d.png";


const PROMPT_SUGGESTIONS = [
  { icon: Calendar, text: "Plan our family weekend itinerary", target: "/study-buddy" },
  { icon: FileText, text: "Find important family tax documents", target: "/document" },
  { icon: Heart, text: "Suggest a healthy dinner for diabetes & BP", target: "/recipe" },
  { icon: UserCheck, text: "Draft client follow-up thank you note", target: "/followup" },
];

const CATEGORIES = ["All Assistants", "Business & Sales", "Learning & Knowledge", "Daily Productivity"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All Assistants");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-10 sm:gap-12 pb-12">
      {/* 1. Large Hero Composition */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 sm:p-10 shadow-2xl">
        {/* Subtle Ambient Violet/Indigo Glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.6), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.5), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/80 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-700/50 mb-4 shadow-sm backdrop-blur-md">
              <Bot size={14} className="text-indigo-400" />
              <span>Faimily Enterprise AI OS v2.4</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              AI-Powered Workspace for Modern Families
            </h1>
            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
              Unified multi-agent platform designed for family academic tutoring, pipeline business automation, financial analytics, and health planning.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#constellation"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <span>Launch Family Workspace</span>
                <ArrowRight size={15} />
              </a>
              <div className="flex items-center gap-4 border-l border-slate-700/80 pl-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <ShieldCheck size={16} /> 100% Operational
                </span>
                <span className="flex items-center gap-1.5 font-medium text-indigo-300">
                  <Cpu size={16} /> 8 Active Engines
                </span>
              </div>
            </div>
          </div>

          {/* 3D Visual Composition */}
          <div className="flex shrink-0 items-center justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-40 blur-xl transition-all duration-500 group-hover:opacity-70" />
              <img
                src={hero3d}
                alt="Faimily 3D AI Assistant"
                className="relative h-56 sm:h-64 lg:h-72 w-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Smart AI Suggestion Prompts Strip */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Quick AI Actions &amp; Smart Context Prompts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROMPT_SUGGESTIONS.map(({ icon: Icon, text, target }, i) => (
            <Link
              key={i}
              to={target}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all shadow-2xs group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Icon size={15} />
              </div>
              <span className="truncate flex-1">{text}</span>
              <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Family Network Constellation (Interactive Family Ecosystem Hub) */}
      <div id="constellation" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 mb-2">
              <Users size={14} />
              <span>Family Network Constellation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              The Sharma Family AI Hub
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Connected family members, academic progress tracks, financial allocations, and individual AI assistants.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 4 Connected Members
            </span>
          </div>
        </div>

        {/* Constellation Network Graphics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Member 1: Ananya (Student) */}
          <div className="relative rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 to-white p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-xs">
                AN
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ananya Sharma</h3>
                <p className="text-[11px] font-semibold text-indigo-600">Class 8 Student · CBSE</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-white/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Active Agent:</span>
                <span className="font-bold text-slate-900">Study Buddy (Photosynthesis)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recent Score:</span>
                <span className="font-bold text-emerald-600">92/100 Graded</span>
              </div>
            </div>
            <Link to="/study-buddy" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              <span>View Academic Progress</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Member 2: Rahul (Parent & Finance) */}
          <div className="relative rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm shadow-xs">
                RS
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Rahul Sharma</h3>
                <p className="text-[11px] font-semibold text-amber-700">Parent · Finance &amp; Sales</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-white/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Active Agent:</span>
                <span className="font-bold text-slate-900">Finance &amp; Expense Coach</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Net Savings:</span>
                <span className="font-bold text-emerald-600">₹23,500 Budgeted</span>
              </div>
            </div>
            <Link to="/finance" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800">
              <span>Manage Cash Flow</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Member 3: Priya (Language Learner) */}
          <div className="relative rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/50 to-white p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-sm shadow-xs">
                PS
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Priya Sharma</h3>
                <p className="text-[11px] font-semibold text-rose-700">Language Learner · Spanish</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-white/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Active Agent:</span>
                <span className="font-bold text-slate-900">Language Learning (Roleplay)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Streak Record:</span>
                <span className="font-bold text-rose-600">7 Days 🔥</span>
              </div>
            </div>
            <Link to="/language" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800">
              <span>Start Roleplay Session</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Control */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 rounded-xl bg-slate-200/60 border border-slate-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI engines..."
            className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 shadow-2xs"
          />
        </div>
      </div>

      {/* 5. Grouped Assistant Workspace Sections (No Uniform Box Overload!) */}
      <div className="flex flex-col gap-10">
        {/* Section A: Business & Operations Suite */}
        {(selectedCategory === "All Assistants" || selectedCategory === "Business & Sales") && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <TrendingUp size={16} className="text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Business &amp; Operations Engines</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Link to="/followup" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <UserCheck size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">CRM Sales</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Follow-up Agent</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Converts client meeting notes into personalized thank-you drafts, quote summaries, and 3/7/15-day schedules.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <Link to="/document" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Reporting</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Document &amp; Report</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Synthesizes raw data dumps into structured executive reports with automated charts, key trends, and owner action items.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <Link to="/support" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                      <MessageSquare size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded">Knowledge Base</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Customer Support</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Grounded support chat simulator that resolves store policy FAQs and triggers human escalation when required.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Section B: Academic & Socratic Tutoring Suite */}
        {(selectedCategory === "All Assistants" || selectedCategory === "Learning & Knowledge") && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <GraduationCap size={16} className="text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Academic &amp; Learning Engines</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Link to="/study-buddy" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <GraduationCap size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Socratic Tutor</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Study Buddy</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Teaches chapter concepts step-by-step, checks understanding, and generates a graded evaluation scorecard.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <Link to="/homework" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Photo Solver</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Homework Coach</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Snap a photo of homework for step-by-step guidance, formula notes, flashcards, and concept quiz validation.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <Link to="/language" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                      <User size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded">Roleplay</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Language Learning</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Practice speaking live with gentle grammar feedback, vocabulary tracking, XP streaks, and session scoring.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Section C: Daily Living & Financial Analytics */}
        {(selectedCategory === "All Assistants" || selectedCategory === "Daily Productivity") && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers size={16} className="text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Daily Living &amp; Financial Engines</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Link to="/recipe" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Heart size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Nutrition</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Recipe Coach</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Input available pantry items and medical restrictions (e.g. diabetes, BP) for family-safe meal plans.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <Link to="/finance" className="group block">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                      <TrendingUp size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Cash Flow</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Finance Coach</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-4">
                    Categorizes monthly cash flow, flags unnecessary expenses, and projects optimal next-month budgets.
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-3 border-t border-slate-100">
                    <span>Open Engine</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 6. Open Workspace Status Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-100/70 p-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800">Faimily Enterprise AI Operational</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline">Global Latency: ~180ms</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-indigo-600" /> End-to-End Privacy</span>
          <span className="flex items-center gap-1"><Zap size={14} className="text-amber-500" /> Zero Data Retention</span>
        </div>
      </div>
    </div>
  );
}
