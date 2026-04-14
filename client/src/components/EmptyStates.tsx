import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Package, Bell, BarChart3, Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Card className="glass-card-lg">
      <CardContent className="py-12 text-center">
        <div className="flex justify-center mb-4">
          {icon || <Inbox className="w-12 h-12 text-foreground/30" />}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-foreground/60">{description}</p>
      </CardContent>
    </Card>
  );
}

export function NoMessagesEmpty() {
  return (
    <EmptyState
      title="No messages yet"
      description="Start a conversation with our technicians to get updates about your repair"
      icon={<MessageSquare className="w-12 h-12 text-foreground/30" />}
    />
  );
}

export function NoJobsEmpty() {
  return (
    <EmptyState
      title="No repair jobs"
      description="Create a new repair job to get started"
      icon={<Package className="w-12 h-12 text-foreground/30" />}
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      title="No notifications"
      description="You'll receive notifications when your repair status changes"
      icon={<Bell className="w-12 h-12 text-foreground/30" />}
    />
  );
}

export function NoAnalyticsEmpty() {
  return (
    <EmptyState
      title="No data available"
      description="Analytics will be available once you have completed repairs"
      icon={<BarChart3 className="w-12 h-12 text-foreground/30" />}
    />
  );
}
