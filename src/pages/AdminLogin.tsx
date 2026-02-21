import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function AdminLogin() {
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await api.login({ matricNumber, password });
      if (user.role !== "admin") {
        toast({ title: "Access Denied", description: "This login is for admins only", variant: "destructive" });
        return;
      }
      login(token, user);
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold mt-4">Admin Login</h1>
          <p className="text-muted-foreground mt-1">Sign in to admin panel</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4 card-shadow">
          <div className="space-y-2">
            <Label htmlFor="matric">Matric Number</Label>
            <Input id="matric" value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In as Admin"}
          </Button>
          <p className="text-center text-sm">
            <Link to="/login" className="text-muted-foreground hover:text-primary hover:underline">← Student Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
