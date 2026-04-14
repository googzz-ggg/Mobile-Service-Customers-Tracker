import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import type { Message } from "@/types/repair";

interface MessagingInterfaceProps {
  jobId: number;
  trackingCode: string;
}

export default function MessagingInterface({ jobId, trackingCode }: MessagingInterfaceProps) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: fetchedMessages, isLoading } = trpc.messages.getByJobId.useQuery({
    jobId,
    trackingCode,
    limit: 50,
  });

  const sendMessageMutation = trpc.messages.send.useMutation({
    onSuccess: () => {
      setMessageText("");
      // Refetch messages
      trpc.useUtils().messages.getByJobId.invalidate({ jobId, trackingCode });
    },
  });

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [fetchedMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    await sendMessageMutation.mutateAsync({
      jobId,
      trackingCode,
      content: messageText,
      senderType: "customer",
    });
  };

  return (
    <Card className="glass-card-lg">
      <CardHeader>
        <CardTitle>Message Technician</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-96">
        {/* Messages Area */}
        <ScrollArea className="flex-1 mb-4 pr-4 border border-border/50 rounded-lg bg-background/50 p-4">
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-foreground/50 py-8">
                <p className="text-sm">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderType === "customer"
                        ? "bg-accent/20 text-accent-foreground border border-accent/30"
                        : "bg-foreground/10 text-foreground border border-foreground/20"
                    }`}
                  >
                    <p className="text-xs font-medium text-foreground/60 mb-1">
                      {msg.senderType === "customer" ? "You" : "Technician"}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-foreground/40 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="gap-2"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
