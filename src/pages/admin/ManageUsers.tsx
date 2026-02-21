import { useState,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { api } from "@/lib/api";

const mockUsers = [
  { _id: "1", fullName: "John Doe", matricNumber: "CST/ND/22/001", level: "ND 1", role: "student" },
  { _id: "2", fullName: "Jane Smith", matricNumber: "CST/ND/22/002", level: "ND 2", role: "student" },
  { _id: "3", fullName: "Admin User", matricNumber: "CST/ND/20/001", level: "ND 2", role: "admin" },
  { _id: "4", fullName: "Mike Johnson", matricNumber: "CST/ND/23/005", level: "ND 1", role: "student" },
];



export default function ManageUsers() {
 const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { toast } = useToast();

  const promoteUser = (id: string) => {
    setUsers(users.map((u) => u._id === id ? { ...u, role: "admin" } : u));
    toast({ title: "Promoted", description: "User promoted to admin" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-card border rounded-xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Matric No.</th>
                <th className="text-left p-3 font-medium">Level</th>
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3 text-muted-foreground">{u.matricNumber}</td>
                  <td className="p-3">{u.level}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.role === "student" && (
                      <Button size="sm" variant="outline" onClick={() => promoteUser(u._id)} className="gap-1">
                        <Shield className="h-3 w-3" /> Promote
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
