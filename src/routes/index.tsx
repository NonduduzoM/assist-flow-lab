import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Sparkles,
  BookOpen,
  Bot,
  ArrowUpRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTasks, useChat, useResearchHistory } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nimbus AI Workspace" },
      {
        name: "description",
        content:
          "Your AI productivity dashboard: today's tasks, research summaries, chat activity, and quick actions.",
      },
      { property: "og:title", content: "Dashboard — Nimbus AI Workspace" },
      {
        property: "og:description",
        content: "Track tasks, research, and AI conversations from one clean workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tasks } = useTasks();
  const { messages } = useChat();
  const [research] = useResearchHistory();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    return { completed, pending, inProgress, total: tasks.length };
  }, [tasks]);

  const pieData = [
    { name: "Completed", value: stats.completed, color: "oklch(0.65 0.16 155)" },
    { name: "In Progress", value: stats.inProgress, color: "oklch(0.62 0.17 235)" },
    { name: "Pending", value: stats.pending, color: "oklch(0.75 0.16 75)" },
  ];

  const activityData = [
    { day: "Mon", tasks: 4, chats: 2 },
    { day: "Tue", tasks: 6, chats: 3 },
    { day: "Wed", tasks: 3, chats: 5 },
    { day: "Thu", tasks: 7, chats: 4 },
    { day: "Fri", tasks: 5, chats: 6 },
    { day: "Sat", tasks: 2, chats: 1 },
    { day: "Sun", tasks: 1, chats: 0 },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
            Good {greeting()} — here's your day
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link
          to="/planner"
          className="btn-gradient shrink-0 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
        >
          <Sparkles className="h-4 w-4" /> Generate schedule
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Tasks"
          value={stats.total}
          icon={ListTodo}
          hint={`${stats.inProgress} in progress`}
          tone="primary"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          hint="Great momentum"
          tone="success"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          hint="Awaiting focus time"
          tone="warning"
        />
        <StatCard
          label="AI Chats"
          value={messages.length}
          icon={Bot}
          hint="Assistant conversations"
          tone="info"
        />
      </div>

      {/* Charts + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Weekly activity</h2>
              <p className="text-xs text-muted-foreground">Tasks completed & AI conversations</p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 260 / 0.5)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="tasks" fill="oklch(0.52 0.22 271)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="chats" fill="oklch(0.62 0.17 235)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-base font-semibold">Task completion</h2>
          <p className="text-xs text-muted-foreground mb-4">Distribution by status</p>
          {stats.total > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No tasks yet" />
          )}
          <div className="mt-2 space-y-1.5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Upcoming tasks</h2>
            <Link
              to="/planner"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {tasks.length === 0 ? (
            <EmptyState message="No upcoming tasks. Add one to get started." />
          ) : (
            <ul className="space-y-2">
              {tasks
                .filter((t) => t.status !== "completed")
                .slice(0, 5)
                .map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:border-primary/40 transition-colors"
                  >
                    <div
                      className={`h-8 w-8 rounded-lg grid place-items-center text-xs font-semibold ${
                        t.priority === "high"
                          ? "bg-destructive/10 text-destructive"
                          : t.priority === "medium"
                            ? "bg-warning/15 text-warning"
                            : "bg-info/15 text-info"
                      }`}
                    >
                      {t.priority[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {t.category} · {t.duration ?? 30}m
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize hidden sm:inline">
                      {t.status.replace("-", " ")}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-base font-semibold mb-4">Quick actions</h2>
          <div className="space-y-2">
            <QuickAction to="/planner" icon={Plus} label="Add task" hint="Plan your day" />
            <QuickAction to="/planner" icon={Sparkles} label="AI schedule" hint="Auto-plan today" />
            <QuickAction to="/research" icon={BookOpen} label="New research" hint="Summarize a topic" />
            <QuickAction to="/chat" icon={Bot} label="Ask assistant" hint="Chat with AI" />
          </div>
        </div>
      </div>

      {/* Recent research + chats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-6">
          <h2 className="text-base font-semibold mb-4">Recent research</h2>
          {research.length === 0 ? (
            <EmptyState message="No research yet. Try the Research Assistant." />
          ) : (
            <ul className="space-y-2">
              {research.slice(0, 3).map((r) => (
                <li key={r.id} className="rounded-lg border border-border/60 p-3">
                  <p className="text-sm font-medium truncate">{r.query}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {r.action} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-base font-semibold mb-4">Recent AI chats</h2>
          <ul className="space-y-2">
            {messages.slice(-3).reverse().map((m) => (
              <li key={m.id} className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground capitalize mb-1">{m.role}</p>
                <p className="text-sm line-clamp-2">{m.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
  tone: "primary" | "success" | "warning" | "info";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/15 text-info",
  } as const;
  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className={`h-9 w-9 rounded-lg grid place-items-center ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:border-primary/40 hover:bg-accent/40 transition-all group"
    >
      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center group-hover:scale-105 transition-transform">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid place-items-center py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}