import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function ManageTutorials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", link: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const data = await api.getTutorials();
      setItems(data);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!form.title) { toast({ title: "Error", description: "Title required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await api.addTutorial(form);
      setForm({ title: "", description: "", category: "", link: "" });
      setShowForm(false);
      toast({ title: "Added", description: "Tutorial is now visible to students" });
      fetchItems();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTutorial(id);
      toast({ title: "Deleted" });
      fetchItems();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

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
          <Button onClick={handleAdd} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Save</Button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t._id} className="bg-card border rounded-xl p-4 card-shadow flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t.title}</h3>
              <p className="text-xs text-muted-foreground">{t.category} · {t.description}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No tutorials yet.</p>}
      </div>
    </div>
  );
}
