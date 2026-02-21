import { useState, useEffect,useCallback} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dataStore, type Announcement } from "@/lib/dataStore";
import { api } from "@/lib/api";

export default function ManageAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "medium" });
  const { toast } = useToast();

   const load = useCallback(async () => {
      try {
        const data = await api.getAnnouncements();
        setItems(data);
      } catch (error) {
        toast({ title: "Failed to load announcements", variant: "destructive" });
      }
    }, []);

    useEffect(
    () => { load(); }, 
   [load]);

  const persist = (data: Announcement[]) => { setItems(data); dataStore.setAnnouncements(data); };
  const handleAdd = async () => {
    if (!form.title) return;

    const newAnnouncement = { ...form, id: Date.now().toString(), date: new Date().toISOString().split("T")[0] };
    try {
      await api.addAnnouncement(newAnnouncement);
    } catch (error) {
      toast({ title: "Failed to add announcement", variant: "destructive" });
      return;
    }
    persist([...items, newAnnouncement]);
    setForm({ title: "", content: "", priority: "medium" });
    setShowForm(false);
    toast({ title: "Published", description: "All users can now see this announcement" });
  };

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
          <Button onClick={handleAdd}>Publish</Button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="bg-card border rounded-xl p-4 card-shadow flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{t.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>{t.priority}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t.content}</p>
              {t.date && <p className="text-xs text-muted-foreground mt-1">{new Date(t.date).toLocaleDateString()}</p>}
            </div>
            <Button size="icon" variant="ghost" onClick={() => { persist(items.filter((i) => i.id !== t.id)); toast({ title: "Deleted" }); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No announcements yet.</p>}
      </div>
    </div>
  );
}
