import { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { YBOCS_META } from "../../data/entities";
import { baseUrl } from "../../lib/base";
import { Progress } from "../../components/ui/progress";
import { Checkbox } from "../../components/ui/checkbox";
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "../../Layouts/AppLayout";

/* Flow:
 *  step 0..9         -> Y-BOCS questions Q1..Q10 (from local entities.js, no API call)
 *  step 10..(10+O-1) -> Obsession checklist categories (one per screen)
 *  step (10+O)..end  -> Compulsion checklist categories (one per screen)
 *  submit on last step -> POST /assessments (Laravel route, redirects to the report page)
 */
export default function AssessmentFlow() {
  const { patient } = usePage().props;
  const meta = YBOCS_META;
  const [step, setStep] = useState(0);

  const [obsCurrent, setObsCurrent] = useState(new Set());
  const [obsPast, setObsPast] = useState(new Set());
  const [comCurrent, setComCurrent] = useState(new Set());
  const [comPast, setComPast] = useState(new Set());
  const [principalObs, setPrincipalObs] = useState("");
  const [principalCom, setPrincipalCom] = useState("");
  const [answers, setAnswers] = useState({});

  const [processing, setProcessing] = useState(false);

  const QUESTION_STEPS = 10;
  const O = meta.obsession_checklist.length;
  const C = meta.compulsion_checklist.length;
  const totalSteps = QUESTION_STEPS + O + C;
  const progress = ((step + 1) / totalSteps) * 100;

  const submit = () => {
    const ans = {};
    for (let i = 1; i <= 10; i++) ans[`q${i}`] = answers[`q${i}`] ?? 0;

    setProcessing(true);
    router.post(
      baseUrl("/assessments"),
      {
        patient_id: patient.id,
        obsessions_current: Array.from(obsCurrent),
        obsessions_past: Array.from(obsPast),
        compulsions_current: Array.from(comCurrent),
        compulsions_past: Array.from(comPast),
        principal_obsession: principalObs,
        principal_compulsion: principalCom,
        answers: ans,
      },
      {
        onSuccess: () => toast.success("Assessment saved"),
        onError: () => toast.error("Failed to save"),
        onFinish: () => setProcessing(false),
      }
    );
  };


  const allAnswered = useMemo(
    () => Array.from({ length: 10 }, (_, i) => `q${i + 1}`).every((k) => answers[k] !== undefined),
    [answers]
  );

  const isQuestion = step >= 0 && step <= 9;
  const isObsCat = step >= QUESTION_STEPS && step < QUESTION_STEPS + O;
  const isComCat = step >= QUESTION_STEPS + O && step < totalSteps;
  const isLast = step === totalSteps - 1;

  const currentQ = isQuestion ? meta.questions[step] : null;
  const obsCatIdx = isObsCat ? step - QUESTION_STEPS : null;
  const comCatIdx = isComCat ? step - QUESTION_STEPS - O : null;
  const currentCat = isObsCat
    ? meta.obsession_checklist[obsCatIdx]
    : isComCat
    ? meta.compulsion_checklist[comCatIdx]
    : null;
  const checklistKind = isObsCat ? "obsessions" : isComCat ? "compulsions" : null;

  const currentSet = isObsCat ? obsCurrent : comCurrent;
  const pastSet = isObsCat ? obsPast : comPast;
  const setCurrentSet = isObsCat ? setObsCurrent : setComCurrent;
  const setPastSet = isObsCat ? setObsPast : setComPast;
  const principal = isObsCat ? principalObs : principalCom;
  const setPrincipal = isObsCat ? setPrincipalObs : setPrincipalCom;

  const onToggle = (item, kind) => {
    const set = kind === "current" ? currentSet : pastSet;
    const setter = kind === "current" ? setCurrentSet : setPastSet;
    const next = new Set(set);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setter(next);
  };

  return (
    <div className="max-w-3xl mx-auto" data-testid="assessment-flow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
            Y-BOCS Assessment
          </div>
          <div className="font-display text-2xl" style={{ color: "var(--ink)" }}>{patient.name}</div>
        </div>
        <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Step {step + 1} of {totalSteps}
        </div>
      </div>
      <Progress value={progress} className="mb-8" />

      {currentQ && (
        <div className="card-warm p-8 fade-up" data-testid={`step-question-${currentQ.id}`}>
          <div className="text-xs uppercase tracking-widest mb-3"
               style={{ color: currentQ.section === "obsessions" ? "#C8612C" : "#8E3A1C" }}>
            {currentQ.section} · Question {currentQ.id}
          </div>
          <h2 className="font-display text-3xl mb-3" style={{ color: "var(--ink)" }}>{currentQ.title}</h2>
          <p className="mb-7 text-base" style={{ color: "var(--ink-soft)" }}>{currentQ.question}</p>

          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt) => {
              const selected = answers[`q${currentQ.id}`] === opt.value;
              return (
                <button
                  key={opt.value}
                  data-testid={`q${currentQ.id}-opt-${opt.value}`}
                  onClick={() => setAnswers({ ...answers, [`q${currentQ.id}`]: opt.value })}
                  className="text-left p-4 rounded-xl flex items-start gap-4 transition"
                  style={{
                    background: selected ? "var(--ink)" : "#FAF3E3",
                    color: selected ? "#FAF3E3" : "var(--ink)",
                    border: `1px solid ${selected ? "var(--ink)" : "var(--line)"}`,
                  }}
                >
                  <span className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-display text-lg"
                        style={{ background: selected ? "#FAF3E3" : "var(--cream-deep)", color: "var(--ink)" }}>
                    {opt.value}
                  </span>
                  <span className="text-sm pt-1.5">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <NavButtons
            step={step}
            isLast={isLast}
            canProceed={answers[`q${currentQ.id}`] !== undefined}
            allAnswered={allAnswered}
            submitting={processing}
            setStep={setStep}
            submit={submit}
            nextLabel={step === 9 ? "Continue to checklist" : "Next"}
          />
        </div>
      )}

      {currentCat && (
        <div className="card-warm p-8 fade-up" data-testid={`step-checklist-${checklistKind}-${obsCatIdx ?? comCatIdx}`}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--brick)" }}>
            Symptom checklist · {checklistKind}
          </div>
          <h2 className="font-display text-3xl mb-2" style={{ color: "var(--ink)" }}>{currentCat.category}</h2>
          <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
            Endorse <strong>current</strong> and <strong>past</strong> symptoms in this category. Star the principal one if applicable.
          </p>

          <ColumnLegend />
          <div className="flex flex-col">
            {currentCat.items.map((item) => {
              const isCur = currentSet.has(item);
              const isPast = pastSet.has(item);
              const isPrincipal = principal === item;
              const endorsed = isCur || isPast;
              return (
                <div
                  key={item}
                  data-testid={`checklist-${item.slice(0, 24)}`}
                  className="grid grid-cols-[1fr_72px_72px_28px] gap-3 items-center py-3 border-b last:border-0"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="text-sm" style={{ color: "var(--ink-soft)" }}>{item}</span>
                  <div className="flex justify-center">
                    <Checkbox checked={isCur} onCheckedChange={() => onToggle(item, "current")} />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox checked={isPast} onCheckedChange={() => onToggle(item, "past")} />
                  </div>
                  <div className="flex justify-center">
                    {endorsed ? (
                      <button
                        type="button"
                        onClick={() => setPrincipal(isPrincipal ? "" : item)}
                        className="opacity-60 hover:opacity-100"
                        title="Mark as principal"
                      >
                        <Star size={15} fill={isPrincipal ? "#C8612C" : "none"} color={isPrincipal ? "#C8612C" : "var(--ink-muted)"} />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <NavButtons
            step={step}
            isLast={isLast}
            canProceed={true}
            allAnswered={allAnswered}
            submitting={processing}
            setStep={setStep}
            submit={submit}
            nextLabel="Next category"
          />
        </div>
      )}
    </div>
  );
}

function NavButtons({ step, isLast, canProceed, allAnswered, submitting, setStep, submit, nextLabel }) {
  return (
    <div className="flex items-center justify-between mt-8">
      <button
        data-testid="prev-btn"
        onClick={() => setStep(Math.max(0, step - 1))}
        disabled={step === 0}
        className="text-sm flex items-center gap-2 disabled:opacity-30"
        style={{ color: "var(--ink-soft)" }}
      >
        <ChevronLeft size={16} /> Back
      </button>
      {isLast ? (
        <button
          data-testid="submit-assessment"
          onClick={submit}
          disabled={!allAnswered || submitting}
          className="btn-primary-warm inline-flex items-center gap-2 disabled:opacity-40"
        >
          {submitting ? "Generating report…" : <>Generate report <Sparkles size={16} /></>}
        </button>
      ) : (
        <button
          data-testid="next-btn"
          onClick={() => setStep(step + 1)}
          disabled={!canProceed}
          className="btn-primary-warm inline-flex items-center gap-2 disabled:opacity-40"
        >
          {nextLabel} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function ColumnLegend() {
  return (
    <div className="grid grid-cols-[1fr_72px_72px_28px] gap-3 items-center px-1 pb-2 border-b text-[10px] uppercase tracking-widest"
         style={{ color: "var(--ink-muted)", borderColor: "var(--line)" }}>
      <div>Symptom</div>
      <div className="text-center">Current</div>
      <div className="text-center">Past</div>
      <div></div>
    </div>
  );
}

AssessmentFlow.layout = (page) => <AppLayout>{page}</AppLayout>;
