import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Calendar, BookOpen, MessageSquare, Trash2 } from "lucide-react";
import { useChat, useResearchHistory, useSchedules } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Nimbus" },
      {
        name: "description",
        content: "Browse and search past AI schedules, research summaries, and chat conversations.",
      },
      { property: "og:title", content: "History — Nimbus" },
      {
        property: "og:description",
        content: "Search across your AI activity: schedules, research, and chats.",
      },
    ],
  }),
  component: HistoryPage,
});

type Tab = "schedules" | "research" | "chats";

function HistoryPage() {
  const [schedules, setSchedules] = useSchedules();
  const [research, setResearch] = useResearchHistory();
  const { messages, setMessages } = useChat();
  const [tab, setTab] = useState<Tab>("schedules");
  const [q, setQ] = useState("");

  const filteredSchedules = useMemo(
    () =>
      schedules.filter(
        (s) =>
          s.prompt.toLowerCase().includes(q.toLowerCase()) ||
          s.content.toLowerCase().includes(q.toLowerCase()),
      ),
    [schedules, q],
  );
  const filteredResearch = useMemo(
    () =>
      research.filter(
        (r) =>
          r.query.toLowerCase().includes(q.toLowerCase()) ||
          r.result.toLowerCase().includes(q.toLowerCase()),
      ),
    [research, q],
  );
  const filteredChats = useMemo(
    () => messages.filter((m) => m.content.toLowerCase().includes(q.toLowerCase())),
    [messages, q],
  );

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
    { key: "schedules", label: "Schedules", icon: Calendar, count: schedules.length },
    { key: "research", label: "Research", icon: BookOpen, count: research.length },
    { key: "chats", label: "Chats", icon: MessageSquare, count: messages.length },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search across your AI schedules, research summaries, and conversations.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search history..."
          className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                active
                  ? "btn-gradient"
                  : "border border-input bg-background hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
              <span className={`text-xs ${active ? "opacity-80" : "text-muted-foreground"}`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {tab === "schedules" &&
          (filteredSchedules.length === 0 ? (
            <Empty label="No schedules found." />
          ) : (
            filteredSchedules.map((s) => (
              <Item
                key={s.id}
                title={`${s.type === "daily" ? "Daily" : "Weekly"} schedule`}
                subtitle={s.prompt || "(no prompt)"}
                meta={new Date(s.createdAt).toLocaleString()}
                onDelete={() => setSchedules((prev) => prev.filter((x) => x.id !== s.id))}
              />
            ))
          ))}
        {tab === "research" &&
          (filteredResearch.length === 0 ? (
            <Empty label="No research found." />
          ) : (
            filteredResearch.map((r) => (
              <Item
                key={r.id}
                title={r.query}
                subtitle={r.action}
                meta={new Date(r.createdAt).toLocaleString()}
                onDelete={() => setResearch((prev) => prev.filter((x) => x.id !== r.id))}
              />
            ))
          ))}
        {tab === "chats" &&
          (filteredChats.length === 0 ? (
            <Empty label="No chat messages found." />
          ) : (
            filteredChats.map((m) => (
              <Item
                key={m.id}
                title={m.role === "user" ? "You" : "Assistant"}
                subtitle={m.content}
                meta={new Date(m.timestamp).toLocaleString()}
                onDelete={() => setMessages((prev) => prev.filter((x) => x.id !== m.id))}
              />
            ))
          ))}
      </div>
    </div>
  );
}

function Item({
  title,
  subtitle,
  meta,
  onDelete,
}: {
  title: string;
  subtitle: string;
  meta: string;
  onDelete: () => void;
}) {
  return (
    <div className="card-elevated p-4 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 capitalize-first">
          {subtitle}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{meta}</p>
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="card-elevated p-10 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}