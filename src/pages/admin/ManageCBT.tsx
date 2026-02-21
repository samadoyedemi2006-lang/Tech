import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function ManageCBT() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ course: "", question: "", options: ["", "", "", ""], answer: 0 });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const data = await api.getCBTQuestions();
      setQuestions(data);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!form.course || !form.question || form.options.some((o) => !o)) {
      toast({ title: "Error", description: "Fill all fields", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      await api.addCBTQuestion(form);
      setForm({ course: "", question: "", options: ["", "", "", ""], answer: 0 });
      setShowForm(false);
      toast({ title: "Added", description: "Question added — students can now see it" });
      fetchItems();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCBTQuestion(id);
      toast({ title: "Deleted", description: "Question removed" });
      fetchItems();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage CBT Questions</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Add Question</Button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-5 mb-6 card-shadow space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Course</Label><Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="COM 111" /></div>
            <div><Label>Correct Answer (0-3)</Label><Input type="number" min={0} max={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: +e.target.value })} /></div>
          </div>
          <div><Label>Question</Label><Textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
          {form.options.map((opt, i) => (
            <div key={i}><Label>Option {i + 1}</Label><Input value={opt} onChange={(e) => { const o = [...form.options]; o[i] = e.target.value; setForm({ ...form, options: o }); }} /></div>
          ))}
          <Button onClick={handleAdd} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Save Question</Button>
        </div>
      )}

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q._id} className="bg-card border rounded-xl p-4 card-shadow flex items-start justify-between">
            <div>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{q.course}</span>
              <p className="font-medium mt-1">{q.question}</p>
              <p className="text-xs text-muted-foreground mt-1">Answer: {q.options[q.answer]}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(q._id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {questions.length === 0 && <p className="text-muted-foreground text-center py-8">No questions yet. Click "Add Question" to create one.</p>}
      </div>
    </div>
  );
}
