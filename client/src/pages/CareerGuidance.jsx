import { useEffect, useRef, useState } from "react";
import { AlertCircle, Bot, BriefcaseBusiness, RotateCcw, Send, UserRound } from "lucide-react";
import { sendCareerChat } from "../api/chatbotApi";

const STARTER_PROMPTS = [
  "How can I prepare for a software engineering interview?",
  "What skills should I build for an AI career?",
  "Can you help me improve my resume?",
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hi! I can help you explore career options, build skills, prepare for interviews, improve your resume, or plan your job search. What are you working toward?",
};

function formatError(error) {
  if (error?.response?.status === 429) {
    const wait = error.response.data?.retryAfterSeconds;
    return wait ? `You’ve reached the chat limit. Please try again in about ${wait} seconds.` : "You’ve reached the chat limit. Please try again in a moment.";
  }
  return error?.response?.data?.message || "I couldn’t get a reply right now. Please try again shortly.";
}

export default function CareerGuidance() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const sendMessage = async (text = input) => {
    const content = text.trim();
    if (!content || sending) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setSending(true);

    try {
      const reply = await sendCareerChat(nextMessages.slice(-8));
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (requestError) {
      setError(formatError(requestError));
    } finally {
      setSending(false);
    }
  };

  const resetChat = () => {
    if (sending) return;
    setMessages([INITIAL_MESSAGE]);
    setError("");
    setInput("");
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <section className="overflow-hidden rounded-2xl border border-[#c6c6cd]/40 bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#c6c6cd]/30 bg-gradient-to-r from-[#eff4ff] to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0051d5] text-white shadow-sm">
              <BriefcaseBusiness size={23} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0051d5]">Alumni Connect</p>
              <h1 className="text-xl font-bold tracking-tight text-[#0b1c30]">Career guidance</h1>
              <p className="mt-0.5 text-sm text-[#45464d]">A helpful starting point for your next career step</p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetChat}
            disabled={sending || messages.length === 1}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#c6c6cd]/50 px-3 py-2 text-sm font-medium text-[#45464d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
          >
            <RotateCcw size={15} /> New conversation
          </button>
        </header>

        <div className="min-h-[380px] space-y-5 px-4 py-6 sm:min-h-[440px] sm:px-7" aria-live="polite" aria-label="Career guidance conversation">
          {messages.map((message, index) => (
            <div key={`${index}-${message.role}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff] text-[#0051d5]">
                  <Bot size={18} />
                </span>
              )}
              <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${message.role === "user" ? "rounded-br-md bg-[#0051d5] text-white" : "rounded-bl-md border border-[#c6c6cd]/30 bg-[#f8f9ff] text-[#0b1c30]"}`}>
                {message.content}
              </div>
              {message.role === "user" && (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#131b2e] text-white">
                  <UserRound size={17} />
                </span>
              )}
            </div>
          ))}

          {sending && (
            <div className="flex items-center gap-3 text-sm text-[#45464d]" role="status">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff4ff] text-[#0051d5]"><Bot size={18} /></span>
              Thinking through your career question…
            </div>
          )}

          {messages.length === 1 && (
            <div className="ml-11 flex flex-wrap gap-2 pt-1">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={sending}
                  className="rounded-full border border-[#c6c6cd]/50 bg-white px-3 py-2 text-left text-xs font-medium text-[#0051d5] transition hover:border-[#0051d5]/40 hover:bg-[#eff4ff] disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[#c6c6cd]/30 bg-white px-4 py-4 sm:px-7">
          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-[#ba1a1a]/20 bg-[#ffdad6]/30 px-3 py-2 text-sm text-[#8c1d18]" role="alert">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <label className="sr-only" htmlFor="career-message">Your career question</label>
            <textarea
              id="career-message"
              rows={2}
              maxLength={1200}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about career options, skills, resumes, interviews…"
              className="min-h-[48px] flex-1 resize-y rounded-xl border border-[#c6c6cd]/60 bg-[#f8f9ff] px-4 py-3 text-sm leading-5 text-[#0b1c30] outline-none transition placeholder:text-[#747780] focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/10"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send career question"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0051d5] text-white transition hover:bg-[#003eaa] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="mt-3 text-center text-xs leading-5 text-[#747780]">
            Career guidance only. Replies are AI-generated and may be inaccurate; verify important details. Don’t share passwords or financial credentials. Alumni Connect doesn’t store this chat; messages are processed by Hugging Face inference.
          </p>
        </div>
      </section>
    </div>
  );
}
