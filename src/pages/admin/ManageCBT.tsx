import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ManageCBT() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    course: "",
    question: "",
    options: ["", "", "", ""],
    answer: 0,
  });

  const load = async () => setItems(await api.getCBTQuestions());
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.addCBTQuestion(form);
    load();
  };

  return (
    <div>
      <Input placeholder="Course" onChange={e => setForm({ ...form, course: e.target.value })} />
      <Input placeholder="Question" onChange={e => setForm({ ...form, question: e.target.value })} />
      {form.options.map((o, i) => (
        <Input key={i} placeholder={`Option ${i + 1}`}
          onChange={e => {
            const opts = [...form.options];
            opts[i] = e.target.value;
            setForm({ ...form, options: opts });
          }} />
      ))}
      <Button onClick={add}>Add Question</Button>

      {items.map(q => (
        <div key={q._id} className="border p-3 flex justify-between">
          <span>{q.question}</span>
          <Button size="icon" variant="ghost"
            onClick={() => api.deleteCBTQuestion(q._id).then(load)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}