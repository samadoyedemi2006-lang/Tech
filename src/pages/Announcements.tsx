import { useState, useEffect } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Announcements() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    api.getAnnouncements()
      .then(setItems)
      .catch((e) => toast({ title: "Error", description: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Announcements</h1>
      <p className="text-muted-foreground mb-6">Stay updated with the latest news</p>

      {items.length === 0 && <p className="text-muted-foreground text-center py-12">No announcements yet.</p>}

      <div className="space-y-4">
        {items.map((a) => (
          <div key={a._id} className="bg-card border rounded-xl p-5 card-shadow">
            <div className="flex items-start gap-3">
              <Megaphone className={`h-5 w-5 mt-0.5 shrink-0 ${a.priority === "high" ? "text-destructive" : a.priority === "medium" ? "text-warning" : "text-primary"}`} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{a.title}</h3>
                  {a.priority === "high" && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Important</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                {a.createdAt && <p className="text-xs text-muted-foreground mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
