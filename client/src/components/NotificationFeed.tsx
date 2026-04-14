import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, Trash2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface NotificationFeedProps {
  jobId: number;
}

export default function NotificationFeed({ jobId }: NotificationFeedProps) {
  const { data: notifications, isLoading, refetch } = trpc.notifications.getByJobId.useQuery(
    { jobId },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  const deleteNotificationMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      toast.success("Notification dismissed");
      refetch();
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "status_change":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "delay_alert":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "feedback_request":
        return <Bell className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-accent" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "status_change":
        return "bg-green-500/10 border-green-500/30";
      case "delay_alert":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "feedback_request":
        return "bg-blue-500/10 border-blue-500/30";
      default:
        return "bg-accent/10 border-accent/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6 flex items-center justify-center h-32">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
        </CardContent>
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6 text-center text-foreground/50">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No notifications yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-accent" />
          Notifications
        </CardTitle>
        <CardDescription>Recent updates about your repair</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-all ${getNotificationColor(notification.type)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm">{notification.subject}</h4>
                  <p className="text-xs text-foreground/70 mt-1">{notification.message}</p>
                  <p className="text-xs text-foreground/50 mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  deleteNotificationMutation.mutate({
                    notificationId: notification.id,
                  })
                }
                disabled={deleteNotificationMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
