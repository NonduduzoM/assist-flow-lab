import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Sparkles, Loader2, GitCompare, Lightbulb } from "lucide-react";
import { runResearch, type ResearchAction } from "@/lib/ai-service";
import { useResearchHistory } from "@/lib/store";
import { AiOutputCard } from "@/components/AiOutputCard";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Nimbus" },
      {
        name: "description",
        content: "Summarize, explain, research, and compare any topic with the AI assistant.",
      },
      { property: "og:title", content: "Research Assistant — Nimbus" },
      {
        property: "og:description",
        content: "Deep AI-powered research: summaries, key points, pros/cons, and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

const actions: { key: ResearchAction; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "summarize", label: "Summarize", icon: BookOpen },
  { key: "explain", label: "Explain", icon: Lightbulb },
  { key: "research", label: "Research", icon: Sparkles },
  { key: "compare", label: "Compare", icon: GitCompare },
];

function ResearchPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<{ title: string; content: string; ts: string } | null>(
    null,
  );
  const [history, setHistory] = useResearchHistory();

  const run = async (action: ResearchAction) => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const content = await runResearch(input, action);
      const ts = new Date().toISOString();
      const title = `${action[0].toUpperCase() + action.slice(1)}: ${input.slice(0, 60)}`;
      setCurrent({ title, content, ts });
      setHistory((prev) => [
        { id: crypto.randomUUID(), query: input, action, result: content, createdAt: ts },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Research Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter a topic, article, or question — pick an action and let the AI do the heavy lifting.
        </p>
      </div>

      <div className="card-elevated p-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder="Enter a topic, article, or question..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.key}
              onClick={() => run(a.key)}
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:border-primary/50 hover:bg-accent transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <a.icon className="h-4 w-4" />}
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="card-elevated p-6 space-y-3 animate-pulse">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
          <div className="h-3 w-4/6 rounded bg-muted" />
        </div>
      )}
      {!loading && current && (
        <AiOutputCard title={current.title} content={current.content} timestamp={current.ts} />
      )}

      {history.length > 0 && (
        <div className="card-elevated p-6">
          <h2 className="text-base font-semibold mb-3">Recent research</h2>
          <ul className="space-y-2">
            {history.slice(0, 5).map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-border/60 p-3 hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() =>
                  setCurrent({
                    title: `${r.action[0].toUpperCase() + r.action.slice(1)}: ${r.query.slice(0, 60)}`,
                    content: r.result,
                    ts: r.createdAt,
                  })
                }
              >
                <p className="text-sm font-medium truncate">{r.query}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {r.action} · {new Date(r.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}