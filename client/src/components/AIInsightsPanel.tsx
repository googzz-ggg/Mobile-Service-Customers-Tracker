import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, TrendingUp, AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";

export default function AIInsightsPanel() {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: insights, refetch: refetchInsights } = trpc.analytics.getLatestInsights.useQuery();

  const generateInsightsMutation = trpc.analytics.generateInsights.useMutation({
    onSuccess: () => {
      toast.success("AI insights generated successfully!");
      refetchInsights();
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to generate insights");
      setIsGenerating(false);
    },
  });

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      await generateInsightsMutation.mutateAsync(undefined);
    } catch (error) {
      // Error is handled in onError
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass-card-lg border-accent/30 bg-gradient-to-r from-accent/10 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Get intelligent analysis of your repair operations and performance trends
              </CardDescription>
            </div>
            <Button
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Insights Display */}
      {insights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Repair Trends */}
          <Card className="glass-card-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Repair Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {insights.repairTrends || "No data available"}
              </p>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Card className="glass-card-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Common Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {insights.commonIssues || "No data available"}
              </p>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="glass-card-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-400" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {insights.technicianPerformance || "No data available"}
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="glass-card-lg border-green-500/30 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-lg text-green-300">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {insights.summaryText || "No recommendations available"}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="glass-card-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Zap className="w-12 h-12 text-accent/30 mb-4" />
            <p className="text-foreground/60 mb-4">
              No insights generated yet. Click "Generate Insights" to analyze your repair data.
            </p>
            <Button onClick={handleGenerateInsights} className="gap-2">
              <Zap className="w-4 h-4" />
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground/60">
            💡 <strong>Tip:</strong> AI insights are generated based on your current repair jobs, feedback, and
            performance metrics. Generate insights regularly to track trends and identify areas for improvement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
