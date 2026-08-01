import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChefHat,
  FileText,
  GraduationCap,
  Headset,
  Languages,
  NotebookPen,
  PiggyBank,
  Sparkle,
  Star,
  UserCheck,
} from "lucide-react";
import { Card, IconBadge } from "../components/ui";
import logo from "../assets/logo.png";

const groups = [
  {
    label: "Learning",
    agents: [
      {
        to: "/study-buddy",
        icon: GraduationCap,
        color: "var(--color-tutor)",
        soft: "var(--color-tutor-soft)",
        title: "Study Buddy",
        blurb: "A patient, Socratic tutor that teaches a full chapter one concept at a time, then runs a graded assessment.",
      },
      {
        to: "/homework",
        icon: NotebookPen,
        color: "var(--color-homework)",
        soft: "var(--color-homework-soft)",
        title: "Homework Coach",
        blurb: "Upload a photo of one homework question — get guided help, not the answer, plus notes, flashcards, and a quiz.",
      },
      {
        to: "/language",
        icon: Languages,
        color: "var(--color-language)",
        soft: "var(--color-language-soft)",
        title: "Language Learning",
        blurb: "Roleplay conversation practice with gentle corrections, new vocabulary, XP, streaks, and badges.",
      },
    ],
  },
  {
    label: "Business",
    agents: [
      {
        to: "/followup",
        icon: UserCheck,
        color: "var(--color-followup)",
        soft: "var(--color-followup-soft)",
        title: "Follow-up Agent",
        blurb: "Turns meeting notes into a thank-you email, quotation note, and a 3/7/15-day follow-up schedule.",
        highlight: "Must Have",
      },
      {
        to: "/document",
        icon: FileText,
        color: "var(--color-document)",
        soft: "var(--color-document-soft)",
        title: "Document & Report",
        blurb: "Turns raw notes or data into a structured report — summary, trends, chart, and action items.",
      },
      {
        to: "/support",
        icon: Headset,
        color: "var(--color-support)",
        soft: "var(--color-support-soft)",
        title: "Customer Support",
        blurb: "Answers customer questions grounded in your knowledge base, and flags anything that needs a human.",
      },
    ],
  },
  {
    label: "Everyday",
    agents: [
      {
        to: "/recipe",
        icon: ChefHat,
        color: "var(--color-recipe)",
        soft: "var(--color-recipe-soft)",
        title: "Recipe Coach",
        blurb: "Turns whatever's in the kitchen into healthy, family-safe meals — tuned to allergies, diet, and conditions.",
      },
      {
        to: "/finance",
        icon: PiggyBank,
        color: "var(--color-finance)",
        soft: "var(--color-finance-soft)",
        title: "Finance Coach",
        blurb: "Categorizes monthly spend, flags what's cuttable, and proposes a next-month budget in plain language.",
      },
    ],
  },
];

export default function Home() {
  let cardIndex = 0;
  return (
    <div>
      <img
        src={logo}
        alt="Saasta Software Services"
        className="animate-fade-up mb-5 h-12 w-12 rounded-2xl [box-shadow:var(--shadow-lifted)]"
      />
      <div
        className="animate-fade-up mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-brand)]"
        style={{ animationDelay: "60ms" }}
      >
        <Sparkle size={13} />
        AI Workspace
      </div>
      <h1
        className="animate-fade-up font-[family-name:var(--font-display)] text-[2.75rem] font-bold leading-[1.08] tracking-tight"
        style={{
          animationDelay: "110ms",
          background: "linear-gradient(120deg, var(--color-text), var(--color-brand) 130%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Good to see you.
      </h1>
      <p
        className="animate-fade-up mt-3 max-w-lg text-[15.5px] leading-relaxed text-[var(--color-text-dim)]"
        style={{ animationDelay: "160ms" }}
      >
        Eight specialist agents, one workspace. Every answer below is generated live by a real model call — nothing
        here is canned.
      </p>

      {groups.map((g) => (
        <div key={g.label} className="mt-10">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            {g.label}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {g.agents.map(({ to, icon: Icon, color, soft, title, blurb, highlight }) => {
              const delay = 200 + cardIndex * 60;
              cardIndex += 1;
              return (
              <Link key={to} to={to} className="group block">
                <Card
                  className="animate-fade-up flex h-full flex-col gap-5 p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:[box-shadow:var(--shadow-lifted)]"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <IconBadge icon={Icon} from={color} to={`color-mix(in srgb, ${color} 55%, white)`} />
                    {highlight && (
                      <span
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{ background: soft, color }}
                      >
                        <Star size={10} fill={color} strokeWidth={0} /> {highlight}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[var(--color-text)]">{title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-text-dim)]">{blurb}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text)]">
                    Open agent
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
