import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

interface JobDetailDialogProps {
  jobId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const STAGES = ["Received", "Diagnosing", "Repairing", "Quality Check", "Ready for Pickup"] as const;

export default function JobDetailDialog({ jobId, open, onOpenChange, onSuccess }: JobDetailDialogProps) {
  const { data: job, isLoading } = trpc.repairs.getById.useQuery({ id: jobId }, { enabled: open });
  const { data: stages } = trpc.repairs.getStages.useQuery({ jobId }, { enabled: open && !!job });
  const { data: feedback } = trpc.feedback.getByJobId.useQuery({ jobId }, { enabled: open && !!job });

  const [newStage, setNewStage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const updateStageMutation = trpc.repairs.updateStage.useMutation({
    onSuccess: () => {
      toast.success("Stage updated successfully");
      setNewStage(null);
      setNotes("");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update stage");
    },
  });

  const handleUpdateStage = async () => {
    if (!newStage) {
      toast.error("Please select a stage");
      return;
    }

    await updateStageMutation.mutateAsync({
      jobId,
      newStage: newStage as any,
      notes: notes || undefined,
    });
  };

  if (isLoading || !job) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card-lg max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card-lg max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Repair Job Details</DialogTitle>
          <DialogDescription>
            Tracking Code:{" "}
            <span className="font-mono text-accent cursor-pointer hover:underline" onClick={() => {
              navigator.clipboard.writeText(job.trackingCode);
              toast.success("Copied to clipboard");
            }}>
              {job.trackingCode}
              <Copy className="w-3 h-3 inline ml-1" />
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-foreground/60">Name:</span>
                <p className="font-medium">{job.customerName}</p>
              </div>
              <div>
                <span className="text-foreground/60">Email:</span>
                <p className="font-medium">{job.customerEmail || "N/A"}</p>
              </div>
              <div>
                <span className="text-foreground/60">Phone:</span>
                <p className="font-medium">{job.customerPhone || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-foreground/60">Device Type:</span>
                <p className="font-medium">{job.deviceType}</p>
              </div>
              <div>
                <span className="text-foreground/60">Issue:</span>
                <p className="font-medium">{job.issueDescription}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-foreground/60">Estimated Cost:</span>
                  <p className="font-medium">${job.costEstimate || "TBD"}</p>
                </div>
                <div>
                  <span className="text-foreground/60">Warranty:</span>
                  <p className="font-medium">{job.warranty || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Stage */}
          <Card className="glass-card border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">Update Stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stage">Current Stage: {job.currentStage}</Label>
                <Select value={newStage || ""} onValueChange={setNewStage}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select new stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Technician Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this stage..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 min-h-20"
                />
              </div>

              <Button
                onClick={handleUpdateStage}
                disabled={!newStage || updateStageMutation.isPending}
                className="w-full gap-2"
              >
                {updateStageMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Stage"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stage History */}
          {stages && stages.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Stage History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stages.map((stage) => (
                  <div key={stage.id} className="p-3 bg-foreground/5 rounded-lg border border-foreground/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{stage.stage}</p>
                        <p className="text-xs text-foreground/50">
                          Started: {new Date(stage.startedAt).toLocaleString()}
                        </p>
                      </div>
                      {stage.completedAt && (
                        <p className="text-xs text-green-300">
                          Completed: {new Date(stage.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    {stage.technicianNotes && (
                      <p className="text-sm text-foreground/70 mt-2 italic">{stage.technicianNotes}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Feedback */}
          {feedback && (
            <Card className="glass-card border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-green-300">Customer Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-foreground/60">Overall Rating:</span>
                  <p className="font-medium">
                    {feedback.rating}/5 {"★".repeat(feedback.rating)}
                  </p>
                </div>
                {feedback.comment && (
                  <div>
                    <span className="text-foreground/60">Comment:</span>
                    <p className="font-medium italic">{feedback.comment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
