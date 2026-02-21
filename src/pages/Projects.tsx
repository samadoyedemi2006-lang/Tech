import { useState, useEffect, useCallback } from "react";
import { Lightbulb } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch {
      toast({ title: "Failed to load projects", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">Project ideas shared by the admin</p>
      </div>

      {loading && <p className="text-center text-muted-foreground py-10">Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <div className="text-center text-muted-foreground py-10">No projects posted yet.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p._id} className="bg-card border rounded-xl p-5 card-shadow">
            <Lightbulb className="h-5 w-5 text-warning mb-3" />
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
            <p className="text-xs text-accent mt-2 font-medium">{p.tech}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
