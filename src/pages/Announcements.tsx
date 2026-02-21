import { useState, useEffect, useCallback } from "react";
import { Megaphone } from "lucide-react";
import { dataStore, type Announcement } from "@/lib/dataStore";

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);

  const reload = useCallback(() => setItems(dataStore.getAnnouncements()), []);

  useEffect(() => {
    reload();
    window.addEventListener("datastore-update", reload);
    return () => window.removeEventListener("datastore-update", reload);
  }, [reload]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Announcements</h1>
      <p className="text-muted-foreground mb-6">Stay updated with the latest news</p>

      {items.length === 0 && <p className="text-muted-foreground text-center py-12">No announcements yet.</p>}

      <div className="space-y-4">
        {items.map((a) => (
          <div key={a.id} className="bg-card border rounded-xl p-5 card-shadow">
            <div className="flex items-start gap-3">
              <Megaphone className={`h-5 w-5 mt-0.5 shrink-0 ${a.priority === "high" ? "text-destructive" : a.priority === "medium" ? "text-warning" : "text-primary"}`} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{a.title}</h3>
                  {a.priority === "high" && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Important</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                {a.date && <p className="text-xs text-muted-foreground mt-2">{new Date(a.date).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
