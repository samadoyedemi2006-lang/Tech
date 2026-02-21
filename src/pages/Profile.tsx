import { useAuth } from "@/contexts/AuthContext";
import { User, Hash, GraduationCap, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const fields = [
    { icon: User, label: "Full Name", value: user?.fullName },
    { icon: Hash, label: "Matric Number", value: user?.matricNumber },
    { icon: GraduationCap, label: "Level", value: user?.level },
    { icon: Shield, label: "Role", value: user?.role },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-card border rounded-xl p-6 card-shadow max-w-lg">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.fullName}</h2>
            <p className="text-sm text-muted-foreground">{user?.matricNumber}</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <f.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="font-medium capitalize">{f.value || "—"}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
