import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dataStore, type Tutorial } from "@/lib/dataStore";

export default function ManageTutorials() {
  const [items, setItems] = useState<Tutorial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", link: "" });
  const { toast } = useToast();

  useEffect(() => { setItems(dataStore.getTutorials()); }, []);

  const persist = (data: Tutorial[]) => { setItems(data); dataStore.setTutorials(data); };

  const handleAdd = () => {
    if (!form.title) { toast({ title: "Error", description: "Title required", variant: "destructive" }); return; }
    persist([...items, { ...form, id: Date.now().toString() }]);
    setForm({ title: "", description: "", category: "", link: "" });
    setShowForm(false);
    toast({ title: "Added", description: "Tutorial is now visible to students" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Tutorials</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      {showForm && (
        <div className="bg-card border rounded-xl p-5 mb-6 card-shadow space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          </div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Link</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
          <Button onClick={handleAdd}>Save</Button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="bg-card border rounded-xl p-4 card-shadow flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t.title}</h3>
              <p className="text-xs text-muted-foreground">{t.category} · {t.description}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => { persist(items.filter((i) => i.id !== t.id)); toast({ title: "Deleted" }); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No tutorials yet.</p>}
      </div>
    </div>
  );
}
