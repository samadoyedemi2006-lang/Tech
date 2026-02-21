import { useEffect, useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

export default function Tutorials() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.getTutorials().then(setItems);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tutorials</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map(t => (
          <div key={t._id} className="border rounded-xl p-5">
            <div className="flex gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-1" />
              <div>
                <span className="text-xs bg-accent/10 px-2 py-0.5 rounded">{t.category}</span>
                <h3 className="font-semibold mt-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                <a href={t.link} target="_blank" className="text-primary text-sm inline-flex gap-1 mt-2">
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}