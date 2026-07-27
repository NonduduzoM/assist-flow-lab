import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";

export function AiOutputCard({
  title,
  content,
  timestamp,
}: {
  title: string;
  content: string;
  timestamp?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          {timestamp && (
            <p className="text-xs text-muted-foreground">
              {new Date(timestamp).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-input px-2.5 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-md border border-input px-2.5 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
          >
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
      </div>
      <div className="p-5 max-h-[600px] overflow-y-auto">
        <MarkdownRender text={content} />
      </div>
    </div>
  );
}

// Minimal markdown-ish renderer: headings, bold, bullets, numbered, blank lines.
export function MarkdownRender({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (!listType || listBuffer.length === 0) return;
    const items = listBuffer.map((l, i) => (
      <li key={i} className="text-sm leading-relaxed">
        <InlineMd text={l} />
      </li>
    ));
    nodes.push(
      listType === "ul" ? (
        <ul key={nodes.length} className="list-disc pl-5 space-y-1 my-2">
          {items}
        </ul>
      ) : (
        <ol key={nodes.length} className="list-decimal pl-5 space-y-1 my-2">
          {items}
        </ol>
      ),
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (line.startsWith("### ")) {
      flushList();
      nodes.push(
        <h4 key={idx} className="mt-4 mb-1 text-sm font-semibold text-foreground">
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      flushList();
      nodes.push(
        <h3 key={idx} className="mt-4 mb-2 text-base font-semibold">
          {line.slice(3)}
        </h3>,
      );
    } else if (/^\s*[-•]\s+/.test(line)) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(line.replace(/^\s*[-•]\s+/, ""));
    } else if (/^\s*\d+\.\s+/.test(line)) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(line.replace(/^\s*\d+\.\s+/, ""));
    } else if (line.trim() === "") {
      flushList();
      nodes.push(<div key={idx} className="h-2" />);
    } else {
      flushList();
      nodes.push(
        <p key={idx} className="text-sm leading-relaxed my-1">
          <InlineMd text={line} />
        </p>,
      );
    }
  });
  flushList();

  return <div>{nodes}</div>;
}

function InlineMd({ text }: { text: string }) {
  // handle **bold** and _italic_
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <em key={key++} className="italic">
          {tok.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}