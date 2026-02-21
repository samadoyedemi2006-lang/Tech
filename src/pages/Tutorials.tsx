import { useState, useEffect } from "react";
import { BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Tutorials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    api.getTutorials()
      .then(setItems)
      .catch((e) => toast({ title: "Error", description: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Tutorials</h1>
      <p className="text-muted-foreground mb-6">Browse learning resources and tutorials</p>

      {items.length === 0 && <p className="text-muted-foreground text-center py-12">No tutorials available yet.</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <div key={t._id} className="bg-card border rounded-xl p-5 card-shadow">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-medium text-accent px-2 py-0.5 bg-accent/10 rounded-full">{t.category}</span>
                <h3 className="font-semibold mt-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                <a href={t.link} className="inline-flex items-center gap-1 text-sm text-primary mt-3 hover:underline">
                  View Tutorial <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
