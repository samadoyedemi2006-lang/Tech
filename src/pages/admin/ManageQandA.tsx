import { useState, useEffect, useCallback } from "react";
import { HelpCircle, MessageCircle, ThumbsUp, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function ManageQandA() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const data = await api.getQA();
      setQuestions(data);
    } catch {
      toast({ title: "Failed to load questions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const deleteQuestion = async (qId: string) => {
    try {
      await api.deleteQuestion(qId);
      setQuestions((prev) => prev.filter((q) => q._id !== qId));
      toast({ title: "Question deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const deleteComment = async (qId: string, cId: string) => {
    try {
      const updated = await api.deleteComment(qId, cId);
      setQuestions((prev) => prev.map((q) => (q._id === qId ? updated : q)));
      toast({ title: "Comment deleted" });
    } catch {
      toast({ title: "Failed to delete comment", variant: "destructive" });
    }
  };

  const handleComment = async (qId: string) => {
    if (!user || !commentTexts[qId]?.trim()) return;
    try {
      const updated = await api.addComment(qId, commentTexts[qId].trim());
      setQuestions((prev) => prev.map((q) => (q._id === qId ? updated : q)));
      setCommentTexts((prev) => ({ ...prev, [qId]: "" }));
    } catch {
      toast({ title: "Failed to post comment", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Q&A</h1>
        <p className="text-muted-foreground">View, comment, and moderate student questions</p>
      </div>

      {loading && <p className="text-center text-muted-foreground py-10">Loading questions...</p>}

      {!loading && questions.length === 0 && (
        <div className="text-center text-muted-foreground py-10">No questions posted yet.</div>
      )}

      <div className="space-y-4">
        {questions.map((q) => {
          const isExpanded = expandedId === q._id;
          return (
            <div key={q._id} className="bg-card border rounded-xl p-5 card-shadow">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{q.title}</h3>
                      {q.body && <p className="text-sm text-muted-foreground mt-1">{q.body}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        Asked by <span className="font-medium text-foreground">{q.author}</span> ·{" "}
                        {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive shrink-0"
                      onClick={() => deleteQuestion(q._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="h-3.5 w-3.5" /> {q.likes.length} likes
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q._id)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      {q.comments.length} comments — {isExpanded ? "Hide" : "View & Reply"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      {q.comments.length === 0 && (
                        <p className="text-xs text-muted-foreground">No comments yet.</p>
                      )}
                      {q.comments.map((c: any) => (
                        <div
                          key={c._id}
                          className="bg-muted rounded-lg p-3 flex items-start justify-between gap-2"
                        >
                          <div>
                            <p className="text-sm">{c.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">{c.author}</span> ·{" "}
                              {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive shrink-0 h-7 w-7"
                            onClick={() => deleteComment(q._id, c._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <Input
                          className="text-sm"
                          placeholder="Reply as admin..."
                          value={commentTexts[q._id] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({ ...prev, [q._id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleComment(q._id);
                          }}
                        />
                        <Button size="icon" variant="outline" onClick={() => handleComment(q._id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
