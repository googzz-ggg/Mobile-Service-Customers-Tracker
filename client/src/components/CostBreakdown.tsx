import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

interface CostBreakdownProps {
  estimatedCost?: string | null;
  finalCost?: string | null;
  status: string;
}

export default function CostBreakdown({ estimatedCost, finalCost, status }: CostBreakdownProps) {
  const isCompleted = status === "Ready for Pickup";

  return (
    <Card className="glass-card-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Cost Estimate
        </CardTitle>
        <CardDescription>Repair pricing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
            <span className="text-sm text-foreground/70">Estimated Cost</span>
            <span className="text-lg font-semibold text-accent">
              {estimatedCost ? `$${estimatedCost}` : "TBD"}
            </span>
          </div>

          {isCompleted && finalCost && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="text-sm text-green-300">Final Cost</span>
              <span className="text-lg font-semibold text-green-300">${finalCost}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-foreground/10">
          <p className="text-xs text-foreground/50">
            💡 <strong>Note:</strong> The final cost may vary based on the complexity of the repair and any additional
            issues discovered during the service.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
