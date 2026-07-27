import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nimbus" },
      {
        name: "description",
        content: "Customize theme, notifications, AI response length, and language preferences.",
      },
      { property: "og:title", content: "Settings — Nimbus" },
      {
        property: "og:description",
        content: "Personalize your Nimbus AI Workspace experience.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize your workspace and AI behavior.
        </p>
      </div>

      <div className="card-elevated divide-y divide-border">
        <Row
          title="Dark mode"
          hint="Switch between light and dark appearance."
          control={
            <Toggle
              on={settings.darkMode}
              onChange={(v) => setSettings((s) => ({ ...s, darkMode: v }))}
            />
          }
        />
        <Row
          title="Notifications"
          hint="Receive reminders and AI activity updates."
          control={
            <Toggle
              on={settings.notifications}
              onChange={(v) => setSettings((s) => ({ ...s, notifications: v }))}
            />
          }
        />
        <Row
          title="AI response length"
          hint="Choose how verbose the AI should be."
          control={
            <select
              value={settings.responseLength}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  responseLength: e.target.value as typeof settings.responseLength,
                }))
              }
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          }
        />
        <Row
          title="Language"
          hint="Preferred language for AI responses."
          control={
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  language: e.target.value as typeof settings.language,
                }))
              }
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          }
        />
      </div>

      <div className="card-elevated p-6">
        <h2 className="text-base font-semibold">About Nimbus</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Nimbus is a modern AI productivity workspace combining an intelligent task planner, a
          research assistant, and a workplace chatbot — all in one clean, focused surface.
        </p>
      </div>
    </div>
  );
}

function Row({
  title,
  hint,
  control,
}: {
  title: string;
  hint: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        on ? "bg-primary" : "bg-muted"
      }`}
      aria-pressed={on}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}