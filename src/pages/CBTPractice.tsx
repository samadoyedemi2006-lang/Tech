import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function CBTPractice() {
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState("All");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.getCBTQuestions()
      .then(setAllQuestions)
      .catch((e) => toast({ title: "Error", description: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const courses = ["All", ...Array.from(new Set(allQuestions.map((q) => q.course)))];
  const questions = course === "All" ? allQuestions : allQuestions.filter((q) => q.course === course);
  const score = questions.reduce((acc, q) => acc + (answers[q._id] === q.answer ? 1 : 0), 0);

  const handleSubmit = () => setSubmitted(true);
  const handleReset = () => { setAnswers({}); setSubmitted(false); };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">CBT Practice</h1>
          <p className="text-muted-foreground">Test your knowledge with multiple choice questions</p>
        </div>
        <Select value={course} onValueChange={(v) => { setCourse(v); handleReset(); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {submitted && (
        <div className="bg-card border rounded-xl p-4 mb-6 card-shadow">
          <p className="text-lg font-semibold">Score: {score}/{questions.length} ({questions.length ? Math.round((score / questions.length) * 100) : 0}%)</p>
          <div className="w-full bg-muted rounded-full h-3 mt-2">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${questions.length ? (score / questions.length) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {questions.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No questions available yet. Check back later!</p>
      )}

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={q._id} className="bg-card border rounded-xl p-5 card-shadow">
            <p className="font-medium mb-1 text-xs text-muted-foreground">{q.course}</p>
            <p className="font-medium mb-3">{qi + 1}. {q.question}</p>
            <div className="grid gap-2">
              {q.options.map((opt: string, oi: number) => {
                const selected = answers[q._id] === oi;
                const isCorrect = submitted && oi === q.answer;
                const isWrong = submitted && selected && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    onClick={() => !submitted && setAnswers({ ...answers, [q._id]: oi })}
                    className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      isCorrect ? "bg-success/10 border-success text-success" :
                      isWrong ? "bg-destructive/10 border-destructive text-destructive" :
                      selected ? "bg-primary/10 border-primary text-primary" :
                      "hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {submitted && isCorrect && <CheckCircle className="h-4 w-4" />}
                      {submitted && isWrong && <XCircle className="h-4 w-4" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="flex gap-3 mt-6">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
              Submit Answers ({Object.keys(answers).length}/{questions.length})
            </Button>
          ) : (
            <Button onClick={handleReset}>Try Again</Button>
          )}
        </div>
      )}
    </div>
  );
}
