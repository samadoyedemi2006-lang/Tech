import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, ClipboardCheck, Users, ArrowRight, Mail, MapPin, Code, Heart } from "lucide-react";
import developerImg from "@/assets/developer-placeholder.jpg";

const features = [
  { icon: ClipboardCheck, title: "CBT Practice", desc: "Practice with course-based MCQs and get instant feedback", link: "/cbt" },
  { icon: BookOpen, title: "Tutorials & Resources", desc: "Access tutorials, past questions, and project ideas", link: "/tutorials" },
  { icon: Users, title: "Tech Community", desc: "Connect with peers, ask questions, and stay updated", link: "/qa" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary">
            <GraduationCap className="h-6 w-6" />
            TechCommunity
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Departmental Tech Community
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Your one-stop platform for CBT practice, learning resources, past questions, and connecting with your tech community.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">About This Platform</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            This platform was built to bridge the gap between students and learning resources. It provides a centralized hub where students can access CBT practice tests, past examination questions, tutorials, project ideas, and connect with their peers — all in one place.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-xl p-6 text-center card-shadow">
              <ClipboardCheck className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Practice & Prepare</h3>
              <p className="text-sm text-muted-foreground">Take CBT practice tests with instant feedback to prepare for your exams confidently.</p>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center card-shadow">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Learn & Grow</h3>
              <p className="text-sm text-muted-foreground">Access curated tutorials, past questions, and resources to enhance your knowledge.</p>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center card-shadow">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Connect & Collaborate</h3>
              <p className="text-sm text-muted-foreground">Ask questions, share ideas, and stay updated with announcements from your community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((f) => (
              <Link key={f.title} to={f.link} className="stat-card group cursor-pointer">
                <f.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why I Built This */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Why I Built This</h2>
          <p className="text-muted-foreground leading-relaxed">
            As a student, I realized how scattered academic resources are — past questions shared on WhatsApp groups get lost, tutorials are hard to find, and there's no central place to ask questions or practice for exams. I built this platform to solve that problem and give every student in the department easy access to everything they need to succeed academically and grow technically.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Meet the Developer</h2>
          <div className="bg-card border rounded-2xl p-8 card-shadow flex flex-col md:flex-row items-center gap-8">
            <img
              src={developerImg}
              alt="Developer"
              className="w-36 h-36 rounded-full object-cover border-4 border-primary/20 shrink-0"
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">Developer Name</h3>
              <p className="text-primary font-medium text-sm mb-3">Full-Stack Developer & Student</p>
              <p className="text-muted-foreground text-sm mb-4">
                Passionate about building tools that make learning easier and more accessible. This platform is a personal project aimed at helping fellow students in the department.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 justify-center md:justify-start text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>developer@example.com</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Computer Science Department, University</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start text-muted-foreground">
                  <Code className="h-4 w-4 text-primary" />
                  <span>React · Node.js · MongoDB · TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Departmental Tech Community. All rights reserved.</p>
      </footer>
    </div>
  );
}
