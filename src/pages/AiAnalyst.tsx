import { useState } from "react";
import { Send, Bot, User as UserIcon, Sparkles, Loader2, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/Card";
import { useQueryParams } from "../hooks/useQueryParams";
import { useToast } from "../context/ToastContext";
import { aiApi } from "../services";
import { errorMessage } from "../services/api";
import type { AiChatMessage } from "../types";

interface ChatBubble {
  id: string;
  sender: "user" | "ai";
  text?: string;
  data?: AiChatMessage;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "How is my website performing?",
  "Why did traffic drop yesterday?",
  "What are my best-performing pages?",
  "Which traffic source generates the most visitors?",
  "Which traffic source generates the most conversions?",
  "What should I improve first?",
  "Why are mobile conversions lower?",
  "Summarize my last 30 days.",
];

export default function AiAnalyst() {
  const p = useQueryParams();
  const { toast } = useToast();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: "init_1",
      sender: "ai",
      text: "Hello! I am your AI Analytics Analyst. Ask me any question about your website traffic, conversion funnels, top pages, or recent changes.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  async function ask(questionText: string) {
    const q = questionText.trim();
    if (!q || loading || !p.websiteId) return;

    const userMsg: ChatBubble = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiApi.chat({
        websiteId: p.websiteId,
        question: q,
        startDate: p.startDate,
        endDate: p.endDate,
      });

      const aiMsg: ChatBubble = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        data: res,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      toast(errorMessage(err), "error");
      const errMsg: ChatBubble = {
        id: `ai_err_${Date.now()}`,
        sender: "ai",
        text: "AI Analyst service is temporarily offline, but your verified analytics data is active. Please check back shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="AI Analytics Analyst"
        subtitle="Ask natural-language questions about your traffic, content performance, and conversions"
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200">
            <Sparkles className="h-3.5 w-3.5" /> AI Engine Active
          </span>
        }
      />

      {/* Suggested Questions Grid */}
      <Card title="Suggested Questions">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 transition"
              onClick={() => ask(q)}
              disabled={loading}
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              {q}
            </button>
          ))}
        </div>
      </Card>

      {/* Chat Conversation Box */}
      <Card>
        <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-4 text-sm ${
                  m.sender === "user"
                    ? "bg-brand-600 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60"
                }`}
              >
                {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}

                {m.data && (
                  <div className="space-y-3">
                    <p className="whitespace-pre-wrap leading-relaxed">{m.data.answer}</p>

                    {/* Key Metrics Cards */}
                    {m.data.keyMetrics && m.data.keyMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-3">
                        {m.data.keyMetrics.map((k, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-sm"
                          >
                            <div className="text-xs text-slate-500 font-medium">{k.label}</div>
                            <div className="text-sm font-bold text-slate-800 mt-0.5">{k.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {m.data.recommendations && m.data.recommendations.length > 0 && (
                      <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <TrendingUp className="h-3.5 w-3.5" /> Recommendations
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-emerald-900">
                          {m.data.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] ${
                    m.sender === "user" ? "text-brand-200 text-right" : "text-slate-400"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <UserIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500 flex items-center gap-2 border border-slate-200">
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                Analyzing verified metrics...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            className="input flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your website analytics..."
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Ask
          </button>
        </form>
      </Card>
    </div>
  );
}
