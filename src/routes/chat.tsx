import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Bot, User, Sparkles } from "lucide-react";
import { useChat } from "@/lib/store";
import { chatReply } from "@/lib/ai-service";
import { MarkdownRender } from "@/components/AiOutputCard";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Nimbus" },
      {
        name: "description",
        content: "Chat with your AI workplace assistant to plan, summarize, and brainstorm.",
      },
      { property: "og:title", content: "AI Chatbot — Nimbus" },
      {
        property: "og:description",
        content: "A workplace chatbot that helps you plan your day and think through problems.",
      },
    ],
  }),
  component: ChatPage,
});

const prompts = [
  "Plan my day",
  "Summarize this article",
  "How can I improve productivity?",
  "What are the key findings of AI research?",
];

function ChatPage() {
  const { messages, setMessages } = useChat();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || typing) return;
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const reply = await chatReply(content);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setTyping(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const clear = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Chat cleared. What would you like to work on next?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-14rem)] flex flex-col">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mb-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">AI Chatbot</h1>
          <p className="text-sm text-muted-foreground">Your on-demand workplace assistant.</p>
        </div>
        <button
          onClick={clear}
          className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div className="card-elevated flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 animate-fade-in ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`h-8 w-8 shrink-0 rounded-full grid place-items-center ${
                  m.role === "user"
                    ? "btn-gradient"
                    : "bg-accent text-accent-foreground border border-border"
                }`}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted/60 rounded-tl-sm"
                }`}
              >
                <MarkdownRender text={m.content} />
                <p
                  className={`text-[10px] mt-1 ${m.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 animate-fade-in">
              <div className="h-8 w-8 rounded-full bg-accent border border-border grid place-items-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <Dot />
                  <Dot delay="0.15s" />
                  <Dot delay="0.3s" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3 md:p-4 space-y-3">
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-3 py-1 text-xs font-medium hover:border-primary/50 hover:bg-accent transition-all"
                >
                  <Sparkles className="h-3 w-3 text-primary" /> {p}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Message the assistant..."
              className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 max-h-32"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="btn-gradient shrink-0 grid place-items-center h-10 w-10 rounded-lg disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}