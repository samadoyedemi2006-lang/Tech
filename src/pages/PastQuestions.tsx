import { useState, useEffect } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function PastQuestions() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    api.getPastQuestions()
      .then(setItems)
      .catch((e) => toast({ title: "Error", description: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Past Questions</h1>
      <p className="text-muted-foreground mb-6">Access previous exam questions for revision</p>

      {items.length === 0 && <p className="text-muted-foreground text-center py-12">No past questions available yet.</p>}

      <div className="space-y-3">
        {items.map((pq) => (
          <div key={pq._id} className="bg-card border rounded-xl p-4 card-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="font-medium">{pq.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{pq.course}</span>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">{pq.type}</span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild>
              <a href={pq.url && pq.url !== "#" ? `https://tech-backend-uyn5.onrender.com${pq.url}` : "#"} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4 mr-1" /> Download
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
