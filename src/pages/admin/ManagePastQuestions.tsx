import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { api } from "@/lib/api";

export default function ManagePastQuestions() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", course: "", type: "PDF", url: "" });
  const [show, setShow] = useState(false);

  const load = async () => setItems(await api.getPastQuestions());
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.addPastQuestion(form);
    setForm({ title: "", course: "", type: "PDF", url: "" });
    setShow(false);
    load();
  };

  const del = async (id: string) => {
    await api.deletePastQuestion(id);
    load();
  };

  return (
    <div>
      <Button onClick={() => setShow(!show)}><Plus /> Upload</Button>
      {show && (
        <div className="space-y-2 mt-4">
          <Input placeholder="Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Course" value={form.course}
            onChange={e => setForm({ ...form, course: e.target.value })} />
          <Input placeholder="PDF URL" value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })} />
          <Button onClick={add}>Save</Button>
        </div>
      )}

      {items.map(p => (
        <div key={p._id} className="border p-3 flex justify-between">
          <span>{p.title}</span>
          <Button size="icon" variant="ghost" onClick={() => del(p._id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}