"use client";

import * as React from "react";
import { AnimatePresence, m } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { aiAssistant, CAPABILITY_LABELS, type AICapability } from "@/lib/services/aiService";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "@/lib/utils/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const CAPABILITIES = Object.keys(CAPABILITY_LABELS) as AICapability[];

export function AIAssistantPanel() {
  const [capability, setCapability] = React.useState<AICapability>("business_assistant");
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [sending, setSending] = React.useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    const response = await aiAssistant.complete({ capability, prompt: userMessage.content });

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: response.content }]);
    setSending(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem,1fr]">
      <Card className="h-fit">
        <CardContent className="space-y-1 pt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Capabilities
          </p>
          {CAPABILITIES.map((cap) => (
            <button
              key={cap}
              onClick={() => setCapability(cap)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                capability === cap ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              {CAPABILITY_LABELS[cap]}
              {!aiAssistant.isAvailable(cap) && (
                <Badge variant="default" className="ml-2 shrink-0">
                  Soon
                </Badge>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardContent className="flex flex-1 flex-col gap-4 pt-6">
          <div className="flex min-h-[20rem] flex-1 flex-col gap-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ask {CAPABILITY_LABELS[capability]} anything to get started.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <m.div
                    key={message.id}
                    className={cn(
                      "max-w-[85%] rounded-lg px-4 py-2.5 text-sm",
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  >
                    {message.content}
                  </m.div>
                ))}
              </AnimatePresence>
            )}
            <AnimatePresence>{sending && <TypingIndicator />}</AnimatePresence>
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder={`Message ${CAPABILITY_LABELS[capability]}…`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message the AI assistant"
            />
            <Button type="submit" size="icon" loading={sending} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
