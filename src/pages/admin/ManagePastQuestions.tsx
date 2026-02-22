import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function ManagePastQuestions() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", course: "", type: "PDF" });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const data = await api.getPastQuestions();
      setItems(data);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.course) {
      toast({ title: "Error", description: "Title and course are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("course", form.course);
      formData.append("type", form.type);
      if (file) formData.append("file", file);

      const token = localStorage.getItem("token");
      const res = await fetch("https://tech-backend-uyn5.onrender.com/api/past-questions", {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(err.message);
      }
      setForm({ title: "", course: "", type: "PDF" });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setShowForm(false);
      toast({ title: "Uploaded", description: "Past question saved successfully" });
      fetchItems();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deletePastQuestion(id);
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
        <h1 className="text-2xl font-bold">Manage Past Questions</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Upload
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-5 mb-6 card-shadow space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Title *</Label>
              <Input placeholder="e.g. COM 111 - 2024 Exam" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Course *</Label>
              <Input placeholder="e.g. COM 111" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            </div>
            <div>
              <Label>Type</Label>
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            </div>
          </div>

          <div>
            <Label>PDF File</Label>
            <div className="mt-1 flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors text-sm">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{file ? file.name : "Choose PDF file"}</span>
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
              {file && (
                <Button size="sm" variant="ghost" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="text-destructive text-xs">Remove</Button>
              )}
            </div>
          </div>

          <Button onClick={handleAdd} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Save Past Question</Button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t._id} className="bg-card border rounded-xl p-4 card-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="font-medium">{t.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {t.course} · {t.type}
                  {t.fileName && <span className="ml-1">· 📎 {t.fileName}</span>}
                </p>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No past questions uploaded yet.</p>}
      </div>
    </div>
  );
}
