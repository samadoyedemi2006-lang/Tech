import { useAuth } from "@/contexts/AuthContext";
import { Megaphone, Hash, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { dataStore, Announcement } from "@/lib/dataStore";

export default function Dashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadAnnouncements = () => {
    setAnnouncements(dataStore.getAnnouncements());
  };

  useEffect(() => {
    loadAnnouncements();
    window.addEventListener("datastore-update", loadAnnouncements);
    return () => window.removeEventListener("datastore-update", loadAnnouncements);
  }, []);

  const priorityColor: Record<string, string> = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-chart-4/10 text-chart-4",
    low: "bg-chart-3/10 text-chart-3",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.fullName?.split(" ")[0]}! 👋</h1>
        <p className="text-muted-foreground">Here's your student dashboard</p>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <div className="stat-card flex items-center gap-3">
          <Hash className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Matric Number</p>
            <p className="text-sm font-bold">{user?.matricNumber || "—"}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Level</p>
            <p className="text-sm font-bold">{user?.level || "—"}</p>
          </div>
        </div>
      </div>

      {/* Latest Announcements */}
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Latest Announcements</h2>
      </div>

      {announcements.length === 0 ? (
        <div className="stat-card text-center py-8">
          <p className="text-muted-foreground">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="stat-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{a.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${priorityColor[a.priority] || "bg-muted text-muted-foreground"}`}>
                      {a.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                  {a.date && (
                    <p className="text-xs text-muted-foreground mt-2">{new Date(a.date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
