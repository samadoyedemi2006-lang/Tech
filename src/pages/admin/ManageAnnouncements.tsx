import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function ManageAnnouncements() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "medium" });
  const { toast } = useToast();

  const load = async () => {
    try {
      setItems(await api.getAnnouncements());
    } catch {
      toast({ title: "Failed to load announcements", variant: "destructive" });
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    try {
      await api.addAnnouncement(form);
      setForm({ title: "", content: "", priority: "medium" });
      setShowForm(false);
      load();
      toast({ title: "Published" });
    } catch {
      toast({ title: "Publish failed", variant: "destructive" });
    }
  };

  const del = async (id: string) => {
    await api.deleteAnnouncement(id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Announcements</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {showForm && (
        <div className="border p-4 rounded-xl mb-4 space-y-3">
          <Input placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="Content" value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <Button onClick={add}>Publish</Button>
        </div>
      )}

      {items.map(a => (
        <div key={a._id} className="border p-3 rounded-xl flex justify-between">
          <div>
            <h3 className="font-medium">{a.title}</h3>
            <p className="text-xs">{a.content}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={() => del(a._id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}