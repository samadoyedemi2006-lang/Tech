import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { api } from "@/lib/api";

export default function Announcements() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnouncements()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-10">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Announcements</h1>
      <p className="text-muted-foreground mb-6">Stay updated with the latest news</p>

      {items.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No announcements yet.</p>
      )}

      <div className="space-y-4">
        {items.map((a) => (
          <div key={a._id} className="bg-card border rounded-xl p-5 card-shadow">
            <div className="flex gap-3">
              <Megaphone className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                {a.createdAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}