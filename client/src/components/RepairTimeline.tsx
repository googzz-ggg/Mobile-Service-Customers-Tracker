import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { RepairStage } from "@/types/repair";

const STAGES = ["Received", "Diagnosing", "Repairing", "Quality Check", "Ready for Pickup"] as const;

const STAGE_ICONS: Record<string, React.ReactNode> = {
  Received: <CheckCircle2 className="w-5 h-5" />,
  Diagnosing: <Clock className="w-5 h-5" />,
  Repairing: <AlertCircle className="w-5 h-5" />,
  "Quality Check": <CheckCircle2 className="w-5 h-5" />,
  "Ready for Pickup": <CheckCircle2 className="w-5 h-5" />,
};

const STAGE_COLORS: Record<string, string> = {
  Received: "from-blue-500 to-blue-600",
  Diagnosing: "from-yellow-500 to-yellow-600",
  Repairing: "from-purple-500 to-purple-600",
  "Quality Check": "from-cyan-500 to-cyan-600",
  "Ready for Pickup": "from-green-500 to-green-600",
};

interface RepairTimelineProps {
  stages: RepairStage[];
  currentStage: string;
}

export default function RepairTimeline({ stages, currentStage }: RepairTimelineProps) {
  const getStageIndex = (stage: string) => STAGES.indexOf(stage as any);
  const currentIndex = getStageIndex(currentStage);

  return (
    <Card className="glass-card-lg">
      <CardHeader>
        <CardTitle>Repair Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visual Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-2.5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 to-accent/10" />

            {/* Timeline Items */}
            <div className="space-y-6">
              {STAGES.map((stage, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const stageData = stages.find((s) => s.stage === stage);

                return (
                  <div key={stage} className="relative pl-10">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500/20 border-green-500/50"
                          : isCurrent
                            ? "bg-accent/20 border-accent animate-pulse-glow"
                            : "bg-foreground/5 border-foreground/20"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isCompleted ? "bg-green-400" : isCurrent ? "bg-accent" : "bg-foreground/30"
                        }`}
                      />
                    </div>

                    {/* Stage Card */}
                    <div
                      className={`glass-card p-4 transition-all duration-300 ${
                        isCurrent ? "border-accent/50 bg-accent/5" : isCompleted ? "border-green-500/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <span
                              className={`w-5 h-5 ${
                                isCompleted
                                  ? "text-green-400"
                                  : isCurrent
                                    ? "text-accent"
                                    : "text-foreground/40"
                              }`}
                            >
                              {STAGE_ICONS[stage]}
                            </span>
                            {stage}
                          </h4>
                          {stageData && (
                            <p className="text-xs text-foreground/50 mt-1">
                              Started: {new Date(stageData.startedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isCompleted
                              ? "bg-green-500/20 text-green-300"
                              : isCurrent
                                ? "bg-accent/20 text-accent"
                                : "bg-foreground/10 text-foreground/50"
                          }`}
                        >
                          {isCompleted ? "✓ Done" : isCurrent ? "In Progress" : "Pending"}
                        </span>
                      </div>

                      {/* Technician Notes */}
                      {stageData?.technicianNotes && (
                        <div className="mt-3 pt-3 border-t border-foreground/10">
                          <p className="text-xs text-foreground/60 font-medium mb-1">Technician Notes:</p>
                          <p className="text-sm text-foreground/70 italic">{stageData.technicianNotes}</p>
                        </div>
                      )}

                      {/* Completion Time */}
                      {stageData?.completedAt && (
                        <div className="mt-2 text-xs text-green-300/70">
                          Completed: {new Date(stageData.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
