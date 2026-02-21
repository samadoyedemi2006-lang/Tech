import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function ManageAnnouncements() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "medium" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const data = await api.getAnnouncements();
      setItems(data);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      await api.addAnnouncement(form);
      setForm({ title: "", content: "", priority: "medium" });
      setShowForm(false);
      toast({ title: "Published", description: "All users can now see this announcement" });
      fetchItems();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteAnnouncement(id);
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
        <h1 className="text-2xl font-bold">Manage Announcements</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      {showForm && (
        <div className="bg-card border rounded-xl p-5 mb-6 card-shadow space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Priority</Label><Input value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} placeholder="low / medium / high" /></div>
          </div>
          <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <Button onClick={handleAdd} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Publish</Button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t._id} className="bg-card border rounded-xl p-4 card-shadow flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{t.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>{t.priority}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t.content}</p>
              {t.createdAt && <p className="text-xs text-muted-foreground mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>}
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No announcements yet.</p>}
      </div>
    </div>
  );
}
