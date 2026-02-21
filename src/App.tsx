import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CBTPractice from "./pages/CBTPractice";
import Tutorials from "./pages/Tutorials";
import PastQuestions from "./pages/PastQuestions";
import Projects from "./pages/Projects";
import Announcements from "./pages/Announcements";
import QandA from "./pages/QandA";
import StudentLayout from "./components/StudentLayout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCBT from "./pages/admin/ManageCBT";
import ManageTutorials from "./pages/admin/ManageTutorials";
import ManagePastQuestions from "./pages/admin/ManagePastQuestions";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManageQandA from "./pages/admin/ManageQandA";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Student routes */}
            <Route element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cbt" element={<CBTPractice />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/past-questions" element={<PastQuestions />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/qa" element={<QandA />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/cbt" element={<ManageCBT />} />
              <Route path="/admin/tutorials" element={<ManageTutorials />} />
              <Route path="/admin/past-questions" element={<ManagePastQuestions />} />
              <Route path="/admin/projects" element={<ManageProjects />} />
              <Route path="/admin/announcements" element={<ManageAnnouncements />} />
              <Route path="/admin/qa" element={<ManageQandA />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
