import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initial = [
  { id: "1", title: "Student Result System", description: "Build a result management system", tech: "React, Node.js" },
  { id: "2", title: "Library Management", description: "Digital library catalog", tech: "Python, Django" },
];

export default function ManageProjects() {
  const [items, setItems] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", tech: "" });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!form.title) return;
    setItems([...items, { ...form, id: Date.now().toString() }]);
    setForm({ title: "", description: "", tech: "" });
    setShowForm(false);
    toast({ title: "Added" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      {showForm && (
        <div className="bg-card border rounded-xl p-5 mb-6 card-shadow space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Technologies</Label><Input value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} /></div>
          </div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <Button onClick={handleAdd}>Save</Button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="bg-card border rounded-xl p-4 card-shadow flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t.title}</h3>
              <p className="text-xs text-muted-foreground">{t.tech} · {t.description}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => { setItems(items.filter((i) => i.id !== t.id)); toast({ title: "Deleted" }); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
