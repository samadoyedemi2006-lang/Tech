import { Users, ClipboardCheck, BookOpen, FileText, Lightbulb, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { dataStore } from "@/lib/dataStore";

const quickLinks = [
  { label: "Manage Users", path: "/admin/users", icon: Users },
  { label: "CBT Questions", path: "/admin/cbt", icon: ClipboardCheck },
  { label: "Tutorials", path: "/admin/tutorials", icon: BookOpen },
  { label: "Past Questions", path: "/admin/past-questions", icon: FileText },
  { label: "Projects", path: "/admin/projects", icon: Lightbulb },
  { label: "Announcements", path: "/admin/announcements", icon: Megaphone },
];

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalCBT: number;
  totalPastQuestions: number;
  totalTutorials: number;
  totalAnnouncements: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalCBT: 0,
    totalPastQuestions: 0,
    totalTutorials: 0,
    totalAnnouncements: 0,
  });

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch {
      // Fallback to localStorage if backend is unavailable
      setStats({
        totalUsers: 0,
        totalStudents: 0,
        totalAdmins: 0,
        totalCBT: dataStore.getCBT().length,
        totalPastQuestions: dataStore.getPastQuestions().length,
        totalTutorials: dataStore.getTutorials().length,
        totalAnnouncements: dataStore.getAnnouncements().length,
      });
    }
  };

  useEffect(() => {
    loadStats();
    window.addEventListener("datastore-update", loadStats);
    return () => window.removeEventListener("datastore-update", loadStats);
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-primary" },
    { label: "Students", value: stats.totalStudents, icon: Users, color: "text-accent" },
    { label: "Admins", value: stats.totalAdmins, icon: Users, color: "text-chart-4" },
    { label: "CBT Questions", value: stats.totalCBT, icon: ClipboardCheck, color: "text-chart-3" },
    { label: "Past Questions", value: stats.totalPastQuestions, icon: FileText, color: "text-chart-2" },
    { label: "Tutorials", value: stats.totalTutorials, icon: BookOpen, color: "text-chart-1" },
    { label: "Announcements", value: stats.totalAnnouncements, icon: Megaphone, color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <s.icon className={`h-8 w-8 ${s.color} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <Link key={item.path} to={item.path} className="stat-card group cursor-pointer">
            <item.icon className="h-6 w-6 text-primary mb-2" />
            <p className="font-medium text-sm">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
