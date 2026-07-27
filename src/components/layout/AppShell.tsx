import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  BookOpen,
  Bot,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useSettings } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Disclaimer } from "./Disclaimer";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarInner pathname={pathname} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4">
              <Brand />
              <button
                aria-label="Close menu"
                className="rounded-md p-2 hover:bg-sidebar-accent"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarInner pathname={pathname} hideBrand />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top nav */}
        <header className="sticky top-0 z-40 glass border-b border-border">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button
              className="md:hidden rounded-md p-2 hover:bg-accent"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tasks, research, chats..."
                className="w-full rounded-lg border border-input bg-background/60 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                className="relative rounded-md p-2 hover:bg-accent transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
                className="rounded-md p-2 hover:bg-accent transition-colors"
                aria-label="Toggle dark mode"
              >
                {settings.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="ml-2 h-9 w-9 rounded-full btn-gradient grid place-items-center text-sm font-semibold">
                AI
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>

        <Disclaimer />
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-xl btn-gradient grid place-items-center">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold tracking-tight">Nimbus</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          AI Workspace
        </span>
      </div>
    </Link>
  );
}

function SidebarInner({ pathname, hideBrand }: { pathname: string; hideBrand?: boolean }) {
  return (
    <>
      {!hideBrand && (
        <div className="p-5">
          <Brand />
        </div>
      )}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
        <p className="text-xs font-semibold text-foreground">Nimbus Pro</p>
        <p className="text-xs text-muted-foreground mt-1">
          Unlock unlimited AI planning & deeper research.
        </p>
        <button className="mt-3 w-full btn-gradient rounded-md py-1.5 text-xs font-medium">
          Upgrade
        </button>
      </div>
    </>
  );
}