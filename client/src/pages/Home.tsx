import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
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

const COMMAND_CHIPS = [
  { icon: Calendar, text: "Plan family weekend itinerary", target: "/study-buddy" },
  { icon: TrendingUp, text: "Review monthly cash flow", target: "/finance" },
  { icon: Sparkles, text: "Prepare Socratic homework check", target: "/homework" },
  { icon: FileText, text: "Find executive tax documents", target: "/document" },
  { icon: Heart, text: "Create healthy dinner plan", target: "/recipe" },
];

const TIMELINE_EVENTS = [
  {
    time: "09:30 AM",
    title: "Socratic Homework Checked",
    detail: "Ananya completed 8th Grade Science Photosynthesis module",
    actor: "Ananya (Student)",
    score: "92/100",
    badgeTone: "good",
    link: "/homework",
  },
  {
    time: "11:20 AM",
    title: "Monthly Cash Flow Analyzed",
    detail: "Rahul reviewed ₹23,500 net savings balance & cuttable subscriptions",
    actor: "Rahul (Parent)",
    badgeTone: "brand",
    link: "/finance",
  },
  {
    time: "02:00 PM",
    title: "Client Thank-You Email Drafted",
    detail: "Generated 3/7/15-day follow-up outreach timeline from meeting notes",
    actor: "Rahul (Sales)",
    badgeTone: "brand",
    link: "/followup",
  },
  {
    time: "06:30 PM",
    title: "Live Spanish Roleplay Completed",
    detail: "Priya achieved 7-Day learning streak with zero grammar flags",
    actor: "Priya (Learner)",
    score: "7-Day Streak 🔥",
    badgeTone: "good",
    link: "/language",
  },
];

