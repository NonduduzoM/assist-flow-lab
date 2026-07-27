import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Sparkles, Calendar, CalendarDays, Loader2 } from "lucide-react";
import { useTasks, useSchedules, type Priority, type Category, type Status } from "@/lib/store";
import { generateDailySchedule, generateWeeklySchedule } from "@/lib/ai-service";
import { AiOutputCard } from "@/components/AiOutputCard";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Nimbus" },
      {
        name: "description",
        content: "Create tasks and let the AI generate a balanced daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner — Nimbus" },
      {
        property: "og:description",
        content: "Plan your day and week with AI-generated schedules, priorities, and breaks.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [schedules, setSchedules] = useSchedules();
  const [prompt, setPrompt] = useState("");
  const [weeklyPrompt, setWeeklyPrompt] = useState("");
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingWeekly, setLoadingWeekly] = useState(false);

  const [form, setForm] = useState({
    title: "",
    priority: "medium" as Priority,
    category: "work" as Category,
    duration: 30,
    dueDate: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({
      title: form.title.trim(),
      priority: form.priority,
      category: form.category,
      duration: form.duration,
      dueDate: form.dueDate || undefined,
      status: "pending",
    });
    setForm({ ...form, title: "", duration: 30, dueDate: "" });
  };

  const genDaily = async () => {
    setLoadingDaily(true);
    try {
      const content = await generateDailySchedule(prompt, tasks);
      setSchedules((prev) => [
        {
          id: crypto.randomUUID(),
          prompt,
          content,
          createdAt: new Date().toISOString(),
          type: "daily",
        },
        ...prev,
      ]);
    } finally {
      setLoadingDaily(false);
    }
  };

  const genWeekly = async () => {
    setLoadingWeekly(true);
    try {
      const content = await generateWeeklySchedule(weeklyPrompt);
      setSchedules((prev) => [
        {
          id: crypto.randomUUID(),
          prompt: weeklyPrompt,
          content,
          createdAt: new Date().toISOString(),
          type: "weekly",
        },
        ...prev,
      ]);
    } finally {
      setLoadingWeekly(false);
    }
  };

  const latestDaily = schedules.find((s) => s.type === "daily");
  const latestWeekly = schedules.find((s) => s.type === "weekly");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Task Planner</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add tasks and generate balanced schedules with the AI planner.
        </p>
      </div>

      {/* AI Planner block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Daily planner</h2>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="What would you like to accomplish today?  e.g. 'I have 7 assignments, a meeting at 3 PM, and I need to exercise.'"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <button
            onClick={genDaily}
            disabled={loadingDaily}
            className="mt-3 btn-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-70"
          >
            {loadingDaily ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate schedule
          </button>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Weekly planner</h2>
          </div>
          <textarea
            value={weeklyPrompt}
            onChange={(e) => setWeeklyPrompt(e.target.value)}
            rows={4}
            placeholder="Describe your week's goals, deadlines, and constraints..."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <button
            onClick={genWeekly}
            disabled={loadingWeekly}
            className="mt-3 btn-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-70"
          >
            {loadingWeekly ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate weekly plan
          </button>
        </div>
      </div>

      {(loadingDaily || latestDaily) && (
        loadingDaily ? (
          <SkeletonCard />
        ) : latestDaily ? (
          <AiOutputCard
            title="Daily Schedule"
            content={latestDaily.content}
            timestamp={latestDaily.createdAt}
          />
        ) : null
      )}
      {(loadingWeekly || latestWeekly) && (
        loadingWeekly ? (
          <SkeletonCard />
        ) : latestWeekly ? (
          <AiOutputCard
            title="Weekly Plan"
            content={latestWeekly.content}
            timestamp={latestWeekly.createdAt}
          />
        ) : null
      )}

      {/* Add task form + list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form onSubmit={submit} className="card-elevated p-6 lg:col-span-1 space-y-3">
          <h2 className="text-base font-semibold">Add a task</h2>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Task title"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="grid grid-cols-2 gap-2">
            <Select
              label="Priority"
              value={form.priority}
              onChange={(v) => setForm({ ...form, priority: v as Priority })}
              options={[
                ["high", "High"],
                ["medium", "Medium"],
                ["low", "Low"],
              ]}
            />
            <Select
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v as Category })}
              options={[
                ["work", "Work"],
                ["study", "Study"],
                ["personal", "Personal"],
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Due date">
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="Duration (min)">
              <input
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          </div>
          <button
            type="submit"
            className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> Add task
          </button>
        </form>

        <div className="card-elevated p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Your tasks</h2>
            <span className="text-xs text-muted-foreground">{tasks.length} total</span>
          </div>
          {tasks.length === 0 ? (
            <div className="grid place-items-center py-12 text-center">
              <p className="text-sm text-muted-foreground">No tasks yet. Add one to get started.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 p-3 hover:border-primary/40 transition-colors"
                >
                  <div
                    className={`h-8 w-8 shrink-0 rounded-lg grid place-items-center text-xs font-semibold ${
                      t.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : t.priority === "medium"
                          ? "bg-warning/15 text-warning"
                          : "bg-info/15 text-info"
                    }`}
                    title={`${t.priority} priority`}
                  >
                    {t.priority[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {t.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {t.category} · {t.duration ?? 30}m
                      {t.dueDate ? ` · ${t.dueDate}` : ""}
                    </p>
                  </div>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      updateTask(t.id, { status: e.target.value as Status })
                    }
                    className="text-xs rounded-md border border-input bg-background px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function SkeletonCard() {
  return (
    <div className="card-elevated p-6 space-y-3 animate-pulse">
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-5/6 rounded bg-muted" />
      <div className="h-3 w-4/6 rounded bg-muted" />
      <div className="h-3 w-3/4 rounded bg-muted" />
    </div>
  );
}