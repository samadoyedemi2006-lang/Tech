import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen, GraduationCap, Home, FileText, Lightbulb,
  Megaphone, HelpCircle, User, LogOut, Menu, X, ClipboardCheck
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "CBT Practice", path: "/cbt", icon: ClipboardCheck },
  { label: "Tutorials", path: "/tutorials", icon: BookOpen },
  { label: "Past Questions", path: "/past-questions", icon: FileText },
  { label: "Projects", path: "/projects", icon: Lightbulb },
  { label: "Announcements", path: "/announcements", icon: Megaphone },
  { label: "Q&A", path: "/qa", icon: HelpCircle },
  { label: "Profile", path: "/profile", icon: User },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-card card-shadow">
        <div className="flex h-14 items-center px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-primary">
            <GraduationCap className="h-6 w-6" />
            <span className="hidden sm:inline">TechCommunity</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.fullName}
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex w-56 flex-col border-r bg-card min-h-[calc(100vh-3.5rem)] sticky top-14">
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-foreground/20" />
            <aside
              className="absolute left-0 top-14 w-56 bg-card border-r min-h-[calc(100vh-3.5rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
