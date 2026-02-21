import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function PastQuestions() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.getPastQuestions().then(setItems);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Past Questions</h1>

      {items.map(pq => (
        <div key={pq._id} className="border rounded-xl p-4 mb-3 flex justify-between">
          <div className="flex gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">{pq.title}</h3>
              <p className="text-xs text-muted-foreground">{pq.course} · {pq.type}</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={pq.url} target="_blank">
              <Download className="h-4 w-4 mr-1" /> Download
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}