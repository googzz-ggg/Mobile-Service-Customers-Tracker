import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface FeedbackFormProps {
  jobId: number;
  trackingCode: string;
}

export default function FeedbackForm({ jobId, trackingCode }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [serviceSpeedRating, setServiceSpeedRating] = useState(0);
  const [staffBehaviorRating, setStaffBehaviorRating] = useState(0);
  const [repairQualityRating, setRepairQualityRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const submitFeedbackMutation = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      setRating(0);
      setServiceSpeedRating(0);
      setStaffBehaviorRating(0);
      setRepairQualityRating(0);
      setComment("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    await submitFeedbackMutation.mutateAsync({
      jobId,
      trackingCode,
      rating,
      serviceSpeedRating: serviceSpeedRating || undefined,
      staffBehaviorRating: staffBehaviorRating || undefined,
      repairQualityRating: repairQualityRating || undefined,
      comment: comment || undefined,
    });
  };

  const StarRating = ({
    value,
    onChange,
    onHover,
  }: {
    value: number;
    onChange: (val: number) => void;
    onHover: (val: number) => void;
  }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={() => onHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hoveredRating || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Card className="glass-card-lg border-green-500/30 bg-green-500/5">
      <CardHeader>
        <CardTitle className="text-green-300">Share Your Feedback</CardTitle>
        <CardDescription>Help us improve our service by sharing your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Overall Rating *
          </label>
          <StarRating
            value={rating}
            onChange={setRating}
            onHover={setHoveredRating}
          />
          {rating > 0 && (
            <p className="text-xs text-foreground/60 mt-2">
              {rating === 5 && "Excellent! We're thrilled!"}
              {rating === 4 && "Great! Thank you for the positive feedback."}
              {rating === 3 && "Good. We appreciate your feedback."}
              {rating === 2 && "We're sorry to hear that. We'll improve."}
              {rating === 1 && "We apologize. Please tell us how we can improve."}
            </p>
          )}
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-foreground/5 rounded-lg border border-foreground/10">
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-2">
              Service Speed
            </label>
            <StarRating
              value={serviceSpeedRating}
              onChange={setServiceSpeedRating}
              onHover={() => {}}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-2">
              Staff Behavior
            </label>
            <StarRating
              value={staffBehaviorRating}
              onChange={setStaffBehaviorRating}
              onHover={() => {}}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-2">
              Repair Quality
            </label>
            <StarRating
              value={repairQualityRating}
              onChange={setRepairQualityRating}
              onHover={() => {}}
            />
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Additional Comments
          </label>
          <Textarea
            placeholder="Tell us more about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-24 resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={submitFeedbackMutation.isPending || rating === 0}
          className="w-full gap-2"
        >
          {submitFeedbackMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>

        <p className="text-xs text-foreground/50 text-center">
          Your feedback helps us serve you better. Thank you!
        </p>
      </CardContent>
    </Card>
  );
}
