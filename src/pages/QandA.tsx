import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageCircle, ThumbsUp, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function QandA() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });
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

  const handlePost = async () => {
    if (!form.title.trim() || !user) return;
    try {
      await api.postQuestion({ title: form.title.trim(), body: form.body.trim() });
      setForm({ title: "", body: "" });
      setShowForm(false);
      toast({ title: "Question posted!" });
      load();
    } catch {
      toast({ title: "Failed to post question", variant: "destructive" });
    }
  };

  const handleLike = async (qId: string) => {
    if (!user) return;
    try {
      const updated = await api.toggleLike(qId);
      setQuestions((prev) => prev.map((q) => (q._id === qId ? updated : q)));
    } catch {
      toast({ title: "Failed to like", variant: "destructive" });
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Q&A Forum</h1>
          <p className="text-muted-foreground">Ask and answer tech questions</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Ask Question"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-5 mb-6 card-shadow">
          <h3 className="font-semibold mb-3">Ask a Question</h3>
          <div className="space-y-3">
            <Input
              placeholder="Question title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Describe your question in detail..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
            <Button onClick={handlePost} disabled={!form.title.trim()}>Post Question</Button>
          </div>
        </div>
      )}

      {loading && <p className="text-center text-muted-foreground py-10">Loading questions...</p>}

      <div className="space-y-4">
        {!loading && questions.length === 0 && (
          <div className="text-center text-muted-foreground py-10">No questions yet. Be the first to ask!</div>
        )}
        {questions.map((q) => {
          const isExpanded = expandedId === q._id;
          const liked = user ? q.likes.includes(user._id) : false;
          return (
            <div key={q._id} className="bg-card border rounded-xl p-5 card-shadow">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">{q.title}</h3>
                  {q.body && <p className="text-sm text-muted-foreground mt-1">{q.body}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Asked by <span className="font-medium text-foreground">{q.author}</span> ·{" "}
                    {new Date(q.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleLike(q._id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"}`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" /> {q.likes.length} {q.likes.length === 1 ? "like" : "likes"}
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q._id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> {q.comments.length}{" "}
                      {q.comments.length === 1 ? "comment" : "comments"}
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      {q.comments.length === 0 && (
                        <p className="text-xs text-muted-foreground">No comments yet.</p>
                      )}
                      {q.comments.map((c: any) => (
                        <div key={c._id} className="bg-muted rounded-lg p-3">
                          <p className="text-sm">{c.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">{c.author}</span> ·{" "}
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {user && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            className="text-sm"
                            placeholder="Write a comment..."
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
                      )}
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
