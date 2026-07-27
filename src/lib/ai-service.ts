// Mock AI service - replaceable with a real OpenAI/Lovable AI call.
// All functions return promises with simulated latency for a realistic feel.

import type { Task } from "./store";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateDailySchedule(prompt: string, tasks: Task[]): Promise<string> {
  await delay(1100);
  const pending = tasks.filter((t) => t.status !== "completed").slice(0, 6);
  const blocks = [
    { time: "08:00 – 09:30", label: pending[0]?.title ?? "Deep work block" },
    { time: "09:30 – 09:45", label: "Short break — stretch & hydrate" },
    { time: "09:45 – 11:30", label: pending[1]?.title ?? "Focused task session" },
    { time: "11:30 – 12:00", label: "Email & quick messages" },
    { time: "12:00 – 13:00", label: "Lunch & walk" },
    { time: "13:00 – 14:30", label: pending[2]?.title ?? "Creative work" },
    { time: "14:30 – 14:45", label: "Break — coffee" },
    { time: "14:45 – 15:30", label: "Meeting prep" },
    { time: "15:30 – 16:00", label: "Team meeting" },
    { time: "16:00 – 17:30", label: pending[3]?.title ?? "Wrap-up tasks" },
    { time: "17:30 – 18:00", label: "Review day & plan tomorrow" },
  ];
  const schedule = blocks.map((b) => `**${b.time}** — ${b.label}`).join("\n");
  return `### Daily Schedule\n\nBased on your goal: _"${prompt || "Maximize a productive day"}"_\n\n${schedule}\n\n### Priority Order\n1. High-impact deep work first (mornings)\n2. Meetings & communication mid-day\n3. Admin & wrap-up in the afternoon\n\n### Productivity Tips\n- Batch shallow tasks together to protect deep-work blocks.\n- Take a real 15-minute break after every 90-minute focus session.\n- End the day with a 5-minute review to reduce tomorrow's cognitive load.\n\n**Estimated completion:** ~9 hours of focused output.`;
}

export async function generateWeeklySchedule(prompt: string): Promise<string> {
  await delay(1300);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const themes = [
    "Deep work & planning",
    "Meetings & collaboration",
    "Creative / research",
    "Deep work & execution",
    "Review, ship & wrap-up",
    "Personal projects & learning",
    "Rest & light planning",
  ];
  const body = days
    .map((d, i) => `**${d}** — ${themes[i]}\n  • Morning: 2 focus blocks\n  • Afternoon: 1 collaboration block\n  • Evening: reflection`)
    .join("\n\n");
  return `### Weekly Plan\n\nGoal: _"${prompt || "Balanced, sustainable output"}"_\n\n${body}\n\n### Recommendations\n- Front-load your hardest work on Monday & Thursday.\n- Protect Wednesday for creative / research thinking.\n- Keep Sunday deliberately low-stakes for recovery.`;
}

export type ResearchAction = "summarize" | "explain" | "research" | "compare";

export async function runResearch(input: string, action: ResearchAction): Promise<string> {
  await delay(1200);
  const topic = input.trim() || "the given topic";
  const heading =
    action === "summarize"
      ? "Summary"
      : action === "explain"
        ? "Explanation"
        : action === "research"
          ? "Research Brief"
          : "Comparison";
  return `### ${heading}\n\nA concise overview of **${topic.slice(0, 120)}**.\n\n### Key Points\n- Foundational concept clearly defined and framed for a general reader.\n- Historical or contextual background summarized in 2–3 sentences.\n- Present-day relevance and typical applications.\n\n### Important Facts\n- Fact 1: A frequently cited statistic or milestone related to the topic.\n- Fact 2: A commonly misunderstood aspect worth clarifying.\n- Fact 3: A recent development or shift in the field.\n\n### Pros & Cons\n**Pros**\n- Broad applicability across domains.\n- Strong community and tooling.\n\n**Cons**\n- Requires careful evaluation for edge cases.\n- Ongoing debate about long-term implications.\n\n### Recommendations\n1. Start with an introductory overview from a reputable source.\n2. Compare 2–3 authoritative perspectives before forming an opinion.\n3. Apply the concept to a small experiment before scaling.\n\n### References\n- Foundational textbook / survey paper on the topic.\n- Recent review article (last 12 months).\n- Reputable news or industry analysis.\n\n_These are illustrative mock references — replace with real sources when integrating a live model._`;
}

export async function chatReply(userMessage: string): Promise<string> {
  await delay(900);
  const m = userMessage.toLowerCase();
  if (m.includes("plan") && m.includes("day")) {
    return "Sure — here's a suggested structure:\n\n1. **08:00–10:00** Deep work on your top priority\n2. **10:00–10:15** Break\n3. **10:15–12:00** Second focus block\n4. **12:00–13:00** Lunch\n5. **13:00–15:00** Meetings / collaboration\n6. **15:00–17:00** Admin, email, wrap-up\n\nWant me to tailor this to specific tasks?";
  }
  if (m.includes("summar")) {
    return "Paste the article or notes and I'll return a concise summary with key points, takeaways, and suggested next steps.";
  }
  if (m.includes("productiv")) {
    return "Three high-leverage habits:\n\n- **Time-block** your calendar the night before.\n- **Batch** shallow tasks (email, Slack) into 2 windows/day.\n- **Weekly review**: 30 minutes every Friday to reset priorities.";
  }
  if (m.includes("research") || m.includes("ai")) {
    return "Recent AI research trends worth tracking:\n\n- Small, specialized models fine-tuned for domain workflows.\n- Agentic systems combining tool use + long-horizon planning.\n- Evaluation frameworks focused on reliability, not just capability.";
  }
  return `Here's a thoughtful take on: _"${userMessage.slice(0, 140)}"_.\n\nI'd approach this by breaking it into clear steps, identifying the highest-leverage action first, and iterating with quick feedback loops. Want me to expand on any part?`;
}