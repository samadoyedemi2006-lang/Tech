import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, ClipboardCheck, BookOpen,
  FileText, Lightbulb, Megaphone, LogOut, Menu, X, Shield, HelpCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const adminNav = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "CBT Questions", path: "/admin/cbt", icon: ClipboardCheck },
  { label: "Tutorials", path: "/admin/tutorials", icon: BookOpen },
  { label: "Past Questions", path: "/admin/past-questions", icon: FileText },
  { label: "Projects", path: "/admin/projects", icon: Lightbulb },
  { label: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { label: "Q&A Forum", path: "/admin/qa", icon: HelpCircle },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground">
        <div className="flex h-14 items-center px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden mr-2 text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/admin" className="flex items-center gap-2 font-bold text-sidebar-primary">
            <Shield className="h-6 w-6" />
            <span className="hidden sm:inline">Admin Panel</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-sidebar-foreground/70 hidden sm:inline">{user?.fullName}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1 text-sidebar-foreground hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:flex w-56 flex-col bg-sidebar text-sidebar-foreground min-h-[calc(100vh-3.5rem)] sticky top-14 border-r border-sidebar-border">
          <nav className="flex flex-col gap-1 p-3">
            {adminNav.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-foreground/20" />
            <aside
              className="absolute left-0 top-14 w-56 bg-sidebar min-h-[calc(100vh-3.5rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-1 p-3">
                {adminNav.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
