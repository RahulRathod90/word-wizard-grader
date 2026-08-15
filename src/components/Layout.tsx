import { Link, useLocation } from "react-router-dom";
import { BookOpen, PenTool, Lightbulb, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: BookOpen },
  { to: "/grade", label: "Grade Essay", icon: PenTool },
  { to: "/writing-tips", label: "Writing Tips", icon: Lightbulb },
  { to: "/progress", label: "My Progress", icon: TrendingUp },
  { to: "/how-it-works", label: "How It Works", icon: Info },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground tracking-tight">AEGS</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          Automatic Essay Grading System — NLP & Machine Learning Based Scoring
        </div>
      </footer>
    </div>
  );
}