const CATEGORIES = ["All Assistants", "Business & Sales", "Learning & Knowledge", "Daily Productivity"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All Assistants");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-10 sm:gap-12 pb-12">
      {/* 1. Premium Immersive Hero — "Good afternoon. Welcome to fAImily" */}
      <div
        className="relative overflow-hidden text-white"
        style={{
          borderRadius: "28px",
          boxShadow: "0 0 0 1px rgba(99,102,241,0.25), 0 8px 64px rgba(30,10,80,0.6), 0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── Layer 0: Deep navy base ── */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0820 0%, #0d0b2e 40%, #0b1230 100%)",
          }}
        />

        {/* ── Layer 1: Large blurred ambient glow orbs ── */}
        <div
          className="pointer-events-none absolute rounded-full blur-[120px]"
          style={{
            width: "60%",
            height: "180%",
            top: "-40%",
            right: "-10%",
            background: "radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(139,92,246,0.25) 40%, transparent 70%)",
            animation: "heroGlow 6s ease-in-out infinite alternate",
          }}
        />
        <div
          className="pointer-events-none absolute rounded-full blur-[100px]"
          style={{
            width: "50%",
            height: "120%",
            bottom: "-30%",
            left: "-5%",
            background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(79,70,229,0.12) 50%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute rounded-full blur-[80px]"
          style={{
            width: "30%",
            height: "80%",
            top: "10%",
            left: "20%",
            background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
          }}
        />

        {/* ── Layer 2: Subtle grid/noise texture overlay ── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.5px, transparent 0.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── Layer 3: Geometric orbit ring (decorative) ── */}
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            right: "6%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "340px",
            height: "340px",
            border: "1px solid rgba(139,92,246,0.18)",
            borderRadius: "50%",
          }}
        />
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "230px",
            height: "230px",
            border: "1px solid rgba(99,102,241,0.14)",
            borderRadius: "50%",
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-6 sm:p-10 lg:p-12">

          {/* LEFT: Editorial Typography — 55% */}
          <div className="flex-1 min-w-0">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1 backdrop-blur-md mb-5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-indigo-300 uppercase">Saasta Software Services</span>
            </div>

            {/* Main heading — preserve exact wording, stylise "fAImily" */}
            <h1 className="font-display leading-tight tracking-tight">
              <span className="block text-xl sm:text-2xl font-semibold text-slate-300 mb-1">Good afternoon.</span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
                Welcome to{" "}
                <span
                  style={{
                    background: "linear-gradient(100deg, #a78bfa 0%, #38bdf8 60%, #818cf8 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  fAImily
                </span>
              </span>
            </h1>

            {/* Sub-description — preserve exact wording */}
            <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-slate-400">
              Eight helpers for your family — for school, for work, and for everyday life.{" "}
              <span className="text-slate-300 font-medium">Pick one to begin.</span>
            </p>

            {/* Status row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Live indicator chip */}
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>8 AI Helpers · Ready</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-200">
                <ShieldCheck size={14} className="text-indigo-400" />
                <span>Zero Data Retention</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-200">
                <Cpu size={14} className="text-violet-400" />
                <span>Live AI · No Canned Answers</span>
              </div>
            </div>
          </div>

          {/* RIGHT: 3D Layered Visual Composition — 45% */}
          <div className="relative shrink-0 flex items-center justify-center w-full lg:w-auto lg:min-w-[360px]">
            {/* Central 3D AI Avatar — Layer 2 */}
            <div className="relative group">
              {/* Glow halo behind avatar */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-60 transition-opacity duration-700 group-hover:opacity-90"
                style={{
                  background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(99,102,241,0.4) 40%, transparent 70%)",
                }}
              />

              {/* 3D Avatar Image */}
              <img
                src={hero3d}
                alt="Faimily AI Family Intelligence Hub"
                className="relative h-52 sm:h-64 lg:h-72 w-auto object-contain drop-shadow-2xl"
                style={{ animation: "heroBobble 5s ease-in-out infinite" }}
              />

              {/* ── Layer 3: Floating Glass Status Chips ── */}

              {/* Chip 1: Learning activity — top-left */}
              <div
                className="absolute -left-4 sm:-left-10 top-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl px-3 py-2.5 shadow-2xl text-xs text-white"
                style={{ animation: "floatA 4s ease-in-out infinite" }}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-400/30">
                  <GraduationCap size={14} className="text-blue-300" />
                </div>
                <div>
                  <p className="font-bold text-white leading-none">Study Buddy</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Active · Photosynthesis</p>
                </div>
              </div>

              {/* Chip 2: Finance — bottom-right */}
              <div
                className="absolute -right-4 sm:-right-8 bottom-8 hidden sm:flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl px-3 py-2.5 shadow-2xl text-xs text-white"
                style={{ animation: "floatB 5.5s ease-in-out infinite" }}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-400/30">
                  <TrendingUp size={14} className="text-amber-300" />
                </div>
                <div>
                  <p className="font-bold text-white leading-none">Finance Coach</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">₹23,500 Net Savings</p>
                </div>
              </div>

              {/* Chip 3: Live status — top-right */}
              <div
                className="absolute -right-2 sm:-right-6 top-2 hidden sm:flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-900/80 backdrop-blur-xl px-2.5 py-1.5 shadow-xl text-[10px] font-bold text-emerald-300"
                style={{ animation: "floatC 3.5s ease-in-out infinite" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CSS keyframes injected inline via style tag ── */}
        <style>{`
          @keyframes heroBobble {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes heroGlow {
            0%   { opacity: 0.35; }
            100% { opacity: 0.55; }
          }
          @keyframes floatA {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50%       { transform: translateY(-6px) translateX(2px); }
          }
          @keyframes floatB {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(8px); }
          }
          @keyframes floatC {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-4px); }
          }
        `}</style>
      </div>

      {/* 2. AI Command Center Section */}
      <div id="command-center" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">AI Command Center &amp; Quick Prompts</span>
        </div>

        {/* Large AI Command Input Bar */}
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask Family AI anything (e.g. check homework, analyze expenses, draft email, meal plan)..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 shadow-2xs"
          />
          <div className="absolute right-3 hidden sm:flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 border border-slate-200">
            <span>Press Enter</span>
          </div>
        </div>

        {/* Floating Command Chips */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pt-1">
          {COMMAND_CHIPS.map(({ icon: Icon, text, target }, i) => (
            <Link
              key={i}
              to={target}
              className="whitespace-nowrap flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/60 transition-all shadow-2xs group cursor-pointer"
            >
              <Icon size={14} className="text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>{text}</span>
              <ArrowRight size={12} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Family Network Constellation / Ecosystem Visual Hub */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 mb-2">
              <Users size={14} />
              <span>FAMILY NETWORK CONSTELLATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              The Sharma Family Ecosystem
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Orbital connected profile nodes, real-time academic gauges, and specialized assistant engines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 4 Active Members Connected
            </span>
          </div>
        </div>

        {/* Family Ecosystem Orbital Network */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Member 1: Ananya (Student) */}
          <div className="group relative rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 p-5 transition-all duration-300 hover:shadow-md hover:border-indigo-400">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-md transition-transform group-hover:scale-105">
                  AN
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ananya Sharma</h3>
                  <p className="text-[11px] font-semibold text-indigo-600">Class 8 Student · CBSE</p>
                </div>
              </div>

              {/* Data Visualization Ring: 92/100 Score */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold text-emerald-600">92/100</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Socratic</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-4 bg-white p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Active Agent:</span>
                <span className="font-bold text-slate-900">Study Buddy (Photosynthesis)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Evaluated Progress:</span>
                <span className="font-bold text-emerald-600">Concept Verified</span>
              </div>
            </div>

            <Link to="/study-buddy" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              <span>Launch Study Buddy Tutor</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Member 2: Rahul (Parent & Finance) */}
          <div className="group relative rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/50 via-white to-slate-50 p-5 transition-all duration-300 hover:shadow-md hover:border-amber-400">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm shadow-md transition-transform group-hover:scale-105">
                  RS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Rahul Sharma</h3>
                  <p className="text-[11px] font-semibold text-amber-700">Parent · Finance &amp; Sales</p>
                </div>
              </div>

              {/* Data Visualization Ring: Savings */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold text-amber-600">₹23.5k</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Savings</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-4 bg-white p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Active Agent:</span>
                <span className="font-bold text-slate-900">Finance &amp; Expense Coach</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cash Flow Status:</span>
                <span className="font-bold text-emerald-600">Balanced Balance</span>
              </div>
            </div>

            <Link to="/finance" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800">
              <span>Manage Cash Flow</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Member 3: Priya (Language Learner) */}
          <div className="group relative rounded-2xl border border-rose-200/90 bg-gradient-to-br from-rose-50/50 via-white to-slate-50 p-5 transition-all duration-300 hover:shadow-md hover:border-rose-400">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-sm shadow-md transition-transform group-hover:scale-105">
                  PS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Priya Sharma</h3>
                  <p className="text-[11px] font-semibold text-rose-700">Learner · Spanish</p>
                </div>
              </div>

              {/* Data Visualization Ring: Streak */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold text-rose-600">7 Days</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Streak 🔥</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-4 bg-white p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Active Agent:</span>
                <span className="font-bold text-slate-900">Language Learning (Roleplay)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Grammar Flags:</span>
                <span className="font-bold text-emerald-600">Zero Grammar Flags</span>
              </div>
            </div>

            <Link to="/language" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800">
              <span>Start Roleplay Session</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Featured Flagship Assistant Spotlight Showcase */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-200/90 bg-gradient-to-br from-white via-indigo-50/40 to-slate-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-800 mb-3">
              <GraduationCap size={14} />
              <span>FEATURED FLAGSHIP AI ENGINE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Study Buddy Socratic Tutor
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
              Interactive Socratic tutor that breaks complex chapter topics into bite-sized concepts, checks understanding before moving on, and builds evaluated scorecard reports.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                <span>Concept-by-Concept Check</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                <span>Graded Quiz &amp; Scorecard Report</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-indigo-100 shadow-2xs">
              <div className="text-center px-2">
                <p className="text-2xl font-extrabold text-emerald-600">92%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Mastery</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center px-2">
                <p className="text-2xl font-extrabold text-indigo-600">CBSE</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Class 8 Science</p>
              </div>
            </div>

            <Link
              to="/study-buddy"
              className="inline-flex items-center justify-center gap-2 w-full lg:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-xs font-bold text-white transition-colors shadow-xs"
            >
              <span>Launch Study Buddy Tutor</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Live Family Activity Timeline Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Today's Family Activity Timeline</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Live Activity Feed</span>
        </div>

        <div className="relative flex flex-col gap-6 pl-4 sm:pl-6 border-l-2 border-slate-100">
          {TIMELINE_EVENTS.map((ev, i) => (
            <div key={i} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Timeline Dot */}
              <div className="absolute -left-[23px] sm:-left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-white" />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-slate-400">{ev.time}</span>
                  <span className="text-[11px] font-semibold text-indigo-600">{ev.actor}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{ev.detail}</p>
              </div>

              <div className="flex items-center gap-3">
                {ev.score && (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    {ev.score}
                  </span>
                )}
                <Link to={ev.link} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  <span>View</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Grouped Assistant Workspace Suites (No Uniform Card Overload!) */}
      <div className="flex flex-col gap-10">
        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 rounded-xl bg-slate-200/60 border border-slate-200 self-start">
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

        {/* Section B: Academic & Socratic Learning Suite */}
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

      {/* 7. Open Workspace Status Footer */}
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
