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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateJobDialog({ open, onOpenChange, onSuccess }: CreateJobDialogProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deviceType: "",
    issueDescription: "",
    costEstimate: "",
  });

  const createJobMutation = trpc.repairs.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Repair job created! Tracking code: ${data.trackingCode}`);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        deviceType: "",
        issueDescription: "",
        costEstimate: "",
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create repair job");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.deviceType || !formData.issueDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createJobMutation.mutateAsync({
      customerName: formData.customerName,
      customerEmail: formData.customerEmail || undefined,
      customerPhone: formData.customerPhone || undefined,
      deviceType: formData.deviceType,
      issueDescription: formData.issueDescription,
      costEstimate: formData.costEstimate || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card-lg max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Repair Job</DialogTitle>
          <DialogDescription>Enter the customer and device information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              placeholder="John Doe"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="john@example.com"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              placeholder="+1 (555) 000-0000"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="deviceType">Device Type *</Label>
            <Input
              id="deviceType"
              placeholder="Samsung Galaxy S24"
              value={formData.deviceType}
              onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="issueDescription">Issue Description *</Label>
            <Textarea
              id="issueDescription"
              placeholder="Describe the issue with the device..."
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              required
              className="min-h-24"
            />
          </div>

          <div>
            <Label htmlFor="costEstimate">Estimated Cost</Label>
            <Input
              id="costEstimate"
              placeholder="99.99"
              value={formData.costEstimate}
              onChange={(e) => setFormData({ ...formData, costEstimate: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              className="flex-1 gap-2"
            >
              {createJobMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Job"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
