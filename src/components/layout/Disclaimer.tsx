import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
  return (
    <footer className="border-t border-border bg-muted/30 px-4 md:px-8 py-4">
      <div className="flex items-start gap-3 text-xs text-muted-foreground max-w-5xl mx-auto">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
        <p>
          <span className="font-semibold text-foreground">Responsible AI Disclaimer:</span>{" "}
          AI-generated schedules, summaries, and recommendations are intended to assist users and
          may contain inaccuracies. Always verify important information before making decisions. The
          AI should not be relied upon for legal, medical, financial, or other high-stakes advice.
        </p>
      </div>
    </footer>
  );
}