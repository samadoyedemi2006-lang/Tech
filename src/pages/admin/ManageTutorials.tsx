import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ManageTutorials() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", category: "", link: "" });

  const load = async () => setItems(await api.getTutorials());
  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.addTutorial(form);
    setForm({ title: "", description: "", category: "", link: "" });
    load();
  };

  return (
    <div>
      <Input placeholder="Title" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} />
      <Textarea placeholder="Description" value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })} />
      <Button onClick={add}>Add</Button>

      {items.map(t => (
        <div key={t._id} className="border p-3 flex justify-between">
          <span>{t.title}</span>
          <Button size="icon" variant="ghost" onClick={() => api.deleteTutorial(t._id).then(load)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}