import { useEffect, useState, useCallback } from "react";

export type Priority = "high" | "medium" | "low";
export type Category = "work" | "study" | "personal";
export type Status = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  dueDate?: string;
  duration?: number; // minutes
  status: Status;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ResearchItem {
  id: string;
  query: string;
  action: string;
  result: string;
  createdAt: string;
}

export interface SchedulePlan {
  id: string;
  prompt: string;
  content: string;
  createdAt: string;
  type: "daily" | "weekly";
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// Seed data
const seedTasks: Task[] = [
  {
    id: "t1",
    title: "Prepare Q3 product roadmap",
    priority: "high",
    category: "work",
    status: "in-progress",
    duration: 90,
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Review AI research paper",
    priority: "medium",
    category: "study",
    status: "pending",
    duration: 60,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "Morning workout",
    priority: "low",
    category: "personal",
    status: "completed",
    duration: 45,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t4",
    title: "Team sync at 3 PM",
    priority: "high",
    category: "work",
    status: "pending",
    duration: 30,
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("apw.tasks", seedTasks);

  const addTask = useCallback(
    (t: Omit<Task, "id" | "createdAt">) =>
      setTasks((prev) => [
        { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ...prev,
      ]),
    [setTasks],
  );
  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    [setTasks],
  );
  const deleteTask = useCallback(
    (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    [setTasks],
  );

  return { tasks, addTask, updateTask, deleteTask };
}

export function useChat() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>("apw.chat", [
    {
      id: "m0",
      role: "assistant",
      content:
        "Hi! I'm your AI workplace assistant. Ask me to plan your day, summarize an article, or brainstorm ideas.",
      timestamp: new Date().toISOString(),
    },
  ]);
  return { messages, setMessages };
}

export function useResearchHistory() {
  return useLocalStorage<ResearchItem[]>("apw.research", []);
}

export function useSchedules() {
  return useLocalStorage<SchedulePlan[]>("apw.schedules", []);
}

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  responseLength: "short" | "medium" | "long";
  language: "en" | "es" | "fr" | "de";
}

export function useSettings() {
  return useLocalStorage<Settings>("apw.settings", {
    darkMode: false,
    notifications: true,
    responseLength: "medium",
    language: "en",
  });
}