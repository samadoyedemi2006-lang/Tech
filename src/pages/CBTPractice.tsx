import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function CBTPractice() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [course, setCourse] = useState("All");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getCBTQuestions().then(setQuestions);
  }, []);

  const courses = ["All", ...Array.from(new Set(questions.map(q => q.course)))];
  const filtered = course === "All" ? questions : questions.filter(q => q.course === course);

  const score = filtered.reduce(
    (acc, q) => acc + (answers[q._id] === q.answer ? 1 : 0),
    0
  );

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">CBT Practice</h1>
        <Select value={course} onValueChange={(v) => { setCourse(v); setAnswers({}); setSubmitted(false); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.map((q, i) => (
        <div key={q._id} className="border rounded-xl p-5 mb-4">
          <p className="text-xs text-muted-foreground">{q.course}</p>
          <p className="font-medium mb-2">{i + 1}. {q.question}</p>

          {q.options.map((opt: string, oi: number) => {
            const selected = answers[q._id] === oi;
            const correct = submitted && oi === q.answer;
            const wrong = submitted && selected && oi !== q.answer;

            return (
              <button
                key={oi}
                onClick={() => !submitted && setAnswers({ ...answers, [q._id]: oi })}
                className={`block w-full text-left px-4 py-2 rounded border mb-1
                  ${correct ? "bg-success/10 border-success" :
                    wrong ? "bg-destructive/10 border-destructive" :
                    selected ? "bg-primary/10 border-primary" : "hover:bg-muted"}`}
              >
                {correct && <CheckCircle className="inline h-4 w-4 mr-1" />}
                {wrong && <XCircle className="inline h-4 w-4 mr-1" />}
                {opt}
              </button>
            );
          })}
        </div>
      ))}

      {filtered.length > 0 && (
        <Button onClick={() => setSubmitted(!submitted)}>
          {submitted ? "Retry" : "Submit"}
        </Button>
      )}

      {submitted && (
        <p className="mt-3 font-semibold">
          Score: {score}/{filtered.length}
        </p>
      )}
    </div>
  );
}