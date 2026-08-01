import type { ReactNode } from "react";
import { BookOpen, Lightbulb, Sigma, Workflow } from "lucide-react";
import { Card, Details, Tabs } from "./ui";
import type { Materials } from "../lib/api";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">{title}</h4>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm text-[var(--color-text-dim)]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function QAList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="flex flex-col gap-2.5 text-sm">
      {items.map((qa, i) => (
        <p key={i}>
          <span className="text-[var(--color-text)]">{qa.question}</span>
          <span className="text-[var(--color-text-dim)]"> — {qa.answer}</span>
        </p>
      ))}
    </div>
  );
}

function LearnTab({ m }: { m: Materials }) {
  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <BookOpen size={15} /> Chapter summary
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">{m.summary}</p>
      </Card>

      <Card className="p-5">
        <Section title="Important definitions">
          <div className="flex flex-col gap-2 text-sm">
            {m.definitions.map((d, i) => (
              <p key={i}>
                <span className="font-medium text-[var(--color-text)]">{d.term}</span>
                <span className="text-[var(--color-text-dim)]"> — {d.definition}</span>
              </p>
            ))}
          </div>
        </Section>
      </Card>

      {m.formulae.length > 0 && (
        <Card className="p-5">
          <Section title="Important formulae">
            <div className="flex flex-col gap-3 text-sm">
              {m.formulae.map((f, i) => (
                <div key={i}>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Sigma size={13} /> {f.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-[var(--color-brand)]">{f.formula}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-dim)]">{f.description}</p>
                </div>
              ))}
            </div>
          </Section>
        </Card>
      )}

      <Card className="p-5">
        <Section title="Diagrams (visualize / sketch)">
          <div className="flex flex-col gap-3">
            {m.diagrams.map((d, i) => (
              <div key={i} className="rounded-lg border border-dashed border-[var(--color-border)] p-3">
                <p className="text-sm font-medium">{d.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-dim)]">{d.description}</p>
              </div>
            ))}
          </div>
        </Section>
      </Card>

      <Card className="p-5">
        <Section title="Memory tricks / mnemonics">
          <div className="flex flex-col gap-2 text-sm">
            {m.mnemonics.map((mn, i) => (
              <p key={i} className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-finance)" }} />
                <span>
                  <span className="font-medium text-[var(--color-text)]">{mn.concept}:</span>{" "}
                  <span className="text-[var(--color-text-dim)]">{mn.trick}</span>
                </span>
              </p>
            ))}
          </div>
        </Section>
      </Card>

      <Card className="p-5">
        <Section title="Mind map">
          <div className="flex flex-col gap-3">
            {m.mindMap.map((mm, i) => (
              <div key={i}>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Workflow size={13} /> {mm.topic}
                </p>
                <ul className="mt-1 flex flex-col gap-0.5 pl-5 text-xs text-[var(--color-text-dim)]">
                  {mm.points.map((p, pi) => (
                    <li key={pi}>– {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </Card>
    </div>
  );
}

function ReviseTab({ m }: { m: Materials }) {
  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <Section title="10 key points">
          <BulletList items={m.keyPoints} />
        </Section>
      </Card>
      <Card className="p-5">
        <Section title="Revision notes">
          <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">{m.revisionNotes}</p>
        </Section>
      </Card>
      <Card className="p-5">
        <Section title="Common mistakes students make">
          <BulletList items={m.commonMistakes} />
        </Section>
      </Card>
      <Card className="p-5">
        <Section title="Last-minute exam tips">
          <BulletList items={m.lastMinuteExamTips} />
        </Section>
      </Card>
      <Card className="p-5">
        <Section title="Frequently asked examination questions">
          <QAList items={m.faqQuestions} />
        </Section>
      </Card>
    </div>
  );
}

function PracticeTab({ m }: { m: Materials }) {
  return (
    <div className="flex flex-col gap-3">
      <Details summary={`2-mark questions (${m.twoMarkQuestions.length})`}>
        <QAList items={m.twoMarkQuestions} />
      </Details>
      <Details summary={`3-mark questions (${m.threeMarkQuestions.length})`}>
        <QAList items={m.threeMarkQuestions} />
      </Details>
      <Details summary={`5-mark questions (${m.fiveMarkQuestions.length})`}>
        <QAList items={m.fiveMarkQuestions} />
      </Details>
      <Details summary={`MCQs (${m.mcqs.length})`}>
        <div className="flex flex-col gap-2 text-sm">
          {m.mcqs.map((q, i) => (
            <p key={i}>
              <span className="text-[var(--color-text)]">{q.question}</span>
              <span className="text-[var(--color-text-dim)]"> — {q.options[q.correctIndex]}</span>
            </p>
          ))}
        </div>
      </Details>
      <Details summary={`True / False (${m.trueFalse.length})`}>
        <div className="flex flex-col gap-2 text-sm">
          {m.trueFalse.map((q, i) => (
            <p key={i}>
              <span className="text-[var(--color-text)]">{q.statement}</span>
              <span className="text-[var(--color-text-dim)]"> — {q.answer ? "True" : "False"}</span>
            </p>
          ))}
        </div>
      </Details>
      <Details summary={`Fill in the blanks (${m.fillBlanks.length})`}>
        <div className="flex flex-col gap-2 text-sm">
          {m.fillBlanks.map((q, i) => (
            <p key={i}>
              <span className="text-[var(--color-text)]">{q.sentence}</span>
              <span className="text-[var(--color-text-dim)]"> — {q.answer}</span>
            </p>
          ))}
        </div>
      </Details>
      <Details summary={`One-word answers (${m.oneWordAnswers.length})`}>
        <QAList items={m.oneWordAnswers} />
      </Details>
      <Details summary="Match the following">
        <div className="grid grid-cols-2 gap-x-6 text-sm">
          <div>
            {m.matchTheFollowing.leftColumn.map((l, i) => (
              <p key={i} className="py-0.5 text-[var(--color-text)]">
                {i + 1}. {l}
              </p>
            ))}
          </div>
          <div>
            {m.matchTheFollowing.rightColumn.map((r, i) => (
              <p key={i} className="py-0.5 text-[var(--color-text-dim)]">
                {String.fromCharCode(65 + i)}. {r}
              </p>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">Answer key</p>
        <div className="mt-1 flex flex-col gap-0.5 text-xs text-[var(--color-text-dim)]">
          {m.matchTheFollowing.correctPairs.map((p, i) => (
            <p key={i}>
              {p.left} → {p.right}
            </p>
          ))}
        </div>
      </Details>
      <Details summary={`Case study questions (${m.caseStudyQuestions.length})`}>
        <div className="flex flex-col gap-3 text-sm">
          {m.caseStudyQuestions.map((cs, i) => (
            <div key={i}>
              <p className="text-[var(--color-text)]">{cs.scenario}</p>
              <ul className="mt-1 flex flex-col gap-0.5 pl-4 text-xs text-[var(--color-text-dim)]">
                {cs.questions.map((q, qi) => (
                  <li key={qi}>{qi + 1}. {q}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Details>
      <Details summary={`Assertion & Reason (${m.assertionReasonQuestions.length})`}>
        <div className="flex flex-col gap-3 text-sm">
          {m.assertionReasonQuestions.map((ar, i) => (
            <div key={i}>
              <p className="text-[var(--color-text)]">
                <span className="font-medium">A:</span> {ar.assertion}
              </p>
              <p className="text-[var(--color-text)]">
                <span className="font-medium">R:</span> {ar.reason}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-dim)]">
                {ar.correctOption} — {ar.explanation}
              </p>
            </div>
          ))}
        </div>
      </Details>
      <Details summary={`Application-based questions (${m.applicationQuestions.length})`}>
        <BulletList items={m.applicationQuestions} />
      </Details>
      <Details summary={`HOTS questions (${m.hotsQuestions.length})`}>
        <BulletList items={m.hotsQuestions} />
      </Details>
    </div>
  );
}

export default function MaterialsPanel({ materials }: { materials: Materials }) {
  return (
    <Tabs
      tabs={[
        { id: "learn", label: "Learn", content: <LearnTab m={materials} /> },
        { id: "revise", label: "Revise", content: <ReviseTab m={materials} /> },
        { id: "practice", label: "Practice bank", content: <PracticeTab m={materials} /> },
      ]}
    />
  );
}
